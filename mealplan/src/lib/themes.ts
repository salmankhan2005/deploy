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

export const themeColors: Record<string, ThemeColors> = {
  light: {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    secondary: 'bg-cyan-500',
    accent: 'text-blue-500',
    accentHover: 'hover:text-blue-600',
    background: 'bg-white',
    cardBackground: 'bg-slate-50',
    muted: 'bg-slate-100',
    mutedHover: 'hover:bg-slate-200',
  },
  dark: {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    secondary: 'bg-cyan-500',
    accent: 'text-blue-400',
    accentHover: 'hover:text-blue-300',
    background: 'bg-background/95',
    cardBackground: 'bg-background/60',
    muted: 'bg-muted/40',
    mutedHover: 'hover:bg-blue-500/20',
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
  // Add more theme variants as needed
};