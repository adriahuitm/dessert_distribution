import { randomBytes, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { offers as sampleOffers, type Offer } from '@shared/data/offers';

export type Reservation = {
    id: string;
    offerSlug: string;
    code: string;
    createdAt: string;
};

type Store = { offers: Offer[]; reservations: Reservation[] };

const dataDirectory = join(process.cwd(), '.local-data');
const dataFile = join(dataDirectory, 'offers.json');
let writeQueue: Promise<void> = Promise.resolve();

async function readStore(): Promise<Store> {
    try {
        return JSON.parse(await readFile(dataFile, 'utf8')) as Store;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
        return { offers: sampleOffers.map(offer => ({ ...offer })), reservations: [] };
    }
}

async function writeStore(store: Store): Promise<void> {
    await mkdir(dataDirectory, { recursive: true });
    const temporaryFile = `${dataFile}.${process.pid}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(store, null, 2), 'utf8');
    await rename(temporaryFile, dataFile);
}

async function serialized<T>(task: () => Promise<T>): Promise<T> {
    const previous = writeQueue;
    let release!: () => void;
    writeQueue = new Promise<void>(resolve => { release = resolve; });
    await previous;
    try {
        return await task();
    } finally {
        release();
    }
}

export function listOffers(): Promise<Offer[]> {
    return serialized(async () => (await readStore()).offers);
}

export type NewOffer = {
    bakery: string;
    dessert: string;
    area: string;
    address: string;
    pickup: string;
    audience: Offer['audience'];
    description: string;
    total: number;
    priceAmount: number;
    originalPriceAmount?: number;
    businessActivityCode?: string;
};

export function createOffer(input: NewOffer): Promise<Offer> {
    return serialized(async () => {
        const store = await readStore();
        const baseSlug = `${input.bakery}-${input.dessert}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'bakery-offer';
        const offer: Offer = {
            slug: `${baseSlug}-${randomUUID().slice(0, 8)}`,
            bakery: input.bakery,
            dessert: input.dessert,
            area: input.area,
            address: input.address,
            businessActivityCode: input.businessActivityCode,
            pickup: input.pickup,
            expires: 'Pickup window today',
            distance: 'Nearby',
            audience: input.audience,
            description: input.description,
            total: input.total,
            remaining: input.total,
            price: input.priceAmount === 0 ? 'Free' : `RM ${input.priceAmount.toFixed(2)}`,
            originalPrice: input.originalPriceAmount ? `RM ${input.originalPriceAmount.toFixed(2)}` : undefined,
            emoji: '\u{1F370}',
            tone: 'peach',
        };
        store.offers.unshift(offer);
        await writeStore(store);
        return offer;
    });
}

export function reserveOffer(slug: string): Promise<{ offer: Offer; reservation: Reservation } | null> {
    return serialized(async () => {
        const store = await readStore();
        const offer = store.offers.find(item => item.slug === slug);
        if (!offer || offer.remaining < 1) return null;

        offer.remaining -= 1;
        const reservation: Reservation = {
            id: randomUUID(),
            offerSlug: slug,
            code: `CRUMB-${randomBytes(3).toString('hex').toUpperCase()}`,
            createdAt: new Date().toISOString(),
        };
        store.reservations.push(reservation);
        await writeStore(store);
        return { offer, reservation };
    });
}
