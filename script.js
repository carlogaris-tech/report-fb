const clientSelect = document.querySelector("#clientSelect");
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
const scoreValue = document.querySelector("#scoreValue");
const scoreRing = document.querySelector(".score-ring");
const budgetScoreBar = document.querySelector("#budgetScore");
const trafficScoreBar = document.querySelector("#trafficScore");
const conversionScoreBar = document.querySelector("#conversionScore");
const barChart = document.querySelector("#barChart");
const chartButtons = Array.from(document.querySelectorAll("[data-chart-metric]"));
const recommendations = document.querySelector("#recommendations");
const exportCsv = document.querySelector("#exportCsv");
const copySummary = document.querySelector("#copySummary");
const endpointExample = document.querySelector("#endpointExample");

const useMockMetaApi = true;

const clients = [
  {
    id: "ristorante-la-piazza",
    name: "Ristorante La Piazza",
    description:
      "Campagne locali per prenotazioni, coperti nel weekend e promozione menu stagionali.",
    metaAccount: "act_123456789",
    endpoint: "/api/meta-insights",
  },
  {
    id: "hotel-belvedere",
    name: "Hotel Belvedere",
    description:
      "Campagne Instagram e Facebook per richieste soggiorno, offerte family e traffico verso landing.",
    metaAccount: "act_987654321",
    endpoint: "/api/meta-insights",
  },
  {
    id: "officina-demo",
    name: "Officina.tech Demo",
    description:
      "Vista dimostrativa per presentare reportistica, KPI e integrazione Meta Ads ai clienti.",
    metaAccount: "act_demo",
    endpoint: "/api/meta-insights",
  },
];

const fallbackReports = {
  "ristorante-la-piazza": {
    updatedAt: "2026-06-12T08:45:00.000Z",
    campaigns: [
      {
        id: "cmp-101",
        name: "Prenotazioni weekend",
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
        name: "Menu degustazione",
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
        name: "Retargeting visitatori sito",
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
  "hotel-belvedere": {
    updatedAt: "2026-06-12T07:50:00.000Z",
    campaigns: [
      {
        id: "cmp-201",
        name: "Estate in famiglia",
        status: "ACTIVE",
        objective: "Lead generation",
        spend: 1285.1,
        impressions: 176200,
        reach: 91200,
        clicks: 3180,
        leads: 188,
        purchases: 0,
        revenue: 0,
        daily: [
          ["2026-05-30", 48, 122, 6],
          ["2026-05-31", 54, 136, 8],
          ["2026-06-01", 57, 144, 8],
          ["2026-06-02", 62, 153, 9],
          ["2026-06-03", 66, 164, 10],
          ["2026-06-04", 70, 171, 11],
          ["2026-06-05", 74, 184, 12],
          ["2026-06-06", 82, 198, 14],
          ["2026-06-07", 88, 214, 15],
          ["2026-06-08", 92, 228, 16],
          ["2026-06-09", 96, 235, 17],
          ["2026-06-10", 100, 244, 18],
          ["2026-06-11", 106, 257, 20],
          ["2026-06-12", 110, 270, 22],
        ],
      },
      {
        id: "cmp-202",
        name: "Weekend benessere",
        status: "ACTIVE",
        objective: "Conversioni",
        spend: 934.6,
        impressions: 104300,
        reach: 50240,
        clicks: 2054,
        leads: 92,
        purchases: 31,
        revenue: 8650,
        daily: [
          ["2026-05-30", 31, 84, 3],
          ["2026-05-31", 38, 90, 4],
          ["2026-06-01", 42, 99, 4],
          ["2026-06-02", 46, 106, 5],
          ["2026-06-03", 50, 112, 5],
          ["2026-06-04", 55, 121, 6],
          ["2026-06-05", 58, 130, 6],
          ["2026-06-06", 64, 141, 7],
          ["2026-06-07", 68, 149, 7],
          ["2026-06-08", 70, 154, 8],
          ["2026-06-09", 73, 162, 8],
          ["2026-06-10", 76, 170, 9],
          ["2026-06-11", 80, 181, 10],
          ["2026-06-12", 83, 190, 10],
        ],
      },
    ],
  },
  "officina-demo": {
    updatedAt: "2026-06-12T09:15:00.000Z",
    campaigns: [
      {
        id: "cmp-301",
        name: "Demo acquisizione lead",
        status: "ACTIVE",
        objective: "Lead generation",
        spend: 620,
        impressions: 82000,
        reach: 41000,
        clicks: 1540,
        leads: 96,
        purchases: 0,
        revenue: 0,
        daily: [
          ["2026-05-30", 22, 61, 3],
          ["2026-05-31", 25, 66, 4],
          ["2026-06-01", 27, 72, 4],
          ["2026-06-02", 30, 78, 5],
          ["2026-06-03", 32, 84, 5],
          ["2026-06-04", 35, 91, 6],
          ["2026-06-05", 38, 98, 6],
          ["2026-06-06", 42, 107, 7],
          ["2026-06-07", 45, 112, 7],
          ["2026-06-08", 48, 119, 8],
          ["2026-06-09", 51, 126, 8],
          ["2026-06-10", 55, 134, 9],
          ["2026-06-11", 58, 141, 9],
          ["2026-06-12", 62, 151, 10],
        ],
      },
      {
        id: "cmp-302",
        name: "Demo retargeting",
        status: "ACTIVE",
        objective: "Remarketing",
        spend: 210,
        impressions: 28600,
        reach: 12300,
        clicks: 710,
        leads: 34,
        purchases: 12,
        revenue: 1560,
        daily: [
          ["2026-05-30", 8, 24, 1],
          ["2026-05-31", 9, 27, 1],
          ["2026-06-01", 10, 30, 1],
          ["2026-06-02", 11, 34, 2],
          ["2026-06-03", 12, 37, 2],
          ["2026-06-04", 13, 40, 2],
          ["2026-06-05", 14, 43, 2],
          ["2026-06-06", 15, 47, 2],
          ["2026-06-07", 16, 50, 3],
          ["2026-06-08", 17, 53, 3],
          ["2026-06-09", 18, 56, 3],
          ["2026-06-10", 19, 59, 3],
          ["2026-06-11", 20, 62, 3],
          ["2026-06-12", 21, 66, 4],
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

    return {
      ...day,
      impressions,
      reach,
      likes,
      comments,
      shares,
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
  return date.toISOString().slice(0, 10);
}

function addDays(value, amount) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return isoDate(date);
}

function getQuickRange(report, period) {
  const bounds = getDateBounds(report);
  const max = bounds.max || isoDate(new Date());
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
      leads: 0,
      purchases: 0,
      revenue: 0,
      daily: selectedDaily,
    }
  );
}

function getFilteredReport(report) {
  const range = getSelectedRange();

  return {
    ...report,
    campaigns: report.campaigns.map((campaign) => getCampaignForRange(campaign, range)),
  };
}

function normalizeReport(payload, fallback) {
  const sourceCampaigns = payload?.campaigns || payload?.data || fallback.campaigns;

  return {
    updatedAt: payload?.updatedAt || payload?.updated_time || new Date().toISOString(),
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
    totals.impressions > 0 ? (totals.engagement / totals.impressions) * 100 : 0;
  return totals;
}

function getScoreParts(totals) {
  const budget = clamp(100 - totals.cpc * 45 - totals.cpl * 1.4 + totals.roas * 12);
  const traffic = clamp(totals.ctr * 22 + Math.min(30, totals.reach / 2800));
  const conversionRate = totals.clicks > 0 ? (totals.leads / totals.clicks) * 100 : 0;
  const conversion = clamp(conversionRate * 13 + totals.purchases * 2 + totals.roas * 8);

  return {
    budget,
    traffic,
    conversion,
    total: clamp((budget + traffic + conversion) / 3),
  };
}

function aggregateDaily(report) {
  const byDate = new Map();

  report.campaigns.forEach((campaign) => {
    campaign.daily.forEach((day) => {
      const current = byDate.get(day.date) || {
        date: day.date,
        spend: 0,
        clicks: 0,
        likes: 0,
        leads: 0,
      };
      current.spend += day.spend;
      current.clicks += day.clicks;
      current.likes += day.likes;
      current.leads += day.leads;
      byDate.set(day.date, current);
    });
  });

  return Array.from(byDate.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);
}

function renderClientOptions() {
  clientSelect.innerHTML = clients
    .map((client) => `<option value="${client.id}">${escapeHtml(client.name)}</option>`)
    .join("");
}

function renderStatus(mode, detail) {
  currentConnectionMode = mode;
  connectionDot.classList.toggle("is-live", mode === "live");
  connectionDot.classList.toggle("is-error", mode === "error");

  if (mode === "mock") {
    connectionDot.classList.add("is-live");
    connectionDot.classList.remove("is-error");
    connectionLabel.textContent = "API Meta demo";
    connectionDetail.textContent =
      detail || "Chiamata simulata attiva: dati mock pronti per demo cliente.";
    return;
  }

  if (mode === "live") {
    connectionLabel.textContent = "API Meta collegata";
    connectionDetail.textContent = detail || "Dati aggiornati tramite endpoint server.";
    return;
  }

  if (mode === "error") {
    connectionLabel.textContent = "Endpoint non disponibile";
    connectionDetail.textContent = detail || "Uso dati demo finche il proxy Meta non risponde.";
    return;
  }

  connectionLabel.textContent = "Modalita demo";
  connectionDetail.textContent = detail || "Dati dimostrativi, endpoint Meta non configurato.";
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

function renderScore(totals) {
  const scores = getScoreParts(totals);

  scoreValue.textContent = scores.total;
  scoreRing.style.setProperty("--score", scores.total);
  budgetScoreBar.value = scores.budget;
  trafficScoreBar.value = scores.traffic;
  conversionScoreBar.value = scores.conversion;
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

function buildRecommendations(totals, report) {
  const items = [];
  const pausedCampaigns = report.campaigns.filter((campaign) => campaign.status !== "ACTIVE");
  const ctr = totals.ctr;
  const conversionRate = totals.clicks > 0 ? (totals.leads / totals.clicks) * 100 : 0;

  if (ctr < 1.2) {
    items.push("Aggiornare creativita e messaggio: il CTR e sotto soglia, quindi il pubblico vede ma interagisce poco.");
  } else {
    items.push("Il livello di interesse e buono: conviene isolare le creativita migliori e replicarne formato e promessa.");
  }

  if (totals.cpl > 9) {
    items.push("Rivedere segmenti e landing: il costo per lead e alto rispetto al volume generato.");
  } else if (totals.leads > 0) {
    items.push("Il costo per lead e sostenibile: valutare aumento budget graduale sulle campagne con migliore conversione.");
  }

  if (conversionRate < 4 && totals.clicks > 500) {
    items.push("Molti click non diventano lead: controllare form, velocita pagina, tracciamento eventi e coerenza annuncio-landing.");
  }

  if (totals.roas > 2) {
    items.push("Il ritorno tracciato e positivo: mantenere retargeting attivo e separare pubblici caldi da pubblici freddi.");
  }

  if (pausedCampaigns.length > 0) {
    items.push(`Verificare ${pausedCampaigns.length} campagna in pausa prima del prossimo report cliente.`);
  }

  items.push("Nel report mensile aggiungere una nota qualitativa: cosa ha funzionato, cosa cambiamo, quale decisione serve al cliente.");
  return items.slice(0, 5);
}

function renderRecommendations(totals, report) {
  recommendations.innerHTML = buildRecommendations(totals, report)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
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
  endpointExample.textContent = `${currentClient.endpoint}?client=${currentClient.id}&period=${periodSelect.value}&date_start=${getSelectedRange().from}&date_stop=${getSelectedRange().to}`;

  renderStatus(mode, detail);
  renderMetrics(totals);
  renderCampaigns(currentReport);
  renderScore(totals);
  renderChart(currentReport);
  renderRecommendations(totals, currentReport);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, digits = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(digits));
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
  const dates = listDates(range.from, range.to);
  const baseClicks = Math.max(18, Math.round((campaign.clicks || 800) / 18));
  const baseSpend = Math.max(7, (campaign.spend || 300) / 18);

  return dates.map((date, index) => {
    const weekendBoost = [5, 6].includes(new Date(`${date}T00:00:00`).getDay()) ? 1.25 : 1;
    const trendBoost = 1 + index * 0.012;
    const clicks = Math.max(8, Math.round(baseClicks * randomFloat(0.65, 1.45) * weekendBoost * trendBoost));
    const cpc = randomFloat(0.18, 0.74);
    const spend = Number((clicks * cpc).toFixed(2));
    const impressions = Math.round(clicks * randomFloat(34, 78));
    const reach = Math.round(impressions * randomFloat(0.45, 0.78));
    const likes = Math.round(clicks * randomFloat(0.22, 0.58));
    const comments = Math.max(0, Math.round(likes * randomFloat(0.04, 0.16)));
    const shares = Math.max(0, Math.round(likes * randomFloat(0.03, 0.13)));
    const leads = Math.max(0, Math.round(clicks * randomFloat(0.035, 0.105)));
    const purchases = campaign.purchases > 0 ? Math.max(0, Math.round(leads * randomFloat(0.08, 0.28))) : 0;
    const revenue = purchases > 0 ? Number((purchases * randomFloat(55, 210)).toFixed(2)) : 0;

    return {
      date,
      spend: Math.max(spend, randomFloat(baseSpend * 0.45, baseSpend * 0.75)),
      impressions,
      reach,
      clicks,
      likes,
      comments,
      shares,
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
    currentReport = getFilteredReport(currentFullReport);
    renderDashboard("mock", "Chiamata API Meta simulata, pronta per sostituire il mock con il backend reale.");
    return;
  }

  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    currentFullReport = normalizeReport(payload, fallback);
    syncDateInputsFromPeriod(currentFullReport);
    currentReport = getFilteredReport(currentFullReport);
    renderDashboard("live", "Dati caricati dal proxy API Meta.");
  } catch (error) {
    currentFullReport = normalizeReport(fallback, fallback);
    syncDateInputsFromPeriod(currentFullReport);
    currentReport = getFilteredReport(currentFullReport);
    renderDashboard("error", "Il proxy Meta non e ancora attivo: sto mostrando dati demo.");
  }
}

function selectClient(clientId, updateUrl = true) {
  currentClient = clients.find((client) => client.id === clientId) || clients[0];
  clientSelect.value = currentClient.id;
  currentFullReport = normalizeReport(fallbackReports[currentClient.id], fallbackReports[currentClient.id]);
  syncDateInputsFromPeriod(currentFullReport);
  currentReport = getFilteredReport(currentFullReport);

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("cliente", currentClient.id);
    window.history.replaceState({}, "", url);
  }

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
  link.download = `report-social-${currentClient.id}-${periodSelect.value}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function buildClientSummary() {
  const totals = getTotals(currentReport);
  const scores = getScoreParts(totals);
  return [
    `Report campagne Meta - ${currentClient.name}`,
    `Periodo: ${periodSelect.options[periodSelect.selectedIndex].textContent}`,
    `Date consultate: ${formatDate(getSelectedRange().from)} - ${formatDate(getSelectedRange().to)}`,
    `Spesa: ${formatCurrency(totals.spend)}`,
    `Reach: ${formatNumber(totals.reach)}`,
    `Click: ${formatNumber(totals.clicks)} - CTR ${formatDecimal(totals.ctr)}% - CPC ${formatCurrency(totals.cpc)}`,
    `Like: ${formatNumber(totals.likes)} - Commenti: ${formatNumber(totals.comments)} - Condivisioni: ${formatNumber(totals.shares)}`,
    `Lead: ${formatNumber(totals.leads)} - CPL ${formatCurrency(totals.cpl)}`,
    `Indice Officina: ${scores.total}/100`,
    `Prossima azione: ${buildRecommendations(totals, currentReport)[0]}`,
  ].join("\n");
}

async function copyClientSummary() {
  const summary = buildClientSummary();

  try {
    await navigator.clipboard.writeText(summary);
    copySummary.textContent = "Sintesi copiata";
    setTimeout(() => {
      copySummary.textContent = "Copia sintesi cliente";
    }, 1800);
  } catch {
    window.alert(summary);
  }
}

renderClientOptions();

const initialClient = new URLSearchParams(window.location.search).get("cliente") || clients[0].id;
selectClient(initialClient, false);

clientSelect.addEventListener("change", () => selectClient(clientSelect.value));
periodSelect.addEventListener("change", loadReport);
refreshData.addEventListener("click", loadReport);
applyDateFilter.addEventListener("click", () => {
  periodSelect.value = "custom";
  currentReport = getFilteredReport(currentFullReport);
  renderDashboard(currentConnectionMode);
});
exportCsv.addEventListener("click", exportCurrentCsv);
copySummary.addEventListener("click", copyClientSummary);

chartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeChartMetric = button.dataset.chartMetric;
    chartButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderChart(currentReport);
  });
});
