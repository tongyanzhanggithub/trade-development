window.__APP_V = "d6dec20a";

const STORAGE_KEY = "foreign-trade-automation-v2";

// AI 服务商预设。除 Anthropic 外都走 OpenAI 兼容的 /chat/completions 协议，
// 所以 ChatGPT、DeepSeek、通义千问、Kimi、智谱 GLM 等用同一套客户端，只是地址/模型不同。
// 放在最顶部：初始化时 bindSettingsForm() 会经 applyAiProviderToForm 读它，需先于其初始化（避免 const TDZ）。
const AI_PROVIDERS = {
  anthropic: {
    label: "Claude (Anthropic)",
    url: "https://api.anthropic.com/v1/messages",
    auth: "anthropic",
    keyHint: "sk-ant-...",
    models: ["claude-opus-4-8", "claude-sonnet-5", "claude-haiku-4-5"],
    webSearch: true
  },
  openai: {
    label: "OpenAI ChatGPT",
    url: "https://api.openai.com/v1/chat/completions",
    auth: "bearer",
    keyHint: "sk-...",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "o4-mini"]
  },
  deepseek: {
    label: "DeepSeek 深度求索",
    url: "https://api.deepseek.com/v1/chat/completions",
    auth: "bearer",
    keyHint: "sk-...",
    models: ["deepseek-chat", "deepseek-reasoner"]
  },
  qwen: {
    label: "通义千问 Qwen（阿里）",
    url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    auth: "bearer",
    keyHint: "sk-...",
    models: ["qwen-max", "qwen-plus", "qwen-turbo"]
  },
  kimi: {
    label: "Kimi（Moonshot）",
    url: "https://api.moonshot.cn/v1/chat/completions",
    auth: "bearer",
    keyHint: "sk-...",
    models: ["kimi-k2-0711-preview", "moonshot-v1-32k", "moonshot-v1-8k"]
  },
  zhipu: {
    label: "智谱 GLM",
    url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    auth: "bearer",
    keyHint: "xxxxx.xxxxx",
    models: ["glm-4-plus", "glm-4-air", "glm-4-flash"]
  },
  custom: {
    label: "自定义（OpenAI 兼容）",
    url: "",
    auth: "bearer",
    keyHint: "填你的 API Key",
    models: []
  }
};

const $ = (selector) => document.querySelector(selector);

// 防抖：把连续触发（如筛选框逐字输入）合并成停顿后一次执行，避免每个字符都重建整张列表
function debounce(fn, wait = 160) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

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
  cqPresets: $("#cqPresets"),
  focusProductInput: $("#focusProductInput"),
  refineFocus: $("#refineFocus"),
  focusHint: $("#focusHint"),
  oneClickPipeline: $("#oneClickPipeline"),
  resetDemo: $("#resetDemo"),
  runAutomationTop: $("#runAutomationTop"),
  exportJson: $("#exportJson"),
  metricGrid: $("#metricGrid"),
  workflowSteps: $("#workflowSteps"),
  queryPreview: $("#queryPreview"),
  topProspects: $("#topProspects"),
  copyQueries: $("#copyQueries"),
  runDiscovery: $("#runDiscovery"),
  webSearchFind: $("#webSearchFind"),
  competitorUrl: $("#competitorUrl"),
  reverseCompetitor: $("#reverseCompetitor"),
  createProspects: $("#createProspects"),
  loadImportExample: $("#loadImportExample"),
  importSearchResults: $("#importSearchResults"),
  searchResultsInput: $("#searchResultsInput"),
  queryFilter: $("#queryFilter"),
  queryList: $("#queryList"),
  exportQueries: $("#exportQueries"),
  prospectFilter: $("#prospectFilter"),
  statusFilter: $("#statusFilter"),
  gradeFilter: $("#gradeFilter"),
  prospectSort: $("#prospectSort"),
  queueQualityLeads: $("#queueQualityLeads"),
  prospectTable: $("#prospectTable"),
  prospectDetail: $("#prospectDetail"),
  bulkEnrichContacts: $("#bulkEnrichContacts"),
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
  queueFollowups: $("#queueFollowups"),
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
  saveSettings: $("#saveSettings"),
  backupNow: $("#backupNow"),
  importBackup: $("#importBackup"),
  importBackupFile: $("#importBackupFile"),
  dataSafety: $("#dataSafety"),
  localMode: $("#localMode"),
  webhookMode: $("#webhookMode"),
  searchWebhook: $("#searchWebhook"),
  inboundWebhook: $("#inboundWebhook"),
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
  analyticsInsight: $("#analyticsInsight"),
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
  todoPanel: $("#todoPanel"),
  welcomeOverlay: $("#welcomeOverlay"),
  welcomeDemo: $("#welcomeDemo"),
  welcomeStart: $("#welcomeStart"),
  welcomeLater: $("#welcomeLater"),
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
  aiCloudMode: $("#aiCloudMode"),
  aiProviderSelect: $("#aiProviderSelect"),
  aiCloudRow: $("#aiCloudRow"),
  aiBaseUrlRow: $("#aiBaseUrlRow"),
  aiBaseUrlInput: $("#aiBaseUrlInput"),
  aiModelList: $("#aiModelList"),
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
  agentRespondLive: $("#agentRespondLive"),
  agentKnowledgeBase: $("#agentKnowledgeBase"),
  agentSaveKb: $("#agentSaveKb"),
  agentAutoLog: $("#agentAutoLog")
};

const WEBHOOK_CONNECTORS = {
  search: { urlKey: "searchWebhook", label: "搜索采集" },
  enrich: { urlKey: "enrichWebhook", label: "邮箱查找/验证" },
  send: { urlKey: "sendWebhook", label: "发信" },
  whatsapp: { urlKey: "whatsappWebhook", label: "WhatsApp" },
  crm: { urlKey: "crmWebhook", label: "CRM 同步" },
  inbound: { urlKey: "inboundWebhook", label: "拉取回复" }
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
let stateNeedsInitialSave = false;

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
    return normalizeStoredState(parsed);
  } catch {
    return createDemoState();
  }
}

function normalizeStoredState(parsed) {
  if (!parsed?.campaign) return createDemoState();

  const fallback = createDemoState();
  let migrated = false;
  const merged = {
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
      autoRespond: !!parsed.agent?.autoRespond,
      autoRespondLive: !!parsed.agent?.autoRespondLive
    },
    logs: Array.isArray(parsed.logs) ? parsed.logs : fallback.logs,
    blacklist: Array.isArray(parsed.blacklist) ? parsed.blacklist : fallback.blacklist,
    management: parsed.management
      ? mergeManagement(fallback.management, parsed.management)
      : fallback.management
  };

  // 迁移：老数据的线索没有 campaignId，归到当前活动，保证活动计数不落空
  const homeId = merged.activeCampaignId || merged.management.campaigns[0]?.id || null;
  if (homeId && merged.prospects.some((p) => !p.campaignId)) migrated = true;
  merged.prospects = merged.prospects.map((p) => (p.campaignId ? p : { ...p, campaignId: homeId }));

  // 迁移：v35 起 "待发送" 表示已人工批准；旧版未发送队列先回到待审批，避免升级后被误认为已批准。
  if (!parsed.ui?.sendApprovalMigrated) {
    migrated = true;
    merged.outbox = merged.outbox.map((item) =>
      item.status === "待发送" && !item.sentAt ? { ...item, status: "待审批" } : item
    );
    merged.ui.sendApprovalMigrated = true;
  }

  // 迁移：只有真实已发送记录才算已触达；修正曾经因"仅入队"被推进的 CRM 阶段。
  if (!parsed.ui?.sentOnlyStageMigrated) {
    migrated = true;
    const sentProspects = new Set([
      ...merged.outbox.filter((item) => item.status === "已发送").map((item) => item.prospectId),
      ...merged.whatsappQueue.filter((item) => item.status === "已发送").map((item) => item.prospectId)
    ]);
    const repliedProspects = new Set([
      ...merged.inbound.map((item) => item.prospectId),
      ...merged.prospects.filter((item) => item.status === "已回复").map((item) => item.id)
    ]);
    merged.prospects = merged.prospects.map((item) =>
      item.dealStage === "已触达" && !sentProspects.has(item.id) && !repliedProspects.has(item.id)
        ? { ...item, dealStage: "线索" }
        : item
    );
    merged.ui.sentOnlyStageMigrated = true;
  }

  if (migrated) stateNeedsInitialSave = true;

  return merged;
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
      inboundWebhook: "",
      enrichWebhook: "",
      sendWebhook: "",
      whatsappWebhook: "",
      crmWebhook: "",
      searchProvider: "Google Custom Search / SerpAPI",
      emailProvider: "Hunter / Apollo / Dropcontact",
      crmProvider: "Twenty / Wukong CRM",
      webhookStatus: {},
      aiEngine: "local",
      aiProvider: "deepseek",
      aiApiKey: "",
      aiBaseUrl: "",
      aiModel: "deepseek-chat"
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
    ui: { checklistDismissed: false, theme: "light", analyticsRange: "all", sendApprovalMigrated: true, sentOnlyStageMigrated: true },
    agent: { task: null, approvals: [], autoRespond: false },
    blacklist: [], // 持久退订黑名单：[{ email, domain, company, reason, at }]，清空线索池也不丢
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
        // 完整配置快照：切换活动时整套恢复，避免只换产品导致卖点/品类串味
        product: campaign.product,
        markets: campaign.markets,
        customerType: campaign.customerType,
        valueProps: campaign.valueProps,
        certifications: campaign.certifications,
        owner: campaign.senderName,
        companyName: campaign.companyName,
        dailyLimit: campaign.dailyLimit,
        presetKey: campaign.presetKey || null,
        createdAt: dateOffset(0)
      }
    ],
    jobs: [
      { id: "job-search", name: "搜索采集", cadence: "点「运行待执行」或自动驾驶触发", status: "待执行", progress: 0, nextRun: "手动/自动驾驶" },
      { id: "job-enrich", name: "资料补全", cadence: "点「运行待执行」或自动驾驶触发", status: "待执行", progress: 0, nextRun: "手动/自动驾驶" },
      { id: "job-verify", name: "邮箱/号码验证", cadence: "点「运行待执行」或自动驾驶触发", status: "待执行", progress: 0, nextRun: "手动/自动驾驶" },
      { id: "job-sequence", name: "话术生成", cadence: "入队时自动生成", status: "待执行", progress: 0, nextRun: "触发后" },
      { id: "job-queue", name: "入队与限流", cadence: "点「运行待执行」或自动驾驶触发", status: "待执行", progress: 0, nextRun: "手动/自动驾驶" },
      { id: "job-crm", name: "CRM 同步", cadence: "需配置 CRM Webhook", status: "待配置", progress: 0, nextRun: "配置后" }
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
    rules: { ...fallback.rules, ...(current.rules || {}) }
  };
}

let storageWriteFailed = false;

// 持久化改用防抖：把一次操作里连续多次 saveState 合并成一次写盘（整份 state 的
// JSON.stringify 在数据量大时开销明显）。为避免防抖丢数据，做了三重兜底：
//   ① maxWait：即使 saveState 被持续触发（如自动驾驶），最多攒 SAVE_MAX_WAIT 就强制落盘；
//   ② 页面隐藏/卸载时（pagehide / visibilitychange→hidden / beforeunload）同步 flush；
//   ③ flushState() 供关键路径显式立即落盘。
const SAVE_DEBOUNCE = 400;
const SAVE_MAX_WAIT = 2000;
let saveTimer = null;
let saveDirty = false;
let saveFirstPendingAt = 0;

// 立即把内存 state 同步写入 localStorage。防抖计时器与关键路径都走它。
function flushState() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  saveDirty = false;
  saveFirstPendingAt = 0;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageWriteFailed = false;
  } catch (error) {
    // localStorage 满（约 5MB）或被禁用：改动会丢，必须立刻让用户知道并引导备份
    if (!storageWriteFailed) {
      storageWriteFailed = true;
      addLog("⛔ 本地存储已满或不可用，最新改动没有保存！请立即点右上角「导出全部数据」备份，然后删除老线索/已发邮件释放空间");
    }
  }
}

// 防抖入口：绝大多数调用点用它，攒一小会儿再合并写盘，最长不超过 SAVE_MAX_WAIT。
function saveState() {
  const now = Date.now();
  if (!saveDirty) {
    saveDirty = true;
    saveFirstPendingAt = now;
  }
  if (saveTimer) clearTimeout(saveTimer);
  // 距首次待写已超过 maxWait 就立刻落盘，避免持续触发把写盘无限往后推
  if (now - saveFirstPendingAt >= SAVE_MAX_WAIT) {
    flushState();
    return;
  }
  saveTimer = setTimeout(flushState, SAVE_DEBOUNCE);
}

// 页面隐藏/关闭时把未落盘的改动同步写下去（localStorage.setItem 同步，能在处理器内完成）
function flushOnExit() {
  if (saveDirty) flushState();
}
window.addEventListener("pagehide", flushOnExit);
window.addEventListener("beforeunload", flushOnExit);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushOnExit();
});

// 当前数据占用（KB）与大致上限占比，供设置页展示
function storageUsage() {
  const bytes = new Blob([JSON.stringify(state)]).size;
  const kb = Math.round(bytes / 1024);
  const pct = Math.min(100, Math.round((bytes / (5 * 1024 * 1024)) * 100));
  return { kb, pct };
}

function renderDataSafety() {
  if (!elements.dataSafety) return;
  const { kb, pct } = storageUsage();
  const last = state.ui?.lastBackupAt;
  const lastText = last ? `${new Date(last).toLocaleString("zh-CN", { hour12: false })}（${Math.floor((Date.now() - new Date(last).getTime()) / 86400000)} 天前）` : "从未备份";
  const overdue = !last || Date.now() - new Date(last).getTime() > 7 * 86400000;
  elements.dataSafety.innerHTML = `
    <div class="safety-row">
      <span>存储占用</span>
      <div class="job-progress"><span style="width:${pct}%;${pct > 80 ? "background:#b42318" : ""}"></span></div>
      <strong>${kb} KB / ~5 MB${pct > 80 ? " ⚠ 接近上限，建议清理老数据" : ""}</strong>
    </div>
    <div class="safety-row">
      <span>上次备份</span>
      <div></div>
      <strong class="${overdue ? "backup-overdue" : ""}">${lastText}${overdue ? " ⚠ 建议现在备份" : " ✓"}</strong>
    </div>
    <div class="safety-row">
      <span>数据规模</span>
      <div></div>
      <strong>${state.prospects.length} 线索 · ${state.outbox.length} 邮件 · ${state.blacklist?.length || 0} 黑名单</strong>
    </div>
  `;
}

// 重庆优势供应链品类模板：一键填好整套开发活动（产品/市场/客户类型/卖点/认证）
const CQ_PRESETS = {
  moto: {
    label: "摩托车 & 配件",
    product: "motorcycle spare parts (engines, tyres, chains, brakes, electrical)",
    markets: "Nigeria, Egypt, Indonesia, Colombia, Peru",
    customerType: "importer distributor",
    valueProps:
      "Chongqing motorcycle cluster (Loncin/Zongshen/Lifan supply chain), OEM-grade quality, stable bulk supply, competitive FOB Chongqing",
    certifications: "CCC, SONCAP, ISO 9001, export packing & documents"
  },
  auto: {
    label: "汽车零部件",
    product: "automotive aftermarket parts (filters, brake pads, suspension, lighting)",
    markets: "UAE, Saudi Arabia, Russia, Mexico, Vietnam",
    customerType: "importer distributor",
    valueProps: "Changan supply-chain grade, wide aftermarket coverage, stable QC, flexible MOQ, fast sampling",
    certifications: "IATF 16949, E-mark, ISO 9001, export documents"
  },
  electronics: {
    label: "笔电 & 电子",
    product: "consumer electronics & IT accessories (laptops, peripherals, adapters)",
    markets: "United States, Germany, United Arab Emirates, Brazil",
    customerType: "retailer chain buyer",
    valueProps:
      "Chongqing electronics manufacturing base (world's largest laptop cluster), ODM/OEM capacity, CE/FCC ready, reliable lead time",
    certifications: "CE, FCC, RoHS, ISO 9001"
  },
  machinery: {
    label: "机械 & 装备",
    product: "general machinery & industrial equipment",
    markets: "Indonesia, Saudi Arabia, Nigeria, Brazil, Vietnam",
    customerType: "contractor project buyer",
    valueProps:
      "Chongqing equipment manufacturing cluster, project-grade reliability, spare parts & after-sales support, export crating",
    certifications: "CE, ISO 9001, export documents"
  }
};

function applyCampaignPreset(key) {
  const preset = CQ_PRESETS[key];
  if (!preset) return;
  elements.productInput.value = preset.product;
  elements.marketsInput.value = preset.markets;
  elements.customerTypeInput.value = preset.customerType;
  elements.valuePropsInput.value = preset.valueProps;
  elements.certificationsInput.value = preset.certifications;
  readCampaignFromForm();
  state.campaign.presetKey = key; // 记住品类，开发信序列会套用该品类的专门话术
  addLog(`已套用重庆品类模板「${preset.label}」——在下方填你的具体产品点「AI 细化定位」更准，或直接「一键起量」`);
  saveState();
  render();
}

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
  management: [renderManagement],
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
          <button class="primary-button" data-inbox-action="adopt-suggestion" type="button"><svg><use href="#icon-mail" /></svg><span>加入待审回复</span></button>
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
    status: "待审批",
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
  ingestInboundMessage(prospectId, channel, body);
}

// 回信入库统一入口：模拟回复与「拉取回复 Webhook」的真实回信都走这里，
// 全套规则（回复即停/退订黑名单/意图推进/AI 分析与初轮应答）一致生效
function ingestInboundMessage(prospectId, channel, body, at = Date.now()) {
  const prospect = state.prospects.find((item) => item.id === prospectId);
  const company = prospect?.company || "未知客户";

  state.inbound.push({
    id: makeId("inbound"),
    prospectId,
    company,
    channel,
    body,
    time: timestamp(),
    at,
    read: false
  });

  if (prospect) {
    state.prospects = state.prospects.map((item) =>
      item.id === prospectId ? { ...item, status: "已回复" } : item
    );
    advanceDealStage(prospectId, "已回复");
  }
  addLog(`收到客户回复（${channel === "whatsapp" ? "WhatsApp" : "邮件"}）：${company}`);

  // 规则1：客户回复 → 自动停止其剩余触达序列
  cancelSequenceOnReply(prospectId);

  // 规则1.5：退订永久生效（无论是否开启 AI 自动应答），进持久黑名单
  if (isOptOut(body)) markProspectOptOut(prospectId);

  // 规则2：意图驱动 CRM——询价/要样/MOQ/认证/交期 视为有效询盘，自动推进
  const intent = classifyIntent(body);
  if (["price", "sample", "moq", "cert", "leadtime", "discount"].includes(intent.key)) {
    advanceDealStage(prospectId, "询盘");
    addLog(`AI 意图「${intent.label}」→ 商机自动推进到「询盘」：${company}`);
  } else if (intent.key === "reject") {
    addLog(`AI 意图「拒绝」→ ${company} 转入培育名单，停止主动触达`);
  }

  // 规则3/4/5：先做语义分析，再决定初轮应答与草稿（顺序保证 opt-out/敏感优先于自动发送）
  processInboundIntelligence(prospectId);
}

// 拉取真实客户回信：浏览器主动向「拉取回复 Webhook」要新回信（n8n/IMAP 侧按 since 返回增量）
async function pullInboundReplies(quiet = false) {
  if (!(state.settings.mode === "webhook" && webhookUrl("inbound"))) {
    if (!quiet) addLog("未配置「拉取回复 Webhook」：请在设置里接入你的收件服务（n8n/IMAP），真实客户回信才能进收件箱");
    return 0;
  }
  const result = await callWebhook("inbound", { since: state.lastInboundPullAt || null });
  if (!result.ok) {
    if (!quiet) addLog(`拉取回复失败：${result.error || result.code || "无响应"}`);
    return 0;
  }
  const replies = Array.isArray(result.data?.replies) ? result.data.replies : [];
  state.lastInboundPullAt = new Date().toISOString();
  if (!replies.length) {
    if (!quiet) addLog("拉取回复：暂无新回信");
    saveState();
    return 0;
  }

  let ingested = 0;
  replies.forEach((r) => {
    const email = (r.from_email || r.email || "").toLowerCase().trim();
    const text = (r.text || r.body || "").trim();
    if (!text) return;
    // 按邮箱匹配线索（主邮箱或候选邮箱），否则按公司名，都没有就补建一条线索避免丢回信
    let prospect =
      (email &&
        state.prospects.find(
          (p) => (p.email || "").toLowerCase() === email || (p.emailCandidates || []).some((c) => c.email.toLowerCase() === email)
        )) ||
      (r.company && state.prospects.find((p) => p.company.toLowerCase() === String(r.company).toLowerCase()));
    if (!prospect) {
      prospect = {
        id: makeId("prospect"),
        company: r.company || domainToCompany(email.split("@")[1] || "") || email || "未知回信客户",
        market: r.market || "待确认",
        source: "回信导入",
        website: email.split("@")[1] || "",
        contactName: r.from_name || "待确认",
        role: "回信联系人",
        email,
        emailStatus: "已验证",
        phone: r.phone || "",
        phoneStatus: r.phone ? "待人工确认" : "待查找",
        status: "已回复",
        score: 80,
        confidence: 88,
        presetKey: state.campaign.presetKey || null,
        campaignId: state.activeCampaignId || null,
        buyingSignal: "主动回信（真实回信导入）",
        companySize: "待确认",
        searchQuery: "inbound"
      };
      state.prospects = [prospect, ...state.prospects];
      addLog(`回信来自陌生地址 ${email || r.company}，已自动补建线索：${prospect.company}`);
    }
    // 去重：同一线索同样内容不重复入库
    if (state.inbound.some((m) => m.prospectId === prospect.id && m.body === text)) return;
    ingestInboundMessage(prospect.id, r.channel === "whatsapp" ? "whatsapp" : "email", text, r.at ? new Date(r.at).getTime() : Date.now());
    ingested += 1;
  });

  if (ingested) addLog(`拉取回复：${ingested} 条真实客户回信已进收件箱（意图识别/风险扫描/AI 应答已联动）`);
  saveState();
  render();
  return ingested;
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
    if (item.prospectId === prospectId && ["待审批", "待发送"].includes(item.status) && !item.reply) {
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
      status: "待人工确认",
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
      status: "待审批",
      step: `AI回复-${intent.key}-${state.outbox.length}`,
      reply: true
    });
  }
  addLog(
    asDraft
      ? `AI 自动生成回复草稿（${channel === "whatsapp" ? "WhatsApp" : "邮件"}·${intent.label}）待审批：${conversation.company}`
      : `已采用 AI 建议回复并加入待审批队列（${channel === "whatsapp" ? "WhatsApp" : "邮件"}·${intent.label}）：${conversation.company}`
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
    state.outbox.some((o) => o.prospectId === prospect.id && o.status === "已发送" && o.opened) ||
    state.whatsappQueue.some((w) => w.prospectId === prospect.id && w.status === "已发送" && w.read);
  const touched = hasSentOutbound(prospect.id);
  if (replied) add(25, "客户已回复（强意向）");
  else if (opened) add(12, "邮件/消息已打开");
  else if (touched) add(6, "已触达待响应");
  else factors.push({ label: "尚未触达", points: 0, tone: "neg", detail: "加入队列开始触达" });

  // 7. 资料置信度
  if ((prospect.confidence || 0) >= 80) add(4, "资料置信度高");

  // 8. 外部/AI 源评分作为先验，但不单独决定分级，避免和可解释质量分脱节
  const sourceScore = Number(prospect.score) || 0;
  if (sourceScore >= 90) add(16, "源评分很高", "pos", "导入/补全引擎判断为高价值线索");
  else if (sourceScore >= 80) add(12, "源评分较高", "pos", "导入/补全引擎判断匹配度较好");
  else if (sourceScore >= 70) add(6, "源评分可参考", "pos", "来源评分达到基础入围线");

  const probability = clamp(Math.round(score), 5, 99);
  return { probability, grade: leadGrade(probability), factors };
}

/* ---------- 商机管道看板 (CRM) ---------- */

function stageIndex(stage) {
  const index = DEAL_STAGES.indexOf(stage);
  return index < 0 ? 0 : index;
}

function hasSentOutbound(prospectId) {
  return (
    state.outbox.some((item) => item.prospectId === prospectId && item.status === "已发送") ||
    state.whatsappQueue.some((item) => item.prospectId === prospectId && item.status === "已发送")
  );
}

function deriveDealStage(prospect) {
  const replied =
    prospect.status === "已回复" || state.inbound.some((item) => item.prospectId === prospect.id);
  if (replied) return "已回复";
  if (hasSentOutbound(prospect.id)) return "已触达";
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
  const lead = computeLeadScore(prospect);
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
        <span class="score">${lead.probability}</span>
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

  let emailUpdated = 0;
  state.outbox = state.outbox.map((item) => {
    if (item.status !== "已发送") return item;
    const h = hashInt(item.prospectId + item.step);
    const delivered = h % 100 < 95;
    const opened = delivered && (h >> 3) % 100 < openChance(item.prospectId, 0);
    emailUpdated += 1;
    return {
      ...item,
      sentAt: item.sentAt || new Date().toISOString(),
      delivered,
      opened
    };
  });

  let whatsappUpdated = 0;
  state.whatsappQueue = state.whatsappQueue.map((item) => {
    if (item.status !== "已发送") return item;
    const h = hashInt(item.prospectId + item.step);
    const delivered = h % 100 < 98;
    const read = delivered && (h >> 3) % 100 < openChance(item.prospectId, 12);
    whatsappUpdated += 1;
    return { ...item, delivered, read };
  });

  addLog(
    emailUpdated || whatsappUpdated
      ? `模拟渠道回传：${emailUpdated} 封已发送邮件、${whatsappUpdated} 条已发送 WhatsApp 已更新送达/打开状态`
      : "模拟渠道回传：暂无已发送记录可更新"
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
  // 前段获客阶段（合并原「线索阶段漏斗」）：线索总数 → 有联系方式
  const contactable = prospects.filter((p) => emailLooksValid(p.email) || p.phone);
  return {
    total: prospects.length,
    contactable: contactable.length,
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
  renderAnalyticsInsight(funnel);
  renderAnalyticsKpis(funnel);
  renderAnalyticsFunnel(funnel);
  renderChannelCompare();
  renderRelayImpact();
  renderMarketPerformance();
  renderTemplateRank();
}

// 效果闭环提示：把"哪个市场/话术回复率最高 + 有多少客户该跟进"变成一句可执行结论
function renderAnalyticsInsight(funnel) {
  if (!elements.analyticsInsight) return;
  const outbox = axOutbox();
  const wa = axWa();

  // 回复率最高的市场（至少触达 2 家才纳入，避免小样本噪音）
  const markets = [...new Set(state.prospects.map((p) => p.market))];
  const marketStats = markets
    .map((market) => {
      const list = state.prospects.filter((p) => p.market === market);
      const reached = list.filter((p) => outbox.some((o) => o.prospectId === p.id) || wa.some((w) => w.prospectId === p.id)).length;
      const replied = list.filter(axReplied).length;
      return { market, reached, replied, rate: pct(replied, reached) };
    })
    .filter((m) => m.reached >= 2)
    .sort((a, b) => b.rate - a.rate || b.replied - a.replied);
  const bestMarket = marketStats[0];

  // 回复率最高的话术
  const repliedIds = new Set(state.prospects.filter(axReplied).map((p) => p.id));
  const buckets = new Map();
  [...outbox, ...wa].forEach((item) => {
    if (!buckets.has(item.label)) buckets.set(item.label, { recipients: new Set(), replied: new Set() });
    const b = buckets.get(item.label);
    b.recipients.add(item.prospectId);
    if (repliedIds.has(item.prospectId)) b.replied.add(item.prospectId);
  });
  const scriptStats = [...buckets.entries()]
    .map(([label, b]) => ({ label, sent: b.recipients.size, replied: b.replied.size, rate: pct(b.replied.size, b.recipients.size) }))
    .filter((s) => s.sent >= 2)
    .sort((a, b) => b.rate - a.rate || b.sent - a.sent);
  const bestScript = scriptStats[0];

  const dueN = dueFollowupProspects().length;

  const parts = [];
  if (bestMarket) parts.push(`回复率最高的市场：<strong>${escapeHtml(bestMarket.market)}</strong>（${bestMarket.rate}%，${bestMarket.replied}/${bestMarket.reached}）`);
  if (bestScript) parts.push(`最有效话术：<strong>${escapeHtml(bestScript.label)}</strong>（${bestScript.rate}%）`);

  // 优先联系名单：按机会排序（已回复 > 已打开 > 高分），告诉你今天先追谁
  const priority = priorityProspects(5);
  const priorityHtml = priority.length
    ? `
      <div class="priority-list">
        <p class="eyebrow">优先联系 · 按机会排序</p>
        ${priority
          .map(
            (x, i) => `
            <button class="priority-row" data-priority="${x.p.id}" type="button">
              <span class="priority-rank">${i + 1}</span>
              <span class="priority-name"><strong>${escapeHtml(x.p.company)}</strong><small>${escapeHtml(x.p.market)}</small></span>
              <span class="priority-tags">${
                x.replied ? `<span class="ptag hot">🔥 已回复</span>` : x.opened ? `<span class="ptag warm">👁 已打开</span>` : ""
              }<span class="ptag">${x.lead.grade} · ${x.lead.probability}%</span></span>
            </button>`
          )
          .join("")}
      </div>`
    : "";

  if (!parts.length && !dueN && !priority.length) {
    elements.analyticsInsight.innerHTML = `<span class="insight-hint">先触达并积累回复数据，这里会告诉你哪个市场/话术成功率最高、该优先追谁、以及给谁发跟进。</span>`;
    return;
  }

  const action = dueN
    ? `<button class="primary-button" id="insightFollowup" type="button"><svg><use href="#icon-shuffle" /></svg><span>一键批量跟进 (${dueN})</span></button>`
    : "";
  elements.analyticsInsight.innerHTML = `
    <div class="insight-text">💡 ${parts.join(" · ") || "已有触达数据"}${dueN ? ` · <strong>${dueN}</strong> 位客户到期未回复，该跟进了` : ""}</div>
    ${action}
    ${priorityHtml}
  `;
}

// 优先联系名单：只保留有信号（回复/打开）或高分的客户，按机会分排序
function priorityProspects(limit = 5) {
  const inboundBy = new Set(state.inbound.map((m) => m.prospectId));
  const openedBy = new Set(axOutbox().filter((o) => o.opened).map((o) => o.prospectId));
  return state.prospects
    .filter((p) => p.dealStage !== "成交" && p.status !== "已退订")
    .map((p) => {
      const lead = computeLeadScore(p);
      const replied = axReplied(p) || inboundBy.has(p.id);
      const opened = openedBy.has(p.id);
      const score = lead.probability + (replied ? 200 : opened ? 60 : 0);
      return { p, lead, replied, opened, score };
    })
    .filter((x) => x.replied || x.opened || x.lead.probability >= 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
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
  // 全流程漏斗：从线索获取到最终询盘，合并了原管理页的「线索阶段漏斗」
  const stages = [
    ["线索", funnel.total],
    ["有联系方式", funnel.contactable],
    ["已入队/触达", funnel.reached],
    ["送达", funnel.delivered],
    ["打开", funnel.opened],
    ["回复", funnel.replied],
    ["询盘", funnel.inquiry]
  ];
  const top = Math.max(1, funnel.total);
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
}

// 按活动实时统计（线索按 campaignId 归属，队列/回复据其线索反查）
function campaignStats(id) {
  const leads = state.prospects.filter((p) => (p.campaignId || null) === id);
  const ids = new Set(leads.map((l) => l.id));
  const queued =
    state.outbox.filter((o) => ids.has(o.prospectId)).length +
    state.whatsappQueue.filter((w) => ids.has(w.prospectId)).length;
  const replies = leads.filter((l) => l.status === "已回复").length;
  const stage = queued ? "触达中" : leads.length ? "采集中" : "待启动";
  const status = leads.length ? "运行中" : "草稿";
  return { prospects: leads.length, queued, replies, stage, status };
}

function refreshManagementDerivedData() {
  // 把当前编辑中的配置同步回选中的活动（保证活动列表里显示的是最新配置）
  const activeCampaign = getActiveManagedCampaign();
  if (activeCampaign) {
    activeCampaign.product = state.campaign.product;
    activeCampaign.markets = state.campaign.markets;
    activeCampaign.customerType = state.campaign.customerType;
    activeCampaign.valueProps = state.campaign.valueProps;
    activeCampaign.certifications = state.campaign.certifications;
    activeCampaign.owner = state.campaign.senderName;
    activeCampaign.companyName = state.campaign.companyName;
    activeCampaign.dailyLimit = state.campaign.dailyLimit;
    activeCampaign.presetKey = state.campaign.presetKey || null;
    activeCampaign.focusProduct = state.campaign.focusProduct || "";
    activeCampaign.productTerms = state.campaign.productTerms || [];
    activeCampaign.hsCode = state.campaign.hsCode || "";
    activeCampaign.buyerHint = state.campaign.buyerHint || "";
  }
}

function getActiveManagedCampaign() {
  return (
    state.management.campaigns.find((campaign) => campaign.id === state.activeCampaignId) ||
    state.management.campaigns[0] ||
    null
  );
}

// 审批中心：从真实待办实时汇总，每项可点击直达对应页面
function realApprovals() {
  const agentPending = (state.agent?.approvals || []).filter((a) => a.status === "pending").length;
  const emailDrafts = state.outbox.filter((o) => o.status === "待审批" && o.reply).length;
  const waPending = state.whatsappQueue.filter((w) => w.status === "待人工确认").length;
  const emailReady = state.outbox.filter((o) => ["待审批", "待发送"].includes(o.status) && !o.reply).length;
  return [
    { id: "ap-agent", type: "Agent", title: "Agent 触达卡待审批", count: agentPending, goto: "agent" },
    { id: "ap-draft", type: "AI 草稿", title: "AI 回复草稿待审批", count: emailDrafts, goto: "automation" },
    { id: "ap-wa", type: "WhatsApp", title: "WhatsApp 待人工确认", count: waPending, goto: "whatsapp" },
    { id: "ap-send", type: "邮件", title: "邮件待批量审批发送", count: emailReady, goto: "automation" }
  ];
}

// 渠道账号：真实反映 Webhook 配置/测试状态与今日实际用量
function connectorHealth(name) {
  if (!(state.settings.mode === "webhook" && webhookUrl(name))) return "本地模拟";
  const st = state.settings.webhookStatus?.[name];
  if (!st) return "已接入·未测";
  return st.ok ? "正常" : "异常";
}

function realAccounts() {
  const today = dateOffset(0);
  const waSentToday = state.whatsappQueue.filter(
    (w) => w.status === "已发送" && (w.sentAt || "").slice(0, 10) === today
  ).length;
  return [
    { channel: "Email", name: connectorHealth("send") === "本地模拟" ? "本地模拟发送" : "发信 Webhook", health: connectorHealth("send"), used: sentTodayCount(), limit: state.management.rules.emailDailyLimit },
    { channel: "WhatsApp", name: connectorHealth("whatsapp") === "本地模拟" ? "本地待确认队列" : "WhatsApp Webhook", health: connectorHealth("whatsapp"), used: waSentToday, limit: state.management.rules.whatsappDailyLimit },
    { channel: "Search API", name: connectorHealth("search") === "本地模拟" ? "本地/手动导入" : "采集 Webhook", health: connectorHealth("search"), used: null, limit: null },
    { channel: "CRM", name: connectorHealth("crm") === "本地模拟" ? "本地看板" : "CRM Webhook", health: connectorHealth("crm"), used: null, limit: null }
  ];
}

function renderManagementKpis() {
  const pendingApprovals = realApprovals().reduce((sum, item) => sum + item.count, 0);
  const liveAccounts = realAccounts().filter((a) => a.health !== "异常").length;
  const kpis = [
    ["活动", state.management.campaigns.length, "正在管理的开发活动"],
    ["线索总数", state.prospects.length, "全部活动累计线索"],
    ["待审批", pendingApprovals, "需要人工确认/发送"],
    ["渠道", liveAccounts, "在线渠道/接口"],
    ["最低评分", state.management.rules.scoreThreshold, "低于此分不自动发送"]
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

const PRESET_LABEL = { moto: "摩托车", auto: "汽配", electronics: "电子", machinery: "机械" };

function renderCampaignManager() {
  elements.campaignManager.innerHTML = `
    <div class="management-row header campaign-head">
      <span>活动</span>
      <span>市场</span>
      <span>阶段</span>
      <span>线索</span>
      <span>队列</span>
      <span>回复</span>
      <span>操作</span>
    </div>
    ${state.management.campaigns
      .map((campaign) => {
        const st = campaignStats(campaign.id);
        const active = campaign.id === state.activeCampaignId;
        const presetTag = campaign.presetKey ? `<span class="tag">${PRESET_LABEL[campaign.presetKey] || campaign.presetKey}</span>` : "";
        return `
          <div class="management-row campaign-row ${active ? "is-selected" : ""}">
            <button class="campaign-open" data-campaign-id="${campaign.id}" type="button" title="切换到该活动（整套配置恢复到控制台）">
              <span class="company-name">${escapeHtml(campaign.name)} ${active ? '<span class="tag tag-live">当前</span>' : ""}</span>
              <span class="company-meta">${escapeHtml(campaign.product)} · ${escapeHtml(campaign.owner || "未署名")} ${presetTag}</span>
            </button>
            <span>${escapeHtml(campaign.markets)}</span>
            <span><span class="tag">${st.stage}</span></span>
            <span>${st.prospects}</span>
            <span>${st.queued}</span>
            <span>${st.replies}</span>
            <span class="campaign-actions">
              <button class="icon-button" data-campaign-rename="${campaign.id}" type="button" title="重命名" aria-label="重命名">✎</button>
              <button class="icon-button" data-campaign-delete="${campaign.id}" type="button" title="删除活动" aria-label="删除"${state.management.campaigns.length <= 1 ? " disabled" : ""}>🗑</button>
            </span>
          </div>
        `;
      })
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
  const items = realApprovals();
  const total = items.reduce((s, i) => s + i.count, 0);
  elements.approvalCenter.innerHTML =
    (total === 0 ? `<div class="empty-state" style="grid-column:1/-1">暂无待审批事项 ✓</div>` : "") +
    items
      .map(
        (item) => `
        <button class="approval-card ${item.count ? "" : "is-empty"}" data-goto="${item.goto}" type="button" title="点击前往处理">
          <span>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.type)}${item.count ? " · 点击前往处理" : ""}</span>
          </span>
          <span class="badge ${item.count ? "badge-alert" : ""}">${item.count}</span>
        </button>
      `
      )
      .join("");
}

function renderAccountManager() {
  elements.accountManager.innerHTML = realAccounts()
    .map((account) => {
      const hasQuota = account.limit != null;
      const usage = hasQuota ? Math.min(100, Math.round((account.used / Math.max(account.limit, 1)) * 100)) : 0;
      const healthClass = account.health === "异常" ? "health-bad" : account.health === "正常" ? "health-ok" : "health-soft";
      return `
        <article class="account-card">
          <div>
            <strong>${escapeHtml(account.channel)}</strong>
            <span>${escapeHtml(account.name)} · <span class="${healthClass}">${escapeHtml(account.health)}</span></span>
          </div>
          <div class="job-progress"><span style="width:${usage}%"></span></div>
          <span>${hasQuota ? `今日 ${account.used}/${account.limit}` : "—"}</span>
        </article>
      `;
    })
    .join("");
}

function generateSearchPlan(campaign) {
  const product = campaign.product.trim();
  const productExpr = productSearchExpr(campaign); // 聚焦具体产品时是 ("a" OR "b") 同义词组
  const markets = normalizeMarkets(campaign.markets);
  const intent = buildCustomerSearchTerms(campaign.customerType);
  const exclusions = "-alibaba -amazon -made-in-china -globalsources -temu -shein";
  const patterns = [
    {
      channel: "Google",
      intent: "找真实进口商/分销商官网",
      priority: "P1",
      nextAction: "打开官网，找 About/Brands/Contact/Wholesale 页面",
      build: (market) => `${productExpr} (${intent.buyers}) "${market}" "contact" ${exclusions}`
    },
    {
      channel: "Google",
      intent: "找批发目录和经销商列表",
      priority: "P1",
      nextAction: "把目录里的公司官网粘贴到导入框",
      build: (market) => `${productExpr} "${market}" ("distributor list" OR "wholesale directory" OR "stockist") ${exclusions}`
    },
    {
      channel: "Google",
      intent: "找采购/品类负责人",
      priority: "P1",
      nextAction: "记录公司名、负责人职位、邮箱或 LinkedIn",
      build: (market) => `${productExpr} "${market}" ("sourcing manager" OR "buyer" OR "category manager" OR "procurement") ${exclusions}`
    },
    {
      channel: "LinkedIn",
      intent: "找公司主页和采购角色",
      priority: "P2",
      nextAction: "复制公司页 URL 或公司官网",
      build: (market) => `site:linkedin.com/company ${productExpr} "${market}" (${intent.buyers})`
    },
    {
      channel: "Retail",
      intent: "找零售商/品牌商采购入口",
      priority: "P2",
      nextAction: "找 vendor/supplier application 页面",
      build: (market) => `${productExpr} "${market}" ("vendor application" OR "supplier application" OR "become a supplier") ${exclusions}`
    },
    {
      channel: "Association",
      intent: "找协会会员名录",
      priority: "P2",
      nextAction: "导入会员公司名录",
      build: (market) => `${productExpr} "${market}" ("member directory" OR "association members" OR "trade association")`
    },
    {
      channel: "Customs Data",
      intent: "找有进口记录的买家线索",
      priority: "P3",
      nextAction: "用海关数据服务核验真实进口商",
      build: (market) => `${productExpr} "${market}" ("importer" OR "bill of lading" OR "import data") ${exclusions}`
    },
    {
      channel: "Competitor",
      intent: "找竞品渠道和经销商",
      priority: "P3",
      nextAction: "从竞品 Where to buy/Dealer 页面反查客户",
      build: (market) => `${productExpr} "${market}" ("where to buy" OR "dealer locator" OR "authorized distributor") ${exclusions}`
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
  // salt 用于让不同轮次/相似扩展产出不同公司：仅用来错位命名组合并保证域名唯一，绝不进入展示名
  const saltNum = salt ? [...salt].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) : 0;
  const prospects = [];

  markets.forEach((market, marketIndex) => {
    for (let index = 0; index < perMarket; index += 1) {
      const source = sourceChannels[(index + marketIndex) % sourceChannels.length];
      const prefix = prefixes[(index + marketIndex * 2 + saltNum) % prefixes.length];
      const suffix = suffixes[(index + marketIndex + saltNum) % suffixes.length];
      const company = `${prefix} ${capitalize(productNoun)} ${suffix}`;
      const domain = makeDomain(salt ? `${company} ${salt}` : company, market);
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
        presetKey: campaign.presetKey || null,
        campaignId: state.activeCampaignId || null,
        buyingSignal: `${market} 市场存在 ${campaign.product} 采购或分销线索`,
        companySize: ["11-50", "51-200", "201-500", "500+"][index % 4],
        searchQuery: query
      });
    }
  });

  return prospects.slice(0, targetCount);
}

// 平台/社媒/目录站域名——扫描时跳过，避免把 google.com 之类当成客户
const NON_COMPANY_DOMAIN =
  /^(google|bing|linkedin|facebook|instagram|twitter|x|youtube|amazon|ebay|alibaba|made-in-china|globalsources|temu|shein|wikipedia|yelp|yellowpages|tripadvisor|pinterest|reddit|medium|wordpress|blogspot|gmail|yahoo|hotmail|outlook)\./i;

function importSearchResultsText(text, campaign) {
  const markets = normalizeMarkets(campaign.markets);
  const marketAt = (i) => markets[i % Math.max(markets.length, 1)] || markets[0] || "United States";
  const seen = new Set(state.prospects.map((item) => item.website || item.company.toLowerCase()));
  const imported = [];
  let mi = 0;

  const rawLines = text.split(/\r?\n/).map((l) => l.trim());
  // CSV 表头识别：首行是 company/website/email 之类则跳过
  const headerLike = /(company|name|website|domain|url|email|country|market)/i;
  const isCsv = rawLines[0] && rawLines[0].split(/[,;\t]/).length >= 2 && headerLike.test(rawLines[0]) && !/https?:/i.test(rawLines[0]);
  const lines = (isCsv ? rawLines.slice(1) : rawLines).filter(Boolean);

  const add = (prospect) => {
    if (!prospect) return;
    // 平台/社媒/目录站域名不作为客户线索
    if (prospect.website && NON_COMPANY_DOMAIN.test(prospect.website.replace(/^www\./, ""))) return;
    // 退订黑名单：同邮箱/域名不再进池
    if (isBlacklisted(prospect)) return;
    const key = prospect.website || prospect.company.toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    imported.push(prospect);
  };

  lines.forEach((line) => {
    // 一行含多个 URL（如整页 Google 结果粘贴）：按每个 URL 拆成多个公司
    const urls = line.match(/https?:\/\/[^\s,，、|]+|www\.[^\s,，、|]+/gi);
    if (urls && urls.length > 1) {
      urls.forEach((u) => add(parseProspectLine(u, campaign, marketAt(mi++))));
      return;
    }
    add(parseProspectLine(line, campaign, marketAt(mi++)));
  });

  // 全文域名兜底扫描：抽出正文里任何还没被捕获的真实域名，补成轻量线索
  const domainSweep = text.match(/\b[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)+\.[a-z]{2,}\b/gi) || [];
  domainSweep.forEach((d) => {
    const domain = d.toLowerCase().replace(/^www\./, "");
    if (NON_COMPANY_DOMAIN.test(domain) || domain.split(".").length < 2) return;
    if (seen.has(domain)) return;
    add(parseProspectLine(domain, campaign, marketAt(mi++)));
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
  const cleaned = cleanCompanyName(line, website, emailMatch?.[0]);
  // 整句散文里夹着域名时（如 "visit us at x.com or ..."），用域名反推公司名更干净
  const proseStopWords = /(^|\s)(at|or|us|of|in|the|and|to|a|an|for|visit|contact|mention|somewhere|text|please|here|see|from)(\s|$)/i;
  const looksProse = cleaned && cleaned.split(/\s+/).length >= 4 && proseStopWords.test(cleaned);
  const company = website && (looksProse || !cleaned) ? domainToCompany(website) : cleaned || domainToCompany(website);

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
    presetKey: campaign.presetKey || null,
    campaignId: state.activeCampaignId || null,
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

const ENRICH_FIRST_NAMES = ["Anna", "Mark", "Carla", "Omar", "Elin", "Lucas", "Maya", "David", "Sofia", "Nina", "Jonas", "Rita"];
const ENRICH_LAST_NAMES = ["Weber", "Lewis", "Mendes", "Saeed", "Larsson", "Miller", "Khan", "Brown", "Garcia", "Hassan", "Smith", "Rossi"];

// 按公司域名 + 决策人姓名生成多个候选邮箱（带置信度与模式），供人工挑选/后续验证
function buildEmailCandidates(website, contactName, roleAlias) {
  if (!website) return [];
  const domain = stripProtocol(website).replace(/^www\./, "").split("/")[0];
  if (!domain || !domain.includes(".")) return [];
  const parts = (contactName || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const first = parts[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  const cands = [];
  const push = (local, confidence, pattern) => {
    if (local && !cands.some((c) => c.email === `${local}@${domain}`)) {
      cands.push({ email: `${local}@${domain}`, confidence, pattern });
    }
  };
  if (first && last) {
    push(`${first}.${last}`, 62, "firstname.lastname");
    push(`${first[0]}${last}`, 55, "flastname");
    push(first, 48, "firstname");
  } else if (first) {
    push(first, 50, "firstname");
  }
  push(roleAlias || "sales", 44, `role (${roleAlias || "sales"})`);
  push("info", 40, "info");
  push("sales", 38, "sales");
  return cands.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
}

function enrichProspectList(prospects, campaign) {
  const aliasByType = {
    "importer distributor": "purchasing",
    "retailer chain buyer": "buying",
    "brand private label": "sourcing",
    wholesaler: "sales",
    "contractor project buyer": "procurement"
  };
  const roleAlias = aliasByType[campaign.customerType] || "sourcing";

  return prospects.map((prospect, index) => {
    const contactName =
      prospect.contactName && !["待确认", "待补全", "待确认采购角色"].includes(prospect.contactName)
        ? prospect.contactName
        : `${ENRICH_FIRST_NAMES[index % ENRICH_FIRST_NAMES.length]} ${ENRICH_LAST_NAMES[(index + 3) % ENRICH_LAST_NAMES.length]}`;
    const candidates = prospect.email
      ? [{ email: prospect.email, confidence: 90, pattern: "导入原始邮箱" }]
      : buildEmailCandidates(prospect.website, contactName, roleAlias);
    return {
      ...prospect,
      contactName,
      role:
        prospect.role && !["待确认采购角色", "待确认"].includes(prospect.role)
          ? prospect.role
          : rolesForType(campaign.customerType)[index % rolesForType(campaign.customerType).length],
      email: prospect.email || candidates[0]?.email || "",
      emailCandidates: prospect.emailCandidates?.length ? prospect.emailCandidates : candidates,
      contactSource: prospect.contactSource || "local",
      emailStatus: prospect.email || candidates.length ? "待验证" : "待查找",
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

  return [
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

  if (!rows.length) {
    host.innerHTML = `<div class="todo-empty">✅ 今日暂无待办。保持每天到收件箱点「拉取回复」，有新回信会自动出现在这里。</div>`;
    return;
  }
  host.innerHTML =
    `<div class="todo-head"><strong>今日待办</strong><span class="todo-count">${rows.length} 项</span></div>` +
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

// 把当前活动里对 AI 最有用的上下文汇成几行，喂给写信/回复提示词，让输出更贴产品、更准确
function campaignContextLines() {
  const c = state.campaign;
  const terms = (c.productTerms || []).filter(Boolean);
  const lines = [];
  if (c.focusProduct) lines.push(`具体产品聚焦: ${c.focusProduct}`);
  if (terms.length > 1) lines.push(`英文术语/同义词: ${terms.join(", ")}`);
  if (c.hsCode) lines.push(`HS 编码: ${c.hsCode}`);
  if (c.buyerHint) lines.push(`目标买家画像: ${c.buyerHint}`);
  if (c.customerType) lines.push(`客户类型: ${c.customerType}`);
  const kb = (c.knowledgeBase || "").trim();
  if (kb) lines.push(`产品知识库/FAQ（回答客户问题、写卖点时以此为准，不要编造）:\n${kb.slice(0, 1200)}`);
  return lines.join("\n");
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
  const ctx = campaignContextLines();
  const user = `我方产品: ${state.campaign.product}
卖点: ${state.campaign.valueProps}
认证: ${state.campaign.certifications}
署名: ${state.campaign.senderName}, ${state.campaign.companyName}${ctx ? "\n" + ctx : ""}
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
      "你是顶尖外贸开发信专家。为指定客户写一套 4 封开发信序列（D0 首触 / D3 跟进 / D7 案例或样品 / D14 收尾）。每封 90-140 词，围绕该客户的业务与市场个性化切入，避免模板腔与夸张营销语。若给了「具体产品聚焦/英文术语」，主题与正文要点名这个具体产品（用英文行业叫法），而非泛泛的品类；卖点与能力只能用给定的知识库/卖点，不要编造参数。label 用中文。语言规则：按客户市场的商务语言写正文——拉美用西班牙语（巴西用葡萄牙语）、法语区非洲用法语、中东可英语正文+阿语问候；首封在正文下附简短英文版本；其他市场用英文。";
    const ctx = campaignContextLines();
    const user = `产品: ${state.campaign.product}
卖点: ${state.campaign.valueProps}
认证: ${state.campaign.certifications}
署名: ${state.campaign.senderName}, ${state.campaign.companyName}${ctx ? "\n" + ctx : ""}
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

/* ---------- 第 4 步：AI 初轮应答护栏 ---------- */

function isOptOut(text) {
  return /unsubscribe|stop sending|stop emailing|remove me|opt.?out|take me off|do not contact|退订|别再发|不要再发|停止发送|取消订阅/i.test(
    text || ""
  );
}

/* ---------- 持久退订黑名单（按邮箱+域名，清空线索池不丢） ---------- */

function prospectDomain(prospect) {
  const fromEmail = (prospect?.email || "").split("@")[1] || "";
  const fromSite = stripProtocol(prospect?.website || "").replace(/^www\./, "").split("/")[0];
  return (fromEmail || fromSite || "").toLowerCase();
}

function addToBlacklist(prospect, reason = "opt-out") {
  if (!state.blacklist) state.blacklist = [];
  const email = (prospect?.email || "").toLowerCase();
  const domain = prospectDomain(prospect);
  if (!email && !domain) return false;
  const exists = state.blacklist.some((b) => (email && b.email === email) || (domain && b.domain === domain));
  if (exists) return false;
  state.blacklist.push({ email, domain, company: prospect?.company || "", reason, at: new Date().toISOString() });
  return true;
}

function isBlacklisted(prospect) {
  if (!state.blacklist?.length) return false;
  const email = (prospect?.email || "").toLowerCase();
  const domain = prospectDomain(prospect);
  return state.blacklist.some((b) => (email && b.email && b.email === email) || (domain && b.domain && b.domain === domain));
}

// opt-out 统一处理：标记线索 + 进持久黑名单（幂等，两条路径共用）
function markProspectOptOut(prospectId, reason = "客户回信退订") {
  const prospect = state.prospects.find((p) => p.id === prospectId);
  if (!prospect) return;
  const firstTime = !prospect.optOut;
  prospect.optOut = true;
  const added = addToBlacklist(prospect, reason);
  if (firstTime || added) addLog(`⛔ ${prospect.company} 已进持久退订黑名单（同邮箱/域名以后不再触达，重建活动也不丢）`);
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

// 各重庆品类的常见反问 FAQ（喂给 Claude 作答；不含任何具体价格/账期承诺，敏感项仍留给销售）
const CQ_KNOWLEDGE = {
  moto: `品类：重庆摩托车配件（隆鑫/宗申/力帆供应链）。常见问答：
- 混柜：可以把不同车型（CG125/150、GN125、CB、Bajaj/TVS 兼容、三轮车/tricycle 动力）和大量 item number 混在一个 20'/40' 柜里，方便试销。
- MOQ：首单灵活，起步可用整柜混合 SKU；具体阶梯由销售确认。
- 认证：CCC、SONCAP（尼日利亚等）、ISO 9001，可提供测试报告与目的国所需文件。
- 覆盖车型：CG125/150、GN125、CB 系列、Bajaj/TVS 兼容、三轮车动力件等快消件。
- 付款方式：常见 T/T 或即期 L/C；具体条款/账期由销售确认。
- 包装：中性/OEM 出口包装，可定制 logo。
- 交期：样品 5-7 天，大货确认后 25-35 天。`,
  auto: `品类：重庆汽车零部件（长安配套供应链）。常见问答：
- 覆盖：滤清器、刹车片、悬挂、灯具等售后快消件，覆盖常见车型；可提供 OE 交叉参照。
- 混柜/MOQ：可混不同参照号一个柜，首单灵活；阶梯由销售确认。
- 认证：IATF 16949、E-mark、ISO 9001，可提供测试报告。
- 付款方式：常见 T/T 或即期 L/C；具体条款由销售确认。
- 交期：样品 5-7 天，大货 25-35 天。`,
  electronics: `品类：重庆笔电/消费电子（全球最大笔电产业带）。常见问答：
- 产品：笔电、外设、适配器、IT 配件；支持 ODM/OEM 贴牌（logo、包装、定制）。
- 认证：CE、FCC、RoHS，按目的国准备文件。
- MOQ：现货 SKU 与 ODM 不同，由销售确认。
- 付款方式：常见 T/T 或 L/C；具体条款由销售确认。
- 交期：现货 7-15 天，ODM/定制按项目确认。`,
  machinery: `品类：重庆通用机械/工业装备。常见问答：
- 范围：项目级、按规格匹配的机械与工业设备。
- 支持：备件清单、售后支持、安装/调试指导。
- 认证：CE、ISO 9001，全套出口文件，出口木箱包装。
- MOQ：通常按台/按项目，由销售确认。
- 付款方式：常见 T/T 或 L/C，里程碑条款由销售确认。
- 交期：按设备类型与产能确认。`
};

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
  // 品类专属答复（覆盖通用版；不承诺具体价格/账期）
  const catBodies = {
    moto: {
      moq: `Hi ${first}, MOQ is flexible for a first order — we can mix different models (CG125/150, GN125, CB, Bajaj/TVS-compatible, tricycle) and many item numbers in one 20'/40' container so you can test demand. Our sales colleague will confirm the exact tiers.`,
      cert: `Hi ${first}, we provide CCC, SONCAP and ISO 9001 plus test reports, and prepare the documents your market requires (e.g. SONCAP for Nigeria). Our sales colleague will attach what you need.`,
      leadtime: `Hi ${first}, samples take about 5-7 days and bulk 25-35 days after order confirmation. Our sales colleague will confirm timing for your model list and quantity.`,
      sample: `Hi ${first}, happy to help — I'll have our team prepare a fast-moving-parts catalog and sample policy covering your common models; a sales colleague will follow up with specifics.`
    },
    auto: {
      moq: `Hi ${first}, MOQ is flexible and we can mix different references in one container. Our sales colleague will confirm the exact tiers for your model coverage.`,
      cert: `Hi ${first}, we provide IATF 16949, E-mark and ISO 9001 with test reports, and can supply an OE cross-reference. Our sales colleague will attach the documents your market requires.`,
      leadtime: `Hi ${first}, samples take about 5-7 days and bulk 25-35 days after confirmation. Our sales colleague will confirm timing for your quantity.`,
      sample: `Hi ${first}, happy to help — our team will prepare a catalog of best-selling references with an OE cross-reference; a sales colleague will follow up with the specifics.`
    },
    electronics: {
      moq: `Hi ${first}, MOQ depends on whether it's a stock SKU or an ODM/private-label order. Our sales colleague will confirm the exact tiers for your configuration.`,
      cert: `Hi ${first}, our products are CE / FCC / RoHS ready and we prepare the documents your destination requires. Our sales colleague will attach the certificates you need.`,
      leadtime: `Hi ${first}, stock items ship in about 7-15 days; ODM/custom orders are confirmed per project. Our sales colleague will confirm the timing.`,
      sample: `Hi ${first}, happy to help — our team will prepare a product list with specs (and ODM options if you carry a private label); a sales colleague will follow up.`
    },
    machinery: {
      moq: `Hi ${first}, orders are typically per unit or per project. If you share the equipment type and capacity, our sales colleague will confirm the details.`,
      cert: `Hi ${first}, we provide CE and ISO 9001 with full export documents and proper export crating. Our sales colleague will attach the documents your project requires.`,
      leadtime: `Hi ${first}, lead time depends on equipment type and capacity. Share your specs and our sales colleague will confirm the timing and commissioning support.`,
      sample: `Hi ${first}, for equipment we prepare a spec sheet, spare-parts list and after-sales terms rather than a physical sample; a sales colleague will follow up with these.`
    }
  };
  const cat = catBodies[prospect.presetKey || state.campaign.presetKey] || {};
  const body = cat[intentKey] || bodies[intentKey] || bodies.other;
  return `${body}\n\nBest regards,\n${sender} (AI assistant)`;
}

async function generateAutoReply(prospect, customerText, intentKey) {
  if (aiEnabled()) {
    try {
      const system =
        "你是外贸售前 AI 助手，只负责答复标准售前问题。严格护栏：绝对不承诺任何具体价格、折扣、账期/付款条件或独家代理——这些必须留给销售同事。回复中要明确告知客户详细报价/条款将由销售同事跟进。基于提供的产品知识库作答。回复为英文、简洁、专业，含称呼与 AI 助手署名。";
      const categoryFaq = CQ_KNOWLEDGE[prospect.presetKey || state.campaign.presetKey] || "";
      const userFaq = state.campaign.knowledgeBase || "";
      const combinedFaq = [categoryFaq, userFaq].filter(Boolean).join("\n\n") || "（未提供，用通用话术）";
      const user = `产品: ${state.campaign.product}
卖点: ${state.campaign.valueProps}
认证: ${state.campaign.certifications}
产品知识库/FAQ: ${combinedFaq}
署名: ${state.campaign.senderName}

客户来信: ${customerText}`;
      const text = await callAI(system, user, null, 700);
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

  // 护栏 1：opt-out 即时生效（并进持久黑名单）
  if (isOptOut(text)) {
    markProspectOptOut(prospectId);
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

  // 试运行闸门：未确认"直发"前，AI 应答一律存草稿等人工审批——信任是挣来的，不是默认的
  if (!state.agent.autoRespondLive) {
    if (channel === "whatsapp") {
      state.whatsappQueue.push({
        id: makeId("waq"),
        prospectId: prospect.id,
        company: prospect.company,
        phone: prospect.phone,
        label: "AI 应答草稿",
        message: reply,
        dueDate: dateOffset(0),
        createdAt: new Date().toISOString(),
        status: "待人工确认",
        step: `AI应答草稿-${state.whatsappQueue.length}`,
        reply: true,
        autoReply: true,
        url: buildWhatsappUrl(prospect, reply)
      });
    } else {
      state.outbox.push({
        id: makeId("outbox"),
        prospectId: prospect.id,
        company: prospect.company,
        email: prospect.email,
        label: "AI 应答草稿",
        subject: `Re: ${state.campaign.product}`,
        body: reply,
        dueDate: dateOffset(0),
        createdAt: new Date().toISOString(),
        status: "待审批",
        step: `AI应答草稿-${state.outbox.length}`,
        reply: true,
        autoReply: true
      });
    }
    message.autoAction = { type: "drafted", intent: intentKey };
    addLog(`📝 试运行模式：AI 已为 ${prospect.company} 起草应答（${intentKey}），去「队列」审批后发送；答得稳了可在 Agent 面板切换为直发`);
    saveState();
    render();
    return;
  }

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
    const modeLabel = { review: "逐条审批", spot: "批量审批", auto: "批量审批" }[task.approvalMode] || "逐条审批";
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
        <label class="toggle-row" title="开启后每到周期用 Claude 联网找真实客户（需配置 AI 引擎），否则用演示生成器/采集 Webhook"><input id="agentRecurWebSearch" type="checkbox" ${rec.useWebSearch ? "checked" : ""} /><span>联网找真实客户</span></label>
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
        <button class="segment ${task.approvalMode === "review" ? "is-active" : ""}" data-approval-mode="review" type="button" title="逐个查看并发送（推荐冷启动）">逐条审批</button>
        <button class="segment ${task.approvalMode === "spot" ? "is-active" : ""}" data-approval-mode="spot" type="button" title="一次审查一批后批量通过并发送首触">批量审批</button>
      </div>
    </div>
    <p class="connector-hint">发送始终需人工审批：Agent 自动找客户、补全联系方式、验证评分并生成触达方案，你审批通过后才发出。</p>
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
  if (elements.agentRespondLive) elements.agentRespondLive.checked = !!state.agent.autoRespondLive;
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
    .map((item) => ({ item, lead: computeLeadScore(item) }))
    .filter(
      ({ item, lead }) =>
        item.email &&
        item.status !== "已入队" &&
        item.status !== "已回复" &&
        lead.probability >= state.management.rules.scoreThreshold &&
        !inCooldown(item)
    )
    .sort((a, b) => b.lead.probability - a.lead.probability)
    .slice(0, limit);

  candidates.forEach(({ item }) => queueProspect(item, false));
  if (candidates.length) addLog(`${candidates.length} 个高分潜客已加入待审批发信队列`);
}

// 一键起量：联网找客户 → 批量补全 → 质量分入队 → 生成待审批邮件，停在批量审批
async function runOneClickPipeline() {
  readCampaignFromForm();
  const useAI = aiEnabled();
  // 步骤进度直接显示在按钮上，不用去日志里翻
  const stepText = (t) => {
    const s = elements.oneClickPipeline?.querySelector("span");
    if (s) s.textContent = t;
  };

  // ⓪ 填了具体产品但还没细化过 → 先自动细化定位，让后面每一步都围绕这个具体产品
  if (useAI && state.campaign.focusProduct && (state.campaign.productTerms || []).length <= 1) {
    stepText("⓪ 细化产品定位…");
    addLog(`一键起量 ⓪：先细化「${state.campaign.focusProduct}」的产品定位…`);
    renderLogs();
    await refineProductFocus();
  }
  // 人工闸门：AI 细化出的英文术语先让你确认一次（定位错整条链全歪）；同一产品确认过就不再问
  if (
    state.campaign.focusProduct &&
    (state.campaign.productTerms || []).length > 1 &&
    state.campaign.focusConfirmed !== state.campaign.focusProduct
  ) {
    const terms = state.campaign.productTerms;
    const ok = window.confirm(
      `AI 定位结果，请确认后继续起量：\n\n产品术语：${state.campaign.product}\n同义词：${terms.slice(1).join("、") || "无"}\nHS 编码：${state.campaign.hsCode || "—"}\n目标买家：${state.campaign.buyerHint || "—"}\n\n【确定】= 用这个定位找客户\n【取消】= 停止起量，先手动修改「具体产品聚焦」或产品字段`
    );
    if (!ok) {
      addLog("已取消起量：请修改「具体产品聚焦」后重试（术语不对会导致整批找错客户）");
      saveState();
      render();
      return;
    }
    state.campaign.focusConfirmed = state.campaign.focusProduct;
  }

  // ① 找客户
  stepText("①/④ 联网找客户…");
  addLog("一键起量 ①/④：正在找客户…");
  renderLogs();
  let found = 0;
  if (useAI) {
    found = await webSearchProspects({ count: 15 });
  } else {
    // 未配置 Claude：用演示生成器铺一批，让新手先跑通全流程（演示数据）
    const generated = generateProspects(state.campaign, 15, `Kick${state.prospects.length}`);
    const seen = new Set(state.prospects.map((p) => p.website || p.company.toLowerCase()));
    const fresh = generated.filter((g) => {
      const key = g.website || g.company.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    state.prospects = [...fresh, ...state.prospects];
    agentOnProspectsImported(fresh);
    found = fresh.length;
    addLog(`一键起量：未配置 Claude，已用演示数据铺 ${found} 家线索跑通流程（配置 AI 引擎后可联网找真实客户）`);
  }
  if (!found && !state.prospects.length) {
    addLog("一键起量：没有可用线索。请在「设置 → AI 引擎」配置 Claude，或先在搜索页粘贴导入真实结果");
    saveState();
    render();
    return;
  }

  // ② 批量补全联系方式 + 验证邮箱
  stepText("②/④ 补全联系方式…");
  addLog("一键起量 ②/④：批量补全联系方式…");
  renderLogs();
  await bulkEnrichContacts((done, total) => stepText(`②/④ 补全联系方式 ${done}/${total}…`));
  state.prospects = verifyProspectList(state.prospects, state.campaign);

  // ③ 生成待审批：给有联系方式、未退订、未入队的线索按质量分排序排首触（冷启动取质量最高的一批）
  stepText("③/④ 生成待审批邮件…");
  addLog("一键起量 ③/④：按质量分排序生成待审批邮件…");
  renderLogs();
  const cap = Math.min(state.campaign.dailyLimit || 20, 25);
  const candidates = state.prospects
    .filter((p) => !p.optOut && !["已入队", "已回复"].includes(p.status) && emailLooksValid(p.email))
    .sort((a, b) => computeLeadScore(b).probability - computeLeadScore(a).probability)
    .slice(0, cap);
  candidates.forEach((p) => queueProspect(p, false));
  const queued = candidates.length;

  // ④ 停在批量审批
  if (queued > 0) {
    navigateTo("automation");
    addLog(`一键起量 ④/④：已生成 ${queued} 封待审批邮件，请在此逐封预检后「批量审批发送」（发送始终等你过目）`);
  } else {
    navigateTo("prospects");
    addLog("一键起量 ④/④：线索已入池，但都还缺可用邮箱；请先『批量补全联系方式』或接入邮箱查找 Webhook 后再入队");
  }
  saveState();
  render();
}

// 质量分 A/B 级、可入队（未退订/未入队/未回复/不在冷却）的优质客户
function isQualityQueueable(p) {
  if (p.optOut) return false;
  if (["已入队", "已回复"].includes(p.status)) return false;
  if (inCooldown(p)) return false;
  return ["A", "B"].includes(computeLeadScore(p).grade);
}

// 一键把优质客户（质量分 A/B 级）批量加入触达队列——首触待人工审批发送
function queueQualityLeads() {
  const eligible = state.prospects.filter(isQualityQueueable);
  if (!eligible.length) {
    addLog("暂无 A/B 级优质客户可入队（可先『批量补全联系方式』提升质量分，或先触达积累互动信号）");
    saveState();
    render();
    return 0;
  }
  // 高分优先入队
  const ordered = [...eligible].sort((a, b) => computeLeadScore(b).probability - computeLeadScore(a).probability);
  let gradeA = 0;
  ordered.forEach((p) => {
    if (computeLeadScore(p).grade === "A") gradeA += 1;
    queueProspect(p, false);
  });
  addLog(`已把 ${ordered.length} 家优质客户加入触达队列（A 级 ${gradeA} · B 级 ${ordered.length - gradeA}），首封待你在「队列/邮件」审批发送`);
  saveState();
  render();
  return ordered.length;
}

// 该跟进的客户：已发过至少一封、超过跟进间隔仍未回复、未退订、当前没有待发邮件
function dueFollowupProspects() {
  const followupDays = state.management?.rules?.followupDays || 3;
  return state.prospects.filter((p) => {
    if (p.optOut) return false;
    if (p.status === "已回复" || axReplied(p)) return false;
    const mine = state.outbox.filter((o) => o.prospectId === p.id);
    const sent = mine.filter((o) => o.status === "已发送");
    if (!sent.length) return false; // 还没发过首封，交给一键起量/入队
    if (mine.some((o) => ["待发送", "待审批"].includes(o.status))) return false; // 已有待发的后续
    const lastSentMs = Math.max(...sent.map((o) => toTime(o.sentAt || o.createdAt)));
    if (daysSinceMs(lastSentMs) < followupDays) return false;
    // 序列里还有没发过的后续邮件
    const seq = buildEmailSequence(state.campaign, p);
    return seq.some((e) => !mine.some((o) => (o.step || o.label) === e.label));
  });
}

// 一键批量跟进：给到期未回复的客户排下一封跟进邮件（待审批发送）
function queueDueFollowups() {
  const due = dueFollowupProspects();
  if (!due.length) {
    addLog("暂无到期该跟进的客户（需已发过首封、超过跟进间隔且仍未回复）");
    saveState();
    render();
    return 0;
  }
  const today = dateOffset(0);
  const companies = [];
  due.forEach((p) => {
    const mine = state.outbox.filter((o) => o.prospectId === p.id);
    const seq = buildEmailSequence(state.campaign, p);
    const next = seq.find((e) => !mine.some((o) => (o.step || o.label) === e.label));
    if (!next) return;
    state.outbox.push({
      id: makeId("outbox"),
      prospectId: p.id,
      company: p.company,
      email: p.email,
      label: next.label,
      subject: next.subject,
      body: next.body,
      dueDate: today,
      createdAt: new Date().toISOString(),
      status: "待审批",
      step: next.label
    });
    companies.push(p.company);
  });
  addLog(
    `已为 ${companies.length} 位到期未回复客户排下一封跟进（待你审批发送）：${companies.slice(0, 3).join("、")}${companies.length > 3 ? " 等" : ""}`
  );
  navigateTo("automation");
  saveState();
  render();
  return companies.length;
}

function queueTopWhatsappProspects() {
  const limit = Math.min(state.campaign.dailyLimit, state.management.rules.whatsappDailyLimit, 8);
  const candidates = [...state.prospects]
    .map((item) => ({ item, lead: computeLeadScore(item) }))
    .filter(
      ({ item, lead }) =>
        item.phone &&
        item.status !== "已回复" &&
        lead.probability >= state.management.rules.scoreThreshold &&
        !inCooldown(item) &&
        !state.whatsappQueue.some((queued) => queued.prospectId === item.id)
    )
    .sort((a, b) => b.lead.probability - a.lead.probability)
    .slice(0, limit);

  candidates.forEach(({ item }) => queueWhatsappProspect(item, false));
  if (candidates.length) addLog(`${candidates.length} 个高分潜客加入 WhatsApp 待确认队列`);
}

function queueProspect(prospect, includeFullSequence = true) {
  if (prospect.optOut || isBlacklisted(prospect)) return;
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
      status: "待审批",
      step: email.label
    });
  });

  state.prospects = state.prospects.map((item) =>
    item.id === prospect.id ? { ...item, status: "已入队", lastQueuedAt: new Date().toISOString() } : item
  );
}

function queueWhatsappProspect(prospect, includeFullSequence = true) {
  if (prospect.optOut || isBlacklisted(prospect)) return;
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
  advanceDealStage(item.prospectId, "已触达");
}

async function simulateSendNext() {
  const ready = state.outbox.filter((item) => item.status === "待发送");
  const blocked = ready.filter((item) => !preflightOutboxItem(item).ok);
  const next = ready.find((item) => preflightOutboxItem(item).ok);
  if (!next) {
    addLog(
      blocked.length
        ? `没有可发送邮件：${blocked.length} 封已批准邮件被预检拦截，请先修复联系方式或退订状态`
        : "没有已批准待发送邮件；未审批邮件请先在队列中勾选后点「批量审批发送」"
    );
    return;
  }
  if (remainingDailyQuota() < 1) {
    addLog(`发送安全阀：今日邮件额度已用完（已发 ${sentTodayCount()} 封），明天再发或在「管理 → 规则」调整日限`);
    return;
  }
  if (state.settings.mode === "webhook" && webhookUrl("send")) {
    const result = await callWebhook("send", { emails: [next] });
    if (result.ok) {
      next.status = "已发送";
      next.sentAt = new Date().toISOString();
      next.delivered = true;
      advanceDealStage(next.prospectId, "已触达");
      addLog(`发信 Webhook：已派发 ${next.company} · ${next.label}`);
    } else {
      addLog("发信 Webhook 失败，邮件保留待发送");
    }
    return;
  }
  deliverEmail(next);
  addLog(`已模拟发送：${next.company} · ${next.label}`);
}

function emailLooksValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || "").trim());
}

// 邮箱是否"来路可信"：按出处判断，不看模拟验证状态。
// 可信：真实源(webhook)验证 / 客户回过信 / 导入原始邮箱 / 联网深挖标 verified / 非候选生成（直接从导入或联网结果带来）。
// 不可信（要警告）：规则或 AI 按域名模式猜出来的候选邮箱（firstname.lastname / info / sales / guessed 等）。
function emailLooksVerified(prospect, email) {
  if (!prospect) return false;
  if (prospect.contactSource === "webhook") return true;
  if (prospect.status === "已回复") return true;
  const target = email || prospect.email;
  const cand = (prospect.emailCandidates || []).find((c) => c.email === target);
  if (cand) return /verified|导入原始邮箱/.test(cand.pattern || "");
  // 没有候选记录：邮箱是导入/联网抓来的原始地址，非模式猜测
  return !!target;
}

// 发送预检：返回 { blockers:[], warnings:[], ok }。blockers 阻止发送，warnings 仅提示
function preflightOutboxItem(item) {
  const prospect = state.prospects.find((p) => p.id === item.prospectId);
  const blockers = [];
  const warnings = [];
  if (prospect?.optOut) blockers.push("客户已退订");
  if (isBlacklisted(prospect || { email: item.email })) blockers.push("在退订黑名单");
  if (!emailLooksValid(item.email)) blockers.push("邮箱缺失/格式无效");
  else if (prospect && !emailLooksVerified(prospect, item.email)) warnings.push("邮箱为推测未验证（退信伤发信域名，建议先验证）");
  const sensitive = sensitiveTopic(`${item.subject || ""} ${item.body || ""}`);
  if (sensitive) warnings.push(`含敏感话题：${sensitive}`);
  const dup = state.outbox.some(
    (o) =>
      o.id !== item.id &&
      o.prospectId === item.prospectId &&
      o.status === "已发送" &&
      (o.step === item.step || o.subject === item.subject)
  );
  if (dup) warnings.push("疑似重复触达（同客户同类邮件已发送）");
  return { blockers, warnings, ok: blockers.length === 0 };
}

function preflightBadge(item) {
  const pf = preflightOutboxItem(item);
  if (pf.blockers.length) return `<span class="pf-badge pf-block" title="${escapeHtml(pf.blockers.join("；"))}">⛔ ${escapeHtml(pf.blockers[0])}</span>`;
  if (pf.warnings.length) return `<span class="pf-badge pf-warn" title="${escapeHtml(pf.warnings.join("；"))}">⚠ ${escapeHtml(pf.warnings[0])}</span>`;
  return `<span class="pf-badge pf-ok">✓ 可发送</span>`;
}

/* ---------- 发送安全阀：发送时强制日限 + 预热提示（保护发信域名信誉） ---------- */

function sentTodayCount() {
  const today = dateOffset(0);
  return state.outbox.filter((o) => o.status === "已发送" && (o.sentAt || "").slice(0, 10) === today).length;
}

function remainingDailyQuota() {
  const limit = Math.min(
    state.management?.rules?.emailDailyLimit || 80,
    state.campaign?.dailyLimit || 300
  );
  return Math.max(0, limit - sentTodayCount());
}

// 对将要发送的列表应用日限；超出的部分保留待发并提示。返回可发的子集
function applyDailyQuota(list, quiet = false) {
  const remaining = remainingDailyQuota();
  if (list.length <= remaining) return list;
  const allowed = list.slice(0, remaining);
  const held = list.length - allowed.length;
  addLog(
    `发送安全阀：今日邮件额度剩 ${remaining} 封（已发 ${sentTodayCount()}），本批 ${list.length} 封只放行 ${allowed.length}，其余 ${held} 封保留明天再发（保护发信域名，避免进垃圾箱）`,
    { toast: !quiet }
  );
  return allowed;
}

// 新域名预热提示：历史总发送量还很小时，单日大批量最伤域名信誉
function warmupHint(batchSize) {
  const totalSent = state.outbox.filter((o) => o.status === "已发送").length;
  if (batchSize > 20 && totalSent < 200) {
    addLog("📮 预热提示：新发信域名前 1-2 周建议每天 ≤20 封并逐步加量，直接大批量发送容易被判定为垃圾邮件");
  }
}

// 发送指定的一批发信队列条目（审批即发送，忽略排期日期）；复用 Webhook/本地
async function sendOutboxItems(items) {
  const candidates = items.filter((i) => i.status === "待发送" || i.status === "待审批");
  const blocked = candidates.filter((item) => !preflightOutboxItem(item).ok);
  let toSend = candidates.filter((item) => preflightOutboxItem(item).ok);
  if (blocked.length) addLog(`发送预检拦截 ${blocked.length} 封邮件，请先修复后再发`);
  toSend = applyDailyQuota(toSend);
  if (!toSend.length) return 0;
  warmupHint(toSend.length);
  if (state.settings.mode === "webhook" && webhookUrl("send")) {
    const result = await callWebhook("send", { emails: toSend });
    if (result.ok) {
      toSend.forEach((item) => {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
        advanceDealStage(item.prospectId, "已触达");
      });
      return toSend.length;
    }
    addLog("发信 Webhook 失败，勾选邮件保留待发送");
    return 0;
  }
  toSend.forEach(deliverEmail);
  return toSend.length;
}

// 批量审批发送：对勾选的待发/待审批邮件跑发送预检，放行的立即发送，拦截的保留并提示
async function batchApproveSend() {
  const checkedIds = [...elements.outboxList.querySelectorAll("input[data-outbox-id]:checked")].map((c) => c.dataset.outboxId);
  if (!checkedIds.length) {
    addLog("请先勾选要审批发送的邮件（可点「全选待审/待发」）");
    return 0;
  }
  const items = state.outbox.filter((o) => checkedIds.includes(o.id));
  const sendable = [];
  const blocked = [];
  items.forEach((it) => {
    if (preflightOutboxItem(it).ok) sendable.push(it);
    else blocked.push(it);
  });
  if (!sendable.length) {
    addLog(`勾选的 ${items.length} 封都被发送预检拦截（缺邮箱/退订），请先修复联系方式`);
    saveState();
    render();
    return 0;
  }
  const sent = await sendOutboxItems(sendable);
  addLog(`批量审批发送 ${sent} 封${blocked.length ? `，预检拦截 ${blocked.length} 封（缺邮箱/退订，保留待处理）` : ""}`);
  saveState();
  render();
  return sent;
}

async function sendDueEmails(quiet = false) {
  const today = dateOffset(0);
  let due = state.outbox.filter((item) => item.status === "待发送" && item.dueDate <= today);
  if (!due.length) {
    if (!quiet) addLog("今天没有已批准且到期的邮件；未审批邮件请用「批量审批发送」放行");
    return 0;
  }
  const blocked = due.filter((item) => !preflightOutboxItem(item).ok);
  due = due.filter((item) => preflightOutboxItem(item).ok);
  if (blocked.length && !quiet) addLog(`发送预检拦截 ${blocked.length} 封已批准到期邮件，请先修复后再发`);
  if (!due.length) return 0;
  due = applyDailyQuota(due, quiet);
  if (!due.length) return 0;
  warmupHint(due.length);

  if (state.settings.mode === "webhook" && webhookUrl("send")) {
    const result = await callWebhook("send", { emails: due });
    if (result.ok) {
      due.forEach((item) => {
        item.status = "已发送";
        item.sentAt = new Date().toISOString();
        item.delivered = true;
        advanceDealStage(item.prospectId, "已触达");
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
  const today = dateOffset(0);
  const approved = state.whatsappQueue.filter((item) => item.status === "已审批" && item.dueDate <= today);
  approved.forEach((item) => {
    item.status = "已发送";
    item.sentAt = new Date().toISOString();
    const h = hashInt(item.prospectId + item.step);
    item.delivered = h % 100 < 98;
    const prospect = state.prospects.find((p) => p.id === item.prospectId);
    item.read = item.delivered && (h >> 3) % 100 < Math.min(88, 50 + Math.round((prospect?.score || 60) * 0.5));
    advanceDealStage(item.prospectId, "已触达");
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

// 从当前控制台配置构造/更新一个完整活动快照
function campaignFromCurrentConfig(existing) {
  return {
    id: existing?.id || makeId("campaign"),
    name: existing?.name || `${state.campaign.product} · ${normalizeMarkets(state.campaign.markets).slice(0, 2).join(", ")}`,
    product: state.campaign.product,
    markets: state.campaign.markets,
    customerType: state.campaign.customerType,
    valueProps: state.campaign.valueProps,
    certifications: state.campaign.certifications,
    owner: state.campaign.senderName,
    companyName: state.campaign.companyName,
    dailyLimit: state.campaign.dailyLimit,
    presetKey: state.campaign.presetKey || null,
    focusProduct: state.campaign.focusProduct || "",
    productTerms: state.campaign.productTerms || [],
    hsCode: state.campaign.hsCode || "",
    buyerHint: state.campaign.buyerHint || "",
    focusConfirmed: state.campaign.focusConfirmed || "",
    createdAt: existing?.createdAt || dateOffset(0)
  };
}

function saveCurrentCampaignSnapshot() {
  const existing = getActiveManagedCampaign();
  const snapshot = campaignFromCurrentConfig(existing);
  const exists = state.management.campaigns.some((campaign) => campaign.id === snapshot.id);
  state.management.campaigns = exists
    ? state.management.campaigns.map((campaign) => (campaign.id === snapshot.id ? snapshot : campaign))
    : [snapshot, ...state.management.campaigns];
  state.activeCampaignId = snapshot.id;
  addLog(`活动已保存：${snapshot.name}`);
}

function createManagedCampaign() {
  readCampaignFromForm();
  // 先把当前配置存回原活动，再开一个新活动（沿用当前配置作为起点，用户再改）
  saveCurrentCampaignSnapshot();
  const campaign = { ...campaignFromCurrentConfig(null), name: `新活动 · ${dateOffset(0)}` };
  state.management.campaigns.unshift(campaign);
  state.activeCampaignId = campaign.id;
  addLog(`已新建活动「${campaign.name}」——改控制台配置即属于它，新找到的线索归它名下`);
}

// 切换活动：整套配置恢复到控制台（不再只换产品，避免卖点/品类串味）
function activateManagedCampaign(id) {
  saveCurrentCampaignSnapshot(); // 先存回旧活动，改动不丢
  const c = state.management.campaigns.find((x) => x.id === id);
  if (!c) return;
  state.activeCampaignId = id;
  state.campaign = {
    ...state.campaign,
    product: c.product,
    markets: c.markets,
    customerType: c.customerType || state.campaign.customerType,
    valueProps: c.valueProps ?? state.campaign.valueProps,
    certifications: c.certifications ?? state.campaign.certifications,
    senderName: c.owner ?? state.campaign.senderName,
    companyName: c.companyName ?? state.campaign.companyName,
    dailyLimit: c.dailyLimit || state.campaign.dailyLimit,
    presetKey: c.presetKey || null,
    focusProduct: c.focusProduct || "",
    productTerms: c.productTerms || [],
    hsCode: c.hsCode || "",
    buyerHint: c.buyerHint || "",
    focusConfirmed: c.focusConfirmed || ""
  };
  bindCampaignForm();
  addLog(`已切换到活动「${c.name}」，整套配置已恢复到控制台`);
}

function deleteManagedCampaign(id) {
  if (state.management.campaigns.length <= 1) {
    addLog("至少保留一个活动，无法删除最后一个");
    return;
  }
  const target = state.management.campaigns.find((c) => c.id === id);
  if (!target) return;
  const leadCount = state.prospects.filter((p) => (p.campaignId || null) === id).length;
  if (!window.confirm(`删除活动「${target.name}」？它名下 ${leadCount} 条线索会转到其它活动，线索本身不删除。`)) return;
  state.management.campaigns = state.management.campaigns.filter((c) => c.id !== id);
  const fallbackId = state.management.campaigns[0].id;
  state.prospects = state.prospects.map((p) => ((p.campaignId || null) === id ? { ...p, campaignId: fallbackId } : p));
  if (state.activeCampaignId === id) activateManagedCampaign(fallbackId);
  addLog(`已删除活动「${target.name}」，${leadCount} 条线索已转移`);
}

function renameManagedCampaign(id) {
  const c = state.management.campaigns.find((x) => x.id === id);
  if (!c) return;
  const next = window.prompt("重命名活动：", c.name);
  if (next == null) return;
  const name = next.trim();
  if (name) {
    c.name = name;
    addLog(`活动已重命名为「${name}」`);
  }
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
  // Agent 待审批卡本身的按钮语义是"通过并发送"；普通邮件只批准为待发送，不暗中派发
  const pendingAgent = (state.agent?.approvals || []).filter((a) => a.status === "pending");
  let approvedEmails = 0;
  state.outbox.forEach((item) => {
    if (item.status === "待审批") {
      item.status = "待发送";
      approvedEmails += 1;
    }
  });
  const approvedWhatsapp = state.whatsappQueue.filter((item) => item.status === "待人工确认").length;
  state.whatsappQueue = state.whatsappQueue.map((item) =>
    item.status === "待人工确认" ? { ...item, status: "已审批" } : item
  );
  const parts = [];
  if (pendingAgent.length) parts.push(`${pendingAgent.length} 张 Agent 触达卡通过并发送`);
  if (approvedEmails) parts.push(`${approvedEmails} 封邮件已批准为待发送`);
  if (approvedWhatsapp) parts.push(`${approvedWhatsapp} 条 WhatsApp 已审批待到期发送`);
  addLog(parts.length ? `审批中心已全部通过（${parts.join("、")}）` : "审批中心：暂无待审批事项");

  // Agent 卡审批（async，逐张放行并发送首触）
  (async () => {
    for (const a of pendingAgent) await agentApprove(a, true);
    saveState();
    render();
  })();
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
  state.ui = { ...(state.ui || {}), lastBackupAt: new Date().toISOString() };
  saveState();
  download(`foreign-trade-automation-${dateOffset(0)}.json`, JSON.stringify(state, null, 2), "application/json");
  addLog("已导出全量备份（含线索/队列/黑名单/配置），请妥善保存该 JSON 文件");
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("文件读取失败"));
    reader.readAsText(file);
  });
}

async function importBackupFile(file) {
  if (!file) return;
  try {
    const text = await readFileAsText(file);
    const parsed = JSON.parse(text);
    if (!parsed?.campaign) throw new Error("不是有效的系统备份 JSON");
    const prospectCount = Array.isArray(parsed.prospects) ? parsed.prospects.length : 0;
    const outboxCount = Array.isArray(parsed.outbox) ? parsed.outbox.length : 0;
    const ok = window.confirm(
      `将恢复备份「${file.name}」并覆盖当前浏览器数据。\n\n备份包含：${prospectCount} 条线索、${outboxCount} 封邮件队列。\n\n继续导入？`
    );
    if (!ok) return;
    const restored = normalizeStoredState(parsed);
    restored.ui = { ...(restored.ui || {}), lastBackupAt: new Date().toISOString() };
    restored.logs = [
      { id: makeId("log"), time: timestamp(), message: `已从备份恢复：${file.name}` },
      ...(restored.logs || [])
    ].slice(0, 80);
    state = restored;
    bindCampaignForm();
    bindSettingsForm();
    bindManagementForm();
    bindInboxForm();
    saveState();
    render();
  } catch (error) {
    addLog(`导入备份失败：${error.message}`);
    saveState();
    render();
  }
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
  // 切换到某视图时才渲染它——它在隐藏期间没有跟随 render() 更新
  render();
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
  // 今日待办：一键批量跟进
  const todoTarget = event.target.closest("[data-todo]");
  if (todoTarget) {
    if (todoTarget.dataset.todo === "followup") queueDueFollowups();
    return;
  }
  // 优先联系名单：点一行 → 选中该客户并跳到对应视图（有回信去收件箱，否则去潜客详情）
  const priTarget = event.target.closest("[data-priority]");
  if (priTarget) {
    const id = priTarget.dataset.priority;
    state.selectedProspectId = id;
    const selected = getSelectedProspect();
    if (selected) {
      state.sequence = buildEmailSequence(state.campaign, selected);
      state.whatsappSequence = buildWhatsappSequence(state.campaign, selected);
    }
    navigateTo(state.inbound.some((m) => m.prospectId === id) ? "inbox" : "prospects");
    saveState();
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

if (elements.oneClickPipeline) {
  elements.oneClickPipeline.addEventListener("click", () => {
    runAsyncButton(elements.oneClickPipeline, "起量中…", () => runOneClickPipeline());
  });
}

if (elements.cqPresets) {
  elements.cqPresets.addEventListener("click", (event) => {
    const key = event.target.closest("[data-preset]")?.dataset.preset;
    if (key) applyCampaignPreset(key);
  });
}

if (elements.refineFocus) {
  elements.refineFocus.addEventListener("click", () => {
    runAsyncButton(elements.refineFocus, "细化中…", () => refineProductFocus());
  });
}

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
if (elements.backupNow) elements.backupNow.addEventListener("click", exportJson);
if (elements.importBackup) {
  elements.importBackup.addEventListener("click", () => elements.importBackupFile?.click());
}
if (elements.importBackupFile) {
  elements.importBackupFile.addEventListener("change", async () => {
    const file = elements.importBackupFile.files?.[0];
    await importBackupFile(file);
    elements.importBackupFile.value = "";
  });
}

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

// 异步按钮包装：防重复点击 + 临时文案 + 统一异常兜底
async function runAsyncButton(btn, busyText, task) {
  if (!btn || btn.dataset.busy === "1") return;
  btn.dataset.busy = "1";
  const span = btn.querySelector("span");
  const original = span?.textContent;
  if (span) span.textContent = busyText;
  btn.disabled = true;
  try {
    await task();
  } catch (error) {
    addLog(`操作失败：${error.message}`);
    saveState();
    render();
  } finally {
    btn.dataset.busy = "0";
    btn.disabled = false;
    if (span && original) span.textContent = original;
  }
}

if (elements.webSearchFind) {
  elements.webSearchFind.addEventListener("click", () => {
    readCampaignFromForm();
    runAsyncButton(elements.webSearchFind, "联网搜索中…", () => webSearchProspects({ count: 10 }));
  });
}

if (elements.reverseCompetitor) {
  elements.reverseCompetitor.addEventListener("click", () => {
    readCampaignFromForm();
    runAsyncButton(elements.reverseCompetitor, "反查中…", () => reverseCompetitorChannel(elements.competitorUrl?.value || ""));
  });
}

if (elements.bulkEnrichContacts) {
  elements.bulkEnrichContacts.addEventListener("click", () => {
    runAsyncButton(elements.bulkEnrichContacts, "批量补全中…", () => bulkEnrichContacts());
  });
}

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

elements.queryFilter.addEventListener("input", debounce(renderQueries));
elements.exportQueries.addEventListener("click", exportQueries);

elements.prospectFilter.addEventListener("input", debounce(renderProspects));
elements.statusFilter.addEventListener("change", renderProspects);
if (elements.gradeFilter) elements.gradeFilter.addEventListener("change", renderProspects);
if (elements.prospectSort) elements.prospectSort.addEventListener("change", renderProspects);
if (elements.queueQualityLeads) {
  elements.queueQualityLeads.addEventListener("click", () => queueQualityLeads());
}

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
  // 点候选邮箱设为主邮箱
  const setEmail = event.target.closest("[data-set-email]")?.dataset.setEmail;
  if (setEmail) {
    const sel = getSelectedProspect();
    if (sel) {
      state.prospects = state.prospects.map((p) => (p.id === sel.id ? { ...p, email: setEmail, emailStatus: "待验证" } : p));
      addLog(`已设为主邮箱：${setEmail}`);
      saveState();
      render();
    }
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  const prospect = getSelectedProspect();
  if (!action || !prospect) return;

  if (action === "find-contact") {
    addLog(`正在为 ${prospect.company} 找联系人…`);
    renderLogs();
    enrichContactAI(prospect.id);
    return;
  }

  if (action === "deep-dig-contact") {
    Promise.resolve(deepDigContact(prospect.id)).catch((error) => {
      addLog(`官网深挖失败：${error.message}`);
      saveState();
      render();
    });
    return;
  }

  if (action === "find-lookalike") {
    addLog(`以 ${prospect.company} 为样本，扩展相似客户…`);
    renderLogs();
    Promise.resolve(findLookalike(prospect.id))
      .then((n) => {
        if (n > 0) addLog(`扩展出 ${n} 家相似公司，已进线索池`);
        else addLog("没有找到新的相似公司（可能都已在池中）");
        saveState();
        render();
      })
      .catch((error) => {
        addLog(`找相似客户失败：${error.message}`);
        saveState();
        render();
      });
    return;
  }

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

if (elements.queueFollowups) {
  elements.queueFollowups.addEventListener("click", () => queueDueFollowups());
}

if (elements.analyticsInsight) {
  elements.analyticsInsight.addEventListener("click", (event) => {
    if (event.target.closest("#insightFollowup")) queueDueFollowups();
  });
}

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

const pullRepliesBtn = $("#pullReplies");
if (pullRepliesBtn) {
  pullRepliesBtn.addEventListener("click", () => runAsyncButton(pullRepliesBtn, "拉取中…", () => pullInboundReplies()));
}

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

elements.conversationFilter.addEventListener("input", debounce(renderInbox));
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

// 发信队列：批量审批发送 + 全选（事件委托，控件随 renderOutbox 重绘）
elements.outboxList.addEventListener("click", (event) => {
  if (event.target.closest("#batchApproveSend")) {
    batchApproveSend();
  }
});
elements.outboxList.addEventListener("change", (event) => {
  if (event.target.id === "outboxSelectAll") {
    const checked = event.target.checked;
    elements.outboxList.querySelectorAll("input[data-outbox-id]").forEach((box) => {
      box.checked = checked;
    });
  }
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
  } else if (event.target.id === "agentRecurWebSearch") {
    rec.useWebSearch = event.target.checked;
    if (rec.useWebSearch && !aiEnabled()) addLog("已勾选联网找客户，但尚未配置 Claude API（设置 → AI 引擎），周期到点会先降级到生成器/采集 Webhook");
    else addLog(rec.useWebSearch ? "周期补量将用 Claude 联网找真实客户" : "周期补量改用生成器/采集 Webhook");
    saveState();
    render();
  }
});

elements.agentTaskCard.addEventListener("click", (event) => {
  if (event.target.closest("#agentRunCycleNow")) agentRunCycle(true);
});

elements.agentApprovalList.addEventListener("click", async (event) => {
  const approveId = event.target.closest("[data-agent-approve]")?.dataset.agentApprove;
  const skipId = event.target.closest("[data-agent-skip]")?.dataset.agentSkip;
  if (!approveId && !skipId) return;
  const approval = state.agent.approvals.find((a) => a.id === (approveId || skipId));
  if (!approval) return;
  if (approveId) {
    await agentApprove(approval);
  } else {
    approval.status = "skipped";
    addLog("已跳过该客户");
    if (!state.agent.approvals.some((a) => a.status === "pending")) state.agent.task.status = "outreach";
  }
  saveState();
  render();
});

elements.agentApproveAll.addEventListener("click", async () => {
  const pending = state.agent.approvals.filter((a) => a.status === "pending");
  for (const approval of pending) {
    await agentApprove(approval, true);
  }
  addLog(`Agent 批量审批处理完成：${pending.length} 个触达方案已过审，预检失败项会保留待处理`);
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
  const targetCount = clamp(task.parsed?.daily_limit || 16, 1, 50);
  const generated = generateProspects(state.campaign, targetCount);
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

if (elements.agentRespondLive) {
  elements.agentRespondLive.addEventListener("change", () => {
    state.agent.autoRespondLive = elements.agentRespondLive.checked;
    addLog(
      state.agent.autoRespondLive
        ? "AI 应答已切换为【直发】：标准问题回复不再等审批（敏感话题仍转人工）"
        : "AI 应答已切回【试运行】：应答先进队列等你审批"
    );
    saveState();
    render();
  });
}

elements.agentAutoRespond.addEventListener("change", () => {
  state.agent.autoRespond = elements.agentAutoRespond.checked;
  addLog(
    state.agent.autoRespond
      ? "AI 初轮自动应答已开启（试运行：应答先进队列等你审批；敏感话题仍转人工，opt-out 即时生效）"
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

[elements.aiLocalMode, elements.aiCloudMode].forEach((button) => {
  if (!button) return;
  button.addEventListener("click", () => {
    readSettingsFromForm();
    state.settings.aiEngine = button.dataset.aiEngine; // local | cloud
    applyAiProviderToForm();
    saveState();
    updateAiEngineButtons();
    addLog(
      state.settings.aiEngine === "cloud"
        ? aiEnabled()
          ? `AI 引擎已切换为云端大模型（${aiProviderConf().label}）`
          : `AI 引擎已切换为云端大模型（${aiProviderConf().label}）——请填 API Key 并点「测试连接」`
        : "AI 引擎已切换为本地规则"
    );
    renderLogs();
  });
});

// 服务商切换：重置模型为该服务商默认、刷新地址提示/自定义 Base URL 显隐
elements.aiProviderSelect?.addEventListener("change", () => {
  readSettingsFromForm();
  const conf = aiProviderConf();
  // 换服务商后原模型名多半不适用，若非自定义则回落到该商默认模型
  if (aiProviderId() !== "custom" && !conf.models.includes(state.settings.aiModel)) {
    state.settings.aiModel = conf.models[0] || "";
    if (elements.aiModelSelect) elements.aiModelSelect.value = state.settings.aiModel;
  }
  applyAiProviderToForm();
  saveState();
  updateAiEngineButtons();
  addLog(`已选择 AI 服务商：${conf.label}`);
  renderLogs();
});

elements.aiBaseUrlInput?.addEventListener("change", () => {
  readSettingsFromForm();
  saveState();
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
  const renameId = event.target.closest("[data-campaign-rename]")?.dataset.campaignRename;
  const deleteId = event.target.closest("[data-campaign-delete]")?.dataset.campaignDelete;
  const openId = event.target.closest("[data-campaign-id]")?.dataset.campaignId;
  if (renameId) renameManagedCampaign(renameId);
  else if (deleteId) deleteManagedCampaign(deleteId);
  else if (openId) {
    if (openId === state.activeCampaignId) return; // 已是当前活动
    activateManagedCampaign(openId);
  } else return;
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

// 双标签页保护：另一个标签页改了数据 → 本页的内存状态已过期，继续操作会互相覆盖
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  if (document.getElementById("multiTabWarn")) return;
  const tip = document.createElement("div");
  tip.id = "multiTabWarn";
  tip.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:9999;padding:12px 16px;background:#b42318;color:#fff;font-size:14px;text-align:center;font-weight:700;";
  tip.textContent = "检测到系统在另一个标签页被修改——请只保留一个标签页操作，并刷新本页（继续在本页操作会互相覆盖数据）";
  document.body.appendChild(tip);
});

// 备份提醒：有真实数据且超过 7 天没备份 → 开屏提醒导出
(() => {
  if (!state.prospects.length) return;
  const last = state.ui?.lastBackupAt ? new Date(state.ui.lastBackupAt).getTime() : 0;
  if (Date.now() - last > 7 * 86400000) {
    setTimeout(() => {
      addLog(`📦 已超过 ${last ? Math.floor((Date.now() - last) / 86400000) + " 天" : "很久"}没备份：数据存在浏览器里，清缓存会丢。点右上角「导出全部数据」备份一份（含黑名单）`);
    }, 1500);
  }
})();

// ---------- 首次欢迎向导：新用户一进来给两条明路（先看演示 / 直接开始）----------
function closeWelcome() {
  if (elements.welcomeOverlay) elements.welcomeOverlay.hidden = true;
  state.ui = { ...(state.ui || {}), welcomeSeen: true };
  saveState();
}
if (elements.welcomeLater) elements.welcomeLater.addEventListener("click", closeWelcome);
if (elements.welcomeStart) {
  elements.welcomeStart.addEventListener("click", () => {
    closeWelcome();
    navigateTo("dashboard");
    elements.productInput?.focus();
  });
}
if (elements.welcomeDemo) {
  elements.welcomeDemo.addEventListener("click", () => {
    closeWelcome();
    // 表单为空时填一组示例（重庆摩配打美国/尼日利亚），让演示更真实
    if (elements.productInput && !elements.productInput.value.trim()) {
      elements.productInput.value = "motorcycle parts (CG125/GN125)";
      if (elements.marketsInput) elements.marketsInput.value = "United States, Nigeria";
      if (elements.valuePropsInput && !elements.valuePropsInput.value.trim()) {
        elements.valuePropsInput.value = "Chongqing supply chain, OEM level, container mixing, SONCAP";
      }
    }
    navigateTo("dashboard");
    // 复用「一键起量」：未配 AI 时会用演示数据铺线索并跑通到发信队列
    if (elements.oneClickPipeline) {
      runAsyncButton(elements.oneClickPipeline, "起量中…", () => runOneClickPipeline());
    }
  });
}
// 点背景空白处也可关闭
if (elements.welcomeOverlay) {
  elements.welcomeOverlay.addEventListener("click", (event) => {
    if (event.target === elements.welcomeOverlay) closeWelcome();
  });
}

// 首次渲染（放在文件末尾，确保 render 依赖的所有模块级 const 已初始化）
render();
if (stateNeedsInitialSave) {
  saveState();
  stateNeedsInitialSave = false;
}

// 全新用户（没看过向导、也还没有线索）→ 弹欢迎向导
if (!state.ui?.welcomeSeen && !state.prospects.length && elements.welcomeOverlay) {
  elements.welcomeOverlay.hidden = false;
}
