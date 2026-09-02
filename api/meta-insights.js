const DEFAULT_API_VERSION = "v25.0";

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function cleanAdAccountId(value) {
  if (!value) return "";
  return value.startsWith("act_") ? value : `act_${value}`;
}

function firstValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function shiftYear(value, amount) {
  const [year, month, day] = value.split("-").map(Number);
  const shifted = new Date(Date.UTC(year + amount, month - 1, day));
  return shifted.toISOString().slice(0, 10);
}

function getPreviousYearRange(from, to) {
  return {
    from: shiftYear(from, -1),
    to: shiftYear(to, -1),
  };
}

function buildInsightParams(token, from, to, level = "") {
  const params = new URLSearchParams({
    access_token: token,
    time_range: JSON.stringify({ since: from, until: to }),
    fields:
      "campaign_id,campaign_name,objective,spend,impressions,reach,clicks,inline_link_clicks,cpc,actions,action_values,date_start,date_stop",
    limit: "500",
  });

  if (level) {
    params.set("level", level);
  }

  return params;
}

function parseActions(actions = [], actionValues = []) {
  const totals = {
    likes: 0,
    comments: 0,
    shares: 0,
    leads: 0,
    purchases: 0,
    revenue: 0,
  };

  actions.forEach((action) => {
    const type = action.action_type || "";
    const value = Number(action.value) || 0;

    if (["post_reaction", "like", "page_engagement"].includes(type)) {
      totals.likes += value;
    }

    if (["comment", "post_comment", "onsite_conversion.post_comment"].includes(type)) {
      totals.comments += value;
    }

    if (["post", "share"].includes(type)) {
      totals.shares += value;
    }

    if (type.includes("lead")) {
      totals.leads += value;
    }

    if (type.includes("purchase")) {
      totals.purchases += value;
    }
  });

  actionValues.forEach((action) => {
    const type = action.action_type || "";
    if (type.includes("purchase")) {
      totals.revenue += Number(action.value) || 0;
    }
  });

  return totals;
}

function emptyTotals() {
  return {
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
  };
}

function parseInsightTotals(row = {}) {
  const actionTotals = parseActions(row.actions, row.action_values);

  return {
    spend: Number(row.spend) || 0,
    impressions: Number(row.impressions) || 0,
    reach: Number(row.reach) || 0,
    clicks: Number(row.clicks || row.inline_link_clicks) || 0,
    cpc: Number(row.cpc) || 0,
    likes: actionTotals.likes,
    comments: actionTotals.comments,
    shares: actionTotals.shares,
    leads: actionTotals.leads,
    purchases: actionTotals.purchases,
    revenue: actionTotals.revenue,
  };
}

async function fetchInsightTotals(insightsBaseUrl, token, from, to, level = "") {
  const params = new URLSearchParams({
    access_token: token,
    time_range: JSON.stringify({ since: from, until: to }),
    fields:
      "spend,impressions,reach,clicks,inline_link_clicks,cpc,actions,action_values,date_start,date_stop",
    limit: "1",
  });

  if (level) {
    params.set("level", level);
  }

  const payload = await fetchMetaJson(`${insightsBaseUrl}/insights?${params}`);
  return parseInsightTotals(payload.data?.[0] || {});
}

function createCampaign(campaignId, row = {}, campaignMeta = null) {
  return {
    id: campaignId,
    name: row.campaign_name || campaignMeta?.name || "Campagna senza nome",
    status: campaignMeta?.effective_status || campaignMeta?.status || "ACTIVE",
    objective: campaignMeta?.objective || row.objective || "-",
    created_time: campaignMeta?.created_time || "",
    updated_time: campaignMeta?.updated_time || "",
    spend: 0,
    impressions: 0,
    reach: 0,
    clicks: 0,
    cpc: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    leads: 0,
    purchases: 0,
    revenue: 0,
    daily: [],
  };
}

function addDailyToCampaign(campaigns, row, campaignMeta, fallbackCampaignId = "") {
  const campaignId = row.campaign_id || campaignMeta?.id || fallbackCampaignId || row.campaign_name || "unknown";
  const actionTotals = parseActions(row.actions, row.action_values);
  const current = campaigns.get(campaignId) || createCampaign(campaignId, row, campaignMeta);

  const day = {
    date: row.date_start,
    spend: Number(row.spend) || 0,
    impressions: Number(row.impressions) || 0,
    reach: Number(row.reach) || 0,
    clicks: Number(row.clicks || row.inline_link_clicks) || 0,
    cpc: Number(row.cpc) || 0,
    likes: actionTotals.likes,
    comments: actionTotals.comments,
    shares: actionTotals.shares,
    leads: actionTotals.leads,
    purchases: actionTotals.purchases,
    revenue: actionTotals.revenue,
  };

  current.spend += day.spend;
  current.impressions += day.impressions;
  current.reach += day.reach;
  current.clicks += day.clicks;
  current.cpc = day.cpc || current.cpc;
  current.likes += day.likes;
  current.comments += day.comments;
  current.shares += day.shares;
  current.leads += day.leads;
  current.purchases += day.purchases;
  current.revenue += day.revenue;
  current.daily.push(day);
  campaigns.set(campaignId, current);
}

function applyPeriodTotalsToCampaign(campaigns, row, campaignMeta, fallbackCampaignId = "") {
  const campaignId = row.campaign_id || campaignMeta?.id || fallbackCampaignId || row.campaign_name || "unknown";
  const actionTotals = parseActions(row.actions, row.action_values);
  const current = campaigns.get(campaignId) || createCampaign(campaignId, row, campaignMeta);

  current.name = row.campaign_name || current.name;
  current.objective = campaignMeta?.objective || row.objective || current.objective;
  current.status = campaignMeta?.effective_status || campaignMeta?.status || current.status;
  current.spend = Number(row.spend) || 0;
  current.impressions = Number(row.impressions) || 0;
  current.reach = Number(row.reach) || 0;
  current.clicks = Number(row.clicks || row.inline_link_clicks) || 0;
  current.cpc = Number(row.cpc) || 0;
  current.likes = actionTotals.likes;
  current.comments = actionTotals.comments;
  current.shares = actionTotals.shares;
  current.leads = actionTotals.leads;
  current.purchases = actionTotals.purchases;
  current.revenue = actionTotals.revenue;
  campaigns.set(campaignId, current);
}

async function fetchMetaJson(url) {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error?.message || `Meta API HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

async function fetchMetaPages(url, maxPages = 12) {
  const pages = [];
  let nextUrl = url;
  let lastPayload = null;
  let pageCount = 0;

  while (nextUrl && pageCount < maxPages) {
    const payload = await fetchMetaJson(nextUrl);
    lastPayload = payload;
    pages.push(...(payload.data || []));
    nextUrl = payload.paging?.next || "";
    pageCount += 1;
  }

  return {
    ...(lastPayload || {}),
    data: pages,
  };
}

function buildDemographicParams(token, from, to) {
  return new URLSearchParams({
    access_token: token,
    level: "campaign",
    time_range: JSON.stringify({ since: from, until: to }),
    fields: "campaign_id,campaign_name,impressions,reach,clicks,spend,cpc",
    breakdowns: "age,gender",
    limit: "500",
  });
}

function normalizeDemographicRow(row = {}) {
  return {
    campaign_id: row.campaign_id || "",
    campaign_name: row.campaign_name || "",
    age: row.age || "Non specificato",
    gender: row.gender || "Non specificato",
    impressions: Number(row.impressions) || 0,
    reach: Number(row.reach) || 0,
    clicks: Number(row.clicks) || 0,
    spend: Number(row.spend) || 0,
    cpc: Number(row.cpc) || 0,
  };
}

export default async function handler(request, response) {
  const token = process.env.META_ACCESS_TOKEN;
  const adAccountId = cleanAdAccountId(process.env.META_AD_ACCOUNT_ID);
  const apiVersion = process.env.META_API_VERSION || DEFAULT_API_VERSION;
  const from = firstValue(request.query.date_start) || firstValue(request.query.from);
  const to = firstValue(request.query.date_stop) || firstValue(request.query.to) || from;

  if (!token || !adAccountId || !from || !to) {
    sendJson(response, 500, {
      mode: "error",
      message: "Configurazione Meta incompleta.",
      campaigns: [],
    });
    return;
  }

  try {
    const baseUrl = `https://graph.facebook.com/${apiVersion}/${adAccountId}`;
    const commonParams = new URLSearchParams({ access_token: token });
    const campaignUrl = `${baseUrl}/campaigns?${new URLSearchParams({
      ...Object.fromEntries(commonParams),
      fields: "id,name,status,effective_status,objective",
      limit: "500",
    })}`;
    const insightsParams = buildInsightParams(token, from, to, "campaign");
    insightsParams.set("time_increment", "1");
    const totalInsightsParams = buildInsightParams(token, from, to, "campaign");
    const demographicParams = buildDemographicParams(token, from, to);

    const [campaignPayload, insightsPayload, totalInsightsPayload, demographicPayload] = await Promise.all([
      fetchMetaPages(campaignUrl),
      fetchMetaPages(`${baseUrl}/insights?${insightsParams}`),
      fetchMetaPages(`${baseUrl}/insights?${totalInsightsParams}`).catch(() => ({ data: [] })),
      fetchMetaPages(`${baseUrl}/insights?${demographicParams}`).catch(() => ({ data: [] })),
    ]);
    const campaignMeta = new Map(
      (campaignPayload.data || []).map((campaign) => [campaign.id, campaign])
    );

    const campaigns = new Map();

    (insightsPayload.data || []).forEach((row) => {
      addDailyToCampaign(campaigns, row, campaignMeta.get(row.campaign_id));
    });

    (totalInsightsPayload.data || []).forEach((row) => {
      applyPeriodTotalsToCampaign(campaigns, row, campaignMeta.get(row.campaign_id));
    });

    const previousRange = getPreviousYearRange(from, to);
    let comparison = null;

    try {
      const [currentTotals, previousTotals] = await Promise.all([
        fetchInsightTotals(baseUrl, token, from, to, "account"),
        fetchInsightTotals(
          baseUrl,
          token,
          previousRange.from,
          previousRange.to,
          "account"
        ),
      ]);

      comparison = {
        date_start: previousRange.from,
        date_stop: previousRange.to,
        current: currentTotals,
        previous: previousTotals,
      };
    } catch {
      comparison = null;
    }

    sendJson(response, 200, {
      mode: "live",
      date_start: from,
      date_stop: to,
      updatedAt: new Date().toISOString(),
      comparison,
      demographics: (demographicPayload.data || []).map(normalizeDemographicRow),
      availableCampaigns: (campaignPayload.data || []).map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status || campaign.effective_status || "ACTIVE",
        effective_status: campaign.effective_status || campaign.status || "ACTIVE",
        objective: campaign.objective || "-",
      })),
      campaigns: Array.from(campaigns.values()).map((campaign) => ({
        ...campaign,
        spend: Number(campaign.spend.toFixed(2)),
        revenue: Number(campaign.revenue.toFixed(2)),
        daily: campaign.daily.sort((a, b) => a.date.localeCompare(b.date)),
      })),
    });
  } catch (error) {
    sendJson(response, 502, {
      mode: "error",
      message: error.message || "Errore durante la lettura dati Meta.",
      campaigns: [],
    });
  }
}
