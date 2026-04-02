import { getUsersModule } from '@composition/server/users/getUsersModule';
import { inMemoryUsersStore } from '@modules/users/infrastructure/in-memory/inMemoryUsersStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getUsersModule', () => {
    beforeEach(() => {
        inMemoryUsersStore.clear();
    });

    it('returns the same singleton module and exposes an empty list by default', async () => {
        expect(getUsersModule()).toBe(getUsersModule());
        await expect(getUsersModule().useCases.listUsers.execute()).resolves.toEqual([]);
    });
});
