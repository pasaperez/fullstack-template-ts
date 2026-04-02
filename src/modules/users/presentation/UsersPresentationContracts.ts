import type { UpdateUserData, User } from '@modules/users/domain/User';
import type { UserFormValues } from '@modules/users/presentation/forms/UserFormSchema';

export type UserMutationResult = { readonly ok: false; readonly errorMessage: string; } | { readonly ok: true; readonly user: User; };

export type DeleteUserResult = { readonly deletedUserId: string; readonly ok: true; } | {
    readonly errorMessage: string;
    readonly ok: false;
};

export interface UsersServerActions {
    readonly createUser: (input: UserFormValues) => Promise<UserMutationResult>;
    readonly deleteUser: (input: { readonly id: string; }) => Promise<DeleteUserResult>;
    readonly updateUser: (input: UpdateUserData) => Promise<UserMutationResult>;
}

export interface UsersPageProps {
    readonly actions: UsersServerActions;
    readonly initialUsers: User[];
    readonly loadErrorMessage?: string | undefined;
}
