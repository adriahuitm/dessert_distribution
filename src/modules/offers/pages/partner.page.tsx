'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { findAllZones } from '@shared/services/zone.service';
import { findAllBusinessActivities } from '@shared/services/business-activity.service';
import type { Zone } from '@shared/models/zone.model';
import type { BusinessActivity } from '@shared/models/business-activity.model';
import type { Offer } from '@shared/data/offers';

type ReferenceState = 'loading' | 'ready' | 'error';

export function PartnerPage() {
    const [zones, setZones] = useState<Zone[]>([]);
    const [activities, setActivities] = useState<BusinessActivity[]>([]);
    const [referenceState, setReferenceState] = useState<ReferenceState>('loading');
    const [offerType, setOfferType] = useState<'free' | 'discount'>('discount');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [published, setPublished] = useState<Offer | null>(null);

    useEffect(() => {
        let active = true;
        Promise.all([findAllZones(), findAllBusinessActivities()])
            .then(([nextZones, nextActivities]) => {
                if (!active) return;
                setZones(nextZones);
                setActivities(nextActivities.filter(item => item.active && item.selectable));
                setReferenceState('ready');
            })
            .catch(() => { if (active) setReferenceState('error'); });
        return () => { active = false; };
    }, []);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const values = new FormData(form);
        setSubmitting(true);
        setError(null);
        setPublished(null);

        const payload = {
            bakery: values.get('bakery'),
            dessert: values.get('dessert'),
            area: values.get('area'),
            address: values.get('address'),
            pickup: values.get('pickup'),
            audience: values.get('audience'),
            description: values.get('description'),
            total: values.get('total'),
            priceAmount: offerType === 'free' ? 0 : values.get('priceAmount'),
            originalPriceAmount: offerType === 'free' ? '' : values.get('originalPriceAmount'),
            businessActivityCode: values.get('businessActivityCode'),
        };

        try {
            const response = await fetch('/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const body = await response.json() as Offer | { message?: string };
            if (!response.ok || !('slug' in body)) {
                throw new Error('message' in body ? body.message : 'The offer could not be published.');
            }
            setPublished(body);
            form.reset();
            setOfferType('discount');
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'The offer could not be published.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="partner-page">
            <section className="partner-hero">
                <div>
                    <p className="eyebrow"><span className="live-dot" /> FOR THE PEOPLE WHO MAKE THE GOOD STUFF</p>
                    <h1>Less waste.<br /><em>More neighbours.</em></h1>
                    <p>Publish your end-of-day treats and let nearby people know what is still fresh before you close.</p>
                    <a className="button button-primary" href="#publish">Create an offer <span aria-hidden="true">v</span></a>
                </div>
                <div className="partner-illustration" aria-hidden="true"><span>{'\u{1F956}'}</span><b>BAKED<br />WITH CARE</b><i>*</i></div>
            </section>

            <section className="partner-benefits">
                <article><span>01</span><h2>Set the details</h2><p>Choose a free or discounted price, quantity, pickup window, and who can claim it.</p></article>
                <article><span>02</span><h2>Reach your neighbours</h2><p>Your offer appears in the local discovery list as soon as it is published.</p></article>
                <article><span>03</span><h2>Keep good food moving</h2><p>Each reservation updates the available quantity for this local app instance.</p></article>
            </section>

            <section className="join-section" id="publish">
                <div className="join-copy">
                    <p className="eyebrow">LOCAL PARTNER PREVIEW</p>
                    <h2>Post tonight's<br />last-call treats.</h2>
                    <p>Published offers are saved on this machine and visible to people using this local app.</p>
                    <div className="reference-status">
                        <span className={referenceState === 'ready' ? 'status-dot ready' : 'status-dot'} />
                        {referenceState === 'loading' ? 'Loading Rebana licensing reference data...' : referenceState === 'ready' ? `Rebana sandbox connected: ${zones.length} zones and ${activities.length} business activities` : 'Rebana data is unavailable. You can enter the area manually.'}
                    </div>
                    <p className="form-hint">This prototype does not verify bakery ownership, send notifications, or provide cloud storage. Do not enter sensitive contact details.</p>
                </div>

                <form className="partner-form" onSubmit={submit}>
                    <label>Bakery name<input name="bakery" placeholder="e.g. Sunday Bakehouse" maxLength={80} required /></label>
                    <label>Dessert or treat<input name="dessert" placeholder="e.g. Butter croissants" maxLength={100} required /></label>
                    <label>Area / council zone{referenceState === 'ready' ? <select name="area" defaultValue="" required><option value="" disabled>Choose a zone</option>{zones.map(zone => <option key={zone.zoneCode} value={zone.nameEn ?? zone.nameMs}>{zone.nameEn ?? zone.nameMs}</option>)}</select> : <input name="area" placeholder="e.g. Bangsar, Kuala Lumpur" maxLength={100} required />}</label>
                    <label>Bakery activity{referenceState === 'ready' ? <select name="businessActivityCode" defaultValue=""><option value="">Choose if listed</option>{activities.map(activity => <option key={activity.code} value={activity.code}>{activity.nameEn ?? activity.name}</option>)}</select> : <input name="businessActivityCode" placeholder="Optional activity code" maxLength={100} />}</label>
                    <label>Pickup address<input name="address" placeholder="Street address" maxLength={180} required /></label>
                    <label>Pickup window<input name="pickup" placeholder="Today, 8:00-9:00 pm" maxLength={100} required /></label>
                    <label>Who can claim?<select name="audience" defaultValue="Everyone"><option value="Everyone">Everyone</option><option value="Students">Students only</option></select></label>
                    <label>Available portions<input name="total" type="number" min="1" max="500" defaultValue="4" required /></label>
                    <label>Offer type<select value={offerType} onChange={event => setOfferType(event.target.value as 'free' | 'discount')}><option value="discount">Discounted</option><option value="free">Free</option></select></label>
                    {offerType === 'discount' && <>
                        <label>Offer price (RM)<input name="priceAmount" type="number" min="0.01" max="10000" step="0.01" placeholder="5.00" required /></label>
                        <label>Usual price (RM)<input name="originalPriceAmount" type="number" min="0.02" max="10000" step="0.01" placeholder="Optional" /></label>
                    </>}
                    {offerType === 'free' && <input type="hidden" name="priceAmount" value="0" />}
                    <label className="full-field">A little more about it<textarea name="description" placeholder="What is included? Add any pickup or student card instructions." maxLength={500} rows={3} required /></label>
                    {error && <p className="form-error full-field" role="alert">{error}</p>}
                    {published && <div className="publish-success full-field" role="status"><strong>Your offer is live in this local app.</strong><span>{published.dessert} at {published.bakery} - {published.remaining} portions listed.</span><a href="/#offers">Open treat listings</a></div>}
                    <button className="button button-dark form-submit" type="submit" disabled={submitting}>{submitting ? 'Publishing...' : 'Publish offer'} <span aria-hidden="true">&gt;</span></button>
                </form>
            </section>
        </div>
    );
}
