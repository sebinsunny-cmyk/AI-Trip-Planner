export const darkTheme = {
  bgPrimary:     '#0D1117',
  bgSurface:     '#161B22',
  bgElevated:    '#21262D',
  accentAmber:   '#F5A623',
  accentTeal:    '#00C9A7',
  accentRed:     '#FF5C5C',
  textPrimary:   '#F0F6FC',
  textSecondary: '#8B949E',
  textNarration: '#CDD5E0',
  borderSubtle:  '#30363D',
};

export const lightTheme = {
  bgPrimary:     '#FAFBFC',
  bgSurface:     '#F1F3F5',
  bgElevated:    '#E4E8ED',
  accentAmber:   '#F5A623',
  accentTeal:    '#0B8C71',
  accentRed:     '#DC2626',
  textPrimary:   '#1A1F2E',
  textSecondary: '#6B7784',
  textNarration: '#3D4753',
  borderSubtle:  '#DDE1E6',
};

// Mutable object — mutated in-place by applyTheme() so all importers
// automatically read the new values on the next render cycle.
export const tm = { ...darkTheme };

export function applyTheme(theme: typeof darkTheme) {
  Object.assign(tm, theme);
}

export const fonts = {
  heading: "'Plus Jakarta Sans', sans-serif",
  body:    "'Manrope', sans-serif",
  mono:    "'JetBrains Mono', monospace",
};