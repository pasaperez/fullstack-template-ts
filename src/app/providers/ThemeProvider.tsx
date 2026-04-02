'use client';

import { ThemeContext } from '@app/providers/themeContext';
import { readStorageValue, writeStorageValue } from '@app/storage/safeStorage';
import { defaultThemeId, themeCatalog, type ThemeDefinition, type ThemeId } from '@app/theme/themes';
import { type CSSProperties, type ReactElement, type ReactNode, useSyncExternalStore } from 'react';

const themeStorageKey = 'fullstack-template-ts.theme';
const themeStorageEvent = 'fullstack-template-ts.theme.change';

interface ThemeProviderProps {
    children: ReactNode;
}

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

function getThemeById(themeId: string): ThemeDefinition {
    return themeCatalog.find((theme: ThemeDefinition) => theme.id === themeId) ?? themeCatalog[0];
}

function readStoredThemeId(storage: Storage): ThemeId {
    const storedThemeId: string | null = readStorageValue(storage, themeStorageKey);
    return getThemeById(storedThemeId ?? defaultThemeId).id;
}

function createThemeStyle(theme: ThemeDefinition): ThemeStyle {
    return {
        '--accent': theme.tokens.accent,
        '--accent-contrast': theme.tokens.accentContrast,
        '--accent-strong': theme.tokens.accentStrong,
        '--background-end': theme.tokens.backgroundEnd,
        '--background-left': theme.tokens.backgroundLeft,
        '--background-middle': theme.tokens.backgroundMiddle,
        '--background-start': theme.tokens.backgroundStart,
        '--background-top-right': theme.tokens.backgroundTopRight,
        '--button-shadow': theme.tokens.buttonShadow,
        '--danger-ink': theme.tokens.dangerInk,
        '--danger-surface': theme.tokens.dangerSurface,
        '--focus-ring': theme.tokens.focusRing,
        '--ink': theme.tokens.ink,
        '--ink-muted': theme.tokens.inkMuted,
        '--input-background': theme.tokens.inputBackground,
        '--input-border': theme.tokens.inputBorder,
        '--row-active': theme.tokens.rowActive,
        '--shadow': theme.tokens.shadow,
        '--subtle-fill': theme.tokens.subtleFill,
        '--surface': theme.tokens.surface,
        '--surface-border': theme.tokens.surfaceBorder,
        '--surface-strong': theme.tokens.surfaceStrong,
        '--table-hover': theme.tokens.tableHover,
        '--warning-ink': theme.tokens.warningInk,
        '--warning-surface': theme.tokens.warningSurface,
        colorScheme: theme.mode
    };
}

function persistTheme(storage: Storage, themeId: ThemeId): void {
    writeStorageValue(storage, themeStorageKey, themeId);
    window.dispatchEvent(new Event(themeStorageEvent));
}

function subscribeToTheme(listener: () => void): () => void {
    const handleStorage = (event: StorageEvent): void => {
        if (event.key === null || event.key === themeStorageKey) {
            listener();
        }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(themeStorageEvent, listener);

    return (): void => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(themeStorageEvent, listener);
    };
}

function getThemeSnapshot(): ThemeId {
    return readStoredThemeId(window.localStorage);
}

function getThemeServerSnapshot(): ThemeId {
    return defaultThemeId;
}

export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
    const themeId: ThemeId = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);
    const activeTheme: ThemeDefinition = getThemeById(themeId);

    function handleThemeSelection(nextThemeId: ThemeId): void {
        persistTheme(window.localStorage, nextThemeId);
    }

    return (
        <ThemeContext.Provider value={{ activeTheme, selectTheme: handleThemeSelection, themes: themeCatalog }}>
            <div className='theme-root' data-theme={activeTheme.id} style={createThemeStyle(activeTheme)}>{children}</div>
        </ThemeContext.Provider>
    );
}
