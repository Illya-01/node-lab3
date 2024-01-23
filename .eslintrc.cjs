module.exports = {
   env: {
      es2021: true,
      node: true,
   },
   extends: ['eslint:all', 'plugin:sonarjs/recommended'],
   plugins: ['sonarjs'],
   overrides: [
      {
         env: {
            node: true,
         },
         files: ['.eslintrc.{js,cjs}'],
         parserOptions: {
            sourceType: 'script',
         },
      },
   ],
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
   },
   rules: {
      'no-console': 'off',
      'one-var': 'off',
      'sort-keys': 'warn',
      'no-void': 'warn',
   },
   ignorePatterns: ['.eslintrc.*'],
}
