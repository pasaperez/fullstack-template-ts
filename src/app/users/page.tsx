import { createUsersPageProps } from '@composition/server/users/createUsersPageProps';
import { UsersClient } from '@modules/users/presentation/components/UsersClient';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    description: 'Accessible users CRUD page with server-rendered data, validated server actions, and clear status feedback.',
    title: 'Users'
};

export default async function UsersIndexPage(): Promise<ReactElement> {
    return <UsersClient {...await createUsersPageProps()} />;
}
