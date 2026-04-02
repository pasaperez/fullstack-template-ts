import { getUsersModule } from '@composition/server/users/getUsersModule';
import { createUserAction, deleteUserAction, updateUserAction } from '@composition/server/users/usersActions';
import { inMemoryUsersStore } from '@modules/users/infrastructure/in-memory/inMemoryUsersStore';
import { userFormSchema } from '@modules/users/presentation/forms/UserFormSchema';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

describe('users server actions', () => {
    beforeEach(() => {
        inMemoryUsersStore.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('runs the in-memory create, update, and delete flow', async () => {
        const createdResult = await createUserAction({ email: 'flow@example.com', name: 'Flow User' });
        expect(createdResult.ok).toBe(true);
        if (!createdResult.ok) {
            return;
        }

        const updatedResult = await updateUserAction({
            email: 'flow.updated@example.com',
            id: createdResult.user.id,
            name: 'Flow User Updated'
        });
        expect(updatedResult.ok).toBe(true);
        if (!updatedResult.ok) {
            return;
        }
        expect(updatedResult.user.email).toBe('flow.updated@example.com');

        const deletedResult = await deleteUserAction({ id: createdResult.user.id });
        expect(deletedResult).toEqual({ deletedUserId: createdResult.user.id, ok: true });
    });

    it('returns validation errors for invalid payloads', async () => {
        await expect(createUserAction({ email: 'invalid-email', name: 'Flow User' })).resolves.toEqual({
            errorMessage: 'Use a valid email.',
            ok: false
        });
        await expect(updateUserAction({ email: 'flow@example.com', id: 'not-a-uuid', name: 'Flow User' })).resolves.toEqual({
            errorMessage: 'Use a valid user id.',
            ok: false
        });
        await expect(deleteUserAction({ id: 'not-a-uuid' })).resolves.toEqual({ errorMessage: 'Use a valid user id.', ok: false });
    });

    it('falls back to the generic validation message when the validation error has no issues', async () => {
        vi.spyOn(userFormSchema, 'safeParse').mockReturnValue(
            { error: new z.ZodError([]), success: false } as ReturnType<typeof userFormSchema.safeParse>
        );

        await expect(createUserAction({ email: 'flow@example.com', name: 'Flow User' })).resolves.toEqual({
            errorMessage: 'The submitted payload is invalid.',
            ok: false
        });
    });

    it('returns domain or infrastructure failures from create, update, and delete actions', async () => {
        vi.spyOn(getUsersModule().useCases.createUser, 'execute').mockRejectedValueOnce(new Error('Create failed.'));
        vi.spyOn(getUsersModule().useCases.updateUser, 'execute').mockRejectedValueOnce(new Error('Update failed.'));
        vi.spyOn(getUsersModule().useCases.deleteUser, 'execute').mockRejectedValueOnce(new Error('Delete failed.'));

        await expect(createUserAction({ email: 'flow@example.com', name: 'Flow User' })).resolves.toEqual({
            errorMessage: 'Create failed.',
            ok: false
        });
        await expect(
            updateUserAction({ email: 'flow.updated@example.com', id: '5ee05639-9757-41ca-935f-95d6b52979f4', name: 'Flow User Updated' })
        ).resolves.toEqual({ errorMessage: 'Update failed.', ok: false });
        await expect(deleteUserAction({ id: '5ee05639-9757-41ca-935f-95d6b52979f4' })).resolves.toEqual({
            errorMessage: 'Delete failed.',
            ok: false
        });
    });
});
