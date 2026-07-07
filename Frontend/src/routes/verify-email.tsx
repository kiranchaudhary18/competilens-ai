import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowRight, RefreshCw, Check, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [{ title: "Verify Email — CompetiLens AI" }],
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [timer, setTimer] = useState(0);

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
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-success text-white border-2 border-white flex items-center justify-center shadow"
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
            
            <Link
              to="/onboarding"
              className="w-full h-11.5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-800 text-xs.5 font-bold shadow-sm transition"
            >
              Continue to Onboarding
            </Link>
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

      </div>
    </div>
  );
}
