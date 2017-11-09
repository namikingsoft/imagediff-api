module.exports = {
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
    'arrow-parens': [2, 'as-needed'],
  },
};
