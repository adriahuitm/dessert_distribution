'use client';
import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import { events } from '@shared/data/events';

export function EventDetailPage({ slug }: { slug: string }) {
    const event = events.find(item => item.slug === slug) ?? events[0];
    const [registered, setRegistered] = useState(false);
    return <div className="detail-page"><Link className="back-link" href="/events">← All events</Link><section className="detail-hero" style={{ '--accent': event.accent } as CSSProperties}><div className="detail-symbol">{event.mark}</div><div><p className="kicker">{event.game} · {event.status}</p><h1>{event.title}</h1><p>{event.endDate} · {event.venue}, {event.city}</p></div></section><section className="detail-content"><div className="detail-main"><h2>Play for the next level.</h2><p>{event.description}</p><div className="info-grid"><div><span>FORMAT</span><strong>{event.format}</strong></div><div><span>PRIZE POOL</span><strong>{event.prize}</strong></div><div><span>ENTRY</span><strong>{event.entry}</strong></div><div><span>CHECK-IN</span><strong>10:00 AM</strong></div></div></div><aside className="registration-box">{registered ? <><p className="kicker">YOU&apos;RE IN</p><h2>Registration saved.</h2><p>We&apos;ve held your spot. Your confirmation is on its way.</p><Link className="button primary" href="/events">Find another event</Link></> : <><p className="kicker">{event.capacity - event.players} SPOTS LEFT</p><h2>Ready to compete?</h2><p>Register yourself or your full squad. You can invite teammates after checkout.</p><button className="button primary" onClick={() => setRegistered(true)}>Register now →</button><small>No account needed to start.</small></>}</aside></section></div>;
}
