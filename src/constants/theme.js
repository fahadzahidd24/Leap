import { GITSA_BRAND, getModuleConfig } from "./moduleConfig";

export const theme = {
  colors: {
    ...GITSA_BRAND.colors,
  },
};

export const applyModuleTheme = (moduleKey) => {
  const nextColors = moduleKey
    ? getModuleConfig(moduleKey).colors
    : GITSA_BRAND.colors;

  Object.assign(theme.colors, nextColors);
};
