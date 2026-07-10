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
