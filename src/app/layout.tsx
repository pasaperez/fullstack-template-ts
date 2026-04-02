import '@app/globals.css';

import { AppShell } from '@app/AppShell';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    applicationName: 'Fullstack Template TS',
    description:
        'Production-oriented Next.js fullstack template with modular users flow, server actions, accessible UI, and strict quality gates.',
    title: { default: 'Fullstack Template TS', template: '%s | Fullstack Template TS' }
};

export default function RootLayout({ children }: { children: ReactNode; }): ReactNode {
    return (
        <html lang='en'>
            <body>
                <ThemeProvider>
                    <AppShell>{children}</AppShell>
                </ThemeProvider>
            </body>
        </html>
    );
}
