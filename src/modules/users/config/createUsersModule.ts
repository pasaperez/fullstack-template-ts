import { createCreateUser, type CreateUserUseCase } from '@modules/users/application/use-cases/CreateUser';
import { createDeleteUser, type DeleteUserUseCase } from '@modules/users/application/use-cases/DeleteUser';
import { createGetUserById, type GetUserByIdUseCase } from '@modules/users/application/use-cases/GetUserById';
import { createListUsers, type ListUsersUseCase } from '@modules/users/application/use-cases/ListUsers';
import { createUpdateUser, type UpdateUserUseCase } from '@modules/users/application/use-cases/UpdateUser';
import type { UserRepository } from '@modules/users/domain/ports/UserRepository';

export interface UsersModule {
    readonly useCases: {
        readonly createUser: CreateUserUseCase;
        readonly deleteUser: DeleteUserUseCase;
        readonly getUserById: GetUserByIdUseCase;
        readonly listUsers: ListUsersUseCase;
        readonly updateUser: UpdateUserUseCase;
    };
}

interface CreateUsersModuleOptions {
    readonly userRepository: UserRepository;
}

export function createUsersModule(options: CreateUsersModuleOptions): UsersModule {
    return {
        useCases: {
            createUser: createCreateUser({ userRepository: options.userRepository }),
            deleteUser: createDeleteUser({ userRepository: options.userRepository }),
            getUserById: createGetUserById({ userRepository: options.userRepository }),
            listUsers: createListUsers({ userRepository: options.userRepository }),
            updateUser: createUpdateUser({ userRepository: options.userRepository })
        }
    };
}
