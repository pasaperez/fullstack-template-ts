import { UsersView } from '@modules/users/presentation/components/UsersView';
import type { UsersPageViewModel } from '@modules/users/presentation/hooks/useUsersPage';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function createViewModel(): UsersPageViewModel {
    return {
        confirmingDeleteUserId: undefined,
        deletingUserId: undefined,
        deleteErrorMessage: undefined,
        editingUserId: undefined,
        editorTitle: undefined,
        emailError: undefined,
        emailField: { name: 'email', onBlur: vi.fn(), onChange: vi.fn(), ref: vi.fn() },
        isDeleting: false,
        isEditorOpen: false,
        isSubmitting: false,
        loadErrorMessage: undefined,
        nameError: undefined,
        nameField: { name: 'name', onBlur: vi.fn(), onChange: vi.fn(), ref: vi.fn() },
        onCancelDelete: vi.fn(),
        onCancelEdit: vi.fn(),
        onDelete: vi.fn(),
        onEdit: vi.fn(),
        onOpenCreate: vi.fn(),
        onSubmit: vi.fn(),
        recordsLabel: '0 records',
        submitButtonLabel: undefined,
        submitErrorMessage: undefined,
        users: []
    };
}

describe('UsersView', () => {
    it('renders the default users header and keeps create enabled when idle', () => {
        render(<UsersView {...createViewModel()} />);

        expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'New user' })).toBeEnabled();
    });

    it('renders loading, table rows, destructive confirmation, and editor validation states', () => {
        const onCancelDelete = vi.fn();
        const onDelete = vi.fn();

        render(
            <UsersView
                {...createViewModel()}
                {...{
                    confirmingDeleteUserId: '5ee05639-9757-41ca-935f-95d6b52979f4',
                    deleteErrorMessage: 'Could not delete the user.',
                    deletingUserId: '5ee05639-9757-41ca-935f-95d6b52979f4',
                    editingUserId: '5ee05639-9757-41ca-935f-95d6b52979f4',
                    editorTitle: 'Edit user',
                    emailError: 'Use a valid email.',
                    isEditorOpen: true,
                    nameError: 'Name must have at least 2 characters.',
                    onCancelDelete,
                    onDelete,
                    submitButtonLabel: 'Save changes',
                    submitErrorMessage: 'Could not update the user.',
                    users: [{
                        createdAt: '2026-04-01T12:00:00.000Z',
                        email: 'dana@example.com',
                        id: '5ee05639-9757-41ca-935f-95d6b52979f4',
                        name: 'Dana Example',
                        updatedAt: '2026-04-01T12:00:00.000Z'
                    }]
                }}
            />
        );

        expect(screen.getByText('Could not delete the user.')).toBeInTheDocument();
        expect(screen.getByText('Dana Example')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm deleting Dana Example' })).toHaveTextContent('Deleting...');
        expect(screen.getByRole('heading', { name: 'Edit user' })).toBeInTheDocument();
        expect(screen.getByText('Use a valid email.')).toBeInTheDocument();
        expect(screen.getByText('Name must have at least 2 characters.')).toBeInTheDocument();
        expect(screen.getByText('Could not update the user.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();

        fireEvent.click(screen.getByRole('button', { name: 'Confirm deleting Dana Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel deleting Dana Example' }));

        expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ id: '5ee05639-9757-41ca-935f-95d6b52979f4' }));
        expect(onCancelDelete).toHaveBeenCalledTimes(1);
    });

    it('renders standard row actions and forwards edit and delete clicks', () => {
        const onDelete = vi.fn();
        const onEdit = vi.fn();

        render(
            <UsersView
                {...createViewModel()}
                {...{
                    onDelete,
                    onEdit,
                    users: [{
                        createdAt: '2026-04-01T12:00:00.000Z',
                        email: 'dana@example.com',
                        id: '5ee05639-9757-41ca-935f-95d6b52979f4',
                        name: 'Dana Example',
                        updatedAt: '2026-04-01T12:00:00.000Z'
                    }]
                }}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Edit Dana Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete Dana Example' }));

        expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: '5ee05639-9757-41ca-935f-95d6b52979f4' }));
        expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ id: '5ee05639-9757-41ca-935f-95d6b52979f4' }));
    });

    it('renders a non-submitting confirmation state and an enabled editor submit button', () => {
        render(
            <UsersView
                {...createViewModel()}
                {...{
                    confirmingDeleteUserId: '5ee05639-9757-41ca-935f-95d6b52979f4',
                    editorTitle: 'New user',
                    isEditorOpen: true,
                    submitButtonLabel: 'Create user',
                    users: [{
                        createdAt: '2026-04-01T12:00:00.000Z',
                        email: 'dana@example.com',
                        id: '5ee05639-9757-41ca-935f-95d6b52979f4',
                        name: 'Dana Example',
                        updatedAt: '2026-04-01T12:00:00.000Z'
                    }]
                }}
            />
        );

        expect(screen.getByRole('button', { name: 'Confirm deleting Dana Example' })).toHaveTextContent('Confirm');
        expect(screen.queryByText('Could not update the user.')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create user' })).toBeEnabled();
    });

    it('disables row actions when another user is already being deleted', () => {
        render(
            <UsersView
                {...createViewModel()}
                {...{
                    deletingUserId: 'other-user-id',
                    isDeleting: true,
                    users: [{
                        createdAt: '2026-04-01T12:00:00.000Z',
                        email: 'dana@example.com',
                        id: '5ee05639-9757-41ca-935f-95d6b52979f4',
                        name: 'Dana Example',
                        updatedAt: '2026-04-01T12:00:00.000Z'
                    }]
                }}
            />
        );

        expect(screen.getByRole('button', { name: 'Edit Dana Example' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Delete Dana Example' })).toBeDisabled();
    });

    it('renders load errors without showing the empty state', () => {
        render(<UsersView {...createViewModel()} {...{ isEditorOpen: true, loadErrorMessage: 'Could not load users.', users: [] }} />);

        expect(screen.getByText('Could not load users.')).toBeInTheDocument();
        expect(screen.queryByText('No users yet')).not.toBeInTheDocument();
    });

    it('hides the empty-state action when the editor is already open', () => {
        render(<UsersView {...createViewModel()} {...{ isEditorOpen: true, loadErrorMessage: undefined, users: [] }} />);

        expect(screen.getByText('No users yet')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Create user' })).not.toBeInTheDocument();
    });
});
