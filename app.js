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
  loadImportExample: $("#loadImportExample"),
  importSearchResults: $("#importSearchResults"),
  searchResultsInput: $("#searchResultsInput"),
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
  crmProvider: $("#crmProvider"),
  runRelay: $("#runRelay"),
  markAllRead: $("#markAllRead"),
  relayEmailToWa: $("#relayEmailToWa"),
  relayWaToEmail: $("#relayWaToEmail"),
  relayEmailDays: $("#relayEmailDays"),
  relayWaDays: $("#relayWaDays"),
  relayKpis: $("#relayKpis"),
  conversationFilter: $("#conversationFilter"),
  conversationStatusFilter: $("#conversationStatusFilter"),
  conversationList: $("#conversationList"),
  inboxTimeline: $("#inboxTimeline"),
  crmKpis: $("#crmKpis"),
  crmBoard: $("#crmBoard"),
  scheduleFollowupsCrm: $("#scheduleFollowupsCrm"),
  exportCrm: $("#exportCrm"),
  analyticsKpis: $("#analyticsKpis"),
  analyticsFunnel: $("#analyticsFunnel"),
  channelCompare: $("#channelCompare"),
  relayImpact: $("#relayImpact"),
  marketPerformance: $("#marketPerformance"),
  templateRank: $("#templateRank"),
  simulateCallbacks: $("#simulateCallbacks"),
  exportAnalytics: $("#exportAnalytics"),
  dispatchWebhooks: $("#dispatchWebhooks"),
  webhookLog: $("#webhookLog"),
  autopilotToggle: $("#autopilotToggle"),
  sendDueBtn: $("#sendDueBtn")
};

const WEBHOOK_CONNECTORS = {
  search: { urlKey: "searchWebhook", label: "搜索采集" },
  enrich: { urlKey: "enrichWebhook", label: "邮箱查找/验证" },
  send: { urlKey: "sendWebhook", label: "发信" },
  whatsapp: { urlKey: "whatsappWebhook", label: "WhatsApp" },
  crm: { urlKey: "crmWebhook", label: "CRM 同步" }
};

const DEAL_STAGES = ["线索", "已触达", "已回复", "询盘", "报价", "成交"];

// 客户意图识别字典，按优先级从高到低排列（拒绝优先，其次议价、样品、价格等）
const INTENTS = [
  {
    key: "reject",
    label: "拒绝 / 暂不需要",
    tone: "red",
    next: "礼貌保留，转入季度培育名单",
    keywords: ["not interested", "no thanks", "no need", "unsubscribe", "already have", "not looking", "no longer", "stop sending", "remove me"]
  },
  {
    key: "discount",
    label: "砍价 / 议价",
    tone: "amber",
    next: "了解目标价与年采购量，给出阶梯报价",
    keywords: ["discount", "cheaper", "lower price", "best price", "target price", "too expensive", "better price", "reduce the price", "price down"]
  },
  {
    key: "sample",
    label: "要样品",
    tone: "teal",
    next: "确认样品政策与收货地址，安排寄样",
    keywords: ["sample", "samples", "样品", "free sample", "send a sample", "sample policy"]
  },
  {
    key: "price",
    label: "询价 / 报价",
    tone: "blue",
    next: "发送报价单与价格区间，追问目标采购量",
    keywords: ["price", "quote", "quotation", "cost", "how much", "pricing", "fob", "price list", "catalog", "catalogue", "offer"]
  },
  {
    key: "leadtime",
    label: "交期 / 物流",
    tone: "blue",
    next: "说明生产与打样周期，确认目标到货时间",
    keywords: ["lead time", "delivery", "how long", "shipping", "when can", "dispatch", "eta", "production time"]
  },
  {
    key: "moq",
    label: "MOQ / 起订量",
    tone: "blue",
    next: "说明起订量与价格档位，争取首单",
    keywords: ["moq", "minimum order", "minimum quantity", "min order"]
  },
  {
    key: "cert",
    label: "认证 / 资质",
    tone: "blue",
    next: "提供认证与检测报告，确认目标市场合规要求",
    keywords: ["certificate", "certification", "test report", "fda", "ce", "iso", "compliance", "lfgb", "bsci", "rohs"]
  }
];

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
bindInboxForm();
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
      inbound: Array.isArray(parsed.inbound) ? parsed.inbound : fallback.inbound,
      webhookLog: Array.isArray(parsed.webhookLog) ? parsed.webhookLog : fallback.webhookLog,
      selectedConversationId: parsed.selectedConversationId || fallback.selectedConversationId,
      relay: { ...fallback.relay, ...(parsed.relay || {}) },
      autopilot: { ...fallback.autopilot, ...(parsed.autopilot || {}) },
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
  let prospects = [];
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
      crmProvider: "Twenty / Wukong CRM",
      webhookStatus: {}
    },
    searchPlan,
    prospects,
    selectedProspectId,
    sequence,
    whatsappSequence,
    outbox: [],
    whatsappQueue: [],
    tasks: [],
    inbound: [],
    webhookLog: [],
    selectedConversationId: null,
    relay: {
      emailToWhatsapp: true,
      whatsappToEmail: true,
      emailNoReplyDays: 3,
      whatsappNoReplyDays: 2
    },
    autopilot: { enabled: false, intervalSec: 8 },
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
        prospects: 0,
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
  renderInbox();
  renderCrm();
  renderAnalytics();
  renderLogs();
  renderManagement();
  renderWebhookPanel();
  updateModeButtons();
  updateAutopilotButton();
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
            <span>${scoreBadge(item)}</span>
            <span><span class="badge">${escapeHtml(item.status)}</span></span>
          </button>
        `
      )
      .join("")}
  `;
}

function scoreBadge(prospect) {
  const { probability, grade } = computeLeadScore(prospect);
  return `<span class="prob-grade grade-${grade}">${grade}</span><span class="score">${probability}%</span>`;
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
    ${renderLeadScorePanel(prospect)}
    <div class="detail-actions">
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

/* ---------- 全渠道统一收件箱 + 跨渠道接力 ---------- */

function toTime(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function daysSinceMs(ms) {
  if (!ms) return 0;
  return Math.floor((Date.now() - ms) / 86400000);
}

function buildConversations() {
  const map = new Map();
  const prospectById = new Map(state.prospects.map((item) => [item.id, item]));

  const ensure = (id, company) => {
    if (!map.has(id)) {
      map.set(id, {
        prospectId: id,
        company: company || "未知客户",
        events: [],
        channels: new Set(),
        replied: false,
        unread: 0,
        relayed: false,
        prospect: prospectById.get(id) || null
      });
    }
    const conversation = map.get(id);
    if (company && conversation.company === "未知客户") conversation.company = company;
    return conversation;
  };

  state.outbox.forEach((item) => {
    const conversation = ensure(item.prospectId, item.company);
    conversation.channels.add("email");
    if (item.relay) conversation.relayed = true;
    conversation.events.push({
      kind: "outbound",
      channel: "email",
      relay: !!item.relay,
      title: item.label,
      subject: item.subject,
      body: item.body,
      status: item.status,
      timeLabel: item.sentAt ? `已发送 ${item.dueDate}` : `计划 ${item.dueDate}`,
      sortKey: toTime(item.sentAt || item.createdAt || item.dueDate)
    });
  });

  state.whatsappQueue.forEach((item) => {
    const conversation = ensure(item.prospectId, item.company);
    conversation.channels.add("whatsapp");
    if (item.relay) conversation.relayed = true;
    conversation.events.push({
      kind: "outbound",
      channel: "whatsapp",
      relay: !!item.relay,
      title: item.label,
      body: item.message,
      status: item.status,
      url: item.url,
      timeLabel: item.dueDate,
      sortKey: toTime(item.sentAt || item.createdAt || item.dueDate)
    });
  });

  state.inbound.forEach((item) => {
    const conversation = ensure(item.prospectId, item.company);
    conversation.channels.add(item.channel);
    conversation.replied = true;
    if (!item.read) conversation.unread += 1;
    conversation.events.push({
      kind: "inbound",
      channel: item.channel,
      body: item.body,
      timeLabel: item.time,
      sortKey: toTime(item.at || item.time)
    });
  });

  const list = [...map.values()];
  list.forEach((conversation) => {
    conversation.events.sort((a, b) => a.sortKey - b.sortKey);
    conversation.lastEvent = conversation.events[conversation.events.length - 1] || null;
    conversation.lastActivity = conversation.lastEvent ? conversation.lastEvent.sortKey : 0;
  });
  list.sort((a, b) => b.lastActivity - a.lastActivity);
  return list;
}

function getRelayCandidates(conversations) {
  const emailToWa = [];
  const waToEmail = [];

  conversations.forEach((conversation) => {
    if (conversation.replied || !conversation.prospect) return;
    const emailEvents = conversation.events.filter((e) => e.kind === "outbound" && e.channel === "email");
    const waEvents = conversation.events.filter((e) => e.kind === "outbound" && e.channel === "whatsapp");

    if (state.relay.emailToWhatsapp && emailEvents.length && !waEvents.length && conversation.prospect.phone) {
      const firstEmail = Math.min(...emailEvents.map((e) => e.sortKey));
      if (daysSinceMs(firstEmail) >= state.relay.emailNoReplyDays) emailToWa.push(conversation);
    }

    if (state.relay.whatsappToEmail && waEvents.length && !emailEvents.length && conversation.prospect.email) {
      const firstWa = Math.min(...waEvents.map((e) => e.sortKey));
      if (daysSinceMs(firstWa) >= state.relay.whatsappNoReplyDays) waToEmail.push(conversation);
    }
  });

  return { emailToWa, waToEmail };
}

function renderInbox() {
  const conversations = buildConversations();
  renderRelayKpis(conversations);
  renderConversationList(conversations);

  const exists = conversations.some((c) => c.prospectId === state.selectedConversationId);
  if (!exists) state.selectedConversationId = conversations[0]?.prospectId || null;
  const selected = conversations.find((c) => c.prospectId === state.selectedConversationId) || null;
  renderTimeline(selected);
}

function renderRelayKpis(conversations) {
  const candidates = getRelayCandidates(conversations);
  const pending = candidates.emailToWa.length + candidates.waToEmail.length;
  const relayed = conversations.filter((c) => c.relayed).length;
  const replied = conversations.filter((c) => c.replied).length;
  const cards = [
    ["待接力", pending, "达到接力条件的会话"],
    ["已接力", relayed, "已跨渠道补触达"],
    ["已回复", replied, "客户已回复，停止接力"]
  ];
  elements.relayKpis.innerHTML = cards
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

function channelBadge(channel) {
  return channel === "whatsapp"
    ? `<span class="channel-badge whatsapp">WhatsApp</span>`
    : `<span class="channel-badge email">邮件</span>`;
}

function renderConversationList(conversations) {
  const filter = elements.conversationFilter.value.trim().toLowerCase();
  const statusFilter = elements.conversationStatusFilter.value;

  const filtered = conversations.filter((conversation) => {
    const text = `${conversation.company} ${conversation.prospect?.market || ""}`.toLowerCase();
    if (filter && !text.includes(filter)) return false;
    if (statusFilter === "unreplied") return !conversation.replied;
    if (statusFilter === "replied") return conversation.replied;
    if (statusFilter === "relayed") return conversation.relayed;
    if (statusFilter === "unread") return conversation.unread > 0;
    return true;
  });

  if (!filtered.length) {
    elements.conversationList.innerHTML = `<div class="empty-state">暂无会话，先在「邮件」「WhatsApp」里把潜客加入队列</div>`;
    return;
  }

  elements.conversationList.innerHTML = filtered
    .map((conversation) => {
      const active = conversation.prospectId === state.selectedConversationId ? "is-active" : "";
      const channels = [...conversation.channels].map(channelBadge).join("");
      const relayTag = conversation.relayed ? `<span class="channel-badge relay">接力</span>` : "";
      const unread = conversation.unread ? `<span class="unread-dot">${conversation.unread}</span>` : "";
      const status = conversation.replied ? `<span class="status-pill">已回复</span>` : "";
      const last = conversation.lastEvent;
      const preview = last
        ? `${last.kind === "inbound" ? "↩ 客户：" : "→ "}${escapeHtml((last.body || "").replace(/\s+/g, " ").slice(0, 64))}`
        : "暂无消息";
      return `
        <button class="conversation-item ${active}" data-conversation-id="${conversation.prospectId}" type="button">
          <strong>${escapeHtml(conversation.company)}</strong>
          <span class="conversation-meta">${channels}${relayTag}${status}${unread}</span>
          <span class="conv-preview">${preview}</span>
        </button>
      `;
    })
    .join("");
}

function renderTimeline(conversation) {
  if (!conversation) {
    elements.inboxTimeline.innerHTML = `<div class="empty-state">选择左侧会话查看完整沟通时间线</div>`;
    return;
  }

  const prospect = conversation.prospect;
  const emailEvents = conversation.events.filter((e) => e.kind === "outbound" && e.channel === "email");
  const waEvents = conversation.events.filter((e) => e.kind === "outbound" && e.channel === "whatsapp");
  const canRelayWa =
    !conversation.replied && emailEvents.length && !waEvents.length && prospect?.phone;
  const canRelayEmail =
    !conversation.replied && waEvents.length && !emailEvents.length && prospect?.email;

  const events = conversation.events
    .map((event) => {
      if (event.kind === "inbound") {
        const intent = classifyIntent(event.body);
        return `
          <article class="timeline-item inbound">
            <div class="tl-meta">${channelBadge(event.channel)}<strong>客户回复</strong><span class="intent-tag ${intent.tone}">意图：${intent.label}</span><span>${escapeHtml(event.timeLabel || "")}</span></div>
            <div class="tl-body">${escapeHtml(event.body || "")}</div>
          </article>
        `;
      }
      const relayTag = event.relay ? `<span class="channel-badge relay">接力</span>` : "";
      const subject = event.subject ? `Subject: ${event.subject}\n\n` : "";
      return `
        <article class="timeline-item outbound">
          <div class="tl-meta">${channelBadge(event.channel)}${relayTag}<strong>${escapeHtml(event.title || "")}</strong><span>${escapeHtml(event.status || "")} · ${escapeHtml(event.timeLabel || "")}</span></div>
          <div class="tl-body">${escapeHtml(subject + (event.body || ""))}</div>
        </article>
      `;
    })
    .join("");

  const sub = prospect
    ? `${escapeHtml(prospect.market || "")} · ${escapeHtml(prospect.email || "无邮箱")} · ${escapeHtml(prospect.phone || "无号码")}`
    : "潜客已从列表移除";

  const actions = [
    !conversation.replied
      ? `<button class="ghost-button" data-inbox-action="simulate-reply" type="button"><svg><use href="#icon-message" /></svg><span>模拟客户回复</span></button>`
      : "",
    canRelayWa
      ? `<button class="primary-button" data-inbox-action="relay-wa" type="button"><svg><use href="#icon-shuffle" /></svg><span>转 WhatsApp 接力</span></button>`
      : "",
    canRelayEmail
      ? `<button class="primary-button" data-inbox-action="relay-email" type="button"><svg><use href="#icon-shuffle" /></svg><span>转邮件接力</span></button>`
      : "",
    conversation.unread
      ? `<button class="ghost-button" data-inbox-action="mark-read" type="button"><svg><use href="#icon-check" /></svg><span>标记已读</span></button>`
      : ""
  ]
    .filter(Boolean)
    .join("");

  const status = conversation.replied
    ? `<span class="status-pill">已回复 · 接力已停止</span>`
    : conversation.relayed
      ? `<span class="channel-badge relay">已接力</span>`
      : `<span class="tag">未回复</span>`;

  const intent = getConversationIntent(conversation);
  let aiPanel = "";
  if (intent) {
    const inboundEvents = conversation.events.filter((e) => e.kind === "inbound");
    const replyChannel = inboundEvents[inboundEvents.length - 1]?.channel || "email";
    const suggestion = suggestReply(prospect, intent.key);
    aiPanel = `
      <div class="ai-panel">
        <div class="ai-panel-head">
          <span class="ai-badge">AI 助手</span>
          <span class="intent-tag ${intent.tone}">意图：${intent.label} · 置信度 ${intent.confidence}%</span>
        </div>
        <p class="ai-summary">${escapeHtml(summarizeConversation(conversation))}</p>
        <p class="eyebrow">建议回复（${replyChannel === "whatsapp" ? "WhatsApp" : "邮件"}）</p>
        <div class="ai-suggestion" id="aiSuggestion">${escapeHtml(suggestion)}</div>
        <div class="ai-actions">
          <button class="ghost-button" data-inbox-action="copy-suggestion" type="button"><svg><use href="#icon-copy" /></svg><span>复制建议</span></button>
          <button class="primary-button" data-inbox-action="adopt-suggestion" type="button"><svg><use href="#icon-mail" /></svg><span>采用为回复</span></button>
        </div>
      </div>
    `;
  }

  elements.inboxTimeline.innerHTML = `
    <div class="timeline-head">
      <div>
        <h3>${escapeHtml(conversation.company)}</h3>
        <p class="conv-sub">${sub}</p>
      </div>
      ${status}
    </div>
    <div class="timeline">${events || `<div class="empty-state">暂无消息</div>`}</div>
    ${aiPanel}
    ${actions ? `<div class="timeline-actions">${actions}</div>` : ""}
  `;
}

function createRelayWhatsapp(prospect, quiet = false) {
  if (!prospect.phone) return false;
  const exists = state.whatsappQueue.some((item) => item.prospectId === prospect.id);
  if (exists) return false;

  const first =
    prospect.contactName && prospect.contactName !== "待补全" && prospect.contactName !== "待确认"
      ? prospect.contactName.split(" ")[0]
      : "there";
  const message = `Hi ${first}, I emailed you about ${state.campaign.product} for ${prospect.company} but wasn't sure it reached you. Happy to share a short catalog and price range here on WhatsApp if that is easier. Thanks!`;
  const status = state.management.rules.requireWhatsappApproval ? "待人工确认" : "已审批";

  state.whatsappQueue.push({
    id: makeId("waq"),
    prospectId: prospect.id,
    company: prospect.company,
    phone: prospect.phone,
    label: "接力触达",
    message,
    dueDate: dateOffset(0),
    createdAt: new Date().toISOString(),
    status,
    step: "接力触达",
    relay: true,
    origin: "邮件未回接力",
    url: buildWhatsappUrl(prospect, message)
  });

  if (!quiet) addLog(`邮件未回，已为 ${prospect.company} 生成 WhatsApp 接力（${status}）`);
  return true;
}

function createRelayEmail(prospect, quiet = false) {
  if (!prospect.email) return false;
  const exists = state.outbox.some((item) => item.prospectId === prospect.id);
  if (exists) return false;

  const first =
    prospect.contactName && prospect.contactName !== "待补全" && prospect.contactName !== "待确认"
      ? prospect.contactName.split(" ")[0]
      : "there";
  const subject = `Following up by email · ${state.campaign.product}`;
  const body = `Hi ${first},

I tried to reach you on WhatsApp about ${state.campaign.product} for ${prospect.company}. In case email is easier, I can send a short catalog and a price range for your reference.

Best regards,
${state.campaign.senderName}
${state.campaign.companyName}`;

  state.outbox.push({
    id: makeId("outbox"),
    prospectId: prospect.id,
    company: prospect.company,
    email: prospect.email,
    label: "接力邮件",
    subject,
    body,
    dueDate: dateOffset(0),
    createdAt: new Date().toISOString(),
    status: "待发送",
    step: "接力邮件",
    relay: true,
    origin: "WhatsApp 未覆盖回退邮件"
  });

  if (!quiet) addLog(`WhatsApp 未覆盖，已为 ${prospect.company} 生成邮件接力`);
  return true;
}

function relayPass(quiet = false) {
  const conversations = buildConversations();
  const candidates = getRelayCandidates(conversations);
  let relayed = 0;

  candidates.emailToWa.forEach((conversation) => {
    if (createRelayWhatsapp(conversation.prospect, true)) relayed += 1;
  });
  candidates.waToEmail.forEach((conversation) => {
    if (createRelayEmail(conversation.prospect, true)) relayed += 1;
  });

  if (relayed && !quiet) {
    addLog(
      `跨渠道接力：${candidates.emailToWa.length} 个转 WhatsApp、${candidates.waToEmail.length} 个回退邮件，共 ${relayed} 条`
    );
  }
  return relayed;
}

function runCrossChannelRelay() {
  readInboxRulesFromForm();
  const relayed = relayPass();
  if (!relayed) addLog("没有会话达到接力条件（可把未回天数设为 0，或对单个会话手动接力）");
  saveState();
  render();
}

function simulateInboundReply(prospectId) {
  const conversation = buildConversations().find((c) => c.prospectId === prospectId);
  if (!conversation) return;
  const lastOutbound = [...conversation.events].reverse().find((e) => e.kind === "outbound");
  const channel = lastOutbound?.channel || "email";
  const product = state.campaign.product;
  // 多样化的买家回复，覆盖不同意图，便于演示 AI 意图识别
  const replyBank = [
    `Hi, thanks for reaching out. Please send your best FOB price list and MOQ for ${product}. What is the lead time?`,
    `Interested. Could you send a free sample of ${product} and share your sample policy?`,
    `Your price looks a bit high compared to our current supplier. Can you offer a better price for a full container order?`,
    `Do you have FDA and LFGB certificates and test reports for ${product}?`,
    `Thanks, but we already have a supplier and are not looking to switch right now.`
  ];
  const existing = state.inbound.filter((m) => m.prospectId === prospectId).length;
  const body = replyBank[(hashInt(prospectId) + existing) % replyBank.length];

  state.inbound.push({
    id: makeId("inbound"),
    prospectId,
    company: conversation.company,
    channel,
    body,
    time: timestamp(),
    at: Date.now(),
    read: false
  });

  const prospect = state.prospects.find((item) => item.id === prospectId);
  if (prospect) {
    state.prospects = state.prospects.map((item) =>
      item.id === prospectId ? { ...item, status: "已回复" } : item
    );
    advanceDealStage(prospectId, "已回复");
  }
  addLog(`收到客户回复（${channel === "whatsapp" ? "WhatsApp" : "邮件"}）：${conversation.company}`);

  // 规则1：客户回复 → 自动停止其剩余触达序列
  cancelSequenceOnReply(prospectId);

  // 规则2：意图驱动 CRM——询价/要样/MOQ/认证/交期 视为有效询盘，自动推进
  const intent = classifyIntent(body);
  if (["price", "sample", "moq", "cert", "leadtime", "discount"].includes(intent.key)) {
    advanceDealStage(prospectId, "询盘");
    addLog(`AI 意图「${intent.label}」→ 商机自动推进到「询盘」：${conversation.company}`);
  } else if (intent.key === "reject") {
    addLog(`AI 意图「拒绝」→ ${conversation.company} 转入培育名单，停止主动触达`);
  }

  // 规则3：自动驾驶开启时，立即生成 AI 回复草稿送审批
  if (state.autopilot?.enabled) createAiDraft(prospectId);
}

function cancelSequenceOnReply(prospectId) {
  let cancelled = 0;
  state.outbox.forEach((item) => {
    if (item.prospectId === prospectId && item.status === "待发送" && !item.reply) {
      item.status = "已取消";
      cancelled += 1;
    }
  });
  state.whatsappQueue.forEach((item) => {
    if (item.prospectId === prospectId && ["待人工确认", "已审批"].includes(item.status) && !item.reply) {
      item.status = "已取消";
      cancelled += 1;
    }
  });
  if (cancelled) addLog(`客户已回复，自动取消剩余 ${cancelled} 条待发触达（回复即停）`);
  return cancelled;
}

function markConversationRead(prospectId) {
  state.inbound = state.inbound.map((item) =>
    item.prospectId === prospectId ? { ...item, read: true } : item
  );
}

/* ---------- AI 助手：意图识别 + 回复建议 + 摘要 ---------- */

function classifyIntent(text) {
  const lower = (text || "").toLowerCase();
  // INTENTS 已按优先级排序（拒绝 > 议价 > 样品 > 询价 ...），
  // 返回第一个命中的意图，避免通用词（如 "price"）盖过强信号（如 "better price"）
  for (const intent of INTENTS) {
    const hits = intent.keywords.filter((word) => lower.includes(word)).length;
    if (hits > 0) return { ...intent, confidence: Math.min(95, 60 + hits * 15), hits };
  }
  return { key: "other", label: "需人工判断", tone: "muted", next: "追问客户具体需求后再决定话术", confidence: 0, hits: 0 };
}

function firstName(prospect) {
  return prospect && prospect.contactName && !["待补全", "待确认"].includes(prospect.contactName)
    ? prospect.contactName.split(" ")[0]
    : "there";
}

function suggestReply(prospect, intentKey) {
  const first = firstName(prospect);
  const product = state.campaign.product;
  const props = state.campaign.valueProps;
  const certs = state.campaign.certifications;
  const sender = state.campaign.senderName;
  const templates = {
    price: `Hi ${first}, thanks! I'll send our latest ${product} price list and a reference FOB quote today. Could you share your target quantity so I can give the most accurate pricing?`,
    sample: `Hi ${first}, happy to arrange ${product} samples. I'll share our sample policy and lead time — could you confirm the models and a shipping address?`,
    discount: `Hi ${first}, thanks for the feedback. Our pricing reflects ${props}. If you can share your target price and annual volume, I'll check the best rate we can support.`,
    leadtime: `Hi ${first}, for ${product} our typical lead time is 25-35 days after order confirmation, and samples in 5-7 days. I can confirm exact timing once I know your quantity.`,
    moq: `Hi ${first}, our MOQ for ${product} is flexible for a first order. Tell me your target quantity and I'll confirm the MOQ and price tiers.`,
    cert: `Hi ${first}, we can provide ${certs} and full test reports for ${product}. I'll attach the certificates — is there any specific compliance your market requires?`,
    reject: `Hi ${first}, understood, and thanks for letting me know. If your sourcing needs change I'm glad to help — may I share one or two key updates each quarter?`,
    other: `Hi ${first}, thanks for your reply. Could you tell me a bit more about your needs for ${product} so I can help precisely?`
  };
  return `${templates[intentKey] || templates.other}\n\nBest regards,\n${sender}`;
}

function getConversationIntent(conversation) {
  const inbound = conversation.events.filter((e) => e.kind === "inbound");
  if (!inbound.length) return null;
  return classifyIntent(inbound[inbound.length - 1].body);
}

function summarizeConversation(conversation) {
  const outbound = conversation.events.filter((e) => e.kind === "outbound");
  const inbound = conversation.events.filter((e) => e.kind === "inbound");
  const channels = [...conversation.channels].map((c) => (c === "whatsapp" ? "WhatsApp" : "邮件")).join("+");
  const stage = conversation.prospect?.dealStage || "线索";
  if (!inbound.length) {
    return `已通过 ${channels || "邮件"} 触达 ${outbound.length} 次，客户尚未回复；当前阶段「${stage}」。`;
  }
  const intent = classifyIntent(inbound[inbound.length - 1].body);
  return `已触达 ${outbound.length} 次、收到 ${inbound.length} 条回复；最新意图「${intent.label}」，当前阶段「${stage}」。建议：${intent.next}。`;
}

function getSuggestionForConversation(prospectId) {
  const conversation = buildConversations().find((c) => c.prospectId === prospectId);
  if (!conversation) return null;
  const intent = getConversationIntent(conversation);
  if (!intent) return null;
  const prospect = state.prospects.find((p) => p.id === prospectId);
  const inbound = conversation.events.filter((e) => e.kind === "inbound");
  const channel = inbound[inbound.length - 1]?.channel || "email";
  return { conversation, intent, prospect, channel, text: suggestReply(prospect, intent.key) };
}

function hasPendingAiReply(prospectId) {
  return (
    state.outbox.some((o) => o.prospectId === prospectId && o.label === "AI 回复" && o.status !== "已发送") ||
    state.whatsappQueue.some((w) => w.prospectId === prospectId && w.label === "AI 回复" && w.status !== "已发送")
  );
}

function adoptSuggestedReply(prospectId, asDraft = false) {
  const suggestion = getSuggestionForConversation(prospectId);
  if (!suggestion) return false;
  if (hasPendingAiReply(prospectId)) {
    if (!asDraft) addLog("该客户已有待处理的 AI 回复，避免重复");
    return false;
  }
  const { conversation, intent, prospect, channel, text } = suggestion;

  if (channel === "whatsapp") {
    state.whatsappQueue.push({
      id: makeId("waq"),
      prospectId,
      company: conversation.company,
      phone: prospect?.phone || "",
      label: "AI 回复",
      message: text,
      dueDate: dateOffset(0),
      createdAt: new Date().toISOString(),
      status: asDraft || state.management.rules.requireWhatsappApproval ? "待人工确认" : "已审批",
      step: `AI回复-${intent.key}-${state.whatsappQueue.length}`,
      reply: true,
      url: buildWhatsappUrl(prospect || {}, text)
    });
  } else {
    state.outbox.push({
      id: makeId("outbox"),
      prospectId,
      company: conversation.company,
      email: prospect?.email || "",
      label: "AI 回复",
      subject: `Re: ${state.campaign.product}`,
      body: text,
      dueDate: dateOffset(0),
      createdAt: new Date().toISOString(),
      status: asDraft ? "待审批" : "待发送",
      step: `AI回复-${intent.key}-${state.outbox.length}`,
      reply: true
    });
  }
  addLog(
    asDraft
      ? `AI 自动生成回复草稿（${channel === "whatsapp" ? "WhatsApp" : "邮件"}·${intent.label}）待审批：${conversation.company}`
      : `采用 AI 建议回复（${channel === "whatsapp" ? "WhatsApp" : "邮件"}·${intent.label}）：${conversation.company}`
  );
  return true;
}

function createAiDraft(prospectId) {
  return adoptSuggestedReply(prospectId, true);
}

/* ---------- AI 客户评分（成交概率 + 可解释因子） ---------- */

function leadGrade(probability) {
  if (probability >= 80) return "A";
  if (probability >= 65) return "B";
  if (probability >= 50) return "C";
  return "D";
}

function computeLeadScore(prospect) {
  const campaign = state.campaign;
  const factors = [];
  let score = 20; // 基础分

  const add = (points, label, tone = "pos", detail = "") => {
    score += points;
    factors.push({ label, points, tone, detail });
  };

  // 1. 官网真实性
  const directWebsite =
    prospect.website &&
    !/(google|linkedin|facebook|instagram|youtube|amazon|alibaba|made-in-china|globalsources|temu|shein|directory)/i.test(prospect.website);
  if (directWebsite) add(12, "官网真实可直达");
  else factors.push({ label: prospect.website ? "仅平台/目录来源" : "缺公司官网", points: 0, tone: "neg", detail: "建议补公司官网" });

  // 2. 邮箱质量
  if (prospect.emailStatus === "格式有效") add(10, "邮箱已验证");
  else if (prospect.email) add(5, "有邮箱待验证");
  else factors.push({ label: "缺邮箱", points: 0, tone: "neg", detail: "需补全联系方式" });

  // 3. WhatsApp 号码
  if (prospect.phone) add(6, "有 WhatsApp 号码");

  // 4. 采购信号与角色
  const signalText = `${prospect.buyingSignal || ""} ${prospect.searchQuery || ""} ${prospect.role || ""}`.toLowerCase();
  if (/(import|distribut|wholesale|retail|buyer|sourcing|procurement|purchas|stockist)/.test(signalText)) {
    add(10, "采购角色/信号匹配");
  }

  // 5. 客户类型匹配
  const typeWords = (campaign.customerType || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (typeWords.some((word) => signalText.includes(word))) add(5, "客户类型匹配");

  // 6. 互动信号（权重最高，主导评分分层）
  const replied =
    state.inbound.some((m) => m.prospectId === prospect.id) ||
    prospect.status === "已回复" ||
    stageIndex(prospect.dealStage || "线索") >= stageIndex("已回复");
  const opened =
    state.outbox.some((o) => o.prospectId === prospect.id && o.opened) ||
    state.whatsappQueue.some((w) => w.prospectId === prospect.id && w.read);
  const touched =
    state.outbox.some((o) => o.prospectId === prospect.id) ||
    state.whatsappQueue.some((w) => w.prospectId === prospect.id);
  if (replied) add(25, "客户已回复（强意向）");
  else if (opened) add(12, "邮件/消息已打开");
  else if (touched) add(6, "已触达待响应");
  else factors.push({ label: "尚未触达", points: 0, tone: "neg", detail: "加入队列开始触达" });

  // 7. 资料置信度
  if ((prospect.confidence || 0) >= 80) add(4, "资料置信度高");

  const probability = clamp(Math.round(score), 5, 99);
  return { probability, grade: leadGrade(probability), factors };
}

/* ---------- 商机管道看板 (CRM) ---------- */

function stageIndex(stage) {
  const index = DEAL_STAGES.indexOf(stage);
  return index < 0 ? 0 : index;
}

function deriveDealStage(prospect) {
  const replied =
    prospect.status === "已回复" || state.inbound.some((item) => item.prospectId === prospect.id);
  if (replied) return "已回复";
  const touched =
    prospect.status === "已入队" ||
    state.outbox.some((item) => item.prospectId === prospect.id) ||
    state.whatsappQueue.some((item) => item.prospectId === prospect.id);
  if (touched) return "已触达";
  return "线索";
}

function ensureDealStages() {
  state.prospects.forEach((prospect) => {
    if (!prospect.dealStage || !DEAL_STAGES.includes(prospect.dealStage)) {
      prospect.dealStage = deriveDealStage(prospect);
    }
    if (typeof prospect.dealValue !== "number") {
      prospect.dealValue = 6000 + Math.round((prospect.score || 50) * 220);
    }
  });
}

function advanceDealStage(prospectId, minStage) {
  const prospect = state.prospects.find((item) => item.id === prospectId);
  if (!prospect) return;
  if (!prospect.dealStage || !DEAL_STAGES.includes(prospect.dealStage)) {
    prospect.dealStage = deriveDealStage(prospect);
  }
  if (stageIndex(prospect.dealStage) < stageIndex(minStage)) prospect.dealStage = minStage;
}

function getProspectDue(prospectId) {
  const today = dateOffset(0);
  const dues = state.tasks
    .filter((task) => task.prospectId === prospectId)
    .map((task) => task.dueDate)
    .sort();
  if (!dues.length) return { kind: "none", date: null };
  const overdue = dues.filter((date) => date < today);
  if (overdue.length) return { kind: "overdue", date: overdue[0] };
  if (dues.includes(today)) return { kind: "today", date: today };
  return { kind: "upcoming", date: dues.find((date) => date > today) || dues[0] };
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function renderCrm() {
  ensureDealStages();
  renderCrmKpis();
  renderCrmBoard();
}

function renderCrmKpis() {
  const prospects = state.prospects;
  const total = prospects.length;
  const inquiry = prospects.filter((p) => stageIndex(p.dealStage) >= stageIndex("询盘")).length;
  const quoting = prospects.filter((p) => p.dealStage === "报价").length;
  const won = prospects.filter((p) => p.dealStage === "成交").length;
  const winRate = total ? Math.round((won / total) * 100) : 0;
  const overdue = prospects.filter(
    (p) => p.dealStage !== "成交" && getProspectDue(p.id).kind === "overdue"
  ).length;
  const openValue = prospects
    .filter((p) => p.dealStage !== "成交")
    .reduce((sum, p) => sum + (p.dealValue || 0), 0);

  const cards = [
    ["总商机", total, "管道内客户数"],
    ["询盘及以上", inquiry, "进入询盘/报价/成交"],
    ["报价中", quoting, "等待客户决策"],
    ["成交", won, `成交率 ${winRate}%`],
    ["在谈金额", formatMoney(openValue), "未成交商机预估"],
    ["超期跟进", overdue, "需立即处理"]
  ];

  elements.crmKpis.innerHTML = cards
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

function renderCrmBoard() {
  elements.crmBoard.innerHTML = DEAL_STAGES.map((stage) => {
    const cards = state.prospects.filter((p) => p.dealStage === stage);
    const value = cards.reduce((sum, p) => sum + (p.dealValue || 0), 0);
    const cardsHtml = cards.length
      ? cards.map(renderCrmCard).join("")
      : `<div class="empty-state">拖入客户到「${stage}」</div>`;
    return `
      <div class="crm-column" data-stage="${stage}">
        <div class="crm-column-head">
          <strong>${stage}</strong>
          <span class="col-meta">${cards.length} · ${formatMoney(value)}</span>
        </div>
        ${cardsHtml}
      </div>
    `;
  }).join("");
}

function renderCrmCard(prospect) {
  const due = getProspectDue(prospect.id);
  const replied = prospect.dealStage === "已回复" || state.inbound.some((m) => m.prospectId === prospect.id);
  const needsFollowup =
    stageIndex(prospect.dealStage) >= stageIndex("已触达") &&
    prospect.dealStage !== "成交" &&
    !replied;

  let dueTag = "";
  if (due.kind === "overdue") dueTag = `<span class="due-tag overdue">超期 ${due.date}</span>`;
  else if (due.kind === "today") dueTag = `<span class="due-tag today">今日跟进</span>`;
  else if (due.kind === "upcoming") dueTag = `<span class="due-tag upcoming">下次 ${due.date}</span>`;
  else if (needsFollowup) dueTag = `<span class="due-tag unplanned">待安排跟进</span>`;

  const channels = [];
  if (state.outbox.some((o) => o.prospectId === prospect.id)) channels.push(`<span class="channel-badge email">邮件</span>`);
  if (state.whatsappQueue.some((w) => w.prospectId === prospect.id)) channels.push(`<span class="channel-badge whatsapp">WhatsApp</span>`);
  if (replied) channels.push(`<span class="channel-badge relay">已回复</span>`);

  const isOverdue = due.kind === "overdue";

  return `
    <article class="crm-card ${isOverdue ? "is-overdue" : ""}" draggable="true" data-prospect-id="${prospect.id}">
      <div class="crm-card-top">
        <strong>${escapeHtml(prospect.company)}</strong>
        <span class="score">${prospect.score}</span>
      </div>
      <div class="crm-card-meta">
        <span>${escapeHtml(prospect.market)}</span>
        <span class="crm-value">${formatMoney(prospect.dealValue || 0)}</span>
      </div>
      <div class="crm-card-badges">${channels.join("")}${dueTag}</div>
    </article>
  `;
}

function exportCrm() {
  const rows = state.prospects.map((p) => ({
    company: p.company,
    market: p.market,
    stage: p.dealStage,
    score: p.score,
    value: p.dealValue,
    email: p.email,
    phone: p.phone,
    nextFollowup: getProspectDue(p.id).date || ""
  }));
  download("crm-pipeline.csv", toCsv(rows), "text/csv");
}

/* ---------- 数据分析看板 ---------- */

function pct(part, whole) {
  return whole ? Math.round((part / whole) * 100) : 0;
}

function hashInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

function isReplied(prospect) {
  return (
    state.inbound.some((m) => m.prospectId === prospect.id) ||
    prospect.status === "已回复" ||
    stageIndex(prospect.dealStage || "线索") >= stageIndex("已回复")
  );
}

function replyChannels(prospect) {
  const fromInbound = [...new Set(state.inbound.filter((m) => m.prospectId === prospect.id).map((m) => m.channel))];
  if (fromInbound.length) return fromInbound;
  if (!isReplied(prospect)) return [];
  if (state.outbox.some((o) => o.prospectId === prospect.id)) return ["email"];
  if (state.whatsappQueue.some((w) => w.prospectId === prospect.id)) return ["whatsapp"];
  return [];
}

function simulateChannelCallbacks() {
  const openChance = (id, extra) => {
    const prospect = state.prospects.find((p) => p.id === id);
    const score = prospect?.score || 60;
    return Math.min(88, 38 + Math.round(score * 0.5)) + extra;
  };

  state.outbox = state.outbox.map((item) => {
    const h = hashInt(item.prospectId + item.step);
    const delivered = h % 100 < 95;
    const opened = delivered && (h >> 3) % 100 < openChance(item.prospectId, 0);
    return {
      ...item,
      status: item.status === "待发送" ? "已发送" : item.status,
      sentAt: item.sentAt || new Date().toISOString(),
      delivered,
      opened
    };
  });

  state.whatsappQueue = state.whatsappQueue.map((item) => {
    const h = hashInt(item.prospectId + item.step);
    const delivered = h % 100 < 98;
    const read = delivered && (h >> 3) % 100 < openChance(item.prospectId, 12);
    return { ...item, delivered, read };
  });

  addLog(
    `模拟渠道回传：${state.outbox.length} 封邮件、${state.whatsappQueue.length} 条 WhatsApp 已更新送达/打开状态`
  );
  saveState();
  render();
}

function computeFunnel() {
  const prospects = state.prospects;
  const reached = prospects.filter(
    (p) => state.outbox.some((o) => o.prospectId === p.id) || state.whatsappQueue.some((w) => w.prospectId === p.id)
  );
  const delivered = reached.filter(
    (p) =>
      state.outbox.some((o) => o.prospectId === p.id && o.delivered) ||
      state.whatsappQueue.some((w) => w.prospectId === p.id && w.delivered)
  );
  const opened = reached.filter(
    (p) =>
      state.outbox.some((o) => o.prospectId === p.id && o.opened) ||
      state.whatsappQueue.some((w) => w.prospectId === p.id && w.read)
  );
  const replied = reached.filter(isReplied);
  const inquiry = prospects.filter((p) => stageIndex(p.dealStage) >= stageIndex("询盘"));
  return {
    reached: reached.length,
    delivered: delivered.length,
    opened: opened.length,
    replied: replied.length,
    inquiry: inquiry.length
  };
}

function renderAnalytics() {
  const funnel = computeFunnel();
  renderAnalyticsKpis(funnel);
  renderAnalyticsFunnel(funnel);
  renderChannelCompare();
  renderRelayImpact();
  renderMarketPerformance();
  renderTemplateRank();
}

function renderAnalyticsKpis(funnel) {
  const cards = [
    ["有效询盘 / 月", funnel.inquiry, "北极星指标", true],
    ["触达客户", funnel.reached, "邮件或 WhatsApp 已触达", false],
    ["打开率", `${pct(funnel.opened, funnel.delivered)}%`, "已送达中打开占比", false],
    ["回复率", `${pct(funnel.replied, funnel.reached)}%`, "触达中回复占比", false],
    ["询盘转化率", `${pct(funnel.inquiry, funnel.reached)}%`, "触达到询盘", false]
  ];
  elements.analyticsKpis.innerHTML = cards
    .map(
      ([label, value, hint, star]) => `
        <article class="metric-card ${star ? "is-star" : ""}">
          <p class="eyebrow">${label}</p>
          <strong>${value}</strong>
          <span>${hint}</span>
        </article>
      `
    )
    .join("");
}

function renderAnalyticsFunnel(funnel) {
  const stages = [
    ["触达", funnel.reached],
    ["送达", funnel.delivered],
    ["打开", funnel.opened],
    ["回复", funnel.replied],
    ["询盘", funnel.inquiry]
  ];
  const top = Math.max(1, funnel.reached);
  elements.analyticsFunnel.innerHTML = stages
    .map(([label, count], index) => {
      const width = Math.max(3, Math.round((count / top) * 100));
      const prev = index === 0 ? count : stages[index - 1][1];
      const conv = index === 0 ? 100 : pct(count, prev);
      return `
        <div class="funnel-row">
          <span>${label}</span>
          <div class="funnel-bar"><span style="width:${width}%"></span></div>
          <span class="funnel-figure"><strong>${count}</strong> · 环比 ${conv}%</span>
        </div>
      `;
    })
    .join("");
}

function channelStats(channel) {
  const prospects = state.prospects;
  const queue = channel === "email" ? state.outbox : state.whatsappQueue;
  const openKey = channel === "email" ? "opened" : "read";
  const has = (id) => queue.some((item) => item.prospectId === id);
  const reached = prospects.filter((p) => has(p.id));
  const delivered = reached.filter((p) => queue.some((item) => item.prospectId === p.id && item.delivered));
  const opened = reached.filter((p) => queue.some((item) => item.prospectId === p.id && item[openKey]));
  const replied = reached.filter((p) => replyChannels(p).includes(channel));
  return {
    reached: reached.length,
    delivered: delivered.length,
    opened: opened.length,
    replied: replied.length
  };
}

function renderChannelCompare() {
  const blocks = [
    ["email", "邮件", "打开"],
    ["whatsapp", "WhatsApp", "已读"]
  ];
  elements.channelCompare.innerHTML = blocks
    .map(([channel, name, openLabel]) => {
      const stat = channelStats(channel);
      const rows = [
        ["触达", stat.reached, stat.reached],
        ["送达", stat.delivered, stat.reached],
        [openLabel, stat.opened, stat.reached],
        ["回复", stat.replied, stat.reached]
      ];
      const rowsHtml = rows
        .map(
          ([label, value, base]) => `
            <div class="channel-metric">
              <span>${label}</span>
              <div class="mini-bar ${channel}"><span style="width:${Math.max(2, pct(value, base))}%"></span></div>
              <strong>${value}</strong>
            </div>
          `
        )
        .join("");
      return `
        <div class="channel-block">
          <div class="channel-block-head">
            <span class="channel-badge ${channel}">${name}</span>
            <span class="score">回复率 ${pct(stat.replied, stat.reached)}%</span>
          </div>
          ${rowsHtml}
        </div>
      `;
    })
    .join("");
}

function renderRelayImpact() {
  const prospects = state.prospects;
  const hasEmail = (id) => state.outbox.some((o) => o.prospectId === id);
  const hasWa = (id) => state.whatsappQueue.some((w) => w.prospectId === id);

  const dual = prospects.filter((p) => hasEmail(p.id) && hasWa(p.id));
  const single = prospects.filter((p) => (hasEmail(p.id) || hasWa(p.id)) && !(hasEmail(p.id) && hasWa(p.id)));
  const dualRate = pct(dual.filter(isReplied).length, dual.length);
  const singleRate = pct(single.filter(isReplied).length, single.length);

  let liftNote;
  if (!dual.length && !single.length) liftNote = "先触达客户并运行接力后查看对比";
  else if (!single.length) liftNote = "本批客户已全部双渠道覆盖";
  else if (!singleRate) liftNote = dualRate ? "双渠道接力回复率显著高于单渠道" : "样本较小，继续触达后更准确";
  else liftNote = `双渠道接力回复率约为单渠道的 ${(dualRate / singleRate).toFixed(1)} 倍`;

  elements.relayImpact.innerHTML = `
    <div class="impact-row">
      <span>单渠道回复率<br /><small>${single.length} 个客户</small></span>
      <strong>${singleRate}%</strong>
    </div>
    <div class="impact-row">
      <span>双渠道接力回复率<br /><small>${dual.length} 个客户</small></span>
      <strong>${dualRate}%</strong>
    </div>
    <div class="impact-lift">${liftNote}</div>
  `;
}

function renderMarketPerformance() {
  const markets = [...new Set(state.prospects.map((p) => p.market))];
  if (!markets.length) {
    elements.marketPerformance.innerHTML = `<div class="empty-state">暂无数据</div>`;
    return;
  }

  const rows = markets
    .map((market) => {
      const list = state.prospects.filter((p) => p.market === market);
      const reached = list.filter(
        (p) => state.outbox.some((o) => o.prospectId === p.id) || state.whatsappQueue.some((w) => w.prospectId === p.id)
      ).length;
      const replied = list.filter(isReplied).length;
      const inquiry = list.filter((p) => stageIndex(p.dealStage) >= stageIndex("询盘")).length;
      return { market, touched: reached, replied, inquiry, rate: pct(replied, reached) };
    })
    .sort((a, b) => b.rate - a.rate || b.replied - a.replied);

  elements.marketPerformance.innerHTML = `
    <div class="market-row header">
      <span>市场</span><span>触达</span><span>回复</span><span>询盘</span><span>回复率</span>
    </div>
    ${rows
      .map(
        (row) => `
          <div class="market-row">
            <span>${escapeHtml(row.market)}</span>
            <span>${row.touched}</span>
            <span>${row.replied}</span>
            <span>${row.inquiry}</span>
            <span>${row.rate}%</span>
          </div>
        `
      )
      .join("")}
  `;
}

function renderTemplateRank() {
  const repliedIds = new Set(state.prospects.filter(isReplied).map((p) => p.id));
  const buckets = new Map();
  const add = (channel, label, prospectId) => {
    const key = `${channel}|${label}`;
    if (!buckets.has(key)) buckets.set(key, { channel, label, recipients: new Set(), replied: new Set() });
    const bucket = buckets.get(key);
    bucket.recipients.add(prospectId);
    if (repliedIds.has(prospectId)) bucket.replied.add(prospectId);
  };

  state.outbox.forEach((item) => add("email", item.label, item.prospectId));
  state.whatsappQueue.forEach((item) => add("whatsapp", item.label, item.prospectId));

  const rows = [...buckets.values()]
    .map((bucket) => ({
      channel: bucket.channel,
      label: bucket.label,
      sent: bucket.recipients.size,
      replied: bucket.replied.size,
      rate: pct(bucket.replied.size, bucket.recipients.size)
    }))
    .sort((a, b) => b.rate - a.rate || b.sent - a.sent)
    .slice(0, 8);

  if (!rows.length) {
    elements.templateRank.innerHTML = `<div class="empty-state">先在「邮件」「WhatsApp」里把话术加入队列</div>`;
    return;
  }

  elements.templateRank.innerHTML = `
    <div class="template-row header">
      <span>话术模板</span><span>发送</span><span>回复</span><span>回复率</span>
    </div>
    ${rows
      .map(
        (row) => `
          <div class="template-row">
            <span class="template-name"><span class="channel-badge ${row.channel}">${row.channel === "email" ? "邮件" : "WA"}</span> ${escapeHtml(row.label)}</span>
            <span>${row.sent}</span>
            <span>${row.replied}</span>
            <span class="rate-bar"><span style="width:${Math.max(3, row.rate)}%"></span></span>
          </div>
        `
      )
      .join("")}
  `;
}

function exportAnalytics() {
  const funnel = computeFunnel();
  const email = channelStats("email");
  const wa = channelStats("whatsapp");
  const rows = [
    { metric: "触达客户", value: funnel.reached },
    { metric: "送达", value: funnel.delivered },
    { metric: "打开", value: funnel.opened },
    { metric: "回复", value: funnel.replied },
    { metric: "有效询盘", value: funnel.inquiry },
    { metric: "回复率(%)", value: pct(funnel.replied, funnel.reached) },
    { metric: "询盘转化率(%)", value: pct(funnel.inquiry, funnel.reached) },
    { metric: "邮件回复率(%)", value: pct(email.replied, email.reached) },
    { metric: "WhatsApp回复率(%)", value: pct(wa.replied, wa.reached) }
  ];
  download("analytics-metrics.csv", toCsv(rows), "text/csv");
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
  const stages = ["新发现", "待审核", "已审核", "已丰富", "邮箱有效", "已入队", "已回复"];
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
  const markets = normalizeMarkets(campaign.markets);
  const intent = buildCustomerSearchTerms(campaign.customerType);
  const exclusions = "-alibaba -amazon -made-in-china -globalsources -temu -shein";
  const patterns = [
    {
      channel: "Google",
      intent: "找真实进口商/分销商官网",
      priority: "P1",
      nextAction: "打开官网，找 About/Brands/Contact/Wholesale 页面",
      build: (market) => `"${product}" (${intent.buyers}) "${market}" "contact" ${exclusions}`
    },
    {
      channel: "Google",
      intent: "找批发目录和经销商列表",
      priority: "P1",
      nextAction: "把目录里的公司官网粘贴到导入框",
      build: (market) => `"${product}" "${market}" ("distributor list" OR "wholesale directory" OR "stockist") ${exclusions}`
    },
    {
      channel: "Google",
      intent: "找采购/品类负责人",
      priority: "P1",
      nextAction: "记录公司名、负责人职位、邮箱或 LinkedIn",
      build: (market) => `"${product}" "${market}" ("sourcing manager" OR "buyer" OR "category manager" OR "procurement") ${exclusions}`
    },
    {
      channel: "LinkedIn",
      intent: "找公司主页和采购角色",
      priority: "P2",
      nextAction: "复制公司页 URL 或公司官网",
      build: (market) => `site:linkedin.com/company "${product}" "${market}" (${intent.buyers})`
    },
    {
      channel: "Retail",
      intent: "找零售商/品牌商采购入口",
      priority: "P2",
      nextAction: "找 vendor/supplier application 页面",
      build: (market) => `"${product}" "${market}" ("vendor application" OR "supplier application" OR "become a supplier") ${exclusions}`
    },
    {
      channel: "Association",
      intent: "找协会会员名录",
      priority: "P2",
      nextAction: "导入会员公司名录",
      build: (market) => `"${product}" "${market}" ("member directory" OR "association members" OR "trade association")`
    },
    {
      channel: "Customs Data",
      intent: "找有进口记录的买家线索",
      priority: "P3",
      nextAction: "用海关数据服务核验真实进口商",
      build: (market) => `"${product}" "${market}" ("importer" OR "bill of lading" OR "import data") ${exclusions}`
    },
    {
      channel: "Competitor",
      intent: "找竞品渠道和经销商",
      priority: "P3",
      nextAction: "从竞品 Where to buy/Dealer 页面反查客户",
      build: (market) => `"${product}" "${market}" ("where to buy" OR "dealer locator" OR "authorized distributor") ${exclusions}`
    }
  ];

  return markets.flatMap((market) =>
    patterns.map((pattern) => {
      const query = pattern.build(market);
      return {
        id: makeId("query"),
        channel: pattern.channel,
        market,
        intent: pattern.intent,
        priority: pattern.priority,
        nextAction: pattern.nextAction,
        query,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`
      };
    })
  );
}

function buildCustomerSearchTerms(customerType) {
  if (customerType.includes("retailer")) {
    return { buyers: '"retailer" OR "chain store" OR "category buyer" OR "vendor application"' };
  }
  if (customerType.includes("brand")) {
    return { buyers: '"private label" OR "brand owner" OR "product manager" OR "sourcing"' };
  }
  if (customerType.includes("wholesaler")) {
    return { buyers: '"wholesaler" OR "distributor" OR "trade supplier" OR "stockist"' };
  }
  if (customerType.includes("contractor")) {
    return { buyers: '"project buyer" OR "contractor" OR "procurement" OR "building supply"' };
  }
  return { buyers: '"importer" OR "distributor" OR "wholesaler" OR "stockist"' };
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

function importSearchResultsText(text, campaign) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const markets = normalizeMarkets(campaign.markets);
  const seen = new Set(state.prospects.map((item) => item.website || item.company.toLowerCase()));
  const imported = [];

  lines.forEach((line, index) => {
    const prospect = parseProspectLine(line, campaign, markets[index % Math.max(markets.length, 1)] || markets[0]);
    if (!prospect) return;
    const key = prospect.website || prospect.company.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    imported.push(prospect);
  });

  return imported;
}

function parseProspectLine(line, campaign, market) {
  const urlMatch = line.match(/https?:\/\/[^\s,，]+|www\.[^\s,，]+|[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s,，]*)?/i);
  const emailMatch = line.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  const phoneMatch = line.match(
    /\+\d[\d\s().-]{6,}\d|(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{4}/
  );
  const website = urlMatch ? stripProtocol(urlMatch[0]).split("/")[0] : emailMatch ? emailMatch[0].split("@")[1] : "";
  const company = cleanCompanyName(line, website, emailMatch?.[0]) || domainToCompany(website);

  if (!company && !website && !emailMatch) return null;

  const directWebsite = website && !/(google|linkedin|facebook|instagram|youtube|amazon|alibaba|made-in-china|globalsources)/i.test(website);
  const score = Math.min(
    96,
    52 +
      (directWebsite ? 18 : 4) +
      (emailMatch ? 14 : 0) +
      (phoneMatch ? 8 : 0) +
      (/(import|distribut|wholesale|retail|buyer|sourcing|procurement)/i.test(line) ? 10 : 0)
  );

  return {
    id: makeId("prospect"),
    company: company || "未命名公司",
    market,
    source: "搜索结果导入",
    website,
    contactName: "待确认",
    role: "待确认采购角色",
    email: emailMatch?.[0] || "",
    emailStatus: emailMatch ? "待验证" : "待查找",
    phone: phoneMatch?.[0]?.replace(/\s+/g, " ") || "",
    phoneStatus: phoneMatch ? "待人工确认" : "待查找",
    status: "待审核",
    score,
    confidence: directWebsite ? 72 : 48,
    buyingSignal: `从搜索结果导入，需核验是否采购 ${campaign.product}`,
    companySize: "待确认",
    searchQuery: line
  };
}

function cleanCompanyName(line, website, email) {
  let value = line;
  // 先删除带协议/www 的完整 URL（含其后的域名与路径）
  value = value.replace(/https?:\/\/\S+/gi, " ").replace(/\bwww\.\S+/gi, " ");
  // 删除完整邮箱（须在删除裸域名之前，否则邮箱里的域名会先被删掉导致残留 name@）
  if (email) value = value.split(email).join(" ");
  // 删除残留的裸域名和协议片段
  if (website) value = value.split(website).join(" ");
  value = value.replace(/https?:\/\/+/gi, " ");
  // 删除电话号码簇（宽松匹配 +、括号、空格、连字符组成的长数字串）
  value = value.replace(/\+?\d[\d\s().-]{5,}\d/g, " ");
  // 归一化分隔符与空白
  value = value
    .replace(/[,，|;；]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  value = value.split(/ - | – | \| /)[0]?.trim() || value;
  if (value.length > 80) value = value.slice(0, 80).trim();
  return value;
}

function domainToCompany(website) {
  if (!website) return "";
  const domain = website.replace(/^www\./, "").split(".")[0];
  return capitalize(domain.replace(/[-_]+/g, " "));
}

function enrichProspectList(prospects, campaign) {
  const firstNames = ["Anna", "Mark", "Carla", "Omar", "Elin", "Lucas", "Maya", "David", "Sofia", "Nina", "Jonas", "Rita"];
  const lastNames = ["Weber", "Lewis", "Mendes", "Saeed", "Larsson", "Miller", "Khan", "Brown", "Garcia", "Hassan", "Smith", "Rossi"];
  const aliases = ["sourcing", "purchasing", "procurement", "buying", "import", "sales"];

  return prospects.map((prospect, index) => {
    const alias = aliases[index % aliases.length];
    return {
      ...prospect,
      contactName:
        prospect.contactName && !["待确认", "待补全"].includes(prospect.contactName)
          ? prospect.contactName
          : `${firstNames[index % firstNames.length]} ${lastNames[(index + 3) % lastNames.length]}`,
      email: prospect.email || (prospect.website ? `${alias}@${prospect.website}` : ""),
      emailStatus: prospect.email || prospect.website ? "待验证" : "待查找",
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

  if (!prospects?.length && elements.searchResultsInput.value.trim()) {
    prospects = importSearchResultsText(elements.searchResultsInput.value, state.campaign);
    addLog(`从粘贴结果解析 ${prospects.length} 个线索`);
  }

  if (prospects?.length) {
    state.prospects = [...prospects, ...state.prospects];
    state.prospects = verifyProspectList(state.prospects, state.campaign);
  } else {
    addLog("未配置采集 Webhook，也未导入搜索结果；已生成搜索任务，等待真实结果导入");
  }

  state.selectedProspectId = state.prospects[0]?.id || null;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  if (state.prospects.length) {
    queueTopProspects();
    queueTopWhatsappProspects();
    scheduleFollowupTasks(false);
  }
  addLog(`自动化完成：${state.prospects.length} 个线索，${state.outbox.length} 封邮件入队，${state.whatsappQueue.length} 条 WhatsApp 待确认`);
  saveState();
  render();
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

async function callWebhook(name, payload) {
  const cfg = WEBHOOK_CONNECTORS[name];
  const url = (elements[cfg.urlKey]?.value || state.settings[cfg.urlKey] || "").trim();
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

  if (state.settings.mode !== "webhook") {
    let sent = 0;
    state.outbox.forEach((item) => {
      if (item.status !== "待发送") return;
      item.status = "已发送";
      item.sentAt = new Date().toISOString();
      const h = hashInt(item.prospectId + item.step);
      item.delivered = h % 100 < 95;
      const prospect = state.prospects.find((p) => p.id === item.prospectId);
      item.opened = item.delivered && (h >> 3) % 100 < Math.min(88, 38 + Math.round((prospect?.score || 60) * 0.5));
      sent += 1;
    });
    addLog(`本地模式：模拟发送 ${sent} 封邮件（切到 Webhook 模式可派发到真实服务）`);
    saveState();
    render();
    return;
  }

  const pendingEmails = state.outbox.filter((item) => item.status === "待发送");
  const approvedWa = state.whatsappQueue.filter((item) => item.status === "已审批");

  if (pendingEmails.length) {
    const result = await callWebhook("send", { emails: pendingEmails });
    if (result.ok) {
      pendingEmails.forEach((item) => {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
      });
      addLog(`发信 Webhook：已派发 ${pendingEmails.length} 封邮件`);
    } else {
      addLog(`发信 Webhook 派发失败：${result.error || result.code || "未配置"}`);
    }
  }

  if (approvedWa.length) {
    const result = await callWebhook("whatsapp", { messages: approvedWa });
    if (result.ok) {
      approvedWa.forEach((item) => (item.status = "已发送"));
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
    addLog("没有待发送邮件或已审批 WhatsApp（可先在队列/审批中心处理）");
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
    addLog("自动驾驶已开启：自动执行 线索补全验证→评分入队→到期发送→回传→跨渠道接力→AI 回复草稿");
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

  // 2) 高分线索自动入队（遵守评分阈值、日上限、冷却期）
  const queuedBefore = state.outbox.length + state.whatsappQueue.length;
  queueTopProspects();
  queueTopWhatsappProspects();
  const queuedDelta = state.outbox.length + state.whatsappQueue.length - queuedBefore;
  if (queuedDelta > 0) {
    actions.push(`自动入队 ${queuedDelta} 条触达`);
    setJobDone("job-queue");
  }

  // 3) 到期邮件批量发送（webhook 模式走真实派发，本地模拟并生成回传）
  const sent = await sendDueEmails(true);
  if (sent) actions.push(`发送 ${sent} 封到期邮件`);

  // 4) 已审批 WhatsApp 发送
  if (state.settings.mode === "webhook") {
    const approved = state.whatsappQueue.filter((item) => item.status === "已审批");
    if (approved.length && (state.settings.whatsappWebhook || "").trim()) {
      const result = await callWebhook("whatsapp", { messages: approved });
      if (result.ok) {
        approved.forEach((item) => {
          item.status = "已发送";
          item.sentAt = new Date().toISOString();
          item.delivered = true;
        });
        actions.push(`派发 ${approved.length} 条 WhatsApp`);
      }
    }
  } else {
    const waSent = deliverApprovedWhatsapp(true);
    if (waSent) actions.push(`发送 ${waSent} 条已审批 WhatsApp`);
  }

  // 5) 跨渠道接力自动执行
  const relayed = relayPass(true);
  if (relayed) actions.push(`跨渠道接力 ${relayed} 条`);

  // 6) 已回复且未响应的会话，自动生成 AI 回复草稿送审批
  let drafts = 0;
  buildConversations().forEach((conversation) => {
    if (
      conversation.replied &&
      conversation.lastEvent?.kind === "inbound" &&
      createAiDraft(conversation.prospectId)
    ) {
      drafts += 1;
    }
  });
  if (drafts) actions.push(`生成 ${drafts} 份 AI 回复草稿待审批`);

  if (actions.length) {
    addLog(`自动驾驶：${actions.join("；")}`);
    if (state.settings.mode === "webhook" && (state.settings.crmWebhook || "").trim()) {
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

function inCooldown(prospect) {
  const days = state.management.rules.cooldownDays || 0;
  if (!days || !prospect.lastQueuedAt) return false;
  return Date.now() - new Date(prospect.lastQueuedAt).getTime() < days * 86400000;
}

function queueTopProspects() {
  const limit = Math.min(state.campaign.dailyLimit, state.management.rules.emailDailyLimit, 10);
  const candidates = [...state.prospects]
    .filter(
      (item) =>
        item.email &&
        item.status !== "已入队" &&
        item.status !== "已回复" &&
        item.score >= state.management.rules.scoreThreshold &&
        !inCooldown(item)
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  candidates.forEach((prospect) => queueProspect(prospect, false));
  if (candidates.length) addLog(`${candidates.length} 个高分潜客加入发信队列`);
}

function queueTopWhatsappProspects() {
  const limit = Math.min(state.campaign.dailyLimit, state.management.rules.whatsappDailyLimit, 8);
  const candidates = [...state.prospects]
    .filter(
      (item) =>
        item.phone &&
        item.status !== "已回复" &&
        item.score >= state.management.rules.scoreThreshold &&
        !inCooldown(item) &&
        !state.whatsappQueue.some((queued) => queued.prospectId === item.id)
    )
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
    item.id === prospect.id ? { ...item, status: "已入队", lastQueuedAt: new Date().toISOString() } : item
  );
  advanceDealStage(prospect.id, "已触达");
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
  state.prospects = state.prospects.map((item) =>
    item.id === prospect.id ? { ...item, lastQueuedAt: new Date().toISOString() } : item
  );
  advanceDealStage(prospect.id, "已触达");
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

function deliverEmail(item) {
  item.status = "已发送";
  item.sentAt = new Date().toISOString();
  const h = hashInt(item.prospectId + item.step);
  item.delivered = h % 100 < 95;
  const prospect = state.prospects.find((p) => p.id === item.prospectId);
  item.opened = item.delivered && (h >> 3) % 100 < Math.min(88, 38 + Math.round((prospect?.score || 60) * 0.5));
}

function simulateSendNext() {
  const next = state.outbox.find((item) => item.status === "待发送");
  if (!next) {
    addLog("没有待发送邮件");
    return;
  }
  deliverEmail(next);
  addLog(`已模拟发送：${next.company} · ${next.label}`);
}

async function sendDueEmails(quiet = false) {
  const today = dateOffset(0);
  const due = state.outbox.filter((item) => item.status === "待发送" && item.dueDate <= today);
  if (!due.length) {
    if (!quiet) addLog("今天没有到期待发送邮件");
    return 0;
  }

  if (state.settings.mode === "webhook" && (state.settings.sendWebhook || "").trim()) {
    const result = await callWebhook("send", { emails: due });
    if (result.ok) {
      due.forEach((item) => {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
      });
      addLog(`发信 Webhook：批量派发 ${due.length} 封到期邮件`);
      return due.length;
    }
    addLog(`发信 Webhook 失败，${due.length} 封到期邮件保留待发送`);
    return 0;
  }

  due.forEach(deliverEmail);
  if (!quiet) addLog(`批量发送 ${due.length} 封到期邮件（本地模拟，已生成送达/打开回传）`);
  return due.length;
}

function deliverApprovedWhatsapp(quiet = false) {
  const approved = state.whatsappQueue.filter((item) => item.status === "已审批");
  approved.forEach((item) => {
    item.status = "已发送";
    item.sentAt = new Date().toISOString();
    const h = hashInt(item.prospectId + item.step);
    item.delivered = h % 100 < 98;
    const prospect = state.prospects.find((p) => p.id === item.prospectId);
    item.read = item.delivered && (h >> 3) % 100 < Math.min(88, 50 + Math.round((prospect?.score || 60) * 0.5));
  });
  if (approved.length && !quiet) addLog(`发送 ${approved.length} 条已审批 WhatsApp（本地模拟）`);
  return approved.length;
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

async function runPendingManagementJobs() {
  const notes = [];

  // job-search：webhook 模式真实采集，本地模式提示
  if (state.settings.mode === "webhook" && (state.settings.searchWebhook || "").trim()) {
    const got = await trySearchWebhook();
    if (got?.length) {
      state.prospects = [...got, ...state.prospects];
      notes.push(`采集 ${got.length} 个潜客`);
    }
    setJobDone("job-search");
  } else {
    setJob("job-search", { status: "本地模式", progress: 100, nextRun: "接入搜索 Webhook 后自动采集" });
  }

  // job-enrich + job-verify：真实补全验证新线索
  const raw = state.prospects.filter((p) => ["新发现", "待审核"].includes(p.status));
  if (raw.length) {
    const processed = verifyProspectList(enrichProspectList(raw, state.campaign), state.campaign);
    const byId = new Map(processed.map((p) => [p.id, p]));
    state.prospects = state.prospects.map((p) => byId.get(p.id) || p);
    notes.push(`补全验证 ${processed.length} 条线索`);
  }
  setJobDone("job-enrich");
  setJobDone("job-verify");

  // job-sequence：确保当前选中潜客的话术已生成
  ensureSelection();
  setJobDone("job-sequence");

  // job-queue：高分入队（遵守全部规则）
  const before = state.outbox.length + state.whatsappQueue.length;
  queueTopProspects();
  queueTopWhatsappProspects();
  const queued = state.outbox.length + state.whatsappQueue.length - before;
  if (queued) notes.push(`入队 ${queued} 条触达`);
  setJobDone("job-queue");

  // job-crm：webhook 模式真实同步
  if (state.settings.mode === "webhook" && (state.settings.crmWebhook || "").trim()) {
    const result = await callWebhook("crm", { prospects: crmProspectsPayload() });
    setJob("job-crm", {
      status: result.ok ? "已完成" : "失败",
      progress: result.ok ? 100 : 0,
      nextRun: result.ok ? "每 6 小时" : "检查 CRM Webhook"
    });
    if (result.ok) notes.push(`CRM 同步 ${state.prospects.length} 个客户`);
  } else {
    setJob("job-crm", { status: "待配置", progress: 0, nextRun: "配置 CRM Webhook 后" });
  }

  addLog(notes.length ? `任务中心执行：${notes.join("；")}` : "任务中心执行完成：暂无新增待处理数据");
  saveState();
  render();
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
  let emailDrafts = 0;
  state.outbox.forEach((item) => {
    if (item.status === "待审批") {
      item.status = "待发送";
      emailDrafts += 1;
    }
  });
  state.whatsappQueue = state.whatsappQueue.map((item) =>
    item.status === "待人工确认" ? { ...item, status: "已审批" } : item
  );
  addLog(emailDrafts ? `审批中心已全部通过（含 ${emailDrafts} 份 AI 邮件草稿转待发送）` : "审批中心已全部通过");

  // 审批通过后自动派发/发送，无需再去设置页手动操作
  if (state.settings.mode === "webhook") dispatchPending();
  else if (state.autopilot?.enabled) autopilotTick();
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
    priority: item.priority,
    intent: item.intent,
    query: item.query,
    nextAction: item.nextAction,
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
  state.prospects = [];
  state.selectedProspectId = state.prospects[0]?.id || null;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  state.outbox = [];
  state.whatsappQueue = [];
  state.tasks = [];
  state.inbound = [];
  state.selectedConversationId = null;
  addLog(`生成开发计划：${state.campaign.product}，等待导入真实搜索结果`);
  saveState();
  render();
});

elements.resetDemo.addEventListener("click", () => {
  state = createDemoState();
  bindCampaignForm();
  bindSettingsForm();
  bindManagementForm();
  bindInboxForm();
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
  const imported = importSearchResultsText(elements.searchResultsInput.value, state.campaign);
  if (!imported.length) {
    addLog("没有可解析的搜索结果；请先粘贴公司官网、LinkedIn 公司页、邮箱或 CSV 行");
    saveState();
    render();
    return;
  }
  state.prospects = [...imported, ...state.prospects];
  state.selectedProspectId = state.prospects[0]?.id || null;
  state.sequence = buildEmailSequence(state.campaign, getSelectedProspect());
  state.whatsappSequence = buildWhatsappSequence(state.campaign, getSelectedProspect());
  addLog(`导入 ${imported.length} 个真实搜索结果线索`);
  saveState();
  render();
  // 自动驾驶开启时：导入即自动补全→验证→入队，无需手动逐步点击
  if (state.autopilot?.enabled) autopilotTick();
});

elements.importSearchResults.addEventListener("click", () => {
  elements.createProspects.click();
});

elements.loadImportExample.addEventListener("click", () => {
  elements.searchResultsInput.value = [
    "Example Imports Inc. https://exampleimports.com sourcing@exampleimports.com +1 555 0100",
    "Nordic Home Retail, https://nordichome.example, category@nordichome.example",
    "LinkedIn Company Page https://www.linkedin.com/company/example-trading Procurement Manager"
  ].join("\n");
  addLog("已填入搜索结果导入示例");
  saveState();
  renderLogs();
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

  if (action === "approve-prospect") {
    state.prospects = state.prospects.map((item) =>
      item.id === prospect.id ? { ...item, status: "已审核", confidence: Math.max(item.confidence, 80) } : item
    );
    addLog(`线索已审核通过：${prospect.company}`);
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

elements.runRelay.addEventListener("click", runCrossChannelRelay);

elements.markAllRead.addEventListener("click", () => {
  state.inbound = state.inbound.map((item) => ({ ...item, read: true }));
  addLog("收件箱已全部标记已读");
  saveState();
  render();
});

[elements.relayEmailToWa, elements.relayWaToEmail, elements.relayEmailDays, elements.relayWaDays].forEach(
  (input) => {
    input.addEventListener("change", () => {
      readInboxRulesFromForm();
      saveState();
      renderInbox();
    });
  }
);

elements.conversationFilter.addEventListener("input", renderInbox);
elements.conversationStatusFilter.addEventListener("change", renderInbox);

elements.conversationList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-conversation-id]");
  if (!row) return;
  state.selectedConversationId = row.dataset.conversationId;
  markConversationRead(state.selectedConversationId);
  saveState();
  renderInbox();
});

elements.scheduleFollowupsCrm.addEventListener("click", () => {
  scheduleFollowupTasks(true);
  saveState();
  render();
});

elements.exportCrm.addEventListener("click", exportCrm);

elements.simulateCallbacks.addEventListener("click", simulateChannelCallbacks);
elements.exportAnalytics.addEventListener("click", exportAnalytics);

document.querySelectorAll(".test-webhook").forEach((button) => {
  button.addEventListener("click", () => testWebhook(button.dataset.webhook));
});

elements.dispatchWebhooks.addEventListener("click", dispatchPending);

elements.autopilotToggle.addEventListener("click", () => {
  setAutopilot(!state.autopilot?.enabled);
});

elements.sendDueBtn.addEventListener("click", async () => {
  await sendDueEmails();
  saveState();
  render();
});

elements.crmBoard.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-prospect-id]");
  if (!card) return;
  event.dataTransfer.setData("text/plain", card.dataset.prospectId);
  event.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
});

elements.crmBoard.addEventListener("dragend", (event) => {
  event.target.closest("[data-prospect-id]")?.classList.remove("dragging");
});

elements.crmBoard.addEventListener("dragover", (event) => {
  const column = event.target.closest("[data-stage]");
  if (!column) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  column.classList.add("drag-over");
});

elements.crmBoard.addEventListener("dragleave", (event) => {
  const column = event.target.closest("[data-stage]");
  if (column && !column.contains(event.relatedTarget)) column.classList.remove("drag-over");
});

elements.crmBoard.addEventListener("drop", (event) => {
  const column = event.target.closest("[data-stage]");
  if (!column) return;
  event.preventDefault();
  column.classList.remove("drag-over");
  const prospectId = event.dataTransfer.getData("text/plain");
  const stage = column.dataset.stage;
  const prospect = state.prospects.find((item) => item.id === prospectId);
  if (!prospect || prospect.dealStage === stage) return;
  prospect.dealStage = stage;
  if (stage === "已回复" && prospect.status !== "已回复") prospect.status = "已回复";
  addLog(`商机推进：${prospect.company} → ${stage}`);
  saveState();
  render();
});

elements.inboxTimeline.addEventListener("click", async (event) => {
  const action = event.target.closest("[data-inbox-action]")?.dataset.inboxAction;
  if (!action) return;
  const prospectId = state.selectedConversationId;
  const prospect = state.prospects.find((item) => item.id === prospectId);

  if (action === "copy-suggestion") {
    const suggestion = getSuggestionForConversation(prospectId);
    if (suggestion) {
      await copyText(suggestion.text);
      addLog(`已复制 AI 建议回复：${suggestion.conversation.company}`);
      saveState();
      renderLogs();
    }
    return;
  }

  if (action === "simulate-reply") {
    simulateInboundReply(prospectId);
  } else if (action === "adopt-suggestion") {
    adoptSuggestedReply(prospectId);
  } else if (action === "relay-wa" && prospect) {
    if (!createRelayWhatsapp(prospect)) addLog("无法生成 WhatsApp 接力：缺少号码或已存在");
  } else if (action === "relay-email" && prospect) {
    if (!createRelayEmail(prospect)) addLog("无法生成邮件接力：缺少邮箱或已存在");
  } else if (action === "mark-read") {
    markConversationRead(prospectId);
    addLog("会话已标记已读");
  }

  saveState();
  render();
});

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

// 刷新页面后恢复自动驾驶
if (state.autopilot?.enabled) startAutopilotTimer();
