import Link from "next/link";
import Header from "@/components/Header";
import { getAllCompanies } from "@backend/services/companyService";
import RecentActivity from "@/components/landing/RecentActivity";

interface HomePageProps {
  searchParams?: { q?: string | string[] };
}

const fallbackSummaries = [
  "働き方のリアルを企業ごとに確認できます。",
  "現場の声と公式回答をまとめてチェック。",
  "最新の口コミと企業回答を一つのページで。",
];

function pickSummary(company: {
  tagline: string | null;
  business: string | null;
  overall_summary: string | null;
}, index: number) {
  return (
    company.tagline ||
    company.business ||
    company.overall_summary ||
    fallbackSummaries[index % fallbackSummaries.length]
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const companies = await getAllCompanies();
  const rawQuery = searchParams?.q;
  const query =
    typeof rawQuery === "string" ? rawQuery.trim() : "";
  const filteredCompanies = query
    ? companies.filter((company) => {
        const target = `${company.name ?? ""} ${company.business ?? ""} ${
          company.address ?? ""
        }`;
        return target.toLowerCase().includes(query.toLowerCase());
      })
    : companies;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0B4A6B] via-[#0A6EA8] to-[#15B1C9] py-20 text-white">
          <div className="absolute inset-0 opacity-25">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.2),transparent_40%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.2),transparent_45%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              生の声と対話しよう
            </h1>
            <p className="text-sky-100 mb-10 text-lg">
              企業から公式見解を得られる口コミサイト
            </p>

            <form
              action="/"
              method="get"
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex items-center border border-white/30 focus-within:ring-2 focus-within:ring-cyan-200 transition"
            >
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="企業名や気になるキーワードで検索"
                className="flex-1 p-5 text-gray-800 outline-none text-lg"
                aria-label="企業名や気になるキーワードで検索"
              />
              <button
                type="submit"
                className="bg-[#00a0e9] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0088c7] transition-colors"
              >
                検索
              </button>
            </form>
          </div>
        </section>

        <section className="py-10 container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">企業一覧</h2>
            <span className="text-sm text-gray-500">
              {filteredCompanies.length}社
            </span>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="text-gray-500 text-center py-12 space-y-2">
              <p>該当する企業が見つかりませんでした。</p>
              {companies.length === 0 && (
                <p>企業がまだ登録されていません。</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompanies.map((company, index) => (
                <Link
                  href={`/company/${company.id}`}
                  key={company.id}
                  className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="relative">
                    <div className="aspect-video w-full overflow-hidden">
                      {company.hero_image_url ? (
                        <img
                          src={company.hero_image_url}
                          alt={`${company.name}のカバー`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sky-100 via-cyan-100 to-slate-100" />
                      )}
                    </div>
                    <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-gray-100">
                      <span className="text-lg font-bold text-gray-700">{company.name.slice(0, 1)}</span>
                    </div>
                  </div>
                  <div className="pt-10 px-6 pb-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00a0e9] transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2">
                        {company.address && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 font-semibold">
                            {company.address}
                          </span>
                        )}
                        {company.business && (
                          <span className="px-2 py-1 bg-cyan-500/10 text-cyan-700 rounded-full font-semibold">
                            {company.business}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                      <div className="text-xs font-semibold text-gray-500 mb-2">企業のポイント</div>
                      <div className="text-sm text-gray-700 bg-white rounded-xl p-3 border border-cyan-100 line-clamp-2">
                        {pickSummary(company, index)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">最終更新 {new Date(company.updated_at).toLocaleDateString("ja-JP")}</span>
                      <span className="text-[#00a0e9] font-medium group-hover:translate-x-1 transition-transform">
                        詳細を見る →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="py-12 container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">最近の回答</h2>
          </div>
          <RecentActivity />
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-gray-200 py-12 text-center text-sm text-gray-500">
        © 2026 kotail Project.
      </footer>
    </div>
  );
}
