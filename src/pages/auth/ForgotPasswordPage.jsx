import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setSubmitted(true);
    toast.success("Password reset instructions sent to your email!");
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4">
      <div className="bg-white rounded-3xl p-8 border border-primary-light/50 shadow-card space-y-6">
        <Link to="/login" className="inline-flex items-center text-xs text-mauve hover:text-primary">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Login
        </Link>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-plum">
            Reset Password
          </h1>
          <p className="text-xs text-mauve">
            Enter your registered email address and we will send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Check your Inbox
            </div>
            <p>
              We've dispatched a password reset link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-mauve block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                />
                <Mail className="w-4 h-4 text-mauve absolute left-3.5 top-3" />
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" type="submit">
              Send Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

