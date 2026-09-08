# AIO TypeScript 进程插件

这是使用固定 pnpm 和 TypeScript 工具链构建的 AIO `process` 示例插件。它贡献一个语言无关的 `PageDefinition` 页面和一个受限的 `/echo` 后端路由。

```bash
corepack enable
pnpm install --frozen-lockfile --ignore-scripts
pnpm typecheck
pnpm test
pnpm build
aio plugin validate
```

运行时仅使用 Node 标准库，监听 `AIO_PLUGIN_PORT`，提供 `GET /health`、`GET /aio/definition` 与 `/echo`。AIO 通过隔离内部网络转发请求并注入当前用户和租户；插件容器没有外网、宿主文件系统或数据库权限。
