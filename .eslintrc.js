module.exports = {
    extends: 'standard',
    plugins: ['jest'],
    rules: {
        semi: ['warn', 'never'],
        quotes: ['warn', 'single'],
        eqeqeq: ['warn', 'always'],
        "space-before-function-paren": 0,
        'no-multi-spaces': 1,
        'no-empty-pattern': 1,
        'eol-last': 0,
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
    },
    env: {
        jest: true,
        es6: true,
        node: true
    }
};