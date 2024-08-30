import js from "@eslint/js";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginPrettier from "eslint-plugin-prettier";
import * as tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      jsdoc: eslintPluginJsdoc,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/typedef": [
        "error",
        {
          arrowParameter: true,
          variableDeclaration: true,
        },
      ],

      // JSDoc rules
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      "jsdoc/require-description": "error",
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "error",
      "jsdoc/valid-types": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/no-undefined-types": "error",
      "jsdoc/require-description-complete-sentence": "error",
      "jsdoc/require-example": [
        "warn",
        {
          exemptedBy: ["private"],
          contexts: [
            "ExportDefaultDeclaration",
            "ExportNamedDeclaration",
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "TSEnumDeclaration",
            "TSModuleDeclaration",
          ],
        },
      ],
      "jsdoc/require-file-overview": [
        "error",
        {
          tags: {
            description: {
              mustExist: true,
              preventDuplicates: true,
            },
          },
        },
      ],

      // General code style rules
      "prettier/prettier": "error",
      "no-console": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
      "no-param-reassign": "error",
      "max-lines-per-function": ["error", 50],
      complexity: ["error", 5],
      "max-depth": ["error", 3],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "vitest.config.ts"],
    rules: {
      // Explicitly disable file overview requirement for test files
      "jsdoc/require-file-overview": "off",
      // Optionally, you can disable other JSDoc requirements for test files
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
];

export const ignores = [
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".git",
  "old",
  "playwright-report",
];
