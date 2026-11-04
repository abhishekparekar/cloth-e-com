import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/common/Button";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all mandatory fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const res = await register(name, email, password, phone);
    if (res.success) {
      toast.success("Welcome to Aanya Boutique! 🌸 Your customer account is ready.");
      navigate("/");
    } else {
      toast.error(res.error || "Registration failed");
    }
  };

  return (
    <div className="py-14 sm:py-24 max-w-md mx-auto px-4 font-sans">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-primary-light/60 shadow-card space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            New Customer
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-plum tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-mauve">
            Join our boutique family for 10% off your first couture order, order tracking, and express checkout.
          </p>
        </div>

        {/* Customer Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-plum block mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary text-plum"
              />
              <User className="w-4 h-4 text-mauve absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-plum block mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary text-plum"
              />
              <Mail className="w-4 h-4 text-mauve absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-plum block mb-1.5">
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary text-plum"
              />
              <Phone className="w-4 h-4 text-mauve absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-plum block mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary text-plum"
              />
              <Lock className="w-4 h-4 text-mauve absolute left-3.5 top-3" />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-2 font-semibold shadow-md"
            loading={loading}
            type="submit"
          >
            <span>Create Customer Account</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-xs text-mauve pt-2">
          Already registered?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
