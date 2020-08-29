module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-typescript/base',
    ],
    rules: {
        '@typescript-eslint/indent': ['warn', 4],
        'no-param-reassign':'off',
        'no-underscore-dangle':'off',
        'import/prefer-default-export':'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'all',
                argsIgnorePattern: '^_',
            }
        ],
        'new-cap': [
            'error',
            {
                newIsCapExceptions: ['moment','this.model','model'],
                capIsNewExceptions: ['Router'],
            }
        ],
        quotes: [
            'error',
            'single',
        ],
        '@typescript-eslint/no-var-requires':'off',
        'no-continue':'off',
        'no-restricted-syntax':['warn'],
        'no-await-in-loop':['warn'],
        'nonblock-statement-body-position':'off',
    }
};
