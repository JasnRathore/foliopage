export type ProfileTemplateId =
  | "linkboard"
  | "dusk"
  | "chalk"
  | "forest"
  | "neon"
  | "ivory"
  | "blueprint"
  | "terracotta"
  | "void"
  | "candy";

export type ProfileLayoutVariant = "stack" | "sidebar" | "magazine";

export interface ProfileTemplateStyles {
  page: string;

  // STACK layout ─────────────────────────────────────────────────────────────
  // Mobile (<lg): single centered column, stackMain wraps everything
  stackMain: string;
  stackHeroCard: string;

  // SIDEBAR layout (md+) ─────────────────────────────────────────────────────
  sidebarOuter: string;
  sidebarLeft: string;
  sidebarRight: string;

  // MAGAZINE layout (lg+) ────────────────────────────────────────────────────
  magazineMain: string;
  magazineHeroBanner: string;
  magazineGrid: string;
  magazineColWide: string;
  magazineColNarrow: string;

  // Shared tokens ────────────────────────────────────────────────────────────
  heroName: string;
  heroHeadline: string;
  heroBio: string;
  pill: string;
  pillAccent: string;
  section: string;
  sectionTitle: string;
  ctaPrimary: string;
  ctaOutline: string;
  linkRow: string;
  linkRowIcon: string;
  projectCard: string;
  projectCardAlt: string;
  iconBtn: string;
  chip: string;
  footer: string;
  divider: string;
}

export interface ProfileTemplateDefinition {
  id: ProfileTemplateId;
  label: string;
  description: string;
  layout: ProfileLayoutVariant;
  styles: ProfileTemplateStyles;
}

export const defaultProfileTemplateId: ProfileTemplateId = "linkboard";

// ── shared sidebar structural classes ─────────────────────────────────────
const SIDEBAR_OUTER = "flex w-full min-h-dvh flex-col md:flex-row";
const SIDEBAR_LEFT = "w-full px-5 pt-10 pb-6 md:sticky md:top-0 md:h-screen md:w-[280px] md:shrink-0 md:overflow-y-auto md:px-8 md:py-10 lg:w-[320px]";
const SIDEBAR_RIGHT = "flex-1 px-5 pb-20 pt-2 md:px-8 md:pt-10 md:max-w-2xl lg:max-w-3xl";

// ─────────────────────────────────────────────────────────────────────────────
// LINKBOARD — STACK · warm parchment · editorial
// ─────────────────────────────────────────────────────────────────────────────
const linkboardTemplate: ProfileTemplateDefinition = {
  id: "linkboard",
  label: "Linkboard",
  description: "Warm parchment, foliopage brand red, editorial card stack.",
  layout: "stack",
  styles: {
    page: "min-h-dvh bg-[#f5f0e8] text-[#1a1714] [background-image:radial-gradient(ellipse_120%_50%_at_65%_0%,#d4e84a1a_0%,transparent_55%)]",

    // Mobile: centered single column
    stackMain: "mx-auto w-full max-w-[640px] px-4 pb-20 pt-10 sm:px-6 lg:max-w-3xl lg:px-8 xl:max-w-4xl",
    stackHeroCard: "rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm",

    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",

    heroName: "mt-4 text-4xl font-bold tracking-tight sm:text-5xl",
    heroHeadline: "mt-2 text-base font-medium leading-snug opacity-65",
    heroBio: "mt-3 text-sm leading-relaxed opacity-50",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white/80 px-3 py-1 text-[11px] font-medium",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#d4e84a] px-3 py-1 text-[11px] font-semibold text-[#2a2d00]",
    section: "mt-4 rounded-3xl border border-black/10 bg-white/70 p-5 shadow-sm backdrop-blur-sm",
    sectionTitle: "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest opacity-40",
    ctaPrimary: "inline-flex items-center gap-2 rounded-2xl bg-[#f04939] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d63a2c]",
    ctaOutline: "inline-flex items-center gap-2 rounded-2xl border border-black/20 bg-white/70 px-5 py-2.5 text-sm font-medium transition-colors hover:border-black/40 hover:bg-white",
    linkRow: "flex items-center gap-3 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 transition-all hover:border-black/25 hover:bg-white hover:shadow-sm",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/5",
    projectCard: "rounded-2xl border border-black/10 bg-[#faf8f4] p-4",
    projectCardAlt: "rounded-2xl border border-black/10 bg-white/80 p-4",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-xl border border-black/15 bg-white/80 transition-colors hover:border-black/30 hover:bg-white",
    chip: "rounded-full border border-black/15 bg-white/70 px-3 py-0.5 text-xs font-medium",
    footer: "mt-8 text-center text-xs opacity-35",
    divider: "my-4 border-t border-black/10",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DUSK — SIDEBAR · deep indigo · electric violet
// ─────────────────────────────────────────────────────────────────────────────
const duskTemplate: ProfileTemplateDefinition = {
  id: "dusk",
  label: "Dusk",
  description: "Deep indigo, electric violet accents. Sticky sidebar on desktop.",
  layout: "sidebar",
  styles: {
    page: "min-h-dvh bg-[#0d0b1a] text-[#e8e4ff] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-10%,#3d1f8040_0%,transparent_65%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-20 pt-10 sm:px-6",
    stackHeroCard: "rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
    sidebarOuter: SIDEBAR_OUTER,
    sidebarLeft: SIDEBAR_LEFT + " md:border-r md:border-white/8",
    sidebarRight: SIDEBAR_RIGHT,
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    heroName: "mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl",
    heroHeadline: "mt-2 text-sm font-medium leading-snug text-white/55",
    heroBio: "mt-3 text-sm leading-relaxed text-white/38",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-medium text-white/65",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#a78bfa] px-3 py-1 text-[11px] font-semibold text-[#0d0b1a]",
    section: "mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm",
    sectionTitle: "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30",
    ctaPrimary: "inline-flex items-center gap-2 rounded-2xl bg-[#a78bfa] px-5 py-2.5 text-sm font-semibold text-[#0d0b1a] transition-colors hover:bg-[#c4b5fd]",
    ctaOutline: "inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:border-white/35 hover:bg-white/10",
    linkRow: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/75 transition-all hover:border-white/20 hover:bg-white/8",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10",
    projectCard: "rounded-2xl border border-white/10 bg-[#13102a] p-4 text-white/80",
    projectCardAlt: "rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white/65 transition-colors hover:border-white/30 hover:bg-white/15",
    chip: "rounded-full border border-white/15 bg-white/8 px-3 py-0.5 text-xs font-medium text-white/65",
    footer: "mt-8 text-center text-xs text-white/20",
    divider: "my-4 border-t border-white/10",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CHALK — MAGAZINE · crisp white · Swiss bento
// ─────────────────────────────────────────────────────────────────────────────
const chalkTemplate: ProfileTemplateDefinition = {
  id: "chalk",
  label: "Chalk",
  description: "Pure white, heavy borders, Swiss grid. Full-width hero + bento on large screens.",
  layout: "magazine",
  styles: {
    page: "min-h-dvh bg-[#f8f8f6] text-[#1c1c1c]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-20 pt-10 sm:px-6",
    stackHeroCard: "rounded-3xl border-2 border-[#1c1c1c]/12 bg-white p-6",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    magazineMain: "w-full pb-20",
    magazineHeroBanner: "w-full border-b-2 border-[#1c1c1c]/8 bg-white px-6 py-12 sm:px-10 lg:grid lg:grid-cols-[1fr_320px] lg:items-end lg:gap-12 lg:px-14 lg:py-16 xl:px-20 xl:py-20",
    magazineGrid: "px-6 pt-6 sm:px-10 lg:px-14 xl:px-20 grid grid-cols-1 gap-4 lg:grid-cols-3",
    magazineColWide: "lg:col-span-2 flex flex-col gap-4",
    magazineColNarrow: "lg:col-span-1 flex flex-col gap-4",
    heroName: "text-5xl font-black tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl",
    heroHeadline: "mt-3 text-base font-medium leading-snug text-[#1c1c1c]/58 lg:text-lg",
    heroBio: "mt-3 text-sm leading-relaxed text-[#1c1c1c]/45 lg:max-w-xl",
    pill: "inline-flex items-center gap-1.5 rounded-full border-2 border-[#1c1c1c]/12 bg-transparent px-3 py-1 text-[11px] font-semibold",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full border-2 border-[#1c1c1c] bg-[#1c1c1c] px-3 py-1 text-[11px] font-semibold text-white",
    section: "rounded-3xl border-2 border-[#1c1c1c]/10 bg-white p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#1c1c1c]/35",
    ctaPrimary: "inline-flex items-center gap-2 rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#333]",
    ctaOutline: "inline-flex items-center gap-2 rounded-2xl border-2 border-[#1c1c1c]/20 bg-transparent px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[#1c1c1c]/50",
    linkRow: "flex items-center gap-3 rounded-2xl border-2 border-[#1c1c1c]/10 bg-[#f8f8f6] px-4 py-3 transition-all hover:border-[#1c1c1c]/25",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#1c1c1c]/10",
    projectCard: "rounded-2xl border-2 border-[#1c1c1c]/10 bg-[#f8f8f6] p-4",
    projectCardAlt: "rounded-2xl border-2 border-[#1c1c1c]/10 bg-white p-4",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-xl border-2 border-[#1c1c1c]/15 transition-colors hover:border-[#1c1c1c]/40",
    chip: "rounded-full border-2 border-[#1c1c1c]/12 px-3 py-0.5 text-xs font-semibold",
    footer: "mt-8 text-center text-xs text-[#1c1c1c]/30",
    divider: "my-4 border-t-2 border-[#1c1c1c]/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FOREST — SIDEBAR · deep green · earthy
// ─────────────────────────────────────────────────────────────────────────────
const forestTemplate: ProfileTemplateDefinition = {
  id: "forest",
  label: "Forest",
  description: "Deep green earth tones. Sticky sidebar on desktop, stacked on mobile.",
  layout: "sidebar",
  styles: {
    page: "min-h-dvh bg-[#0f1a0f] text-[#e8f0e8] [background-image:radial-gradient(ellipse_100%_55%_at_25%_0%,#1a3d1a40_0%,transparent_65%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-20 pt-10 sm:px-6",
    stackHeroCard: "rounded-3xl border border-white/10 bg-[#152015]/60 p-6 backdrop-blur-sm",
    sidebarOuter: SIDEBAR_OUTER,
    sidebarLeft: SIDEBAR_LEFT + " md:border-r md:border-white/8",
    sidebarRight: SIDEBAR_RIGHT,
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    heroName: "mt-4 text-3xl font-bold tracking-tight text-[#e8f0e8] md:text-4xl",
    heroHeadline: "mt-2 text-sm font-medium leading-snug text-[#e8f0e8]/50",
    heroBio: "mt-3 text-sm leading-relaxed text-[#e8f0e8]/35",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-[#e8f0e8]/60",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#4ade80] px-3 py-1 text-[11px] font-semibold text-[#0f1a0f]",
    section: "mt-4 rounded-3xl border border-white/10 bg-[#152015]/60 p-5 backdrop-blur-sm",
    sectionTitle: "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#e8f0e8]/28",
    ctaPrimary: "inline-flex items-center gap-2 rounded-2xl bg-[#4ade80] px-5 py-2.5 text-sm font-semibold text-[#0f1a0f] transition-colors hover:bg-[#6ee7a0]",
    ctaOutline: "inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#e8f0e8]/70 transition-colors hover:border-white/30 hover:bg-white/8",
    linkRow: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#e8f0e8]/70 transition-all hover:border-white/20 hover:bg-white/8",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/8",
    projectCard: "rounded-2xl border border-white/10 bg-[#0f1a0f] p-4 text-[#e8f0e8]/75",
    projectCardAlt: "rounded-2xl border border-white/10 bg-white/5 p-4 text-[#e8f0e8]/75",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#e8f0e8]/55 transition-colors hover:border-white/30 hover:bg-white/10",
    chip: "rounded-full border border-white/15 bg-white/5 px-3 py-0.5 text-xs font-medium text-[#e8f0e8]/55",
    footer: "mt-8 text-center text-xs text-[#e8f0e8]/20",
    divider: "my-4 border-t border-white/10",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// NEON ARCADE — MAGAZINE · dark charcoal · hot pink + cyan
// ─────────────────────────────────────────────────────────────────────────────
const neonTemplate: ProfileTemplateDefinition = {
  id: "neon",
  label: "Neon Arcade",
  description: "Dark charcoal, hot pink and cyan neon. Retro-game arcade energy.",
  layout: "magazine",
  styles: {
    page: "min-h-dvh bg-[#0e0e12] text-[#f0eeff] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-20 pt-10 sm:px-6",
    stackHeroCard: "border border-[#ff2d78]/30 bg-[#13131a] p-6",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    magazineMain: "w-full pb-20",
    magazineHeroBanner: "relative w-full overflow-hidden border-b border-[#ff2d78]/20 bg-[#0e0e12] px-6 py-14 sm:px-10 lg:grid lg:grid-cols-[1fr_300px] lg:items-end lg:gap-10 lg:px-14 lg:py-20 xl:px-20 before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-96 before:w-96 before:rounded-full before:bg-[#ff2d78] before:opacity-[0.04] before:blur-3xl before:content-[''] after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-64 after:w-64 after:rounded-full after:bg-[#00e5ff] after:opacity-[0.05] after:blur-3xl after:content-['']",
    magazineGrid: "px-6 pt-6 sm:px-10 lg:px-14 xl:px-20 grid grid-cols-1 gap-4 lg:grid-cols-3",
    magazineColWide: "lg:col-span-2 flex flex-col gap-4",
    magazineColNarrow: "lg:col-span-1 flex flex-col gap-4",
    heroName: "mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl [text-shadow:0_0_30px_rgba(255,45,120,0.5),0_0_60px_rgba(255,45,120,0.25)]",
    heroHeadline: "mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00e5ff]/70",
    heroBio: "mt-3 text-sm leading-relaxed text-white/42 lg:max-w-lg",
    pill: "inline-flex items-center gap-1.5 border border-[#ff2d78]/30 bg-[#ff2d78]/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ff2d78]",
    pillAccent: "inline-flex items-center gap-1.5 border border-[#00e5ff]/40 bg-[#00e5ff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00e5ff]",
    section: "rounded-2xl border border-white/8 bg-[#13131a] p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2d78]/55",
    ctaPrimary: "inline-flex items-center gap-2 border border-[#ff2d78] bg-[#ff2d78] px-5 py-2.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#ff2d78]/80 hover:shadow-[0_0_20px_rgba(255,45,120,0.4)]",
    ctaOutline: "inline-flex items-center gap-2 border border-[#00e5ff]/40 bg-transparent px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[#00e5ff] transition-all hover:border-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]",
    linkRow: "flex items-center gap-3 rounded-xl border border-white/8 bg-[#13131a] px-4 py-3 text-white/70 transition-all hover:border-[#ff2d78]/25 hover:bg-[#ff2d78]/5",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ff2d78]/10 text-[#ff2d78]",
    projectCard: "rounded-2xl border border-white/8 bg-[#0e0e12] p-4 text-white/80",
    projectCardAlt: "rounded-2xl border border-[#00e5ff]/15 bg-[#13131a] p-4 text-white/80",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-white/50 transition-all hover:border-[#00e5ff]/40 hover:text-[#00e5ff]",
    chip: "border border-[#00e5ff]/20 bg-[#00e5ff]/5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00e5ff]/65",
    footer: "mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-white/15",
    divider: "my-4 border-t border-[#ff2d78]/15",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// IVORY — STACK · ultra-luxury cream · fine serif
// ─────────────────────────────────────────────────────────────────────────────
const ivoryTemplate: ProfileTemplateDefinition = {
  id: "ivory",
  label: "Ivory",
  description: "Ultra-luxury cream, fine serif typography, haute couture minimalism.",
  layout: "stack",
  styles: {
    page: "min-h-dvh bg-[#f9f5ee] text-[#2a2520] [background-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#e8dfc840_0%,transparent_60%)]",

    // Mobile: centered single column
    stackMain: "mx-auto w-full max-w-[520px] px-6 pb-24 pt-14 sm:px-8 lg:max-w-2xl lg:px-10 xl:max-w-3xl",
    stackHeroCard: "border-b border-[#2a2520]/10 pb-8",

    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",

    heroName: "mt-6 text-center font-serif text-4xl font-normal italic tracking-wide text-[#2a2520] sm:text-5xl lg:text-left lg:text-5xl xl:text-6xl",
    heroHeadline: "mt-3 text-center text-xs font-normal uppercase tracking-[0.35em] text-[#2a2520]/55 lg:text-left",
    heroBio: "mt-4 text-center text-sm leading-loose text-[#2a2520]/48 lg:text-left",
    pill: "inline-flex items-center gap-1.5 border border-[#2a2520]/15 px-3 py-1 text-[10px] font-normal uppercase tracking-[0.2em] text-[#2a2520]/60",
    pillAccent: "inline-flex items-center gap-1.5 border border-[#2a2520] px-3 py-1 text-[10px] font-normal uppercase tracking-[0.2em] text-[#2a2520]",
    section: "mt-6 border-t border-[#2a2520]/8 pt-6",
    sectionTitle: "inline-flex items-center gap-3 text-[9px] font-normal uppercase tracking-[0.4em] text-[#2a2520]/35",
    ctaPrimary: "inline-flex items-center gap-3 border border-[#2a2520] bg-[#2a2520] px-6 py-3 text-xs font-normal uppercase tracking-[0.2em] text-[#f9f5ee] transition-colors hover:bg-[#1a150f]",
    ctaOutline: "inline-flex items-center gap-3 border border-[#2a2520]/25 px-6 py-3 text-xs font-normal uppercase tracking-[0.2em] text-[#2a2520]/65 transition-colors hover:border-[#2a2520]/50",
    linkRow: "flex items-center gap-3 border-b border-[#2a2520]/8 py-3.5 text-[#2a2520]/65 transition-colors hover:text-[#2a2520] last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center",
    projectCard: "border-b border-[#2a2520]/8 py-5 last:border-b-0",
    projectCardAlt: "border-b border-[#2a2520]/8 py-5 last:border-b-0",
    iconBtn: "flex h-6 w-6 items-center justify-center border border-[#2a2520]/15 text-[#2a2520]/40 transition-colors hover:border-[#2a2520]/40 hover:text-[#2a2520]/70",
    chip: "border border-[#2a2520]/12 px-2.5 py-0.5 text-[10px] font-normal uppercase tracking-[0.15em] text-[#2a2520]/45",
    footer: "mt-10 text-center text-[9px] font-normal uppercase tracking-[0.3em] text-[#2a2520]/25",
    divider: "my-5 border-t border-[#2a2520]/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BLUEPRINT — SIDEBAR · navy + white grid · technical drafting
// ─────────────────────────────────────────────────────────────────────────────
const blueprintTemplate: ProfileTemplateDefinition = {
  id: "blueprint",
  label: "Blueprint",
  description: "Engineering navy with white grid lines. Technical drafting aesthetic.",
  layout: "sidebar",
  styles: {
    page: "min-h-dvh bg-[#0a1628] text-[#ddeeff] [background-image:linear-gradient(rgba(180,210,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-20 pt-10 sm:px-6",
    stackHeroCard: "border border-[#4a9eff]/25 bg-[#0d1f3a]/80 p-6",
    sidebarOuter: SIDEBAR_OUTER,
    sidebarLeft: SIDEBAR_LEFT + " md:border-r md:border-[#4a9eff]/15",
    sidebarRight: SIDEBAR_RIGHT,
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    heroName: "mt-4 border-b border-[#4a9eff]/20 pb-3 text-3xl font-bold tracking-tight text-white md:text-4xl",
    heroHeadline: "mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#4a9eff]/70",
    heroBio: "mt-3 text-sm leading-relaxed text-[#ddeeff]/42",
    pill: "inline-flex items-center gap-1.5 border border-[#4a9eff]/25 bg-[#4a9eff]/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#4a9eff]/80",
    pillAccent: "inline-flex items-center gap-1.5 border border-[#4a9eff] bg-[#4a9eff]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4a9eff]",
    section: "mt-4 border border-[#4a9eff]/15 bg-[#0d1f3a]/60 p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#4a9eff]/45",
    ctaPrimary: "inline-flex items-center gap-2 border border-[#4a9eff] bg-[#4a9eff]/15 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#4a9eff] transition-all hover:bg-[#4a9eff]/25",
    ctaOutline: "inline-flex items-center gap-2 border border-[#ddeeff]/20 bg-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#ddeeff]/55 transition-all hover:border-[#ddeeff]/40",
    linkRow: "flex items-center gap-3 border border-[#4a9eff]/12 bg-[#0d1f3a]/40 px-4 py-3 text-[#ddeeff]/65 transition-all hover:border-[#4a9eff]/30 hover:bg-[#4a9eff]/5",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border border-[#4a9eff]/20 bg-[#4a9eff]/8 text-[#4a9eff]",
    projectCard: "border border-[#4a9eff]/15 bg-[#0a1628] p-4 text-[#ddeeff]/80",
    projectCardAlt: "border border-[#4a9eff]/20 bg-[#0d1f3a]/60 p-4 text-[#ddeeff]/80",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#4a9eff]/20 bg-[#4a9eff]/5 text-[#4a9eff]/55 transition-colors hover:border-[#4a9eff]/50 hover:text-[#4a9eff]",
    chip: "border border-[#4a9eff]/20 bg-[#4a9eff]/5 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4a9eff]/60",
    footer: "mt-8 text-center text-[10px] uppercase tracking-widest text-[#ddeeff]/15",
    divider: "my-4 border-t border-[#4a9eff]/15",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TERRACOTTA — MAGAZINE · burnt orange + sand
// ─────────────────────────────────────────────────────────────────────────────
const terracottaTemplate: ProfileTemplateDefinition = {
  id: "terracotta",
  label: "Terracotta",
  description: "Burnt orange, sand, and warm clay. Mediterranean artisanal warmth.",
  layout: "magazine",
  styles: {
    page: "min-h-dvh bg-[#f2ebe0] text-[#2c1810] [background-image:radial-gradient(ellipse_80%_60%_at_80%_10%,#c8541a18_0%,transparent_55%),radial-gradient(ellipse_60%_40%_at_10%_90%,#8b4a1a12_0%,transparent_50%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-20 pt-10 sm:px-6",
    stackHeroCard: "rounded-2xl border border-[#c8541a]/15 bg-[#faf5ec] p-6 shadow-sm",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    magazineMain: "w-full pb-20",
    magazineHeroBanner: "w-full border-b border-[#c8541a]/15 bg-[#faf5ec] px-6 py-12 sm:px-10 lg:grid lg:grid-cols-[1fr_280px] lg:items-end lg:gap-10 lg:px-14 lg:py-16 xl:px-20",
    magazineGrid: "px-6 pt-6 sm:px-10 lg:px-14 xl:px-20 grid grid-cols-1 gap-4 lg:grid-cols-3",
    magazineColWide: "lg:col-span-2 flex flex-col gap-4",
    magazineColNarrow: "lg:col-span-1 flex flex-col gap-4",
    heroName: "mt-4 text-4xl font-bold tracking-tight text-[#2c1810] sm:text-5xl lg:text-6xl",
    heroHeadline: "mt-2 text-sm font-medium leading-snug text-[#c8541a]/80",
    heroBio: "mt-3 text-sm leading-relaxed text-[#2c1810]/48",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-[#c8541a]/20 bg-[#c8541a]/8 px-3 py-1 text-[11px] font-medium text-[#c8541a]/80",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#c8541a] px-3 py-1 text-[11px] font-semibold text-[#faf5ec]",
    section: "rounded-2xl border border-[#c8541a]/12 bg-[#faf5ec] p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#c8541a]/45",
    ctaPrimary: "inline-flex items-center gap-2 rounded-xl bg-[#c8541a] px-5 py-2.5 text-sm font-semibold text-[#faf5ec] transition-colors hover:bg-[#a84215]",
    ctaOutline: "inline-flex items-center gap-2 rounded-xl border border-[#c8541a]/25 bg-transparent px-5 py-2.5 text-sm font-medium text-[#2c1810]/65 transition-colors hover:border-[#c8541a]/50",
    linkRow: "flex items-center gap-3 rounded-xl border border-[#c8541a]/12 bg-[#f5ede0] px-4 py-3 text-[#2c1810]/65 transition-all hover:border-[#c8541a]/25 hover:bg-[#faf0e4]",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c8541a]/10 text-[#c8541a]",
    projectCard: "rounded-2xl border border-[#c8541a]/10 bg-[#f5ede0] p-4",
    projectCardAlt: "rounded-2xl border border-[#c8541a]/15 bg-[#faf5ec] p-4",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-lg border border-[#c8541a]/15 bg-[#c8541a]/5 text-[#c8541a]/60 transition-colors hover:border-[#c8541a]/35 hover:text-[#c8541a]",
    chip: "rounded-full border border-[#c8541a]/15 bg-[#c8541a]/8 px-3 py-0.5 text-xs font-medium text-[#c8541a]/70",
    footer: "mt-8 text-center text-xs text-[#2c1810]/30",
    divider: "my-4 border-t border-[#c8541a]/10",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// VOID — SIDEBAR · pure black · brutalist monochrome
// ─────────────────────────────────────────────────────────────────────────────
const voidTemplate: ProfileTemplateDefinition = {
  id: "void",
  label: "Void",
  description: "Pure black, razor-thin white lines, brutalist typographic monochrome.",
  layout: "sidebar",
  styles: {
    page: "min-h-dvh bg-[#000000] text-[#f5f5f5]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-20 pt-10 sm:px-6",
    stackHeroCard: "border-b border-white/15 pb-8",
    sidebarOuter: SIDEBAR_OUTER,
    sidebarLeft: "w-full px-6 pt-10 pb-6 md:sticky md:top-0 md:h-screen md:w-[260px] md:shrink-0 md:overflow-y-auto md:border-r md:border-white/10 md:px-8 md:py-10 lg:w-[300px]",
    sidebarRight: "flex-1 px-6 pb-20 pt-2 md:px-10 md:pt-10 md:max-w-2xl lg:max-w-3xl",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    heroName: "mt-4 text-4xl font-black uppercase tracking-tight leading-none text-white sm:text-5xl md:text-6xl",
    heroHeadline: "mt-3 text-[10px] font-normal uppercase tracking-[0.35em] text-white/38",
    heroBio: "mt-4 text-sm leading-relaxed text-white/28",
    pill: "inline-flex items-center gap-1.5 border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38",
    pillAccent: "inline-flex items-center gap-1.5 border border-white bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black",
    section: "mt-4 border-t border-white/10 pt-4",
    sectionTitle: "inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-white/22",
    ctaPrimary: "inline-flex items-center gap-2 border border-white bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-white/90",
    ctaOutline: "inline-flex items-center gap-2 border border-white/18 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/48 transition-colors hover:border-white/40 hover:text-white/80",
    linkRow: "flex items-center gap-3 border-b border-white/8 py-3.5 text-white/52 transition-colors hover:text-white/90 last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border border-white/10",
    projectCard: "border-b border-white/8 py-5 last:border-b-0",
    projectCardAlt: "border border-white/10 p-4",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-white/12 text-white/28 transition-colors hover:border-white/35 hover:text-white/70",
    chip: "border border-white/12 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/32",
    footer: "mt-10 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-white/15",
    divider: "my-4 border-t border-white/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CANDY — STACK · pastel rainbow · bubbly Y2K
// ─────────────────────────────────────────────────────────────────────────────
const candyTemplate: ProfileTemplateDefinition = {
  id: "candy",
  label: "Candy",
  description: "Pastel rainbow gradients, bubbly rounded UI, playful Y2K revival energy.",
  layout: "stack",
  styles: {
    page: "min-h-dvh text-[#2d1f4e] bg-[linear-gradient(135deg,#ffd6e7_0%,#ffe8d6_20%,#feffd6_40%,#d6ffe8_60%,#d6e8ff_80%,#ead6ff_100%)]",

    // Mobile: centered single column
    stackMain: "mx-auto w-full max-w-[600px] px-4 pb-20 pt-10 sm:px-6 lg:max-w-3xl lg:px-8 xl:max-w-4xl",
    stackHeroCard: "rounded-[28px] border-2 border-white/80 bg-white/60 p-6 shadow-[0_8px_32px_rgba(150,100,255,0.12)] backdrop-blur-md",

    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",

    heroName: "mt-4 bg-[linear-gradient(135deg,#ff6eb4,#ff9d6e,#ffd96e,#6ed9ff,#b06eff)] bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl",
    heroHeadline: "mt-2 text-base font-semibold leading-snug text-[#2d1f4e]/62",
    heroBio: "mt-3 text-sm leading-relaxed text-[#2d1f4e]/48",
    pill: "inline-flex items-center gap-1.5 rounded-full border-2 border-white/70 bg-white/50 px-3 py-1 text-[11px] font-bold text-[#2d1f4e]/68",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#ff6eb4,#b06eff)] px-3 py-1 text-[11px] font-bold text-white shadow-[0_2px_12px_rgba(180,100,255,0.3)]",
    section: "mt-4 rounded-[24px] border-2 border-white/75 bg-white/55 p-5 shadow-[0_4px_20px_rgba(150,100,255,0.08)] backdrop-blur-md",
    sectionTitle: "inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#2d1f4e]/32",
    ctaPrimary: "inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff6eb4,#b06eff)] px-5 py-2.5 text-sm font-black text-white shadow-[0_4px_15px_rgba(180,100,255,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(180,100,255,0.5)]",
    ctaOutline: "inline-flex items-center gap-2 rounded-2xl border-2 border-[#2d1f4e]/15 bg-white/60 px-5 py-2.5 text-sm font-bold text-[#2d1f4e]/68 transition-all hover:border-[#2d1f4e]/30 hover:bg-white/80",
    linkRow: "flex items-center gap-3 rounded-2xl border-2 border-white/70 bg-white/50 px-4 py-3 text-[#2d1f4e]/68 transition-all hover:border-white/90 hover:bg-white/70",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ffd6e7,#d6e8ff)] text-[#b06eff]",
    projectCard: "rounded-2xl border-2 border-white/70 bg-white/45 p-4 backdrop-blur-sm",
    projectCardAlt: "rounded-2xl border-2 border-white/80 bg-white/60 p-4",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-xl border-2 border-white/70 bg-white/50 text-[#b06eff]/68 transition-all hover:border-[#b06eff]/30 hover:bg-white/80",
    chip: "rounded-full border-2 border-white/70 bg-white/50 px-3 py-0.5 text-xs font-bold text-[#2d1f4e]/58",
    footer: "mt-8 text-center text-xs font-semibold text-[#2d1f4e]/28",
    divider: "my-4 border-t-2 border-white/60",
  },
};

// ─────────────────────────────────────────────────────────────────────────────

const templates: Record<ProfileTemplateId, ProfileTemplateDefinition> = {
  linkboard: linkboardTemplate,
  dusk: duskTemplate,
  chalk: chalkTemplate,
  forest: forestTemplate,
  neon: neonTemplate,
  ivory: ivoryTemplate,
  blueprint: blueprintTemplate,
  terracotta: terracottaTemplate,
  void: voidTemplate,
  candy: candyTemplate,
};

export function resolveProfileTemplate(
  templateId?: ProfileTemplateId,
): ProfileTemplateDefinition {
  if (templateId && templates[templateId]) {
    return templates[templateId];
  }
  return templates[defaultProfileTemplateId];
}

export function listTemplates(): ProfileTemplateDefinition[] {
  return Object.values(templates);
}