module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 1,
    'no-unused-vars': 1,
    'max-len': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-new': 0,
  },
  globals: {},
  settings: {
    'import/resolver': {
      webpack: {
        config: 'config/webpack.common.js',
      },
    },
  },
};
