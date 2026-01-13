"use client";

import { useState, useCallback, FormEvent } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CompanyHeader from "@/components/CompanyHeader";
import StickyTabs from "@/components/StickyTabs";
import ReviewCard from "@/components/ReviewCard";
import AISummaryCard from "@/components/AISummaryCard";
import Sidebar from "@/components/Sidebar";
import { Company, CompanyInfo, AISummaryData } from "@backend/types/company";
import { Article, ArticleTag } from "@backend/types/article";

interface CompanyPageClientProps {
  company: Company;
  companyInfo: CompanyInfo[];
  aiSummary: AISummaryData | null;
  initialArticles: Article[];
  initialHasMore: boolean;
}

interface Tab {
  id: string;
  label: string;
  tag: ArticleTag | null;
}

const tabs: Tab[] = [
  { id: "top", label: "企業TOP", tag: null },
  { id: "workplace", label: "職場環境の実態", tag: "workplace_review" },
  { id: "service", label: "サービスの実態", tag: "service_review" },
];

const getTagForTab = (tabId: string) =>
  tabs.find((t) => t.id === tabId)?.tag;

export default function CompanyPageClient({
  company,
  companyInfo,
  aiSummary,
  initialArticles,
  initialHasMore,
}: CompanyPageClientProps) {
  const [activeTab, setActiveTab] = useState("top");
  const [articles, setArticles] = useState(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTag, setPostTag] = useState<ArticleTag>("workplace_review");
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const fetchArticlesPage = useCallback(
    async ({
      tabId,
      pageNumber,
      keyword,
      append,
    }: {
      tabId: string;
      pageNumber: number;
      keyword: string;
      append: boolean;
    }) => {
      setLoading(true);
      setFetchError(null);
      try {
        const params = new URLSearchParams({
          companyId: company.id,
          page: String(pageNumber),
        });
        const tag = getTagForTab(tabId);
        if (tag) params.set("tag", tag);
        if (keyword.trim()) params.set("q", keyword.trim());

        const response = await fetch(`/api/articles?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const result = await response.json();

        setArticles((prev) =>
          append ? [...prev, ...result.data] : result.data
        );
        setHasMore(result.hasMore);
        setPage(pageNumber);
      } catch (error) {
        console.error("Failed to load articles:", error);
        setFetchError("口コミの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    },
    [company.id]
  );

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      fetchArticlesPage({
        tabId,
        pageNumber: 1,
        keyword: searchQuery,
        append: false,
      });
    },
    [fetchArticlesPage, searchQuery]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    fetchArticlesPage({
      tabId: activeTab,
      pageNumber: page + 1,
      keyword: searchQuery,
      append: true,
    });
  }, [activeTab, fetchArticlesPage, hasMore, loading, page, searchQuery]);

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextQuery = searchInput.trim();
      setSearchQuery(nextQuery);
      fetchArticlesPage({
        tabId: activeTab,
        pageNumber: 1,
        keyword: nextQuery,
        append: false,
      });
    },
    [activeTab, fetchArticlesPage, searchInput]
  );

  const handlePostSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPosting(true);
      setPostError(null);
      setPostSuccess(null);

      const userId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : "00000000-0000-0000-0000-000000000000";

      try {
        const response = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: company.id,
            title: postTitle,
            content: postContent,
            tag: postTag,
            user_id: userId,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "投稿に失敗しました");
        }

        setPostSuccess("口コミを投稿しました。");
        setPostTitle("");
        setPostContent("");

        const matchesTab =
          activeTab === "top" || getTagForTab(activeTab) === postTag;
        const matchesQuery = searchQuery
          ? `${result.data.title} ${result.data.content}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true;

        if (matchesTab && matchesQuery) {
          setArticles((prev) => [result.data, ...prev]);
        }
      } catch (error) {
        console.error("Failed to post article:", error);
        setPostError(
          error instanceof Error ? error.message : "投稿に失敗しました。"
        );
      } finally {
        setPosting(false);
      }
    },
    [
      activeTab,
      company.id,
      postContent,
      postTag,
      postTitle,
      searchQuery,
    ]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <HeroBanner
        tagline={company.tagline || "企業の実態をみんなで共有"}
      />

      <main className="max-w-7xl mx-auto px-4">
        <div className="mt-6 flex flex-col lg:flex-row gap-8 pb-10">
          <div className="flex-1 min-w-0">
            <CompanyHeader
              name={company.name}
              address={company.address}
              websiteUrl={company.url || undefined}
              employeeCount={company.employee_count || "N/A"}
            />

            <div className="mt-6 sticky top-0 z-40 bg-slate-50 pt-3">
              <StickyTabs
                tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>

            {aiSummary && (
              <div className="mt-6">
                <AISummaryCard
                  data={aiSummary}
                  hasQAContent={articles.length > 0}
                />
              </div>
            )}

            <div className="py-6">
              {fetchError && (
                <div className="text-center py-4 text-sm text-rose-600">
                  {fetchError}
                </div>
              )}

              {articles.length > 0 ? (
                articles.map((article) => (
                  <ReviewCard
                    key={article.id}
                    date={new Date(article.created_at).toLocaleDateString(
                      "ja-JP",
                      { year: "numeric", month: "2-digit", day: "2-digit" }
                    )}
                    question={article.title}
                    answer={article.content}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery
                    ? "検索結果がまだありません。"
                    : "このカテゴリーの口コミはまだありません。"}
                </div>
              )}

              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full py-3 text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50"
                >
                  {loading ? "読み込み中..." : "もっと見る"}
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-16 self-start space-y-6">
              <div className="bg-white shadow-sm rounded-xl p-4">
                <div className="flex flex-col gap-3">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="relative w-full">
                      <svg
                        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35m1.1-4.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        placeholder="キーワードで検索する"
                        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        aria-label="キーワードで検索する"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 shadow-sm transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    >
                      検索する
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => {
                      const defaultTag =
                        getTagForTab(activeTab) ?? "workplace_review";
                      setPostTag(defaultTag);
                      setIsPostOpen((prev) => !prev);
                      setPostError(null);
                      setPostSuccess(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h8M8 14h5m-7 7l4-4H6a4 4 0 01-4-4V7a4 4 0 014-4h12a4 4 0 014 4v6a4 4 0 01-4 4h-3l-4 4z"
                      />
                    </svg>
                    口コミ・質問を投稿する
                  </button>

                  {isPostOpen && (
                    <form
                      onSubmit={handlePostSubmit}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-gray-500">
                          タグ
                        </label>
                        <select
                          value={postTag}
                          onChange={(event) =>
                            setPostTag(event.target.value as ArticleTag)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                          <option value="workplace_review">
                            職場環境の実態
                          </option>
                          <option value="service_review">
                            サービスの実態
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500">
                          タイトル
                        </label>
                        <input
                          type="text"
                          value={postTitle}
                          onChange={(event) => setPostTitle(event.target.value)}
                          placeholder="例: 職場の雰囲気について教えてください"
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500">
                          口コミ本文
                        </label>
                        <textarea
                          value={postContent}
                          onChange={(event) =>
                            setPostContent(event.target.value)
                          }
                          rows={4}
                          placeholder="実際に働いて感じたことや質問内容を記入してください"
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                          required
                        />
                      </div>
                      {postError && (
                        <div className="text-xs text-rose-600">
                          {postError}
                        </div>
                      )}
                      {postSuccess && (
                        <div className="text-xs text-teal-600">
                          {postSuccess}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={posting}
                        className="w-full rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
                      >
                        {posting ? "投稿中..." : "投稿する"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <Sidebar companyInfo={companyInfo} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
