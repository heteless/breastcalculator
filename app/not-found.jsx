import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center">
        <p
          className="text-[0.85rem] tracking-[0.2em] text-[#a08a78] mb-3"
          style={{ fontFamily: "Georgia,'Times New Roman',Times,serif" }}
        >
          404
        </p>
        <h1
          className="text-3xl sm:text-4xl font-semibold text-[#6b5344] mb-4 leading-tight"
          style={{ fontFamily: "Georgia,'Times New Roman',Times,serif" }}
        >
          We couldn&apos;t find that page
        </h1>
        <p className="text-[1rem] text-[#7a6455] mb-8 leading-relaxed">
          The page you&apos;re looking for may have been moved, renamed, or
          never existed. Try one of our most popular tools below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/bra-size-calculator/"
            className="inline-flex items-center justify-center px-5 py-3 rounded bg-[#7a6455] text-white text-sm font-semibold hover:bg-[#6b5344] transition-colors min-h-[48px]"
          >
            Bra Size Calculator
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded border border-[#e6d5c3] text-[#7a6455] text-sm font-semibold hover:border-[#6b5344] hover:text-[#6b5344] transition-colors min-h-[48px]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
