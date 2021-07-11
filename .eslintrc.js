module.exports = {
  root: true,

  env: {
    browser: true,
    node: true
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript"
  ],

  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
