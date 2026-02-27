import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f2eee3] px-6">
      <main className="w-full max-w-xl border border-black/15 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-[#f04939]">404</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-[#161616]">
          Page not found
        </h1>
        <p className="mt-3 text-pretty text-sm text-black/70">
          This profile or child page does not exist yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex bg-[#f04939] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73d2e]"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}

