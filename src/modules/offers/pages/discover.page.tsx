'use client';

import { useEffect, useMemo, useState } from 'react';
import { type Offer } from '@shared/data/offers';

type Filter = 'All treats' | 'Free' | 'Student deals';

function OfferCard({ offer, onDetails }: { offer: Offer; onDetails: (offer: Offer) => void }) {
    return (
        <article className="offer-card">
            <div className={`offer-art ${offer.tone}`}>
                <span className="offer-emoji" aria-hidden="true">{offer.emoji}</span>
                <span className="offer-time">Pickup: {offer.pickup}</span>
                <span className="offer-price">{offer.originalPrice && <del>{offer.originalPrice}</del>}{offer.price}</span>
            </div>
            <div className="offer-info">
                <div className="offer-tags"><span className={offer.audience === 'Students' ? 'tag student-tag' : 'tag'}>{offer.audience === 'Students' ? 'Student deal' : 'Everyone'}</span><span className="remaining">{offer.remaining} left</span></div>
                <h3>{offer.dessert}</h3>
                <p className="bakery-name">{offer.bakery}</p>
                <p className="offer-location">{offer.area} <span>· {offer.distance}</span></p>
                <div className="offer-bottom"><span>{offer.expires}</span><button className="text-button" onClick={() => onDetails(offer)}>Details <span aria-hidden="true">&gt;</span></button></div>
            </div>
        </article>
    );
}

function OfferDialog({ offer, onClose, onClaim, claimedCode, claimError, claiming }: {
    offer: Offer;
    onClose: () => void;
    onClaim: () => void;
    claimedCode: string | null;
    claimError: string | null;
    claiming: boolean;
}) {
    return (
        <div className="dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
            <section className="offer-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
                <button className="dialog-close" onClick={onClose} aria-label="Close details">x</button>
                <div className={`dialog-art ${offer.tone}`}><span aria-hidden="true">{offer.emoji}</span></div>
                <div className="dialog-content">
                    <span className="tag">{offer.audience === 'Students' ? 'Student deal' : 'Everyone welcome'}</span>
                    <h2 id="dialog-title">{offer.dessert}</h2>
                    <p className="bakery-name">{offer.bakery} - {offer.area}</p>
                    <p>{offer.description}</p>
                    <div className="detail-list"><div><span>Pickup</span><strong>{offer.pickup}</strong></div><div><span>Available</span><strong>{offer.remaining} of {offer.total} portions</strong></div><div><span>Address</span><strong>{offer.address}</strong></div></div>
                    {claimedCode ? <p className="claim-confirmation" role="status">Reserved. Show code <strong>{claimedCode}</strong> at pickup. Student offers require a student card.</p> : <button className="button button-primary claim-button" onClick={onClaim} disabled={claiming || offer.remaining === 0}>{claiming ? 'Reserving...' : offer.remaining === 0 ? 'Sold out' : 'Reserve this treat'} <span aria-hidden="true">&gt;</span></button>}
                    {claimError && <p className="form-error" role="alert">{claimError}</p>}
                    <p className="demo-note">Reservations are stored in this local prototype only. Contact the bakery if your plans change.</p>
                </div>
            </section>
        </div>
    );
}

export function DiscoverPage() {
    const [filter, setFilter] = useState<Filter>('All treats');
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Offer | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [claiming, setClaiming] = useState(false);
    const [claimedCode, setClaimedCode] = useState<string | null>(null);
    const [claimError, setClaimError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        fetch('/api/offers', { cache: 'no-store' })
            .then(async response => {
                if (!response.ok) throw new Error('Offers could not be loaded. Please refresh and try again.');
                return response.json() as Promise<Offer[]>;
            })
            .then(items => { if (active) setOffers(items); })
            .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'Offers could not be loaded.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const filteredOffers = useMemo(() => offers.filter(offer => {
        const matchesFilter = filter === 'All treats' || (filter === 'Free' ? offer.price === 'Free' : offer.audience === 'Students');
        const haystack = `${offer.dessert} ${offer.bakery} ${offer.area}`.toLowerCase();
        return matchesFilter && haystack.includes(query.toLowerCase().trim());
    }), [filter, offers, query]);

    async function reserveSelectedOffer() {
        if (!selected || claiming) return;
        setClaiming(true);
        setClaimError(null);
        try {
            const response = await fetch(`/api/offers/${encodeURIComponent(selected.slug)}/claim`, { method: 'POST' });
            const body = await response.json() as { message?: string; offer?: Offer; reservation?: { code: string } };
            if (!response.ok || !body.offer || !body.reservation) throw new Error(body.message ?? 'Reservation failed. Please try again.');
            setOffers(current => current.map(offer => offer.slug === body.offer?.slug ? body.offer as Offer : offer));
            setSelected(body.offer);
            setClaimedCode(body.reservation.code);
        } catch (error) {
            setClaimError(error instanceof Error ? error.message : 'Reservation failed. Please try again.');
        } finally {
            setClaiming(false);
        }
    }

    function openDetails(offer: Offer) {
        setClaimedCode(null);
        setClaimError(null);
        setSelected(offer);
    }

    return (
        <div className="app-page">
            <section className="hero">
                <div className="hero-copy">
                    <p className="eyebrow"><span className="live-dot" /> FRESH FINDS BEFORE THEY ARE GONE</p>
                    <h1>A little treat.<br /><em>A lot less waste.</em></h1>
                    <p className="hero-lead">Find lovely things from your neighbourhood bakery, rescued just before closing. Free or for less, always worth the detour.</p>
                    <a className="button button-primary" href="#offers">See what is left <span aria-hidden="true">v</span></a>
                    <div className="hero-proof"><span>*</span> Good treats, good neighbours, less waste.</div>
                </div>
                <div className="hero-visual" aria-label="Illustration of a pastry and coffee">
                    <div className="hero-sun" />
                    <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
                    <div className="hero-sticker">SWEET<br />FINDS<br /><b>*</b></div>
                    <div className="hero-pastry">{'\u{1F950}'}</div>
                    <div className="hero-cup">{'\u{2615}'}</div>
                    <div className="hero-caption"><span>TONIGHT'S LITTLE JOY</span><strong>Something good<br />is around the corner.</strong></div>
                </div>
            </section>

            <section className="impact-strip" aria-label="How it works"><div><span className="impact-icon">01</span><p><strong>Near you</strong><br />Neighbourhood bakeries</p></div><div><span className="impact-icon">02</span><p><strong>Before closing</strong><br />Fresh treats, last call</p></div><div><span className="impact-icon">03</span><p><strong>Less waste</strong><br />More joy in every bite</p></div></section>

            <section className="offers-section" id="offers">
                <div className="section-heading"><div><p className="eyebrow">THE GOOD STUFF</p><h2>Tonight's last-call treats</h2><p>Little batches, lovely bakeries. Check the pickup window before you head out.</p></div><span className="today-label"><span className="live-dot" /> KL AREA</span></div>
                <div className="demo-banner"><span aria-hidden="true">*</span><p><strong>Local prototype</strong> - starter listings are fictional. Offers you publish and reservations are stored on this machine in a local JSON file; they are not shared across deployed servers.</p></div>
                <div className="offer-toolbar"><label className="search-box"><span aria-hidden="true">?</span><input aria-label="Search bakery, treat, or area" placeholder="Search a treat, bakery or area" value={query} onChange={event => setQuery(event.target.value)} /></label><div className="filter-pills" role="group" aria-label="Filter treats">{(['All treats', 'Free', 'Student deals'] as const).map(item => <button key={item} className={filter === item ? 'filter-pill selected' : 'filter-pill'} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div><span className="result-count">{filteredOffers.length} treats</span></div>
                {loading ? <div className="empty-state" role="status"><h3>Finding nearby treats...</h3></div> : loadError ? <div className="empty-state state-error" role="alert"><h3>Offers could not load</h3><p>{loadError}</p><button className="text-button" onClick={() => window.location.reload()}>Try again</button></div> : filteredOffers.length ? <div className="offer-grid">{filteredOffers.map(offer => <OfferCard key={offer.slug} offer={offer} onDetails={openDetails} />)}</div> : <div className="empty-state"><span>{'\u{1F370}'}</span><h3>No treats found just yet</h3><p>Try another search or switch the filter.</p><button className="text-button" onClick={() => { setQuery(''); setFilter('All treats'); }}>Clear filters</button></div>}
                <p className="section-footnote">Pickup times and eligibility are set by each bakery. Check the details before you reserve.</p>
            </section>

            <section className="partner-callout"><div><p className="eyebrow">BAKERS, THIS ONE IS FOR YOU</p><h2>Good baking deserves<br />a good second chance.</h2><p>Turn end-of-day extras into someone's favourite part of the day.</p></div><a className="button button-dark" href="/for-bakeries">Post a bakery offer <span aria-hidden="true">&gt;</span></a><span className="callout-art" aria-hidden="true">{'\u{1F956}'}</span></section>
            {selected && <OfferDialog offer={selected} onClose={() => setSelected(null)} claimedCode={claimedCode} claimError={claimError} claiming={claiming} onClaim={reserveSelectedOffer} />}
        </div>
    );
}
