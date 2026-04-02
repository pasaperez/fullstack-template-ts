import { UsersClient } from '@modules/users/presentation/components/UsersClient';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('UsersClient', () => {
    it('renders the users feature from the client entrypoint', () => {
        render(
            <UsersClient
                actions={{ createUser: vi.fn(), deleteUser: vi.fn(), updateUser: vi.fn() }}
                initialUsers={[]}
                loadErrorMessage={undefined}
            />
        );

        expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'New user' })).toBeEnabled();
    });
});
