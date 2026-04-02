import { UserNotFoundError } from '@modules/users/domain/errors/UserNotFoundError';
import type { UserRepository } from '@modules/users/domain/ports/UserRepository';
import type { CreateUserData, UpdateUserData, User } from '@modules/users/domain/User';

interface InMemoryUserRepositoryOptions {
    readonly clock?: () => Date;
    readonly createId?: () => string;
    readonly store: Map<string, User>;
}

export class InMemoryUserRepository implements UserRepository {
    readonly #clock: () => Date;
    readonly #createId: () => string;
    readonly #store: Map<string, User>;

    constructor({ clock = (): Date => new Date(), createId = (): string => crypto.randomUUID(), store }: InMemoryUserRepositoryOptions) {
        this.#clock = clock;
        this.#createId = createId;
        this.#store = store;
    }

    create(input: CreateUserData): Promise<User> {
        const timestamp: string = this.#clock().toISOString();
        const user: User = { createdAt: timestamp, email: input.email, id: this.#createId(), name: input.name, updatedAt: timestamp };

        this.#store.set(user.id, user);

        return Promise.resolve(user);
    }

    delete(id: string): Promise<void> {
        if (!this.#store.delete(id)) {
            return Promise.reject(new UserNotFoundError(id));
        }

        return Promise.resolve();
    }

    getById(id: string): Promise<User | null> {
        return Promise.resolve(this.#store.get(id) ?? null);
    }

    list(): Promise<User[]> {
        return Promise.resolve(Array.from(this.#store.values()));
    }

    update(input: UpdateUserData): Promise<User> {
        const currentUser: User | undefined = this.#store.get(input.id);

        if (currentUser === undefined) {
            return Promise.reject(new UserNotFoundError(input.id));
        }

        const user: User = { ...currentUser, email: input.email, name: input.name, updatedAt: this.#clock().toISOString() };

        this.#store.set(user.id, user);

        return Promise.resolve(user);
    }
}
