import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier", // Prettier와 충돌 방지
  ),
  {
    plugins: {
      prettier: prettierPlugin, // Prettier 플러그인 추가
    },
    rules: {
      "prettier/prettier": "error", // Prettier 규칙 위반 시 ESLint 에러 발생
      "@next/next/no-img-element": "off", // next/image 규칙 비활성
    },
  },
];

export default eslintConfig;
