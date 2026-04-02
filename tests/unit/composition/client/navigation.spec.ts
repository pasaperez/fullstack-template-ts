import { navigationItems, projectName, projectSubtitle } from '@composition/client/navigation';
import { describe, expect, it } from 'vitest';

describe('navigation', () => {
    it('exposes the fullstack users navigation metadata', () => {
        expect(projectName).toBe('Fullstack Template TS');
        expect(projectSubtitle).toBe('Scalable Next.js foundation');
        expect(navigationItems).toEqual([{
            description: 'Core routes for the fullstack workspace.',
            href: '/users',
            id: 'users',
            label: 'Users',
            shortLabel: 'U'
        }]);
    });
});
