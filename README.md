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

运行时仅使用 Node 标准库，监听 `AIO_PLUGIN_PORT`，提供 `GET /health`、`GET /aio/definition`、`POST /aio/action` 与 `/echo`。动作处理从宿主注入的当前 `body.state` 计算下一页面体，不在 Node 进程保存租户状态；AIO 负责持久化、动作白名单、RBAC 和用户/租户上下文注入。插件容器没有外网、宿主文件系统或数据库权限。
