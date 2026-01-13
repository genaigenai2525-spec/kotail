"use client";

import { useEffect, useRef, useState } from "react";

interface ReviewCardProps {
  date: string;
  question: string;
  answer: string;
  maxLines?: number;
}

export default function ReviewCard({
  date,
  question,
  answer,
  maxLines = 5,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(120);
  const [fullHeight, setFullHeight] = useState(0);
  const contentRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const measure = () => {
      const styles = window.getComputedStyle(contentEl);
      const lineHeightValue = parseFloat(styles.lineHeight);
      const lineHeight = Number.isNaN(lineHeightValue) ? 24 : lineHeightValue;
      const nextCollapsedHeight = lineHeight * maxLines;
      const nextFullHeight = contentEl.scrollHeight;

      setCollapsedHeight(nextCollapsedHeight);
      setFullHeight(nextFullHeight);
      setIsExpandable(nextFullHeight > nextCollapsedHeight + 1);

      if (nextFullHeight <= nextCollapsedHeight + 1) {
        setIsExpanded(false);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(contentEl);

    return () => observer.disconnect();
  }, [answer, maxLines]);

  const isOpen = !isExpandable || isExpanded;
  const maxHeightStyle = isOpen
    ? fullHeight
      ? `${fullHeight}px`
      : "none"
    : `${collapsedHeight}px`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      {/* 質問者セクション */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 mt-1 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-sm text-gray-500">{date}</span>
          <p className="text-lg font-bold text-gray-900 mt-1">{question}</p>
        </div>
      </div>

      {/* 企業回答セクション */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 mt-1 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg
            className="w-6 h-6 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-slate-50 rounded-lg py-4 pr-4 pl-0 text-base text-gray-700 leading-relaxed">
            <div
              className="relative overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: maxHeightStyle }}
            >
              <p ref={contentRef} className="whitespace-pre-wrap">
                {answer}
              </p>
              {!isOpen && isExpandable && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 to-transparent" />
              )}
            </div>

            {isExpandable && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition hover:text-teal-700 hover:underline"
                aria-expanded={isOpen}
              >
                {isOpen ? "閉じる" : "もっと見る"}
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
