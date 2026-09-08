import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";

test("serves health page definition and trusted runtime context", async () => {
  const port = 19080;
  const child = spawn(process.execPath, ["dist/service/server.js"], {
    env: { ...process.env, AIO_PLUGIN_PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    await once(child.stdout, "data");
    const health = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(await health.text(), "ok");

    const definition = await fetch(`http://127.0.0.1:${port}/aio/definition`);
    const pages = await definition.json();
    assert.equal(pages[0].id, "ts-process");
    assert.equal(pages[0].body.kind, "actions");
    assert.equal(pages[0].body.content, "计数：0");

    const action = await fetch(`http://127.0.0.1:${port}/aio/action`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-aio-tenant-id": "tenant-test",
        "x-aio-user-id": "user-test",
      },
      body: JSON.stringify({
        kind: "page_action",
        page_id: "ts-process",
        action_id: "increment",
        tenant_id: "tenant-test",
        user_id: "user-test",
      }),
    });
    assert.deepEqual(await action.json(), {
      body: {
        kind: "actions",
        title: "TypeScript 进程插件 v2 已在线",
        content: "计数：1",
        actions: [{ id: "increment", label: "TypeScript +1" }],
      },
    });

    const echo = await fetch(`http://127.0.0.1:${port}/echo?value=1`, {
      method: "POST",
      headers: {
        "content-type": "text/plain",
        "x-aio-tenant-id": "tenant-test",
        "x-aio-user-id": "user-test",
      },
      body: "hello",
    });
    assert.deepEqual(await echo.json(), {
      runtime: "node-typescript",
      version: 2,
      method: "POST",
      path: "/echo",
      query: "value=1",
      body: "hello",
      tenant_id: "tenant-test",
      user_id: "user-test",
    });
  } finally {
    child.kill("SIGTERM");
    await once(child, "exit");
  }
});
