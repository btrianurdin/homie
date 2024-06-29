// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPrettier from "eslint-plugin-prettier/recommended";

export default withNuxt(eslintPrettier, {
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
});
