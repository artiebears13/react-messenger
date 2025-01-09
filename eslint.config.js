import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Основные настройки для файлов JS, MJS, CJS, JSX
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
  },
  // Рекомендуемые правила ESLint
  pluginJs.configs.recommended,
  // Рекомендуемые правила плагина React (Flat Config)
  pluginReact.configs.flat.recommended,
  // Дополнительные правила для проверки prop-types
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      // Вы можете настроить уровень строгости: "off", "warn", "error"
      // Например, для более строгой проверки:
      // "react/prop-types": ["error", { ignore: ["children"] }],
    },
  },
];
