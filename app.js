window.__APP_V = "14";

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
  sendDueBtn: $("#sendDueBtn"),
  toastStack: $("#toastStack"),
  onboardingChecklist: $("#onboardingChecklist"),
  openPaletteBtn: $("#openPaletteBtn"),
  themeToggle: $("#themeToggle"),
  paletteOverlay: $("#paletteOverlay"),
  paletteInput: $("#paletteInput"),
  paletteResults: $("#paletteResults"),
  crmDrawerOverlay: $("#crmDrawerOverlay"),
  crmDrawer: $("#crmDrawer"),
  analyticsRange: $("#analyticsRange"),
  aiEngineStatus: $("#aiEngineStatus"),
  aiLocalMode: $("#aiLocalMode"),
  aiClaudeMode: $("#aiClaudeMode"),
  aiApiKeyInput: $("#aiApiKeyInput"),
  aiModelSelect: $("#aiModelSelect"),
  testAiEngine: $("#testAiEngine"),
  aiEngineTestStatus: $("#aiEngineTestStatus"),
  aiWriteEmail: $("#aiWriteEmail"),
  agentPromptInput: $("#agentPromptInput"),
  agentParse: $("#agentParse"),
  agentEngineTag: $("#agentEngineTag"),
  agentTaskCard: $("#agentTaskCard"),
  agentSteps: $("#agentSteps"),
  agentFunnel: $("#agentFunnel"),
  agentFunnelHint: $("#agentFunnelHint"),
  agentApprovalPanel: $("#agentApprovalPanel"),
  agentApprovalList: $("#agentApprovalList"),
  agentApproveAll: $("#agentApproveAll"),
  agentHandoff: $("#agentHandoff"),
  agentDemoData: $("#agentDemoData"),
  agentReset: $("#agentReset"),
  agentDevelopPanel: $("#agentDevelopPanel"),
  agentAutoRespond: $("#agentAutoRespond"),
  agentKnowledgeBase: $("#agentKnowledgeBase"),
  agentSaveKb: $("#agentSaveKb"),
  agentAutoLog: $("#agentAutoLog")
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

// 模块级 UI 运行时状态（不持久化）——必须在首次 render() 前初始化，避免 TDZ 崩溃
const quickReplyDrafts = {};
const quickReplyChannels = {};

let state = loadState();

bindCampaignForm();
bindSettingsForm();
bindManagementForm();
bindInboxForm();
applyTheme();
// 首次 render() 移到文件末尾执行——render 会读取本文件后段定义的模块级 const
// （Agent/风险/意图字典等），在此处调用会因这些 const 尚未初始化而 TDZ 崩溃。

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
      ui: { ...fallback.ui, ...(parsed.ui || {}) },
      agent: {
        task: parsed.agent?.task || null,
        approvals: Array.isArray(parsed.agent?.approvals) ? parsed.agent.approvals : [],
        autoRespond: !!parsed.agent?.autoRespond
      },
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
    dailyLimit: 30,
    knowledgeBase: ""
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
      webhookStatus: {},
      aiEngine: "local",
      aiApiKey: "",
      aiModel: "claude-opus-4-8"
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
    ui: { checklistDismissed: false, theme: "light", analyticsRange: "all" },
    agent: { task: null, approvals: [], autoRespond: false },
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
  elements.aiApiKeyInput.value = settings.aiApiKey || "";
  elements.aiModelSelect.value = settings.aiModel || "claude-opus-4-8";
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
    enrichWebhook: elements.enrichWebhook.value.trim(),
    sendWebhook: elements.sendWebhook.value.trim(),
    whatsappWebhook: elements.whatsappWebhook.value.trim(),
    crmWebhook: elements.crmWebhook.value.trim(),
    searchProvider: elements.searchProvider.value,
    emailProvider: elements.emailProvider.value,
    crmProvider: elements.crmProvider.value,
    aiApiKey: elements.aiApiKeyInput.value.trim(),
    aiModel: elements.aiModelSelect.value
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
  renderAgent();
  renderLogs();
  renderManagement();
  renderWebhookPanel();
  updateModeButtons();
  updateAutopilotButton();
  updateAiEngineButtons();
  renderNavBadges();
  renderChecklist();
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
    elements.prospectTable.innerHTML = `<div class="empty-state">暂无匹配潜客<button class="ghost-button" data-goto="discovery" type="button">去搜索导入线索 →</button></div>`;
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
  if (!state.outbox.length) {
    elements.outboxList.innerHTML = `<div class="empty-state">暂无发信队列<button class="ghost-button" data-goto="prospects" type="button">去挑选潜客 →</button></div>`;
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
    elements.conversationList.innerHTML = `<div class="empty-state">暂无会话，先把潜客加入触达队列<button class="ghost-button" data-goto="email" type="button">去邮件序列 →</button></div>`;
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
        <article class="timeline-item outbound ${event.status === "已取消" ? "cancelled" : ""}">
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
    const stored = getStoredAI(conversation.prospectId);
    const intentLabel = stored ? stored.intent_label : intent.label;
    const confidence = stored ? stored.confidence : intent.confidence;
    const summary = stored
      ? `${stored.summary} 建议：${stored.next_action}`
      : summarizeConversation(conversation);
    const suggestion = stored?.suggested_reply || suggestReply(prospect, intent.key);
    const sourceTag = stored
      ? `<span class="channel-badge whatsapp">Claude · ${escapeHtml(stored.model || "")}</span>`
      : `<span class="tag">本地规则</span>`;
    const analyzeBtn =
      !stored && aiEnabled()
        ? `<button class="ghost-button" data-inbox-action="ai-analyze" type="button"><svg><use href="#icon-zap" /></svg><span>用 Claude 分析</span></button>`
        : "";
    const risks = conversationRisks(conversation.prospectId);
    const riskBlock = risks.length
      ? `
        <div class="risk-block risk-${highestRiskLevel(risks)}">
          <p class="eyebrow">⚠️ 风险提示 · ${risks.length} 项</p>
          ${risks
            .map(
              (r) => `
              <div class="risk-item">
                <span class="intent-tag ${riskLevelTone(r.level)}">${r.level === "high" ? "高" : r.level === "medium" ? "中" : "低"} · ${escapeHtml(r.category)}</span>
                <div class="risk-detail"><strong>${escapeHtml(r.evidence)}</strong><span>应对：${escapeHtml(r.action)}</span></div>
              </div>
            `
            )
            .join("")}
        </div>
      `
      : "";
    aiPanel = `
      <div class="ai-panel">
        <div class="ai-panel-head">
          <span class="ai-badge">AI 助手</span>
          <span class="intent-tag ${intent.tone}">意图：${escapeHtml(intentLabel)} · 置信度 ${confidence}%</span>
          ${risks.length ? `<span class="intent-tag ${riskLevelTone(highestRiskLevel(risks))}">⚠️ ${risks.length} 项风险</span>` : ""}
          ${sourceTag}
        </div>
        <p class="ai-summary">${escapeHtml(summary)}</p>
        ${riskBlock}
        <p class="eyebrow">建议回复（${replyChannel === "whatsapp" ? "WhatsApp" : "邮件"}）</p>
        <div class="ai-suggestion" id="aiSuggestion">${escapeHtml(suggestion)}</div>
        <div class="ai-actions">
          ${analyzeBtn}
          <button class="ghost-button" data-inbox-action="copy-suggestion" type="button"><svg><use href="#icon-copy" /></svg><span>复制建议</span></button>
          <button class="primary-button" data-inbox-action="adopt-suggestion" type="button"><svg><use href="#icon-mail" /></svg><span>采用为回复</span></button>
        </div>
      </div>
    `;
  }

  const inboundList = conversation.events.filter((e) => e.kind === "inbound");
  const activeChannel =
    quickReplyChannels[conversation.prospectId] || inboundList[inboundList.length - 1]?.channel || "email";
  const draft = quickReplyDrafts[conversation.prospectId] || "";
  const quickReply = prospect
    ? `
      <div class="quick-reply">
        <div class="quick-reply-head">
          <p class="eyebrow">快捷回复</p>
          <div class="segmented small" role="group" aria-label="回复渠道">
            <button class="segment ${activeChannel === "email" ? "is-active" : ""}" data-reply-channel="email" type="button">邮件</button>
            <button class="segment ${activeChannel === "whatsapp" ? "is-active" : ""}" data-reply-channel="whatsapp" type="button">WhatsApp</button>
          </div>
        </div>
        <textarea id="quickReplyText" rows="3" placeholder="输入回复内容，Ctrl+Enter 发送">${escapeHtml(draft)}</textarea>
        <div class="ai-actions">
          <button class="primary-button" data-inbox-action="send-quick-reply" type="button"><svg><use href="#icon-mail" /></svg><span>发送回复</span></button>
        </div>
      </div>
    `
    : "";

  // 若用户正在快捷回复框打字，记录焦点与光标，重渲染后恢复（避免自动驾驶 tick 打断输入）
  const wasTyping = document.activeElement?.id === "quickReplyText";
  const selStart = wasTyping ? document.activeElement.selectionStart : 0;
  const selEnd = wasTyping ? document.activeElement.selectionEnd : 0;

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
    ${quickReply}
    ${actions ? `<div class="timeline-actions">${actions}</div>` : ""}
  `;

  if (wasTyping) {
    const textarea = document.querySelector("#quickReplyText");
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(selStart, selEnd);
    }
  }
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

  // 规则3/4/5：先做语义分析，再决定初轮应答与草稿（顺序保证 opt-out/敏感优先于自动发送）
  processInboundIntelligence(prospectId);
}

async function processInboundIntelligence(prospectId) {
  // 已配置 Claude 时先做语义级意图分析（回填后 auto-respond 用真实意图判断）
  if (aiEnabled()) await enrichInboundWithAI(prospectId);

  // 第 4 步护栏：开启初轮自动应答时，opt-out/敏感话题优先处理
  if (state.agent?.autoRespond) {
    await handleInboundAutoRespond(prospectId);
    const message = [...state.inbound].reverse().find((m) => m.prospectId === prospectId);
    // 已被护栏处理（自动答复/转人工/opt-out）则不再走审批草稿
    if (message?.autoAction) return;
  }

  // 未自动应答时，自动驾驶下生成 AI 回复草稿送审批
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
  const stored = getStoredAI(prospectId);
  return {
    conversation,
    intent,
    prospect,
    channel,
    text: stored?.suggested_reply || suggestReply(prospect, intent.key)
  };
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

function analyticsRangeMs() {
  const range = state.ui?.analyticsRange || "all";
  if (range === "7d") return 7 * 86400000;
  if (range === "30d") return 30 * 86400000;
  return null;
}

function inAnalyticsRange(ts) {
  const ms = analyticsRangeMs();
  if (!ms) return true;
  return ts >= Date.now() - ms && ts <= Date.now() + 86400000;
}

function axOutbox() {
  return state.outbox.filter((o) => inAnalyticsRange(toTime(o.sentAt || o.createdAt || o.dueDate)));
}

function axWa() {
  return state.whatsappQueue.filter((w) => inAnalyticsRange(toTime(w.sentAt || w.createdAt || w.dueDate)));
}

function axInbound() {
  return state.inbound.filter((m) => inAnalyticsRange(toTime(m.at || m.time)));
}

function axReplied(prospect) {
  if (!analyticsRangeMs()) return isReplied(prospect);
  return axInbound().some((m) => m.prospectId === prospect.id);
}

function computeFunnel() {
  const prospects = state.prospects;
  const outbox = axOutbox();
  const wa = axWa();
  const reached = prospects.filter(
    (p) => outbox.some((o) => o.prospectId === p.id) || wa.some((w) => w.prospectId === p.id)
  );
  const delivered = reached.filter(
    (p) =>
      outbox.some((o) => o.prospectId === p.id && o.delivered) ||
      wa.some((w) => w.prospectId === p.id && w.delivered)
  );
  const opened = reached.filter(
    (p) =>
      outbox.some((o) => o.prospectId === p.id && o.opened) ||
      wa.some((w) => w.prospectId === p.id && w.read)
  );
  const replied = reached.filter(axReplied);
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
  if (elements.analyticsRange) {
    const active = state.ui?.analyticsRange || "all";
    elements.analyticsRange.querySelectorAll("[data-range]").forEach((segment) => {
      segment.classList.toggle("is-active", segment.dataset.range === active);
    });
  }
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
  const queue = channel === "email" ? axOutbox() : axWa();
  const openKey = channel === "email" ? "opened" : "read";
  const has = (id) => queue.some((item) => item.prospectId === id);
  const reached = prospects.filter((p) => has(p.id));
  const delivered = reached.filter((p) => queue.some((item) => item.prospectId === p.id && item.delivered));
  const opened = reached.filter((p) => queue.some((item) => item.prospectId === p.id && item[openKey]));
  const replied = reached.filter((p) =>
    analyticsRangeMs()
      ? axInbound().some((m) => m.prospectId === p.id && m.channel === channel)
      : replyChannels(p).includes(channel)
  );
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
  const outbox = axOutbox();
  const wa = axWa();
  const hasEmail = (id) => outbox.some((o) => o.prospectId === id);
  const hasWa = (id) => wa.some((w) => w.prospectId === id);

  const dual = prospects.filter((p) => hasEmail(p.id) && hasWa(p.id));
  const single = prospects.filter((p) => (hasEmail(p.id) || hasWa(p.id)) && !(hasEmail(p.id) && hasWa(p.id)));
  const dualRate = pct(dual.filter(axReplied).length, dual.length);
  const singleRate = pct(single.filter(axReplied).length, single.length);

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

  const outbox = axOutbox();
  const wa = axWa();
  const rows = markets
    .map((market) => {
      const list = state.prospects.filter((p) => p.market === market);
      const reached = list.filter(
        (p) => outbox.some((o) => o.prospectId === p.id) || wa.some((w) => w.prospectId === p.id)
      ).length;
      const replied = list.filter(axReplied).length;
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
  const repliedIds = new Set(state.prospects.filter(axReplied).map((p) => p.id));
  const buckets = new Map();
  const add = (channel, label, prospectId) => {
    const key = `${channel}|${label}`;
    if (!buckets.has(key)) buckets.set(key, { channel, label, recipients: new Set(), replied: new Set() });
    const bucket = buckets.get(key);
    bucket.recipients.add(prospectId);
    if (repliedIds.has(prospectId)) bucket.replied.add(prospectId);
  };

  axOutbox().forEach((item) => add("email", item.label, item.prospectId));
  axWa().forEach((item) => add("whatsapp", item.label, item.prospectId));

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

function generateProspects(campaign, targetCount = 18, salt = "") {
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
      const company = `${prefix} ${capitalize(productNoun)} ${suffix}${salt ? ` ${salt}` : ""}`;
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

  // 有线索：跑完整一拍——补全验证 → 高分入队 → 到期发送 → WhatsApp → 接力
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
  const sent = await sendDueEmails(true);
  const waSent = state.settings.mode === "webhook" ? 0 : deliverApprovedWhatsapp(true);
  const relayed = relayPass(true);
  const pendingWa = state.whatsappQueue.filter((item) => item.status === "待人工确认").length;
  addLog(
    `自动化完成：${state.prospects.length} 个线索，发送 ${sent} 封邮件、${waSent} 条 WhatsApp，接力 ${relayed} 条${
      pendingWa ? `；${pendingWa} 条 WhatsApp 待审批（管理→审批中心）` : ""
    }`
  );
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
    if (approved.length && webhookUrl("whatsapp")) {
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
    automation: state.outbox.filter((i) => i.status === "待发送").length,
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
      label: "发送今日到期邮件",
      hint: "批量发送",
      run: async () => {
        await sendDueEmails();
        saveState();
        render();
      }
    },
    {
      label: "审批全部通过",
      hint: "放行 WhatsApp 与 AI 草稿",
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
    if (state.settings.mode === "webhook" && webhookUrl("whatsapp")) {
      const result = await callWebhook("whatsapp", { messages: [item] });
      if (result.ok) {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
      }
    } else {
      item.status = "已发送";
      item.sentAt = new Date().toISOString();
      item.delivered = true;
    }
    addLog(`已发送 WhatsApp 回复：${prospect.company}`);
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
    if (state.settings.mode === "webhook" && webhookUrl("send")) {
      const result = await callWebhook("send", { emails: [item] });
      if (result.ok) {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
      }
    } else {
      deliverEmail(item);
    }
    addLog(`已发送邮件回复：${prospect.company}`);
  }

  delete quickReplyDrafts[prospectId];
  saveState();
  render();
}

/* ---------- AI 引擎：Claude API 真实智能（未配置时自动降级本地规则） ---------- */

function aiEnabled() {
  return state.settings.aiEngine === "claude" && !!(state.settings.aiApiKey || "").trim();
}

async function callClaude(systemPrompt, userText, schema, maxTokens = 2048) {
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

  return callClaude(system, user, AI_ANALYSIS_SCHEMA, 1500);
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

async function generateSequenceAI() {
  const prospect = getSelectedProspect();
  if (!prospect) {
    addLog("请先选择潜客");
    return;
  }
  if (!aiEnabled()) {
    addLog("未启用 Claude API：请在「设置 → AI 引擎」切换并填入 Anthropic API Key");
    navigateTo("settings");
    return;
  }
  addLog(`Claude 正在为 ${prospect.company} 深度写信…`);
  try {
    const system =
      "你是顶尖外贸开发信专家。为指定客户写一套 4 封英文开发信序列（D0 首触 / D3 跟进 / D7 案例或样品 / D14 收尾）。每封 90-140 词，围绕该客户的业务与市场个性化切入，避免模板腔与夸张营销语。label 用中文。";
    const user = `产品: ${state.campaign.product}
卖点: ${state.campaign.valueProps}
认证: ${state.campaign.certifications}
署名: ${state.campaign.senderName}, ${state.campaign.companyName}
客户: ${prospect.company}
市场: ${prospect.market}
联系人: ${prospect.contactName}（${prospect.role}）
网站: ${prospect.website}
采购信号: ${prospect.buyingSignal}`;
    const result = await callClaude(system, user, AI_SEQUENCE_SCHEMA, 3000);
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
  try {
    await callClaude("只回复两个字：正常", "连通性测试", null, 16);
    statusEl.className = "webhook-status ok";
    statusEl.textContent = `正常 · ${state.settings.aiModel} · ${Date.now() - start}ms`;
    addLog(`Claude API 连接成功（${state.settings.aiModel}）`);
  } catch (error) {
    statusEl.className = "webhook-status fail";
    statusEl.textContent = `失败 · ${error.message.slice(0, 40)}`;
    addLog(`Claude API 连接失败：${error.message}`);
  }
  saveState();
  updateAiEngineButtons();
}

function updateAiEngineButtons() {
  const engine = state.settings.aiEngine || "local";
  elements.aiLocalMode.classList.toggle("is-active", engine === "local");
  elements.aiClaudeMode.classList.toggle("is-active", engine === "claude");
  elements.aiEngineStatus.textContent = aiEnabled()
    ? `Claude · ${state.settings.aiModel}`
    : engine === "claude"
      ? "Claude（未配置 Key）"
      : "本地规则";
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

  const limitMatch = prompt.match(/(?:每日|每天|日|上限)[^\d]{0,6}(\d{1,3})/) || prompt.match(/(\d{1,3})\s*家/);
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
      parsed = await callClaude(
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
    recurring: { enabled: false, interval: "weekly", perCycle: 20, lastRunAt: null, cyclesRun: 0 },
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
  bindCampaignForm();
  state.searchPlan = generateSearchPlan(state.campaign);
  task.status = "prospecting";
  addLog(
    `Agent 任务已启动（${task.approvalMode === "review" ? "逐条审批" : task.approvalMode === "spot" ? "批量抽审" : "全自动"}）：已生成 ${state.searchPlan.length} 条搜索任务。去「搜索」导入真实结果，或点「用演示数据体验」`
  );
  if (task.approvalMode === "auto" && !state.autopilot?.enabled) setAutopilot(true);
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

  if (task.approvalMode !== "review") {
    state.agent.approvals.filter((a) => a.status === "pending").forEach((a) => agentApprove(a, true));
    addLog(`Agent：${qualified.length} 个高分客户已按「${task.approvalMode === "spot" ? "批量抽审" : "全自动"}」模式自动通过并入队`);
  } else if (qualified.length) {
    addLog(`Agent：${qualified.length} 个高分客户已生成触达方案，等待审批`);
  }
  task.status = state.agent.approvals.some((a) => a.status === "pending") ? "reviewing" : "outreach";
}

function agentApprove(approval, quiet = false) {
  const task = state.agent.task;
  const prospect = state.prospects.find((p) => p.id === approval.prospectId);
  if (!prospect) {
    approval.status = "skipped";
    return;
  }
  if (task.parsed.use_email !== false) queueProspect(prospect, true);
  if (task.parsed.use_whatsapp && prospect.phone) queueWhatsappProspect(prospect, true);
  approval.status = "approved";
  if (!quiet) addLog(`已批准触达：${prospect.company}`);
  if (!state.agent.approvals.some((a) => a.status === "pending")) task.status = "outreach";
}

function agentRecurring() {
  const task = state.agent.task;
  if (!task) return null;
  if (!task.recurring) task.recurring = { enabled: false, interval: "weekly", perCycle: 20, lastRunAt: null, cyclesRun: 0 };
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

/* ---------- 第 4 步：AI 初轮应答护栏 ---------- */

function isOptOut(text) {
  return /unsubscribe|stop sending|stop emailing|remove me|opt.?out|take me off|do not contact|退订|别再发|不要再发|停止发送|取消订阅/i.test(
    text || ""
  );
}

// 敏感话题：AI 一律不擅自答复，立即转人工。返回中文原因或 null
function sensitiveTopic(text) {
  const t = (text || "").toLowerCase();
  if (/payment term|net ?\d{2,3}|credit term|letter of credit|\bl\/c\b|账期|赊账|月结|信用证|付款方式|结算方式/.test(t))
    return "账期 / 付款条件";
  if (/exclusiv|sole (agent|distributor|agency)|distribution right|独家|总代理|代理权|区域保护/.test(t))
    return "独家 / 代理权";
  if (/discount|better price|lower price|target price|best price|price down|cheaper|砍价|折扣|优惠|降价|再便宜|最低价/.test(t))
    return "价格 / 折扣谈判";
  if (/contract|agreement|合同|协议|条款/.test(t)) return "合同条款";
  return null;
}

// 可自动答复的标准问题意图
const AGENT_STANDARD_INTENTS = ["price", "sample", "moq", "cert", "leadtime", "other"];

function autoReplyTemplate(prospect, intentKey) {
  const first = firstName(prospect);
  const product = state.campaign.product;
  const sender = state.campaign.senderName;
  const bodies = {
    price: `Hi ${first}, thanks for your interest in ${product}! Pricing depends on quantity and specifications, so I've flagged this to our sales colleague who will send you a detailed quotation shortly.`,
    sample: `Hi ${first}, happy to help with ${product} samples. I'll have our team prepare the catalog and sample policy; a sales colleague will follow up with the specifics.`,
    moq: `Hi ${first}, our MOQ for ${product} is flexible for a first order. Our sales colleague will confirm the exact tiers and pricing with you.`,
    leadtime: `Hi ${first}, typical lead time for ${product} is 25-35 days after order confirmation, and samples in 5-7 days. Our sales colleague will confirm the exact timing for your quantity.`,
    cert: `Hi ${first}, we can provide the relevant certificates and test reports for ${product}. Our sales colleague will attach the documents your market requires.`,
    other: `Hi ${first}, thanks for your reply. I've shared your message with our sales colleague, who will follow up with the details.`
  };
  return `${bodies[intentKey] || bodies.other}\n\nBest regards,\n${sender} (AI assistant)`;
}

async function generateAutoReply(prospect, customerText, intentKey) {
  if (aiEnabled()) {
    try {
      const system =
        "你是外贸售前 AI 助手，只负责答复标准售前问题。严格护栏：绝对不承诺任何具体价格、折扣、账期/付款条件或独家代理——这些必须留给销售同事。回复中要明确告知客户详细报价/条款将由销售同事跟进。基于提供的产品知识库作答。回复为英文、简洁、专业，含称呼与 AI 助手署名。";
      const user = `产品: ${state.campaign.product}
卖点: ${state.campaign.valueProps}
认证: ${state.campaign.certifications}
产品知识库/FAQ: ${state.campaign.knowledgeBase || "（未提供，用通用话术）"}
署名: ${state.campaign.senderName}

客户来信: ${customerText}`;
      const text = await callClaude(system, user, null, 700);
      if (text) return text.trim();
    } catch (error) {
      addLog(`Claude 自动应答失败，改用模板：${error.message}`);
    }
  }
  return autoReplyTemplate(prospect, intentKey);
}

function sendAutoReply(prospect, channel, text) {
  const item =
    channel === "whatsapp"
      ? {
          id: makeId("waq"),
          prospectId: prospect.id,
          company: prospect.company,
          phone: prospect.phone,
          label: "AI 初轮应答",
          message: text,
          dueDate: dateOffset(0),
          createdAt: new Date().toISOString(),
          status: "已发送",
          sentAt: new Date().toISOString(),
          delivered: true,
          step: `自动应答-${state.whatsappQueue.length}`,
          reply: true,
          autoReply: true,
          url: buildWhatsappUrl(prospect, text)
        }
      : {
          id: makeId("outbox"),
          prospectId: prospect.id,
          company: prospect.company,
          email: prospect.email,
          label: "AI 初轮应答",
          subject: `Re: ${state.campaign.product}`,
          body: text,
          dueDate: dateOffset(0),
          createdAt: new Date().toISOString(),
          status: "已发送",
          sentAt: new Date().toISOString(),
          delivered: true,
          step: `自动应答-${state.outbox.length}`,
          reply: true,
          autoReply: true
        };
  if (channel === "whatsapp") state.whatsappQueue.push(item);
  else state.outbox.push(item);
}

// 客户回复入站后的初轮处理：opt-out / 敏感转人工 / 标准自动答复
async function handleInboundAutoRespond(prospectId) {
  if (!state.agent?.autoRespond) return;
  const prospect = state.prospects.find((p) => p.id === prospectId);
  const message = [...state.inbound].reverse().find((m) => m.prospectId === prospectId);
  if (!prospect || !message || message.autoAction) return;

  const text = message.body;

  // 护栏 1：opt-out 即时生效
  if (isOptOut(text)) {
    prospect.optOut = true;
    const cancelled = cancelSequenceOnReply(prospectId);
    message.autoAction = { type: "optout" };
    addLog(`⛔ 客户 opt-out：${prospect.company} 已加入黑名单，停止全部触达（取消 ${cancelled} 条待发）`);
    saveState();
    render();
    return;
  }

  // 护栏 2：敏感话题一律转人工
  const sensitive = sensitiveTopic(text);
  if (sensitive) {
    message.autoAction = { type: "escalated", reason: sensitive };
    addLog(`🙋 敏感话题「${sensitive}」：AI 不擅自答复，已转人工接管：${prospect.company}`);
    saveState();
    render();
    return;
  }

  // 护栏 3：识别到高风险，AI 不擅自答复，立即转人工
  const risks = conversationRisks(prospectId);
  const highRisk = risks.find((r) => r.level === "high");
  if (highRisk) {
    message.autoAction = { type: "escalated", reason: `高风险·${highRisk.category}` };
    addLog(`⚠️ 高风险「${highRisk.category}」：AI 不擅自答复，已转人工接管：${prospect.company}`);
    saveState();
    render();
    return;
  }

  // 标准问题：自动答复（明确告知详细报价由销售跟进）
  const stored = getStoredAI(prospectId);
  const intentKey = stored ? stored.intent : classifyIntent(text).key;
  if (!AGENT_STANDARD_INTENTS.includes(intentKey)) {
    message.autoAction = { type: "escalated", reason: "需人工判断" };
    addLog(`🙋 无法确定为标准问题，转人工：${prospect.company}`);
    saveState();
    render();
    return;
  }

  const channel = message.channel || "email";
  if (channel === "email" && !prospect.email) return;
  if (channel === "whatsapp" && !prospect.phone) return;

  const reply = await generateAutoReply(prospect, text, intentKey);
  sendAutoReply(prospect, channel, reply);
  message.autoAction = { type: "replied", intent: intentKey };
  addLog(`🤖 AI 初轮自动应答（${channel === "whatsapp" ? "WhatsApp" : "邮件"}·${intentKey}）：${prospect.company}`);
  saveState();
  render();
}

function renderAgentTaskCard() {
  const card = elements.agentTaskCard;
  const task = state.agent.task;
  if (!task) {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  const parsed = task.parsed;
  const sourceTag = task.source === "claude" ? "Claude 解析" : "本地规则解析";

  if (task.status !== "draft") {
    const modeLabel = { review: "逐条审批", spot: "批量抽审", auto: "全自动" }[task.approvalMode];
    const rec = agentRecurring();
    const intervalOptions = [
      ["daily", "每天"],
      ["weekly", "每周"],
      ["monthly", "每月"]
    ]
      .map(([v, l]) => `<option value="${v}" ${rec.interval === v ? "selected" : ""}>${l}</option>`)
      .join("");
    const cycleStatus = rec.enabled
      ? `已执行 ${rec.cyclesRun || 0} 轮 · ${rec.lastRunAt ? `上次 ${new Date(rec.lastRunAt).toLocaleDateString("zh-CN")}` : "尚未执行"}${agentCycleDue() ? " · 本周期待执行" : ""}`
      : "未开启";
    card.innerHTML = `
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Task running</p>
          <h2>任务运行中</h2>
        </div>
        <span class="status-pill">${modeLabel} · ${task.startedAt}</span>
      </div>
      <p class="ai-summary">${escapeHtml(parsed.summary || task.prompt)}</p>
      <div class="conversation-meta">
        <span class="badge">${escapeHtml(parsed.product)}</span>
        ${parsed.markets.map((m) => `<span class="tag">${escapeHtml(m)}</span>`).join("")}
        <span class="tag">日上限 ${parsed.daily_limit}</span>
        ${parsed.use_email ? `<span class="channel-badge email">邮件</span>` : ""}
        ${parsed.use_whatsapp ? `<span class="channel-badge whatsapp">WhatsApp</span>` : ""}
      </div>
      <div class="agent-recurring">
        <label class="toggle-row"><input id="agentRecurEnabled" type="checkbox" ${rec.enabled ? "checked" : ""} /><span>周期自动补量</span></label>
        <label class="inline-field"><span>频率</span><select id="agentRecurInterval">${intervalOptions}</select></label>
        <label class="inline-field"><span>每轮线索数</span><input id="agentRecurPer" type="number" min="1" max="200" value="${rec.perCycle}" /></label>
        <button class="ghost-button" id="agentRunCycleNow" type="button"><svg><use href="#icon-play" /></svg><span>立即补充一批</span></button>
        <span class="webhook-status ${rec.enabled ? "ok" : ""}">${cycleStatus}</span>
      </div>
      <p class="connector-hint">周期补量：开启后自动驾驶每到周期自动补充新线索走一遍漏斗（浏览器演示用生成器模拟；真实部署走搜索采集 Webhook + 外部 cron 调度）。</p>
    `;
    return;
  }

  const typeOptions = [
    ["importer distributor", "进口商 / 经销商"],
    ["retailer chain buyer", "零售连锁 / 采购"],
    ["brand private label", "品牌商 / 贴牌"],
    ["wholesaler", "批发商"],
    ["contractor project buyer", "工程商 / 项目采购"]
  ]
    .map(([v, l]) => `<option value="${v}" ${parsed.customer_type === v ? "selected" : ""}>${l}</option>`)
    .join("");

  card.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Step 2 · 任务卡片</p>
        <h2>确认解析结果后启动</h2>
      </div>
      <span class="tag">${sourceTag}</span>
    </div>
    <p class="ai-summary">${escapeHtml(parsed.summary || task.prompt)}</p>
    <div class="form-grid">
      <label><span>产品 / 行业</span><input id="agentFProduct" value="${escapeHtml(parsed.product)}" /></label>
      <label><span>目标市场（逗号分隔）</span><input id="agentFMarkets" value="${escapeHtml(parsed.markets.join(", "))}" /></label>
      <label><span>客户类型</span><select id="agentFType">${typeOptions}</select></label>
      <label><span>每日触达上限</span><input id="agentFLimit" type="number" min="1" max="300" value="${parsed.daily_limit}" /></label>
    </div>
    <label><span>搜索关键词（AI 已扩展同义词）</span><input id="agentFKeywords" value="${escapeHtml(parsed.keywords.join(", "))}" /></label>
    <div class="form-grid">
      <label><span>规模条件</span><input value="${escapeHtml(parsed.size_note || "未指定")}" disabled /></label>
      <label><span>排除条件</span><input value="${escapeHtml(parsed.exclusion_note || "CRM 已有客户自动去重")}" disabled /></label>
    </div>
    <div class="agent-mode-row">
      <div class="agent-channels">
        <label class="toggle-row"><input id="agentFEmail" type="checkbox" ${parsed.use_email ? "checked" : ""} /><span>邮件触达</span></label>
        <label class="toggle-row"><input id="agentFWa" type="checkbox" ${parsed.use_whatsapp ? "checked" : ""} /><span>WhatsApp 接力</span></label>
      </div>
      <div class="segmented" role="group" aria-label="审批模式">
        <button class="segment ${task.approvalMode === "review" ? "is-active" : ""}" data-approval-mode="review" type="button" title="每个客户人工确认后发送（推荐冷启动）">逐条审批</button>
        <button class="segment ${task.approvalMode === "spot" ? "is-active" : ""}" data-approval-mode="spot" type="button" title="自动发送，用户抽查">批量抽审</button>
        <button class="segment ${task.approvalMode === "auto" ? "is-active" : ""}" data-approval-mode="auto" type="button" title="全自动 + 自动驾驶">全自动</button>
      </div>
    </div>
    <div class="button-row">
      <button class="primary-button" data-agent-action="confirm" type="button"><svg><use href="#icon-rocket" /></svg><span>确认并启动</span></button>
      <button class="ghost-button" data-agent-action="discard" type="button">重新解析</button>
    </div>
  `;
}

function renderAgentSteps() {
  const task = state.agent.task;
  const approvals = state.agent.approvals;
  const { hot } = agentHandoffData();
  const sent = state.outbox.filter((o) => o.status === "已发送").length;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const steps = [
    ["任务解析", !!task, task ? (task.source === "claude" ? "Claude" : "本地规则") : "待下达"],
    ["自动寻客", (task?.funnel.raw || 0) > 0, task ? `${task.funnel.raw} 条原始线索` : "—"],
    ["触达审批", approvals.length > 0 && !approvals.some((a) => a.status === "pending"), `${approvedCount}/${approvals.length} 已批准`],
    ["自动开发", sent > 0, `${sent} 次已发送`],
    ["意向移交", hot.length > 0, `${hot.length} 个热意向`]
  ];
  elements.agentSteps.innerHTML = steps
    .map(
      ([name, done, hint], index) => `
        <div class="workflow-step ${done ? "" : "is-waiting"}">
          <span class="step-index">${index + 1}</span>
          <div><strong>${name}</strong><span>${hint}</span></div>
          <span class="status-pill">${done ? "完成" : "等待"}</span>
        </div>
      `
    )
    .join("");
}

function renderAgentFunnel() {
  const task = state.agent.task;
  if (!task || !task.funnel.raw) {
    elements.agentFunnel.innerHTML = `<div class="empty-state">启动任务并导入线索后，这里展示 抓取→匹配→验证→评分 漏斗</div>`;
    elements.agentFunnelHint.textContent = "";
    return;
  }
  const f = task.funnel;
  const rows = [
    ["原始抓取", f.raw],
    ["画像匹配", f.matched],
    ["验证通过", f.verified],
    ["去重后", f.deduped],
    ["高分入围", f.scored]
  ];
  const top = Math.max(1, f.raw);
  elements.agentFunnel.innerHTML = rows
    .map(
      ([label, count]) => `
        <div class="funnel-row">
          <span>${label}</span>
          <div class="funnel-bar"><span style="width:${Math.max(3, Math.round((count / top) * 100))}%"></span></div>
          <span class="funnel-figure"><strong>${count}</strong></span>
        </div>
      `
    )
    .join("");
  elements.agentFunnelHint.textContent = `按「验证通过的有效线索」计量：${f.raw} 条原始 → ${f.scored} 条高分入围（评分阈值动态，日上限 ${task.parsed.daily_limit}）`;
}

function renderAgentApprovals() {
  const task = state.agent.task;
  const approvals = state.agent.approvals;
  const pending = approvals.filter((a) => a.status === "pending");
  elements.agentApprovalPanel.hidden = !task || approvals.length === 0;
  elements.agentApproveAll.hidden = pending.length === 0;
  if (elements.agentApprovalPanel.hidden) {
    elements.agentApprovalList.innerHTML = "";
    return;
  }

  elements.agentApprovalList.innerHTML = approvals
    .map((approval) => {
      const prospect = state.prospects.find((p) => p.id === approval.prospectId);
      if (!prospect) return "";
      const score = computeLeadScore(prospect);
      const email = buildEmailSequence(state.campaign, prospect)[0];
      const wa = buildWhatsappSequence(state.campaign, prospect)[0];
      const topFactors = score.factors.filter((fa) => fa.points > 0).slice(0, 3).map((fa) => fa.label).join(" · ");
      const statusBadge =
        approval.status === "approved"
          ? `<span class="status-pill">已批准发送</span>`
          : approval.status === "skipped"
            ? `<span class="tag">已跳过</span>`
            : `<span class="due-tag unplanned">待审批</span>`;
      const actions =
        approval.status === "pending"
          ? `<div class="ai-actions">
              <button class="primary-button" data-agent-approve="${approval.id}" type="button"><svg><use href="#icon-check" /></svg><span>通过并发送</span></button>
              <button class="ghost-button" data-agent-skip="${approval.id}" type="button">跳过</button>
            </div>`
          : "";
      return `
        <article class="agent-approval-card">
          <div class="crm-card-top">
            <strong>${escapeHtml(prospect.company)}</strong>
            <span><span class="prob-grade grade-${score.grade}">${score.grade}</span><span class="score">${score.probability}%</span></span>
          </div>
          <div class="crm-card-meta">
            <span>${escapeHtml(prospect.market)} · ${escapeHtml(prospect.contactName)} · ${escapeHtml(prospect.email || "")}</span>
          </div>
          <p class="approval-why">为什么值得开发：${escapeHtml(topFactors || "画像匹配")}</p>
          <div class="approval-previews">
            <div class="approval-preview"><span class="channel-badge email">邮件首触</span><strong>${escapeHtml(email?.subject || "")}</strong><p>${escapeHtml((email?.body || "").slice(0, 150))}…</p></div>
            ${task.parsed.use_whatsapp && prospect.phone ? `<div class="approval-preview"><span class="channel-badge whatsapp">WhatsApp</span><p>${escapeHtml((wa?.message || "").slice(0, 130))}…</p></div>` : ""}
          </div>
          ${statusBadge}
          ${actions}
        </article>
      `;
    })
    .join("");
}

function renderAgentHandoff() {
  const { hot, warm, rejected, silent } = agentHandoffData();
  const insight = computeAgentInsight();
  const hotHtml = hot.length
    ? hot
        .map(({ c, label, summary }) => {
          const risks = conversationRisks(c.prospectId);
          const riskBadge = risks.length
            ? `<span class="intent-tag ${riskLevelTone(highestRiskLevel(risks))}">⚠️ ${risks.length} 项风险</span>`
            : "";
          const riskLine = risks.length
            ? `<p class="approval-why risk-line">风险：${risks.map((r) => escapeHtml(r.category)).join("、")}——${escapeHtml(risks[0].action)}</p>`
            : "";
          return `
            <article class="agent-hot-card">
              <div class="crm-card-top">
                <strong>🔥 ${escapeHtml(c.company)}</strong>
                <span class="agent-hot-badges"><span class="intent-tag red">${escapeHtml(label)}</span>${riskBadge}</span>
              </div>
              <p class="approval-why">${escapeHtml(summary || summarizeConversation(c))}</p>
              ${riskLine}
              <div class="ai-actions">
                <button class="primary-button" data-agent-takeover="${c.prospectId}" type="button"><svg><use href="#icon-inbox" /></svg><span>接管会话</span></button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty-state">暂无热意向。客户回复询价/要样/问交期或触发风险时会出现在这里并推送接管</div>`;
  const warmHtml = warm.length
    ? warm.map(({ c, label }) => `<span class="tag">🌤 ${escapeHtml(c.company)} · ${escapeHtml(label)}</span>`).join("")
    : `<span class="tag">暂无</span>`;

  elements.agentHandoff.innerHTML = `
    <div class="handoff-tier"><p class="eyebrow">🔥 热意向 · 立即接管</p>${hotHtml}</div>
    <div class="handoff-tier"><p class="eyebrow">🌤 温 · 进入培育（回复但未询价）</p><div class="conversation-meta">${warmHtml}</div></div>
    <div class="handoff-tier"><p class="eyebrow">❄️ 冷</p><div class="conversation-meta"><span class="tag">已读不回 ${silent} 家（30 天后换角度再触达）</span><span class="tag">明确拒绝 ${rejected.length} 家（进黑名单）</span></div></div>
    ${insight ? `<div class="impact-lift">${escapeHtml(insight)}</div>` : ""}
  `;
}

function renderAgentDevelop() {
  elements.agentAutoRespond.checked = !!state.agent.autoRespond;
  if (document.activeElement !== elements.agentKnowledgeBase) {
    elements.agentKnowledgeBase.value = state.campaign.knowledgeBase || "";
  }

  const actions = state.inbound
    .filter((m) => m.autoAction)
    .slice(-8)
    .reverse();
  if (!actions.length) {
    elements.agentAutoLog.innerHTML = state.agent.autoRespond
      ? `<div class="empty-state">已开启。客户回复标准问题时自动应答，敏感话题转人工——动作会留痕在这里</div>`
      : "";
    return;
  }
  elements.agentAutoLog.innerHTML = `
    <p class="eyebrow">初轮应答留痕</p>
    ${actions
      .map((m) => {
        const meta =
          m.autoAction.type === "replied"
            ? `<span class="channel-badge whatsapp">已自动答复</span><span class="tag">${escapeHtml(m.autoAction.intent || "")}</span>`
            : m.autoAction.type === "escalated"
              ? `<span class="intent-tag red">转人工</span><span class="tag">${escapeHtml(m.autoAction.reason || "")}</span>`
              : `<span class="intent-tag red">opt-out 黑名单</span>`;
        return `<div class="auto-log-row"><strong>${escapeHtml(m.company)}</strong>${meta}<span class="tl-meta">${escapeHtml(m.time)}</span></div>`;
      })
      .join("")}
  `;
}

function renderAgent() {
  if (!elements.agentTaskCard) return;
  elements.agentEngineTag.textContent = aiEnabled() ? `Claude 解析 · ${state.settings.aiModel}` : "本地规则解析";
  renderAgentTaskCard();
  renderAgentSteps();
  renderAgentFunnel();
  renderAgentApprovals();
  renderAgentDevelop();
  renderAgentHandoff();
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
  if (prospect.optOut) return;
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
  if (prospect.optOut) return;
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

async function simulateSendNext() {
  const next = state.outbox.find((item) => item.status === "待发送");
  if (!next) {
    addLog("没有待发送邮件");
    return;
  }
  if (state.settings.mode === "webhook" && webhookUrl("send")) {
    const result = await callWebhook("send", { emails: [next] });
    if (result.ok) {
      next.status = "已发送";
      next.sentAt = new Date().toISOString();
      next.delivered = true;
      addLog(`发信 Webhook：已派发 ${next.company} · ${next.label}`);
    } else {
      addLog("发信 Webhook 失败，邮件保留待发送");
    }
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

  if (state.settings.mode === "webhook" && webhookUrl("send")) {
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

function addLog(message, options = {}) {
  state.logs.unshift({ id: makeId("log"), time: timestamp(), message });
  state.logs = state.logs.slice(0, 80);
  if (options.toast !== false) showToast(message);
}

function showToast(message) {
  if (!elements.toastStack) return;
  const tone = /失败|错误|无法|没有|不重复/.test(message)
    ? "warn"
    : /自动驾驶|AI |AI意图|AI 意图/.test(message)
      ? "auto"
      : "info";
  const node = document.createElement("div");
  node.className = `toast ${tone}`;
  node.textContent = message;
  elements.toastStack.appendChild(node);
  while (elements.toastStack.children.length > 3) elements.toastStack.firstChild.remove();
  setTimeout(() => {
    node.classList.add("hide");
    setTimeout(() => node.remove(), 320);
  }, 3600);
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
  if (state.settings.mode === "webhook" && webhookUrl("search")) {
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
  if (state.settings.mode === "webhook" && webhookUrl("crm")) {
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
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // 权限被拒或非安全上下文，降级到 execCommand
    }
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

function navigateTo(view) {
  elements.navTabs.forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  elements.views.forEach((item) => item.classList.toggle("is-active", item.id === `${view}View`));
}

elements.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => navigateTo(tab.dataset.view));
});

// 全局委托：空状态引导按钮 / 新手清单 的跳转与动作
document.addEventListener("click", (event) => {
  const gotoTarget = event.target.closest("[data-goto]");
  if (gotoTarget) {
    navigateTo(gotoTarget.dataset.goto);
    return;
  }
  if (event.target.closest("[data-checklist-dismiss]")) {
    state.ui = { ...(state.ui || {}), checklistDismissed: true };
    saveState();
    renderChecklist();
    return;
  }
  const action = event.target.closest("[data-checklist-action]");
  if (action?.dataset.checklistAction === "autopilot" && !state.autopilot?.enabled) setAutopilot(true);
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
  // 生成新的开发计划会清空线索池，同步结束进行中的 Agent 任务，避免悬挂审批指向已删除客户
  state.agent = { task: null, approvals: [], autoRespond: state.agent?.autoRespond || false };
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
  applyTheme();
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
  agentOnProspectsImported(imported);
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

elements.simulateSend.addEventListener("click", async () => {
  await simulateSendNext();
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

elements.themeToggle.addEventListener("click", toggleTheme);
elements.openPaletteBtn.addEventListener("click", openPalette);

elements.aiWriteEmail.addEventListener("click", generateSequenceAI);
elements.testAiEngine.addEventListener("click", testAiEngineConnection);

/* ---------- AI Agent 事件 ---------- */

elements.agentParse.addEventListener("click", parseAgentTask);

elements.agentTaskCard.addEventListener("click", (event) => {
  const task = state.agent.task;
  if (!task) return;
  const modeBtn = event.target.closest("[data-approval-mode]");
  if (modeBtn) {
    task.approvalMode = modeBtn.dataset.approvalMode;
    elements.agentTaskCard
      .querySelectorAll("[data-approval-mode]")
      .forEach((b) => b.classList.toggle("is-active", b === modeBtn));
    saveState();
    return;
  }
  const action = event.target.closest("[data-agent-action]")?.dataset.agentAction;
  if (action === "confirm") confirmAgentTask();
  else if (action === "discard") {
    state.agent.task = null;
    state.agent.approvals = [];
    saveState();
    render();
  }
});

elements.agentTaskCard.addEventListener("change", (event) => {
  const rec = agentRecurring();
  if (!rec) return;
  if (event.target.id === "agentRecurEnabled") {
    rec.enabled = event.target.checked;
    addLog(rec.enabled ? "周期自动补量已开启（需配合自动驾驶或点「立即补充」）" : "周期自动补量已关闭");
    saveState();
    render();
  } else if (event.target.id === "agentRecurInterval") {
    rec.interval = event.target.value;
    saveState();
  } else if (event.target.id === "agentRecurPer") {
    rec.perCycle = clamp(Number(event.target.value) || 20, 1, 200);
    saveState();
  }
});

elements.agentTaskCard.addEventListener("click", (event) => {
  if (event.target.closest("#agentRunCycleNow")) agentRunCycle(true);
});

elements.agentApprovalList.addEventListener("click", (event) => {
  const approveId = event.target.closest("[data-agent-approve]")?.dataset.agentApprove;
  const skipId = event.target.closest("[data-agent-skip]")?.dataset.agentSkip;
  if (!approveId && !skipId) return;
  const approval = state.agent.approvals.find((a) => a.id === (approveId || skipId));
  if (!approval) return;
  if (approveId) {
    agentApprove(approval);
  } else {
    approval.status = "skipped";
    addLog("已跳过该客户");
    if (!state.agent.approvals.some((a) => a.status === "pending")) state.agent.task.status = "outreach";
  }
  saveState();
  render();
});

elements.agentApproveAll.addEventListener("click", () => {
  const pending = state.agent.approvals.filter((a) => a.status === "pending");
  pending.forEach((approval) => agentApprove(approval, true));
  addLog(`已批量批准 ${pending.length} 个触达方案并入队发送`);
  saveState();
  render();
});

elements.agentHandoff.addEventListener("click", (event) => {
  const id = event.target.closest("[data-agent-takeover]")?.dataset.agentTakeover;
  if (!id) return;
  state.selectedConversationId = id;
  markConversationRead(id);
  saveState();
  render();
  navigateTo("inbox");
});

elements.agentDemoData.addEventListener("click", () => {
  const task = state.agent.task;
  if (!task || task.status === "draft") {
    addLog("请先解析并确认任务卡片，再体验演示数据");
    return;
  }
  const generated = generateProspects(state.campaign, 16);
  const seen = new Set(state.prospects.map((p) => p.website || p.company.toLowerCase()));
  const fresh = generated.filter((p) => {
    const key = p.website || p.company.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  state.prospects = [...fresh, ...state.prospects];
  agentOnProspectsImported(fresh);
  addLog(`演示采集：注入 ${fresh.length} 家模拟企业（真实使用请通过搜索导入或采集 Webhook）`);
  saveState();
  render();
});

elements.agentReset.addEventListener("click", () => {
  if (!state.agent.task) return;
  state.agent.task = null;
  state.agent.approvals = [];
  addLog("Agent 任务已结束（已导入的线索与会话全部保留）");
  saveState();
  render();
});

elements.agentAutoRespond.addEventListener("change", () => {
  state.agent.autoRespond = elements.agentAutoRespond.checked;
  addLog(
    state.agent.autoRespond
      ? "AI 初轮自动应答已开启（敏感话题仍转人工，opt-out 即时生效）"
      : "AI 初轮自动应答已关闭"
  );
  saveState();
  render();
});

elements.agentSaveKb.addEventListener("click", () => {
  state.campaign.knowledgeBase = elements.agentKnowledgeBase.value.trim();
  addLog("产品知识库已保存，将用于 AI 初轮应答与深度写信");
  saveState();
  renderLogs();
});

[elements.aiLocalMode, elements.aiClaudeMode].forEach((button) => {
  button.addEventListener("click", () => {
    readSettingsFromForm();
    state.settings.aiEngine = button.dataset.aiEngine;
    saveState();
    updateAiEngineButtons();
    addLog(
      state.settings.aiEngine === "claude"
        ? aiEnabled()
          ? "AI 引擎已切换为 Claude API"
          : "AI 引擎已切换为 Claude API（请填入 API Key 并点「测试连接」）"
        : "AI 引擎已切换为本地规则"
    );
    renderLogs();
  });
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (elements.paletteOverlay.hidden) openPalette();
    else closePalette();
    return;
  }
  if (!elements.paletteOverlay.hidden) {
    if (event.key === "Escape") {
      closePalette();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      paletteIndex = Math.min(paletteIndex + 1, Math.max(0, paletteItemsCache.length - 1));
      renderPalette();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      paletteIndex = Math.max(paletteIndex - 1, 0);
      renderPalette();
    } else if (event.key === "Enter") {
      event.preventDefault();
      runPaletteItem(paletteIndex);
    }
    return;
  }
  if (event.key === "Escape" && !elements.crmDrawerOverlay.hidden) closeCrmDrawer();
});

elements.paletteInput.addEventListener("input", () => {
  paletteIndex = 0;
  renderPalette();
});

elements.paletteResults.addEventListener("click", (event) => {
  const item = event.target.closest("[data-palette-index]");
  if (item) runPaletteItem(Number(item.dataset.paletteIndex));
});

elements.paletteOverlay.addEventListener("click", (event) => {
  if (event.target === elements.paletteOverlay) closePalette();
});

elements.analyticsRange.addEventListener("click", (event) => {
  const segment = event.target.closest("[data-range]");
  if (!segment) return;
  state.ui = { ...(state.ui || {}), analyticsRange: segment.dataset.range };
  saveState();
  renderAnalytics();
});

elements.crmBoard.addEventListener("click", (event) => {
  if (Date.now() - crmLastDragAt < 300) return;
  const card = event.target.closest(".crm-card[data-prospect-id]");
  if (card) openCrmDrawer(card.dataset.prospectId);
});

elements.crmDrawerOverlay.addEventListener("click", (event) => {
  if (event.target === elements.crmDrawerOverlay) {
    closeCrmDrawer();
    return;
  }
  if (event.target.closest("[data-drawer-close]")) {
    closeCrmDrawer();
    return;
  }
  const gotoBtn = event.target.closest("[data-drawer-goto]");
  if (gotoBtn && crmDrawerProspectId) {
    state.selectedProspectId = crmDrawerProspectId;
    state.selectedConversationId = crmDrawerProspectId;
    saveState();
    render();
    navigateTo(gotoBtn.dataset.drawerGoto);
    closeCrmDrawer();
  }
});

elements.crmDrawerOverlay.addEventListener("change", (event) => {
  const prospect = state.prospects.find((p) => p.id === crmDrawerProspectId);
  if (!prospect) return;
  if (event.target.id === "drawerStage") {
    prospect.dealStage = event.target.value;
    addLog(`商机推进：${prospect.company} → ${prospect.dealStage}`);
    saveState();
    render();
    renderCrmDrawer();
  } else if (event.target.id === "drawerValue") {
    prospect.dealValue = Math.max(0, Number(event.target.value) || 0);
    saveState();
    render();
    renderCrmDrawer();
  }
});

// 用时间戳抑制拖拽后的误触 click（布尔标志在 drop 重渲染后可能因 dragend 无法冒泡而卡死）
let crmLastDragAt = 0;

elements.crmBoard.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-prospect-id]");
  if (!card) return;
  crmLastDragAt = Date.now();
  event.dataTransfer.setData("text/plain", card.dataset.prospectId);
  event.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
});

elements.crmBoard.addEventListener("dragend", (event) => {
  crmLastDragAt = Date.now();
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
  crmLastDragAt = Date.now();
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

elements.inboxTimeline.addEventListener("input", (event) => {
  if (event.target.id === "quickReplyText") {
    quickReplyDrafts[state.selectedConversationId] = event.target.value;
  }
});

elements.inboxTimeline.addEventListener("keydown", (event) => {
  if (event.target.id === "quickReplyText" && event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    const channel =
      document.querySelector(".quick-reply [data-reply-channel].is-active")?.dataset.replyChannel || "email";
    sendQuickReply(state.selectedConversationId, channel, event.target.value);
  }
});

elements.inboxTimeline.addEventListener("click", async (event) => {
  const channelBtn = event.target.closest("[data-reply-channel]");
  if (channelBtn) {
    quickReplyChannels[state.selectedConversationId] = channelBtn.dataset.replyChannel;
    renderInbox();
    return;
  }
  const action = event.target.closest("[data-inbox-action]")?.dataset.inboxAction;
  if (!action) return;
  const prospectId = state.selectedConversationId;
  const prospect = state.prospects.find((item) => item.id === prospectId);

  if (action === "send-quick-reply") {
    const textEl = document.querySelector("#quickReplyText");
    const channel =
      document.querySelector(".quick-reply [data-reply-channel].is-active")?.dataset.replyChannel || "email";
    sendQuickReply(prospectId, channel, textEl?.value || "");
    return;
  }

  if (action === "ai-analyze") {
    addLog("Claude 分析中…");
    renderLogs();
    enrichInboundWithAI(prospectId, true);
    return;
  }

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
    saveState();
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

// 首次渲染（放在文件末尾，确保 render 依赖的所有模块级 const 已初始化）
render();
