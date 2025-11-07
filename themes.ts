export interface ThemeColors {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-muted': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-inverted': string;
  '--border-color': string;
  '--color-primary': string;
  '--color-primary-hover': string;
  '--color-primary-light': string;
  '--color-primary-text': string;
  '--gradient-from': string;
  '--gradient-to': string;
  '--color-error': string;
  '--color-error-bg': string;

  // Dark mode colors
  '--dark-bg-primary': string;
  '--dark-bg-secondary': string;
  '--dark-bg-muted': string;
  '--dark-text-primary': string;
  '--dark-text-secondary': string;
  '--dark-text-inverted': string;
  '--dark-border-color': string;
  '--dark-color-primary': string;
  '--dark-color-primary-hover': string;
  '--dark-color-primary-light': string;
  '--dark-gradient-from': string;
  '--dark-gradient-to': string;
  '--dark-color-error': string;
  '--dark-color-error-bg': string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export const themes: Record<string, Theme> = {
  default: {
    name: 'Deep Space',
    colors: {
      '--bg-primary': '#f8fafc', // slate-50
      '--bg-secondary': '#ffffff',
      '--bg-muted': '#f1f5f9', // slate-100
      '--text-primary': '#0f172a', // slate-900
      '--text-secondary': '#475569', // slate-600
      '--text-inverted': '#334155', // slate-700
      '--border-color': '#e2e8f0', // slate-200
      '--color-primary': '#2dd4bf', // teal-400
      '--color-primary-hover': '#5eead4', // teal-300
      '--color-primary-light': 'rgba(45, 212, 191, 0.1)',
      '--color-primary-text': '#0f172a', // slate-900
      '--gradient-from': '#2dd4bf', // teal-400
      '--gradient-to': '#6366f1', // indigo-500
      '--color-error': '#dc2626',
      '--color-error-bg': '#fee2e2',

      '--dark-bg-primary': '#0D1117', // deep navy
      '--dark-bg-secondary': '#161B22', // charcoal
      '--dark-bg-muted': '#21262d', // slightly lighter charcoal
      '--dark-text-primary': '#f0f6fc', // off-white
      '--dark-text-secondary': '#8b949e', // gray
      '--dark-text-inverted': '#c9d1d9',
      '--dark-border-color': '#30363d', // subtle border
      '--dark-color-primary': '#2dd4bf', // teal-400
      '--dark-color-primary-hover': '#5eead4', // teal-300
      '--dark-color-primary-light': 'rgba(45, 212, 191, 0.15)',
      '--dark-gradient-from': '#2dd4bf', // teal-400
      '--dark-gradient-to': '#6366f1', // indigo-500
      '--dark-color-error': '#fca5a5',
      '--dark-color-error-bg': 'rgba(153, 27, 27, 0.5)',
    },
  },
  evergreen: {
    name: 'Evergreen',
    colors: {
      '--bg-primary': '#f0fdf4', // green-50
      '--bg-secondary': '#ffffff', // white
      '--bg-muted': '#f3f4f6', // gray-100
      '--text-primary': '#1f2937', // gray-800
      '--text-secondary': '#4b5563', // gray-600
      '--text-inverted': '#374151', // gray-700
      '--border-color': '#e5e7eb', // gray-200
      '--color-primary': '#10b981', // green-600
      '--color-primary-hover': '#059669', // green-700
      '--color-primary-light': '#d1fae5', // green-100
      '--color-primary-text': '#ffffff', // white
      '--gradient-from': '#34d399', // green-400
      '--gradient-to': '#2dd4bf', // teal-400
      '--color-error': '#dc2626', // red-600
      '--color-error-bg': '#fee2e2', // red-100

      '--dark-bg-primary': '#111827', // gray-900
      '--dark-bg-secondary': '#1f2937', // gray-800
      '--dark-bg-muted': '#374151', // gray-700
      '--dark-text-primary': '#f9fafb', // gray-50
      '--dark-text-secondary': '#d1d5db', // gray-300
      '--dark-text-inverted': '#d1d5db', // gray-200
      '--dark-border-color': '#374151', // gray-700
      '--dark-color-primary': '#34d399', // green-400
      '--dark-color-primary-hover': '#10b981', // green-500
      '--dark-color-primary-light': 'rgba(52, 211, 153, 0.15)',
      '--dark-gradient-from': '#34d399', // green-400
      '--dark-gradient-to': '#2dd4bf', // teal-400
      '--dark-color-error': '#fca5a5', // red-300
      '--dark-color-error-bg': 'rgba(153, 27, 27, 0.5)',
    },
  },
  tropical: {
    name: 'Tropical',
    colors: {
      '--bg-primary': '#fffbeb', // yellow-50
      '--bg-secondary': '#ffffff',
      '--bg-muted': '#ffedd5', // orange-100
      '--text-primary': '#431407', // orange-950
      '--text-secondary': '#7c2d12', // orange-800
      '--text-inverted': '#78350f', // yellow-900
      '--border-color': '#fed7aa', // orange-200
      '--color-primary': '#f97316', // orange-500
      '--color-primary-hover': '#ea580c', // orange-600
      '--color-primary-light': '#ffedd5', // orange-100
      '--color-primary-text': '#ffffff',
      '--gradient-from': '#fb923c', // orange-400
      '--gradient-to': '#22d3ee', // cyan-400
      '--color-error': '#dc2626',
      '--color-error-bg': '#fee2e2',

      '--dark-bg-primary': '#262626', // neutral-800
      '--dark-bg-secondary': '#404040', // neutral-700
      '--dark-bg-muted': '#525252', // neutral-600
      '--dark-text-primary': '#fff7ed', // orange-50
      '--dark-text-secondary': '#fed7aa', // orange-200
      '--dark-text-inverted': '#fed7aa', // orange-200
      '--dark-border-color': '#737373', // neutral-600
      '--dark-color-primary': '#fb923c', // orange-400
      '--dark-color-primary-hover': '#f97316', // orange-500
      '--dark-color-primary-light': 'rgba(251, 146, 60, 0.15)',
      '--dark-gradient-from': '#fb923c', // orange-400
      '--dark-gradient-to': '#67e8f9', // cyan-300
      '--dark-color-error': '#fca5a5',
      '--dark-color-error-bg': 'rgba(153, 27, 27, 0.5)',
    },
  },
  urban: {
    name: 'Urban',
    colors: {
      '--bg-primary': '#f3f4f6', // gray-100
      '--bg-secondary': '#ffffff',
      '--bg-muted': '#e5e7eb', // gray-200
      '--text-primary': '#111827', // gray-900
      '--text-secondary': '#374151', // gray-700
      '--text-inverted': '#4b5563', // gray-600
      '--border-color': '#d1d5db', // gray-300
      '--color-primary': '#4f46e5', // indigo-600
      '--color-primary-hover': '#4338ca', // indigo-700
      '--color-primary-light': '#e0e7ff', // indigo-100
      '--color-primary-text': '#ffffff',
      '--gradient-from': '#6366f1', // indigo-500
      '--gradient-to': '#ec4899', // pink-500
      '--color-error': '#dc2626',
      '--color-error-bg': '#fee2e2',
      
      '--dark-bg-primary': '#1f2937', // gray-800
      '--dark-bg-secondary': '#111827', // gray-900
      '--dark-bg-muted': '#4b5563', // gray-600
      '--dark-text-primary': '#f9fafb', // gray-50
      '--dark-text-secondary': '#9ca3af', // gray-400
      '--dark-text-inverted': '#d1d5db', // gray-300
      '--dark-border-color': '#4b5563', // gray-600
      '--dark-color-primary': '#818cf8', // indigo-400
      '--dark-color-primary-hover': '#6366f1', // indigo-500
      '--dark-color-primary-light': 'rgba(129, 140, 248, 0.15)',
      '--dark-gradient-from': '#818cf8', // indigo-400
      '--dark-gradient-to': '#f472b6', // pink-400
      '--dark-color-error': '#fca5a5',
      '--dark-color-error-bg': 'rgba(153, 27, 27, 0.5)',
    },
  },
  minimalist: {
    name: 'Minimalist',
    colors: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f9fafb', // gray-50
        '--bg-muted': '#f3f4f6', // gray-100
        '--text-primary': '#000000',
        '--text-secondary': '#525252', // neutral-600
        '--text-inverted': '#171717', // neutral-900
        '--border-color': '#e5e5e5', // neutral-200
        '--color-primary': '#171717', // neutral-900
        '--color-primary-hover': '#404040', // neutral-700
        '--color-primary-light': '#f5f5f5', // neutral-100
        '--color-primary-text': '#ffffff',
        '--gradient-from': '#262626', // neutral-800
        '--gradient-to': '#737373', // neutral-500
        '--color-error': '#dc2626',
        '--color-error-bg': '#fee2e2',

        '--dark-bg-primary': '#0a0a0a', // neutral-950
        '--dark-bg-secondary': '#171717', // neutral-900
        '--dark-bg-muted': '#262626', // neutral-800
        '--dark-text-primary': '#ffffff',
        '--dark-text-secondary': '#a3a3a3', // neutral-400
        '--dark-text-inverted': '#e5e5e5', // neutral-200
        '--dark-border-color': '#404040', // neutral-700
        '--dark-color-primary': '#e5e5e5', // neutral-200
        '--dark-color-primary-hover': '#f5f5f5', // neutral-100
        '--dark-color-primary-light': 'rgba(229, 229, 229, 0.15)',
        '--dark-gradient-from': '#e5e5e5', // neutral-200
        '--dark-gradient-to': '#a3a3a3', // neutral-400
        '--dark-color-error': '#fca5a5',
        '--dark-color-error-bg': 'rgba(153, 27, 27, 0.5)',
    }
  }
};