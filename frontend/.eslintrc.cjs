module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'public/mockServiceWorker.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
    },
    settings: { react: { version: '18.2' } },
    plugins: ['react-refresh', '@typescript-eslint'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
    overrides: [
        {
            files: ['tests/**/*.tsx', 'tests/**/*.ts'],
            rules: {
                'react-refresh/only-export-components': 'off',
            },
        },
    ],
}

