import { AppShell } from '@app/AppShell';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const usePathnameMock = vi.fn<() => string>();

vi.mock(
    'next/link',
    () => ({
        default: (
            { children, href, onClick, ...props }: {
                children: ReactNode;
                href: string;
                onClick?: ((event: MouseEvent) => void) | undefined;
            }
        ): ReactElement => (
            <a
                href={href}
                onClick={(event) => {
                    event.preventDefault();
                    onClick?.(event.nativeEvent);
                }}
                {...props}
            >
                {children}
            </a>
        )
    })
);

vi.mock('next/navigation', () => ({ usePathname: (): string => usePathnameMock() }));

function renderAppShell(): void {
    render(
        <ThemeProvider>
            <AppShell>
                <div>Workspace content</div>
            </AppShell>
        </ThemeProvider>
    );
}

describe('AppShell', () => {
    beforeEach(() => {
        window.localStorage.clear();
        usePathnameMock.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders navigation, toggles shell state, and updates theme selection', () => {
        usePathnameMock.mockReturnValue('/users');

        renderAppShell();

        expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main-content');
        expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByText('Workspace content')).toBeInTheDocument();

        act(() => {
            window.localStorage.setItem('fullstack-template-ts.sidebar', 'collapsed');
            window.dispatchEvent(new StorageEvent('storage', { key: 'fullstack-template-ts.sidebar' }));
        });
        expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Expand navigation' }));
        expect(window.localStorage.getItem('fullstack-template-ts.sidebar')).toBe('expanded');

        fireEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));
        expect(window.localStorage.getItem('fullstack-template-ts.sidebar')).toBe('collapsed');

        fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        expect(screen.getByRole('button', { name: 'Close navigation' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('link', { name: 'Users' }));
        expect(screen.queryByRole('button', { name: 'Close navigation' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }));
        expect(screen.queryByRole('button', { name: 'Close navigation' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Theme/i }));
        expect(screen.getByRole('group', { name: 'Theme palette' })).toBeInTheDocument();
        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        });
        expect(screen.getByRole('group', { name: 'Theme palette' })).toBeInTheDocument();
        act(() => {
            screen.getByRole('group', { name: 'Theme palette' }).dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        });
        expect(screen.getByRole('group', { name: 'Theme palette' })).toBeInTheDocument();
        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        });
        expect(screen.queryByRole('group', { name: 'Theme palette' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Theme/i }));
        act(() => {
            document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        });
        expect(screen.queryByRole('group', { name: 'Theme palette' })).not.toBeInTheDocument();

        act(() => {
            window.localStorage.setItem('fullstack-template-ts.theme', 'harbor-light');
            window.dispatchEvent(new StorageEvent('storage', { key: 'fullstack-template-ts.theme' }));
        });
        expect(screen.getByRole('button', { name: /Theme/i })).toHaveTextContent('Harbor');

        fireEvent.click(screen.getByRole('button', { name: /Theme/i }));
        const harborButton = within(screen.getByRole('group', { name: 'Theme palette' })).getAllByRole('button', { name: /Harbor/i })[0];

        if (harborButton === undefined) {
            throw new Error('Expected the Harbor theme option to exist.');
        }

        fireEvent.click(harborButton);

        expect(window.localStorage.getItem('fullstack-template-ts.theme')).toBe('harbor-light');
        expect(screen.getByRole('button', { name: /Theme/i })).toHaveTextContent('Harbor');
    });

    it('keeps the shell interactive when browser storage is unavailable', () => {
        usePathnameMock.mockReturnValue('/users');
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('Storage is blocked.');
        });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Storage is blocked.');
        });

        renderAppShell();

        fireEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));
        expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Theme/i }));
        fireEvent.click(screen.getAllByRole('button', { name: /Nightfall/i })[0]!);

        expect(screen.getByRole('button', { name: /Theme/i })).toHaveTextContent('Nightfall');
    });

    it('renders inactive navigation and falls back to the default theme for unknown storage values', () => {
        window.localStorage.setItem('fullstack-template-ts.theme', 'unknown-theme');
        usePathnameMock.mockReturnValue('/other');

        renderAppShell();

        expect(screen.getByRole('link', { name: 'Users' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('button', { name: /Theme/i })).toHaveTextContent('Fern');
    });

    it('renders with the default server-side snapshots', () => {
        usePathnameMock.mockReturnValue('/users');

        const markup = renderToStaticMarkup(
            <ThemeProvider>
                <AppShell>
                    <div>Server content</div>
                </AppShell>
            </ThemeProvider>
        );

        expect(markup).toContain('Server content');
        expect(markup).toContain('Fern');
    });
});
