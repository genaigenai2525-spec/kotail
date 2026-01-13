import { notFound } from 'next/navigation';
import { getCompanyById } from '@backend/services/companyService';
import { fetchArticles } from '@backend/services/articleService';
import { Company, CompanyInfo, AISummaryData } from '@backend/types/company';
import CompanyPageClient from './CompanyPageClient';

interface PageProps {
  params: Promise<{ companyId: string }>;
}

// Helper: Transform company data to sidebar format
function buildCompanyInfo(company: Company): CompanyInfo[] {
  const info: CompanyInfo[] = [
    { label: '会社名', value: company.name },
    { label: '本社所在地', value: company.address },
  ];

  if (company.url) info.push({ label: 'URL', value: company.url });
  if (company.employee_count) info.push({ label: '従業員数', value: company.employee_count });
  if (company.established) info.push({ label: '設立', value: company.established });
  if (company.capital) info.push({ label: '資本金', value: company.capital });
  if (company.business) info.push({ label: '事業内容', value: company.business });

  return info;
}

// Helper: Build AI summary data
function buildAISummary(company: Company): AISummaryData | null {
  if (!company.overall_summary) return null;

  return {
    overall_summary: company.overall_summary,
    pros: company.pros || [],
    cons: company.cons || [],
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { companyId } = await params;

  // Fetch company data
  const company = await getCompanyById(companyId);

  if (!company) {
    notFound();
  }

  // Fetch initial articles (first page, no tag filter)
  const articlesResult = await fetchArticles({
    companyId: company.id,
    page: 1,
    pageSize: 10,
  });

  // Transform data for components
  const companyInfo = buildCompanyInfo(company);
  const aiSummary = buildAISummary(company);

  return (
    <CompanyPageClient
      company={company}
      companyInfo={companyInfo}
      aiSummary={aiSummary}
      initialArticles={articlesResult.data}
      initialHasMore={articlesResult.hasMore}
    />
  );
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps) {
  const { companyId } = await params;
  const company = await getCompanyById(companyId);

  if (!company) {
    return { title: '企業が見つかりません' };
  }

  return {
    title: `${company.name} - kotail`,
    description: company.overall_summary || `${company.name}の口コミ・評判`,
  };
}
