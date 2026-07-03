# 自动化外贸开发系统

这是一个本地可运行的外贸自动化开发管理系统。核心流程是：输入产品和目标市场，系统生成搜索策略、潜客队列、邮箱/WhatsApp 触达内容、发信队列、跟进任务，并通过「管理」模块统一管理活动、任务、审批、账号、规则和线索阶段。

## 已具备

- 开发活动配置：产品、目标市场、客户类型、卖点、认证、署名和每日开发上限。
- 搜索自动化：按 Google、LinkedIn、B2B 目录、海关数据、平台买家和行业协会生成搜索式。
- 潜客队列：自动生成候选公司、市场、网站、来源、角色、评分和采购信号。
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
2. 点击「生成开发计划」得到搜索式和初始潜客。
3. 点击右上角「运行自动化」完成补全、验证、写信、入队和跟进任务。
4. 在「搜索」「潜客」「邮件」「WhatsApp」「队列」里查看和导出结果。
5. 在「管理」里保存活动、运行任务、审批 WhatsApp 队列、配置自动化规则和导出管理数据。

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

当前版本默认是本地模拟，不会真实联网抓取公司，也不会真实发送邮件。

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
