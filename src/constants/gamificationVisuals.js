export const TIER_THRESHOLDS = [
  { key: "rookie", label: "Rookie", minLifetimeScore: 0 },
  { key: "builder", label: "Builder", minLifetimeScore: 150 },
  { key: "performer", label: "Performer", minLifetimeScore: 400 },
  { key: "achiever", label: "Achiever", minLifetimeScore: 800 },
  { key: "elite", label: "Elite", minLifetimeScore: 1400 },
  { key: "legend", label: "Legend", minLifetimeScore: 2200 },
];

export const BADGE_DEFINITIONS = [
  {
    key: "execution_started",
    category: "activity_momentum",
    title: "Execution Started",
    description: "Log your first meaningful activity.",
  },
  {
    key: "showed_up",
    category: "activity_momentum",
    title: "Showed Up",
    description: "Reach 30+ activity points in a week.",
  },
  {
    key: "funnel_builder",
    category: "activity_momentum",
    title: "Funnel Builder",
    description: "Reach 35+ activity points in a week.",
  },
  {
    key: "momentum_week",
    category: "activity_momentum",
    title: "Momentum Week",
    description: "Log activity and close at least one sale in the week.",
  },
  {
    key: "consistency_wins",
    category: "activity_momentum",
    title: "Consistency Wins",
    description: "Reach a weekly execution score of 70+.",
  },
  {
    key: "first_close",
    category: "sales_achievement",
    title: "First Close",
    description: "Log your first sale.",
  },
  {
    key: "closer",
    category: "sales_achievement",
    title: "Closer",
    description: "Close 2 sales in one week.",
  },
  {
    key: "strong_finisher",
    category: "sales_achievement",
    title: "Strong Finisher",
    description: "Close 3 sales in one week.",
  },
  {
    key: "target_crusher",
    category: "sales_achievement",
    title: "Target Crusher",
    description: "Hit 100% of all weekly targets.",
  },
  {
    key: "sales_momentum",
    category: "sales_achievement",
    title: "Sales Momentum",
    description: "Log at least one sale for 3 consecutive weeks.",
  },
  {
    key: "rising_performer",
    category: "growth_performance",
    title: "Rising Performer",
    description: "Improve your weekly score versus last week.",
  },
  {
    key: "quality_builder",
    category: "growth_performance",
    title: "Quality Builder",
    description: "Maintain strong conversion ratios.",
  },
  {
    key: "execution_machine",
    category: "growth_performance",
    title: "Execution Machine",
    description: "Reach 80+ score for 4 consecutive weeks.",
  },
  {
    key: "role_model_signal",
    category: "growth_performance",
    title: "Role Model Signal",
    description:
      "Earn leadership-style recognition or rank in the top performers.",
  },
];

export const tierImageMap = {
  rookie: require("../../assets/badges/rookie.png"),
  builder: require("../../assets/badges/builder.png"),
  performer: require("../../assets/badges/performer.png"),
  achiever: require("../../assets/badges/achiever.png"),
  elite: require("../../assets/badges/elite.png"),
  legend: require("../../assets/badges/legend.png"),
};

export const badgeImageMap = {
  execution_started: require("../../assets/badges/execution_started.png"),
  showed_up: require("../../assets/badges/showed_up.png"),
  funnel_builder: require("../../assets/badges/funnel_builder.png"),
  momentum_week: require("../../assets/badges/momentum_week.png"),
  consistency_wins: require("../../assets/badges/consistency_wins.png"),
  first_close: require("../../assets/badges/first_close.png"),
  closer: require("../../assets/badges/closer.png"),
  strong_finisher: require("../../assets/badges/strong_finisher.png"),
  target_crusher: require("../../assets/badges/target_crusher.png"),
  sales_momentum: require("../../assets/badges/sales_momentum.png"),
  rising_performer: require("../../assets/badges/rising_performer.png"),
  quality_builder: require("../../assets/badges/quality_builder.png"),
  execution_machine: require("../../assets/badges/execution_machine.png"),
  role_model_signal: require("../../assets/badges/role_model_signal.png"),
};

export const DASHBOARD_SHOWCASE_BADGE_KEYS = [
  "execution_started",
  "showed_up",
  "momentum_week",
  "target_crusher",
];

export const MISSION_SHOWCASE_BADGE_KEYS = {
  daily: ["execution_started", "showed_up", "funnel_builder"],
  weekly: ["momentum_week", "consistency_wins", "target_crusher"],
};

export const getTierMeta = (tierLabelOrKey) => {
  const normalized = String(tierLabelOrKey || "").trim().toLowerCase();
  const tier = TIER_THRESHOLDS.find(
    (item) => item.key === normalized || item.label.toLowerCase() === normalized
  );

  if (!tier) {
    return null;
  }

  return {
    ...tier,
    image: tierImageMap[tier.key] || null,
  };
};

export const getBadgeMeta = (badgeKey, fallbackTitle, fallbackCategory) => {
  const normalized = String(badgeKey || "").trim().toLowerCase();
  const badge = BADGE_DEFINITIONS.find((item) => item.key === normalized);

  return {
    key: normalized || badge?.key,
    title: badge?.title || fallbackTitle || "Badge",
    category: badge?.category || fallbackCategory || "recognition",
    description: badge?.description || "",
    image: badgeImageMap[normalized] || null,
  };
};

export const getBadgesByKeys = (keys = []) =>
  keys.map((key) => getBadgeMeta(key)).filter((item) => item?.key);

export const getLeaderboardBadgeMeta = (rank) => {
  if (rank === 1) {
    return getBadgeMeta("role_model_signal");
  }

  if (rank === 2) {
    return getBadgeMeta("execution_machine");
  }

  if (rank === 3) {
    return getBadgeMeta("rising_performer");
  }

  return getBadgeMeta("consistency_wins");
};

export const getMissionBadgeMeta = (mission, index = 0) => {
  const key = String(mission?.key || "").toLowerCase();
  const metricKey = String(mission?.metricKey || "").toLowerCase();

  if (key.includes("sale") || metricKey.includes("sale")) {
    return getBadgeMeta(mission?.type === "weekly" ? "strong_finisher" : "first_close");
  }

  if (key.includes("presentation") || metricKey.includes("presentation")) {
    return getBadgeMeta("quality_builder");
  }

  if (key.includes("appointment") || metricKey.includes("appointment")) {
    return getBadgeMeta(mission?.type === "weekly" ? "consistency_wins" : "showed_up");
  }

  if (key.includes("prospect") || metricKey.includes("prospect")) {
    return getBadgeMeta(mission?.type === "weekly" ? "momentum_week" : "execution_started");
  }

  const fallbackKeys =
    mission?.type === "weekly"
      ? MISSION_SHOWCASE_BADGE_KEYS.weekly
      : MISSION_SHOWCASE_BADGE_KEYS.daily;

  return getBadgeMeta(fallbackKeys[index % fallbackKeys.length]);
};
