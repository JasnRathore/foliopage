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
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const response = await signUp(email, password);
        localStorage.setItem(SESSION_TOKEN_KEY, response.token);
        setMessage("Account created.");
        router.push("/dashboard");
        return;
      }

      if (mode === "sign_in") {
        const response = await signIn(email, password);
        localStorage.setItem(SESSION_TOKEN_KEY, response.token);
        setMessage("Signed in.");
        router.push("/dashboard");
        return;
      }

      await resetPassword(email, nextPassword);
      setMessage("Password updated. Sign in with the new password.");
      setMode("sign_in");
      setPassword(nextPassword);
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="border border-black/15 bg-[#f7f5ee] p-5">
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode("sign_up")}
          className={
            mode === "sign_up"
              ? "bg-[#f04939] px-2 py-1 font-semibold text-white"
              : "border border-black/20 px-2 py-1 hover:border-black"
          }
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode("sign_in")}
          className={
            mode === "sign_in"
              ? "bg-[#f04939] px-2 py-1 font-semibold text-white"
              : "border border-black/20 px-2 py-1 hover:border-black"
          }
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("reset")}
          className={
            mode === "reset"
              ? "bg-[#f04939] px-2 py-1 font-semibold text-white"
              : "border border-black/20 px-2 py-1 hover:border-black"
          }
        >
          Reset password
        </button>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@university.edu"
          className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-[#f04939]"
        />
      </label>

      {mode !== "reset" && (
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-[#f04939]"
          />
        </label>
      )}

      {mode === "sign_up" && (
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">Confirm password</span>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-[#f04939]"
          />
        </label>
      )}

      {mode === "reset" && (
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">New password</span>
          <input
            type="password"
            required
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
            className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-[#f04939]"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex items-center gap-2 bg-[#f04939] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73d2e] disabled:opacity-60"
      >
        {mode === "sign_up" && (
          <>
            <UserPlus size={16} aria-hidden />
            Create account
          </>
        )}
        {mode === "sign_in" && (
          <>
            <SignIn size={16} aria-hidden />
            Sign in
          </>
        )}
        {mode === "reset" && (
          <>
            <LockKey size={16} aria-hidden />
            Reset password
          </>
        )}
        <ArrowRight size={16} aria-hidden />
      </button>

      {error && <p className="mt-3 text-sm text-[#8a0b24]">{error}</p>}
      {message && <p className="mt-3 text-sm text-black/70">{message}</p>}
    </form>
  );
}
