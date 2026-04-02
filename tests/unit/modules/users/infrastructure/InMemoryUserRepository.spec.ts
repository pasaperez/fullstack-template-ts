import { InMemoryUserRepository } from '@modules/users/infrastructure/in-memory/InMemoryUserRepository';
import { describe, expect, it } from 'vitest';

function createRepository(): InMemoryUserRepository {
    return new InMemoryUserRepository({
        clock: () => new Date('2026-03-31T12:00:00.000Z'),
        createId: () => '4f15fd4b-f1f3-489d-8bc0-b8b61b4df00c',
        store: new Map()
    });
}

describe('InMemoryUserRepository', () => {
    it('creates, reads, updates, lists, and deletes users', async () => {
        const repository = createRepository();

        const createdUser = await repository.create({ email: 'dana@example.com', name: 'Dana Example' });
        expect(createdUser.id).toBe('4f15fd4b-f1f3-489d-8bc0-b8b61b4df00c');

        await expect(repository.getById(createdUser.id)).resolves.toEqual(createdUser);

        const updatedUser = await repository.update({ email: 'dana.updated@example.com', id: createdUser.id, name: 'Dana Updated' });
        expect(updatedUser.email).toBe('dana.updated@example.com');

        await expect(repository.list()).resolves.toEqual(
            expect.arrayContaining([expect.objectContaining({ id: createdUser.id, name: 'Dana Updated' })])
        );

        await expect(repository.delete(createdUser.id)).resolves.toBeUndefined();
        await expect(repository.getById(createdUser.id)).resolves.toBeNull();
    });

    it('throws when updating or deleting a missing user', async () => {
        const repository = createRepository();

        await expect(repository.update({ email: 'missing@example.com', id: 'missing-user-id', name: 'Missing User' })).rejects.toThrow(
            'missing-user-id'
        );
        await expect(repository.delete('missing-user-id')).rejects.toThrow('missing-user-id');
    });
});
