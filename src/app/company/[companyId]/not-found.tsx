import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          企業が見つかりません
        </h1>
        <p className="text-gray-600 mb-8">
          お探しの企業ページは存在しないか、削除された可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
        >
          トップページへ戻る
        </Link>
      </main>
    </div>
  );
}
