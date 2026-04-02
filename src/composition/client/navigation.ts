import type { Route } from 'next';

export const projectName = 'Fullstack Template TS';
export const projectSubtitle = 'Scalable Next.js foundation';
export const navigationDescription = 'Core routes for the fullstack workspace.';

export interface NavigationItem {
    readonly description: string;
    readonly href: Route;
    readonly id: string;
    readonly label: string;
    readonly shortLabel: string;
}

export const navigationItems: readonly NavigationItem[] = [{
    description: navigationDescription,
    href: '/users',
    id: 'users',
    label: 'Users',
    shortLabel: 'U'
}];
