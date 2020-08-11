const config = {
  plugins: ['prefer-let'],
  parser: '@typescript-eslint/parser',
  extends: [
    // Uses the recommended rules from @eslint-plugin-react
    'plugin:react/recommended',
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'prettier/@typescript-eslint',
    // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2018,
    // Allows for the use of imports
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // "@typescript-eslint/interface-name-prefix": ["error", "always"],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 0,
    // Checks rules of React Hooks
    'react-hooks/rules-of-hooks': 'error',
    // Checks React Hooks effect dependencies
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-let/prefer-let': 2,
    'prefer-const': 'off',
    // "react/display-name": "off",
    'react/react-in-jsx-scope': 'off',
    'comma-dangle': 'off',
  },
}

module.exports = config
