/* ---------- 深色模式 ---------- */

function applyTheme() {
  document.body.classList.toggle("dark", state.ui?.theme === "dark");
}

function toggleTheme() {
  state.ui = { ...(state.ui || {}), theme: state.ui?.theme === "dark" ? "light" : "dark" };
  applyTheme();
  addLog(state.ui.theme === "dark" ? "已切换深色模式" : "已切换浅色模式");
  saveState();
  renderLogs();
}

/* ---------- 全局搜索 / 命令面板 (Ctrl+K) ---------- */

let paletteItemsCache = [];
let paletteIndex = 0;

function buildPaletteItems(query) {
  const q = query.trim().toLowerCase();
  const items = [];
  [
    ["dashboard", "控制台"],
    ["discovery", "搜索与采集"],
    ["prospects", "潜客队列"],
    ["email", "邮件序列"],
    ["whatsapp", "WhatsApp 开发"],
    ["automation", "发信与跟进队列"],
    ["inbox", "统一收件箱"],
    ["crm", "CRM 商机看板"],
    ["analytics", "数据分析看板"],
    ["management", "运营管理后台"],
    ["settings", "自动化接口设置"]
  ].forEach(([view, label]) => items.push({ type: "页面", label, hint: "跳转", run: () => navigateTo(view) }));

  [
    {
      label: state.autopilot?.enabled ? "关闭自动驾驶" : "开启自动驾驶",
      hint: "全流程自动流转",
      run: () => setAutopilot(!state.autopilot?.enabled)
    },
    {
      label: "运行跨渠道接力",
      hint: "邮件未回转 WhatsApp",
      run: () => {
        navigateTo("inbox");
        runCrossChannelRelay();
      }
    },
    {
      label: "发送已批准到期邮件",
      hint: "只发送已批准项",
      run: async () => {
        await sendDueEmails();
        saveState();
        render();
      }
    },
    {
      label: "审批中心全部放行",
      hint: "普通邮件仅批准为待发送",
      run: () => {
        approveAllManagementItems();
        saveState();
        render();
      }
    },
    { label: "切换深色/浅色模式", hint: "外观", run: toggleTheme },
    { label: "导出全部数据 JSON", hint: "备份", run: exportJson }
  ].forEach((action) => items.push({ type: "动作", ...action }));

  state.prospects.forEach((prospect) => {
    items.push({
      type: "客户",
      label: prospect.company,
      hint: `${prospect.market} · ${prospect.dealStage || prospect.status}`,
      run: () => {
        state.selectedProspectId = prospect.id;
        state.selectedConversationId = prospect.id;
        saveState();
        render();
        navigateTo("prospects");
      }
    });
    items.push({
      type: "会话",
      label: `${prospect.company} 的会话`,
      hint: "打开收件箱时间线",
      run: () => {
        state.selectedConversationId = prospect.id;
        saveState();
        render();
        navigateTo("inbox");
      }
    });
  });

  if (!q) return items.slice(0, 12);
  return items.filter((item) => `${item.type} ${item.label} ${item.hint}`.toLowerCase().includes(q)).slice(0, 12);
}

function renderPalette() {
  paletteItemsCache = buildPaletteItems(elements.paletteInput.value);
  paletteIndex = Math.min(paletteIndex, Math.max(0, paletteItemsCache.length - 1));
  elements.paletteResults.innerHTML = paletteItemsCache.length
    ? paletteItemsCache
        .map(
          (item, index) => `
            <button class="palette-item ${index === paletteIndex ? "is-active" : ""}" data-palette-index="${index}" type="button">
              <span class="palette-type">${item.type}</span>
              <span class="palette-label">${escapeHtml(item.label)}</span>
              <span class="palette-hint">${escapeHtml(item.hint || "")}</span>
            </button>
          `
        )
        .join("")
    : `<div class="empty-state">无匹配结果</div>`;
}

function openPalette() {
  elements.paletteOverlay.hidden = false;
  elements.paletteInput.value = "";
  paletteIndex = 0;
  renderPalette();
  elements.paletteInput.focus();
}

function closePalette() {
  elements.paletteOverlay.hidden = true;
}

function runPaletteItem(index) {
  const item = paletteItemsCache[index];
  if (!item) return;
  closePalette();
  item.run();
}

/* ---------- CRM 详情抽屉 ---------- */

let crmDrawerProspectId = null;

function openCrmDrawer(prospectId) {
  crmDrawerProspectId = prospectId;
  renderCrmDrawer();
  elements.crmDrawerOverlay.hidden = false;
}

function closeCrmDrawer() {
  elements.crmDrawerOverlay.hidden = true;
  crmDrawerProspectId = null;
}

function renderCrmDrawer() {
  const prospect = state.prospects.find((p) => p.id === crmDrawerProspectId);
  if (!prospect) {
    closeCrmDrawer();
    return;
  }
  const conversation = buildConversations().find((c) => c.prospectId === prospect.id);
  const events = (conversation?.events || []).slice(-5).reverse();
  elements.crmDrawer.innerHTML = `
    <div class="drawer-head">
      <div>
        <h3>${escapeHtml(prospect.company)}</h3>
        <p class="conv-sub">${escapeHtml(prospect.market)} · ${escapeHtml(prospect.contactName)} · ${escapeHtml(prospect.role)}</p>
      </div>
      <button class="icon-button" data-drawer-close type="button" aria-label="关闭">
        <svg><use href="#icon-x" /></svg>
      </button>
    </div>
    <dl class="detail-list">
      <div><dt>邮箱</dt><dd>${escapeHtml(prospect.email || "待补全")} · ${escapeHtml(prospect.emailStatus || "")}</dd></div>
      <div><dt>WhatsApp</dt><dd>${escapeHtml(prospect.phone || "待查找")}</dd></div>
      <div><dt>商机阶段</dt><dd>
        <select id="drawerStage">${DEAL_STAGES.map((s) => `<option ${s === prospect.dealStage ? "selected" : ""}>${s}</option>`).join("")}</select>
      </dd></div>
      <div><dt>预估金额 ($)</dt><dd><input id="drawerValue" type="number" min="0" step="100" value="${prospect.dealValue || 0}" /></dd></div>
    </dl>
    ${renderLeadScorePanel(prospect)}
    <p class="eyebrow drawer-section-label">最近动态</p>
    <div class="drawer-events">
      ${
        events
          .map(
            (e) => `
              <div class="drawer-event">
                <span class="tag">${e.kind === "inbound" ? "回复" : e.channel === "whatsapp" ? "WA" : "邮件"}</span>
                <span class="drawer-event-text">${escapeHtml((e.title ? `${e.title}：` : "") + (e.body || "").replace(/\s+/g, " ")).slice(0, 64)}</span>
              </div>
            `
          )
          .join("") || `<div class="empty-state">暂无动态</div>`
      }
    </div>
    <div class="timeline-actions">
      <button class="ghost-button" data-drawer-goto="inbox" type="button"><svg><use href="#icon-inbox" /></svg><span>打开会话</span></button>
      <button class="ghost-button" data-drawer-goto="prospects" type="button"><svg><use href="#icon-users" /></svg><span>潜客详情</span></button>
    </div>
  `;
}

/* ---------- 收件箱快捷回复 ---------- */

async function sendQuickReply(prospectId, channel, text) {
  const prospect = state.prospects.find((p) => p.id === prospectId);
  const body = (text || "").trim();
  if (!prospect || !body) {
    addLog("回复内容为空，未发送");
    return;
  }

  if (channel === "whatsapp") {
    if (!prospect.phone) {
      addLog(`无法发送：${prospect.company} 没有 WhatsApp 号码`);
      return;
    }
    const item = {
      id: makeId("waq"),
      prospectId,
      company: prospect.company,
      phone: prospect.phone,
      label: "手动回复",
      message: body,
      dueDate: dateOffset(0),
      createdAt: new Date().toISOString(),
      status: "已审批",
      step: `手动回复-${state.whatsappQueue.length}`,
      reply: true,
      url: buildWhatsappUrl(prospect, body)
    };
    state.whatsappQueue.push(item);
    let sent = false;
    if (state.settings.mode === "webhook" && webhookUrl("whatsapp")) {
      const result = await callWebhook("whatsapp", { messages: [item] });
      if (result.ok) {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
        advanceDealStage(item.prospectId, "已触达");
        sent = true;
      } else {
        addLog(`WhatsApp Webhook 发送失败，回复已保留待审批：${result.error || result.code || "未配置"}`);
      }
    } else {
      item.status = "已发送";
      item.sentAt = new Date().toISOString();
      item.delivered = true;
      advanceDealStage(item.prospectId, "已触达");
      sent = true;
    }
    if (sent) addLog(`已发送 WhatsApp 回复：${prospect.company}`);
  } else {
    if (!prospect.email) {
      addLog(`无法发送：${prospect.company} 没有邮箱`);
      return;
    }
    const item = {
      id: makeId("outbox"),
      prospectId,
      company: prospect.company,
      email: prospect.email,
      label: "手动回复",
      subject: `Re: ${state.campaign.product}`,
      body,
      dueDate: dateOffset(0),
      createdAt: new Date().toISOString(),
      status: "待发送",
      step: `手动回复-${state.outbox.length}`,
      reply: true
    };
    state.outbox.push(item);
    const pf = preflightOutboxItem(item);
    if (!pf.ok) {
      item.status = "待审批";
      addLog(`邮件回复预检未通过，已保留为待审批草稿：${pf.blockers.join("、")}`);
      delete quickReplyDrafts[prospectId];
      saveState();
      render();
      return;
    }
    let sent = false;
    if (state.settings.mode === "webhook" && webhookUrl("send")) {
      const result = await callWebhook("send", { emails: [item] });
      if (result.ok) {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
        advanceDealStage(item.prospectId, "已触达");
        sent = true;
      } else {
        addLog(`发信 Webhook 发送失败，邮件回复已保留待发送：${result.error || result.code || "未配置"}`);
      }
    } else {
      deliverEmail(item);
      sent = true;
    }
    if (sent) addLog(`已发送邮件回复：${prospect.company}`);
  }

  delete quickReplyDrafts[prospectId];
  saveState();
  render();
}

/* ---------- AI 引擎：多服务商（Claude / ChatGPT / 国产大模型），未配置时降级本地规则 ---------- */
// 服务商预设表 AI_PROVIDERS 定义在 00-core.js 顶部（初始化早于设置表单绑定，避免 TDZ）。

// 兼容旧存档：老版本只有 aiEngine==="claude"，等价于云端 + Anthropic
function aiProviderId() {
  if (state.settings.aiEngine === "claude") return "anthropic";
  return state.settings.aiProvider || "anthropic";
}
function aiProviderConf() {
  return AI_PROVIDERS[aiProviderId()] || AI_PROVIDERS.anthropic;
}
function aiEndpoint() {
  const id = aiProviderId();
  return id === "custom" ? (state.settings.aiBaseUrl || "").trim() : AI_PROVIDERS[id].url;
}
// 联网找客户/反查经销商依赖 Claude 的 web_search 工具，仅 Anthropic 支持
function aiWebSearchCapable() {
  return aiEnabled() && aiProviderId() === "anthropic";
}

function aiEnabled() {
  const e = state.settings.aiEngine;
  return (e === "cloud" || e === "claude") && !!(state.settings.aiApiKey || "").trim();
}

function showAiSetup(message) {
  state.settings.aiEngine = "cloud";
  addLog(message);
  updateAiEngineButtons();
  navigateTo("settings");
  elements.aiApiKeyInput?.focus();
  saveState();
}

// 统一入口：按当前服务商分派到 Anthropic 或 OpenAI 兼容协议
async function callAI(systemPrompt, userText, schema, maxTokens = 2048) {
  return aiProviderConf().auth === "anthropic"
    ? callAnthropic(systemPrompt, userText, schema, maxTokens)
    : callOpenAICompatible(systemPrompt, userText, schema, maxTokens);
}

async function callAnthropic(systemPrompt, userText, schema, maxTokens = 2048) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": (state.settings.aiApiKey || "").trim(),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: state.settings.aiModel || "claude-opus-4-8",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userText }],
      ...(schema ? { output_config: { format: { type: "json_schema", schema } } } : {})
    })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data.stop_reason === "refusal") throw new Error("请求被安全策略拒绝");
  const text = data.content?.find((block) => block.type === "text")?.text || "";
  return schema ? JSON.parse(text) : text;
}

// OpenAI 兼容协议（ChatGPT / DeepSeek / 通义千问 / Kimi / 智谱 等）。
// 结构化输出不用各家不一的 response_format，而是把 JSON 规格写进系统提示 + 兜底抽取，
// 这样对所有兼容服务商都稳。
async function callOpenAICompatible(systemPrompt, userText, schema, maxTokens = 2048) {
  const url = aiEndpoint();
  if (!url) throw new Error("未填写 API 地址（自定义服务商需在设置里填 Base URL）");
  let system = systemPrompt;
  if (schema) {
    system += "\n\n【输出要求】只输出一个 JSON 对象，不要任何解释、前后缀或 Markdown 代码块。JSON 严格符合以下结构：\n" + schemaHint(schema);
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + (state.settings.aiApiKey || "").trim()
    },
    body: JSON.stringify({
      model: state.settings.aiModel || aiProviderConf().models[0] || "",
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userText }
      ]
    })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || err?.message || `HTTP ${response.status}`);
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return schema ? extractJson(text) : text;
}

// 从模型回复里稳健抽出 JSON（去掉 ```json 围栏、截取首个 { 到末个 }）
function extractJson(text) {
  let t = String(text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

// 把 JSON Schema 转成给模型看的简明字段说明（供不支持原生结构化输出的服务商使用）
function schemaHint(schema, indent = "") {
  if (!schema || schema.type !== "object" || !schema.properties) return "";
  const req = schema.required || [];
  return Object.entries(schema.properties)
    .map(([k, v]) => {
      let t = v.enum ? "取值之一 [" + v.enum.join(", ") + "]" : v.type || "";
      let line = `${indent}- ${k} (${t})${req.includes(k) ? "" : "（可选）"}${v.description ? "：" + v.description : ""}`;
      if (v.type === "object" && v.properties) line += "\n" + schemaHint(v, indent + "  ");
      if (v.type === "array" && v.items) line += `\n${indent}  · 数组每项：\n` + schemaHint(v.items, indent + "    ");
      return line;
    })
    .join("\n");
}

const AI_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    intent: {
      type: "string",
      enum: ["price", "sample", "discount", "leadtime", "moq", "cert", "reject", "other"]
    },
    intent_label: { type: "string", description: "意图的中文短标签，如 询价、要样品、砍价" },
    confidence: { type: "integer", description: "0-100 的置信度" },
    summary: { type: "string", description: "一句中文摘要：客户处境 + 最新诉求" },
    next_action: { type: "string", description: "给业务员的中文下一步建议，一句话" },
    suggested_reply: { type: "string", description: "可直接发送的英文回复全文，含称呼与署名" },
    risks: {
      type: "array",
      description: "客户来信中的风险事项，没有则空数组",
      items: {
        type: "object",
        properties: {
          level: { type: "string", enum: ["high", "medium", "low"] },
          category: {
            type: "string",
            description: "风险类别中文，如 付款风险 / 疑似诈骗 / 制裁合规 / 知识产权 / 利润风险 / 样品滥用"
          },
          evidence: { type: "string", description: "来信中触发该风险的原话或依据（中文说明）" },
          action: { type: "string", description: "给业务员的应对建议，一句话" }
        },
        required: ["level", "category", "evidence", "action"],
        additionalProperties: false
      }
    }
  },
  required: ["intent", "intent_label", "confidence", "summary", "next_action", "suggested_reply", "risks"],
  additionalProperties: false
};

const AI_SEQUENCE_SCHEMA = {
  type: "object",
  properties: {
    emails: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string", description: "中文步骤名，如 首封开发信" },
          dayOffset: { type: "integer" },
          subject: { type: "string" },
          body: { type: "string" }
        },
        required: ["label", "dayOffset", "subject", "body"],
        additionalProperties: false
      }
    }
  },
  required: ["emails"],
  additionalProperties: false
};

function getStoredAI(prospectId) {
  return [...state.inbound].reverse().find((m) => m.prospectId === prospectId && m.ai)?.ai || null;
}

async function analyzeConversationAI(prospectId) {
  const conversation = buildConversations().find((c) => c.prospectId === prospectId);
  const prospect = state.prospects.find((p) => p.id === prospectId);
  if (!conversation || !prospect) return null;

  const transcript = conversation.events
    .filter((e) => e.status !== "已取消")
    .slice(-12)
    .map((e) =>
      e.kind === "inbound"
        ? `客户: ${e.body}`
        : `我方(${e.channel === "whatsapp" ? "WhatsApp" : "邮件"}·${e.title || ""}): ${e.subject ? `${e.subject} — ` : ""}${e.body || ""}`
    )
    .join("\n---\n");

  const system =
    "你是资深外贸业务与风控助手。根据对话判断客户最新意图并起草回复，同时识别来信中的风险事项（付款风险如先货后款/纯账期/无定金、疑似诈骗如大额急单+异地收货+第三方货代、制裁合规如受限地区/再出口、知识产权如仿制贴牌、利润风险如目标价远低于成本、样品滥用等），没有风险则 risks 为空数组。suggested_reply 必须是英文、专业、简洁、可直接发送；其余字段用中文。";
  const user = `我方产品: ${state.campaign.product}
卖点: ${state.campaign.valueProps}
认证: ${state.campaign.certifications}
署名: ${state.campaign.senderName}, ${state.campaign.companyName}
客户: ${prospect.company}（${prospect.market}，联系人 ${prospect.contactName}）

对话记录（旧→新）:
${transcript}`;

  return callAI(system, user, AI_ANALYSIS_SCHEMA, 1500);
}

async function enrichInboundWithAI(prospectId, force = false) {
  if (!aiEnabled()) return;
  const message = [...state.inbound].reverse().find((m) => m.prospectId === prospectId && (force || !m.ai));
  if (!message) return;
  try {
    const result = await analyzeConversationAI(prospectId);
    if (!result) return;
    message.ai = { ...result, model: state.settings.aiModel, at: Date.now() };
    const riskNote = result.risks?.length ? `，⚠️ ${result.risks.length} 项风险` : "";
    addLog(`Claude 分析完成（${result.intent_label} · 置信度 ${result.confidence}%${riskNote}）：${message.company}`);
    saveState();
    render();
  } catch (error) {
    addLog(`Claude 分析失败，已用本地规则兜底：${error.message}`);
  }
}

/* ---------- 客户回信风险识别（本地规则 + Claude 双引擎） ---------- */

const RISK_RULES = [
  {
    level: "high",
    category: "付款风险",
    test: /pay(ment)? (after|on) (delivery|arrival|receipt)|open account\b|\boa\b|net ?\d{2,3}\b|no deposit|without deposit|credit terms|货到付款|先货后款|无需?定金|不付定金|纯账期|全额账期/i,
    evidence: "客户要求先货后款 / 纯账期 / 无定金",
    action: "坚持定金+尾款或 L/C，先核实客户资信与营业执照"
  },
  {
    level: "high",
    category: "疑似诈骗",
    test: /freight collect|my (shipping|forwarder|freight|agent) will (pick|arrange|handle|collect)|our (agent|forwarder) will contact you|western union|moneygram|ship (it |them )?to (a )?(different|another) (address|country)|deliver to nigeria|大额.*(急|马上|立刻)|异地收货|指定货代来提/i,
    evidence: "大额急单 / 第三方货代提货 / 异地收货等异常安排",
    action: "视频核实公司真实性，核对收货地址与注册地是否一致，先收定金"
  },
  {
    level: "medium",
    category: "制裁 / 合规",
    test: /\b(iran|syria|north korea|dprk|crimea|cuba|sanction)\b|re-?export|end.?use[r]? (certificate|statement)|military use|defen[cs]e (project|ministry)|受限地区|再出口|军工|最终用户/i,
    evidence: "涉及受限地区 / 再出口 / 军事或最终用户敏感用途",
    action: "启动出口管制合规审查，索取最终用户证明，必要时拒单"
  },
  {
    level: "medium",
    category: "知识产权",
    test: /replica|counterfeit|\b1:1\b|same as (nike|adidas|apple|dyson|lego|disney)|copy (of )?(the )?(brand|logo|design)|put (your|our) (customer'?s )?brand.*(without|no) (authoriz|license)|仿(制|货|款)|山寨|高仿|贴(牌|标).*(大牌|知名品牌)|冒牌/i,
    evidence: "要求仿制 / 贴他方品牌 / 疑似侵权",
    action: "拒绝任何仿冒，仅接受自有品牌或有合法授权的贴牌"
  },
  {
    level: "medium",
    category: "利润风险",
    test: /target price (is |of )?\$?\d|below (your |the )?cost|half (of )?(your |the )?price|cheaper than (alibaba|the market)|lowest price (or|otherwise)|骨折价|成本价|亏本|远低于|压到|最低到/i,
    evidence: "目标价疑似低于成本 / 极限压价",
    action: "守住底价，用价值和服务谈判，避免亏本接单"
  },
  {
    level: "low",
    category: "样品滥用",
    test: /free samples? (shipped |sent )?(at|on) your (cost|expense|account)|(just|only) (want|need|looking for) (free )?samples|send (me |us )?(free )?samples? (first|to test).*(no order)|免费(寄|包邮)样|只(要|想要)样品/i,
    evidence: "疑似只索要免费样品，无采购意向",
    action: "收取样品费或运费押金，成单后返还；先要采购量与规格"
  },
  {
    level: "low",
    category: "信息不一致",
    test: null, // 由 detectRisksLocal 特判
    evidence: "",
    action: ""
  }
];

function detectRisksLocal(text, prospect) {
  const risks = [];
  RISK_RULES.forEach((rule) => {
    if (rule.test && rule.test.test(text || "")) {
      risks.push({ level: rule.level, category: rule.category, evidence: rule.evidence, action: rule.action });
    }
  });
  // 信息不一致：邮箱域名与公司名/官网明显不符（免费邮箱冒充企业）
  if (prospect?.email && /@(gmail|yahoo|hotmail|outlook|163|qq|foxmail)\./i.test(prospect.email)) {
    if (/\b(inc|ltd|llc|corp|gmbh|co\.?,? ?ltd)\b/i.test(prospect.company)) {
      risks.push({
        level: "low",
        category: "信息不一致",
        evidence: "自称公司却用免费邮箱，域名与企业名不匹配",
        action: "索取企业邮箱与营业执照核验身份"
      });
    }
  }
  return risks;
}

function conversationRisks(prospectId) {
  const stored = getStoredAI(prospectId);
  const prospect = state.prospects.find((p) => p.id === prospectId);
  const message = [...state.inbound].reverse().find((m) => m.prospectId === prospectId);
  if (stored && Array.isArray(stored.risks)) {
    // Claude 已分析：合并 Claude 结果 + 本地规则兜底（去重按类别）
    const local = message ? detectRisksLocal(message.body, prospect) : [];
    const cats = new Set(stored.risks.map((r) => r.category));
    return [...stored.risks, ...local.filter((r) => !cats.has(r.category))];
  }
  return message ? detectRisksLocal(message.body, prospect) : [];
}

function riskLevelTone(level) {
  return level === "high" ? "red" : level === "medium" ? "amber" : "muted";
}

function highestRiskLevel(risks) {
  if (risks.some((r) => r.level === "high")) return "high";
  if (risks.some((r) => r.level === "medium")) return "medium";
  return risks.length ? "low" : null;
}

/* ---------- 智能找联系方式（真实源 Webhook 优先 → Claude 推测 → 本地兜底） ---------- */

const AI_CONTACT_SCHEMA = {
  type: "object",
  properties: {
    contact_name: { type: "string", description: "推测的最可能对口决策人姓名（英文），拿不准就给常见采购负责人占位" },
    contact_role: { type: "string", description: "决策人职位中文，如 采购经理 / Sourcing Manager" },
    email_candidates: {
      type: "array",
      description: "3-5 个候选邮箱（基于域名和姓名的常见模式），按可能性从高到低",
      items: {
        type: "object",
        properties: {
          email: { type: "string" },
          confidence: { type: "integer", description: "0-100 可能性" },
          pattern: { type: "string", description: "邮箱模式说明，如 firstname.lastname" }
        },
        required: ["email", "confidence", "pattern"],
        additionalProperties: false
      }
    },
    company_profile: { type: "string", description: "一句话公司画像（业务、规模线索、采购可能性）" },
    fit_note: { type: "string", description: "是否对口这次开发的判断，一句话" },
    fit_score: { type: "integer", description: "0-100 与本次任务的匹配度" }
  },
  required: ["contact_name", "contact_role", "email_candidates", "company_profile", "fit_note", "fit_score"],
  additionalProperties: false
};

function applyContact(prospectId, data, source) {
  state.prospects = state.prospects.map((p) => {
    if (p.id !== prospectId) return p;
    const candidates = (data.email_candidates || []).filter((c) => c && c.email);
    return {
      ...p,
      contactName: data.contact_name || p.contactName,
      role: data.contact_role || p.role,
      email: candidates[0]?.email || p.email,
      emailCandidates: candidates.length ? candidates : p.emailCandidates,
      emailStatus: candidates.length || p.email ? "待验证" : "待查找",
      phone: data.phone || p.phone,
      companyProfile: data.company_profile || p.companyProfile,
      fitNote: data.fit_note || p.fitNote,
      fitScore: typeof data.fit_score === "number" ? data.fit_score : p.fitScore,
      contactSource: source,
      status: p.status === "已入队" ? p.status : "已丰富",
      confidence: source === "webhook" ? 96 : Math.min(94, (p.confidence || 50) + 10)
    };
  });
}

async function enrichContactAI(prospectId, quiet = false) {
  const prospect = state.prospects.find((p) => p.id === prospectId);
  if (!prospect) return "none";

  // 1) 真实源：邮箱查找/验证 Webhook（Hunter/Apollo/Dropcontact 等）
  if (state.settings.mode === "webhook" && webhookUrl("enrich")) {
    try {
      const result = await callWebhook("enrich", {
        company: prospect.company,
        domain: prospect.website,
        market: prospect.market,
        role_hint: state.campaign.customerType
      });
      const d = result.data || {};
      if (result.ok && (d.email || d.contact_name || d.email_candidates?.length)) {
        applyContact(
          prospectId,
          {
            contact_name: d.contact_name || d.contactName,
            contact_role: d.contact_role || d.role,
            email_candidates: d.email_candidates || (d.email ? [{ email: d.email, confidence: 95, pattern: "verified" }] : []),
            phone: d.phone,
            company_profile: d.company_profile,
            fit_note: d.fit_note,
            fit_score: d.fit_score
          },
          "webhook"
        );
        if (!quiet) addLog(`真实源找到联系方式（已验证）：${prospect.company}`);
        saveState();
        render();
        return "webhook";
      }
    } catch (error) {
      if (!quiet) addLog(`邮箱查找 Webhook 失败，改用 AI 推测：${error.message}`);
    }
  }

  // 2) Claude 智能推测决策人 + 候选邮箱 + 公司画像 + 匹配度
  if (aiEnabled()) {
    try {
      const system =
        "你是外贸找客助手。根据公司名与官网域名，推测最可能对口的采购决策人姓名与职位、按常见企业邮箱模式生成候选邮箱（基于该域名，标注可能性），给出公司画像与本次开发的匹配度。email 必须用给定域名。不要编造已验证事实，均为推测。";
      const user = `公司: ${prospect.company}
官网域名: ${prospect.website || "（未知）"}
市场: ${prospect.market}
我方要开发的客户类型: ${state.campaign.customerType}
我方产品: ${state.campaign.product}`;
      const data = await callAI(system, user, AI_CONTACT_SCHEMA, 900);
      applyContact(prospectId, data, "claude");
      if (!quiet) addLog(`Claude 推测联系人与候选邮箱：${prospect.company}（匹配度 ${data.fit_score}%）`);
      saveState();
      render();
      return "claude";
    } catch (error) {
      if (!quiet) addLog(`Claude 找联系人失败，用本地规则：${error.message}`);
    }
  }

  // 3) 本地规则兜底（多候选邮箱）
  const enriched = enrichProspectList([prospect], state.campaign)[0];
  state.prospects = state.prospects.map((p) => (p.id === prospectId ? enriched : p));
  if (!quiet) addLog(`本地规则补全联系方式（候选邮箱）：${prospect.company}`);
  saveState();
  render();
  return "local";
}

function contactSourceLabel(source) {
  return source === "webhook"
    ? "真实验证"
    : source === "claude-web"
    ? "联网核实"
    : source === "claude"
    ? "AI 推测"
    : "规则推测";
}

/* ---------- Claude 联网找客户（web search）+ 相似客户扩展 ---------- */

async function callClaudeWebSearch(systemPrompt, userText, maxTokens = 4000) {
  const model = state.settings.aiModel || "claude-opus-4-8";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": (state.settings.aiApiKey || "").trim(),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userText }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }]
    })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data.stop_reason === "refusal") throw new Error("请求被安全策略拒绝");
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function extractJsonArray(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function extractJsonObject(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function prospectFromFound(item, fallbackMarket, sourceLabel = "Claude 联网") {
  const website = stripProtocol(item.website || item.domain || "").split("/")[0];
  const company = (item.company || item.name || domainToCompany(website) || "未命名公司").trim();
  const directWebsite =
    website && !/(google|linkedin|facebook|instagram|youtube|amazon|alibaba|made-in-china|globalsources|temu|shein|directory)/i.test(website);
  return {
    id: makeId("prospect"),
    company,
    market: item.market || fallbackMarket,
    source: sourceLabel,
    website,
    contactName: "待补全",
    role: "待确认采购角色",
    email: item.email || "",
    emailStatus: item.email ? "待验证" : "待查找",
    phone: item.phone || "",
    phoneStatus: item.phone ? "待人工确认" : "待查找",
    status: "新发现",
    score: directWebsite ? 74 : 60,
    confidence: directWebsite ? 70 : 52,
    presetKey: state.campaign.presetKey || null,
    campaignId: state.activeCampaignId || null,
    buyingSignal: item.note || `Claude 联网找到，疑似 ${state.campaign.product} 相关买家`,
    companySize: item.size || "待确认",
    searchQuery: item.note || "Claude 联网搜索"
  };
}

async function webSearchProspects(opts = {}) {
  if (!aiWebSearchCapable()) {
    if (aiEnabled()) {
      addLog("「联网找客户」目前仅 Claude 支持（用其内置联网搜索）；当前服务商无法联网，请改用粘贴导入或切到 Claude");
      return 0;
    }
    showAiSetup("联网找客户需要先配置支持联网的 AI 引擎（Claude）：填入 API Key 后点「测试连接」");
    return 0;
  }
  const count = opts.count || 12;
  const seed = opts.seed || "";
  addLog(seed ? `Claude 正在联网找相似客户…` : "Claude 正在联网搜索真实目标客户…");
  renderLogs();

  const markets = normalizeMarkets(state.campaign.markets);
  const system =
    "你是外贸找客助手，可联网搜索。任务：找出真实存在的目标采购商/进口商/批发商公司。用网络搜索核实公司真实存在并尽量拿到官网域名。只输出一个 JSON 数组，不要额外文字，每个元素含 {company, website, market, note}（note 为一句中文：为什么疑似目标客户/采购信号）。website 只要主域名。排除 alibaba/amazon/made-in-china 等平台与目录站本身。";
  const focusTerms = (state.campaign.productTerms || []).filter(Boolean);
  const focusLine =
    focusTerms.length > 1
      ? `\n【聚焦具体产品】只找采购/进口/分销这个具体产品的公司，不要泛品类公司。同义词/行业叫法: ${focusTerms.join(", ")}${state.campaign.hsCode ? `（HS ${state.campaign.hsCode}）` : ""}${state.campaign.buyerHint ? `\n典型买家: ${state.campaign.buyerHint}` : ""}`
      : "";
  const user = seed
    ? `请找 ${count} 家与下面这个客户相似的公司（同市场、同品类、相近规模）：\n${seed}\n我方产品: ${state.campaign.product}${focusLine}`
    : `目标市场: ${markets.join(", ")}
客户类型: ${state.campaign.customerType}
产品/品类: ${state.campaign.product}
搜索关键词: ${state.agent?.task?.parsed?.keywords?.join(", ") || state.campaign.product}${focusLine}
请找 ${count} 家真实公司。`;

  try {
    const text = await callClaudeWebSearch(system, user, 4500);
    return ingestFoundText(text, markets[0] || "United States", "Claude 联网", { quiet: opts.quiet });
  } catch (error) {
    addLog(`Claude 联网找客户失败：${error.message}`);
    return 0;
  }
}

// 把 Claude 联网返回的公司数组解析、去重并入池，返回新增数量（供联网找客户/相似客户/竞品反查复用）
function ingestFoundText(text, fallbackMarket, sourceLabel, opts = {}) {
  const arr = extractJsonArray(text);
  if (!Array.isArray(arr) || !arr.length) {
    if (!opts.quiet) addLog("Claude 联网未返回可解析的公司列表，请重试或改用粘贴导入");
    return 0;
  }
  const seenKeys = new Set(state.prospects.map((p) => p.website || p.company.toLowerCase()));
  const fresh = [];
  arr.forEach((item) => {
    const p = prospectFromFound(item, fallbackMarket, sourceLabel);
    if (p.website && NON_COMPANY_DOMAIN.test(p.website.replace(/^www\./, ""))) return;
    if (isBlacklisted(p)) return; // 退订黑名单：联网再搜到也不进池
    const key = p.website || p.company.toLowerCase();
    if (!p.company || seenKeys.has(key)) return;
    seenKeys.add(key);
    fresh.push(p);
  });
  if (!fresh.length) {
    if (!opts.quiet) addLog("联网找到的公司都已在库中（已去重）");
    return 0;
  }
  state.prospects = [...fresh, ...state.prospects];
  agentOnProspectsImported(fresh);
  if (!opts.quiet)
    addLog(`${sourceLabel}找到 ${fresh.length} 家候选客户，已进线索池${state.agent?.task ? "并走漏斗" : "（去「潜客」审核）"}`);
  saveState();
  render();
  return fresh.length;
}

async function findLookalike(prospectId) {
  const p = state.prospects.find((x) => x.id === prospectId);
  if (!p) return 0;
  if (aiEnabled()) {
    return await webSearchProspects({
      count: 8,
      seed: `公司: ${p.company}\n市场: ${p.market}\n品类/信号: ${p.buyingSignal || state.campaign.product}\n规模: ${p.companySize || "未知"}`
    });
  }
  // 无 Claude：用同市场同类型的规则生成器兜底
  const generated = generateProspects({ ...state.campaign, markets: p.market }, 8, `L${p.company.replace(/\W/g, "").slice(0, 4)}`);
  const seen = new Set(state.prospects.map((x) => x.website || x.company.toLowerCase()));
  const fresh = generated.filter((g) => {
    const key = g.website || g.company.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  state.prospects = [...fresh, ...state.prospects];
  agentOnProspectsImported(fresh);
  addLog(`已按「${p.company}」特征生成 ${fresh.length} 家相似线索（本地规则；配 Claude 可联网找真实相似公司）`);
  saveState();
  render();
  return fresh.length;
}

// 竞品渠道反查：从竞品 Where-to-buy / 经销商列表页抽出他家所有经销商作为线索
async function reverseCompetitorChannel(url) {
  if (!url || !/^https?:\/\//i.test(url.trim())) {
    addLog("请先粘贴一个完整的竞品经销商/Where-to-buy 页面链接（http/https 开头）");
    return 0;
  }
  if (!aiWebSearchCapable()) {
    if (aiEnabled()) {
      addLog("「竞品渠道反查」需联网抓取页面，目前仅 Claude 支持；请切到 Claude 或手动粘贴经销商列表");
      return 0;
    }
    showAiSetup("竞品渠道反查需要先配置支持联网的 AI 引擎（Claude）：填入 API Key 后点「测试连接」");
    return 0;
  }
  addLog(`Claude 正在联网反查竞品经销商：${url.trim()}…`);
  renderLogs();
  const markets = normalizeMarkets(state.campaign.markets);
  const system =
    "你是外贸找客助手，可联网搜索。任务：打开给定的经销商定位/Where-to-buy/dealer locator/authorized distributor/stockist 页面，抽取该页面列出的所有经销商/分销商/零售商公司。只输出一个 JSON 数组，不要额外文字，每个元素含 {company, website, market, note}（note 为一句中文，如“X 品牌授权经销商”）。排除品牌方本身与平台/目录站。找不到页面就用网络搜索该品牌的经销商。";
  const user = `竞品经销商页面: ${url.trim()}
我方产品: ${state.campaign.product}
目标市场: ${markets.join(", ") || "不限"}`;
  try {
    const text = await callClaudeWebSearch(system, user, 4500);
    const n = ingestFoundText(text, markets[0] || "United States", "竞品渠道反查");
    if (n === 0) addLog("竞品反查未抽到新经销商（可能页面无列表或都已在库）");
    return n;
  } catch (error) {
    addLog(`竞品渠道反查失败：${error.message}`);
    return 0;
  }
}

// 官网一键深挖联系人：Claude 联网翻公司官网 About/Team/Contact 页，找真实决策人与邮箱
async function deepDigContact(prospectId, quiet = false) {
  const prospect = state.prospects.find((p) => p.id === prospectId);
  if (!prospect) return "none";
  if (!aiWebSearchCapable()) {
    if (aiEnabled()) {
      if (!quiet) addLog("「官网深挖联系人」需联网翻官网，目前仅 Claude 支持；可改用「AI 找联系人」（当前模型支持）或切到 Claude");
      return "none";
    }
    if (!quiet) showAiSetup("官网深挖联系人需要先配置支持联网的 AI 引擎（Claude）：填入 API Key 后点「测试连接」");
    return "none";
  }
  if (!quiet) {
    addLog(`Claude 正在联网深挖 ${prospect.company} 官网的采购决策人…`);
    renderLogs();
  }
  const system =
    "你是外贸找客助手，可联网搜索。任务：访问/搜索该公司官网，优先看 About/Team/Management/Contact/Wholesale 页面与领英，找出最对口的采购/进口决策人的真实姓名、职位、邮箱、电话。只输出一个 JSON 对象，不要额外文字：{contact_name, contact_role, email_candidates:[{email,confidence,pattern}], phone, company_profile, fit_note, fit_score}。email 用真实找到的（pattern 标 verified）；确实找不到就按该域名常见模式给候选并把 pattern 标 guessed。fit_score 为 0-100 数字。";
  const user = `公司: ${prospect.company}
官网域名: ${prospect.website || "（未知，请先联网找到官网）"}
市场: ${prospect.market}
我方要开发的客户类型: ${state.campaign.customerType}
我方产品: ${state.campaign.product}`;
  try {
    const text = await callClaudeWebSearch(system, user, 2500);
    const data = extractJsonObject(text);
    if (!data) {
      if (!quiet) addLog(`官网深挖未拿到可解析结果：${prospect.company}`);
      return "none";
    }
    applyContact(prospectId, data, "claude-web");
    if (!quiet) addLog(`官网深挖联系人（联网核实）：${prospect.company}`);
    saveState();
    render();
    return "claude-web";
  } catch (error) {
    if (!quiet) addLog(`官网深挖失败：${error.message}`);
    return "none";
  }
}

// 一键批量补全：对所有缺联系方式/新线索依次跑「AI 找联系人」链路（真实源→Claude→本地）
async function bulkEnrichContacts(onProgress) {
  const targets = state.prospects.filter(
    (p) =>
      !p.email ||
      ["待查找", "待补全", "待确认"].includes(p.contactName) ||
      ["新发现", "待审核"].includes(p.status)
  );
  if (!targets.length) {
    addLog("没有需要补全联系方式的线索（都已补全或缺产品/线索）");
    saveState();
    render();
    return 0;
  }
  addLog(`开始批量补全 ${targets.length} 家线索的联系方式…（真实源/AI/规则按已配置引擎）`);
  renderLogs();
  let done = 0;
  for (const t of targets) {
    // eslint-disable-next-line no-await-in-loop
    await enrichContactAI(t.id, true);
    done += 1;
    if (onProgress) onProgress(done, targets.length);
    if (done % 3 === 0 || done === targets.length) {
      addLog(`批量补全进度 ${done}/${targets.length}…`, { toast: false });
      renderLogs();
    }
  }
  addLog(`批量补全完成：处理 ${done} 家线索`);
  saveState();
  render();
  return done;
}

async function generateSequenceAI() {
  const prospect = getSelectedProspect();
  if (!prospect) {
    addLog("请先选择潜客");
    return;
  }
  if (!aiEnabled()) {
    showAiSetup("深度写信需要先配置 Claude API：请填入 Anthropic API Key 后点击「测试连接」");
    return;
  }
  addLog(`Claude 正在为 ${prospect.company} 深度写信…`);
  try {
    const system =
      "你是顶尖外贸开发信专家。为指定客户写一套 4 封开发信序列（D0 首触 / D3 跟进 / D7 案例或样品 / D14 收尾）。每封 90-140 词，围绕该客户的业务与市场个性化切入，避免模板腔与夸张营销语。label 用中文。语言规则：按客户市场的商务语言写正文——拉美用西班牙语（巴西用葡萄牙语）、法语区非洲用法语、中东可英语正文+阿语问候；首封在正文下附简短英文版本；其他市场用英文。";
    const user = `产品: ${state.campaign.product}
卖点: ${state.campaign.valueProps}
认证: ${state.campaign.certifications}
署名: ${state.campaign.senderName}, ${state.campaign.companyName}
客户: ${prospect.company}
市场: ${prospect.market}
联系人: ${prospect.contactName}（${prospect.role}）
网站: ${prospect.website}
采购信号: ${prospect.buyingSignal}`;
    const result = await callAI(system, user, AI_SEQUENCE_SCHEMA, 3000);
    state.sequence = (result.emails || []).slice(0, 6).map((email) => ({
      id: makeId("email"),
      label: email.label,
      dayOffset: email.dayOffset,
      subject: email.subject,
      body: email.body,
      ai: true
    }));
    addLog(`Claude 已生成 ${state.sequence.length} 封深度个性化开发信：${prospect.company}`);
    saveState();
    render();
  } catch (error) {
    addLog(`Claude 写信失败：${error.message}`);
  }
}

async function testAiEngineConnection() {
  readSettingsFromForm();
  const statusEl = elements.aiEngineTestStatus;
  if (!(state.settings.aiApiKey || "").trim()) {
    statusEl.className = "webhook-status fail";
    statusEl.textContent = "未填写 API Key";
    return;
  }
  statusEl.className = "webhook-status pending";
  statusEl.textContent = "测试中…";
  const start = Date.now();
  const name = aiProviderConf().label;
  try {
    await callAI("只回复两个字：正常", "连通性测试", null, 16);
    statusEl.className = "webhook-status ok";
    statusEl.textContent = `正常 · ${state.settings.aiModel} · ${Date.now() - start}ms`;
    addLog(`${name} 连接成功（${state.settings.aiModel}）`);
  } catch (error) {
    statusEl.className = "webhook-status fail";
    statusEl.textContent = `失败 · ${error.message.slice(0, 40)}`;
    addLog(`${name} 连接失败：${error.message}${aiProviderId() !== "anthropic" ? "（若报 CORS/跨域，多为浏览器限制，改用桌面版或经 n8n 代理）" : ""}`);
  }
  saveState();
  updateAiEngineButtons();
}

// 服务商切换：填好默认地址提示、重置模型为该服务商默认、显示/隐藏自定义 Base URL
function applyAiProviderToForm() {
  const conf = aiProviderConf();
  if (elements.aiApiKeyInput) elements.aiApiKeyInput.placeholder = conf.keyHint;
  if (elements.aiModelList) {
    elements.aiModelList.innerHTML = conf.models.map((m) => `<option value="${m}"></option>`).join("");
  }
  if (elements.aiBaseUrlRow) elements.aiBaseUrlRow.style.display = aiProviderId() === "custom" ? "" : "none";
  const cloudOn = state.settings.aiEngine === "cloud" || state.settings.aiEngine === "claude";
  if (elements.aiCloudRow) elements.aiCloudRow.style.display = cloudOn ? "" : "none";
}

function updateAiEngineButtons() {
  const engine = state.settings.aiEngine === "claude" ? "cloud" : state.settings.aiEngine || "local";
  const enabled = aiEnabled();
  const conf = aiProviderConf();
  if (elements.aiLocalMode) elements.aiLocalMode.classList.toggle("is-active", engine === "local");
  if (elements.aiCloudMode) elements.aiCloudMode.classList.toggle("is-active", engine === "cloud");
  if (elements.aiProviderSelect) elements.aiProviderSelect.value = aiProviderId();
  elements.aiEngineStatus.textContent = enabled
    ? `${conf.label} · ${state.settings.aiModel}`
    : engine === "cloud"
      ? `${conf.label}（未配置 Key）`
      : "本地规则";
  if (elements.aiCloudRow) elements.aiCloudRow.style.display = engine === "cloud" ? "" : "none";
  if (elements.aiBaseUrlRow) elements.aiBaseUrlRow.style.display = aiProviderId() === "custom" ? "" : "none";

  // 联网类功能仅 Claude 可用；其余模型下按钮标注但仍可点（会走本地兜底）
  const webCap = aiWebSearchCapable();
  [
    [elements.webSearchFind, "联网找客户", "配置 Claude 后联网找客户", true],
    [elements.reverseCompetitor, "反查经销商", "配置 Claude 后反查", true],
    [elements.aiWriteEmail, "AI 深度写信", "配置 AI 引擎后深度写信", false]
  ].forEach(([button, readyLabel, setupLabel, needsWeb]) => {
    if (!button) return;
    const ok = needsWeb ? webCap : enabled;
    button.classList.toggle("needs-config", !ok);
    const label = button.querySelector("span");
    if (label) label.textContent = ok ? readyLabel : setupLabel;
  });
}

/* ================== AI 自动获客 Agent（任务解析 → 寻客 → 审批 → 开发 → 移交） ================== */

const AGENT_TASK_SCHEMA = {
  type: "object",
  properties: {
    product: { type: "string", description: "客户经营/采购的产品品类，英文小写，如 outdoor furniture" },
    markets: { type: "array", items: { type: "string" }, description: "目标市场英文名列表，如 United States" },
    customer_type: {
      type: "string",
      enum: ["importer distributor", "retailer chain buyer", "brand private label", "wholesaler", "contractor project buyer"]
    },
    keywords: { type: "array", items: { type: "string" }, description: "3-6 个英文行业搜索词，含同义词与当地术语" },
    size_note: { type: "string", description: "规模条件中文描述，没有则空字符串" },
    exclusion_note: { type: "string", description: "排除条件中文描述，没有则空字符串" },
    daily_limit: { type: "integer", description: "每日触达上限，未提及则 30" },
    use_email: { type: "boolean" },
    use_whatsapp: { type: "boolean" },
    summary: { type: "string", description: "一句话中文复述任务" }
  },
  required: ["product", "markets", "customer_type", "keywords", "size_note", "exclusion_note", "daily_limit", "use_email", "use_whatsapp", "summary"],
  additionalProperties: false
};

const AGENT_MARKET_WORDS = [
  ["美国", "United States"], ["加拿大", "Canada"], ["德国", "Germany"], ["英国", "United Kingdom"],
  ["法国", "France"], ["澳大利亚", "Australia"], ["澳洲", "Australia"], ["日本", "Japan"], ["韩国", "South Korea"],
  ["中东", "United Arab Emirates"], ["阿联酋", "United Arab Emirates"], ["迪拜", "United Arab Emirates"],
  ["墨西哥", "Mexico"], ["巴西", "Brazil"], ["西班牙", "Spain"], ["意大利", "Italy"], ["荷兰", "Netherlands"],
  ["波兰", "Poland"], ["俄罗斯", "Russia"], ["印度", "India"], ["越南", "Vietnam"], ["泰国", "Thailand"],
  ["东南亚", "Vietnam, Thailand"], ["欧洲", "Germany, France, United Kingdom"],
  ["usa", "United States"], ["united states", "United States"], ["america", "United States"],
  ["canada", "Canada"], ["germany", "Germany"], ["france", "France"], ["australia", "Australia"],
  ["japan", "Japan"], ["mexico", "Mexico"], ["brazil", "Brazil"], ["spain", "Spain"], ["italy", "Italy"],
  ["uae", "United Arab Emirates"], ["dubai", "United Arab Emirates"]
];

function parseAgentTaskLocal(prompt) {
  const lower = prompt.toLowerCase();
  const markets = [];
  AGENT_MARKET_WORDS.forEach(([word, market]) => {
    const hit = /[a-z]/.test(word) ? new RegExp(`\\b${word}\\b`, "i").test(lower) : prompt.includes(word);
    if (hit) market.split(", ").forEach((m) => !markets.includes(m) && markets.push(m));
  });

  let customerType = "importer distributor";
  if (/零售|连锁|retail/i.test(prompt)) customerType = "retailer chain buyer";
  else if (/品牌|贴牌|oem|private label/i.test(prompt)) customerType = "brand private label";
  else if (/工程|项目采购|contractor/i.test(prompt)) customerType = "contractor project buyer";
  else if (/批发|wholesal/i.test(prompt) && !/进口|import|经销|distribut/i.test(prompt)) customerType = "wholesaler";

  let product = "";
  const zhMatch = prompt.match(/做(.{2,20}?)(?:批发|进口|贸易|生意|的)/);
  if (zhMatch) product = zhMatch[1].trim();
  const enMatch = prompt.match(/[a-zA-Z][a-zA-Z\s]{3,40}[a-zA-Z]/);
  if (!product && enMatch && !/whatsapp/i.test(enMatch[0])) product = enMatch[0].trim().toLowerCase();
  if (!product) product = state.campaign.product;

  const limitMatch = prompt.match(/(?:每日|每天|日|上限)[^\d]{0,6}(\d{1,3})/) || prompt.match(/(\d{1,3})\s*(?:家|个)/);
  const sizeMatch = prompt.match(/规模[^，。,]{0,30}/);
  const exclMatch = prompt.match(/排除[^，。,]{0,30}/);

  return {
    product,
    markets: markets.length ? markets : normalizeMarkets(state.campaign.markets),
    customer_type: customerType,
    keywords: [product, `${product} wholesale`, `${product} importer`].filter(Boolean),
    size_note: sizeMatch ? sizeMatch[0] : "",
    exclusion_note: exclMatch ? exclMatch[0] : "已在 CRM 中的客户自动去重",
    daily_limit: clamp(Number(limitMatch?.[1]) || 30, 1, 300),
    use_email: !/只发?\s*whatsapp/i.test(prompt),
    use_whatsapp: !/只发?(开发信|邮件)|不.{0,3}whatsapp/i.test(prompt),
    summary: prompt.slice(0, 80)
  };
}

async function parseAgentTask() {
  const prompt = elements.agentPromptInput.value.trim();
  if (!prompt) {
    addLog("请先用一句话描述你要开发的客户");
    return;
  }
  let parsed = null;
  let source = "local";
  if (aiEnabled()) {
    elements.agentEngineTag.textContent = "Claude 解析中…";
    try {
      parsed = await callAI(
        "你是外贸获客任务解析器。把用户的一句话客户开发需求解析为结构化任务。markets 必须是英文国家/地区名；keywords 用英文并扩展同义词与当地行业术语；未提及的条件给合理默认值。",
        prompt,
        AGENT_TASK_SCHEMA,
        1200
      );
      source = "claude";
    } catch (error) {
      addLog(`Claude 解析失败，已用本地规则：${error.message}`);
    }
  }
  if (!parsed) parsed = parseAgentTaskLocal(prompt);

  state.agent.task = {
    id: makeId("agent"),
    prompt,
    parsed,
    source,
    approvalMode: "review",
    status: "draft",
    funnel: { raw: 0, matched: 0, verified: 0, deduped: 0, scored: 0 },
    recurring: { enabled: false, interval: "weekly", perCycle: 20, useWebSearch: false, lastRunAt: null, cyclesRun: 0 },
    startedAt: timestamp()
  };
  state.agent.approvals = [];
  addLog(`任务解析完成（${source === "claude" ? "Claude" : "本地规则"}）：请在任务卡片中确认后启动`);
  saveState();
  render();
}

function confirmAgentTask() {
  const task = state.agent.task;
  if (!task) return;
  const parsed = task.parsed;
  parsed.product = $("#agentFProduct").value.trim() || parsed.product;
  parsed.markets = $("#agentFMarkets").value.split(/[,，]/).map((m) => m.trim()).filter(Boolean);
  parsed.customer_type = $("#agentFType").value;
  parsed.daily_limit = clamp(Number($("#agentFLimit").value) || 30, 1, 300);
  parsed.keywords = $("#agentFKeywords").value.split(/[,，]/).map((k) => k.trim()).filter(Boolean);
  parsed.use_email = $("#agentFEmail").checked;
  parsed.use_whatsapp = $("#agentFWa").checked;

  state.campaign = {
    ...state.campaign,
    product: parsed.product,
    markets: parsed.markets.join(", "),
    customerType: parsed.customer_type,
    dailyLimit: parsed.daily_limit
  };

  // 自动做具体产品聚焦：把任务里的产品细化成行业术语+同义词+HS+买家画像，
  // 后续搜索式/联网找客户/周期补量/开发信全部围绕这个具体产品（异步，不阻塞任务启动）
  const isBroadPreset = Object.values(CQ_PRESETS).some((p) => p.product === parsed.product);
  if (aiEnabled() && parsed.product && !isBroadPreset && parsed.product !== state.campaign.focusProduct) {
    state.campaign.focusProduct = parsed.product;
    state.campaign.productTerms = [parsed.product];
    if (elements.focusProductInput) elements.focusProductInput.value = parsed.product;
    refineProductFocus(); // 完成后会自动重建搜索式并提示细化结果
  }

  bindCampaignForm();
  state.searchPlan = generateSearchPlan(state.campaign);
  task.status = "prospecting";
  addLog(
    `Agent 任务已启动（${task.approvalMode === "spot" ? "批量审批" : "逐条审批"}）：已生成 ${state.searchPlan.length} 条搜索任务。去「搜索」导入真实结果，或点「用演示数据体验」`
  );
  saveState();
  render();
}

function agentOnProspectsImported(imported) {
  const task = state.agent.task;
  if (!task || task.status === "draft" || !imported.length) return;

  task.funnel.raw += imported.length;
  const marketSet = new Set(task.parsed.markets);
  const matched = imported.filter((p) => !marketSet.size || marketSet.has(p.market));
  task.funnel.matched += matched.length;

  const ids = new Set(matched.map((p) => p.id));
  const processed = verifyProspectList(
    enrichProspectList(state.prospects.filter((p) => ids.has(p.id)), state.campaign),
    state.campaign
  );
  const byId = new Map(processed.map((p) => [p.id, p]));
  state.prospects = state.prospects.map((p) => byId.get(p.id) || p);
  const verified = processed.filter((p) => p.emailStatus === "格式有效");
  task.funnel.verified += verified.length;
  task.funnel.deduped = task.funnel.verified; // 跨渠道去重在导入阶段已完成

  const capacity = Math.max(0, task.parsed.daily_limit - state.agent.approvals.length);
  const qualified = verified
    .map((p) => ({ p, score: computeLeadScore(p).probability }))
    .filter((x) => x.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, capacity);
  task.funnel.scored += qualified.length;

  qualified.forEach(({ p }) => {
    if (state.agent.approvals.some((a) => a.prospectId === p.id)) return;
    state.agent.approvals.push({ id: makeId("appr"), prospectId: p.id, status: "pending", at: timestamp() });
  });

  // 发送必须人工审批：所有模式都只生成待审批触达方案，不自动发送
  if (qualified.length) {
    addLog(`Agent：找到并验证 ${qualified.length} 个高分客户，触达方案已生成，等待你审批发送`);
  }
  task.status = state.agent.approvals.some((a) => a.status === "pending") ? "reviewing" : "outreach";

  // 配置了真实源(邮箱查找 Webhook)时，自动为入围客户找真实验证的联系方式
  if (state.settings.mode === "webhook" && webhookUrl("enrich") && qualified.length) {
    (async () => {
      for (const { p } of qualified) await enrichContactAI(p.id, true);
      addLog(`真实源已为 ${qualified.length} 个客户补全验证联系方式`);
    })();
  }
}

async function agentApprove(approval, quiet = false) {
  const task = state.agent.task;
  const prospect = state.prospects.find((p) => p.id === approval.prospectId);
  if (!prospect) {
    approval.status = "skipped";
    return;
  }
  // 人工审批通过 = 放行并发送首触（这就是发送前的人工闸口）；后续跟进仍需在队列里单独审批。
  let sentEmail = 0;
  let sentWhatsapp = 0;
  const today = dateOffset(0);

  if (task.parsed.use_email !== false) {
    queueProspect(prospect, false);
    const dueEmails = state.outbox.filter(
      (item) =>
        item.prospectId === prospect.id &&
        !item.reply &&
        ["待审批", "待发送"].includes(item.status) &&
        item.dueDate <= today
    );
    const sendable = dueEmails.filter((item) => preflightOutboxItem(item).ok);
    sendable.forEach((item) => (item.status = "待发送"));
    sentEmail = await sendOutboxItems(sendable);
    if (!quiet && dueEmails.length > sendable.length) addLog(`${prospect.company} 的邮件预检未通过，已保留在待审批队列`);
  }

  if (task.parsed.use_whatsapp && prospect.phone) {
    queueWhatsappProspect(prospect, false);
    const dueWhatsapp = state.whatsappQueue.filter(
      (item) => item.prospectId === prospect.id && ["待人工确认", "已审批"].includes(item.status) && item.dueDate <= today
    );
    dueWhatsapp.forEach((item) => (item.status = "已审批"));
    if (dueWhatsapp.length && state.settings.mode === "webhook" && webhookUrl("whatsapp")) {
      const result = await callWebhook("whatsapp", { messages: dueWhatsapp });
      if (result.ok) {
        dueWhatsapp.forEach((item) => {
          item.status = "已发送";
          item.sentAt = new Date().toISOString();
          item.delivered = true;
          advanceDealStage(item.prospectId, "已触达");
        });
        sentWhatsapp = dueWhatsapp.length;
      }
    } else {
      dueWhatsapp.forEach((item) => {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        const h = hashInt(item.prospectId + item.step);
        item.delivered = h % 100 < 98;
        item.read = item.delivered && (h >> 3) % 100 < Math.min(88, 50 + Math.round((prospect.score || 60) * 0.5));
        advanceDealStage(item.prospectId, "已触达");
      });
      sentWhatsapp = dueWhatsapp.length;
    }
  }
  approval.status = "approved";
  if (!quiet) {
    const parts = [];
    if (sentEmail) parts.push(`${sentEmail} 封邮件`);
    if (sentWhatsapp) parts.push(`${sentWhatsapp} 条 WhatsApp`);
    addLog(parts.length ? `已审批并发送首触：${prospect.company}（${parts.join("、")}）` : `已审批：${prospect.company}，但暂无可发送首触`);
  }
  if (!state.agent.approvals.some((a) => a.status === "pending")) task.status = "outreach";
}

function agentRecurring() {
  const task = state.agent.task;
  if (!task) return null;
  if (!task.recurring) task.recurring = { enabled: false, interval: "weekly", perCycle: 20, useWebSearch: false, lastRunAt: null, cyclesRun: 0 };
  return task.recurring;
}

const AGENT_INTERVAL_MS = { daily: 86400000, weekly: 7 * 86400000, monthly: 30 * 86400000 };

function agentCycleDue() {
  const rec = agentRecurring();
  if (!rec || !rec.enabled) return false;
  if (!rec.lastRunAt) return true;
  return Date.now() - new Date(rec.lastRunAt).getTime() >= (AGENT_INTERVAL_MS[rec.interval] || AGENT_INTERVAL_MS.weekly);
}

async function agentRunCycle(manual = false) {
  const task = state.agent.task;
  const rec = agentRecurring();
  if (!task || task.status === "draft") return 0;

  const perCycle = clamp(Number(rec.perCycle) || 20, 1, 200);
  let batch = null;

  // Webhook 模式：走真实采集补充；否则用演示生成器模拟"每周补量"
  if (state.settings.mode === "webhook" && webhookUrl("search")) {
    batch = await trySearchWebhook();
  }
  // 每日自动联网找真实客户：开启且配置了 Claude 时，优先用联网搜索补量
  if (!batch?.length && rec.useWebSearch && aiEnabled()) {
    const n = await webSearchProspects({ count: perCycle });
    if (n > 0) {
      rec.lastRunAt = new Date().toISOString();
      rec.cyclesRun = (rec.cyclesRun || 0) + 1;
      addLog(
        `周期补量（第 ${rec.cyclesRun} 轮 · ${rec.interval === "daily" ? "每日" : rec.interval === "monthly" ? "每月" : "每周"} · 联网找真实客户）：新增 ${n} 家线索走漏斗`
      );
      saveState();
      render();
      return n;
    }
    // 联网没找到就继续用生成器兜底
  }
  if (!batch?.length) {
    const salt = `R${(rec.cyclesRun || 0) + 1}`;
    const generated = generateProspects(state.campaign, perCycle, salt);
    const seen = new Set(state.prospects.map((p) => p.website || p.company.toLowerCase()));
    batch = generated.filter((p) => {
      const key = p.website || p.company.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (!manual && !batch.length) return 0;
  }

  state.prospects = [...batch, ...state.prospects];
  agentOnProspectsImported(batch);
  rec.lastRunAt = new Date().toISOString();
  rec.cyclesRun = (rec.cyclesRun || 0) + 1;
  addLog(
    `周期补量（第 ${rec.cyclesRun} 轮 · ${rec.interval === "daily" ? "每日" : rec.interval === "monthly" ? "每月" : "每周"}）：新增 ${batch.length} 家线索走漏斗`
  );
  saveState();
  render();
  return batch.length;
}

const AGENT_HOT_INTENTS = ["price", "sample", "moq", "cert", "leadtime", "discount"];

function agentHandoffData() {
  const hot = [];
  const warm = [];
  const rejected = [];
  let silent = 0;
  buildConversations().forEach((c) => {
    if (c.replied) {
      const lastInbound = [...state.inbound].reverse().find((m) => m.prospectId === c.prospectId);
      const escalated = lastInbound?.autoAction?.type === "escalated";
      const optout = lastInbound?.autoAction?.type === "optout";
      const stored = getStoredAI(c.prospectId);
      const local = getConversationIntent(c);
      const key = stored ? stored.intent : local?.key;
      const label = escalated
        ? `转人工 · ${lastInbound.autoAction.reason}`
        : stored
          ? stored.intent_label
          : local?.label || "已回复";
      const summary = stored ? stored.summary : null;
      if (optout) rejected.push({ c, label: "opt-out 黑名单" });
      else if (escalated || AGENT_HOT_INTENTS.includes(key)) hot.push({ c, label, summary });
      else if (key === "reject") rejected.push({ c, label });
      else warm.push({ c, label });
    } else if (c.events.some((e) => e.kind === "outbound" && e.status === "已发送")) {
      silent += 1;
    }
  });
  return { hot, warm, rejected, silent };
}

function computeAgentInsight() {
  const markets = {};
  state.prospects.forEach((p) => {
    const touched =
      state.outbox.some((o) => o.prospectId === p.id && o.status === "已发送") ||
      state.whatsappQueue.some((w) => w.prospectId === p.id && w.status === "已发送");
    if (!touched) return;
    markets[p.market] = markets[p.market] || { touched: 0, replied: 0 };
    markets[p.market].touched += 1;
    if (isReplied(p)) markets[p.market].replied += 1;
  });
  const rows = Object.entries(markets).filter(([, v]) => v.touched >= 2);
  if (rows.length < 2) return "";
  const totalTouched = rows.reduce((s, [, v]) => s + v.touched, 0);
  const totalReplied = rows.reduce((s, [, v]) => s + v.replied, 0);
  const avg = totalReplied / totalTouched;
  const best = rows
    .map(([m, v]) => ({ m, rate: v.replied / v.touched, replied: v.replied }))
    .filter((x) => x.replied >= 2 && x.rate >= avg * 1.5)
    .sort((a, b) => b.rate - a.rate)[0];
  return best ? `效果回流：「${best.m}」回复率 ${Math.round(best.rate * 100)}%（均值 ${Math.round(avg * 100)}%），建议下一批向该市场倾斜。` : "";
}
