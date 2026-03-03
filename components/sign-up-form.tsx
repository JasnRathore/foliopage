"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKey, SignIn, UserPlus } from "@phosphor-icons/react";
import { resetPassword, signIn, signUp } from "@/lib/site-api";

type AuthMode = "sign_up" | "sign_in" | "reset";
const SESSION_TOKEN_KEY = "foliopage_token";

export function SignUpForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign_up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      if (mode === "sign_up") {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const response = await signUp(email, password);
        localStorage.setItem(SESSION_TOKEN_KEY, response.token);
        router.push("/dashboard");
        return;
      }
      if (mode === "sign_in") {
        const response = await signIn(email, password);
        localStorage.setItem(SESSION_TOKEN_KEY, response.token);
        router.push("/dashboard");
        return;
      }
      await resetPassword(email, nextPassword);
      setMessage("Password updated. Sign in with your new password.");
      setMode("sign_in");
      setPassword(nextPassword);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const tabs: { id: AuthMode; label: string }[] = [
    { id: "sign_up", label: "Create account" },
    { id: "sign_in", label: "Sign in" },
    { id: "reset", label: "Reset" },
  ];

  const inputClass =
    "w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#e8320a] focus:placeholder-white/10";

  const labelClass = "block text-[9px] font-black uppercase tracking-[0.25em] text-white/25 mb-1";

  return (
    <div className="w-full">
      {/* Form header */}
      <div className="mb-8 sm:mb-10">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">Step 01 of 02</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
          {mode === "sign_up" && "Create your account"}
          {mode === "sign_in" && "Welcome back"}
          {mode === "reset" && "Reset password"}
        </h2>
      </div>

      {/* Mode switcher */}
      <div className="mb-7 flex gap-4 border-b border-white/8 pb-0 sm:gap-6 sm:mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`relative pb-3 text-[10px] font-black uppercase tracking-widest transition-colors ${mode === tab.id ? "text-white" : "text-white/25 hover:text-white/50"
              }`}
          >
            {tab.label}
            {mode === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8320a]" />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-6 sm:space-y-7">
        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className={inputClass}
          />
        </label>

        {mode !== "reset" && (
          <label className="block">
            <span className={labelClass}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>
        )}

        {mode === "sign_up" && (
          <label className="block">
            <span className={labelClass}>Confirm password</span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </label>
        )}

        {mode === "reset" && (
          <label className="block">
            <span className={labelClass}>New password</span>
            <input
              type="password"
              required
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
              className={inputClass}
            />
          </label>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-between border border-[#e8320a] bg-[#e8320a] px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-[#e8320a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              {mode === "sign_up" && <><UserPlus size={13} weight="bold" /> Create account</>}
              {mode === "sign_in" && <><SignIn size={13} weight="bold" /> Sign in</>}
              {mode === "reset" && <><LockKey size={13} weight="bold" /> Reset password</>}
            </span>
            <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-5 border-l-2 border-red-500 pl-4 text-xs font-semibold text-red-400 sm:mt-6">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-5 border-l-2 border-emerald-500 pl-4 text-xs font-semibold text-emerald-400 sm:mt-6">
          {message}
        </div>
      )}

      <p className="mt-7 font-mono text-[9px] uppercase tracking-widest text-white/15 sm:mt-8">
        No credit card · Free forever plan
      </p>
    </div>
  );
}