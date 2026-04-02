import { shouldCloseThemeSelectorFromKey, shouldCloseThemeSelectorFromPointer } from '@app/theme/ThemeSelector';
import { describe, expect, it } from 'vitest';

describe('theme selector helpers', () => {
    it('detects the escape key as a close interaction', () => {
        expect(shouldCloseThemeSelectorFromKey('Escape')).toBe(true);
        expect(shouldCloseThemeSelectorFromKey('Enter')).toBe(false);
    });

    it('detects outside pointer targets without closing for inside targets', () => {
        const container = document.createElement('div');
        const child = document.createElement('span');

        container.appendChild(child);
        document.body.appendChild(container);

        expect(shouldCloseThemeSelectorFromPointer(container, document.body)).toBe(true);
        expect(shouldCloseThemeSelectorFromPointer(container, child)).toBe(false);
        expect(shouldCloseThemeSelectorFromPointer(null, document.body)).toBe(false);
    });
});
