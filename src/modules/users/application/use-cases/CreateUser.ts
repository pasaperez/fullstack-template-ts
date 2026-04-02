import type { UserRepository } from '@modules/users/domain/ports/UserRepository';
import type { CreateUserData, User } from '@modules/users/domain/User';

type CreateUserRepository = Pick<UserRepository, 'create'>;

export interface CreateUserUseCase {
    execute(input: CreateUserData): Promise<User>;
}

export function createCreateUser({ userRepository }: { userRepository: CreateUserRepository; }): CreateUserUseCase {
    return {
        execute(input: CreateUserData): Promise<User> {
            return userRepository.create(input);
        }
    };
}
