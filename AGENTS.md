# AGENTS GUIDE (AI 协作指南)

本项目是一个基于 **Vue 3** + **TypeScript** + **Vite 6** + **Element Plus** 的单页应用 (SPA)。
请务必遵循以下规范，保持代码变更微小，遵循现有模式，并避免在修复 Bug 时进行大规模重构。

## 项目概览 (Quick Facts)

- **框架**: Vue 3.x (全量使用 **Composition API** `<script setup lang="ts">`)
- **语言**: TypeScript (用于所有逻辑与组件)
- **构建工具**: Vite 6
- **UI 组件库**: Element Plus (v2.9+)
- **路由**: Vue Router 4
- **Node 版本**: 22.x (详见 package.json)
- **包管理器**: npm
- **测试**: 暂无自动化测试

## 常用指令 (Commands)

- **安装依赖**: `npm install`
- **启动开发环境**: `npm run dev`
- **构建生产环境**: `npm run build`
- **类型检查**: `vue-tsc --noEmit`
- **代码检查**: `npm run lint`

## CI / 工作流 (CI / Workflows)

- **构建**: `.github/workflows/build.yml` (监听 `master`/`dev`)，运行 `npm install` 和 `npm run build`。
- **Docker**: `.github/workflows/docker-build-push.yml` (监听 `master`)，基于 `npm` 构建。

## 目录结构 (Repository Layout)

- `src/main.ts`: 应用入口，插件注册，Vue 挂载
- `src/router/index.ts`: 路由配置 (History 模式)
- `src/views/Subconverter.vue`: 主页面组件
- `src/components/`: 通用 UI 组件
- `src/composables/`: 共享逻辑 (Composables)
- `src/services/`: API 适配与服务层
- `src/plugins/`: Vue 插件注册 (Element Plus, Axios 等)
- `src/utils/`: 工具函数
- `src/config/`: 环境常量与配置项 (含 TS 类型定义)
- `src/icons/svg`: SVG 图标源文件
- `services/`: Docker Compose 服务编排

## 代码规范 (Code Style)

- **缩进**: 2 空格
- **引号**: 单引号 (`'`)
- **分号**: 不使用 (`semi: 0`)
- **Types**: 必须显式定义 Interface/Type，禁止滥用 `any`。
- **组件命名**: 允许单字命名 (`vue/multi-word-component-names: off`)
- **调试**: 生产环境禁止 `console` 和 `debugger`

## 模块与导入 (Imports & Modules)

- 使用 ES Modules (`import`/`export`)。
- 优先使用绝对路径别名 `@` 指代 `src/` (见 `vite.config.ts`)。
- 导入顺序: 核心库 -> 本地配置/工具 -> 服务 -> 组件。

## Vue 开发模式 (Vue Patterns)

- **组件结构**: `<template>`, `<script setup lang="ts">`, `<style>`。
- **状态管理**: 使用 `ref` 或 `reactive` 显式定义状态类型。
- **共享逻辑**: 使用 `src/composables/*.ts`，必须导出强类型对象。
- **Props/Emits**: 使用 `defineProps<{...}>()` 和 `defineEmits<{...}>()` 泛型语法。

## 服务与错误处理 (Services & Error Handling)

- API 调用封装在 `src/services/*Service.ts` 中。
- 必须定义 API 响应数据的 Interface。
- UI 错误提示使用 `ElMessage` 或 `ElNotification`。

## 表单验证 (Validation)

- 使用 `src/utils/validators.ts` 中的验证器。
- 验证函数应返回明确的类型 `{ valid: boolean; message?: string }`。

## 环境配置 (Environment Variables)

- 使用 `import.meta.env` (带 `VITE_` 前缀)。
- 需要在 `src/env.d.ts` 中补充环境变量的类型定义。
- 核心常量位于 `src/config/constants.ts`。

## 图标系统 (Icons)

- 使用 `vite-plugin-svg-icons` 处理 `src/icons/svg`。
- 使用组件: `<svg-icon icon-class="name" />`。

## 存储 (Storage)

- 本地存储辅助函数位于 `src/utils/storage.ts`。
- 复用已实现的 TTL 缓存机制。

## 前端安全与规范 (Frontend Safety)

- 避免内联样式，除非附近代码已大量使用。
- 优先复用 **Element Plus** 组件和现有模式。
- 保持 UI 提示文案的一致性 (简体中文)。

## 针对 Agents 的提示 (Notes for Agents)

- **关键**: 严格遵循 **TypeScript** 规范，优先保证类型安全。
- **文档**: 所有新增/修改的业务逻辑必须包含**标准中文 JSDoc 注释**。
- **工具链**: 已启用 TypeScript，请确保生成的代码通过 `vue-tsc` 检查。
