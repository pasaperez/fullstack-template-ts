'use client';

import { UsersView } from '@modules/users/presentation/components/UsersView';
import { useUsersPage } from '@modules/users/presentation/hooks/useUsersPage';
import type { UsersPageProps } from '@modules/users/presentation/UsersPresentationContracts';
import type { ReactElement } from 'react';

export function UsersClient(props: UsersPageProps): ReactElement {
    return <UsersView {...useUsersPage(props)} />;
}
