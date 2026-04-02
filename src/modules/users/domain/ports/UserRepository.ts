import type { CreateUserData, UpdateUserData, User } from '@modules/users/domain/User';

export interface UserRepository {
    create(input: CreateUserData): Promise<User>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<User | null>;
    list(): Promise<User[]>;
    update(input: UpdateUserData): Promise<User>;
}
