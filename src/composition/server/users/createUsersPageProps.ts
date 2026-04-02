import { getUsersModule } from '@composition/server/users/getUsersModule';
import { createUserAction, deleteUserAction, updateUserAction } from '@composition/server/users/usersActions';
import type { User } from '@modules/users/domain/User';
import type { UsersPageProps, UsersServerActions } from '@modules/users/presentation/UsersPresentationContracts';
import { getErrorMessage } from '@shared/domain/getErrorMessage';

export async function createUsersPageProps(): Promise<UsersPageProps> {
    const usersModule = getUsersModule();
    let initialUsers: User[] = [];
    let loadErrorMessage: string | undefined;
    const actions: UsersServerActions = { createUser: createUserAction, deleteUser: deleteUserAction, updateUser: updateUserAction };

    try {
        initialUsers = await usersModule.useCases.listUsers.execute();
    } catch (error) {
        loadErrorMessage = getErrorMessage(error, 'Could not load users.');
    }

    return { actions, initialUsers, loadErrorMessage };
}
