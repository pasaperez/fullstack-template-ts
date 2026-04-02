import RootLayout, { metadata as rootMetadata } from '@app/layout';
import HomePage from '@app/page';
import UsersIndexPage, { dynamic, metadata as usersMetadata } from '@app/users/page';
import type { UsersPageProps } from '@modules/users/presentation/UsersPresentationContracts';
import { render, screen } from '@testing-library/react';
import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const redirectMock = vi.fn();
const createUsersPagePropsMock = vi.fn<() => Promise<UsersPageProps>>();
const usersClientMock = vi.fn((props: UsersPageProps): ReactElement => (
    <div data-testid='users-route' data-users-count={props.initialUsers.length}>{props.loadErrorMessage ?? 'ready'}</div>
));

vi.mock('next/navigation', () => ({
    redirect: (href: string): never => {
        redirectMock(href);
        throw new Error('redirect');
    },
    usePathname: (): string => '/users'
}));

vi.mock(
    '@composition/server/users/createUsersPageProps',
    () => ({ createUsersPageProps: (): Promise<UsersPageProps> => createUsersPagePropsMock() })
);

vi.mock(
    '@modules/users/presentation/components/UsersClient',
    () => ({ UsersClient: (props: UsersPageProps): ReactElement => usersClientMock(props) })
);

describe('app routes and metadata', () => {
    beforeEach(() => {
        createUsersPagePropsMock.mockReset();
        redirectMock.mockReset();
        usersClientMock.mockClear();
    });

    it('exports root metadata and renders the expected html wrapper', () => {
        const layoutElement = RootLayout({ children: <div>Child content</div> });

        expect(rootMetadata.applicationName).toBe('Fullstack Template TS');
        expect(rootMetadata.description).toContain('accessible UI');
        expect(rootMetadata.title).toEqual({ default: 'Fullstack Template TS', template: '%s | Fullstack Template TS' });
        expect(isValidElement(layoutElement)).toBe(true);
        if (!isValidElement(layoutElement)) {
            throw new Error('RootLayout did not return a valid React element.');
        }
        const htmlElement = layoutElement as ReactElement<{ lang: string; }>;

        expect(htmlElement.type).toBe('html');
        expect(htmlElement.props.lang).toBe('en');
    });

    it('redirects the home route to users', () => {
        expect(() => HomePage()).toThrow('redirect');
        expect(redirectMock).toHaveBeenCalledWith('/users');
    });

    it('renders the users route from server-composed props and exports route metadata', async () => {
        createUsersPagePropsMock.mockResolvedValue({
            actions: { createUser: vi.fn(), deleteUser: vi.fn(), updateUser: vi.fn() },
            initialUsers: [{
                createdAt: '2026-04-01T12:00:00.000Z',
                email: 'ada@example.com',
                id: 'user-1',
                name: 'Ada Example',
                updatedAt: '2026-04-01T12:00:00.000Z'
            }],
            loadErrorMessage: undefined
        });

        const routeElement = await UsersIndexPage();

        render(routeElement);

        expect(dynamic).toBe('force-dynamic');
        expect(usersMetadata.title).toBe('Users');
        expect(usersMetadata.description).toContain('server-rendered data');
        expect(createUsersPagePropsMock).toHaveBeenCalledTimes(1);
        expect(usersClientMock.mock.calls[0]?.[0]).toEqual(
            expect.objectContaining({ initialUsers: [expect.objectContaining({ id: 'user-1' })] })
        );
        expect(screen.getByTestId('users-route')).toHaveAttribute('data-users-count', '1');
    });
});
