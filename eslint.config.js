import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Enforce non-empty alt text on images and equivalent custom components
      "jsx-a11y/alt-text": [
        "error",
        {
          elements: ["img", "object", "area", "input[type=\"image\"]"],
          img: ["LazyImage", "ResponsiveImage", "AvatarImage"],
        },
      ],
      // Avoid redundant words like "image", "photo" in alt text
      "jsx-a11y/img-redundant-alt": "warn",
    },
  },
);
