import { createListUsers } from '@modules/users/application/use-cases/ListUsers';
import { describe, expect, it, vi } from 'vitest';

describe('createListUsers', () => {
    it('sorts users by newest creation date', async () => {
        const userRepository = {
            list: vi.fn().mockResolvedValue([{
                createdAt: '2026-03-01T10:00:00.000Z',
                email: 'older@example.com',
                id: 'ff191c20-72be-4d29-a55d-e2e22aa53e75',
                name: 'Older User',
                updatedAt: '2026-03-01T10:00:00.000Z'
            }, {
                createdAt: '2026-03-03T10:00:00.000Z',
                email: 'newer@example.com',
                id: '2d88789f-fb56-471c-a63e-7e92cb39da68',
                name: 'Newer User',
                updatedAt: '2026-03-03T10:00:00.000Z'
            }])
        };

        const useCase = createListUsers({ userRepository });

        await expect(useCase.execute()).resolves.toMatchObject([{ email: 'newer@example.com' }, { email: 'older@example.com' }]);
        expect(userRepository.list).toHaveBeenCalledTimes(1);
    });
});
