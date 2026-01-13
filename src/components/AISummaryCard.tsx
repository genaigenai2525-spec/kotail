"use client";

import { useEffect, useState } from "react";

interface AISummaryData {
  overall_summary: string;
  pros: string[];
  cons: string[];
}

interface AISummaryCardProps {
  data: AISummaryData;
  hasQAContent: boolean;
}

export default function AISummaryCard({
  data,
  hasQAContent,
}: AISummaryCardProps) {
  const [isOpen, setIsOpen] = useState(!hasQAContent);

  useEffect(() => {
    setIsOpen(!hasQAContent);
  }, [hasQAContent]);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <section className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 overflow-hidden shadow-sm transition-all">
      <div
        className="p-5 cursor-pointer flex justify-between items-start gap-4"
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-indigo-500 text-xl" aria-hidden="true">
            ✨
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-indigo-950">
              AIによる企業評判まとめ
            </h3>
            <p
              className={`mt-1 text-sm text-slate-600 leading-relaxed ${
                isOpen
                  ? ""
                  : "line-clamp-2 overflow-hidden text-ellipsis"
              }`}
            >
              {data.overall_summary}
            </p>
          </div>
        </div>

        {!isOpen && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggle();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-800"
          >
            もっと見る
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 7l5 5 5-5"
              />
            </svg>
          </button>
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "max-h-[1200px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-5 pb-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-indigo-100 bg-white/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2.5-8l1.8 1.8 3.7-3.7"
                  />
                </svg>
                良い点
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {data.pros.map((item, index) => (
                  <li key={`pro-${index}`} className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-indigo-100 bg-white/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-9v4m0-7h.01"
                  />
                </svg>
                懸念点
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {data.cons.map((item, index) => (
                  <li key={`con-${index}`} className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              ※AI分析のため、情報の正確性を保証するものではありません
            </p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggle();
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              閉じる
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l5-5 5 5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
