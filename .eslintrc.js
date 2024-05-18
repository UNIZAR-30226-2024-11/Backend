module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:prettier/recommended",
    "prettier",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  plugins: ["@typescript-eslint", "prettier", "import", "unused-imports"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "",
    project: "tsconfig.json",
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    "no-var": "warn",
    "no-unused-vars": "warn",
    semi: "error",
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-multi-spaces": "warn",
    "space-in-parens": "warn",
    "no-multiple-empty-lines": "warn",
    "prefer-const": "warn",
    "unused-imports/no-unused-imports": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
    },
  },
};
