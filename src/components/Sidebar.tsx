"use client";

interface CompanyInfo {
  label: string;
  value: string;
}

interface SidebarProps {
  companyInfo: CompanyInfo[];
}

export default function Sidebar({ companyInfo }: SidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-16">
      <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        会社情報
      </h2>
      <table className="w-full text-sm">
        <tbody>
          {companyInfo.map((info, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-b-0">
              <td className="py-2 pr-4 text-gray-500 whitespace-nowrap align-top">
                {info.label}
              </td>
              <td className="py-2 text-gray-700">{info.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
