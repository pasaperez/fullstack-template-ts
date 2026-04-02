import { createGetUserById } from '@modules/users/application/use-cases/GetUserById';
import { describe, expect, it, vi } from 'vitest';

describe('createGetUserById', () => {
    it('delegates the lookup to the repository', async () => {
        const userRepository = {
            getById: vi.fn().mockResolvedValue({
                createdAt: '2026-04-01T10:00:00.000Z',
                email: 'ada@example.com',
                id: '0bfc7cf0-f3d7-43a6-83dc-50efcf2a66e8',
                name: 'Ada Example',
                updatedAt: '2026-04-01T10:00:00.000Z'
            })
        };

        const useCase = createGetUserById({ userRepository });

        await expect(useCase.execute('0bfc7cf0-f3d7-43a6-83dc-50efcf2a66e8')).resolves.toMatchObject({ email: 'ada@example.com' });
        expect(userRepository.getById).toHaveBeenCalledWith('0bfc7cf0-f3d7-43a6-83dc-50efcf2a66e8');
    });
});
