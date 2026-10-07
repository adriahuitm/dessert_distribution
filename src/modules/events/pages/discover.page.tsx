import Link from 'next/link';
import { events, type Event } from '@shared/data/events';

export function EventCard({ event }: { event: Event }) {
    return <article className="event-card"><div className="event-art" style={{ backgroundColor: event.accent }}><span>{event.mark}</span><b>{event.game}</b></div><div className="event-info"><div className="event-meta"><span className={event.status === 'Closing soon' ? 'closing' : ''}>{event.status}</span><time>{event.date}</time></div><h3>{event.title}</h3><p>{event.venue} · {event.city}</p><div className="event-bottom"><span>{event.format}</span><Link href={`/events/${event.slug}`}>Details →</Link></div></div></article>;
}

export function DiscoverPage() {
    return <div className="discover-page">
        <section className="hero"><div className="hero-copy"><p className="kicker">SEASON 04 · NOW LIVE</p><h1>Find the game.<br/><em>Own the moment.</em></h1><p>From first queues to finals day — discover competitive gaming events built for your squad.</p><div className="hero-actions"><Link className="button primary" href="/events">Explore events</Link><Link className="text-link" href="/organizer">I&apos;m an organizer →</Link></div></div><div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-game">V<span>ALORANT</span></div><div className="hero-card"><span>FEATURED EVENT</span><strong>Aftershock Open</strong><small>Oct 12–13 · Kuala Lumpur</small></div></div></section>
        <section className="event-section"><div className="section-heading"><div><p className="kicker">MAKE YOUR MOVE</p><h2>Upcoming events</h2></div><Link href="/events">View all events →</Link></div><div className="event-grid">{events.map(event => <EventCard key={event.slug} event={event} />)}</div></section>
        <section className="community-strip"><div><p className="kicker">ONE ARENA, EVERY LEVEL</p><h2>Show up. Squad up.<br/>Level up.</h2></div><p>Meet rivals who become teammates, chase your first podium, or bring an entire community together. Nexus is where the next game starts.</p><Link className="button ghost" href="/events">Join the arena</Link></section>
    </div>;
}
