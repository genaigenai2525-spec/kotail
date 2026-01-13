import { NextRequest, NextResponse } from 'next/server';
import { createArticle, fetchArticles } from '@backend/services/articleService';
import { ArticleTag, ValidationError } from '@backend/types/article';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const companyId = searchParams.get('companyId');
  const page = parseInt(searchParams.get('page') || '1');
  const tag = searchParams.get('tag') as ArticleTag | null;
  const keyword = searchParams.get('q');

  if (!companyId) {
    return NextResponse.json(
      { error: 'companyId is required' },
      { status: 400 }
    );
  }

  try {
    const result = await fetchArticles({
      companyId,
      page,
      pageSize: 10,
      tag: tag || undefined,
      keyword: keyword || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const companyId = body?.company_id as string | undefined;
    const title = body?.title as string | undefined;
    const content = body?.content as string | undefined;
    const tag = body?.tag as ArticleTag | undefined;
    const userId =
      (body?.user_id as string | undefined) ?? crypto.randomUUID();

    if (!companyId) {
      return NextResponse.json(
        { error: 'company_id is required' },
        { status: 400 }
      );
    }

    if (!tag) {
      return NextResponse.json({ error: 'tag is required' }, { status: 400 });
    }

    const created = await createArticle({
      company_id: companyId,
      title: title || '',
      content: content || '',
      user_id: userId,
      tag,
    });

    return NextResponse.json({ data: created });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Failed to create article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
