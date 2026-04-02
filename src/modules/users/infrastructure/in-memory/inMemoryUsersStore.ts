import type { User } from '@modules/users/domain/User';

export const inMemoryUsersStore = new Map<string, User>();
