import type { UserRepository } from '@modules/users/domain/ports/UserRepository';
import type { UpdateUserData, User } from '@modules/users/domain/User';

type UpdateUserRepository = Pick<UserRepository, 'update'>;

export interface UpdateUserUseCase {
    execute(input: UpdateUserData): Promise<User>;
}

export function createUpdateUser({ userRepository }: { userRepository: UpdateUserRepository; }): UpdateUserUseCase {
    return {
        execute(input: UpdateUserData): Promise<User> {
            return userRepository.update(input);
        }
    };
}
