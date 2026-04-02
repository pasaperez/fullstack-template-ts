export interface User {
    readonly createdAt: string;
    readonly email: string;
    readonly id: string;
    readonly name: string;
    readonly updatedAt: string;
}

export interface CreateUserData {
    readonly email: string;
    readonly name: string;
}

export interface UpdateUserData extends CreateUserData {
    readonly id: string;
}

export function sortUsersByNewest(users: readonly User[]): User[] {
    return [...users].sort((left: User, right: User) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}
