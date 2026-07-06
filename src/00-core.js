window.__APP_V = "38";

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
