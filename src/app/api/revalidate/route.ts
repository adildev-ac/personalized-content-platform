import { revalidatePath } from 'next/cache';

function doRevalidate(paths: string[]) {
  const unique = Array.from(new Set(paths.filter(Boolean)));
  unique.forEach((p) => {
    try { revalidatePath(p); } catch {}
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  if (!process.env.NEXT_REVALIDATE_SECRET || secret !== process.env.NEXT_REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  const paths = searchParams.getAll('path');
  doRevalidate(paths.length ? paths : ['/']);
  return Response.json({ revalidated: true, paths: paths.length ? paths : ['/'] });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  if (!process.env.NEXT_REVALIDATE_SECRET || body?.secret !== process.env.NEXT_REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  const paths: string[] = Array.isArray(body?.paths) ? body.paths : [body?.path || '/'];
  doRevalidate(paths);
  return Response.json({ revalidated: true, paths });
}
