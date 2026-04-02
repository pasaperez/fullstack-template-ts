const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const boundaries = require('eslint-plugin-boundaries');
const reactHooks = require('eslint-plugin-react-hooks');
const nextPlugin = require('@next/eslint-plugin-next');
const globals = require('globals');

module.exports = [
    { ignores: ['.next', 'coverage', 'node_modules', '.dependency-cruiser.cjs', 'eslint.config.cjs', 'next-env.d.ts'] },
    js.configs.recommended,
    ...tsPlugin.configs['flat/recommended-type-checked'],
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: { project: ['./tsconfig.json'], tsconfigRootDir: __dirname, sourceType: 'module', ecmaFeatures: { jsx: true } },
            ecmaVersion: 2022,
            globals: { ...globals.browser, ...globals.node }
        },
        plugins: { '@next/next': nextPlugin, boundaries, 'react-hooks': reactHooks },
        settings: {
            'boundaries/elements': [
                { type: 'app', pattern: 'src/app/**/*' },
                { type: 'composition', pattern: 'src/composition/**/*' },
                { type: 'shared-domain', pattern: 'src/shared/domain/**/*' },
                { type: 'shared-infrastructure', pattern: 'src/shared/infrastructure/**/*' },
                { type: 'shared-ui', pattern: 'src/shared/ui/**/*' },
                { type: 'module-domain', pattern: 'src/modules/*/domain/**/*' },
                { type: 'module-application', pattern: 'src/modules/*/application/**/*' },
                { type: 'module-infrastructure', pattern: 'src/modules/*/infrastructure/**/*' },
                { type: 'module-presentation', pattern: 'src/modules/*/presentation/**/*' },
                { type: 'module-config', pattern: 'src/modules/*/config/**/*' }
            ]
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'boundaries/dependencies': ['error', {
                default: 'disallow',
                rules: [
                    {
                        from: { type: 'app' },
                        allow: {
                            to: {
                                type: ['app', 'composition', 'shared-domain', 'shared-infrastructure', 'shared-ui', 'module-presentation']
                            }
                        }
                    },
                    {
                        from: { type: 'composition' },
                        allow: {
                            to: {
                                type: [
                                    'composition',
                                    'shared-domain',
                                    'shared-infrastructure',
                                    'shared-ui',
                                    'module-domain',
                                    'module-application',
                                    'module-infrastructure',
                                    'module-presentation',
                                    'module-config'
                                ]
                            }
                        }
                    },
                    { from: { type: 'shared-domain' }, allow: { to: { type: ['shared-domain'] } } },
                    { from: { type: 'shared-infrastructure' }, allow: { to: { type: ['shared-domain', 'shared-infrastructure'] } } },
                    { from: { type: 'shared-ui' }, allow: { to: { type: ['shared-domain', 'shared-ui'] } } },
                    { from: { type: 'module-domain' }, allow: { to: { type: ['module-domain', 'shared-domain'] } } },
                    {
                        from: { type: 'module-application' },
                        allow: { to: { type: ['module-domain', 'module-application', 'shared-domain', 'shared-infrastructure'] } }
                    },
                    {
                        from: { type: 'module-infrastructure' },
                        allow: {
                            to: {
                                type: [
                                    'module-domain',
                                    'module-application',
                                    'module-infrastructure',
                                    'shared-domain',
                                    'shared-infrastructure'
                                ]
                            }
                        }
                    },
                    {
                        from: { type: 'module-presentation' },
                        allow: {
                            to: {
                                type: [
                                    'module-domain',
                                    'module-application',
                                    'module-presentation',
                                    'shared-domain',
                                    'shared-infrastructure',
                                    'shared-ui'
                                ]
                            }
                        }
                    },
                    {
                        from: { type: 'module-config' },
                        allow: {
                            to: {
                                type: [
                                    'module-domain',
                                    'module-application',
                                    'module-infrastructure',
                                    'module-presentation',
                                    'module-config',
                                    'shared-domain',
                                    'shared-infrastructure',
                                    'shared-ui'
                                ]
                            }
                        }
                    }
                ]
            }]
        }
    },
    { files: ['src/**/*.ts', 'src/**/*.tsx'], rules: { '@typescript-eslint/explicit-function-return-type': 'error' } },
    {
        files: ['src/modules/*/domain/**/*.ts', 'src/modules/*/application/**/*.ts', 'src/shared/domain/**/*.ts'],
        rules: { '@typescript-eslint/typedef': ['error', { arrowParameter: true, variableDeclaration: true }] }
    },
    {
        files: ['tests/**/*.ts', 'tests/**/*.tsx'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                afterEach: 'readonly',
                beforeEach: 'readonly',
                describe: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                vi: 'readonly'
            }
        },
        rules: { '@typescript-eslint/unbound-method': 'off' }
    }
];
