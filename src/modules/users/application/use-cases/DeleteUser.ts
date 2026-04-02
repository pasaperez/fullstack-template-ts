import type { UserRepository } from '@modules/users/domain/ports/UserRepository';

type DeleteUserRepository = Pick<UserRepository, 'delete'>;

export interface DeleteUserUseCase {
    execute(id: string): Promise<void>;
}

export function createDeleteUser({ userRepository }: { userRepository: DeleteUserRepository; }): DeleteUserUseCase {
    return {
        execute(id: string): Promise<void> {
            return userRepository.delete(id);
        }
    };
}
