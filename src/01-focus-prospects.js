/* ---------- 具体产品聚焦：把"泛品类"细化成一个具体零件/小设备的精准定位 ---------- */

const AI_FOCUS_SCHEMA = {
  type: "object",
  properties: {
    english_term: { type: "string", description: "该具体产品最标准的英文行业叫法（买家搜索时会用的词）" },
    synonyms: {
      type: "array",
      items: { type: "string" },
      description: "2-4 个英文同义词/行业别称/常见拼法（不含 english_term 本身）"
    },
    hs_code: { type: "string", description: "最可能的 HS 编码（6 位即可），不确定给最接近的" },
    buyer_types: { type: "string", description: "一句中文：这个具体产品真实的海外买家是谁（如：摩托车修配店供货商、砖厂设备经销商）" },
    keywords: { type: "array", items: { type: "string" }, description: "3-5 个用于搜索该产品买家的英文关键词" },
    value_props_addon: { type: "string", description: "一句英文：针对这个具体产品的补充卖点（材质/精度/兼容机型/产能等）" }
  },
  required: ["english_term", "synonyms", "hs_code", "buyer_types", "keywords", "value_props_addon"]
};

function renderFocusHint() {
  if (!elements.focusHint) return;
  const c = state.campaign;
  if (c.productTerms?.length > 1) {
    elements.focusHint.innerHTML = `已聚焦：<strong>${escapeHtml(c.product)}</strong> · 同义词 ${c.productTerms
      .slice(1)
      .map((t) => `<code>${escapeHtml(t)}</code>`)
      .join(" ")}${c.hsCode ? ` · HS <code>${escapeHtml(c.hsCode)}</code>` : ""}${
      c.buyerHint ? `<br />目标买家：${escapeHtml(c.buyerHint)}` : ""
    }`;
  } else if (c.focusProduct) {
    elements.focusHint.textContent = `已按原文聚焦「${c.focusProduct}」——配置 Claude 后点「AI 细化定位」可自动翻译成行业术语并扩展同义词`;
  } else {
    elements.focusHint.textContent = "";
  }
}

async function refineProductFocus() {
  readCampaignFromForm();
  const raw = (state.campaign.focusProduct || "").trim();
  if (!raw) {
    addLog("请先在「具体产品聚焦」里输入你要卖的具体零件或设备（可中文）");
    return;
  }
  if (!aiEnabled()) {
    // 无 Claude：按原文聚焦，至少让搜索式围绕这个词
    state.campaign.productTerms = [raw];
    state.campaign.product = raw;
    bindCampaignForm();
    state.searchPlan = generateSearchPlan(state.campaign);
    addLog(`已按原文聚焦「${raw}」（未配置 Claude，无法翻译/扩展同义词；建议到设置配置 AI 引擎）`);
    saveState();
    render();
    return;
  }
  addLog(`Claude 正在细化定位「${raw}」…`);
  renderLogs();
  try {
    const system =
      "你是外贸产品定位专家。用户给出一个具体产品（可能是中文的某个零件或小设备），你要产出：标准英文行业叫法、同义词/别称、HS 编码、这个产品真实的海外买家画像、搜索买家用的关键词、针对性补充卖点。要具体到这个产品，不要泛品类。";
    const user = `具体产品: ${raw}
所属大类: ${CQ_PRESETS[state.campaign.presetKey]?.label || state.campaign.product}
目标市场: ${state.campaign.markets}`;
    const data = await callAI(system, user, AI_FOCUS_SCHEMA, 800);
    const terms = [data.english_term, ...(data.synonyms || [])].filter(Boolean);
    state.campaign.product = data.english_term;
    state.campaign.productTerms = terms;
    state.campaign.hsCode = data.hs_code || "";
    state.campaign.buyerHint = data.buyer_types || "";
    // 补充卖点：追加不覆盖（品类卖点仍保留）
    if (data.value_props_addon && !state.campaign.valueProps.includes(data.value_props_addon)) {
      state.campaign.valueProps = `${state.campaign.valueProps}; ${data.value_props_addon}`;
    }
    // Agent 关键词：给周期任务/联网搜索用
    if (state.agent?.task?.parsed) {
      state.agent.task.parsed.keywords = [...new Set([...(data.keywords || []), ...(state.agent.task.parsed.keywords || [])])];
    }
    bindCampaignForm();
    state.searchPlan = generateSearchPlan(state.campaign);
    addLog(
      `细化完成：「${raw}」→ ${data.english_term}（同义词 ${terms.length - 1} 个 · HS ${data.hs_code}）· 买家：${data.buyer_types}。搜索式已重建，可直接「一键起量」`
    );
    saveState();
    render();
  } catch (error) {
    addLog(`AI 细化定位失败：${error.message}`);
    saveState();
    render();
  }
}

// 搜索式里的产品表达：有同义词组时用 ("a" OR "b" OR "c")，否则用 "product"
function productSearchExpr(campaign) {
  const terms = (campaign.productTerms || []).filter(Boolean).slice(0, 3);
  if (terms.length > 1) return `(${terms.map((t) => `"${t}"`).join(" OR ")})`;
  return `"${(terms[0] || campaign.product).trim()}"`;
}

function bindCampaignForm() {
  const campaign = state.campaign;
  if (elements.focusProductInput) elements.focusProductInput.value = campaign.focusProduct || "";
  renderFocusHint();
  elements.productInput.value = campaign.product;
  elements.marketsInput.value = campaign.markets;
  elements.customerTypeInput.value = campaign.customerType;
  elements.dailyLimitInput.value = campaign.dailyLimit;
  elements.valuePropsInput.value = campaign.valueProps;
  elements.certificationsInput.value = campaign.certifications;
  elements.senderInput.value = campaign.senderName;
  elements.companyInput.value = campaign.companyName;
}

function bindSettingsForm() {
  const settings = state.settings;
  elements.searchWebhook.value = settings.searchWebhook;
  if (elements.inboundWebhook) elements.inboundWebhook.value = settings.inboundWebhook || "";
  if (elements.statusWebhook) elements.statusWebhook.value = settings.statusWebhook || "";
  elements.enrichWebhook.value = settings.enrichWebhook;
  elements.sendWebhook.value = settings.sendWebhook;
  elements.whatsappWebhook.value = settings.whatsappWebhook;
  elements.crmWebhook.value = settings.crmWebhook;
  elements.searchProvider.value = settings.searchProvider;
  elements.emailProvider.value = settings.emailProvider;
  elements.crmProvider.value = settings.crmProvider;
  elements.aiApiKeyInput.value = settings.aiApiKey || "";
  elements.aiModelSelect.value = settings.aiModel || "claude-opus-4-8";
  if (elements.aiProviderSelect) elements.aiProviderSelect.value = aiProviderId();
  if (elements.aiBaseUrlInput) elements.aiBaseUrlInput.value = settings.aiBaseUrl || "";
  applyAiProviderToForm();
  updateModeButtons();
}

function bindManagementForm() {
  const rules = state.management.rules;
  elements.ruleEmailLimit.value = rules.emailDailyLimit;
  elements.ruleWhatsappLimit.value = rules.whatsappDailyLimit;
  elements.ruleScoreThreshold.value = rules.scoreThreshold;
  elements.ruleCooldownDays.value = rules.cooldownDays;
  elements.ruleRequireApproval.checked = rules.requireWhatsappApproval;
}

function bindInboxForm() {
  const relay = state.relay;
  elements.relayEmailToWa.checked = relay.emailToWhatsapp;
  elements.relayWaToEmail.checked = relay.whatsappToEmail;
  elements.relayEmailDays.value = relay.emailNoReplyDays;
  elements.relayWaDays.value = relay.whatsappNoReplyDays;
}

function readInboxRulesFromForm() {
  state.relay = {
    emailToWhatsapp: elements.relayEmailToWa.checked,
    whatsappToEmail: elements.relayWaToEmail.checked,
    emailNoReplyDays: clamp(Number(elements.relayEmailDays.value) || 0, 0, 60),
    whatsappNoReplyDays: clamp(Number(elements.relayWaDays.value) || 0, 0, 60)
  };
}

function readCampaignFromForm() {
  // 具体产品聚焦：手动改了聚焦文本（没点 AI 细化）时，同义词组退回为该文本本身
  const focusText = elements.focusProductInput ? elements.focusProductInput.value.trim() : state.campaign.focusProduct || "";
  if (focusText !== (state.campaign.focusProduct || "")) {
    state.campaign.focusProduct = focusText;
    state.campaign.productTerms = focusText ? [focusText] : [];
  }
  state.campaign = {
    ...state.campaign,
    product: elements.productInput.value.trim() || "your product",
    markets: elements.marketsInput.value.trim() || "United States",
    customerType: elements.customerTypeInput.value,
    dailyLimit: clamp(Number(elements.dailyLimitInput.value) || 30, 1, 300),
    valueProps: elements.valuePropsInput.value.trim() || "stable quality, fast sampling, export packing",
    certifications: elements.certificationsInput.value.trim() || "standard export documents",
    senderName: elements.senderInput.value.trim() || "Your Name",
    companyName: elements.companyInput.value.trim() || "Your Company"
  };
}

function readSettingsFromForm() {
  state.settings = {
    ...state.settings,
    searchWebhook: elements.searchWebhook.value.trim(),
    inboundWebhook: elements.inboundWebhook ? elements.inboundWebhook.value.trim() : state.settings.inboundWebhook || "",
    statusWebhook: elements.statusWebhook ? elements.statusWebhook.value.trim() : state.settings.statusWebhook || "",
    enrichWebhook: elements.enrichWebhook.value.trim(),
    sendWebhook: elements.sendWebhook.value.trim(),
    whatsappWebhook: elements.whatsappWebhook.value.trim(),
    crmWebhook: elements.crmWebhook.value.trim(),
    searchProvider: elements.searchProvider.value,
    emailProvider: elements.emailProvider.value,
    crmProvider: elements.crmProvider.value,
    aiApiKey: elements.aiApiKeyInput.value.trim(),
    aiProvider: elements.aiProviderSelect ? elements.aiProviderSelect.value : state.settings.aiProvider || "anthropic",
    aiBaseUrl: elements.aiBaseUrlInput ? elements.aiBaseUrlInput.value.trim() : state.settings.aiBaseUrl || "",
    aiModel: (elements.aiModelSelect.value || "").trim()
  };
}

// 每个视图对应的渲染函数。render() 只重建当前可见视图，隐藏视图在
// navigateTo 切过去时才渲染——避免每次操作都重建全部 12 个视图的 innerHTML。
const VIEW_RENDERERS = {
  dashboard: [renderTodo, renderMetrics, renderWorkflow, renderTopProspects, renderChecklist],
  agent: [renderAgent],
  discovery: [renderQueries],
  prospects: [renderProspects, renderProspectDetail],
  email: [renderEmailSelect, renderSequence],
  whatsapp: [renderWhatsappSelect, renderWhatsappSequence],
  inbox: [renderInbox],
  crm: [renderCrm],
  automation: [renderOutbox, renderWhatsappQueue, renderTasks, renderLogs],
  analytics: [renderAnalytics],
  management: [renderManagement, renderProducts],
  settings: [renderDataSafety, renderWebhookPanel]
};

function getActiveView() {
  const active = document.querySelector(".view.is-active");
  return active ? active.id.replace(/View$/, "") : "dashboard";
}

function render() {
  ensureSelection();
  // 全局元素（顶栏状态、导航徽标、模式/自动驾驶/AI 开关）——成本低且始终可见，每次都刷新
  renderStatus();
  updateModeButtons();
  updateAutopilotButton();
  updateAiEngineButtons();
  renderNavBadges();
  // 仅渲染当前视图
  const fns = VIEW_RENDERERS[getActiveView()];
  if (fns) fns.forEach((fn) => fn());
}

function ensureSelection() {
  if (!state.prospects.length) {
    state.selectedProspectId = null;
    state.sequence = [];
    state.whatsappSequence = [];
    return;
  }

  const exists = state.prospects.some((prospect) => prospect.id === state.selectedProspectId);
  if (!exists) state.selectedProspectId = state.prospects[0].id;
  const selected = getSelectedProspect();
  if (!state.sequence.length && selected) state.sequence = buildEmailSequence(state.campaign, selected);
  if (!state.whatsappSequence.length && selected) {
    state.whatsappSequence = buildWhatsappSequence(state.campaign, selected);
  }
}

function renderStatus() {
  const mode = state.settings.mode === "webhook" ? "Webhook 模式" : "本地模式";
  elements.campaignStatus.textContent = state.autopilot?.enabled ? `${mode} · 自动驾驶` : mode;
}

function renderMetrics() {
  const verified = state.prospects.filter((item) => item.status === "邮箱有效" || item.status === "已入队").length;
  const queued = state.outbox.filter((item) => ["待发送", "待审批"].includes(item.status)).length;
  const sent = state.outbox.filter((item) => item.status === "已发送").length;
  const whatsappReady = state.prospects.filter((item) => item.phone && item.phoneStatus !== "待查找").length;
  const metrics = [
    ["搜索式", state.searchPlan.length, "可直接打开或接入搜索 API"],
    ["潜客", state.prospects.length, "按市场与客户类型生成"],
    ["可发信", verified, "邮箱规则验证通过"],
    ["WhatsApp", whatsappReady, "有号码可生成聊天链接"],
    ["队列", queued + sent, `${queued} 待审/待发 · ${sent} 已发送`],
    ["WA 队列", state.whatsappQueue.length, "待人工确认或 API 发送"]
  ];

  elements.metricGrid.innerHTML = metrics
    .map(
      ([label, value, hint]) => `
        <article class="metric-card">
          <p class="eyebrow">${label}</p>
          <strong>${value}</strong>
          <span>${hint}</span>
        </article>
      `
    )
    .join("");
}

function renderWorkflow() {
  const steps = [
    ["采集", state.searchPlan.length, "搜索式"],
    ["筛选", state.prospects.length, "潜客"],
    ["验证", state.prospects.filter((item) => item.emailStatus === "格式有效").length, "邮箱"],
    ["写信", state.sequence.length, "邮件"],
    ["WhatsApp", state.whatsappSequence.length, "话术"],
    ["发信", state.outbox.length, "队列"],
    ["跟进", state.tasks.length, "任务"]
  ];

  elements.workflowSteps.innerHTML = steps
    .map(
      ([name, count, unit], index) => `
        <div class="workflow-step ${count ? "" : "is-waiting"}">
          <span class="step-index">${index + 1}</span>
          <div>
            <strong>${name}</strong>
            <span>${count ? `${count} ${unit}` : "待运行"}</span>
          </div>
          <span class="status-pill">${count ? "完成" : "等待"}</span>
        </div>
      `
    )
    .join("");
}

function renderQueries() {
  const filter = elements.queryFilter.value.trim().toLowerCase();
  const filtered = state.searchPlan.filter((item) => {
    const text = `${item.channel} ${item.market} ${item.intent} ${item.query}`.toLowerCase();
    return !filter || text.includes(filter);
  });

  const queryHtml = filtered.length
    ? filtered.map(renderQueryItem).join("")
    : `<div class="empty-state">暂无搜索式<button class="ghost-button" data-goto="dashboard" type="button">去生成开发计划 →</button></div>`;

  elements.queryList.innerHTML = queryHtml;
  elements.queryPreview.innerHTML = state.searchPlan.length
    ? state.searchPlan.slice(0, 6).map(renderQueryItem).join("")
    : `<div class="empty-state">先生成开发计划</div>`;
}

function renderQueryItem(item) {
  return `
    <article class="query-item">
      <div class="query-main">
        <strong>${escapeHtml(item.channel)} · ${escapeHtml(item.market)} · ${escapeHtml(item.priority || "P2")}</strong>
        <code>${escapeHtml(item.query)}</code>
        <span>${escapeHtml(item.intent)} · 下一步：${escapeHtml(item.nextAction || "打开搜索并导入公司官网")}</span>
      </div>
      <a class="ghost-button" href="${item.url}" target="_blank" rel="noreferrer">
        <svg><use href="#icon-link" /></svg>
        <span>打开</span>
      </a>
    </article>
  `;
}

function renderTopProspects() {
  const top = [...state.prospects]
    .map((item) => ({ item, lead: computeLeadScore(item) }))
    .sort((a, b) => b.lead.probability - a.lead.probability)
    .slice(0, 6);
  elements.topProspects.innerHTML = top.length
    ? top
        .map(
          ({ item, lead }) => `
            <button class="mini-prospect" data-prospect-id="${item.id}" type="button">
              <span>
                <strong>${escapeHtml(item.company)}</strong>
                <span>${escapeHtml(item.market)} · ${escapeHtml(item.source)}</span>
              </span>
              <span class="score">${lead.probability}</span>
            </button>
          `
        )
        .join("")
    : `<div class="empty-state">暂无潜客</div>`;
}

function renderProspects() {
  const filter = elements.prospectFilter.value.trim().toLowerCase();
  const status = elements.statusFilter.value;
  const gradeWanted = elements.gradeFilter?.value || "all";
  const sortBy = elements.prospectSort?.value || "quality";

  // 计算一次质量分并缓存，供筛选/排序/展示复用
  const scored = state.prospects.map((item, index) => ({ item, index, lead: computeLeadScore(item) }));

  // 质量分概览（全池，不受筛选影响）：让用户一眼看到有多少优质客户可入队
  const tally = { A: 0, B: 0, C: 0, D: 0 };
  scored.forEach((s) => {
    tally[s.lead.grade] += 1;
  });
  if (elements.queueQualityLeads) {
    const qty = state.prospects.filter(isQualityQueueable).length;
    elements.queueQualityLeads.querySelector("span").textContent = qty ? `一键入队优质客户 (${qty})` : "一键入队优质客户";
  }

  const rows = scored
    .filter(({ item, lead }) => {
      const text = `${item.company} ${item.market} ${item.source} ${item.website} ${item.email}`.toLowerCase();
      const matchesFilter = !filter || text.includes(filter);
      const matchesStatus = status === "all" || item.status === status;
      const matchesGrade = gradeWanted === "all" || lead.grade === gradeWanted;
      return matchesFilter && matchesStatus && matchesGrade;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.index - a.index === 0 ? 0 : a.index - b.index; // 新导入的在数组前面
      if (sortBy === "market") return a.item.market.localeCompare(b.item.market) || b.lead.probability - a.lead.probability;
      return b.lead.probability - a.lead.probability; // quality: 高分在前
    });

  const summary = `<div class="grade-summary">质量分：<span class="prob-grade grade-A">A</span> ${tally.A} · <span class="prob-grade grade-B">B</span> ${tally.B} · <span class="prob-grade grade-C">C</span> ${tally.C} · <span class="prob-grade grade-D">D</span> ${tally.D}</div>`;

  if (!rows.length) {
    elements.prospectTable.innerHTML = `${state.prospects.length ? summary : ""}<div class="empty-state">暂无匹配潜客<button class="ghost-button" data-goto="discovery" type="button">去搜索导入线索 →</button></div>`;
    return;
  }

  elements.prospectTable.innerHTML = `
    ${summary}
    <div class="prospect-row header">
      <span>公司</span>
      <span>市场</span>
      <span>来源</span>
      <span>评分</span>
      <span>状态</span>
    </div>
    ${rows
      .map(
        ({ item, lead }) => `
          <button class="prospect-row ${item.id === state.selectedProspectId ? "is-selected" : ""}" data-prospect-id="${item.id}" type="button">
            <span>
              <span class="company-name">${escapeHtml(item.company)}</span>
              <span class="company-meta">${escapeHtml(item.website)} · ${escapeHtml(item.role)}</span>
            </span>
            <span>${escapeHtml(item.market)}</span>
            <span>${escapeHtml(item.source)}</span>
            <span><span class="prob-grade grade-${lead.grade}">${lead.grade}</span><span class="score">${lead.probability}%</span></span>
            <span><span class="badge">${escapeHtml(item.status)}</span></span>
          </button>
        `
      )
      .join("")}
  `;
}


function renderProspectDetail() {
  const prospect = getSelectedProspect();
  if (!prospect) {
    elements.prospectDetail.innerHTML = `<div class="detail-empty">暂无潜客</div>`;
    return;
  }
  const lead = computeLeadScore(prospect);

  elements.prospectDetail.innerHTML = `
    <div class="detail-title">
      <div>
        <h3>${escapeHtml(prospect.company)}</h3>
        <span class="badge">${escapeHtml(prospect.status)}</span>
      </div>
      <span class="score">${lead.probability}</span>
    </div>
    <dl class="detail-list">
      <div>
        <dt>网站</dt>
        <dd><a href="https://${escapeHtml(prospect.website)}" target="_blank" rel="noreferrer">${escapeHtml(prospect.website)}</a></dd>
      </div>
      <div>
        <dt>联系人</dt>
        <dd>${escapeHtml(prospect.contactName)} · ${escapeHtml(prospect.role)}${
          prospect.contactSource
            ? ` <span class="channel-badge ${prospect.contactSource === "webhook" ? "whatsapp" : prospect.contactSource === "claude" ? "email" : "relay"}">${contactSourceLabel(prospect.contactSource)}</span>`
            : ""
        }</dd>
      </div>
      <div>
        <dt>邮箱${prospect.emailCandidates?.length > 1 ? "候选" : ""}</dt>
        <dd>${
          prospect.emailCandidates?.length
            ? prospect.emailCandidates
                .map(
                  (c, i) =>
                    `<div class="email-cand ${i === 0 ? "primary" : ""}" data-set-email="${escapeHtml(c.email)}" title="点此设为主邮箱">${escapeHtml(c.email)} <span class="cand-conf">${c.confidence}% · ${escapeHtml(c.pattern)}</span></div>`
                )
                .join("")
            : `${escapeHtml(prospect.email || "待补全")} · ${escapeHtml(prospect.emailStatus)}`
        }</dd>
      </div>
      <div>
        <dt>WhatsApp</dt>
        <dd>${escapeHtml(prospect.phone || "待查找")} · ${escapeHtml(prospect.phoneStatus || "待查找")}</dd>
      </div>
      <div>
        <dt>市场与来源</dt>
        <dd>${escapeHtml(prospect.market)} · ${escapeHtml(prospect.source)}</dd>
      </div>
      <div>
        <dt>采购信号</dt>
        <dd>${escapeHtml(prospect.buyingSignal)}</dd>
      </div>
      <div>
        <dt>搜索来源</dt>
        <dd>${escapeHtml(prospect.searchQuery)}</dd>
      </div>
      <div>
        <dt>公司规模</dt>
        <dd>${escapeHtml(prospect.companySize)} · 置信度 ${prospect.confidence}%</dd>
      </div>
      ${
        prospect.companyProfile || prospect.fitNote
          ? `<div><dt>AI 画像</dt><dd>${escapeHtml(prospect.companyProfile || "")}${
              prospect.fitNote
                ? ` <strong>匹配：${escapeHtml(prospect.fitNote)}${typeof prospect.fitScore === "number" ? `（${prospect.fitScore}%）` : ""}</strong>`
                : ""
            }</dd></div>`
          : ""
      }
    </dl>
    ${renderLeadScorePanel(prospect)}
    <div class="detail-actions">
      <button class="primary-button" data-action="find-contact" type="button" title="真实源(Hunter/Apollo via Webhook)优先，否则 Claude 推测，兜底本地规则">
        <svg><use href="#icon-search" /></svg>
        <span>AI 找联系人</span>
      </button>
      <button class="ghost-button" data-action="deep-dig-contact" type="button" title="Claude 联网翻这家官网 About/Team/Contact 页，找真实决策人与邮箱（需配置 AI 引擎）">
        <svg><use href="#icon-robot" /></svg>
        <span>官网深挖联系人</span>
      </button>
      <button class="ghost-button" data-action="find-lookalike" type="button" title="以这家为样本，联网(或本地)扩展出一批相似公司进线索池">
        <svg><use href="#icon-users" /></svg>
        <span>找相似客户</span>
      </button>
      <button class="ghost-button" data-action="approve-prospect" type="button">
        <svg><use href="#icon-check" /></svg>
        <span>审核通过</span>
      </button>
      <button class="ghost-button" data-action="write-email" type="button">
        <svg><use href="#icon-mail" /></svg>
        <span>生成邮件</span>
      </button>
      <button class="ghost-button" data-action="open-whatsapp" type="button">
        <svg><use href="#icon-message" /></svg>
        <span>打开 WhatsApp</span>
      </button>
      <button class="primary-button" data-action="queue-selected" type="button">
        <svg><use href="#icon-zap" /></svg>
        <span>加入队列</span>
      </button>
      <button class="primary-button" data-action="queue-whatsapp" type="button">
        <svg><use href="#icon-message" /></svg>
        <span>加入 WA</span>
      </button>
    </div>
  `;
}

function renderLeadScorePanel(prospect) {
  const { probability, grade, factors } = computeLeadScore(prospect);
  const maxPoints = Math.max(1, ...factors.map((f) => f.points));
  const rows = factors
    .map((factor) => {
      const width = factor.points > 0 ? Math.max(8, Math.round((factor.points / maxPoints) * 100)) : 0;
      const value = factor.points > 0 ? `+${factor.points}` : factor.detail || "0";
      return `
        <div class="factor-row ${factor.tone}">
          <span class="factor-label">${escapeHtml(factor.label)}</span>
          <span class="factor-bar"><span style="width:${width}%"></span></span>
          <span class="factor-points">${escapeHtml(value)}</span>
        </div>
      `;
    })
    .join("");

  return `
    <div class="ai-score">
      <div class="ai-score-head">
        <span class="ai-badge">AI 成交概率</span>
        <span class="prob-grade grade-${grade}">${grade} 级</span>
      </div>
      <div class="prob-value"><strong>${probability}%</strong><span>综合成交概率（含互动信号）</span></div>
      <div class="factor-list">${rows}</div>
    </div>
  `;
}

function renderEmailSelect() {
  elements.emailProspectSelect.innerHTML = state.prospects.length
    ? state.prospects
        .map(
          (item) =>
            `<option value="${item.id}" ${item.id === state.selectedProspectId ? "selected" : ""}>${escapeHtml(item.company)}</option>`
        )
        .join("")
    : `<option value="">暂无潜客</option>`;
}

function renderSequence() {
  const prospect = getSelectedProspect();
  if (!prospect) {
    elements.sequenceGrid.innerHTML = `<div class="empty-state">暂无邮件序列<button class="ghost-button" data-goto="discovery" type="button">先去导入线索 →</button></div>`;
    return;
  }

  if (!state.sequence.length) state.sequence = buildEmailSequence(state.campaign, prospect);

  elements.sequenceGrid.innerHTML = state.sequence
    .map(
      (item) => `
        <article class="panel sequence-card">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Day ${item.dayOffset}</p>
              <h2>${escapeHtml(item.label)}</h2>
            </div>
            <button class="icon-button" data-copy="${item.id}" type="button" aria-label="复制邮件" title="复制邮件">
              <svg><use href="#icon-copy" /></svg>
            </button>
          </div>
          <pre>${escapeHtml(formatEmail(item))}</pre>
        </article>
      `
    )
    .join("");
}

function renderWhatsappSelect() {
  elements.whatsappProspectSelect.innerHTML = state.prospects.length
    ? state.prospects
        .map(
          (item) =>
            `<option value="${item.id}" ${item.id === state.selectedProspectId ? "selected" : ""}>${escapeHtml(item.company)}</option>`
        )
        .join("")
    : `<option value="">暂无潜客</option>`;
}

function renderWhatsappSequence() {
  const prospect = getSelectedProspect();
  if (!prospect) {
    elements.whatsappSequenceGrid.innerHTML = `<div class="empty-state">暂无 WhatsApp 话术<button class="ghost-button" data-goto="discovery" type="button">先去导入线索 →</button></div>`;
    return;
  }

  if (!state.whatsappSequence.length) {
    state.whatsappSequence = buildWhatsappSequence(state.campaign, prospect);
  }

  elements.whatsappSequenceGrid.innerHTML = state.whatsappSequence
    .map(
      (item) => `
        <article class="panel sequence-card">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">${escapeHtml(item.stage)}</p>
              <h2>${escapeHtml(item.label)}</h2>
            </div>
            <button class="icon-button" data-copy-whatsapp="${item.id}" type="button" aria-label="复制 WhatsApp 话术" title="复制 WhatsApp 话术">
              <svg><use href="#icon-copy" /></svg>
            </button>
          </div>
          <pre>${escapeHtml(item.message)}</pre>
          <a class="ghost-button" href="${buildWhatsappUrl(prospect, item.message)}" target="_blank" rel="noreferrer">
            <svg><use href="#icon-message" /></svg>
            <span>打开聊天</span>
          </a>
        </article>
      `
    )
    .join("");
}

function renderOutbox() {
  if (elements.queueFollowups) {
    const dueN = dueFollowupProspects().length;
    elements.queueFollowups.querySelector("span").textContent = dueN ? `一键批量跟进 (${dueN})` : "一键批量跟进";
  }
  if (!state.outbox.length) {
    elements.outboxList.innerHTML = `<div class="empty-state">暂无发信队列<button class="ghost-button" data-goto="prospects" type="button">去挑选潜客 →</button></div>`;
    return;
  }

  const items = [...state.outbox].sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
  const actionable = items.filter((i) => ["待审批", "待发送"].includes(i.status));
  const passCount = actionable.filter((i) => preflightOutboxItem(i).ok).length;
  const blockCount = actionable.length - passCount;

  const strip = actionable.length
    ? `<div class="outbox-controls">
        <label class="outbox-check-all"><input type="checkbox" id="outboxSelectAll" /><span>全选待审/待发 (${actionable.length})</span></label>
        <span class="pf-summary">${passCount} 封预检通过${blockCount ? ` · <span class="pf-block-count">${blockCount} 封需修复</span>` : ""}</span>
        <button class="primary-button" id="batchApproveSend" type="button"><svg><use href="#icon-check" /></svg><span>批量审批发送</span></button>
      </div>`
    : "";

  elements.outboxList.innerHTML =
    strip +
    items
      .map((item) => {
        const selectable = ["待审批", "待发送"].includes(item.status);
        return `
        <article class="outbox-item ${selectable ? "selectable" : ""}">
          ${selectable ? `<input type="checkbox" data-outbox-id="${item.id}" aria-label="选择${escapeHtml(item.status)}邮件" />` : `<span class="outbox-spacer"></span>`}
          <span>
            <strong>${escapeHtml(item.company)} · ${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.email || "（缺邮箱）")} · ${item.dueDate} · ${escapeHtml(item.subject)}</span>
            ${selectable ? sendTimingBadge(item) : ""}
          </span>
          <span class="outbox-status">${selectable ? preflightBadge(item) : ""}<span class="badge">${escapeHtml(item.status)}</span></span>
        </article>
      `;
      })
      .join("");
}

function renderWhatsappQueue() {
  if (!state.whatsappQueue.length) {
    elements.whatsappQueueList.innerHTML = `<div class="empty-state">暂无 WhatsApp 队列</div>`;
    return;
  }

  elements.whatsappQueueList.innerHTML = state.whatsappQueue
    .map(
      (item) => `
        <article class="outbox-item">
          <span>
            <strong>${escapeHtml(item.company)} · ${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.phone)} · ${item.dueDate} · ${escapeHtml(item.status)}</span>
          </span>
          <a class="ghost-button" href="${item.url}" target="_blank" rel="noreferrer">
            <svg><use href="#icon-message" /></svg>
            <span>打开</span>
          </a>
        </article>
      `
    )
    .join("");
}

function renderTasks() {
  if (!state.tasks.length) {
    elements.taskList.innerHTML = `<div class="empty-state">暂无跟进任务</div>`;
    return;
  }

  const tasks = [...state.tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  elements.taskList.innerHTML = tasks
    .map(
      (task) => `
        <article class="task-item">
          <span>
            <strong>${escapeHtml(task.title)}</strong>
            <span>${escapeHtml(task.company)} · ${task.dueDate}</span>
          </span>
          <span class="tag">${escapeHtml(task.type)}</span>
        </article>
      `
    )
    .join("");
}

function renderLogs() {
  elements.runLog.innerHTML = state.logs.length
    ? state.logs
        .slice(0, 60)
        .map(
          (item) => `
            <article class="log-item">
              <strong>${escapeHtml(item.message)}</strong>
              <span>${item.time}</span>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state">暂无日志</div>`;
}
