import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowRight, RefreshCw, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../components/AuthContext";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [{ title: "Verify Email — CompetiLens AI" }],
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const { verifyEmail } = useAuth();
  
  // States for verification execution
  const [token, setToken] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // States for resending verification mail (when no token is present)
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [timer, setTimer] = useState(0);

  // 1. Read token from URL search query on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
    }
  }, []);

  // 2. Execute verification if token is present
  useEffect(() => {
    if (!token) return;

    const performVerification = async () => {
      setVerifying(true);
      setError("");
      try {
        await verifyEmail(token);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || "Email verification failed. The link may have expired or is invalid.");
      } finally {
        setVerifying(false);
      }
    };

    performVerification();
  }, [token]);

  // 3. Countdown timer for Resend button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    if (timer > 0) return;
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResent(true);
      setTimer(30); // 30-second cooldown
      setTimeout(() => setResent(false), 3000);
    }, 1500);
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

        {/* Card Panel */}
        <div className="p-6.5 sm:p-8 rounded-[28px] border border-white/50 bg-white/70 backdrop-blur-xl shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          {verifying && (
            <div className="space-y-6 py-6">
              <RefreshCw className="w-10 h-10 text-[#2563EB] animate-spin mx-auto" />
              <div className="space-y-2">
                <h1 className="text-xl font-extrabold text-[#0F172A]">Verifying your email</h1>
                <p className="text-xs.5 text-[#64748B]">Please hold on while we secure your account details...</p>
              </div>
            </div>
          )}

          {!verifying && success && (
            <div className="space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#10B981]/15 to-[#06B6D4]/15 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] shadow-sm"
                >
                  <ShieldCheck className="w-10 h-10 text-[#10B981]" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Verification Successful!</h1>
                <p className="text-xs.5 text-[#64748B] leading-relaxed max-w-sm mx-auto">
                  Your CompetiLens account has been successfully verified. You can now log into your portal dashboard.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/signin"
                  className="w-full h-11.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:opacity-95 hover:-translate-y-0.5 transition duration-200 cursor-pointer"
                >
                  Go to Login <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
            </div>
          )}

          {!verifying && error && (
            <div className="space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="absolute inset-0 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 shadow-sm"
                >
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Verification Failed</h1>
                <p className="text-xs.5 text-red-600 leading-relaxed max-w-sm mx-auto font-medium">
                  {error}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/signin"
                  className="w-full h-11.5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-800 text-xs.5 font-bold shadow-sm transition"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {!token && !verifying && !success && !error && (
            <div className="space-y-6">
              {/* Animated Illustration */}
              <div className="relative w-20 h-20 mx-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#2563EB]/10 to-[#06B6D4]/10 border border-[#2563EB]/15 flex items-center justify-center text-[#2563EB] shadow-sm"
                >
                  <Mail className="w-9 h-9 text-[#2563EB] animate-pulse" />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 350 }}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#10B981] text-white border-2 border-white flex items-center justify-center shadow"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Verify your Email</h1>
                <p className="text-xs.5 text-[#64748B] leading-relaxed max-w-sm mx-auto">
                  We've dispatched a secure activation link to your mailbox. Please select the link to provision your workspace.
                </p>
              </div>

              {/* Verification Actions */}
              <div className="space-y-3 pt-2">
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:opacity-95 hover:-translate-y-0.5 transition duration-200 cursor-pointer"
                >
                  Open Inbox <ArrowRight className="w-4.5 h-4.5" />
                </a>
              </div>

              {/* Timer and active resend link */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleResend}
                  disabled={resending || timer > 0}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition disabled:opacity-60 cursor-pointer"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Transmission pending...
                    </>
                  ) : resent ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-success" /> Transmitted!
                    </>
                  ) : timer > 0 ? (
                    <span>Resend available in {timer}s</span>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" /> Resend verification mail
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
