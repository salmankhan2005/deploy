import { useTheme } from 'next-themes';

interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  accentHover: string;
  background: string;
  cardBackground: string;
  muted: string;
  mutedHover: string;
}

const defaultColors: ThemeColors = {
  primary: 'bg-blue-500',
  primaryHover: 'hover:bg-blue-600',
  secondary: 'bg-cyan-500',
  accent: 'text-blue-500',
  accentHover: 'hover:text-blue-600',
  background: 'bg-background/95',
  cardBackground: 'bg-background/60',
  muted: 'bg-muted/40',
  mutedHover: 'hover:bg-blue-500/20',
};

const themeVariants: Record<string, ThemeColors> = {
  light: {
    primary: 'bg-emerald-400',
    primaryHover: 'hover:bg-emerald-500',
    secondary: 'bg-emerald-200',
    accent: 'text-emerald-600',
    accentHover: 'hover:text-emerald-700',
    background: 'bg-green-50',
    cardBackground: 'bg-emerald-50',
    muted: 'bg-emerald-50',
    mutedHover: 'hover:bg-emerald-100',
  },
  dark: {
    primary: 'bg-teal-500',
    primaryHover: 'hover:bg-teal-600',
    secondary: 'bg-slate-700',
    accent: 'text-teal-400',
    accentHover: 'hover:text-teal-300',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-teal-500/20',
  },
  comic: {
    primary: 'bg-pink-500',
    primaryHover: 'hover:bg-pink-600',
    secondary: 'bg-pink-400',
    accent: 'text-pink-400',
    accentHover: 'hover:text-pink-300',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-pink-500/20',
  },
  'comic-dark': {
    primary: 'bg-pink-500',
    primaryHover: 'hover:bg-pink-600',
    secondary: 'bg-pink-400',
    accent: 'text-pink-400',
    accentHover: 'hover:text-pink-300',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-pink-500/20',
  },
  'clean-minimalist': {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    secondary: 'bg-blue-400',
    accent: 'text-blue-400',
    accentHover: 'hover:text-blue-300',
    background: 'bg-white',
    cardBackground: 'bg-slate-50',
    muted: 'bg-gray-100',
    mutedHover: 'hover:bg-blue-100',
  },
  'clean-minimalist-dark': {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    secondary: 'bg-blue-400',
    accent: 'text-blue-400',
    accentHover: 'hover:text-blue-300',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-blue-500/20',
  },
  'cozy-rustic': {
    primary: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    secondary: 'bg-amber-500',
    accent: 'text-amber-500',
    accentHover: 'hover:text-amber-400',
    background: 'bg-white',
    cardBackground: 'bg-amber-50',
    muted: 'bg-yellow-50',
    mutedHover: 'hover:bg-yellow-100',
  },
  'cozy-rustic-dark': {
    primary: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    secondary: 'bg-amber-500',
    accent: 'text-amber-500',
    accentHover: 'hover:text-amber-400',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-amber-500/20',
  },
  'vibrant-healthy': {
    primary: 'bg-green-500',
    primaryHover: 'hover:bg-green-600',
    secondary: 'bg-green-400',
    accent: 'text-green-500',
    accentHover: 'hover:text-green-400',
    background: 'bg-white',
    cardBackground: 'bg-green-50',
    muted: 'bg-green-50',
    mutedHover: 'hover:bg-green-100',
  },
  'vibrant-healthy-dark': {
    primary: 'bg-green-500',
    primaryHover: 'hover:bg-green-600',
    secondary: 'bg-green-400',
    accent: 'text-green-400',
    accentHover: 'hover:text-green-300',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-green-500/20',
  },
  'gourmet-elegant': {
    primary: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    secondary: 'bg-rose-500',
    accent: 'text-rose-500',
    accentHover: 'hover:text-rose-400',
    background: 'bg-white',
    cardBackground: 'bg-rose-50',
    muted: 'bg-rose-50',
    mutedHover: 'hover:bg-rose-100',
  },
  'gourmet-elegant-dark': {
    primary: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    secondary: 'bg-rose-500',
    accent: 'text-rose-500',
    accentHover: 'hover:text-rose-400',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-rose-500/20',
  },
  'playful-fun': {
    primary: 'bg-violet-500',
    primaryHover: 'hover:bg-violet-600',
    secondary: 'bg-violet-400',
    accent: 'text-violet-500',
    accentHover: 'hover:text-violet-400',
    background: 'bg-white',
    cardBackground: 'bg-violet-50',
    muted: 'bg-violet-50',
    mutedHover: 'hover:bg-violet-100',
  },
  'playful-fun-dark': {
    primary: 'bg-violet-500',
    primaryHover: 'hover:bg-violet-600',
    secondary: 'bg-violet-400',
    accent: 'text-violet-400',
    accentHover: 'hover:text-violet-300',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-violet-500/20',
  },
  genie: {
    primary: 'bg-yellow-500',
    primaryHover: 'hover:bg-yellow-600',
    secondary: 'bg-red-600',
    accent: 'text-yellow-400',
    accentHover: 'hover:text-yellow-300',
    background: 'bg-gray-900',
    cardBackground: 'bg-gray-800',
    muted: 'bg-gray-700',
    mutedHover: 'hover:bg-yellow-500/20',
  },
};

export const useThemeColors = () => {
  const { theme = 'dark' } = useTheme();
  return themeVariants[theme] || defaultColors;
};