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
     'keyword-spacing':0,
     'no-undef':0,
     'padded-blocks':0,
     'vue/no-duplicate-attributes':0,
     'no-multi-spaces':0,
     'no-unused-vars':0,
     'eol-last':0,
     'handle-callback-err':0,
     'no-multiple-empty-lines':0,
     'space-infix-ops':0,
     'eqeqeq':0,
     'no-labels':0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
