export const MODULE_KEYS = {
  LEAP: "LEAP",
  QUEST: "QUEST",
};

export const GITSA_BRAND = {
  name: "GITSA",
  logo: require("../../assets/gitsaLogo.png"),
  colors: {
    background: "#3871c1",
    secondary: "#FFFFFF",
    white: "#ffffff",
    surface: "#ffffff",
    accent: "#f7a11f",
    accentLight: "#ffca08",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#60a5fa",
    border: "rgba(255, 255, 255, 0.2)",
    textPrimary: "#0f172a",
    textMuted: "#64748b",
    textOnPrimary: "#ffffff",
  },
};

export const MODULE_CONFIGS = {
  [MODULE_KEYS.LEAP]: {
    key: MODULE_KEYS.LEAP,
    label: "LEAP",
    subtitle: "Real-Time Activity. Real Results.",
    lockedMessage: "You're not enrolled in this module.",
    colors: {
      background: "#3871c1",
      secondary: "#FFFFFF",
      white: "#ffffff",
      surface: "#ffffff",
      accent: "#f7a11f",
      accentLight: "#ffca08",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      info: "#60a5fa",
      border: "rgba(255, 255, 255, 0.2)",
      textPrimary: "#0f172a",
      textMuted: "#64748b",
      textOnPrimary: "#ffffff",
    },
    drawerColors: {
      accent: "#f7a11f",
      accentLight: "#ffc107",
      gradientStart: "#3871c1",
      gradientMiddle: "#2d5a9e",
      gradientEnd: "#1e3a5f",
      success: "#10b981",
      danger: "#ef4444",
    },
    assets: {
      logo: require("../../assets/logo.png"),
      welcome: require("../../assets/welcome.png"),
      goal: require("../../assets/goal1.png"),
      achieved: require("../../assets/achieved1.png"),
      homeCards: {
        salesBg: require("../../assets/1.png"),
        salesFg: require("../../assets/1a.png"),
        coachBg: require("../../assets/2.png"),
        coachFg: require("../../assets/2a.png"),
        masterclassBg: require("../../assets/3.png"),
        masterclassFg: require("../../assets/3a.png"),
      },
    },
  },
  [MODULE_KEYS.QUEST]: {
    key: MODULE_KEYS.QUEST,
    label: "QUEST",
    subtitle: "Real-Time Pipeline. Real Growth.",
    lockedMessage: "You're not enrolled in this module.",
    colors: {
      background: "#3f8e9c",
      secondary: "#FFFFFF",
      white: "#ffffff",
      surface: "#ffffff",
      accent: "#f7a11f",
      accentLight: "#ffca08",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      info: "#60a5fa",
      border: "rgba(255, 255, 255, 0.2)",
      textPrimary: "#0f172a",
      textMuted: "#64748b",
      textOnPrimary: "#ffffff",
    },
    drawerColors: {
      accent: "#f7a11f",
      accentLight: "#ffc107",
      gradientStart: "#3f8e9c",
      gradientMiddle: "#3f8e9c",
      gradientEnd: "#3f8e9c",
      success: "#10b981",
      danger: "#ef4444",
    },
    assets: {
      logo: require("../../assets/quest/logo.png"),
      welcome: require("../../assets/quest/welcome.png"),
      goal: require("../../assets/quest/goal1.png"),
      achieved: require("../../assets/quest/achieved1.png"),
      homeCards: {
        salesBg: require("../../assets/quest/1.png"),
        salesFg: require("../../assets/quest/1a.png"),
        coachBg: require("../../assets/quest/2.png"),
        coachFg: require("../../assets/quest/2a.png"),
        masterclassBg: require("../../assets/quest/3.png"),
        masterclassFg: require("../../assets/quest/3a.png"),
      },
    },
  },
};

export const getModuleConfig = (moduleKey) =>
  MODULE_CONFIGS[moduleKey] || MODULE_CONFIGS[MODULE_KEYS.LEAP];

export const normalizeEnabledModules = (enabledModules = []) => {
  if (!Array.isArray(enabledModules)) {
    return [];
  }

  return enabledModules
    .map((moduleKey) => String(moduleKey || "").trim().toUpperCase())
    .filter((moduleKey) => Object.values(MODULE_KEYS).includes(moduleKey));
};

export const getEnabledModulesForUser = (user) =>
  normalizeEnabledModules(user?.enabledModules);

export const isModuleEnabled = (enabledModules = [], moduleKey) =>
  normalizeEnabledModules(enabledModules).includes(
    String(moduleKey || "").trim().toUpperCase()
  );

export const userHasModuleAccess = (user, moduleKey) =>
  isModuleEnabled(getEnabledModulesForUser(user), moduleKey);

export const getFirstEnabledModuleForUser = (user) =>
  getEnabledModulesForUser(user)[0] || null;

const GLOBAL_ROLES = ["admin", "super-admin"];

/**
 * The role this user holds inside a given module.
 *
 * A person can sit at different levels in each module — a manager in LEAP and
 * an agent in QUEST — so never read `user.role` directly once a module is
 * selected. `admin`/`super-admin` are company-wide and never vary. Falls back
 * to `user.role` for accounts enrolled before per-module roles existed.
 */
export const getRoleForModule = (user, moduleKey) => {
  const baseRole = String(user?.role || "").trim().toLowerCase();

  if (GLOBAL_ROLES.includes(baseRole)) {
    return baseRole;
  }

  const normalizedKey = String(moduleKey || "").trim().toUpperCase();
  const moduleRole = String(user?.moduleRoles?.[normalizedKey] || "")
    .trim()
    .toLowerCase();

  return moduleRole || baseRole;
};

export const getInitialRouteForRole = (role) => {
  if (role === "manager") {
    return "Manager";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Agent";
};

export const getModuleLandingRouteForRole = (role) => {
  if (role === "manager") {
    return "Dashboard";
  }

  if (role === "admin") {
    return "Admin Console";
  }

  return "Home";
};
