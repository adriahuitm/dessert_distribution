import type { Metadata } from 'next';
import { Providers } from './providers';
import { Nav } from '@shared/components/nav';
import './globals.css';

export const metadata: Metadata = {
    title: 'Dessert Rescue | Crumb',
    description: 'Find free and discounted end-of-day bakery treats near you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Nav />
                    <main>{children}</main>
                    <footer className="site-footer"><span>CRUMB. · GOOD TREATS, LESS WASTE</span><span>Sample offers for preview · Kuala Lumpur</span></footer>
                </Providers>
            </body>
        </html>
    );
}
