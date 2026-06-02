import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },

  // JavaScript 基础规则
  js.configs.recommended,

  // TypeScript 规则
  ...tseslint.configs.recommended,

  // Vue 3 规则
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Vue
      'vue/multi-word-component-names': 'off',   // 单词组件名在此项目中允许
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],

      // 通用
      'no-console': 'off',
    },
  },

  // 构建脚本与配置文件运行在 Node 环境（postcss/tailwind/eslint/vite 配置等）
  {
    files: ['**/*.{js,cjs,mjs}', '*.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // CommonJS 脚本允许 require 风格导入
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
)
