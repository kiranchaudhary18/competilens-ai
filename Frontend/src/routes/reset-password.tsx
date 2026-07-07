import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Lock, Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — CompetiLens AI" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Strength checks
  const hasMinLen = password.length >= 8;
  const hasNum = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSym = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [hasMinLen, hasNum, hasUpper, hasSym].filter(Boolean).length;
  const strengthPercent = (strengthCount / 4) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please choose a password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strengthCount < 3) {
      setError("Password strength is too weak.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] text-[#0F172A] font-sans relative overflow-hidden">
      {/* Background radial lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#2563EB]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#06B6D4]/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[460px] space-y-8 relative z-10">
        
        {/* Header brand logo */}
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

        {/* Card Panel */}
        <div className="p-6.5 sm:p-8 rounded-[28px] border border-white/50 bg-white/70 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Configure Password</h1>
                  <p className="text-xs.5 text-[#64748B] leading-relaxed max-w-xs mx-auto">
                    Please key in a new secure credentials credentials to restore access.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#64748B] block">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11.5 pl-10 pr-10 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748B] transition cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#64748B] block">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-11.5 pl-10 pr-3 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition"
                      />
                    </div>
                  </div>

                  {/* Password Checklist & Strength bar */}
                  {password && (
                    <div className="space-y-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="font-bold text-[#64748B]">Strength:</span>
                        <span className={`font-bold ${strengthCount >= 3 ? "text-success" : "text-warning"}`}>
                          {strengthCount === 4 ? "Very strong" : strengthCount >= 3 ? "Strong" : "Weak"}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strengthCount === 4 ? "bg-success" : strengthCount >= 3 ? "bg-primary" : "bg-warning"
                          }`}
                          style={{ width: `${strengthPercent}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                        <div className="flex items-center gap-1.5">
                          {hasMinLen ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-[#64748B]" />}
                          <span>8+ Characters</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasNum ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-[#64748B]" />}
                          <span>1+ Number</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasUpper ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-[#64748B]" />}
                          <span>1+ Uppercase</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasSym ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-[#64748B]" />}
                          <span>1+ Symbol</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:opacity-95 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="reset-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-center space-y-6 py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto text-success">
                  <ShieldCheck className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Password Restored</h2>
                  <p className="text-xs.5 text-[#64748B] max-w-sm mx-auto leading-relaxed">
                    Your password has been successfully configured. You may now log in.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-1.5 h-11 px-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:opacity-95 transition"
                  >
                    Continue to Login
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
