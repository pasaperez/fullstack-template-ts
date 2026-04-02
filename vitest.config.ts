import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDirectory: string = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@app': path.resolve(rootDirectory, 'src/app'),
            '@composition': path.resolve(rootDirectory, 'src/composition'),
            '@modules': path.resolve(rootDirectory, 'src/modules'),
            '@shared': path.resolve(rootDirectory, 'src/shared'),
            '@tests': path.resolve(rootDirectory, 'tests')
        }
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setup/vitest.setup.ts'],
        include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/modules/users/domain/ports/**/*.ts', 'src/modules/users/presentation/UsersPresentationContracts.ts'],
            thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 }
        }
    }
});
