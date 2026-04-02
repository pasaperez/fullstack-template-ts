import { createUsersModule, type UsersModule } from '@modules/users/config/createUsersModule';
import { InMemoryUserRepository } from '@modules/users/infrastructure/in-memory/InMemoryUserRepository';
import { inMemoryUsersStore } from '@modules/users/infrastructure/in-memory/inMemoryUsersStore';

const userRepository = new InMemoryUserRepository({ store: inMemoryUsersStore });
const usersModule = createUsersModule({ userRepository });

export function getUsersModule(): UsersModule {
    return usersModule;
}
