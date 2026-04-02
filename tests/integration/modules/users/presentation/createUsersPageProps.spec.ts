import { createUsersPageProps } from '@composition/server/users/createUsersPageProps';
import { getUsersModule } from '@composition/server/users/getUsersModule';
import { inMemoryUsersStore } from '@modules/users/infrastructure/in-memory/inMemoryUsersStore';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('createUsersPageProps', () => {
    beforeEach(() => {
        inMemoryUsersStore.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns server actions and an empty users list by default', async () => {
        const props = await createUsersPageProps();

        expect(props.loadErrorMessage).toBeUndefined();
        expect(props.initialUsers).toEqual([]);
        expect(typeof props.actions.createUser).toBe('function');
        expect(typeof props.actions.deleteUser).toBe('function');
        expect(typeof props.actions.updateUser).toBe('function');
    });

    it('returns a load error message when the server-side users list fails', async () => {
        vi.spyOn(getUsersModule().useCases.listUsers, 'execute').mockRejectedValueOnce(new Error('Users storage is unavailable.'));

        const props = await createUsersPageProps();

        expect(props.initialUsers).toEqual([]);
        expect(props.loadErrorMessage).toBe('Users storage is unavailable.');
    });
});
