const STORAGE_KEY = "foreign-trade-automation-v2";

const $ = (selector) => document.querySelector(selector);

const elements = {
  navTabs: document.querySelectorAll(".nav-tab"),
  views: document.querySelectorAll(".view"),
  campaignForm: $("#campaignForm"),
  productInput: $("#productInput"),
  marketsInput: $("#marketsInput"),
  customerTypeInput: $("#customerTypeInput"),
  dailyLimitInput: $("#dailyLimitInput"),
  valuePropsInput: $("#valuePropsInput"),
  certificationsInput: $("#certificationsInput"),
  senderInput: $("#senderInput"),
  companyInput: $("#companyInput"),
  campaignStatus: $("#campaignStatus"),
  generatePlan: $("#generatePlan"),
  resetDemo: $("#resetDemo"),
  runAutomationTop: $("#runAutomationTop"),
  exportJson: $("#exportJson"),
  metricGrid: $("#metricGrid"),
  workflowSteps: $("#workflowSteps"),
  queryPreview: $("#queryPreview"),
  topProspects: $("#topProspects"),
  copyQueries: $("#copyQueries"),
  runDiscovery: $("#runDiscovery"),
  createProspects: $("#createProspects"),
  queryFilter: $("#queryFilter"),
  queryList: $("#queryList"),
  exportQueries: $("#exportQueries"),
  prospectFilter: $("#prospectFilter"),
  statusFilter: $("#statusFilter"),
  prospectTable: $("#prospectTable"),
  prospectDetail: $("#prospectDetail"),
  enrichProspects: $("#enrichProspects"),
  verifyProspects: $("#verifyProspects"),
  buildWhatsappProspects: $("#buildWhatsappProspects"),
  exportProspects: $("#exportProspects"),
  emailProspectSelect: $("#emailProspectSelect"),
  regenerateEmail: $("#regenerateEmail"),
  queueSequence: $("#queueSequence"),
  sequenceGrid: $("#sequenceGrid"),
  whatsappProspectSelect: $("#whatsappProspectSelect"),
  regenerateWhatsapp: $("#regenerateWhatsapp"),
  queueWhatsapp: $("#queueWhatsapp"),
  whatsappSequenceGrid: $("#whatsappSequenceGrid"),
  simulateSend: $("#simulateSend"),
  scheduleFollowups: $("#scheduleFollowups"),
  exportOutbox: $("#exportOutbox"),
  outboxList: $("#outboxList"),
  exportWhatsappQueue: $("#exportWhatsappQueue"),
  whatsappQueueList: $("#whatsappQueueList"),
  taskList: $("#taskList"),
  runLog: $("#runLog"),
  managementKpis: $("#managementKpis"),
  saveCampaignSnapshot: $("#saveCampaignSnapshot"),
  runManagementJobs: $("#runManagementJobs"),
  exportManagement: $("#exportManagement"),
  newManagedCampaign: $("#newManagedCampaign"),
  campaignManager: $("#campaignManager"),
  resetJobs: $("#resetJobs"),
  jobBoard: $("#jobBoard"),
  approveAll: $("#approveAll"),
  approvalCenter: $("#approvalCenter"),
  accountManager: $("#accountManager"),
  saveRules: $("#saveRules"),
  ruleEmailLimit: $("#ruleEmailLimit"),
  ruleWhatsappLimit: $("#ruleWhatsappLimit"),
  ruleScoreThreshold: $("#ruleScoreThreshold"),
  ruleCooldownDays: $("#ruleCooldownDays"),
  ruleRequireApproval: $("#ruleRequireApproval"),
  pipelineManager: $("#pipelineManager"),
  saveSettings: $("#saveSettings"),
  localMode: $("#localMode"),
  webhookMode: $("#webhookMode"),
  searchWebhook: $("#searchWebhook"),
  enrichWebhook: $("#enrichWebhook"),
  sendWebhook: $("#sendWebhook"),
  whatsappWebhook: $("#whatsappWebhook"),
  crmWebhook: $("#crmWebhook"),
  searchProvider: $("#searchProvider"),
  emailProvider: $("#emailProvider"),
  crmProvider: $("#crmProvider")
};

const sourceChannels = [
  "Google",
  "LinkedIn",
  "B2B Directory",
  "Customs Data",
  "Marketplace",
  "Industry Association"
];

let state = loadState();

bindCampaignForm();
bindSettingsForm();
bindManagementForm();
render();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return createDemoState();

  try {
    const parsed = JSON.parse(saved);
    if (!parsed.campaign) return createDemoState();

    const fallback = createDemoState();
    return {
      ...fallback,
      ...parsed,
      campaign: { ...fallback.campaign, ...parsed.campaign },
      settings: { ...fallback.settings, ...parsed.settings },
      searchPlan: Array.isArray(parsed.searchPlan) ? parsed.searchPlan : fallback.searchPlan,
      prospects: Array.isArray(parsed.prospects) ? parsed.prospects : fallback.prospects,
      sequence: Array.isArray(parsed.sequence) ? parsed.sequence : fallback.sequence,
      whatsappSequence: Array.isArray(parsed.whatsappSequence)
        ? parsed.whatsappSequence
        : fallback.whatsappSequence,
      outbox: Array.isArray(parsed.outbox) ? parsed.outbox : fallback.outbox,
      whatsappQueue: Array.isArray(parsed.whatsappQueue) ? parsed.whatsappQueue : fallback.whatsappQueue,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : fallback.tasks,
      logs: Array.isArray(parsed.logs) ? parsed.logs : fallback.logs,
      management: parsed.management
        ? mergeManagement(fallback.management, parsed.management)
        : fallback.management
    };
  } catch {
    return createDemoState();
  }
}

function createDemoState() {
  const campaign = {
    product: "stainless steel water bottle",
    markets: "United States, Germany, United Arab Emirates",
    customerType: "importer distributor",
    valueProps: "factory direct price, custom logo, low MOQ, fast sampling, export packing",
    certifications: "BSCI, LFGB, FDA",
    senderName: "Your Name",
    companyName: "Your Company",
    dailyLimit: 30
  };
  const searchPlan = generateSearchPlan(campaign);
  let prospects = generateProspects(campaign, 15);
  prospects = verifyProspectList(enrichProspectList(prospects, campaign), campaign);
  const selectedProspectId = prospects[0]?.id || null;
  const sequence = selectedProspectId
    ? buildEmailSequence(campaign, prospects.find((item) => item.id === selectedProspectId))
    : [];
  const whatsappSequence = selectedProspectId
    ? buildWhatsappSequence(campaign, prospects.find((item) => item.id === selectedProspectId))
    : [];

  return {
    campaign,
    activeCampaignId: "campaign-demo",
    settings: {
      mode: "local",
      searchWebhook: "",
      enrichWebhook: "",
      sendWebhook: "",
      whatsappWebhook: "",
      crmWebhook: "",
      searchProvider: "Google Custom Search / SerpAPI",
      emailProvider: "Hunter / Apollo / Dropcontact",
      crmProvider: "Twenty / Wukong CRM"
    },
    searchPlan,
    prospects,
    selectedProspectId,
    sequence,
    whatsappSequence,
    outbox: [],
    whatsappQueue: [],
    tasks: [],
    management: createManagementState(campaign),
    logs: [{ id: makeId("log"), time: timestamp(), message: "示例自动化活动已生成" }]
  };
}

function createManagementState(campaign) {
  return {
    campaigns: [
      {
        id: "campaign-demo",
        name: `${campaign.product} · ${normalizeMarkets(campaign.markets).slice(0, 2).join(", ")}`,
        product: campaign.product,
        markets: campaign.markets,
        owner: campaign.senderName,
        status: "运行中",
        stage: "开发中",
        createdAt: dateOffset(0),
        prospects: 15,
        queued: 0,
        replies: 0
      }
    ],
    jobs: [
      { id: "job-search", name: "搜索采集", cadence: "每 4 小时", status: "待执行", progress: 0, nextRun: "今天" },
      { id: "job-enrich", name: "资料补全", cadence: "每 2 小时", status: "待执行", progress: 0, nextRun: "今天" },
      { id: "job-verify", name: "邮箱/号码验证", cadence: "每 2 小时", status: "待执行", progress: 0, nextRun: "今天" },
      { id: "job-sequence", name: "话术生成", cadence: "实时", status: "待执行", progress: 0, nextRun: "触发后" },
      { id: "job-queue", name: "入队与限流", cadence: "每日", status: "待执行", progress: 0, nextRun: "明天 09:00" },
      { id: "job-crm", name: "CRM 同步", cadence: "每 6 小时", status: "待配置", progress: 0, nextRun: "配置后" }
    ],
    approvals: [
      { id: "approval-wa", type: "WhatsApp", title: "WhatsApp 冷启动消息需人工确认", count: 0, status: "待处理" },
      { id: "approval-template", type: "模板", title: "邮件和 WhatsApp 话术审核", count: 4, status: "待处理" },
      { id: "approval-risk", type: "风控", title: "低分线索不自动发送", count: 0, status: "待处理" }
    ],
    accounts: [
      { id: "acct-email", channel: "Email", name: "企业邮箱", health: "正常", dailyLimit: 80, usedToday: 0 },
      { id: "acct-wa", channel: "WhatsApp", name: "WhatsApp Business", health: "待接入", dailyLimit: 30, usedToday: 0 },
      { id: "acct-search", channel: "Search API", name: "搜索采集", health: "本地模拟", dailyLimit: 200, usedToday: 0 },
      { id: "acct-crm", channel: "CRM", name: "客户库同步", health: "待接入", dailyLimit: 500, usedToday: 0 }
    ],
    rules: {
      emailDailyLimit: 80,
      whatsappDailyLimit: 30,
      scoreThreshold: 70,
      cooldownDays: 7,
      requireWhatsappApproval: true
    }
  };
}

function mergeManagement(fallback, current) {
  return {
    campaigns: Array.isArray(current.campaigns) ? current.campaigns : fallback.campaigns,
    jobs: Array.isArray(current.jobs) ? current.jobs : fallback.jobs,
    approvals: Array.isArray(current.approvals) ? current.approvals : fallback.approvals,
    accounts: Array.isArray(current.accounts) ? current.accounts : fallback.accounts,
    rules: { ...fallback.rules, ...(current.rules || {}) }
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindCampaignForm() {
  const campaign = state.campaign;
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
  elements.enrichWebhook.value = settings.enrichWebhook;
  elements.sendWebhook.value = settings.sendWebhook;
  elements.whatsappWebhook.value = settings.whatsappWebhook;
  elements.crmWebhook.value = settings.crmWebhook;
  elements.searchProvider.value = settings.searchProvider;
  elements.emailProvider.value = settings.emailProvider;
  elements.crmProvider.value = settings.crmProvider;
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

function readCampaignFromForm() {
  state.campaign = {
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
    enrichWebhook: elements.enrichWebhook.value.trim(),
    sendWebhook: elements.sendWebhook.value.trim(),
    whatsappWebhook: elements.whatsappWebhook.value.trim(),
    crmWebhook: elements.crmWebhook.value.trim(),
    searchProvider: elements.searchProvider.value,
    emailProvider: elements.emailProvider.value,
    crmProvider: elements.crmProvider.value
  };
}

function render() {
  ensureSelection();
  renderStatus();
  renderMetrics();
  renderWorkflow();
  renderQueries();
  renderTopProspects();
  renderProspects();
  renderProspectDetail();
  renderEmailSelect();
  renderSequence();
  renderWhatsappSelect();
  renderWhatsappSequence();
  renderOutbox();
  renderWhatsappQueue();
  renderTasks();
  renderLogs();
  renderManagement();
  updateModeButtons();
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
  elements.campaignStatus.textContent = state.settings.mode === "webhook" ? "Webhook 模式" : "本地模式";
}

function renderMetrics() {
  const verified = state.prospects.filter((item) => item.status === "邮箱有效" || item.status === "已入队").length;
  const queued = state.outbox.filter((item) => item.status !== "已发送").length;
  const sent = state.outbox.filter((item) => item.status === "已发送").length;
  const whatsappReady = state.prospects.filter((item) => item.phone && item.phoneStatus !== "待查找").length;
  const metrics = [
    ["搜索式", state.searchPlan.length, "可直接打开或接入搜索 API"],
    ["潜客", state.prospects.length, "按市场与客户类型生成"],
    ["可发信", verified, "邮箱规则验证通过"],
    ["WhatsApp", whatsappReady, "有号码可生成聊天链接"],
    ["队列", queued + sent, `${queued} 待发送 · ${sent} 已发送`],
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
    : `<div class="empty-state">暂无搜索式</div>`;

  elements.queryList.innerHTML = queryHtml;
  elements.queryPreview.innerHTML = state.searchPlan.length
    ? state.searchPlan.slice(0, 6).map(renderQueryItem).join("")
    : `<div class="empty-state">先生成开发计划</div>`;
}

function renderQueryItem(item) {
  return `
    <article class="query-item">
      <div class="query-main">
        <strong>${escapeHtml(item.channel)} · ${escapeHtml(item.market)}</strong>
        <code>${escapeHtml(item.query)}</code>
        <span>${escapeHtml(item.intent)}</span>
      </div>
      <a class="ghost-button" href="${item.url}" target="_blank" rel="noreferrer">
        <svg><use href="#icon-link" /></svg>
        <span>打开</span>
      </a>
    </article>
  `;
}

function renderTopProspects() {
  const top = [...state.prospects].sort((a, b) => b.score - a.score).slice(0, 6);
  elements.topProspects.innerHTML = top.length
    ? top
        .map(
          (item) => `
            <button class="mini-prospect" data-prospect-id="${item.id}" type="button">
              <span>
                <strong>${escapeHtml(item.company)}</strong>
                <span>${escapeHtml(item.market)} · ${escapeHtml(item.source)}</span>
              </span>
              <span class="score">${item.score}</span>
            </button>
          `
        )
        .join("")
    : `<div class="empty-state">暂无潜客</div>`;
}

function renderProspects() {
  const filter = elements.prospectFilter.value.trim().toLowerCase();
  const status = elements.statusFilter.value;
  const prospects = state.prospects.filter((item) => {
    const text = `${item.company} ${item.market} ${item.source} ${item.website} ${item.email}`.toLowerCase();
    const matchesFilter = !filter || text.includes(filter);
    const matchesStatus = status === "all" || item.status === status;
    return matchesFilter && matchesStatus;
  });

  if (!prospects.length) {
    elements.prospectTable.innerHTML = `<div class="empty-state">暂无匹配潜客</div>`;
    return;
  }

  elements.prospectTable.innerHTML = `
    <div class="prospect-row header">
      <span>公司</span>
      <span>市场</span>
      <span>来源</span>
      <span>评分</span>
      <span>状态</span>
    </div>
    ${prospects
      .map(
        (item) => `
          <button class="prospect-row ${item.id === state.selectedProspectId ? "is-selected" : ""}" data-prospect-id="${item.id}" type="button">
            <span>
              <span class="company-name">${escapeHtml(item.company)}</span>
              <span class="company-meta">${escapeHtml(item.website)} · ${escapeHtml(item.role)}</span>
            </span>
            <span>${escapeHtml(item.market)}</span>
            <span>${escapeHtml(item.source)}</span>
            <span><span class="score">${item.score}</span></span>
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

  elements.prospectDetail.innerHTML = `
    <div class="detail-title">
      <div>
        <h3>${escapeHtml(prospect.company)}</h3>
        <span class="badge">${escapeHtml(prospect.status)}</span>
      </div>
      <span class="score">${prospect.score}</span>
    </div>
    <dl class="detail-list">
      <div>
        <dt>网站</dt>
        <dd><a href="https://${escapeHtml(prospect.website)}" target="_blank" rel="noreferrer">${escapeHtml(prospect.website)}</a></dd>
      </div>
      <div>
        <dt>联系人</dt>
        <dd>${escapeHtml(prospect.contactName)} · ${escapeHtml(prospect.role)}</dd>
      </div>
      <div>
        <dt>邮箱</dt>
        <dd>${escapeHtml(prospect.email || "待补全")} · ${escapeHtml(prospect.emailStatus)}</dd>
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
    </dl>
    <div class="detail-actions">
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
    elements.sequenceGrid.innerHTML = `<div class="empty-state">暂无邮件序列</div>`;
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
    elements.whatsappSequenceGrid.innerHTML = `<div class="empty-state">暂无 WhatsApp 话术</div>`;
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
  if (!state.outbox.length) {
    elements.outboxList.innerHTML = `<div class="empty-state">暂无发信队列</div>`;
    return;
  }

  const items = [...state.outbox].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  elements.outboxList.innerHTML = items
    .map(
      (item) => `
        <article class="outbox-item">
          <span>
            <strong>${escapeHtml(item.company)} · ${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.email)} · ${item.dueDate} · ${escapeHtml(item.subject)}</span>
          </span>
          <span class="badge">${escapeHtml(item.status)}</span>
        </article>
      `
    )
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

function renderManagement() {
  refreshManagementDerivedData();
  renderManagementKpis();
  renderCampaignManager();
  renderJobBoard();
  renderApprovalCenter();
  renderAccountManager();
  renderPipelineManager();
}

function refreshManagementDerivedData() {
  const activeCampaign = getActiveManagedCampaign();
  if (activeCampaign) {
    activeCampaign.product = state.campaign.product;
    activeCampaign.markets = state.campaign.markets;
    activeCampaign.prospects = state.prospects.length;
    activeCampaign.queued = state.outbox.length + state.whatsappQueue.length;
    activeCampaign.replies = state.prospects.filter((item) => item.status === "已回复").length;
    activeCampaign.stage = activeCampaign.queued ? "触达中" : state.prospects.length ? "采集中" : "待启动";
    activeCampaign.status = state.prospects.length ? "运行中" : "草稿";
  }

  updateApprovalCount("approval-wa", state.whatsappQueue.filter((item) => item.status === "待人工确认").length);
  updateApprovalCount("approval-template", state.sequence.length + state.whatsappSequence.length);
  updateApprovalCount(
    "approval-risk",
    state.prospects.filter((item) => item.score < state.management.rules.scoreThreshold).length
  );

  updateAccountUsage("acct-email", state.outbox.length);
  updateAccountUsage("acct-wa", state.whatsappQueue.length);
  updateAccountUsage("acct-search", state.searchPlan.length);
  updateAccountUsage("acct-crm", state.prospects.filter((item) => item.status === "已入队").length);
}

function getActiveManagedCampaign() {
  return (
    state.management.campaigns.find((campaign) => campaign.id === state.activeCampaignId) ||
    state.management.campaigns[0] ||
    null
  );
}

function updateApprovalCount(id, count) {
  const approval = state.management.approvals.find((item) => item.id === id);
  if (!approval) return;
  approval.count = count;
  approval.status = count ? "待处理" : "已清空";
}

function updateAccountUsage(id, usedToday) {
  const account = state.management.accounts.find((item) => item.id === id);
  if (!account) return;
  account.usedToday = usedToday;
  if (account.health !== "待接入") account.health = usedToday > account.dailyLimit ? "超限" : account.health;
}

function renderManagementKpis() {
  const pendingJobs = state.management.jobs.filter((job) => job.status !== "已完成").length;
  const pendingApprovals = state.management.approvals.reduce((sum, item) => sum + item.count, 0);
  const healthyAccounts = state.management.accounts.filter((item) => item.health === "正常" || item.health === "本地模拟").length;
  const kpis = [
    ["活动", state.management.campaigns.length, "正在管理的开发活动"],
    ["自动化任务", pendingJobs, "待执行或待配置"],
    ["审批", pendingApprovals, "需要人工确认"],
    ["渠道", healthyAccounts, "可用账号/接口"],
    ["规则", state.management.rules.scoreThreshold, "最低线索评分"]
  ];

  elements.managementKpis.innerHTML = kpis
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

function renderCampaignManager() {
  elements.campaignManager.innerHTML = `
    <div class="management-row header">
      <span>活动</span>
      <span>市场</span>
      <span>阶段</span>
      <span>线索</span>
      <span>队列</span>
      <span>状态</span>
    </div>
    ${state.management.campaigns
      .map(
        (campaign) => `
          <button class="management-row ${campaign.id === state.activeCampaignId ? "is-selected" : ""}" data-campaign-id="${campaign.id}" type="button">
            <span>
              <span class="company-name">${escapeHtml(campaign.name)}</span>
              <span class="company-meta">${escapeHtml(campaign.product)} · ${escapeHtml(campaign.owner)}</span>
            </span>
            <span>${escapeHtml(campaign.markets)}</span>
            <span><span class="tag">${escapeHtml(campaign.stage)}</span></span>
            <span>${campaign.prospects}</span>
            <span>${campaign.queued}</span>
            <span><span class="badge">${escapeHtml(campaign.status)}</span></span>
          </button>
        `
      )
      .join("")}
  `;
}

function renderJobBoard() {
  elements.jobBoard.innerHTML = state.management.jobs
    .map(
      (job) => `
        <article class="job-card">
          <div>
            <strong>${escapeHtml(job.name)}</strong>
            <span>${escapeHtml(job.cadence)} · 下次 ${escapeHtml(job.nextRun)}</span>
          </div>
          <div class="job-progress">
            <span style="width:${job.progress}%"></span>
          </div>
          <span class="badge">${escapeHtml(job.status)}</span>
        </article>
      `
    )
    .join("");
}

function renderApprovalCenter() {
  elements.approvalCenter.innerHTML = state.management.approvals
    .map(
      (item) => `
        <article class="approval-card">
          <span>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.type)} · ${item.count} 项</span>
          </span>
          <span class="badge">${escapeHtml(item.status)}</span>
        </article>
      `
    )
    .join("");
}

function renderAccountManager() {
  elements.accountManager.innerHTML = state.management.accounts
    .map((account) => {
      const usage = Math.min(100, Math.round((account.usedToday / Math.max(account.dailyLimit, 1)) * 100));
      return `
        <article class="account-card">
          <div>
            <strong>${escapeHtml(account.channel)}</strong>
            <span>${escapeHtml(account.name)} · ${escapeHtml(account.health)}</span>
          </div>
          <div class="job-progress"><span style="width:${usage}%"></span></div>
          <span>${account.usedToday}/${account.dailyLimit}</span>
        </article>
      `;
    })
    .join("");
}

function renderPipelineManager() {
  const stages = ["新发现", "已丰富", "邮箱有效", "已入队", "已回复"];
  const maxCount = Math.max(1, ...stages.map((stage) => state.prospects.filter((item) => item.status === stage).length));
  elements.pipelineManager.innerHTML = stages
    .map((stage) => {
      const count = state.prospects.filter((item) => item.status === stage).length;
      const width = Math.max(6, Math.round((count / maxCount) * 100));
      return `
        <div class="pipeline-row">
          <span>${stage}</span>
          <div class="job-progress"><span style="width:${width}%"></span></div>
          <strong>${count}</strong>
        </div>
      `;
    })
    .join("");
}

function generateSearchPlan(campaign) {
  const product = campaign.product.trim();
  const type = campaign.customerType.replaceAll(" ", " OR ");
  const markets = normalizeMarkets(campaign.markets);
  const patterns = [
    ["Google", "官网与采购邮箱", (market) => `"${product}" ${type} "${market}" "contact us"`],
    ["Google", "采购负责人", (market) => `"${product}" "${market}" "purchasing manager" OR "sourcing manager"`],
    ["LinkedIn", "公司主页", (market) => `site:linkedin.com/company "${product}" "${market}" importer OR distributor`],
    ["B2B Directory", "批发商目录", (market) => `"${product}" "${market}" wholesale distributor directory`],
    ["Customs Data", "进口记录", (market) => `"${product}" "${market}" importer "bill of lading"`],
    ["Marketplace", "平台买家与竞品", (market) => `"${product}" "${market}" private label buyer retailer`],
    ["Industry Association", "协会会员", (market) => `"${product}" "${market}" association members suppliers buyers`]
  ];

  return markets.flatMap((market) =>
    patterns.map(([channel, intent, build]) => {
      const query = build(market);
      return {
        id: makeId("query"),
        channel,
        market,
        intent,
        query,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`
      };
    })
  );
}

function generateProspects(campaign, targetCount = 18) {
  const markets = normalizeMarkets(campaign.markets);
  const productNoun = getProductNoun(campaign.product);
  const perMarket = Math.max(4, Math.ceil(targetCount / Math.max(markets.length, 1)));
  const prefixes = ["Atlas", "Northstar", "Prime", "Summit", "Blueport", "Harbor", "Apex", "Metro", "Pioneer", "Meridian", "Continental", "TradeLink", "Urban", "Global"];
  const suffixes = suffixesForType(campaign.customerType);
  const roles = rolesForType(campaign.customerType);
  const prospects = [];

  markets.forEach((market, marketIndex) => {
    for (let index = 0; index < perMarket; index += 1) {
      const source = sourceChannels[(index + marketIndex) % sourceChannels.length];
      const prefix = prefixes[(index + marketIndex * 2) % prefixes.length];
      const suffix = suffixes[(index + marketIndex) % suffixes.length];
      const company = `${prefix} ${capitalize(productNoun)} ${suffix}`;
      const domain = makeDomain(company, market);
      const query = `${campaign.product} ${market} ${campaign.customerType}`;
      prospects.push({
        id: makeId("prospect"),
        company,
        market,
        source,
        website: domain,
        contactName: "待补全",
        role: roles[index % roles.length],
        email: "",
        emailStatus: "待查找",
        phone: "",
        phoneStatus: "待查找",
        status: "新发现",
        score: scoreProspect(source, market, index),
        confidence: 42 + ((index * 7 + marketIndex * 9) % 24),
        buyingSignal: `${market} 市场存在 ${campaign.product} 采购或分销线索`,
        companySize: ["11-50", "51-200", "201-500", "500+"][index % 4],
        searchQuery: query
      });
    }
  });

  return prospects.slice(0, targetCount);
}

function enrichProspectList(prospects, campaign) {
  const firstNames = ["Anna", "Mark", "Carla", "Omar", "Elin", "Lucas", "Maya", "David", "Sofia", "Nina", "Jonas", "Rita"];
  const lastNames = ["Weber", "Lewis", "Mendes", "Saeed", "Larsson", "Miller", "Khan", "Brown", "Garcia", "Hassan", "Smith", "Rossi"];
  const aliases = ["sourcing", "purchasing", "procurement", "buying", "import", "sales"];

  return prospects.map((prospect, index) => {
    const alias = aliases[index % aliases.length];
    return {
      ...prospect,
      contactName: `${firstNames[index % firstNames.length]} ${lastNames[(index + 3) % lastNames.length]}`,
      email: `${alias}@${prospect.website}`,
      emailStatus: "待验证",
      phone: prospect.phone || makePhoneNumber(prospect.market, index),
      phoneStatus: "待人工确认",
      status: prospect.status === "已入队" ? prospect.status : "已丰富",
      confidence: Math.min(95, prospect.confidence + 18),
      buyingSignal: `${prospect.market} ${campaign.customerType}，匹配 ${campaign.product}，卖点可切入：${campaign.valueProps}`
    };
  });
}

function verifyProspectList(prospects) {
  return prospects.map((prospect) => ({
    ...prospect,
    emailStatus: prospect.email && prospect.email.includes("@") ? "格式有效" : "待查找",
    phoneStatus: prospect.phone ? "可打开聊天" : "待查找",
    status: prospect.status === "已入队" ? "已入队" : prospect.email ? "邮箱有效" : prospect.status,
    confidence: prospect.email ? Math.min(98, prospect.confidence + 9) : prospect.confidence,
    score: prospect.email ? Math.min(99, prospect.score + 5) : prospect.score
  }));
}

function buildEmailSequence(campaign, prospect) {
  if (!prospect) return [];

  const props = campaign.valueProps;
  const certs = campaign.certifications;
  const product = campaign.product;
  const sender = campaign.senderName;
  const company = campaign.companyName;
  const greeting = prospect.contactName && prospect.contactName !== "待补全" ? prospect.contactName.split(" ")[0] : "there";

  return [
    {
      id: makeId("email"),
      label: "首封开发信",
      dayOffset: 0,
      subject: `Supplier option for ${product}`,
      body: `Hi ${greeting},

I noticed ${prospect.company} may work with ${product} in ${prospect.market}.

We are a factory/export supplier and can support ${props}. For your market, we can also prepare samples, export packing, and documents such as ${certs}.

Would it be useful if I send a short catalog and a price range for reference?

Best regards,
${sender}
${company}`
    },
    {
      id: makeId("email"),
      label: "价值跟进",
      dayOffset: 3,
      subject: `Quick follow-up on ${product}`,
      body: `Hi ${greeting},

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
  addLog("开始运行端到端自动化");

  let prospects = null;
  if (state.settings.mode === "webhook" && state.settings.searchWebhook) {
    prospects = await trySearchWebhook();
  }

  state.prospects = prospects || generateProspects(state.campaign, Math.max(12, Math.min(36, state.campaign.dailyLimit)));
  state.prospects = enrichProspectList(state.prospects, state.campaign);
  state.prospects = verifyProspectList(state.prospects, state.campaign);
  state.selectedProspectId = state.prospects[0]?.id || null;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  queueTopProspects();
  queueTopWhatsappProspects();
  scheduleFollowupTasks(false);
  addLog(`自动化完成：${state.prospects.length} 个潜客，${state.outbox.length} 封邮件入队，${state.whatsappQueue.length} 条 WhatsApp 待确认`);
  saveState();
  render();
}

async function trySearchWebhook() {
  try {
    addLog("调用搜索采集 Webhook");
    const result = await postWebhook(state.settings.searchWebhook, {
      type: "search",
      campaign: state.campaign,
      searchPlan: state.searchPlan
    });
    if (Array.isArray(result.prospects) && result.prospects.length) {
      addLog(`Webhook 返回 ${result.prospects.length} 个潜客`);
      return normalizeRemoteProspects(result.prospects);
    }
    addLog("Webhook 未返回潜客，切换本地生成");
  } catch (error) {
    addLog(`Webhook 失败：${error.message}`);
  }
  return null;
}

async function postWebhook(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function normalizeRemoteProspects(items) {
  return items.map((item, index) => ({
    id: item.id || makeId("prospect"),
    company: item.company || item.name || `Imported Prospect ${index + 1}`,
    market: item.market || normalizeMarkets(state.campaign.markets)[0],
    source: item.source || "Webhook",
    website: stripProtocol(item.website || item.domain || ""),
    contactName: item.contactName || item.contact || "待补全",
    role: item.role || "Sourcing Manager",
    email: item.email || "",
    emailStatus: item.email ? "待验证" : "待查找",
    phone: item.phone || item.whatsapp || "",
    phoneStatus: item.phone || item.whatsapp ? "待人工确认" : "待查找",
    status: item.email ? "已丰富" : "新发现",
    score: Number(item.score) || 72,
    confidence: Number(item.confidence) || 60,
    buyingSignal: item.buyingSignal || `${state.campaign.product} potential buyer`,
    companySize: item.companySize || "未知",
    searchQuery: item.searchQuery || ""
  }));
}

function queueTopProspects() {
  const limit = Math.min(state.campaign.dailyLimit, state.management.rules.emailDailyLimit, 10);
  const candidates = [...state.prospects]
    .filter(
      (item) =>
        item.email &&
        item.status !== "已入队" &&
        item.score >= state.management.rules.scoreThreshold
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  candidates.forEach((prospect) => queueProspect(prospect, false));
  if (candidates.length) addLog(`${candidates.length} 个高分潜客加入发信队列`);
}

function queueTopWhatsappProspects() {
  const limit = Math.min(state.campaign.dailyLimit, state.management.rules.whatsappDailyLimit, 8);
  const candidates = [...state.prospects]
    .filter((item) => item.phone && item.score >= state.management.rules.scoreThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  candidates.forEach((prospect) => queueWhatsappProspect(prospect, false));
  if (candidates.length) addLog(`${candidates.length} 个高分潜客加入 WhatsApp 待确认队列`);
}

function queueProspect(prospect, includeFullSequence = true) {
  if (!prospect.email) {
    prospect = verifyProspectList(enrichProspectList([prospect], state.campaign), state.campaign)[0];
    state.prospects = state.prospects.map((item) => (item.id === prospect.id ? prospect : item));
  }

  const sequence = buildEmailSequence(state.campaign, prospect);
  const items = includeFullSequence ? sequence : sequence.slice(0, 1);
  items.forEach((email) => {
    const exists = state.outbox.some((item) => item.prospectId === prospect.id && item.step === email.label);
    if (exists) return;
    state.outbox.push({
      id: makeId("outbox"),
      prospectId: prospect.id,
      company: prospect.company,
      email: prospect.email,
      label: email.label,
      subject: email.subject,
      body: email.body,
      dueDate: dateOffset(email.dayOffset),
      status: "待发送",
      step: email.label
    });
  });

  state.prospects = state.prospects.map((item) =>
    item.id === prospect.id ? { ...item, status: "已入队" } : item
  );
}

function queueWhatsappProspect(prospect, includeFullSequence = true) {
  if (!prospect.phone) {
    prospect = verifyProspectList(enrichProspectList([prospect], state.campaign), state.campaign)[0];
    state.prospects = state.prospects.map((item) => (item.id === prospect.id ? prospect : item));
  }

  const sequence = buildWhatsappSequence(state.campaign, prospect);
  const items = includeFullSequence ? sequence : sequence.slice(0, 1);
  const status = state.management.rules.requireWhatsappApproval ? "待人工确认" : "已审批";
  items.forEach((message) => {
    const exists = state.whatsappQueue.some(
      (item) => item.prospectId === prospect.id && item.step === message.label
    );
    if (exists) return;
    state.whatsappQueue.push({
      id: makeId("waq"),
      prospectId: prospect.id,
      company: prospect.company,
      phone: prospect.phone,
      label: message.label,
      message: message.message,
      dueDate: dateOffset(message.dayOffset),
      status,
      step: message.label,
      url: buildWhatsappUrl(prospect, message.message)
    });
  });
}

function scheduleFollowupTasks(showLog = true) {
  const prospects = state.prospects.filter((item) => item.email);
  let created = 0;
  prospects.forEach((prospect) => {
    [
      ["二次跟进", 3],
      ["发送样品/案例", 7],
      ["最后触达", 14]
    ].forEach(([type, offset]) => {
      const exists = state.tasks.some((task) => task.prospectId === prospect.id && task.type === type);
      if (exists) return;
      state.tasks.push({
        id: makeId("task"),
        prospectId: prospect.id,
        company: prospect.company,
        title: `${type}：${prospect.company}`,
        dueDate: dateOffset(offset),
        type
      });
      created += 1;
    });
  });
  if (showLog) addLog(`生成 ${created} 个跟进任务`);
}

function simulateSendNext() {
  const next = state.outbox.find((item) => item.status === "待发送");
  if (!next) {
    addLog("没有待发送邮件");
    return;
  }
  next.status = "已发送";
  addLog(`已模拟发送：${next.company} · ${next.label}`);
}

function getSelectedProspect() {
  return state.prospects.find((item) => item.id === state.selectedProspectId) || state.prospects[0] || null;
}

function normalizeMarkets(value) {
  return value
    .split(/[,，;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function suffixesForType(type) {
  if (type.includes("retailer")) return ["Retail Group", "Home Stores", "Category Buyers", "Trading"];
  if (type.includes("brand")) return ["Brands", "Private Label", "Consumer Goods", "Design Co"];
  if (type.includes("wholesaler")) return ["Wholesale", "Trade Supply", "Distribution", "Market Supply"];
  if (type.includes("contractor")) return ["Projects", "Build Supply", "Contracting", "Materials"];
  return ["Imports", "Distribution", "Trading", "Supply", "Wholesale"];
}

function rolesForType(type) {
  if (type.includes("retailer")) return ["Category Manager", "Buying Manager", "Merchandising Manager"];
  if (type.includes("brand")) return ["Product Manager", "Sourcing Lead", "Supply Chain Manager"];
  if (type.includes("contractor")) return ["Project Buyer", "Procurement Manager", "Purchasing Director"];
  return ["Sourcing Manager", "Purchasing Manager", "Import Manager"];
}

function scoreProspect(source, market, index) {
  const sourceScore = {
    "Customs Data": 84,
    LinkedIn: 78,
    Google: 75,
    Marketplace: 72,
    "B2B Directory": 70,
    "Industry Association": 76
  };
  const marketBoost = market.length % 11;
  return Math.min(96, sourceScore[source] + marketBoost + (index % 6));
}

function getProductNoun(product) {
  const words = product.toLowerCase().split(/\s+/).filter(Boolean);
  return words.slice(-2).join(" ") || product;
}

function makeDomain(company, market) {
  const tld = tldForMarket(market);
  return `${slugify(company)}.${tld}`;
}

function tldForMarket(market) {
  const value = market.toLowerCase();
  if (value.includes("germany")) return "de";
  if (value.includes("united arab") || value.includes("uae") || value.includes("dubai")) return "ae";
  if (value.includes("brazil")) return "com.br";
  if (value.includes("france")) return "fr";
  if (value.includes("italy")) return "it";
  if (value.includes("spain")) return "es";
  if (value.includes("canada")) return "ca";
  if (value.includes("australia")) return "com.au";
  return "com";
}

function makePhoneNumber(market, index) {
  const value = market.toLowerCase();
  const countryCodes = [
    [/(united states|usa|america)/, "+1"],
    [/(germany|deutschland)/, "+49"],
    [/(united arab|uae|dubai|emirates)/, "+971"],
    [/(brazil)/, "+55"],
    [/(france)/, "+33"],
    [/(italy)/, "+39"],
    [/(spain)/, "+34"],
    [/(canada)/, "+1"],
    [/(australia)/, "+61"],
    [/(united kingdom|uk|britain)/, "+44"]
  ];
  const code = countryCodes.find(([pattern]) => pattern.test(value))?.[1] || "+1";
  const seed = String(230000000 + index * 7919 + value.length * 313).slice(0, 9);
  return `${code}${seed}`;
}

function normalizePhone(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function buildWhatsappUrl(prospect, message) {
  const phone = normalizePhone(prospect.phone);
  const text = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

function stripProtocol(value) {
  return String(value).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function capitalize(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatEmail(item) {
  return `Subject: ${item.subject}

${item.body}`;
}

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function timestamp() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function addLog(message) {
  state.logs.unshift({ id: makeId("log"), time: timestamp(), message });
  state.logs = state.logs.slice(0, 80);
}

function saveCurrentCampaignSnapshot() {
  const existing = getActiveManagedCampaign();
  const snapshot = {
    id: existing?.id || makeId("campaign"),
    name: `${state.campaign.product} · ${normalizeMarkets(state.campaign.markets).slice(0, 2).join(", ")}`,
    product: state.campaign.product,
    markets: state.campaign.markets,
    owner: state.campaign.senderName,
    status: state.prospects.length ? "运行中" : "草稿",
    stage: state.outbox.length || state.whatsappQueue.length ? "触达中" : state.prospects.length ? "采集中" : "待启动",
    createdAt: existing?.createdAt || dateOffset(0),
    prospects: state.prospects.length,
    queued: state.outbox.length + state.whatsappQueue.length,
    replies: existing?.replies || 0
  };

  const exists = state.management.campaigns.some((campaign) => campaign.id === snapshot.id);
  state.management.campaigns = exists
    ? state.management.campaigns.map((campaign) => (campaign.id === snapshot.id ? snapshot : campaign))
    : [snapshot, ...state.management.campaigns];
  state.activeCampaignId = snapshot.id;
  addLog(`活动已保存：${snapshot.name}`);
}

function createManagedCampaign() {
  readCampaignFromForm();
  const campaign = {
    id: makeId("campaign"),
    name: `${state.campaign.product} · ${dateOffset(0)}`,
    product: state.campaign.product,
    markets: state.campaign.markets,
    owner: state.campaign.senderName,
    status: "草稿",
    stage: "待启动",
    createdAt: dateOffset(0),
    prospects: 0,
    queued: 0,
    replies: 0
  };
  state.management.campaigns.unshift(campaign);
  state.activeCampaignId = campaign.id;
  addLog(`新建管理活动：${campaign.name}`);
}

function runPendingManagementJobs() {
  state.management.jobs = state.management.jobs.map((job) => {
    if (job.status === "待配置") return job;
    return { ...job, status: "已完成", progress: 100, nextRun: "下个周期" };
  });
  addLog("管理后台待执行任务已运行");
  runAutomation();
}

function resetManagementJobs() {
  state.management.jobs = createManagementState(state.campaign).jobs;
  addLog("自动化任务中心已重置");
}

function approveAllManagementItems() {
  state.management.approvals = state.management.approvals.map((item) => ({
    ...item,
    count: 0,
    status: "已通过"
  }));
  state.whatsappQueue = state.whatsappQueue.map((item) => ({ ...item, status: "已审批" }));
  addLog("审批中心已全部通过");
}

function saveManagementRules() {
  state.management.rules = {
    emailDailyLimit: clamp(Number(elements.ruleEmailLimit.value) || 80, 1, 500),
    whatsappDailyLimit: clamp(Number(elements.ruleWhatsappLimit.value) || 30, 1, 200),
    scoreThreshold: clamp(Number(elements.ruleScoreThreshold.value) || 70, 0, 100),
    cooldownDays: clamp(Number(elements.ruleCooldownDays.value) || 7, 1, 60),
    requireWhatsappApproval: elements.ruleRequireApproval.checked
  };
  addLog("自动化规则已保存");
}

function exportManagement() {
  const payload = {
    management: state.management,
    activeCampaignId: state.activeCampaignId,
    pipeline: state.prospects,
    outbox: state.outbox,
    whatsappQueue: state.whatsappQueue,
    logs: state.logs
  };
  download(`management-${dateOffset(0)}.json`, JSON.stringify(payload, null, 2), "application/json");
}

function exportJson() {
  download(`foreign-trade-automation-${dateOffset(0)}.json`, JSON.stringify(state, null, 2), "application/json");
}

function exportQueries() {
  const rows = state.searchPlan.map((item) => ({
    channel: item.channel,
    market: item.market,
    intent: item.intent,
    query: item.query,
    url: item.url
  }));
  download(`search-plan-${dateOffset(0)}.csv`, toCsv(rows), "text/csv;charset=utf-8");
}

function exportProspects() {
  download(`prospects-${dateOffset(0)}.csv`, toCsv(state.prospects), "text/csv;charset=utf-8");
}

function exportOutbox() {
  download(`outbox-${dateOffset(0)}.csv`, toCsv(state.outbox), "text/csv;charset=utf-8");
}

function exportWhatsappQueue() {
  download(`whatsapp-queue-${dateOffset(0)}.csv`, toCsv(state.whatsappQueue), "text/csv;charset=utf-8");
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => csvCell(row[header])).join(","));
  return `\uFEFF${headers.join(",")}\n${body.join("\n")}`;
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function makeId(prefix) {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateModeButtons() {
  elements.localMode.classList.toggle("is-active", state.settings.mode === "local");
  elements.webhookMode.classList.toggle("is-active", state.settings.mode === "webhook");
}

elements.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const view = tab.dataset.view;
    elements.navTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    elements.views.forEach((item) => item.classList.toggle("is-active", item.id === `${view}View`));
  });
});

elements.campaignForm.addEventListener("submit", (event) => {
  event.preventDefault();
  readCampaignFromForm();
  state.searchPlan = generateSearchPlan(state.campaign);
  state.prospects = generateProspects(state.campaign, 18);
  state.selectedProspectId = state.prospects[0]?.id || null;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  state.outbox = [];
  state.whatsappQueue = [];
  state.tasks = [];
  addLog(`生成开发计划：${state.campaign.product}`);
  saveState();
  render();
});

elements.resetDemo.addEventListener("click", () => {
  state = createDemoState();
  bindCampaignForm();
  bindSettingsForm();
  bindManagementForm();
  saveState();
  render();
});

elements.runAutomationTop.addEventListener("click", () => {
  runAutomation();
});

elements.exportJson.addEventListener("click", exportJson);

elements.copyQueries.addEventListener("click", async () => {
  await copyText(state.searchPlan.map((item) => item.query).join("\n"));
  addLog("已复制搜索式");
  saveState();
  renderLogs();
});

elements.runDiscovery.addEventListener("click", () => {
  readCampaignFromForm();
  state.searchPlan = generateSearchPlan(state.campaign);
  addLog(`生成 ${state.searchPlan.length} 条搜索式`);
  saveState();
  render();
});

elements.createProspects.addEventListener("click", () => {
  readCampaignFromForm();
  if (!state.searchPlan.length) state.searchPlan = generateSearchPlan(state.campaign);
  state.prospects = generateProspects(state.campaign, 18);
  state.selectedProspectId = state.prospects[0]?.id || null;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  addLog(`生成 ${state.prospects.length} 个潜客`);
  saveState();
  render();
});

elements.queryFilter.addEventListener("input", renderQueries);
elements.exportQueries.addEventListener("click", exportQueries);

elements.prospectFilter.addEventListener("input", renderProspects);
elements.statusFilter.addEventListener("change", renderProspects);

elements.enrichProspects.addEventListener("click", () => {
  state.prospects = enrichProspectList(state.prospects, state.campaign);
  addLog("潜客资料补全完成");
  saveState();
  render();
});

elements.verifyProspects.addEventListener("click", () => {
  state.prospects = verifyProspectList(state.prospects, state.campaign);
  addLog("邮箱验证完成");
  saveState();
  render();
});

elements.buildWhatsappProspects.addEventListener("click", () => {
  state.prospects = verifyProspectList(enrichProspectList(state.prospects, state.campaign), state.campaign);
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  addLog("WhatsApp 联系方式与话术已生成");
  saveState();
  render();
});

elements.exportProspects.addEventListener("click", exportProspects);

elements.prospectTable.addEventListener("click", (event) => {
  const row = event.target.closest("[data-prospect-id]");
  if (!row) return;
  state.selectedProspectId = row.dataset.prospectId;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  saveState();
  render();
});

elements.topProspects.addEventListener("click", (event) => {
  const row = event.target.closest("[data-prospect-id]");
  if (!row) return;
  state.selectedProspectId = row.dataset.prospectId;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  saveState();
  render();
});

elements.prospectDetail.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const prospect = getSelectedProspect();
  if (!action || !prospect) return;

  if (action === "write-email") {
    state.sequence = buildEmailSequence(state.campaign, prospect);
    addLog(`已为 ${prospect.company} 生成邮件序列`);
  }

  if (action === "open-whatsapp") {
    const enriched = prospect.phone
      ? prospect
      : verifyProspectList(enrichProspectList([prospect], state.campaign), state.campaign)[0];
    state.prospects = state.prospects.map((item) => (item.id === enriched.id ? enriched : item));
    const message = buildWhatsappSequence(state.campaign, enriched)[0]?.message || "";
    window.open(buildWhatsappUrl(enriched, message), "_blank", "noopener,noreferrer");
    addLog(`已打开 ${enriched.company} 的 WhatsApp 聊天`);
  }

  if (action === "queue-selected") {
    queueProspect(prospect, true);
    addLog(`${prospect.company} 已加入完整邮件序列`);
  }

  if (action === "queue-whatsapp") {
    queueWhatsappProspect(prospect, true);
    addLog(`${prospect.company} 已加入 WhatsApp 队列`);
  }

  saveState();
  render();
});

elements.emailProspectSelect.addEventListener("change", () => {
  state.selectedProspectId = elements.emailProspectSelect.value;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  saveState();
  render();
});

elements.regenerateEmail.addEventListener("click", () => {
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  addLog("邮件序列已重写");
  saveState();
  render();
});

elements.queueSequence.addEventListener("click", () => {
  const prospect = getSelectedProspect();
  if (!prospect) return;
  queueProspect(prospect, true);
  addLog(`${prospect.company} 已加入发信队列`);
  saveState();
  render();
});

elements.sequenceGrid.addEventListener("click", async (event) => {
  const id = event.target.closest("[data-copy]")?.dataset.copy;
  if (!id) return;
  const email = state.sequence.find((item) => item.id === id);
  if (!email) return;
  await copyText(formatEmail(email));
  addLog(`已复制：${email.label}`);
  saveState();
  renderLogs();
});

elements.whatsappProspectSelect.addEventListener("change", () => {
  state.selectedProspectId = elements.whatsappProspectSelect.value;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  saveState();
  render();
});

elements.regenerateWhatsapp.addEventListener("click", () => {
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  addLog("WhatsApp 话术已重写");
  saveState();
  render();
});

elements.queueWhatsapp.addEventListener("click", () => {
  const prospect = getSelectedProspect();
  if (!prospect) return;
  queueWhatsappProspect(prospect, true);
  addLog(`${prospect.company} 已加入 WhatsApp 队列`);
  saveState();
  render();
});

elements.whatsappSequenceGrid.addEventListener("click", async (event) => {
  const id = event.target.closest("[data-copy-whatsapp]")?.dataset.copyWhatsapp;
  if (!id) return;
  const message = state.whatsappSequence.find((item) => item.id === id);
  if (!message) return;
  await copyText(message.message);
  addLog(`已复制 WhatsApp：${message.label}`);
  saveState();
  renderLogs();
});

elements.simulateSend.addEventListener("click", () => {
  simulateSendNext();
  saveState();
  render();
});

elements.scheduleFollowups.addEventListener("click", () => {
  scheduleFollowupTasks(true);
  saveState();
  render();
});

elements.exportOutbox.addEventListener("click", exportOutbox);
elements.exportWhatsappQueue.addEventListener("click", exportWhatsappQueue);

elements.saveCampaignSnapshot.addEventListener("click", () => {
  saveCurrentCampaignSnapshot();
  saveState();
  render();
});

elements.newManagedCampaign.addEventListener("click", () => {
  createManagedCampaign();
  saveState();
  render();
});

elements.runManagementJobs.addEventListener("click", () => {
  runPendingManagementJobs();
});

elements.resetJobs.addEventListener("click", () => {
  resetManagementJobs();
  saveState();
  render();
});

elements.approveAll.addEventListener("click", () => {
  approveAllManagementItems();
  saveState();
  render();
});

elements.saveRules.addEventListener("click", () => {
  saveManagementRules();
  saveState();
  render();
});

elements.exportManagement.addEventListener("click", exportManagement);

elements.campaignManager.addEventListener("click", (event) => {
  const row = event.target.closest("[data-campaign-id]");
  if (!row) return;
  const campaign = state.management.campaigns.find((item) => item.id === row.dataset.campaignId);
  if (!campaign) return;
  state.activeCampaignId = campaign.id;
  state.campaign = {
    ...state.campaign,
    product: campaign.product,
    markets: campaign.markets,
    senderName: campaign.owner
  };
  bindCampaignForm();
  addLog(`已切换管理活动：${campaign.name}`);
  saveState();
  render();
});

[elements.localMode, elements.webhookMode].forEach((button) => {
  button.addEventListener("click", () => {
    state.settings.mode = button.dataset.mode;
    updateModeButtons();
    renderStatus();
  });
});

elements.saveSettings.addEventListener("click", () => {
  readSettingsFromForm();
  addLog("自动化接口设置已保存");
  saveState();
  render();
});
