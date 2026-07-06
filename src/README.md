# 源码模块（src/）

`app.js` 是**生成产物**，由本目录下的模块按文件名顺序拼接而成。运行时（`index.html`、
Electron、`启动.bat`）加载的始终是根目录的 `app.js`，因此**双击 index.html 即用**的方式完全不变，
不给运行时引入任何构建依赖。

## 为什么这样拆

整个应用共享一个全局作用域，很多顶层代码（如 `VIEW_RENDERERS`、初始化调用）依赖
“同一脚本内函数声明整体提升”。若拆成多个 `<script>` 会打断跨文件提升而报错；改成 ES 模块
又要给上百个函数逐个加 `export`/`import`，改动巨大且易错。按顺序**拼接**成单文件可以
100% 保持原有运行语义——生成的 `app.js` 与原手写单文件**逐字节等价**。

## 模块划分

| 文件 | 内容 |
| --- | --- |
| `00-core.js` | 全局状态、DOM 引用、`render()`（仅渲染当前视图）、存储/备份、活动配置、指标 |
| `01-focus-prospects.js` | 具体产品聚焦、潜客列表/详情、邮件/WhatsApp 序列、发件箱 |
| `02-inbox-relay.js` | 统一收件箱、跨渠道接力 |
| `03-ai-scoring-crm.js` | AI 意图/回复建议、客户评分、CRM 看板 |
| `04-analytics-discovery.js` | 数据分析看板、搜索导入解析、序列生成 |
| `05-i18n-webhook-autopilot.js` | 多语言开场、Webhook 联调、自动驾驶、导航徽标 |
| `06-ui-ai-engine-contacts.js` | 深色模式、命令面板、抽屉、快捷回复、Claude API、找联系人、联网找客户 |
| `07-agent-blacklist-send-init.js` | AI 应答护栏、退订黑名单、发送安全阀、Agent 事件、工具函数、导航与初始化 |

## 修改流程

1. 编辑 `src/` 下对应模块。
2. 运行 `npm run build`（即 `node build.mjs`）重新生成根目录 `app.js`。
3. 刷新应用查看效果。

> 拆分边界正好落在顶层 `/* ---------- ... ---------- */` 分节注释处，不会切断任何函数或对象字面量。
