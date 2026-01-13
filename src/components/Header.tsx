"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[#00a0e9] text-2xl font-bold">kotail</span>
            <span className="text-sm text-gray-600">
              "生の声"と対話しよう
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="#" className="hover:text-[#00a0e9] transition-colors">
            企業を探す
          </Link>
          <Link href="#" className="hover:text-[#00a0e9] transition-colors">
            このサイトについて
          </Link>
          <Link href="#" className="hover:text-[#00a0e9] transition-colors">
            掲載をご希望の方へ
          </Link>
          <Link href="#" className="hover:text-[#00a0e9] transition-colors">
            コラム
          </Link>
          <Link
            href="#"
            className="hover:text-[#00a0e9] transition-colors flex items-center gap-1"
          >
            運営会社
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
