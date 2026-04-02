/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [{
        name: 'no-cross-module-imports',
        comment: 'Keep modules cohesive and avoid direct imports between different business modules.',
        severity: 'error',
        from: { path: '^src/modules/([^/]+)/' },
        to: { path: '^src/modules/[^/]+/', pathNot: '^src/modules/$1/' }
    }, {
        name: 'domain-stays-pure',
        comment: 'Module domain cannot depend on app, composition, presentation, or infrastructure code.',
        severity: 'error',
        from: { path: '^src/modules/[^/]+/domain/' },
        to: { path: '^src/(app/|composition/|modules/[^/]+/(presentation|infrastructure|config)/)' }
    }, {
        name: 'application-no-concrete-adapters',
        comment: 'Application code depends on domain ports, not on app, presentation, or infrastructure.',
        severity: 'error',
        from: { path: '^src/modules/[^/]+/application/' },
        to: { path: '^src/(app/|composition/|modules/[^/]+/(presentation|infrastructure|config)/)' }
    }, {
        name: 'shared-stays-generic',
        comment: 'Shared code must not depend on app, composition, or feature modules.',
        severity: 'error',
        from: { path: '^src/shared/' },
        to: { path: '^src/(app/|composition/|modules/)' }
    }, {
        name: 'app-avoids-direct-infrastructure',
        comment: 'App routes stay thin and consume composed or presentational entry points.',
        severity: 'error',
        from: { path: '^src/app/' },
        to: { path: '^src/modules/[^/]+/infrastructure/' }
    }],
    options: { tsConfig: { fileName: 'tsconfig.json' }, exclude: { path: ['node_modules', '.next', 'coverage'] } }
};
