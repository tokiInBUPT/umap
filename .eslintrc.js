module.exports = {
    root: true,

    env: {
        node: true,
    },

    parserOptions: {
        parser: '@typescript-eslint/parser',
    },

    rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'vue/no-duplicate-attributes': [
            'error',
            {
                allowCoexistClass: true,
                allowCoexistStyle: true,
            },
        ],
    },

    extends: ['alloy', 'alloy/vue', 'plugin:vue/vue3-essential', '@vue/prettier', '@vue/typescript'],
}
