import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle, UserPlus } from "@phosphor-icons/react/dist/ssr";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | foliopage",
  description: "Create your foliopage account and launch your profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <div className="min-h-dvh bg-[#f2eee3] text-[#161616]">
      <main className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8">
        <section className="grid gap-6 border border-black/15 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 border border-black/20 bg-[#f2eee3] px-3 py-1 text-sm font-semibold">
              <UserPlus size={16} aria-hidden />
              Step 1 of MVP flow
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight">
              Create your foliopage account
            </h1>
            <p className="mt-3 text-pretty text-sm text-black/70">
              Email + password auth (Supabase-ready) before profile setup.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="inline-flex items-center gap-2">
                <CheckCircle size={15} aria-hidden className="text-[#f04939]" />
                Resume-first profile setup
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle size={15} aria-hidden className="text-[#f04939]" />
                Recruiter mode public pages
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle size={15} aria-hidden className="text-[#f04939]" />
                Free and Pro plan support
              </li>
            </ul>
            <Link
              href="/"
              className="mt-6 inline-flex border border-black/20 px-3 py-1.5 text-xs font-medium hover:border-black"
            >
              Back to landing page
            </Link>
          </div>
          <SignUpForm />
        </section>
      </main>
    </div>
  );
}
