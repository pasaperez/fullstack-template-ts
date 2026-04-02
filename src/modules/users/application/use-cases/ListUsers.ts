import type { UserRepository } from '@modules/users/domain/ports/UserRepository';
import { sortUsersByNewest, type User } from '@modules/users/domain/User';

type ListUsersRepository = Pick<UserRepository, 'list'>;

export interface ListUsersUseCase {
    execute(): Promise<User[]>;
}

export function createListUsers({ userRepository }: { userRepository: ListUsersRepository; }): ListUsersUseCase {
    return {
        async execute(): Promise<User[]> {
            const users: User[] = await userRepository.list();

            return sortUsersByNewest(users);
        }
    };
}
