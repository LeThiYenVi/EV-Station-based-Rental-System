import { colors } from "./color";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadow";

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
};

export type Theme = typeof theme;
