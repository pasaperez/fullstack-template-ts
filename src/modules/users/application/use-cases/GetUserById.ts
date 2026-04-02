import type { UserRepository } from '@modules/users/domain/ports/UserRepository';
import type { User } from '@modules/users/domain/User';

type GetUserByIdRepository = Pick<UserRepository, 'getById'>;

export interface GetUserByIdUseCase {
    execute(id: string): Promise<User | null>;
}

export function createGetUserById({ userRepository }: { userRepository: GetUserByIdRepository; }): GetUserByIdUseCase {
    return {
        execute(id: string): Promise<User | null> {
            return userRepository.getById(id);
        }
    };
}
