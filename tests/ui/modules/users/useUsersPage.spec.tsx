import { useUsersPage } from '@modules/users/presentation/hooks/useUsersPage';
import type { UsersPageProps } from '@modules/users/presentation/UsersPresentationContracts';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

interface Deferred<T> {
    readonly promise: Promise<T>;
    resolve(value: T): void;
}

function createDeferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((promiseResolve) => {
        resolve = promiseResolve;
    });

    return { promise, resolve };
}

function changeField(field: UseFormRegisterReturn, value: string): void {
    void field.onChange({ target: { name: field.name, value }, type: 'change' });
}

function createProps(overrides: Partial<UsersPageProps> = {}): UsersPageProps {
    return {
        actions: {
            createUser: vi.fn(),
            deleteUser: vi.fn().mockResolvedValue({ deletedUserId: 'user-id', ok: true }),
            updateUser: vi.fn()
        },
        initialUsers: [],
        loadErrorMessage: undefined,
        ...overrides
    };
}

describe('useUsersPage', () => {
    it('opens the editor and reports plural record labels for multiple users', async () => {
        const firstUser = {
            createdAt: '2026-04-01T12:00:00.000Z',
            email: 'ada@example.com',
            id: 'user-1',
            name: 'Ada Example',
            updatedAt: '2026-04-01T12:00:00.000Z'
        };
        const secondUser = {
            createdAt: '2026-04-01T13:00:00.000Z',
            email: 'grace@example.com',
            id: 'user-2',
            name: 'Grace Example',
            updatedAt: '2026-04-01T13:00:00.000Z'
        };
        const users = [firstUser, secondUser];
        const { result } = renderHook(() => useUsersPage(createProps({ initialUsers: users })));

        act(() => result.current.onOpenCreate());
        act(() => result.current.onEdit(firstUser));
        await act(async () => {
            await result.current.onDelete(firstUser);
        });

        expect(result.current.isEditorOpen).toBe(true);
        expect(result.current.editingUserId).toBe('user-1');
        expect(result.current.confirmingDeleteUserId).toBe('user-1');
        expect(result.current.recordsLabel).toBe('2 records');
    });

    it('supports cancel helpers and singular record labels for interactive state', async () => {
        const user = {
            createdAt: '2026-04-01T12:00:00.000Z',
            email: 'ada@example.com',
            id: 'user-1',
            name: 'Ada Example',
            updatedAt: '2026-04-01T12:00:00.000Z'
        };
        const { result } = renderHook(() => useUsersPage(createProps({ initialUsers: [user] })));

        act(() => result.current.onEdit(user));
        expect(result.current.editorTitle).toBe('Edit user');

        act(() => result.current.onCancelEdit());
        expect(result.current.isEditorOpen).toBe(false);

        await act(async () => {
            await result.current.onDelete(user);
        });
        expect(result.current.confirmingDeleteUserId).toBe('user-1');

        act(() => result.current.onCancelDelete());
        expect(result.current.confirmingDeleteUserId).toBeUndefined();
        expect(result.current.recordsLabel).toBe('1 record');
    });

    it('creates users and exposes submitting state while the create action is pending', async () => {
        const deferred = createDeferred<Awaited<ReturnType<UsersPageProps['actions']['createUser']>>>();
        const actions = { createUser: vi.fn().mockReturnValue(deferred.promise), deleteUser: vi.fn(), updateUser: vi.fn() };
        const { result } = renderHook(() => useUsersPage(createProps({ actions })));

        act(() => result.current.onOpenCreate());
        act(() => {
            changeField(result.current.nameField, 'Alice Example');
            changeField(result.current.emailField, 'alice@example.com');
        });

        const submitPromise = result.current.onSubmit();

        await waitFor(() => expect(actions.createUser).toHaveBeenCalledWith({ email: 'alice@example.com', name: 'Alice Example' }));
        await waitFor(() => expect(result.current.isSubmitting).toBe(true));
        expect(result.current.submitButtonLabel).toBe('Creating...');

        deferred.resolve({
            ok: true,
            user: {
                createdAt: '2026-04-01T12:00:00.000Z',
                email: 'alice@example.com',
                id: 'user-1',
                name: 'Alice Example',
                updatedAt: '2026-04-01T12:00:00.000Z'
            }
        });
        await act(async () => {
            await submitPromise;
        });

        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.isEditorOpen).toBe(false);
        expect(result.current.users).toEqual([expect.objectContaining({ email: 'alice@example.com', name: 'Alice Example' })]);
    });

    it('shows submit errors when create fails', async () => {
        const actions = {
            createUser: vi.fn().mockResolvedValue({ errorMessage: 'Could not create the user.', ok: false }),
            deleteUser: vi.fn(),
            updateUser: vi.fn()
        };
        const { result } = renderHook(() => useUsersPage(createProps({ actions })));

        act(() => result.current.onOpenCreate());
        act(() => {
            changeField(result.current.nameField, 'Alice Example');
            changeField(result.current.emailField, 'alice@example.com');
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(result.current.submitErrorMessage).toBe('Could not create the user.');
        expect(result.current.isEditorOpen).toBe(true);
    });

    it('keeps the editor open and shows an error when update fails', async () => {
        const user = {
            createdAt: '2026-04-01T12:00:00.000Z',
            email: 'alice@example.com',
            id: 'user-1',
            name: 'Alice Example',
            updatedAt: '2026-04-01T12:00:00.000Z'
        };
        const deferred = createDeferred<Awaited<ReturnType<UsersPageProps['actions']['updateUser']>>>();
        const actions = { createUser: vi.fn(), deleteUser: vi.fn(), updateUser: vi.fn().mockReturnValue(deferred.promise) };
        const { result } = renderHook(() => useUsersPage(createProps({ actions, initialUsers: [user] })));

        act(() => result.current.onEdit(user));
        act(() => {
            changeField(result.current.nameField, 'Alice Updated');
            changeField(result.current.emailField, 'alice.updated@example.com');
        });

        const submitPromise = result.current.onSubmit();

        await waitFor(() =>
            expect(actions.updateUser).toHaveBeenCalledWith({ email: 'alice.updated@example.com', id: 'user-1', name: 'Alice Updated' })
        );
        await waitFor(() => expect(result.current.isSubmitting).toBe(true));
        expect(result.current.submitButtonLabel).toBe('Saving...');

        deferred.resolve({ errorMessage: 'Could not update the user.', ok: false });
        await act(async () => {
            await submitPromise;
        });

        expect(result.current.isEditorOpen).toBe(true);
        expect(result.current.submitErrorMessage).toBe('Could not update the user.');
        expect(result.current.isSubmitting).toBe(false);
    });

    it('updates users successfully and keeps the list sorted by newest record', async () => {
        const olderUser = {
            createdAt: '2026-04-01T12:00:00.000Z',
            email: 'older@example.com',
            id: 'user-1',
            name: 'Older User',
            updatedAt: '2026-04-01T12:00:00.000Z'
        };
        const newerUser = {
            createdAt: '2026-04-01T13:00:00.000Z',
            email: 'newer@example.com',
            id: 'user-2',
            name: 'Newer User',
            updatedAt: '2026-04-01T13:00:00.000Z'
        };
        const actions = {
            createUser: vi.fn(),
            deleteUser: vi.fn(),
            updateUser: vi.fn().mockResolvedValue({
                ok: true,
                user: { ...olderUser, email: 'older.updated@example.com', name: 'Older Updated', updatedAt: '2026-04-01T14:00:00.000Z' }
            })
        };
        const { result } = renderHook(() => useUsersPage(createProps({ actions, initialUsers: [olderUser, newerUser] })));

        act(() => result.current.onEdit(olderUser));
        act(() => {
            changeField(result.current.nameField, 'Older Updated');
            changeField(result.current.emailField, 'older.updated@example.com');
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(result.current.users).toEqual([
            expect.objectContaining({ id: 'user-2', name: 'Newer User' }),
            expect.objectContaining({ id: 'user-1', name: 'Older Updated', email: 'older.updated@example.com' })
        ]);
        expect(result.current.isEditorOpen).toBe(false);
    });

    it('handles delete confirmation, delete errors, and successful removal of the edited user', async () => {
        const user = {
            createdAt: '2026-04-01T12:00:00.000Z',
            email: 'alice@example.com',
            id: 'user-1',
            name: 'Alice Example',
            updatedAt: '2026-04-01T12:00:00.000Z'
        };
        const actions = {
            createUser: vi.fn(),
            deleteUser: vi.fn().mockResolvedValueOnce({ errorMessage: 'Could not delete the user.', ok: false }).mockResolvedValueOnce({
                deletedUserId: 'user-1',
                ok: true
            }),
            updateUser: vi.fn()
        };
        const { result } = renderHook(() => useUsersPage(createProps({ actions, initialUsers: [user] })));

        act(() => result.current.onEdit(user));
        await act(async () => {
            await result.current.onDelete(user);
        });
        expect(result.current.confirmingDeleteUserId).toBe('user-1');

        await act(async () => {
            await result.current.onDelete(user);
        });
        expect(result.current.deleteErrorMessage).toBe('Could not delete the user.');
        expect(result.current.confirmingDeleteUserId).toBeUndefined();

        await act(async () => {
            await result.current.onDelete(user);
        });
        await act(async () => {
            await result.current.onDelete(user);
        });

        expect(result.current.users).toEqual([]);
        expect(result.current.isEditorOpen).toBe(false);
        expect(result.current.confirmingDeleteUserId).toBeUndefined();
    });

    it('deletes a non-edited user without resetting the editor', async () => {
        const editedUser = {
            createdAt: '2026-04-01T12:00:00.000Z',
            email: 'edited@example.com',
            id: 'user-1',
            name: 'Edited User',
            updatedAt: '2026-04-01T12:00:00.000Z'
        };
        const deletedUser = {
            createdAt: '2026-04-01T13:00:00.000Z',
            email: 'deleted@example.com',
            id: 'user-2',
            name: 'Deleted User',
            updatedAt: '2026-04-01T13:00:00.000Z'
        };
        const actions = {
            createUser: vi.fn(),
            deleteUser: vi.fn().mockResolvedValue({ deletedUserId: 'user-2', ok: true }),
            updateUser: vi.fn()
        };
        const { result } = renderHook(() => useUsersPage(createProps({ actions, initialUsers: [editedUser, deletedUser] })));

        act(() => result.current.onEdit(editedUser));
        await act(async () => {
            await result.current.onDelete(deletedUser);
        });
        await act(async () => {
            await result.current.onDelete(deletedUser);
        });

        expect(result.current.users).toEqual([expect.objectContaining({ id: 'user-1' })]);
        expect(result.current.isEditorOpen).toBe(true);
        expect(result.current.editingUserId).toBe('user-1');
    });
});
