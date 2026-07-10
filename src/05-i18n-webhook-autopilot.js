/* ---------- 多语言：按市场加当地语言开场（正文英文，提升南美/中东回复率） ---------- */

const MARKET_LANGUAGE = {
  es: /colombia|peru|mexico|chile|argentina|ecuador|spain|bolivia|venezuela|guatemala|dominican|uruguay|paraguay|costa rica|panama|honduras|salvador|nicaragua/i,
  pt: /brazil|brasil|portugal|angola|mozambique/i,
  ar: /egypt|saudi|uae|united arab emirates|emirates|kuwait|qatar|oman|bahrain|jordan|iraq|morocco|algeria|tunisia|libya|yemen|lebanon/i,
  fr: /france|senegal|ivory coast|cote d.ivoire|cameroon|congo|mali|burkina|niger|benin|togo|guinea|madagascar/i
};

function marketLanguage(market) {
  const m = market || "";
  for (const [lang, re] of Object.entries(MARKET_LANGUAGE)) {
    if (re.test(m)) return lang;
  }
  return "en";
}

// 首封信的当地语言开场（一小段+说明英文在下方），非英语市场自动加
function localIntroFor(market, greeting, product) {
  const lang = marketLanguage(market);
  const intros = {
    es: `Estimado/a ${greeting}: Le escribimos desde Chongqing, China, como proveedor de ${product}. A continuación los detalles en inglés — también podemos atenderle en español.`,
    pt: `Prezado(a) ${greeting}: Escrevemos de Chongqing, China, como fornecedor de ${product}. Abaixo seguem os detalhes em inglês — também podemos atender em português.`,
    ar: `تحية طيبة ${greeting}، نراسلكم من تشونغتشينغ، الصين كمورد لـ ${product}. التفاصيل بالإنجليزية أدناه — ويمكننا التواصل بالعربية أيضًا.`,
    fr: `Bonjour ${greeting}, nous vous écrivons depuis Chongqing (Chine) en tant que fournisseur de ${product}. Les détails suivent en anglais — nous pouvons aussi échanger en français.`
  };
  return intros[lang] || "";
}

// 重庆四大品类的专门开发信话术（套用品类模板后，首封+价值跟进自动换成该品类版本）
const CQ_EMAIL_TEMPLATES = {
  moto: {
    firstSubject: "Chongqing motorcycle parts — OEM-grade, mixed container OK",
    hook: "OEM-grade, mixed container OK",
    first: (g, p, sender, company, product) => `Hi ${g},

I saw ${p.company} may deal in ${product} in ${p.market}. We export from Chongqing, working with the Loncin/Zongshen/Lifan supply chain.

We supply ${product} for the fast-moving models your market likely sells — CG125/150, GN125, CB, Bajaj/TVS-compatible, and tricycle/3-wheeler platforms — with OEM-grade quality and steady stock.

What buyers here usually like:
- Low MOQ to start; we mix many item numbers in one 20'/40' container
- CCC / SONCAP / ISO 9001 and full export documents
- Repeat-order consistency and stable FOB Chongqing pricing

Would a fast-moving-parts catalog with a reference price list be useful?

Best regards,
${sender}
${company}`,
    valueSubject: "A starter container mix for motorcycle parts",
    value: (g, p, sender, company, product) => `Hi ${g},

Following up on my note about ${product}.

If it helps, I can put together a starter mix for ${p.market}: the top fast-moving SKUs of ${product} in one container, so you test demand without tying up cash.

Share the models/brands you sell most and I'll send a matched quotation.

Best regards,
${sender}`
  },
  auto: {
    firstSubject: "Chongqing auto parts — aftermarket coverage, flexible MOQ",
    hook: "aftermarket coverage, flexible MOQ",
    first: (g, p, sender, company, product) => `Hi ${g},

I noticed ${p.company} may source ${product} in ${p.market}. We export from Chongqing (Changan supply-chain base) with OE cross-references and stable batch quality.

What buyers usually value:
- Wide aftermarket coverage across common makes/models
- IATF 16949 / E-mark / ISO 9001, stable QC and batch consistency
- Flexible MOQ and fast sampling; mixed-item containers

Happy to send a catalog with our best-selling references and a price range. Which vehicle makes are strongest in your market?

Best regards,
${sender}
${company}`,
    valueSubject: "Best-selling references for your market",
    value: (g, p, sender, company, product) => `Hi ${g},

Quick follow-up on ${product}.

I can prepare a starter list of the highest-demand references of ${product} for ${p.market} in one mixed container, with an OE cross-reference so your counter staff can match quickly.

Tell me the top vehicle models you serve and I'll tailor the quotation.

Best regards,
${sender}`
  },
  electronics: {
    firstSubject: "Chongqing electronics/IT — ODM/OEM, CE·FCC ready",
    hook: "ODM/OEM, CE·FCC ready",
    first: (g, p, sender, company, product) => `Hi ${g},

I saw ${p.company} may buy ${product} in ${p.market}. We work with Chongqing's electronics manufacturing base — one of the world's largest laptop production clusters.

Points buyers here care about:
- ODM/OEM capacity for your own brand/logo
- CE / FCC / RoHS ready, reliable lead time
- Stable supply from an established manufacturing hub

Would a product list with specs and a reference price range be useful? I can also share ODM options if you carry a private label.

Best regards,
${sender}
${company}`,
    valueSubject: "ODM options and best-moving SKUs",
    value: (g, p, sender, company, product) => `Hi ${g},

Following up on my note about ${product}.

If you carry a private label, I can send our ODM options for ${product} (MOQ, customization, packaging) plus CE/FCC docs. If you resell, I'll send the best-moving SKUs with a clean price list.

What categories are you focused on this season?

Best regards,
${sender}`
  },
  machinery: {
    firstSubject: "Chongqing machinery & equipment — project-grade, after-sales",
    hook: "project-grade, spares & after-sales",
    first: (g, p, sender, company, product) => `Hi ${g},

I noticed ${p.company} may source ${product} for projects in ${p.market}. We export from Chongqing's equipment manufacturing cluster with project-grade reliability.

What project buyers usually need:
- Spec-matched equipment with spare parts and after-sales support
- CE / ISO 9001 and full export documents, proper export crating
- Guidance on installation and commissioning

If you share the equipment type and capacity you need, I can send matching models with a reference quotation.

Best regards,
${sender}
${company}`,
    valueSubject: "Spec sheet, spares and after-sales terms",
    value: (g, p, sender, company, product) => `Hi ${g},

Quick follow-up on ${product}.

For projects, I can prepare a spec sheet, spare-parts list and after-sales terms for ${product} up front, so your bid/evaluation is easy.

Tell me the capacity and timeline you need, and I'll tailor a quotation.

Best regards,
${sender}`
  }
};

function buildEmailSequence(campaign, prospect) {
  if (!prospect) return [];

  const props = campaign.valueProps;
  const certs = campaign.certifications;
  const product = campaign.product;
  const sender = campaign.senderName;
  const company = campaign.companyName;
  const greeting = prospect.contactName && prospect.contactName !== "待补全" ? prospect.contactName.split(" ")[0] : "there";
  // 优先用线索自己的品类（四品类并行时不串话术），线索没记品类才退回当前活动的品类
  const tpl = CQ_EMAIL_TEMPLATES[prospect.presetKey || campaign.presetKey];
  // 非英语市场：首封加当地语言开场（西/葡/阿/法），提高打开后的信任度与回复率
  const localIntro = localIntroFor(prospect.market, greeting, product);
  const withIntro = (body) => (localIntro ? `${localIntro}\n\n---\n\n${body}` : body);
  // 聚焦具体产品时（点过 AI 细化或填了聚焦），主题直接点名该产品，比泛品类主题打开率更高
  const focused = (campaign.productTerms || []).length > 0;
  const firstSubject = tpl
    ? focused
      ? `${product} from Chongqing — ${tpl.hook || "factory supplier"}`
      : tpl.firstSubject
    : `Supplier option for ${product}`;

  const sequence = [
    {
      id: makeId("email"),
      label: "首封开发信",
      dayOffset: 0,
      subject: firstSubject,
      body: withIntro(tpl
        ? tpl.first(greeting, prospect, sender, company, product)
        : `Hi ${greeting},

I noticed ${prospect.company} may work with ${product} in ${prospect.market}.

We are a factory/export supplier and can support ${props}. For your market, we can also prepare samples, export packing, and documents such as ${certs}.

Would it be useful if I send a short catalog and a price range for reference?

Best regards,
${sender}
${company}`)
    },
    {
      id: makeId("email"),
      label: "价值跟进",
      dayOffset: 3,
      subject: tpl && !focused ? tpl.valueSubject : `Quick follow-up on ${product}`,
      body: tpl
        ? tpl.value(greeting, prospect, sender, company, product)
        : `Hi ${greeting},

Just following up on my previous note.

For ${product}, buyers usually care about stable quality, delivery time, and repeat-order consistency. We can help with ${props}, and we are comfortable starting with a small sample order.

If this category is on your sourcing list, I can send 3-5 matching options.

Best regards,
${sender}`
    },
    {
      id: makeId("email"),
      label: "样品/案例",
      dayOffset: 7,
      subject: `Sample options for ${prospect.market}`,
      body: `Hi ${greeting},

I prepared a few ${product} options that may fit ${prospect.market}: standard models, custom logo options, and export packing choices.

If you share your target quantity or price range, I can narrow it down and send a clean quotation.

Best regards,
${sender}`
    },
    {
      id: makeId("email"),
      label: "最后触达",
      dayOffset: 14,
      subject: `Should I close the file?`,
      body: `Hi ${greeting},

I do not want to keep sending emails if ${product} is not relevant for you now.

Should I close this file, or would you like me to send a short catalog for future sourcing?

Best regards,
${sender}`
    }
  ];

  // 合规：每封信尾附一句轻量退订说明（回复 unsubscribe 会被系统识别为退订并自动拉黑）
  const unsub = `If this isn't relevant to you, just reply "unsubscribe" and I won't email again.`;
  return sequence.map((email) => ({ ...email, body: `${email.body}\n\n${unsub}` }));
}

function buildWhatsappSequence(campaign, prospect) {
  if (!prospect) return [];

  const product = campaign.product;
  const sender = campaign.senderName;
  const company = campaign.companyName;
  const greeting = prospect.contactName && prospect.contactName !== "待补全" ? prospect.contactName.split(" ")[0] : "there";

  return [
    {
      id: makeId("wa"),
      label: "首条触达",
      stage: "确认相关性",
      dayOffset: 0,
      message: `Hi ${greeting}, this is ${sender} from ${company}. I found ${prospect.company} may work with ${product} in ${prospect.market}. Is this category handled by you?`
    },
    {
      id: makeId("wa"),
      label: "价值补充",
      stage: "发送卖点",
      dayOffset: 1,
      message: `We supply ${product} with ${campaign.valueProps}. If relevant, I can send a short catalog and price range here or by email.`
    },
    {
      id: makeId("wa"),
      label: "轻跟进",
      stage: "低压跟进",
      dayOffset: 4,
      message: `Just checking whether ${product} is on your sourcing list. If not, no worries. If yes, I can share 3 matching options for quick review.`
    }
  ];
}

async function runAutomation() {
  readCampaignFromForm();
  state.searchPlan = generateSearchPlan(state.campaign);
  addLog("开始准备获客队列");

  let prospects = null;
  if (state.settings.mode === "webhook" && webhookUrl("search")) {
    prospects = await trySearchWebhook();
  }

  if (!prospects?.length && elements.searchResultsInput.value.trim()) {
    prospects = importSearchResultsText(elements.searchResultsInput.value, state.campaign);
    addLog(`从粘贴结果解析 ${prospects.length} 个线索`);
  }

  if (prospects?.length) {
    state.prospects = [...prospects, ...state.prospects];
    agentOnProspectsImported(prospects);
  }

  // 没有任何线索可跑：主动带用户去导入，而不是静默结束
  if (!state.prospects.length) {
    saveState();
    render();
    navigateTo("discovery");
    elements.searchResultsInput.focus();
    addLog("还没有线索：请在下方粘贴搜索结果（点「示例格式」可快速试用），或在「设置」接入采集 Webhook");
    saveState();
    renderLogs();
    return;
  }

  // 有线索：跑完整一拍——补全验证 → 高分入队待审 → WhatsApp 待确认 → 接力待审
  const raw = state.prospects.filter((item) => ["新发现", "待审核"].includes(item.status));
  if (raw.length) {
    const processed = verifyProspectList(enrichProspectList(raw, state.campaign), state.campaign);
    const byId = new Map(processed.map((item) => [item.id, item]));
    state.prospects = state.prospects.map((item) => byId.get(item.id) || item);
  }

  state.selectedProspectId = state.prospects[0]?.id || null;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  queueTopProspects();
  queueTopWhatsappProspects();
  scheduleFollowupTasks(false);
  const relayed = relayPass(true);
  const pendingEmail = state.outbox.filter((item) => ["待审批", "待发送"].includes(item.status)).length;
  const pendingWa = state.whatsappQueue.filter((item) => item.status === "待人工确认").length;
  addLog(
    `自动化准备完成：${state.prospects.length} 个线索，${pendingEmail} 封邮件待审批发送，接力 ${relayed} 条${
      pendingWa ? `；${pendingWa} 条 WhatsApp 待人工确认` : ""
    }`
  );
  saveState();
  render();
  navigateTo("automation");
}

async function trySearchWebhook() {
  const result = await callWebhook("search", { campaign: state.campaign, searchPlan: state.searchPlan });
  if (result.ok && Array.isArray(result.data?.prospects) && result.data.prospects.length) {
    addLog(`Webhook 返回 ${result.data.prospects.length} 个潜客`);
    return normalizeRemoteProspects(result.data.prospects);
  }
  addLog(result.ok ? "Webhook 未返回线索，等待导入真实搜索结果" : `搜索 Webhook 失败：${result.error || result.code || "未配置"}`);
  return null;
}

/* ---------- Webhook 联调（连接测试 + 真实派发 + 活动日志） ---------- */

function setWebhookStatus(name, status) {
  if (!state.settings.webhookStatus) state.settings.webhookStatus = {};
  state.settings.webhookStatus[name] = { ...status, time: timestamp() };
}

function recordWebhook(name, entry) {
  const label = WEBHOOK_CONNECTORS[name]?.label || name;
  const detail = entry.ok
    ? `${label} · ${entry.code || 200} · ${entry.ms}ms${entry.note ? ` · ${entry.note}` : ""}`
    : `${label} · 失败 · ${entry.note || entry.code || "无响应"}`;
  state.webhookLog.unshift({ id: makeId("wh"), ok: entry.ok, message: detail, url: entry.url || "", time: timestamp() });
  state.webhookLog = state.webhookLog.slice(0, 40);
}

function webhookUrl(name) {
  const cfg = WEBHOOK_CONNECTORS[name];
  if (!cfg) return "";
  return (elements[cfg.urlKey]?.value || state.settings[cfg.urlKey] || "").trim();
}

async function callWebhook(name, payload) {
  const url = webhookUrl(name);
  if (!url) {
    setWebhookStatus(name, { ok: false, note: "未配置" });
    recordWebhook(name, { url: "", ok: false, note: "未配置 URL" });
    return { ok: false, skipped: true };
  }
  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: name, sentAt: new Date().toISOString(), ...payload })
    });
    const ms = Date.now() - start;
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    setWebhookStatus(name, { ok: response.ok, code: response.status, ms });
    recordWebhook(name, { url, ok: response.ok, code: response.status, ms });
    return { ok: response.ok, code: response.status, data, ms };
  } catch (error) {
    const ms = Date.now() - start;
    setWebhookStatus(name, { ok: false, note: error.message, ms });
    recordWebhook(name, { url, ok: false, note: error.message, ms });
    return { ok: false, error: error.message, ms };
  }
}

async function testWebhook(name) {
  readSettingsFromForm();
  addLog(`测试 ${WEBHOOK_CONNECTORS[name]?.label || name} Webhook 连接`);
  renderWebhookStatus(name, { ok: false, note: "测试中", pending: true });
  const result = await callWebhook(name, {
    ping: true,
    campaign: { product: state.campaign.product, markets: state.campaign.markets }
  });
  addLog(result.skipped ? "未填写该 Webhook 地址" : result.ok ? "连接成功" : `连接失败：${result.error || result.code}`);
  saveState();
  render();
}

async function dispatchPending() {
  readSettingsFromForm();
  const today = dateOffset(0);

  if (state.settings.mode !== "webhook") {
    let sent = 0;
    let blocked = 0;
    state.outbox.forEach((item) => {
      if (item.status !== "待发送" || item.dueDate > today) return;
      if (!preflightOutboxItem(item).ok) {
        blocked += 1;
        return;
      }
      item.status = "已发送";
      item.sentAt = new Date().toISOString();
      const h = hashInt(item.prospectId + item.step);
      item.delivered = h % 100 < 95;
      const prospect = state.prospects.find((p) => p.id === item.prospectId);
      item.opened = item.delivered && (h >> 3) % 100 < Math.min(88, 38 + Math.round((prospect?.score || 60) * 0.5));
      advanceDealStage(item.prospectId, "已触达");
      sent += 1;
    });
    const waSent = deliverApprovedWhatsapp(true);
    addLog(
      `本地模式：模拟发送 ${sent} 封已批准到期邮件、${waSent} 条已审批到期 WhatsApp${blocked ? `，预检拦截 ${blocked} 封` : ""}（切到 Webhook 模式可派发到真实服务）`
    );
    saveState();
    render();
    return;
  }

  const pendingEmailCandidates = state.outbox.filter((item) => item.status === "待发送" && item.dueDate <= today);
  const pendingEmails = pendingEmailCandidates.filter((item) => preflightOutboxItem(item).ok);
  const blockedEmails = pendingEmailCandidates.length - pendingEmails.length;
  const approvedWa = state.whatsappQueue.filter((item) => item.status === "已审批" && item.dueDate <= today);
  if (blockedEmails) addLog(`发信预检拦截 ${blockedEmails} 封已批准邮件，请先修复联系方式或退订状态`);

  if (pendingEmails.length) {
    const result = await callWebhook("send", { emails: pendingEmails });
    if (result.ok) {
      pendingEmails.forEach((item) => {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
        advanceDealStage(item.prospectId, "已触达");
      });
      addLog(`发信 Webhook：已派发 ${pendingEmails.length} 封邮件`);
    } else {
      addLog(`发信 Webhook 派发失败：${result.error || result.code || "未配置"}`);
    }
  }

  if (approvedWa.length) {
    const result = await callWebhook("whatsapp", { messages: approvedWa });
    if (result.ok) {
      approvedWa.forEach((item) => {
        item.status = "已发送";
        item.sentAt = item.sentAt || new Date().toISOString();
        advanceDealStage(item.prospectId, "已触达");
      });
      addLog(`WhatsApp Webhook：已派发 ${approvedWa.length} 条模板消息`);
    } else {
      addLog(`WhatsApp Webhook 派发失败：${result.error || result.code || "未配置"}`);
    }
  }

  if (state.prospects.length) {
    const result = await callWebhook("crm", {
      prospects: state.prospects.map((p) => ({
        company: p.company,
        market: p.market,
        email: p.email,
        phone: p.phone,
        stage: p.dealStage,
        score: computeLeadScore(p).probability
      }))
    });
    if (result.ok) addLog(`CRM Webhook：已同步 ${state.prospects.length} 个客户`);
    else addLog(`CRM Webhook 同步失败：${result.error || result.code || "未配置"}`);
  }

  if (!pendingEmails.length && !approvedWa.length) {
    addLog("没有已批准待发送邮件或已审批 WhatsApp（可先在队列/审批中心处理）");
  }
  saveState();
  render();
}

function renderWebhookStatus(name, override) {
  const names = name ? [name] : Object.keys(WEBHOOK_CONNECTORS);
  names.forEach((key) => {
    const el = document.querySelector(`[data-webhook-status="${key}"]`);
    if (!el) return;
    const status = override || state.settings.webhookStatus?.[key];
    el.classList.remove("ok", "fail", "pending");
    if (!status) {
      el.textContent = "未测试";
      return;
    }
    if (status.pending) {
      el.classList.add("pending");
      el.textContent = "测试中…";
      return;
    }
    if (status.ok) {
      el.classList.add("ok");
      el.textContent = `正常 · ${status.code || 200} · ${status.ms ?? "-"}ms`;
    } else {
      el.classList.add("fail");
      el.textContent = status.note === "未配置" ? "未配置" : `失败 · ${status.note || status.code || ""}`;
    }
  });
}

function renderWebhookLog() {
  if (!elements.webhookLog) return;
  elements.webhookLog.innerHTML = state.webhookLog.length
    ? state.webhookLog
        .map(
          (item) => `
            <article class="log-item ${item.ok ? "ok" : "fail"}">
              <strong>${escapeHtml(item.message)}</strong>
              <span>${item.time}</span>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state">暂无 Webhook 调用记录</div>`;
}

function renderWebhookPanel() {
  renderWebhookStatus();
  renderWebhookLog();
}

/* ---------- 自动驾驶引擎（全流程自动流转） ---------- */

let autopilotTimer = null;

function setJob(id, patch) {
  state.management.jobs = state.management.jobs.map((job) => (job.id === id ? { ...job, ...patch } : job));
}

function setJobDone(id) {
  setJob(id, { status: "已完成", progress: 100, nextRun: state.autopilot?.enabled ? "自动驾驶中" : "下个周期" });
}

function crmProspectsPayload() {
  return state.prospects.map((p) => ({
    company: p.company,
    market: p.market,
    email: p.email,
    phone: p.phone,
    stage: p.dealStage,
    score: computeLeadScore(p).probability
  }));
}

function startAutopilotTimer() {
  if (autopilotTimer) clearInterval(autopilotTimer);
  autopilotTimer = setInterval(() => {
    autopilotTick();
  }, (state.autopilot?.intervalSec || 8) * 1000);
}

function setAutopilot(enabled) {
  state.autopilot = { ...(state.autopilot || { intervalSec: 8 }), enabled };
  if (enabled) {
    startAutopilotTimer();
    addLog("自动驾驶已开启：自动 找客户→补全联系方式→验证→评分→备好触达方案；发送始终等你审批（Agent 审批卡 / 队列 / 审批中心）");
    saveState();
    render();
    autopilotTick();
  } else {
    if (autopilotTimer) clearInterval(autopilotTimer);
    autopilotTimer = null;
    addLog("自动驾驶已暂停，可随时手动操作");
    saveState();
    render();
  }
}

async function autopilotTick() {
  if (!state.autopilot?.enabled) return;
  const actions = [];

  // -1) 拉取真实客户回信（配置了拉取回复 Webhook 时，每分钟最多拉一次）
  if (state.settings.mode === "webhook" && webhookUrl("inbound")) {
    const lastPull = state.lastInboundPullAt ? new Date(state.lastInboundPullAt).getTime() : 0;
    if (Date.now() - lastPull > 60000) {
      const pulled = await pullInboundReplies(true);
      if (pulled) actions.push(`拉取回信 ${pulled} 条`);
    }
  }

  // -0.5) 拉取发送状态回传（送达/退信/打开；硬退信自动拉黑，保护发信域名）
  if (state.settings.mode === "webhook" && webhookUrl("status")) {
    const lastStatus = state.lastStatusPullAt ? new Date(state.lastStatusPullAt).getTime() : 0;
    if (Date.now() - lastStatus > 60000) {
      const synced = await pullDeliveryStatus(true);
      if (synced) actions.push(`同步发送状态 ${synced} 条`);
    }
  }

  // 0) Agent 周期任务：到周期自动补充一批新线索
  if (agentCycleDue()) {
    const added = await agentRunCycle(false);
    if (added) actions.push(`周期补量 ${added} 家`);
  }

  // 1) 新线索自动补全 + 验证
  const raw = state.prospects.filter((p) => ["新发现", "待审核"].includes(p.status));
  if (raw.length) {
    const processed = verifyProspectList(enrichProspectList(raw, state.campaign), state.campaign);
    const byId = new Map(processed.map((p) => [p.id, p]));
    state.prospects = state.prospects.map((p) => byId.get(p.id) || p);
    actions.push(`补全并验证 ${processed.length} 条新线索`);
    setJobDone("job-enrich");
    setJobDone("job-verify");
  }

  // 2) 高分线索入队暂存（仅无 Agent 任务时；Agent 任务运行时由审批卡把关，不越过审批自动入队）
  //    ★ 发送必须人工审批：自动驾驶只把高分线索备到「待审批」，不自动发出
  if (!state.agent?.task || state.agent.task.status === "draft") {
    const queuedBefore = state.outbox.length + state.whatsappQueue.length;
    queueTopProspects();
    queueTopWhatsappProspects();
    const queuedDelta = state.outbox.length + state.whatsappQueue.length - queuedBefore;
    if (queuedDelta > 0) {
      actions.push(`备好 ${queuedDelta} 条待审批触达（等你确认发送）`);
      setJobDone("job-queue");
    }
  }

  // 3) 跨渠道接力（生成的是待审批/待确认，同样等人工发送，不自动发出）
  const relayed = relayPass(true);
  if (relayed) actions.push(`跨渠道接力备好 ${relayed} 条`);

  // 6) 已回复且未响应的会话，自动生成 AI 回复草稿送审批
  //    注意：忽略「已取消」的触达事件（回复即停产生），否则被取消的未来邮件会掩盖客户回复
  let drafts = 0;
  buildConversations().forEach((conversation) => {
    // 已被初轮应答护栏处理（自动答复/转人工/opt-out）的会话不再生成草稿
    const lastInbound = [...state.inbound].reverse().find((m) => m.prospectId === conversation.prospectId);
    if (lastInbound?.autoAction) return;
    const lastMeaningful = [...conversation.events]
      .reverse()
      .find((e) => e.kind === "inbound" || (e.kind === "outbound" && e.status !== "已取消"));
    if (conversation.replied && lastMeaningful?.kind === "inbound" && createAiDraft(conversation.prospectId)) {
      drafts += 1;
    }
  });
  if (drafts) actions.push(`生成 ${drafts} 份 AI 回复草稿待审批`);

  if (actions.length) {
    addLog(`自动驾驶：${actions.join("；")}`);
    if (state.settings.mode === "webhook" && webhookUrl("crm")) {
      callWebhook("crm", { prospects: crmProspectsPayload() }).then((result) => {
        if (result.ok) setJobDone("job-crm");
      });
    }
    saveState();
    render();
  }
}

function updateAutopilotButton() {
  const on = !!state.autopilot?.enabled;
  elements.autopilotToggle.classList.toggle("is-on", on);
  const label = elements.autopilotToggle.querySelector("span");
  if (label) label.textContent = on ? "自动驾驶：开" : "自动驾驶：关";
}

/* ---------- 导航徽标 + 新手引导清单 ---------- */

function renderNavBadges() {
  const badges = {
    inbox: state.inbound.filter((m) => !m.read).length,
    management:
      state.whatsappQueue.filter((i) => i.status === "待人工确认").length +
      state.outbox.filter((i) => i.status === "待审批").length,
    automation: state.outbox.filter((i) => ["待审批", "待发送"].includes(i.status)).length,
    agent: state.agent.approvals.filter((a) => a.status === "pending").length
  };
  elements.navTabs.forEach((tab) => {
    const count = badges[tab.dataset.view] || 0;
    let badge = tab.querySelector(".nav-badge");
    if (!count) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "nav-badge";
      tab.appendChild(badge);
    }
    badge.textContent = count > 99 ? "99+" : String(count);
  });
}

// 今日待办：把每天要处理的事（待审批 / 到期发送 / 新回复 / 到期跟进 / Agent 待审批）聚成一屏，一键直达
function renderTodo() {
  const host = elements.todoPanel;
  if (!host) return;
  const today = dateOffset(0);
  const agentPending = (state.agent?.approvals || []).filter((a) => a.status === "pending").length;
  const pendingApproval = state.outbox.filter((i) => i.status === "待审批").length;
  const dueSend = state.outbox.filter((i) => i.status === "待发送" && i.dueDate <= today).length;
  const unread = state.inbound.filter((m) => !m.read).length;
  const dueFollow = dueFollowupProspects().length;

  const rows = [];
  if (agentPending) rows.push(["robot", `${agentPending} 个 Agent 客户待审批`, `data-goto="agent"`, "去处理"]);
  if (pendingApproval) rows.push(["mail", `${pendingApproval} 封邮件待审批`, `data-goto="automation"`, "去审批"]);
  if (dueSend) rows.push(["zap", `${dueSend} 封已批准邮件到期待发`, `data-goto="automation"`, "去发送"]);
  if (unread) rows.push(["inbox", `${unread} 条新回复待处理`, `data-goto="inbox"`, "去收件箱"]);
  if (dueFollow) rows.push(["shuffle", `${dueFollow} 位客户到期未回复`, `data-todo="followup"`, "一键批量跟进"]);
  // 备份提醒：有真实数据且超 7 天没备份，直接进待办（数据在浏览器里，清缓存会丢）
  const lastBackup = state.ui?.lastBackupAt ? new Date(state.ui.lastBackupAt).getTime() : 0;
  if (state.prospects.length && Date.now() - lastBackup > 7 * 86400000) {
    const days = lastBackup ? Math.floor((Date.now() - lastBackup) / 86400000) : null;
    rows.push(["download", lastBackup ? `已 ${days} 天未备份数据` : "还没备份过数据（清缓存会丢）", `data-todo="backup"`, "一键导出备份"]);
  }

  // Webhook 模式且配了对应 Webhook 时，标题栏放一键拉取（前置条件与后台函数一致）
  const wh = state.settings.mode === "webhook";
  const canPull = wh && !!(state.settings.inboundWebhook || "").trim();
  const canStatus = wh && !!(state.settings.statusWebhook || "").trim();
  const pullBtn = canPull
    ? `<button class="ghost-button todo-pull" data-todo="pull" type="button"><svg><use href="#icon-download" /></svg><span>拉取新回复</span></button>`
    : "";
  const statusBtn = canStatus
    ? `<button class="ghost-button todo-pull" data-todo="pullstatus" type="button"><svg><use href="#icon-check" /></svg><span>拉取送达状态</span></button>`
    : "";
  const head = `<div class="todo-head"><strong>今日待办</strong>${rows.length ? `<span class="todo-count">${rows.length} 项</span>` : ""}<span class="todo-head-spacer"></span>${pullBtn}${statusBtn}</div>`;

  if (!rows.length) {
    host.innerHTML =
      head +
      `<div class="todo-empty">✅ 今日暂无待办。${canPull ? "点右上角「拉取新回复」看有没有新回信。" : "保持每天到收件箱点「拉取回复」，有新回信会自动出现在这里。"}</div>`;
    return;
  }
  host.innerHTML =
    head +
    rows
      .map(
        ([icon, label, action, btn]) => `
        <div class="todo-row">
          <span class="todo-label"><svg><use href="#icon-${icon}" /></svg>${label}</span>
          <button class="ghost-button todo-act" ${action} type="button"><span>${btn}</span></button>
        </div>`
      )
      .join("");
}

function renderChecklist() {
  const host = elements.onboardingChecklist;
  if (!host) return;
  if (state.ui?.checklistDismissed) {
    host.innerHTML = "";
    return;
  }
  const steps = [
    { label: "生成开发计划", hint: "填写产品与市场", done: state.searchPlan.length > 0, goto: "dashboard" },
    { label: "导入搜索结果", hint: "粘贴官网/邮箱/CSV", done: state.prospects.length > 0, goto: "discovery" },
    {
      label: "线索入队触达",
      hint: "审核线索并加入队列",
      done: state.outbox.length + state.whatsappQueue.length > 0,
      goto: "prospects"
    },
    {
      label: "开启自动驾驶",
      hint: "全流程自动流转",
      done: !!state.autopilot?.enabled || state.outbox.some((o) => o.status === "已发送"),
      action: "autopilot"
    },
    { label: "处理回复与审批", hint: "收件箱 + 审批中心", done: state.inbound.length > 0, goto: "inbox" }
  ];
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) {
    host.innerHTML = "";
    return;
  }
  host.innerHTML = `
    <div class="checklist-panel">
      <div class="checklist-head">
        <strong>快速上手 · ${doneCount}/${steps.length}</strong>
        <button class="checklist-dismiss" data-checklist-dismiss type="button">不再显示</button>
      </div>
      <div class="checklist-steps">
        ${steps
          .map(
            (step, index) => `
              <button class="checklist-step ${step.done ? "done" : ""}" type="button" ${
                step.action ? `data-checklist-action="${step.action}"` : `data-goto="${step.goto}"`
              }>
                <span class="step-dot">${step.done ? "✓" : index + 1}</span>
                <span class="step-text"><strong>${step.label}</strong><small>${step.hint}</small></span>
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}
