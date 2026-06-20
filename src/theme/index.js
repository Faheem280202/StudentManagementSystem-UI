// ============================================================
// THEME CONFIG — Change here, changes everywhere in the app.
// Swap school/college identity by editing this one file.
// ============================================================

export const SCHOOL_CONFIG = {
  name: "Greenwood Academy",
  shortName: "GWA",
  tagline: "Nurturing Minds, Building Futures",
  type: "school", // "school" | "college" | "university"
  address: "123 Education Lane, Knowledge City - 641 001",
  phone: "+91 98765 43210",
  email: "admin@greenwoodacademy.edu",
  logo: null, // Pass a URL string to use a logo image
};

export const THEME = {
  // Brand Colors
  colors: {
    primary:        "#1E3A5F",   // deep navy — authority, trust
    primaryLight:   "#2D5490",
    primaryDark:    "#122440",
    accent:         "#F4A261",   // warm amber — warmth, energy
    accentLight:    "#F7BE8C",
    accentDark:     "#D4874A",
    success:        "#2D9B6F",
    warning:        "#E8A020",
    danger:         "#D94040",
    info:           "#3A7EC8",

    // Neutrals
    bg:             "#F5F7FA",
    bgCard:         "#FFFFFF",
    bgSidebar:      "#1E3A5F",
    border:         "#E2E8F0",
    borderDark:     "#CBD5E1",

    // Text
    textPrimary:    "#1A202C",
    textSecondary:  "#64748B",
    textMuted:      "#94A3B8",
    textOnDark:     "#FFFFFF",
    textOnDarkMuted:"rgba(255,255,255,0.65)",
  },

  // Typography
  fonts: {
    display:  "'Playfair Display', Georgia, serif",  // headings — classical authority
    body:     "'Inter', system-ui, sans-serif",       // body text — clean readability
    mono:     "'JetBrains Mono', monospace",          // data/code
  },

  // Spacing scale (rem)
  spacing: {
    xs:   "0.25rem",
    sm:   "0.5rem",
    md:   "1rem",
    lg:   "1.5rem",
    xl:   "2rem",
    xxl:  "3rem",
  },

  // Border radius
  radius: {
    sm:   "6px",
    md:   "10px",
    lg:   "16px",
    xl:   "24px",
    full: "9999px",
  },

  // Shadows
  shadow: {
    sm:  "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
    md:  "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
    lg:  "0 10px 30px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)",
    xl:  "0 20px 50px rgba(0,0,0,0.12)",
  },

  // Sidebar width
  sidebarWidth: "260px",
  sidebarCollapsedWidth: "72px",
};

// CSS custom properties string — injected into :root
export function buildCSSVariables() {
  const c = THEME.colors;
  return `
    --color-primary:         ${c.primary};
    --color-primary-light:   ${c.primaryLight};
    --color-primary-dark:    ${c.primaryDark};
    --color-accent:          ${c.accent};
    --color-accent-light:    ${c.accentLight};
    --color-accent-dark:     ${c.accentDark};
    --color-success:         ${c.success};
    --color-warning:         ${c.warning};
    --color-danger:          ${c.danger};
    --color-info:            ${c.info};
    --color-bg:              ${c.bg};
    --color-bg-card:         ${c.bgCard};
    --color-bg-sidebar:      ${c.bgSidebar};
    --color-border:          ${c.border};
    --color-border-dark:     ${c.borderDark};
    --color-text-primary:    ${c.textPrimary};
    --color-text-secondary:  ${c.textSecondary};
    --color-text-muted:      ${c.textMuted};
    --color-text-on-dark:    ${c.textOnDark};
    --color-text-on-dark-muted: ${c.textOnDarkMuted};
    --font-display:          ${THEME.fonts.display};
    --font-body:             ${THEME.fonts.body};
    --font-mono:             ${THEME.fonts.mono};
    --shadow-sm:             ${THEME.shadow.sm};
    --shadow-md:             ${THEME.shadow.md};
    --shadow-lg:             ${THEME.shadow.lg};
    --shadow-xl:             ${THEME.shadow.xl};
    --radius-sm:             ${THEME.radius.sm};
    --radius-md:             ${THEME.radius.md};
    --radius-lg:             ${THEME.radius.lg};
    --radius-xl:             ${THEME.radius.xl};
    --radius-full:           ${THEME.radius.full};
    --sidebar-width:         ${THEME.sidebarWidth};
    --sidebar-collapsed:     ${THEME.sidebarCollapsedWidth};
  `;
}
