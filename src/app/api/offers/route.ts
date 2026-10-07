import { NextRequest, NextResponse } from 'next/server';
import { createOffer, listOffers, type NewOffer } from '@app/lib/offer-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const text = (value: unknown, maxLength: number): value is string =>
    typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;

export async function GET() {
    return NextResponse.json(await listOffers(), { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
    let body: Record<string, unknown>;
    try {
        body = await request.json() as Record<string, unknown>;
    } catch {
        return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const requiredText = ['bakery', 'dessert', 'area', 'address', 'pickup', 'description'] as const;
    const limits = { bakery: 80, dessert: 100, area: 100, address: 180, pickup: 100, description: 500 } as const;
    for (const key of requiredText) {
        if (!text(body[key], limits[key])) {
            return NextResponse.json({ message: `Enter ${key} (up to ${limits[key]} characters).` }, { status: 400 });
        }
    }

    const total = Number(body.total);
    const priceAmount = Number(body.priceAmount);
    const originalPriceAmount = body.originalPriceAmount === '' || body.originalPriceAmount === undefined
        ? undefined
        : Number(body.originalPriceAmount);
    if (!Number.isInteger(total) || total < 1 || total > 500) {
        return NextResponse.json({ message: 'Quantity must be a whole number from 1 to 500.' }, { status: 400 });
    }
    if (!Number.isFinite(priceAmount) || priceAmount < 0 || priceAmount > 10000) {
        return NextResponse.json({ message: 'Enter a valid offer price.' }, { status: 400 });
    }
    if (originalPriceAmount !== undefined && (!Number.isFinite(originalPriceAmount) || originalPriceAmount <= priceAmount || originalPriceAmount > 10000)) {
        return NextResponse.json({ message: 'The usual price must be higher than the offer price.' }, { status: 400 });
    }
    if (body.audience !== 'Everyone' && body.audience !== 'Students') {
        return NextResponse.json({ message: 'Choose who can use this offer.' }, { status: 400 });
    }

    const input: NewOffer = {
        bakery: (body.bakery as string).trim(),
        dessert: (body.dessert as string).trim(),
        area: (body.area as string).trim(),
        address: (body.address as string).trim(),
        pickup: (body.pickup as string).trim(),
        description: (body.description as string).trim(),
        audience: body.audience,
        total,
        priceAmount,
        originalPriceAmount,
        businessActivityCode: typeof body.businessActivityCode === 'string' ? body.businessActivityCode : undefined,
    };
    const offer = await createOffer(input);
    return NextResponse.json(offer, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
