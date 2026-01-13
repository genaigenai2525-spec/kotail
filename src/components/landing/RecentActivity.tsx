import Link from "next/link";
import { supabase } from "@backend/lib/supabase";

const getRelativeTime = (dateString: string) => {
  const now = Date.now();
  const timestamp = new Date(dateString).getTime();
  const diffMinutes = Math.max(0, Math.floor((now - timestamp) / 60000));

  if (diffMinutes < 1) return "たった今";
  if (diffMinutes < 60) return `${diffMinutes}分前`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}時間前`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}日前`;
};

type ActivityRow = {
  id: string;
  created_at: string;
  title: string;
  companies: {
    id: string;
    name: string;
    hero_image_url: string | null;
  } | null;
};

export default async function RecentActivity() {
  const { data: activities, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      created_at,
      title,
      companies (
        id,
        name,
        hero_image_url
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(6);

  if (error || !activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
      {activities.map((activity: ActivityRow) => {
        const timeLabel = getRelativeTime(activity.created_at);
        const company = activity.companies;
        const initial = company?.name?.slice(0, 1) ?? "?";

        return (
          <div key={activity.id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {company?.hero_image_url ? (
                <img
                  src={company.hero_image_url}
                  alt={`${company?.name ?? ""}のカバー`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-semibold text-gray-600">{initial}</span>
              )}
            </div>
            <div className="flex-1 text-sm text-gray-700">
              {company ? (
                <Link
                  href={`/company/${company.id}`}
                  className="font-semibold text-gray-900 hover:text-[#00a0e9] hover:underline"
                >
                  {company.name}
                </Link>
              ) : (
                <span className="font-semibold text-gray-900">企業</span>
              )}
              <span> が </span>
              <span className="font-semibold text-gray-900">「{activity.title}」</span>
              <span> について回答しました。</span>
              <div className="text-xs text-gray-500 mt-1">{timeLabel}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
