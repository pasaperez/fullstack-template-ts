import GlobalError from '@app/error';
import Loading from '@app/loading';
import NotFound from '@app/not-found';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
    'next/link',
    () => ({
        default: ({ children, href, ...props }: { children: ReactNode; href: string; }): ReactElement => (
            <a href={href} {...props}>{children}</a>
        )
    })
);

describe('status pages', () => {
    it('renders the not-found recovery route to users', () => {
        render(<NotFound />);

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go to users' })).toHaveAttribute('href', '/users');
    });

    it('renders the loading status surface', () => {
        render(<Loading />);

        expect(screen.getByRole('status')).toHaveTextContent('Preparing the users workspace');
    });

    it('renders a generic runtime error recovery flow without exposing raw details', () => {
        const reset = vi.fn();

        render(<GlobalError error={new Error('Database exploded.')} reset={reset} />);

        expect(screen.getByRole('heading', { name: 'Unexpected runtime error' })).toBeInTheDocument();
        expect(screen.queryByText('Database exploded.')).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go to users' })).toHaveAttribute('href', '/users');

        fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

        expect(reset).toHaveBeenCalledTimes(1);
    });
});
