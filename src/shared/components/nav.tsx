'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ROUTES = [
    { href: '/', label: 'Find treats' },
    { href: '/for-bakeries', label: 'For bakeries' },
] as const;

export function Nav() {
    const pathname = usePathname();

    return (
        <header className="site-nav">
            <Link className="site-brand" href="/" aria-label="Crumb home">
                <span className="brand-glyph" aria-hidden="true">✳</span>
                <span>crumb<span className="brand-period">.</span></span>
            </Link>
            <nav aria-label="Primary navigation">
                {ROUTES.map(route => (
                    <Link key={route.href} href={route.href}
                        className={pathname === route.href ? 'is-active' : undefined}
                        aria-current={pathname === route.href ? 'page' : undefined}>
                        {route.label}
                    </Link>
                ))}
            </nav>
            <Link className="nav-cta" href="/#offers">Find a sweet deal <span aria-hidden="true">↗</span></Link>
        </header>
    );
}
