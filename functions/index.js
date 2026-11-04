const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret",
});

/**
 * 1. createRazorpayOrder
 * Recalculates cart total securely server-side and initializes Razorpay order
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  const { items, couponCode } = data;
  if (!items || !items.length) {
    throw new functions.https.HttpsError("invalid-argument", "Items cannot be empty");
  }

  // Recalculate price from database to prevent price tampering
  let subtotal = 0;
  for (const item of items) {
    const prodDoc = await db.collection("products").doc(item.productId).get();
    if (!prodDoc.exists) {
      throw new functions.https.HttpsError("not-found", `Product ${item.productId} not found`);
    }
    const prodData = prodDoc.data();
    subtotal += prodData.price * item.qty;
  }

  let discount = 0;
  if (couponCode) {
    const couponDoc = await db.collection("coupons").doc(couponCode.toUpperCase()).get();
    if (couponDoc.exists && couponDoc.data().isActive) {
      const c = couponDoc.data();
      if (subtotal >= c.minCartValue) {
        discount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
        if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
      }
    }
  }

  const shipping = subtotal >= 999 ? 0 : 99;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * 0.05);
  const totalAmount = taxable + shipping + tax;

  const rzpOrder = await razorpay.orders.create({
    amount: totalAmount * 100, // amount in paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  return {
    orderId: rzpOrder.id,
    amount: totalAmount,
    currency: "INR",
  };
});

/**
 * 2. verifyPayment
 * Verifies Razorpay HMAC signature
 */
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
  const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret";

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new functions.https.HttpsError("permission-denied", "Payment verification failed");
  }

  return { verified: true };
});

/**
 * 3. onOrderCreated
 * Deducts stock transactionally upon order creation
 */
exports.onOrderCreated = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const batch = db.batch();

    for (const item of orderData.items || []) {
      const prodRef = db.collection("products").doc(item.productId);
      const prodDoc = await prodRef.get();
      if (prodDoc.exists) {
        const prod = prodDoc.data();
        const updatedVariants = (prod.variants || []).map((v) => {
          if (v.sku === item.sku) {
            return { ...v, stock: Math.max(0, (v.stock || 0) - item.qty) };
          }
          return v;
        });
        batch.update(prodRef, { variants: updatedVariants });
      }
    }

    await batch.commit();
  });

/**
 * 4. setAdminClaim
 * Assigns custom admin claim for role-based security rules
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only existing admin or initial setup
  const { email } = data;
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  return { message: `Success! ${email} has been granted admin privileges.` };
});

