# 自动化外贸开发系统

这是一个本地可运行的外贸自动化开发管理系统。核心流程是：输入产品和目标市场，系统生成搜索任务；把 Google、LinkedIn、目录、海关数据或第三方采集结果粘贴/导入后，系统解析成线索池，再生成邮箱/WhatsApp 触达内容、发信队列、跟进任务，并通过「管理」模块统一管理活动、任务、审批、账号、规则和线索阶段。

## 已具备

- 开发活动配置：产品、目标市场、客户类型、卖点、认证、署名和每日开发上限。
- 搜索自动化：按进口商/经销商、批发目录、采购负责人、LinkedIn、零售商供应商入口、协会名录、海关数据、竞品渠道生成搜索任务。
- 搜索结果导入：粘贴公司官网、Google 结果、LinkedIn 公司页、邮箱、电话或 CSV 行，自动解析为待审核线索。
- 潜客队列：管理公司、市场、网站、来源、角色、评分、采购信号、审核状态。
- 资料补全：模拟联系人、邮箱规则、公司规模和置信度。
- 邮箱验证：基础格式验证和可发信状态流转。
- 开发信序列：首封、价值跟进、样品/案例、最后触达四封英文邮件。
- WhatsApp 开发：生成号码、WhatsApp 话术、wa.me 打开聊天链接和待确认队列。
- 发信队列：把高分潜客或单个潜客加入发送队列。
- 跟进任务：按 3、7、14 天生成自动跟进任务。
- 管理后台：活动管理、自动化任务中心、审批中心、渠道账号、规则配置、线索阶段漏斗。
- 导出：搜索式、潜客、发信队列、WhatsApp 队列和完整 JSON 数据。
- Webhook 接口位：预留搜索采集、邮箱补全/验证、发信、WhatsApp Business 和 CRM 同步接口。

## 使用

直接用浏览器打开 `index.html`。

推荐流程：

1. 在「控制台」填写产品、市场、客户类型和卖点。
2. 点击「生成开发计划」得到搜索任务。
3. 打开搜索任务，复制真实公司官网、LinkedIn 公司页、邮箱、电话或 CSV 行。
4. 回到「搜索」里的「搜索结果导入」，粘贴结果并点击「解析为线索」。
5. 在「潜客」里审核线索、补全资料、验证邮箱和生成 WhatsApp。
6. 在「邮件」「WhatsApp」「队列」里生成触达内容、加入队列和导出。
7. 在「管理」里保存活动、运行任务、审批 WhatsApp 队列、配置自动化规则和导出管理数据。

## 管理后台

「管理」模块用于把自动化流程变成可运营的管理系统：

- 活动管理：保存当前开发活动，切换不同产品/市场活动。
- 自动化任务中心：管理搜索采集、资料补全、邮箱/号码验证、话术生成、入队限流、CRM 同步等任务。
- 审批中心：集中处理 WhatsApp 待确认消息、话术审核和低分线索风控。
- 渠道账号：查看 Email、WhatsApp、Search API、CRM 的使用量和接入状态。
- 自动化规则：配置邮件日上限、WhatsApp 日上限、最低线索评分、冷却天数、WhatsApp 是否必须审批。
- 线索阶段漏斗：查看新发现、已丰富、邮箱有效、已入队、已回复等阶段分布。

## WhatsApp 开发

系统会为潜客生成 WhatsApp 联系方式、短话术和打开聊天链接。建议用于已授权、展会名片、询盘、老客户或已经通过邮件/LinkedIn 建立上下文的客户。

默认 WhatsApp 队列状态是「待人工确认」，避免直接批量冷发导致账号风控。后续如果接 WhatsApp Business API，可以把队列通过 Webhook 交给模板消息服务。

## 接入真实自动化

当前版本默认是本地管理系统，不会绕过浏览器或平台规则去抓取公司，也不会真实发送邮件/WhatsApp。没有接 API 时，它负责生成搜索任务、解析导入结果、管理线索和队列。

要接真实流程，可以在「设置」里切到 Webhook 模式，并填入：

- 搜索采集 Webhook：接 Google Custom Search、SerpAPI、Bing Search API、Apify、n8n 或 Activepieces。
- 邮箱查找/验证 Webhook：接 Hunter、Apollo、Dropcontact、ZeroBounce 或 NeverBounce。
- 发信 Webhook / SMTP 服务：接自建发信服务、n8n SMTP、SendGrid、Mailgun 或企业邮箱 API。
- WhatsApp Business Webhook：接 WhatsApp Business Platform、360dialog、Twilio、WATI、n8n 或 Activepieces。
- CRM 同步 Webhook：接 Twenty、悟空 CRM、EspoCRM、HubSpot 或自定义数据库。

Webhook 返回潜客时建议包含：

```json
{
  "prospects": [
    {
      "company": "Example Imports",
      "market": "United States",
      "website": "example.com",
      "contactName": "Anna Smith",
      "role": "Sourcing Manager",
      "email": "sourcing@example.com",
      "phone": "+12345678900",
      "source": "Google",
      "score": 82
    }
  ]
}
```
