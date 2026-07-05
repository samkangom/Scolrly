// Scolrly design tokens — single source of truth.
// Never hardcode colors/spacing in screens; always import from the theme.

export const Palette = {
  // Primary brand
  green: '#1DB954',
  greenDim: '#158a3e',
  greenGlow: '#1DB95420',
  greenBorder: '#1DB95430',

  // Semantic accents
  orange: '#FF6B35',
  orangeGlow: '#FF6B3520',
  purple: '#A855F7',
  purpleGlow: '#A855F720',
  blue: '#60A5FA',
  blueGlow: '#60A5FA20',
  yellow: '#FBBF24',
  yellowGlow: '#FBBF2420',
};

export const DarkTheme = {
  bg: '#0D0D0D',
  bgRaised: '#161616',
  bgCard: '#1C1C1C',
  bgCard2: '#222222',
  border: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#9A9A9A',
  textMuted: '#6B6B6B',
  navBorder: '#1E1E1E',
};

export const LightTheme = {
  bg: '#F5F5F5',
  bgRaised: '#FFFFFF',
  bgCard: '#E8E8E8',
  bgCard2: '#E0E0E0',
  border: '#D8D8D8',
  textPrimary: '#0D0D0D',
  textSecondary: '#444444',
  textMuted: '#888888',
  navBorder: '#D8D8D8',
};

// Font families map to the @expo-google-fonts/inter weights loaded in App.js.
const F = {
  400: 'Inter_400Regular',
  600: 'Inter_600SemiBold',
  700: 'Inter_700Bold',
  800: 'Inter_800ExtraBold',
  900: 'Inter_900Black',
};

export const Typography = {
  display: { fontFamily: F[900], fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  h1: { fontFamily: F[900], fontSize: 26, fontWeight: '900', letterSpacing: -0.6 },
  h2: { fontFamily: F[800], fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  h3: { fontFamily: F[800], fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  h4: { fontFamily: F[700], fontSize: 15, fontWeight: '700' },
  h5: { fontFamily: F[700], fontSize: 13, fontWeight: '700' },
  body: { fontFamily: F[400], fontSize: 14, fontWeight: '400', lineHeight: 21 },
  bodySmall: { fontFamily: F[400], fontSize: 12, fontWeight: '400', lineHeight: 18 },
  label: { fontFamily: F[700], fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  eyebrow: {
    fontFamily: F[800],
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  caption: { fontFamily: F[600], fontSize: 9, fontWeight: '600' },
};

export const Fonts = F;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
};

// Backwards-friendly aggregate used by ThemeContext.
export const Colors = {
  brand: Palette,
  dark: DarkTheme,
  light: LightTheme,
};
