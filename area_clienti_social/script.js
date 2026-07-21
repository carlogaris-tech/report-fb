const fixedClientName = document.querySelector("#fixedClientName");
const campaignSelect = document.querySelector("#campaignSelect");
const periodSelect = document.querySelector("#periodSelect");
const dateFrom = document.querySelector("#dateFrom");
const dateTo = document.querySelector("#dateTo");
const applyDateFilter = document.querySelector("#applyDateFilter");
const refreshData = document.querySelector("#refreshData");
const clientTitle = document.querySelector("#clientTitle");
const clientDescription = document.querySelector("#clientDescription");
const accessClient = document.querySelector("#accessClient");
const clientInitials = document.querySelector("#clientInitials");
const updatedAt = document.querySelector("#updatedAt");
const activeCampaigns = document.querySelector("#activeCampaigns");
const metaAccount = document.querySelector("#metaAccount");
const selectedRange = document.querySelector("#selectedRange");
const metricGrid = document.querySelector("#metricGrid");
const campaignTable = document.querySelector("#campaignTable");
const connectionDot = document.querySelector("#connectionDot");
const connectionLabel = document.querySelector("#connectionLabel");
const connectionDetail = document.querySelector("#connectionDetail");
const barChart = document.querySelector("#barChart");
const engagementGrid = document.querySelector("#engagementGrid");
const followerChart = document.querySelector("#followerChart");
const chartButtons = Array.from(document.querySelectorAll("[data-chart-metric]"));
const exportCsv = document.querySelector("#exportCsv");

const useMockMetaApi = false;
const mockDateRange = {
  from: "2026-04-01",
  to: "2026-06-30",
};

const clients = [
  {
    id: "salottidea",
    name: "Salottidea",
    description:
      "Andamento delle campagne social nel periodo selezionato.",
    metaAccount: "act_8122658294482022",
    endpoint: "/api/meta-insights",
  },
];

const fallbackReports = {
  salottidea: {
    date_start: mockDateRange.from,
    date_stop: mockDateRange.to,
    updatedAt: "2026-06-12T08:45:00.000Z",
    campaigns: [
      {
        id: "cmp-101",
        name: "Promozione showroom",
        status: "ACTIVE",
        objective: "Lead generation",
        spend: 846.5,
        impressions: 118420,
        reach: 64200,
        clicks: 2180,
        leads: 142,
        purchases: 0,
        revenue: 0,
        daily: [
          ["2026-05-30", 28, 71, 4],
          ["2026-05-31", 33, 84, 5],
          ["2026-06-01", 29, 80, 4],
          ["2026-06-02", 31, 86, 6],
          ["2026-06-03", 36, 96, 7],
          ["2026-06-04", 42, 111, 9],
          ["2026-06-05", 44, 122, 8],
          ["2026-06-06", 51, 148, 12],
          ["2026-06-07", 56, 166, 13],
          ["2026-06-08", 63, 172, 14],
          ["2026-06-09", 70, 189, 15],
          ["2026-06-10", 76, 204, 17],
          ["2026-06-11", 81, 221, 18],
          ["2026-06-12", 86, 230, 20],
        ],
      },
      {
        id: "cmp-102",
        name: "Collezione divani",
        status: "ACTIVE",
        objective: "Traffico landing",
        spend: 392.2,
        impressions: 72480,
        reach: 38840,
        clicks: 1362,
        leads: 49,
        purchases: 18,
        revenue: 1890,
        daily: [
          ["2026-05-30", 14, 42, 1],
          ["2026-05-31", 16, 44, 2],
          ["2026-06-01", 15, 48, 2],
          ["2026-06-02", 18, 55, 2],
          ["2026-06-03", 19, 59, 3],
          ["2026-06-04", 21, 64, 3],
          ["2026-06-05", 24, 71, 3],
          ["2026-06-06", 26, 78, 4],
          ["2026-06-07", 27, 83, 4],
          ["2026-06-08", 30, 89, 5],
          ["2026-06-09", 32, 94, 5],
          ["2026-06-10", 34, 99, 5],
          ["2026-06-11", 38, 105, 5],
          ["2026-06-12", 39, 111, 5],
        ],
      },
      {
        id: "cmp-103",
        name: "Retargeting sito",
        status: "PAUSED",
        objective: "Remarketing",
        spend: 126.8,
        impressions: 18400,
        reach: 8100,
        clicks: 511,
        leads: 21,
        purchases: 7,
        revenue: 735,
        daily: [
          ["2026-05-30", 6, 19, 1],
          ["2026-05-31", 7, 21, 1],
          ["2026-06-01", 6, 22, 1],
          ["2026-06-02", 8, 27, 1],
          ["2026-06-03", 8, 30, 1],
          ["2026-06-04", 9, 33, 2],
          ["2026-06-05", 10, 36, 2],
          ["2026-06-06", 11, 41, 2],
          ["2026-06-07", 11, 44, 2],
          ["2026-06-08", 12, 47, 2],
          ["2026-06-09", 13, 51, 2],
          ["2026-06-10", 14, 53, 2],
          ["2026-06-11", 15, 55, 2],
          ["2026-06-12", 16, 62, 3],
        ],
      },
    ],
  },
};

let currentClient = clients[0];
let currentFullReport = fallbackReports[currentClient.id];
let currentReport = fallbackReports[currentClient.id];
let activeChartMetric = "spend";
let currentConnectionMode = "mock";
let selectedCampaignId = "all";

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatNumber(value) {
  return new Intl.NumberFormat("it-IT").format(Math.round(Number(value) || 0));
}

function formatDecimal(value, digits = 2) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeDaily(item) {
  if (Array.isArray(item)) {
    return {
      date: item[0],
      spend: Number(item[1]) || 0,
      clicks: Number(item[2]) || 0,
      leads: Number(item[3]) || 0,
      impressions: Number(item[4]) || 0,
      reach: Number(item[5]) || 0,
      likes: Number(item[6]) || 0,
      comments: Number(item[7]) || 0,
      shares: Number(item[8]) || 0,
      purchases: Number(item[9]) || 0,
      revenue: Number(item[10]) || 0,
      followersGained: Number(item[11]) || 0,
      followersLost: Number(item[12]) || 0,
    };
  }

  return {
    date: item.date || item.date_start || "",
    spend: Number(item.spend) || 0,
    impressions: Number(item.impressions) || 0,
    reach: Number(item.reach) || 0,
    clicks: Number(item.clicks) || 0,
    likes: Number(item.likes || item.post_reactions || item.reactions) || 0,
    comments: Number(item.comments) || 0,
    shares: Number(item.shares) || 0,
    leads: Number(item.leads || item.lead || item.actions_lead) || 0,
    purchases: Number(item.purchases || item.purchase) || 0,
    revenue: Number(item.revenue || item.purchase_value) || 0,
    followersGained: Number(item.followersGained || item.followers_gained || item.follows) || 0,
    followersLost: Number(item.followersLost || item.followers_lost || item.unfollows) || 0,
  };
}

function enrichDailyMetrics(campaign, daily) {
  const spendTotal = daily.reduce((sum, day) => sum + day.spend, 0);
  const clickTotal = daily.reduce((sum, day) => sum + day.clicks, 0);
  const leadTotal = daily.reduce((sum, day) => sum + day.leads, 0);

  return daily.map((day) => {
    const spendWeight = spendTotal > 0 ? day.spend / spendTotal : 0;
    const clickWeight = clickTotal > 0 ? day.clicks / clickTotal : spendWeight;
    const leadWeight = leadTotal > 0 ? day.leads / leadTotal : clickWeight;
    const impressions = day.impressions || Math.round(campaign.impressions * clickWeight);
    const reach = day.reach || Math.round(campaign.reach * clickWeight);
    const likes = day.likes || Math.round(day.clicks * 0.32 + day.leads * 1.6);
    const comments = day.comments || Math.round(day.leads * 0.42 + day.clicks * 0.015);
    const shares = day.shares || Math.round(likes * 0.13);
    const followersGained = day.followersGained || Math.round(day.leads * 0.32 + day.clicks * 0.018);
    const followersLost = day.followersLost || Math.round(day.clicks * 0.006);

    return {
      ...day,
      impressions,
      reach,
      likes,
      comments,
      shares,
      followersGained,
      followersLost,
      purchases: day.purchases || Math.round(campaign.purchases * leadWeight),
      revenue: day.revenue || Number((campaign.revenue * leadWeight).toFixed(2)),
    };
  });
}

function normalizeCampaign(campaign) {
  const clicks = Number(campaign.clicks) || 0;
  const impressions = Number(campaign.impressions) || 0;
  const spend = Number(campaign.spend) || 0;
  const leads = Number(campaign.leads || campaign.results || 0) || 0;
  const likes = Number(campaign.likes || campaign.post_reactions || campaign.reactions || 0) || 0;
  const comments = Number(campaign.comments || 0) || 0;
  const shares = Number(campaign.shares || 0) || 0;
  const followersGained = Number(campaign.followersGained || campaign.followers_gained || 0) || 0;
  const followersLost = Number(campaign.followersLost || campaign.followers_lost || 0) || 0;
  const normalized = {
    id: campaign.id || campaign.campaign_id || crypto.randomUUID(),
    name: campaign.name || campaign.campaign_name || "Campagna senza nome",
    status: campaign.status || campaign.effective_status || "UNKNOWN",
    objective: campaign.objective || campaign.objective_label || "-",
    spend,
    impressions,
    reach: Number(campaign.reach) || 0,
    clicks,
    likes,
    comments,
    shares,
    followersGained,
    followersLost,
    leads,
    purchases: Number(campaign.purchases || 0) || 0,
    revenue: Number(campaign.revenue || campaign.purchase_value || 0) || 0,
    daily: (campaign.daily || []).map(normalizeDaily),
  };

  return {
    ...normalized,
    daily: enrichDailyMetrics(normalized, normalized.daily),
  };
}

function getDateBounds(report) {
  const dates = report.campaigns
    .flatMap((campaign) => campaign.daily.map((day) => day.date))
    .filter(Boolean)
    .sort();

  return {
    min: dates[0] || "",
    max: dates[dates.length - 1] || "",
  };
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value, amount) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return isoDate(date);
}

function getQuickRange(report, period) {
  const bounds = getDateBounds(report);
  const max = report?.date_stop || bounds.max || mockDateRange.to || isoDate(new Date());
  const maxDate = new Date(`${max}T00:00:00`);

  if (period === "last_7d") {
    return { from: addDays(max, -6), to: max };
  }

  if (period === "this_month") {
    return { from: `${max.slice(0, 7)}-01`, to: max };
  }

  if (period === "last_month") {
    const firstOfThisMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    const lastOfPreviousMonth = new Date(firstOfThisMonth);
    lastOfPreviousMonth.setDate(0);
    const firstOfPreviousMonth = new Date(
      lastOfPreviousMonth.getFullYear(),
      lastOfPreviousMonth.getMonth(),
      1
    );
    return { from: isoDate(firstOfPreviousMonth), to: isoDate(lastOfPreviousMonth) };
  }

  return { from: addDays(max, -29), to: max };
}

function syncDateInputsFromPeriod(report) {
  if (periodSelect.value === "custom") return;
  const range = getQuickRange(report, periodSelect.value);
  dateFrom.value = range.from;
  dateTo.value = range.to;
}

function getSelectedRange() {
  const from = dateFrom.value;
  const to = dateTo.value || from;

  if (!from && !to) return { from: "", to: "" };
  if (from && to && from > to) return { from: to, to: from };
  return { from, to };
}

function getCampaignForRange(campaign, range) {
  const selectedDaily = campaign.daily.filter((day) => {
    if (range.from && day.date < range.from) return false;
    if (range.to && day.date > range.to) return false;
    return true;
  });

  if (campaign.daily.length === 0) return campaign;

  return selectedDaily.reduce(
    (acc, day) => {
      acc.spend += day.spend;
      acc.impressions += day.impressions;
      acc.reach += day.reach;
      acc.clicks += day.clicks;
      acc.likes += day.likes;
      acc.comments += day.comments;
      acc.shares += day.shares;
      acc.followersGained += day.followersGained;
      acc.followersLost += day.followersLost;
      acc.leads += day.leads;
      acc.purchases += day.purchases;
      acc.revenue += day.revenue;
      return acc;
    },
    {
      ...campaign,
      spend: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      followersGained: 0,
      followersLost: 0,
      leads: 0,
      purchases: 0,
      revenue: 0,
      daily: selectedDaily,
    }
  );
}

function getFilteredReport(report) {
  const range = getSelectedRange();
  const dateFilteredCampaigns = report.campaigns.map((campaign) =>
    getCampaignForRange(campaign, range)
  );

  return {
    ...report,
    campaigns:
      selectedCampaignId === "all"
        ? dateFilteredCampaigns
        : dateFilteredCampaigns.filter((campaign) => campaign.id === selectedCampaignId),
  };
}

function normalizeReport(payload, fallback) {
  const sourceCampaigns = payload?.campaigns || payload?.data || fallback.campaigns;

  return {
    updatedAt: payload?.updatedAt || payload?.updated_time || new Date().toISOString(),
    date_start: payload?.date_start || fallback?.date_start || mockDateRange.from,
    date_stop: payload?.date_stop || fallback?.date_stop || mockDateRange.to,
    campaigns: sourceCampaigns.map(normalizeCampaign),
  };
}

function getTotals(report) {
  const totals = report.campaigns.reduce(
    (acc, campaign) => {
      acc.spend += campaign.spend;
      acc.impressions += campaign.impressions;
      acc.reach += campaign.reach;
      acc.clicks += campaign.clicks;
      acc.likes += campaign.likes;
      acc.comments += campaign.comments;
      acc.shares += campaign.shares;
      acc.followersGained += campaign.followersGained;
      acc.followersLost += campaign.followersLost;
      acc.leads += campaign.leads;
      acc.purchases += campaign.purchases;
      acc.revenue += campaign.revenue;
      return acc;
    },
    {
      spend: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      followersGained: 0,
      followersLost: 0,
      leads: 0,
      purchases: 0,
      revenue: 0,
    }
  );

  totals.ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
  totals.cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
  totals.cpl = totals.leads > 0 ? totals.spend / totals.leads : 0;
  totals.roas = totals.spend > 0 ? totals.revenue / totals.spend : 0;
  totals.engagement = totals.likes + totals.comments + totals.shares;
  totals.engagementRate =
    totals.reach > 0 ? (totals.engagement / totals.reach) * 100 : 0;
  totals.netFollowers = totals.followersGained - totals.followersLost;
  return totals;
}

function aggregateDaily(report, limit = 14) {
  const byDate = new Map();

  report.campaigns.forEach((campaign) => {
    campaign.daily.forEach((day) => {
      const current = byDate.get(day.date) || {
        date: day.date,
        spend: 0,
        clicks: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        leads: 0,
        impressions: 0,
        reach: 0,
        followersGained: 0,
        followersLost: 0,
      };
      current.spend += day.spend;
      current.clicks += day.clicks;
      current.likes += day.likes;
      current.comments += day.comments;
      current.shares += day.shares;
      current.leads += day.leads;
      current.impressions += day.impressions;
      current.reach += day.reach;
      current.followersGained += day.followersGained;
      current.followersLost += day.followersLost;
      byDate.set(day.date, current);
    });
  });

  const days = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  return limit ? days.slice(-limit) : days;
}

function renderCampaignOptions(report) {
  const activeCampaignsList = report.campaigns.filter((campaign) => campaign.status === "ACTIVE");
  const hasSelectedCampaign = activeCampaignsList.some(
    (campaign) => campaign.id === selectedCampaignId
  );

  if (selectedCampaignId !== "all" && !hasSelectedCampaign) {
    selectedCampaignId = "all";
  }

  campaignSelect.innerHTML = [
    '<option value="all">Tutte le campagne</option>',
    ...activeCampaignsList.map(
      (campaign) => `<option value="${escapeHtml(campaign.id)}">${escapeHtml(campaign.name)}</option>`
    ),
  ].join("");
  campaignSelect.value = selectedCampaignId;
}

function renderStatus(mode, detail) {
  currentConnectionMode = mode;
  connectionDot.classList.toggle("is-live", mode === "live");
  connectionDot.classList.toggle("is-error", mode === "error");

  if (mode === "mock") {
    connectionDot.classList.add("is-live");
    connectionDot.classList.remove("is-error");
    connectionLabel.textContent = "Dati demo";
    connectionDetail.textContent =
      detail || "Report dimostrativo con valori simulati.";
    return;
  }

  if (mode === "live") {
    connectionLabel.textContent = "Dati aggiornati";
    connectionDetail.textContent = detail || "Report aggiornato.";
    return;
  }

  if (mode === "error") {
    connectionLabel.textContent = "Dati demo";
    connectionDetail.textContent = detail || "Report dimostrativo con valori simulati.";
    return;
  }

  connectionLabel.textContent = "Dati demo";
  connectionDetail.textContent = detail || "Report dimostrativo con valori simulati.";
}

function renderMetrics(totals) {
  const cards = [
    ["Spesa", formatCurrency(totals.spend), "Budget investito nel periodo"],
    ["Impression", formatNumber(totals.impressions), `${formatNumber(totals.reach)} persone raggiunte`],
    ["Click", formatNumber(totals.clicks), `CTR ${formatDecimal(totals.ctr)}%`],
    ["Like", formatNumber(totals.likes), `${formatNumber(totals.engagement)} interazioni totali`],
    ["Commenti", formatNumber(totals.comments), `${formatNumber(totals.shares)} condivisioni`],
    ["CPC medio", formatCurrency(totals.cpc), "Costo medio per click"],
    ["Lead", formatNumber(totals.leads), `CPL ${formatCurrency(totals.cpl)}`],
    ["Acquisti", formatNumber(totals.purchases), `${formatCurrency(totals.revenue)} valore tracciato`],
    ["ROAS", `${formatDecimal(totals.roas, 1)}x`, "Ricavi / spesa adv"],
    [
      "Conversion rate",
      `${formatDecimal(totals.clicks > 0 ? (totals.leads / totals.clicks) * 100 : 0)}%`,
      "Lead generati sui click",
    ],
  ];

  metricGrid.innerHTML = cards
    .map(
      ([label, value, note]) => `
        <article class="metric-card">
          <div>
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
          <small>${escapeHtml(note)}</small>
        </article>
      `
    )
    .join("");
}

function renderCampaigns(report) {
  campaignTable.innerHTML = report.campaigns
    .map((campaign) => {
      const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
      const cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0;
      const paused = campaign.status !== "ACTIVE";

      return `
        <tr>
          <td><strong>${escapeHtml(campaign.name)}</strong><span>${escapeHtml(campaign.id)}</span></td>
          <td>${escapeHtml(campaign.objective)}</td>
          <td>${formatCurrency(campaign.spend)}</td>
          <td>${formatNumber(campaign.reach)}</td>
          <td>${formatDecimal(ctr)}%</td>
          <td>${formatCurrency(cpc)}</td>
          <td>${formatNumber(campaign.likes)}</td>
          <td>${formatNumber(campaign.leads)}</td>
          <td><span class="badge ${paused ? "is-paused" : ""}">${escapeHtml(campaign.status)}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderEngagement(totals, report) {
  const days = aggregateDaily(report, 0);
  const averageEngagement =
    days.length > 0 ? totals.engagement / days.length : 0;
  const averageRate =
    days.length > 0
      ? days.reduce((sum, day) => {
          const interactions = day.likes + day.comments + day.shares;
          return sum + (day.reach > 0 ? (interactions / day.reach) * 100 : 0);
        }, 0) / days.length
      : 0;

  const cards = [
    ["Engagement rate", `${formatDecimal(totals.engagementRate)}%`, "Interazioni / persone raggiunte"],
    ["Interazioni totali", formatNumber(totals.engagement), "Like, commenti e condivisioni"],
    ["Media giornaliera", formatNumber(averageEngagement), "Interazioni medie nel periodo"],
    ["ER medio giorno", `${formatDecimal(averageRate)}%`, "Media dei giorni selezionati"],
  ];

  engagementGrid.innerHTML = cards
    .map(
      ([label, value, note]) => `
        <article class="engagement-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </article>
      `
    )
    .join("");
}

function renderChart(report) {
  const days = aggregateDaily(report);
  const max = Math.max(...days.map((day) => day[activeChartMetric]), 1);

  barChart.innerHTML = days
    .map((day) => {
      const value = day[activeChartMetric];
      const height = Math.max(4, (value / max) * 100);
      const date = new Date(`${day.date}T00:00:00`);
      const label = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit" }).format(date);

      return `
        <div class="bar" title="${escapeHtml(String(value))}">
          <div class="bar-fill" style="height: ${height}%"></div>
          <small>${label}</small>
        </div>
      `;
    })
    .join("");
}

function renderFollowerChart(report) {
  const days = aggregateDaily(report, 31);
  const max = Math.max(
    ...days.map((day) => Math.max(day.followersGained, day.followersLost)),
    1
  );

  followerChart.style.setProperty("--follower-columns", days.length || 1);
  followerChart.innerHTML = days
    .map((day) => {
      const gainedHeight = Math.max(4, (day.followersGained / max) * 100);
      const lostHeight = Math.max(4, (day.followersLost / max) * 100);
      const net = day.followersGained - day.followersLost;
      const date = new Date(`${day.date}T00:00:00`);
      const label = new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "2-digit",
      }).format(date);

      return `
        <div class="follower-day" title="+${formatNumber(day.followersGained)} / -${formatNumber(day.followersLost)} follower">
          <span class="follower-value is-gain">+${formatNumber(day.followersGained)}</span>
          <div class="follower-bars">
            <div class="follower-bar is-gain" style="height: ${gainedHeight}%"></div>
            <div class="follower-baseline"></div>
            <div class="follower-bar is-loss" style="height: ${lostHeight}%"></div>
          </div>
          <span class="follower-value is-net">${net >= 0 ? "+" : ""}${formatNumber(net)}</span>
          <small>${label}</small>
        </div>
      `;
    })
    .join("");
}

function renderDashboard(mode = "demo", detail = "") {
  const totals = getTotals(currentReport);
  const active = currentReport.campaigns.filter((campaign) => campaign.status === "ACTIVE").length;

  clientTitle.textContent = currentClient.name;
  clientDescription.textContent = currentClient.description;
  accessClient.textContent = currentClient.name;
  clientInitials.textContent = initials(currentClient.name);
  updatedAt.textContent = formatDateTime(currentReport.updatedAt);
  activeCampaigns.textContent = active;
  metaAccount.textContent = currentClient.metaAccount;
  selectedRange.textContent =
    getSelectedRange().from === getSelectedRange().to
      ? formatDate(getSelectedRange().from)
      : `${formatDate(getSelectedRange().from)} - ${formatDate(getSelectedRange().to)}`;

  renderStatus(mode, detail);
  renderMetrics(totals);
  renderEngagement(totals, currentReport);
  renderCampaigns(currentReport);
  renderChart(currentReport);
  renderFollowerChart(currentReport);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, digits = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(digits));
}

function seededRatio(seed) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  const value = Math.sin(Math.abs(hash)) * 10000;
  return value - Math.floor(value);
}

function seededFloat(seed, min, max, digits = 2) {
  return Number((seededRatio(seed) * (max - min) + min).toFixed(digits));
}

function listDates(from, to) {
  const dates = [];
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to || from}T00:00:00`);

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    dates.push(isoDate(date));
  }

  return dates;
}

function buildRandomDailySeries(campaign, range) {
  const safeRange = {
    from: range.from || mockDateRange.from,
    to: range.to || range.from || mockDateRange.to,
  };
  const dates = listDates(safeRange.from, safeRange.to);
  const baseClicks = Math.max(18, Math.round((campaign.clicks || 800) / 18));
  const baseSpend = Math.max(7, (campaign.spend || 300) / 18);

  return dates.map((date, index) => {
    const seed = `${campaign.id}-${date}`;
    const month = new Date(`${date}T00:00:00`).getMonth() + 1;
    const monthBoost = month === 4 ? 0.82 : month === 5 ? 1 : month === 6 ? 1.18 : 0.9;
    const weekendBoost = [5, 6].includes(new Date(`${date}T00:00:00`).getDay()) ? 1.25 : 1;
    const trendBoost = 1 + index * 0.004;
    const clicks = Math.max(
      8,
      Math.round(
        baseClicks *
          seededFloat(`${seed}-clicks`, 0.65, 1.45) *
          monthBoost *
          weekendBoost *
          trendBoost
      )
    );
    const cpc = seededFloat(`${seed}-cpc`, 0.18, 0.74);
    const spend = Number((clicks * cpc).toFixed(2));
    const impressions = Math.round(clicks * seededFloat(`${seed}-impressions`, 34, 78));
    const reach = Math.round(impressions * seededFloat(`${seed}-reach`, 0.45, 0.78));
    const likes = Math.round(clicks * seededFloat(`${seed}-likes`, 0.22, 0.58));
    const comments = Math.max(0, Math.round(likes * seededFloat(`${seed}-comments`, 0.04, 0.16)));
    const shares = Math.max(0, Math.round(likes * seededFloat(`${seed}-shares`, 0.03, 0.13)));
    const leads = Math.max(0, Math.round(clicks * seededFloat(`${seed}-leads`, 0.035, 0.105)));
    const followersGained = Math.max(
      1,
      Math.round(
        leads * seededFloat(`${seed}-followers-leads`, 0.25, 0.62) +
          likes * seededFloat(`${seed}-followers-likes`, 0.018, 0.07)
      )
    );
    const followersLost = Math.max(
      0,
      Math.round(
        followersGained * seededFloat(`${seed}-followers-lost`, 0.12, 0.48) +
          clicks * seededFloat(`${seed}-followers-clicks`, 0.001, 0.009)
      )
    );
    const purchases =
      campaign.purchases > 0
        ? Math.max(0, Math.round(leads * seededFloat(`${seed}-purchases`, 0.08, 0.28)))
        : 0;
    const revenue =
      purchases > 0
        ? Number((purchases * seededFloat(`${seed}-revenue`, 55, 210)).toFixed(2))
        : 0;

    return {
      date,
      spend: Math.max(spend, seededFloat(`${seed}-spend`, baseSpend * 0.45, baseSpend * 0.75)),
      impressions,
      reach,
      clicks,
      likes,
      comments,
      shares,
      followersGained,
      followersLost,
      leads,
      purchases,
      revenue,
    };
  });
}

function summarizeRandomCampaign(campaign, range) {
  const daily = buildRandomDailySeries(campaign, range);
  const totals = daily.reduce(
    (acc, day) => {
      acc.spend += day.spend;
      acc.impressions += day.impressions;
      acc.reach += day.reach;
      acc.clicks += day.clicks;
      acc.likes += day.likes;
      acc.comments += day.comments;
      acc.shares += day.shares;
      acc.followersGained += day.followersGained;
      acc.followersLost += day.followersLost;
      acc.leads += day.leads;
      acc.purchases += day.purchases;
      acc.revenue += day.revenue;
      return acc;
    },
    {
      spend: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      followersGained: 0,
      followersLost: 0,
      leads: 0,
      purchases: 0,
      revenue: 0,
    }
  );

  return {
    ...campaign,
    ...totals,
    spend: Number(totals.spend.toFixed(2)),
    revenue: Number(totals.revenue.toFixed(2)),
    daily,
  };
}

function buildRandomMockReport(clientId, range) {
  const fallback = fallbackReports[clientId] || fallbackReports[clients[0].id];

  return {
    ...fallback,
    clientId,
    mode: "mock",
    date_start: range.from,
    date_stop: range.to,
    updatedAt: new Date().toISOString(),
    campaigns: fallback.campaigns.map((campaign) => summarizeRandomCampaign(campaign, range)),
  };
}

function mockMetaInsightsRequest(clientId, range) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(buildRandomMockReport(clientId, range));
    }, 260);
  });
}

async function loadReport() {
  const fallback = fallbackReports[currentClient.id];
  const range = getEndpointRange();
  if (periodSelect.value !== "custom") {
    dateFrom.value = range.from;
    dateTo.value = range.to;
  }
  const endpoint = `${currentClient.endpoint}?client=${encodeURIComponent(
    currentClient.id
  )}&period=${encodeURIComponent(periodSelect.value)}&date_start=${encodeURIComponent(
    range.from
  )}&date_stop=${encodeURIComponent(range.to)}`;

  if (useMockMetaApi) {
    const payload = await mockMetaInsightsRequest(currentClient.id, range);
    currentFullReport = normalizeReport(payload, fallback);
    syncDateInputsFromPeriod(currentFullReport);
    renderCampaignOptions(currentFullReport);
    currentReport = getFilteredReport(currentFullReport);
    renderDashboard("mock", "Report dimostrativo con dati simulati.");
    return;
  }

  try {
    const response = await fetch(endpoint, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || `Meta API HTTP ${response.status}`);
    }

    if (!Array.isArray(payload.campaigns) || payload.campaigns.length === 0) {
      throw new Error("Meta ha risposto, ma non ci sono campagne nel periodo selezionato.");
    }

    currentFullReport = normalizeReport(payload, fallback);
    syncDateInputsFromPeriod(currentFullReport);
    renderCampaignOptions(currentFullReport);
    currentReport = getFilteredReport(currentFullReport);
    renderDashboard("live", "Report aggiornato.");
  } catch (error) {
    const fallbackPayload = buildRandomMockReport(currentClient.id, range);
    currentFullReport = normalizeReport(fallbackPayload, fallback);
    syncDateInputsFromPeriod(currentFullReport);
    renderCampaignOptions(currentFullReport);
    currentReport = getFilteredReport(currentFullReport);
    renderDashboard("error", `${error.message} Visualizzo dati demo.`);
  }
}

function initializeReport() {
  currentClient = clients[0];
  fixedClientName.textContent = currentClient.name;
  selectedCampaignId = "all";
  currentFullReport = normalizeReport(fallbackReports[currentClient.id], fallbackReports[currentClient.id]);
  syncDateInputsFromPeriod(currentFullReport);
  renderCampaignOptions(currentFullReport);
  currentReport = getFilteredReport(currentFullReport);
  loadReport();
}

function getEndpointRange() {
  const fallback = fallbackReports[currentClient.id];
  const referenceReport = currentFullReport || normalizeReport(fallback, fallback);

  if (periodSelect.value !== "custom") {
    return getQuickRange(referenceReport, periodSelect.value);
  }

  return getSelectedRange();
}

function exportCurrentCsv() {
  const rows = [
    [
      "campagna",
      "obiettivo",
      "stato",
      "spesa",
      "impression",
      "reach",
      "click",
      "like",
      "commenti",
      "condivisioni",
      "lead",
      "acquisti",
      "ricavi",
    ],
    ...currentReport.campaigns.map((campaign) => [
      campaign.name,
      campaign.objective,
      campaign.status,
      campaign.spend,
      campaign.impressions,
      campaign.reach,
      campaign.clicks,
      campaign.likes,
      campaign.comments,
      campaign.shares,
      campaign.leads,
      campaign.purchases,
      campaign.revenue,
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const campaignSlug = selectedCampaignId === "all" ? "tutte-campagne" : selectedCampaignId;
  link.download = `report-social-${currentClient.id}-${campaignSlug}-${periodSelect.value}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

initializeReport();

campaignSelect.addEventListener("change", () => {
  selectedCampaignId = campaignSelect.value;
  currentReport = getFilteredReport(currentFullReport);
  renderDashboard(currentConnectionMode);
});
periodSelect.addEventListener("change", loadReport);
refreshData.addEventListener("click", loadReport);
applyDateFilter.addEventListener("click", () => {
  periodSelect.value = "custom";
  loadReport();
});
exportCsv.addEventListener("click", exportCurrentCsv);

chartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeChartMetric = button.dataset.chartMetric;
    chartButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderChart(currentReport);
  });
});
