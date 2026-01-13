"use client";

interface Tab {
  id: string;
  label: string;
}

interface StickyTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function StickyTabs({
  tabs,
  activeTab,
  onTabChange,
}: StickyTabsProps) {
  return (
    <div className="border-b border-gray-200 px-2">
      <div className="flex gap-2 overflow-x-auto -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 pt-2 pb-2.5 text-sm font-medium whitespace-nowrap rounded-full border-b-2 transition-colors ${
              activeTab === tab.id
                ? "bg-teal-600 text-white border-teal-600 font-semibold shadow-sm"
                : "bg-slate-200 text-slate-600 border-transparent hover:bg-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
