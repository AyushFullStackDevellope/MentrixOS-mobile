export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  title: 32,
};

export const lineHeight = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  title: 40,
};

export const typography = {
  h1: {
    fontSize: fontSize.title,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: '600' as const,
  },
  body1: {
    fontSize: fontSize.lg,
    fontWeight: '400' as const,
  },
  body2: {
    fontSize: fontSize.md,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: '400' as const,
  },
  tiny: {
    fontSize: fontSize.xs,
    fontWeight: '300' as const,
  },
};

export type FontSize = typeof fontSize;
export type LineHeight = typeof lineHeight;
export type Typography = typeof typography;
