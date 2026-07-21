const DEFAULT_API_VERSION = "v25.0";

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=1800");
  response.end(JSON.stringify(payload));
}

function cleanAdAccountId(value) {
  if (!value) return "";
  return value.startsWith("act_") ? value : `act_${value}`;
}

function firstValue(value) {
  return Array.isArray(value) ? value[0] : value;
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

    if (type === "comment") {
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

function addDailyToCampaign(campaigns, row, campaignMeta) {
  const campaignId = row.campaign_id || row.campaign_name || "unknown";
  const actionTotals = parseActions(row.actions, row.action_values);
  const current =
    campaigns.get(campaignId) ||
    {
      id: campaignId,
      name: row.campaign_name || campaignMeta?.name || "Campagna senza nome",
      status: campaignMeta?.effective_status || campaignMeta?.status || "ACTIVE",
      objective: campaignMeta?.objective || row.objective || "-",
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
      daily: [],
    };

  const day = {
    date: row.date_start,
    spend: Number(row.spend) || 0,
    impressions: Number(row.impressions) || 0,
    reach: Number(row.reach) || 0,
    clicks: Number(row.clicks || row.inline_link_clicks) || 0,
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
  current.likes += day.likes;
  current.comments += day.comments;
  current.shares += day.shares;
  current.leads += day.leads;
  current.purchases += day.purchases;
  current.revenue += day.revenue;
  current.daily.push(day);
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
    const campaignPayload = await fetchMetaJson(campaignUrl);
    const campaignMeta = new Map(
      (campaignPayload.data || []).map((campaign) => [campaign.id, campaign])
    );
    const insightsParams = new URLSearchParams({
      access_token: token,
      level: "campaign",
      time_increment: "1",
      time_range: JSON.stringify({ since: from, until: to }),
      fields:
        "campaign_id,campaign_name,objective,spend,impressions,reach,clicks,inline_link_clicks,actions,action_values,date_start,date_stop",
      limit: "500",
    });
    const insightsPayload = await fetchMetaJson(`${baseUrl}/insights?${insightsParams}`);
    const campaigns = new Map();

    (insightsPayload.data || []).forEach((row) => {
      addDailyToCampaign(campaigns, row, campaignMeta.get(row.campaign_id));
    });

    sendJson(response, 200, {
      mode: "live",
      date_start: from,
      date_stop: to,
      updatedAt: new Date().toISOString(),
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
