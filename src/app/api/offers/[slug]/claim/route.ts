import { NextResponse } from 'next/server';
import { reserveOffer } from '@app/lib/offer-store';

export const runtime = 'nodejs';

export async function POST(_request: Request, context: { params: Promise<{ slug: string }> }) {
    const { slug } = await context.params;
    const result = await reserveOffer(slug);
    if (!result) {
        return NextResponse.json({ message: 'This offer is unavailable or sold out.' }, { status: 409 });
    }
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
