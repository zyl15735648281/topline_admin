module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  "rules":{
     "indent":0,
     "spaced-comment":0,
     "space-before-function-paren":0,
     "comma-spacing":0,
     "semi":0,
     "quotes":0,
     "comma-dangle":0,
     "no-sequences":0,
     "no-unused-expressions":0,
     "key-spacing":0,
     "no-trailing-spaces":0,
     "object-curly-spacing":0,
     "space-before-blocks":0,
     'keyword-spacing':0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
