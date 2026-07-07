import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset Password — CompetiLens AI" }],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] text-[#0F172A] font-sans relative overflow-hidden">
      {/* Blurred background radial lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#2563EB]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#06B6D4]/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[460px] space-y-8 relative z-10">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-sm text-[#0F172A]">CompetiLens</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 uppercase font-bold tracking-wider">
              AI
            </span>
          </Link>
        </div>

        {/* Form Card (Glassmorphic look on light background) */}
        <div className="p-6.5 sm:p-8 rounded-[28px] border border-white/50 bg-white/70 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Forgot Password</h1>
                  <p className="text-xs.5 text-[#64748B] leading-relaxed max-w-xs mx-auto">
                    Enter your work email address and we'll transmit a secure recovery link.
                  </p>
                </div>

                {/* Animated Lock Illustration */}
                <div className="flex justify-center py-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/5 border border-[#2563EB]/15 flex items-center justify-center text-[#2563EB] relative">
                    <HelpCircle className="w-8 h-8 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#64748B] block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11.5 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:opacity-95 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Reset Link <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-center space-y-6 py-4"
              >
                {/* Verification Checkmark */}
                <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto text-success">
                  <ShieldCheck className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Link Transmitted</h2>
                  <p className="text-xs.5 text-[#64748B] max-w-sm mx-auto leading-relaxed">
                    Check your inbox at <span className="font-bold text-[#0F172A]">{email}</span>. Click the link inside to set up a new password.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-1.5 h-11 px-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:opacity-95 transition"
                  >
                    Return to Login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
