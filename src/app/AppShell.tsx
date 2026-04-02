'use client';

import { readStorageValue, writeStorageValue } from '@app/storage/safeStorage';
import { ThemeSelector } from '@app/theme/ThemeSelector';
import { navigationDescription, navigationItems, projectName, projectSubtitle } from '@composition/client/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import { useState, useSyncExternalStore } from 'react';

const sidebarStorageKey = 'fullstack-template-ts.sidebar';
const sidebarStorageEvent = 'fullstack-template-ts.sidebar.change';

function readStoredSidebarState(storage: Storage): boolean {
    return readStorageValue(storage, sidebarStorageKey) === 'collapsed';
}

function persistSidebarState(storage: Storage, isCollapsed: boolean): void {
    writeStorageValue(storage, sidebarStorageKey, isCollapsed ? 'collapsed' : 'expanded');
    window.dispatchEvent(new Event(sidebarStorageEvent));
}

function subscribeToSidebarState(listener: () => void): () => void {
    const handleStorage = (event: StorageEvent): void => {
        if (event.key === null || event.key === sidebarStorageKey) {
            listener();
        }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(sidebarStorageEvent, listener);

    return (): void => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(sidebarStorageEvent, listener);
    };
}

function getSidebarSnapshot(): boolean {
    return readStoredSidebarState(window.localStorage);
}

function getSidebarServerSnapshot(): boolean {
    return false;
}

interface NavigationToggleButtonProps {
    ariaExpanded: boolean;
    ariaLabel: string;
    className: string;
    onClick: () => void;
}

function NavigationToggleButton({ ariaExpanded, ariaLabel, className, onClick }: NavigationToggleButtonProps): ReactElement {
    return (
        <button
            aria-controls='app-sidebar'
            aria-expanded={ariaExpanded}
            aria-label={ariaLabel}
            className={className}
            onClick={onClick}
            type='button'
        >
            <span aria-hidden='true' className='app-header__toggle-icon'>
                <span className='app-header__toggle-bar' />
                <span className='app-header__toggle-bar' />
                <span className='app-header__toggle-bar' />
            </span>
        </button>
    );
}

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps): ReactElement {
    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
    const isSidebarCollapsed: boolean = useSyncExternalStore(subscribeToSidebarState, getSidebarSnapshot, getSidebarServerSnapshot);
    const pathname: string = usePathname();

    function handleSidebarToggle(): void {
        persistSidebarState(window.localStorage, !isSidebarCollapsed);
    }

    return (
        <div
            className={`app-frame${isSidebarCollapsed ? ' app-frame--sidebar-collapsed' : ''}${
                isMobileNavigationOpen ? ' app-frame--mobile-nav-open' : ''
            }`}
        >
            <a className='skip-link' href='#main-content'>Skip to main content</a>
            {isMobileNavigationOpen
                ? (
                    <button
                        aria-label='Close navigation'
                        className='app-backdrop'
                        onClick={() => setIsMobileNavigationOpen(false)}
                        type='button'
                    />
                )
                : null}
            <header className='app-header'>
                <div className='app-header__brand-group'>
                    <NavigationToggleButton
                        ariaExpanded={!isSidebarCollapsed}
                        ariaLabel={isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
                        className='app-header__toggle app-header__toggle--desktop'
                        onClick={handleSidebarToggle}
                    />
                    <NavigationToggleButton
                        ariaExpanded={isMobileNavigationOpen}
                        ariaLabel={isMobileNavigationOpen ? 'Close menu' : 'Open menu'}
                        className='app-header__toggle app-header__toggle--mobile'
                        onClick={() => setIsMobileNavigationOpen((currentValue: boolean) => !currentValue)}
                    />
                    <div className='app-brand'>
                        <Link className='app-brand__title' href='/users'>{projectName}</Link>
                        <span className='app-brand__subtitle'>{projectSubtitle}</span>
                    </div>
                </div>
                <div className='app-header__actions'>
                    <ThemeSelector />
                </div>
            </header>
            <div className='app-body'>
                <aside aria-label='Primary navigation' className='app-sidebar' id='app-sidebar'>
                    <div className='app-sidebar__inner'>
                        <div className='app-sidebar__intro'>
                            <span className='app-sidebar__eyebrow'>Navigation</span>
                            <p className='app-sidebar__description'>{navigationDescription}</p>
                        </div>
                        <nav aria-label='Main navigation' className='app-nav'>
                            {navigationItems.map((item) => (
                                <Link
                                    aria-current={pathname === item.href ? 'page' : undefined}
                                    className={`app-nav__link${pathname === item.href ? ' app-nav__link--active' : ''}`}
                                    key={item.id}
                                    onClick={() => setIsMobileNavigationOpen(false)}
                                    href={item.href}
                                    title={item.description}
                                >
                                    <span aria-hidden='true' className='app-nav__icon'>{item.shortLabel}</span>
                                    <span className='app-nav__label'>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main className='app-main' id='main-content'>{children}</main>
            </div>
        </div>
    );
}
