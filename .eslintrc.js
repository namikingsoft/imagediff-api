module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:flowtype/recommended',
  ],
  parser: 'babel-eslint',
  plugins: [
    'flowtype',
  ],
  rules: {
    'import/prefer-default-export': 0,
    'no-mixed-operators': 0,
    'no-continue': 0,
    'no-console': 0,
    'arrow-parens': [2, 'as-needed'],
  },
};
