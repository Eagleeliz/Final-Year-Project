// Design Tokens - Centralized UI/UX System
// Ensures consistent spacing, typography, colors, and component patterns

export const theme = {
  // Colors
  colors: {
    primary: "#002e33",      // Midnight Teal - main brand
    secondary: "#86d9e1",   // Aqua - accent
    success: "#10b981",      // Green
    warning: "#f59e0b",      // Amber
    error: "#ef4444",         // Red
    muted: "#6b7280",        // Gray-500
    background: "#f9fafb",  // Gray-50
    surface: "#ffffff",      // White
  },
  
  // Spacing Scale (consistent padding/margins)
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",     // 16px
    lg: "1.5rem",   // 24px
    xl: "2rem",     // 32px
    "2xl": "3rem",  // 48px
    "3xl": "4rem",  // 64px
  },
  
  // Border Radius (consistent rounding)
  radius: {
    sm: "0.5rem",   // 8px - buttons, inputs
    md: "1rem",    // 16px - cards
    lg: "1.5rem",  // 24px - modals
    xl: "2rem",    // 32px - large panels
    full: "9999px",
  },
  
  // Typography Scale
  fontSize: {
    xs: "0.75rem",    // 12px - labels, captions
    sm: "0.875rem",  // 14px - small text
    base: "1rem",    // 16px - body
    lg: "1.125rem",  // 18px - large body
    xl: "1.25rem",   // 20px - headings
    "2xl": "1.5rem", // 24px - section headings
    "3xl": "1.875rem", // 30px - page headings
    "4xl": "2.25rem",  // 36px - hero headings
    "5xl": "3rem",     // 48px - display
  },
  
  // Font Weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900",
  },
  
  // Shadows (consistent elevation)
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  
  // Breakpoints (for responsiveness)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

// Reusable component class strings for consistency
export const components = {
  // Input fields
  input: `
    w-full rounded-lg px-4 py-3 border-2 border-gray-200 
    focus:border-[#002e33] focus:ring-2 focus:ring-[#002e33]/20 
    outline-none transition-all bg-white text-gray-800 
    placeholder:text-gray-400 font-medium
  `,
  
  // Primary button
  buttonPrimary: `
    w-full py-3.5 rounded-lg font-bold text-base uppercase 
    tracking-wide shadow-lg active:scale-95 transition-all
  `,
  
  // Secondary button
  buttonSecondary: `
    w-full py-3.5 rounded-lg font-bold text-base uppercase 
    tracking-wide border-2 active:scale-95 transition-all
  `,
  
  // Card
  card: `
    bg-white p-6 rounded-xl shadow-sm border border-gray-100
  `,
  
  // Modal card
  modalCard: `
    bg-white rounded-2xl overflow-hidden shadow-xl
  `,
};

// Export as CSS variables for Tailwind compatibility
export const cssVariables = `
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-success: ${theme.colors.success};
  --color-warning: ${theme.colors.warning};
  --color-error: ${theme.colors.error};
  --color-muted: ${theme.colors.muted};
  --color-background: ${theme.colors.background};
  --color-surface: ${theme.colors.surface};
  
  --radius-sm: ${theme.radius.sm};
  --radius-md: ${theme.radius.md};
  --radius-lg: ${theme.radius.lg};
  --radius-xl: ${theme.radius.xl};
  
  --spacing-xs: ${theme.spacing.xs};
  --spacing-sm: ${theme.spacing.sm};
  --spacing-md: ${theme.spacing.md};
  --spacing-lg: ${theme.spacing.lg};
  --spacing-xl: ${theme.spacing.xl};
  
  --shadow-sm: ${theme.shadow.sm};
  --shadow-md: ${theme.shadow.md};
  --shadow-lg: ${theme.shadow.lg};
  --shadow-xl: ${theme.shadow.xl};
`;

export default theme;