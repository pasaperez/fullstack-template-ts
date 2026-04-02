import { ThemeContext, type ThemeContextValue, useTheme } from '@app/providers/themeContext';
import { defaultThemeId, themeCatalog } from '@app/theme/themes';
import { renderHook } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

function createThemeContextValue(): ThemeContextValue {
    return { activeTheme: themeCatalog[0], selectTheme: vi.fn(), themes: themeCatalog };
}

describe('useTheme', () => {
    it('throws when it is used outside the provider tree', () => {
        expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used within ThemeProvider.');
    });

    it('returns the current theme context when it is available', () => {
        const wrapper = ({ children }: { children: ReactNode; }): ReactElement => (
            <ThemeContext.Provider value={createThemeContextValue()}>{children}</ThemeContext.Provider>
        );
        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.activeTheme.id).toBe(defaultThemeId);
        expect(result.current.themes).toHaveLength(themeCatalog.length);
    });
});
