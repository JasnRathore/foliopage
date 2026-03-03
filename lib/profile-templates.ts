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
  | "candy"
  | "swiss"
  // new layouts
  | "horizon"       // split-screen
  | "odyssey"       // scrollytelling (bg image)
  | "mosaic"        // modular grid
  | "cinematic"     // full-screen imagery (bg image)
  | "current"       // Z-pattern
  | "dispatch"      // F-pattern
  | "morning"       // dark teal/orange magazine
  | "elegance"      // white serif bento luxury
  | "sailho"        // white teal sidebar nautical
  | "device"        // dark high-contrast serif z-pattern
  // editorial — anti-scroll-monotony layouts
  | "manuscript"    // dark ink + gold, Cormorant, typographic density contrasts
  | "verdict";      // chalk/tungsten inversions, Bebas Neue, color-per-project zones

export type ProfileLayoutVariant =
  | "stack"
  | "sidebar"
  | "magazine"
  | "bento"
  | "split"
  | "scrollytelling"
  | "modular"
  | "fullscreen"
  | "zpattern"
  | "fpattern";

export interface ProfileTemplateStyles {
  // Font
  fontImport: string;
  fontBody: string;
  fontDisplay: string;

  // Page shell
  page: string;

  // STACK layout
  stackMain: string;
  stackHeroCard: string;

  // SIDEBAR layout (md+)
  sidebarOuter: string;
  sidebarLeft: string;
  sidebarRight: string;
  // Sidebar-specific design tokens (Linear-inspired app-nav style)
  sidebarImageRing: string;       // ring on the avatar
  sidebarNavSection: string;      // group label ("CONNECT", "IDENTITY") — uppercase, tiny, muted
  sidebarNavItem: string;         // base nav row — icon + label, no bg
  sidebarNavIcon: string;         // 16px icon wrapper — neutral, no border
  sidebarNavItemHover: string;    // filled-rect hover/active state class applied via group
  sidebarMeta: string;            // small muted meta text (uni, location)
  sidebarDivider: string;         // thin rule between sidebar sections
  sidebarResumeCard: string;      // resume area (subtle inset card)
  sidebarProjectCard: string;     // right-column project card
  sidebarProjectIndex: string;    // "01" index label
  sidebarProjectTitle: string;    // project title in right column
  sidebarSkillGroup: string;      // skill category wrapper
  sidebarExpItem: string;         // experience item wrapper
  sidebarExpRole: string;         // role title
  sidebarExpOrg: string;          // org name
  sidebarExpBullet: string;       // bullet text

  // MAGAZINE layout (lg+)
  magazineMain: string;
  magazineHeroBanner: string;
  magazineGrid: string;
  magazineColWide: string;
  magazineColNarrow: string;

  // BENTO layout (lg+)
  bentoMain: string;
  bentoGrid: string;
  bentoHero: string;
  bentoConnect: string;
  bentoResume: string;
  bentoProjects: string;
  bentoSkills: string;
  bentoExperience: string;

  // SPLIT layout — left panel fixed, right scrolls
  splitOuter: string;
  splitLeft: string;           // fixed identity panel (50vw on lg+)
  splitLeftInner: string;      // inner scroll container for left
  splitRight: string;          // scrollable content panel
  splitDivider: string;        // the visible line / gap between panels
  splitHeroArea: string;       // name/headline block inside left panel

  // SCROLLYTELLING layout — full-height snap sections with bg image
  stSection: string;           // each snap section wrapper (100dvh)
  stHeroSection: string;       // first section — bg image hero
  stContentSection: string;    // subsequent content sections
  stHeroOverlay: string;       // color overlay on top of bg image
  stHeroContent: string;       // inner content inside hero
  stSectionInner: string;      // centered inner wrapper for content sections
  stProjectCard: string;       // project card in scrollytelling
  stNavDot: string;            // scroll progress dot (inactive)
  stNavDotActive: string;      // scroll progress dot (active)

  // MODULAR GRID layout — mosaic of variable-span tiles
  modularGrid: string;         // the CSS grid container
  modularHeroTile: string;     // hero tile (spans 2 cols, 2 rows on lg)
  modularProjectTile: string;  // single project tile
  modularSkillsTile: string;   // skills tile
  modularExpTile: string;      // experience tile
  modularConnectTile: string;  // connect/contact tile
  modularResumeTile: string;   // resume tile

  // FULLSCREEN layout — 100dvh bg-image hero, content below
  fsHero: string;              // 100dvh hero section with bg image
  fsHeroOverlay: string;       // overlay on bg image
  fsHeroContent: string;       // centered content inside hero
  fsContent: string;           // below-hero content area
  fsSection: string;           // content section in below-hero area
  fsProjectCard: string;       // project card in fullscreen layout

  // Z-PATTERN layout — alternating left/right content blocks
  zpOuter: string;             // page wrapper
  zpHero: string;              // top hero (full-width)
  zpBlock: string;             // single alternating block wrapper
  zpBlockText: string;         // text side of a Z block
  zpBlockVisual: string;       // visual / accent side of a Z block
  zpBlockAlt: string;          // flipped variant (text right, visual left)

  // F-PATTERN layout — strong left rail, content scans in F
  fpOuter: string;             // page wrapper
  fpHero: string;              // top full-width header bar
  fpRail: string;              // left rail (wide, ~40%)
  fpStream: string;            // right stream of content items
  fpStreamItem: string;        // single F-stream item (project/skill row)
  fpStreamItemAlt: string;     // alternate-style stream item

  // Scrollbar
  scrollbarCss: string; // injected as raw CSS via <style> tag

  // Shared tokens
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
  requiresBgImage?: boolean;   // when true, template picker shows bg image upload UI
  styles: ProfileTemplateStyles;
}

export const defaultProfileTemplateId: ProfileTemplateId = "linkboard";

const SIDEBAR_OUTER = "flex w-full min-h-dvh flex-col md:flex-row";
const SIDEBAR_LEFT = "w-full px-5 pt-10 pb-6 md:sticky md:top-0 md:h-screen md:w-[280px] md:shrink-0 md:overflow-y-auto md:px-8 md:py-10 lg:w-[320px]";
const SIDEBAR_RIGHT = "flex-1 px-5 pb-14 pt-2 md:px-8 md:pt-10 md:max-w-2xl lg:max-w-3xl";

/** Generate a minimal webkit + standard scrollbar CSS block. */
function sb(opts: {
  size?: number;       // track width/height in px (default 8)
  trackBg: string;    // track background color
  thumbBg: string;    // thumb background color
  thumbHover: string; // thumb hover color
  radius?: number;    // thumb border-radius in px (default 4)
  border?: string;    // optional border on thumb (e.g. "2px solid #000")
}): string {
  const size = opts.size ?? 8;
  const radius = opts.radius ?? 4;
  const border = opts.border ? `border: ${opts.border};` : "";
  return [
    `* { scrollbar-width: thin; scrollbar-color: ${opts.thumbBg} ${opts.trackBg}; }`,
    `*::-webkit-scrollbar { width: ${size}px; height: ${size}px; }`,
    `*::-webkit-scrollbar-track { background: ${opts.trackBg}; }`,
    `*::-webkit-scrollbar-thumb { background: ${opts.thumbBg}; border-radius: ${radius}px; ${border} }`,
    `*::-webkit-scrollbar-thumb:hover { background: ${opts.thumbHover}; }`,
  ].join(" ");
}

// ─────────────────────────────────────────────────────────────────────────────
// LINKBOARD — STACK · warm parchment · Fraunces + DM Sans — POLISHED
// Editorial card stack, foliopage signature template
// ─────────────────────────────────────────────────────────────────────────────
const linkboardTemplate: ProfileTemplateDefinition = {
  id: "linkboard",
  label: "Linkboard",
  description: "Warm parchment, foliopage brand red, editorial card stack.",
  layout: "stack",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,900;1,9..144,400;1,9..144,600&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap",
    fontBody: "'DM Sans', sans-serif",
    fontDisplay: "'Fraunces', serif",
    page: "min-h-dvh bg-[#f4efe5] text-[#1a1714] [background-image:radial-gradient(ellipse_130%_55%_at_70%_-5%,#d4e84a2a_0%,transparent_50%),radial-gradient(ellipse_80%_40%_at_0%_100%,#f0430820_0%,transparent_55%),radial-gradient(ellipse_50%_30%_at_100%_60%,#d4e84a14_0%,transparent_50%)]",
    stackMain: "mx-auto w-full max-w-[640px] px-4 pb-16 pt-6 sm:px-6 lg:max-w-3xl lg:px-10 xl:max-w-4xl xl:px-12",
    stackHeroCard: "rounded-3xl border border-black/[0.08] bg-white/80 p-6 shadow-[0_4px_32px_rgba(0,0,0,0.08)] backdrop-blur-md",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ trackBg: "#ede8de", thumbBg: "#c8c0b0", thumbHover: "#a89f90", radius: 6, size: 8 }),
    heroName: "mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl [font-variation-settings:'SOFT'_0,'WONK'_1]",
    heroHeadline: "mt-2 text-base font-medium leading-snug text-[#1a1714]/60",
    heroBio: "mt-3 text-sm leading-relaxed text-[#1a1714]/48",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-black/[0.12] bg-white/90 px-3 py-1 text-[11px] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#d4e84a] px-3 py-1 text-[11px] font-bold text-[#252800] shadow-[0_2px_8px_rgba(212,232,74,0.3)]",
    section: "mt-4 rounded-3xl border border-black/[0.07] bg-white/85 p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#1a1714]/35",
    ctaPrimary: "inline-flex items-center gap-2 rounded-2xl bg-[#f04939] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(240,73,57,0.3)] transition-all hover:bg-[#d63a2c] hover:shadow-[0_4px_16px_rgba(240,73,57,0.4)] hover:-translate-y-px",
    ctaOutline: "inline-flex items-center gap-2 rounded-2xl border border-black/[0.15] bg-white/80 px-5 py-2.5 text-sm font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all hover:border-black/30 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]",
    linkRow: "flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/65 px-4 py-3 transition-all hover:border-black/[0.18] hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f4efe5]",
    projectCard: "rounded-2xl border border-black/[0.08] bg-[#faf7f1] p-4 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)]",
    projectCardAlt: "rounded-2xl border border-black/[0.08] bg-white/90 p-4 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)]",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-xl border border-black/[0.12] bg-white/90 transition-all hover:border-black/25 hover:bg-white hover:shadow-[0_1px_4px_rgba(0,0,0,0.1)]",
    chip: "rounded-full border border-black/[0.1] bg-white/80 px-3 py-0.5 text-xs font-medium",
    footer: "mt-10 text-center text-xs font-medium text-[#1a1714]/30",
    divider: "my-4 border-t border-black/[0.07]",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SWISS — BENTO · #E04038 red · Source Sans 3 — POLISHED
// Swiss International Style, bold red/black/white grid
// ─────────────────────────────────────────────────────────────────────────────
const swissTemplate: ProfileTemplateDefinition = {
  id: "swiss",
  label: "Swiss",
  description: "Swiss International Style. Source Sans 3, bold red/black/white bento grid.",
  layout: "bento",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700;900&display=swap",
    fontBody: "'Source Sans 3', sans-serif",
    fontDisplay: "'Source Sans 3', sans-serif",
    page: "min-h-dvh bg-[#E04038] text-[#000000]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-12 pt-6",
    stackHeroCard: "border-[3px] border-black bg-white p-6",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "w-full min-h-dvh pb-0",
    bentoGrid: [
      "grid grid-cols-1 gap-0",
      "lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]",
      "[&>*]:border-b-[3px] [&>*]:border-black lg:[&>*]:border-b-0 lg:[&>*]:border-r-[3px] lg:[&>*]:last:border-r-0",
    ].join(" "),
    bentoHero: [
      "col-span-1 bg-[#E04038] px-8 py-10 border-b-[3px] border-black",
      "lg:col-span-3 lg:border-b-[3px] lg:px-16 lg:py-10",
      "xl:px-24 xl:py-14",
    ].join(" "),
    bentoProjects: [
      "col-span-1 bg-white px-6 py-8 border-b-[3px] border-black",
      "lg:col-span-2 lg:row-span-1 lg:border-b-[3px] lg:px-10 lg:py-10",
    ].join(" "),
    bentoConnect: [
      "col-span-1 bg-black px-6 py-8 border-b-[3px] border-black text-white",
      "lg:col-span-1 lg:row-span-2 lg:border-b-[3px] lg:px-8 lg:py-10",
    ].join(" "),
    bentoResume: [
      "col-span-1 bg-white px-6 py-8 border-b-[3px] border-black",
      "lg:col-span-2 lg:px-10 lg:py-10",
    ].join(" "),
    bentoSkills: [
      "col-span-1 bg-[#E04038] px-6 py-8 border-b-[3px] border-black",
      "lg:col-span-1 lg:px-8 lg:py-10",
    ].join(" "),
    bentoExperience: [
      "col-span-1 bg-white px-6 py-8",
      "lg:col-span-3 lg:px-16 lg:py-10",
    ].join(" "),
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 10, trackBg: "#E04038", thumbBg: "#000000", thumbHover: "#222222", radius: 0, border: "2px solid #E04038" }),
    heroName: "mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-[8rem] xl:text-[11rem]",
    heroHeadline: "mt-5 text-xs font-black uppercase tracking-[0.3em] text-black/55",
    heroBio: "mt-3 text-base font-normal leading-relaxed text-black/65 lg:max-w-2xl",
    pill: "inline-flex items-center gap-1.5 border-[2px] border-black bg-transparent px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black",
    pillAccent: "inline-flex items-center gap-1.5 border-[2px] border-black bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white",
    section: "mt-6 border-t-[3px] border-black pt-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black/38",
    ctaPrimary: "inline-flex items-center gap-2 border-[3px] border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#E04038] hover:text-black",
    ctaOutline: "inline-flex items-center gap-2 border-[3px] border-black bg-transparent px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white",
    linkRow: "flex items-center gap-3 border-b-[2px] border-white/20 py-3.5 text-white/80 transition-colors hover:text-white last:border-b-0",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border-[2px] border-white/25",
    projectCard: "border-[3px] border-black bg-[#E04038] p-5",
    projectCardAlt: "border-[3px] border-black bg-white p-5",
    iconBtn: "flex h-8 w-8 items-center justify-center border-[3px] border-black bg-transparent text-black transition-all hover:bg-black hover:text-white",
    chip: "border-[2px] border-black bg-transparent px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black",
    footer: "col-span-1 lg:col-span-3 bg-black border-t-[3px] border-black py-5 text-center text-[10px] font-black uppercase tracking-[0.35em] text-white/35",
    divider: "my-0 border-t-[3px] border-black",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DUSK — SIDEBAR · dark amber/gold · Clash Display + Cabinet Grotesk
// Warm dark academia — deep espresso with saffron highlights
// ─────────────────────────────────────────────────────────────────────────────
const duskTemplate: ProfileTemplateDefinition = {
  id: "dusk",
  label: "Dusk",
  description: "Dark academia amber. Rich espresso tones with warm gold highlights.",
  layout: "sidebar",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap",
    fontBody: "'Crimson Pro', serif",
    fontDisplay: "'Playfair Display', serif",
    page: "min-h-dvh bg-[#1a1208] text-[#f0e8d8] [background-image:radial-gradient(ellipse_90%_60%_at_15%_0%,#3d2a0838_0%,transparent_65%),radial-gradient(ellipse_60%_40%_at_85%_100%,#4a2e0528_0%,transparent_55%),radial-gradient(ellipse_40%_35%_at_60%_50%,#c8941a08_0%,transparent_60%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border border-[#c8941a]/20 bg-[#221a08]/80 p-6 backdrop-blur-sm",
    sidebarOuter: "flex w-full min-h-dvh flex-col md:flex-row",
    sidebarLeft: "w-full shrink-0 px-3 pt-4 pb-4 md:sticky md:top-0 md:h-screen md:w-[240px] md:overflow-y-auto md:border-r md:border-[#c8941a]/12 lg:w-[260px] flex flex-col gap-0",
    sidebarRight: "flex-1 min-w-0 px-6 pb-16 pt-8 md:px-10 md:pt-10",
    sidebarImageRing: "ring-1 ring-[#c8941a]/40 ring-offset-1 ring-offset-[#1a1208]",
    sidebarNavSection: "mt-4 mb-0.5 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0e8d8]/25 select-none",
    sidebarNavItem: "group relative flex w-full items-center gap-2.5 rounded-md px-2 py-[5px] text-[13px] text-[#f0e8d8]/55 transition-colors hover:text-[#f0e8d8]/90",
    sidebarNavItemHover: "before:absolute before:inset-0 before:rounded-md before:bg-[#c8941a]/8 before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
    sidebarNavIcon: "shrink-0 text-[#f0e8d8]/35 group-hover:text-[#c8941a]/80 transition-colors",
    sidebarMeta: "text-[11px] text-[#f0e8d8]/30 leading-snug",
    sidebarDivider: "my-3 border-t border-[#c8941a]/10",
    sidebarResumeCard: "mx-1 rounded-md border border-[#c8941a]/15 bg-[#c8941a]/5 px-3 py-2.5",
    sidebarProjectCard: "rounded-lg border border-[#c8941a]/15 bg-[#221a08]/80 p-4 transition-all hover:border-[#c8941a]/32 hover:bg-[#221a08]/95 hover:shadow-[0_0_12px_rgba(200,148,26,0.08)]",
    sidebarProjectIndex: "text-[10px] font-semibold tabular-nums tracking-widest text-[#c8941a]/45",
    sidebarProjectTitle: "font-semibold text-[#f7e9cc] leading-snug",
    sidebarSkillGroup: "flex flex-col gap-2",
    sidebarExpItem: "relative pl-3 before:absolute before:left-0 before:top-[6px] before:h-[calc(100%-6px)] before:w-px before:bg-[#c8941a]/20",
    sidebarExpRole: "text-sm font-semibold text-[#f7e9cc] leading-tight",
    sidebarExpOrg: "text-xs text-[#c8941a]/65 mt-0.5",
    sidebarExpBullet: "text-sm text-[#f0e8d8]/45",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ trackBg: "#0f0a02", thumbBg: "#4a3010", thumbHover: "#c8941a", radius: 4, size: 7 }),
    heroName: "mt-4 text-4xl font-bold italic tracking-tight text-[#f7e9cc] md:text-5xl lg:text-6xl xl:text-7xl",
    heroHeadline: "mt-2 text-sm font-normal leading-snug text-[#c8941a]/75 not-italic",
    heroBio: "mt-3 text-sm leading-relaxed text-[#f0e8d8]/42 not-italic",
    pill: "inline-flex items-center gap-1.5 border border-[#c8941a]/25 bg-[#c8941a]/8 px-3 py-1 text-[11px] font-medium text-[#c8941a]/80 not-italic",
    pillAccent: "inline-flex items-center gap-1.5 bg-[#c8941a] px-3 py-1 text-[11px] font-semibold text-[#1a1208] not-italic",
    section: "mt-4 border border-[#c8941a]/12 bg-[#221a08]/60 p-5 backdrop-blur-sm",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c8941a]/45 not-italic",
    ctaPrimary: "inline-flex items-center gap-2 bg-[#c8941a] px-5 py-2.5 text-sm font-semibold text-[#1a1208] transition-all hover:bg-[#e0aa30] not-italic",
    ctaOutline: "inline-flex items-center gap-2 border border-[#c8941a]/30 bg-transparent px-5 py-2.5 text-sm font-medium text-[#f0e8d8]/65 transition-all hover:border-[#c8941a]/55 hover:text-[#f0e8d8]/90 not-italic",
    linkRow: "flex items-center gap-3 border-b border-[#c8941a]/12 py-3.5 text-[#f0e8d8]/60 transition-colors hover:text-[#c8941a] last:border-b-0",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border border-[#c8941a]/20 bg-[#c8941a]/8 text-[#c8941a]",
    projectCard: "border border-[#c8941a]/12 bg-[#1a1208] p-5 text-[#f0e8d8]/78",
    projectCardAlt: "border border-[#c8941a]/18 bg-[#221a08]/60 p-5 text-[#f0e8d8]/78",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#c8941a]/18 bg-[#c8941a]/5 text-[#c8941a]/55 transition-colors hover:border-[#c8941a]/45 hover:text-[#c8941a]",
    chip: "border border-[#c8941a]/20 bg-[#c8941a]/8 px-3 py-0.5 text-xs font-medium text-[#c8941a]/70",
    footer: "mt-8 text-center text-xs text-[#f0e8d8]/18",
    divider: "my-4 border-t border-[#c8941a]/12",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CHALK — MAGAZINE · midnight + chalk white · Big Shoulders Display + Lora
// Punchy editorial — ink-on-paper raw energy, editorial magazine feel
// ─────────────────────────────────────────────────────────────────────────────
const chalkTemplate: ProfileTemplateDefinition = {
  id: "chalk",
  label: "Chalk",
  description: "Midnight ink, chalk-white paper. Big editorial impact, Lora body type.",
  layout: "magazine",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap",
    fontBody: "'Lora', serif",
    fontDisplay: "'Big Shoulders Display', sans-serif",
    page: "min-h-dvh bg-[#f7f4ef] text-[#111111] [background-image:url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23000000' fill-opacity='0.025'/%3E%3C/svg%3E\")]",
    stackMain: "mx-auto w-full max-w-[540px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border-b-[3px] border-[#111111] pb-8",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "w-full pb-20",
    magazineHeroBanner: "w-full border-b-[3px] border-[#111111] bg-[#111111] px-6 py-9 text-[#f7f4ef] sm:px-10 lg:grid lg:grid-cols-[1fr_300px] lg:items-end lg:gap-12 lg:px-16 lg:py-12 xl:px-24 xl:py-16",
    magazineGrid: "px-6 pt-7 sm:px-10 lg:px-16 xl:px-24 grid grid-cols-1 gap-5 lg:grid-cols-3",
    magazineColWide: "lg:col-span-2 flex flex-col gap-5",
    magazineColNarrow: "lg:col-span-1 flex flex-col gap-5",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 10, trackBg: "#f7f4ef", thumbBg: "#111111", thumbHover: "#333333", radius: 0 }),
    heroName: "mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-7xl lg:text-8xl xl:text-[10rem]",
    heroHeadline: "mt-5 text-xs font-medium uppercase tracking-[0.25em] text-[#f7f4ef]/55",
    heroBio: "mt-4 text-sm leading-relaxed text-[#f7f4ef]/48 lg:max-w-lg",
    pill: "inline-flex items-center gap-1.5 border-[2px] border-[#f7f4ef]/30 bg-transparent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#f7f4ef]/70",
    pillAccent: "inline-flex items-center gap-1.5 border-[2px] border-[#f7f4ef] bg-[#f7f4ef] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#111111]",
    section: "border-[2px] border-[#111111]/12 bg-white p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#111111]/35",
    ctaPrimary: "inline-flex items-center gap-2 border-[2px] border-[#f7f4ef] bg-[#f7f4ef] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[#111111] transition-all hover:bg-white",
    ctaOutline: "inline-flex items-center gap-2 border-[2px] border-[#111111]/18 bg-transparent px-5 py-2.5 text-sm font-semibold text-[#111111]/65 transition-all hover:border-[#111111]/40",
    linkRow: "flex items-center gap-3 border-[2px] border-[#111111]/10 bg-[#f7f4ef] px-4 py-3 transition-all hover:border-[#111111]/30 hover:bg-white",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border-[2px] border-[#111111]/12",
    projectCard: "border-[2px] border-[#111111]/10 bg-[#111111] p-5 text-[#f7f4ef]",
    projectCardAlt: "border-[2px] border-[#111111]/10 bg-white p-5 text-[#111111]",
    iconBtn: "flex h-7 w-7 items-center justify-center border-[2px] border-[#111111]/15 transition-colors hover:border-[#111111]/45",
    chip: "border-[2px] border-[#111111]/10 px-3 py-0.5 text-xs font-semibold",
    footer: "mt-8 text-center text-xs font-medium text-[#111111]/28",
    divider: "my-4 border-t-[2px] border-[#111111]/10",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FOREST — SIDEBAR · deep teal-black · Tenor Sans + Mulish
// Bioluminescent forest floor — dark teal with electric emerald glow
// ─────────────────────────────────────────────────────────────────────────────
const forestTemplate: ProfileTemplateDefinition = {
  id: "forest",
  label: "Forest",
  description: "Deep teal, bioluminescent emerald glow. Organic and refined.",
  layout: "sidebar",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Mulish:wght@300;400;500;600&display=swap",
    fontBody: "'Mulish', sans-serif",
    fontDisplay: "'Tenor Sans', sans-serif",
    page: "min-h-dvh bg-[#080f0e] text-[#d4ede6] [background-image:radial-gradient(ellipse_100%_65%_at_20%_-10%,#0a3d2a42_0%,transparent_60%),radial-gradient(ellipse_50%_35%_at_80%_110%,#0d3d2828_0%,transparent_50%),radial-gradient(ellipse_30%_20%_at_50%_50%,#1aff8c06_0%,transparent_60%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border border-[#1aff8c]/12 bg-[#0c1a16]/70 p-6 backdrop-blur-sm",
    sidebarOuter: "flex w-full min-h-dvh flex-col md:flex-row",
    sidebarLeft: "w-full shrink-0 px-3 pt-4 pb-4 md:sticky md:top-0 md:h-screen md:w-[240px] md:overflow-y-auto md:border-r md:border-[#1aff8c]/8 lg:w-[260px] flex flex-col gap-0",
    sidebarRight: "flex-1 min-w-0 px-6 pb-16 pt-8 md:px-10 md:pt-10",
    sidebarImageRing: "ring-1 ring-[#1aff8c]/28 ring-offset-1 ring-offset-[#080f0e]",
    sidebarNavSection: "mt-4 mb-0.5 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4ede6]/20 select-none",
    sidebarNavItem: "group relative flex w-full items-center gap-2.5 rounded-md px-2 py-[5px] text-[13px] text-[#d4ede6]/48 transition-colors hover:text-[#d4ede6]/85",
    sidebarNavItemHover: "before:absolute before:inset-0 before:rounded-md before:bg-[#1aff8c]/6 before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
    sidebarNavIcon: "shrink-0 text-[#d4ede6]/28 group-hover:text-[#1aff8c]/70 transition-colors",
    sidebarMeta: "text-[11px] text-[#d4ede6]/25 leading-snug",
    sidebarDivider: "my-3 border-t border-[#1aff8c]/8",
    sidebarResumeCard: "mx-1 rounded-md border border-[#1aff8c]/10 bg-[#1aff8c]/4 px-3 py-2.5",
    sidebarProjectCard: "rounded-lg border border-[#1aff8c]/10 bg-[#0c1a16]/50 p-4 transition-all hover:border-[#1aff8c]/22 hover:bg-[#0c1a16]/70",
    sidebarProjectIndex: "text-[10px] tabular-nums tracking-widest text-[#1aff8c]/38",
    sidebarProjectTitle: "font-normal tracking-wide text-[#d4ede6] leading-snug",
    sidebarSkillGroup: "flex flex-col gap-2",
    sidebarExpItem: "relative pl-3 before:absolute before:left-0 before:top-[6px] before:h-[calc(100%-6px)] before:w-px before:bg-[#1aff8c]/18",
    sidebarExpRole: "text-sm font-medium text-[#d4ede6] leading-tight",
    sidebarExpOrg: "text-xs text-[#1aff8c]/55 mt-0.5",
    sidebarExpBullet: "text-sm text-[#d4ede6]/40",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 7, trackBg: "#040a08", thumbBg: "#0a2a1a", thumbHover: "#1aff8c", radius: 4 }),
    heroName: "mt-4 text-4xl font-normal tracking-wide text-[#d4ede6] md:text-5xl lg:text-6xl xl:text-7xl",
    heroHeadline: "mt-2 text-sm font-light leading-snug text-[#1aff8c]/55",
    heroBio: "mt-3 text-sm leading-relaxed text-[#d4ede6]/38",
    pill: "inline-flex items-center gap-1.5 border border-[#1aff8c]/18 bg-[#1aff8c]/5 px-3 py-1 text-[11px] font-light text-[#d4ede6]/60",
    pillAccent: "inline-flex items-center gap-1.5 bg-[#1aff8c] px-3 py-1 text-[11px] font-semibold text-[#080f0e] shadow-[0_0_12px_rgba(26,255,140,0.35)]",
    section: "mt-4 border border-[#1aff8c]/8 bg-[#0c1a16]/50 p-5 backdrop-blur-sm",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1aff8c]/38",
    ctaPrimary: "inline-flex items-center gap-2 bg-[#1aff8c] px-5 py-2.5 text-sm font-semibold text-[#080f0e] shadow-[0_2px_16px_rgba(26,255,140,0.3)] transition-all hover:bg-[#40ffaa] hover:shadow-[0_4px_24px_rgba(26,255,140,0.45)]",
    ctaOutline: "inline-flex items-center gap-2 border border-[#1aff8c]/22 bg-transparent px-5 py-2.5 text-sm font-light text-[#d4ede6]/65 transition-all hover:border-[#1aff8c]/45 hover:text-[#d4ede6]/90",
    linkRow: "flex items-center gap-3 border-b border-[#1aff8c]/8 py-3.5 text-[#d4ede6]/55 transition-colors hover:text-[#1aff8c] last:border-b-0",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border border-[#1aff8c]/15 bg-[#1aff8c]/5 text-[#1aff8c]/70",
    projectCard: "border border-[#1aff8c]/10 bg-[#080f0e] p-5 text-[#d4ede6]/75 transition-all hover:border-[#1aff8c]/22 hover:shadow-[0_0_20px_rgba(26,255,140,0.06)]",
    projectCardAlt: "border border-[#1aff8c]/14 bg-[#0c1a16]/60 p-5 text-[#d4ede6]/75 transition-all hover:border-[#1aff8c]/28",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#1aff8c]/14 bg-[#1aff8c]/4 text-[#1aff8c]/50 transition-colors hover:border-[#1aff8c]/38 hover:text-[#1aff8c]",
    chip: "border border-[#1aff8c]/14 bg-[#1aff8c]/5 px-3 py-0.5 text-xs font-light text-[#1aff8c]/60",
    footer: "mt-8 text-center text-xs font-light text-[#d4ede6]/18",
    divider: "my-4 border-t border-[#1aff8c]/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// NEON — MAGAZINE · deep violet-black · Exo 2 + Space Mono
// Synthwave — electric violet and magenta, CRT scanline energy
// ─────────────────────────────────────────────────────────────────────────────
const neonTemplate: ProfileTemplateDefinition = {
  id: "neon",
  label: "Neon",
  description: "Synthwave dark. Electric violet and hot magenta on deep purple-black.",
  layout: "magazine",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,700;0,900;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap",
    fontBody: "'Space Mono', monospace",
    fontDisplay: "'Exo 2', sans-serif",
    page: "min-h-dvh bg-[#0c0814] text-[#e8e0ff] [background-image:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(150,80,255,0.022)_3px,rgba(150,80,255,0.022)_4px)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border border-[#9650ff]/28 bg-[#14102a]/80 p-6",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "w-full pb-20",
    magazineHeroBanner: "relative w-full overflow-hidden border-b border-[#9650ff]/18 bg-[#0c0814] px-6 py-9 sm:px-10 lg:grid lg:grid-cols-[1fr_280px] lg:items-end lg:gap-10 lg:px-16 lg:py-12 xl:px-22 before:pointer-events-none before:absolute before:-top-32 before:left-1/4 before:h-64 before:w-96 before:rounded-full before:bg-[#9650ff] before:opacity-[0.08] before:blur-3xl before:content-[''] after:pointer-events-none after:absolute after:bottom-0 after:right-1/4 after:h-48 after:w-64 after:rounded-full after:bg-[#ff2d9f] after:opacity-[0.06] after:blur-3xl after:content-['']",
    magazineGrid: "px-6 pt-6 sm:px-10 lg:px-16 xl:px-22 grid grid-cols-1 gap-4 lg:grid-cols-3",
    magazineColWide: "lg:col-span-2 flex flex-col gap-4",
    magazineColNarrow: "lg:col-span-1 flex flex-col gap-4",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 7, trackBg: "#0c0814", thumbBg: "#2a1060", thumbHover: "#9650ff", radius: 3 }),
    heroName: "mt-5 text-4xl font-black italic uppercase tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-8xl [text-shadow:0_0_40px_rgba(150,80,255,0.8),0_0_80px_rgba(150,80,255,0.4),0_0_120px_rgba(150,80,255,0.2)]",
    heroHeadline: "mt-3 text-[10px] font-normal uppercase tracking-[0.22em] text-[#ff2d9f]/65",
    heroBio: "mt-3 text-xs leading-loose text-[#e8e0ff]/40 lg:max-w-lg",
    pill: "inline-flex items-center gap-1.5 border border-[#9650ff]/35 bg-[#9650ff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9650ff]",
    pillAccent: "inline-flex items-center gap-1.5 border border-[#ff2d9f]/40 bg-[#ff2d9f]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ff2d9f] shadow-[0_0_10px_rgba(255,45,159,0.25)]",
    section: "border border-[#9650ff]/14 bg-[#14102a] p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9650ff]/50",
    ctaPrimary: "inline-flex items-center gap-2 border border-[#9650ff] bg-[#9650ff]/15 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-[#c896ff] shadow-[0_0_20px_rgba(150,80,255,0.3)] transition-all hover:bg-[#9650ff]/30 hover:shadow-[0_0_30px_rgba(150,80,255,0.5)]",
    ctaOutline: "inline-flex items-center gap-2 border border-[#ff2d9f]/30 bg-transparent px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[#ff2d9f] transition-all hover:border-[#ff2d9f]/60 hover:shadow-[0_0_14px_rgba(255,45,159,0.25)]",
    linkRow: "flex items-center gap-3 border border-[#9650ff]/14 bg-[#14102a] px-4 py-3 text-[#e8e0ff]/60 transition-all hover:border-[#9650ff]/35 hover:bg-[#9650ff]/8",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border border-[#9650ff]/25 bg-[#9650ff]/10 text-[#9650ff]",
    projectCard: "border border-[#9650ff]/14 bg-[#0c0814] p-4 text-[#e8e0ff]/78",
    projectCardAlt: "border border-[#ff2d9f]/14 bg-[#14102a] p-4 text-[#e8e0ff]/78",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#9650ff]/22 bg-[#9650ff]/6 text-[#9650ff]/50 transition-all hover:border-[#9650ff]/50 hover:text-[#9650ff]",
    chip: "border border-[#9650ff]/20 bg-[#9650ff]/6 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9650ff]/65",
    footer: "mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-[#e8e0ff]/15",
    divider: "my-4 border-t border-[#9650ff]/14",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// IVORY — STACK · deep charcoal on linen cream · Didact Gothic + Spectral
// Haute editorial — razor-precise luxury, fashion magazine negative space
// ─────────────────────────────────────────────────────────────────────────────
const ivoryTemplate: ProfileTemplateDefinition = {
  id: "ivory",
  label: "Ivory",
  description: "Linen cream, Spectral serif. Ultra-refined haute couture minimalism.",
  layout: "stack",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,600;1,300;1,600&family=Didact+Gothic&display=swap",
    fontBody: "'Didact Gothic', sans-serif",
    fontDisplay: "'Spectral', serif",
    page: "min-h-dvh bg-[#f5f0e8] text-[#221f1a] [background-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#e8ddc820_0%,transparent_65%)]",
    stackMain: "mx-auto w-full max-w-[600px] px-6 pb-18 pt-6 sm:px-8 lg:max-w-2xl lg:px-12 xl:max-w-3xl",
    stackHeroCard: "border-b border-[#221f1a]/12 pb-10",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 6, trackBg: "#f5f0e8", thumbBg: "#d4cec4", thumbHover: "#221f1a", radius: 0 }),
    heroName: "mt-8 text-center font-serif text-5xl font-light italic tracking-[0.02em] text-[#221f1a] sm:text-6xl lg:text-7xl xl:text-8xl",
    heroHeadline: "mt-4 text-center text-[10px] font-normal uppercase tracking-[0.38em] text-[#221f1a]/45",
    heroBio: "mt-5 text-center text-sm leading-[1.85] text-[#221f1a]/48",
    pill: "inline-flex items-center gap-1.5 border border-[#221f1a]/12 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#221f1a]/55",
    pillAccent: "inline-flex items-center gap-1.5 border border-[#221f1a] bg-[#221f1a] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#f5f0e8]",
    section: "mt-6 border-t border-[#221f1a]/8 pt-5",
    sectionTitle: "inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.42em] text-[#221f1a]/30",
    ctaPrimary: "inline-flex items-center gap-3 border border-[#221f1a] bg-[#221f1a] px-7 py-3 text-xs uppercase tracking-[0.22em] text-[#f5f0e8] transition-colors hover:bg-[#3a3631]",
    ctaOutline: "inline-flex items-center gap-3 border border-[#221f1a]/22 px-7 py-3 text-xs uppercase tracking-[0.22em] text-[#221f1a]/60 transition-colors hover:border-[#221f1a]/42",
    linkRow: "flex items-center gap-4 border-b border-[#221f1a]/7 py-4 text-[#221f1a]/60 transition-colors hover:text-[#221f1a]/90 last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center",
    projectCard: "border-b border-[#221f1a]/7 py-6 last:border-b-0",
    projectCardAlt: "border-b border-[#221f1a]/7 py-6 last:border-b-0",
    iconBtn: "flex h-6 w-6 items-center justify-center border border-[#221f1a]/12 text-[#221f1a]/38 transition-colors hover:border-[#221f1a]/32 hover:text-[#221f1a]/65",
    chip: "border border-[#221f1a]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#221f1a]/42",
    footer: "mt-12 text-center text-[9px] uppercase tracking-[0.32em] text-[#221f1a]/22",
    divider: "my-6 border-t border-[#221f1a]/7",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BLUEPRINT — SIDEBAR · phosphor green on black · VT323 + Fira Code
// Terminal hacker — CRT phosphor glow, command-line aesthetic
// ─────────────────────────────────────────────────────────────────────────────
const blueprintTemplate: ProfileTemplateDefinition = {
  id: "blueprint",
  label: "Blueprint",
  description: "Terminal green-on-black. CRT phosphor glow, hacker command-line aesthetic.",
  layout: "sidebar",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=VT323&family=Fira+Code:wght@300;400;500&display=swap",
    fontBody: "'Fira Code', monospace",
    fontDisplay: "'VT323', monospace",
    page: "min-h-dvh bg-[#020602] text-[#33ff55] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(51,255,85,0.018)_2px,rgba(51,255,85,0.018)_4px),radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(51,255,85,0.04)_0%,transparent_60%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border border-[#33ff55]/25 bg-[#020602] p-6",
    sidebarOuter: "flex w-full min-h-dvh flex-col md:flex-row",
    sidebarLeft: "w-full shrink-0 px-3 pt-4 pb-4 md:sticky md:top-0 md:h-screen md:w-[240px] md:overflow-y-auto md:border-r md:border-[#33ff55]/12 lg:w-[260px] flex flex-col gap-0",
    sidebarRight: "flex-1 min-w-0 px-6 pb-16 pt-8 md:px-10 md:pt-10",
    sidebarImageRing: "ring-1 ring-[#33ff55]/25 ring-offset-1 ring-offset-[#020602]",
    sidebarNavSection: "mt-4 mb-0.5 px-2 text-[10px] tracking-[0.18em] uppercase text-[#33ff55]/28 select-none",
    sidebarNavItem: "group relative flex w-full items-center gap-2.5 rounded px-2 py-[5px] text-[13px] text-[#33ff55]/45 transition-colors hover:text-[#33ff55]/90",
    sidebarNavItemHover: "before:absolute before:inset-0 before:rounded before:bg-[#33ff55]/5 before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
    sidebarNavIcon: "shrink-0 text-[#33ff55]/30 group-hover:text-[#33ff55]/75 transition-colors",
    sidebarMeta: "text-[11px] text-[#33ff55]/25 leading-snug",
    sidebarDivider: "my-3 border-t border-[#33ff55]/10",
    sidebarResumeCard: "mx-1 border border-[#33ff55]/15 bg-[#33ff55]/4 px-3 py-2.5",
    sidebarProjectCard: "border border-[#33ff55]/12 bg-[#020602] p-4 transition-all hover:border-[#33ff55]/28",
    sidebarProjectIndex: "text-[10px] tabular-nums tracking-widest text-[#33ff55]/35",
    sidebarProjectTitle: "text-[#33ff55]/90 leading-snug tracking-wide",
    sidebarSkillGroup: "flex flex-col gap-2",
    sidebarExpItem: "relative pl-3 before:absolute before:left-0 before:top-[6px] before:h-[calc(100%-6px)] before:w-px before:bg-[#33ff55]/20",
    sidebarExpRole: "text-sm text-[#33ff55]/90 leading-tight",
    sidebarExpOrg: "text-xs text-[#33ff55]/50 mt-0.5",
    sidebarExpBullet: "text-sm text-[#33ff55]/38",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 8, trackBg: "#020602", thumbBg: "#0a2010", thumbHover: "#33ff55", radius: 0, border: "1px solid #33ff5530" }),
    heroName: "mt-4 text-4xl leading-tight tracking-wide text-[#33ff55] md:text-5xl lg:text-6xl xl:text-7xl [text-shadow:0_0_20px_rgba(51,255,85,0.55),0_0_40px_rgba(51,255,85,0.25)]",
    heroHeadline: "mt-2 text-sm tracking-[0.05em] text-[#33ff55]/55",
    heroBio: "mt-3 text-xs leading-loose text-[#33ff55]/38",
    pill: "inline-flex items-center gap-1.5 border border-[#33ff55]/30 bg-transparent px-3 py-1 text-[10px] tracking-wider text-[#33ff55]/65",
    pillAccent: "inline-flex items-center gap-1.5 border border-[#33ff55] bg-[#33ff55] px-3 py-1 text-[10px] font-bold tracking-wider text-[#020602]",
    section: "mt-4 border border-[#33ff55]/18 bg-[#020602] p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] tracking-[0.22em] text-[#33ff55]/40",
    ctaPrimary: "inline-flex items-center gap-2 border border-[#33ff55] bg-[#33ff55] px-5 py-2.5 text-sm font-bold tracking-wider text-[#020602] transition-all hover:shadow-[0_0_20px_rgba(51,255,85,0.4)]",
    ctaOutline: "inline-flex items-center gap-2 border border-[#33ff55]/30 bg-transparent px-5 py-2.5 text-sm tracking-wider text-[#33ff55]/60 transition-all hover:border-[#33ff55]/60 hover:text-[#33ff55]/90",
    linkRow: "flex items-center gap-3 border-b border-[#33ff55]/12 py-3.5 text-[#33ff55]/55 transition-colors hover:text-[#33ff55] last:border-b-0",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border border-[#33ff55]/20 bg-[#33ff55]/5 text-[#33ff55]/65",
    projectCard: "border border-[#33ff55]/18 bg-[#020602] p-5 text-[#33ff55]/75",
    projectCardAlt: "border border-[#33ff55]/22 bg-[#041004] p-5 text-[#33ff55]/75",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#33ff55]/22 text-[#33ff55]/45 transition-colors hover:border-[#33ff55]/55 hover:text-[#33ff55]",
    chip: "border border-[#33ff55]/20 px-3 py-0.5 text-[10px] tracking-wider text-[#33ff55]/55",
    footer: "mt-8 text-center text-[10px] tracking-widest text-[#33ff55]/22",
    divider: "my-4 border-t border-[#33ff55]/14",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TERRACOTTA — MAGAZINE · deep saffron + white · Manrope + Domine
// Warm Indian textile inspiration — turmeric field, bone-white content
// ─────────────────────────────────────────────────────────────────────────────
const terracottaTemplate: ProfileTemplateDefinition = {
  id: "terracotta",
  label: "Terracotta",
  description: "Saffron and ochre warmth. Manrope display, Domine body, bone-white panels.",
  layout: "magazine",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Domine:wght@400;600&display=swap",
    fontBody: "'Domine', serif",
    fontDisplay: "'Manrope', sans-serif",
    page: "min-h-dvh bg-[#c45c1a] text-[#1c0e05] [background-image:radial-gradient(ellipse_100%_60%_at_50%_-15%,#e87a2520_0%,transparent_55%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border border-[#f5ede0]/30 bg-[#f5ede0] p-6",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "w-full pb-20",
    magazineHeroBanner: "w-full border-b-[3px] border-[#1c0e05]/20 bg-[#c45c1a] px-6 py-9 sm:px-10 lg:grid lg:grid-cols-[1fr_300px] lg:items-end lg:gap-12 lg:px-16 lg:py-12 xl:px-24",
    magazineGrid: "px-6 pt-6 sm:px-10 lg:px-16 xl:px-24 grid grid-cols-1 gap-4 lg:grid-cols-3",
    magazineColWide: "lg:col-span-2 flex flex-col gap-4",
    magazineColNarrow: "lg:col-span-1 flex flex-col gap-4",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 8, trackBg: "#b04e14", thumbBg: "#7a300a", thumbHover: "#fdf0e0", radius: 0, border: "2px solid #b04e14" }),
    heroName: "mt-4 text-4xl font-extrabold leading-[0.92] tracking-tight text-[#fdf0e0] sm:text-5xl lg:text-6xl xl:text-8xl",
    heroHeadline: "mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#fdf0e0]/55",
    heroBio: "mt-3 text-sm leading-relaxed text-[#fdf0e0]/48 lg:max-w-lg",
    pill: "inline-flex items-center gap-1.5 border-[2px] border-[#fdf0e0]/30 bg-transparent px-3 py-1 text-[11px] font-semibold text-[#fdf0e0]/70",
    pillAccent: "inline-flex items-center gap-1.5 border-[2px] border-[#fdf0e0] bg-[#fdf0e0] px-3 py-1 text-[11px] font-bold text-[#c45c1a]",
    section: "border border-[#1c0e05]/8 bg-[#fdf0e0] p-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c45c1a]/55",
    ctaPrimary: "inline-flex items-center gap-2 border-[2px] border-[#fdf0e0] bg-[#fdf0e0] px-5 py-2.5 text-sm font-bold text-[#c45c1a] transition-colors hover:bg-white",
    ctaOutline: "inline-flex items-center gap-2 border-[2px] border-[#1c0e05]/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-[#1c0e05]/60 transition-colors hover:border-[#1c0e05]/35",
    linkRow: "flex items-center gap-3 border border-[#c45c1a]/15 bg-[#fdf8f2] px-4 py-3 text-[#1c0e05]/65 transition-all hover:border-[#c45c1a]/35 hover:bg-white",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border border-[#c45c1a]/18 bg-[#c45c1a]/8 text-[#c45c1a]",
    projectCard: "border border-[#1c0e05]/8 bg-[#1c0e05] p-5 text-[#fdf0e0]",
    projectCardAlt: "border border-[#1c0e05]/8 bg-[#fdf8f2] p-5 text-[#1c0e05]",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#c45c1a]/18 bg-[#c45c1a]/6 text-[#c45c1a]/55 transition-colors hover:border-[#c45c1a]/40 hover:text-[#c45c1a]",
    chip: "border border-[#c45c1a]/15 bg-[#c45c1a]/8 px-3 py-0.5 text-xs font-semibold text-[#c45c1a]/75",
    footer: "mt-8 text-center text-xs font-semibold text-[#1c0e05]/28",
    divider: "my-4 border-t border-[#c45c1a]/12",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// VOID — SIDEBAR · navy midnight + gold · Marcellus + Raleway
// Luxury folio — deep navy with gold leaf, premium portfolio feel
// ─────────────────────────────────────────────────────────────────────────────
const voidTemplate: ProfileTemplateDefinition = {
  id: "void",
  label: "Void",
  description: "Deep midnight navy with gold accents. Luxury portfolio, refined and bold.",
  layout: "sidebar",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Marcellus&family=Raleway:wght@300;400;500;600&display=swap",
    fontBody: "'Raleway', sans-serif",
    fontDisplay: "'Marcellus', serif",
    page: "min-h-dvh bg-[#080c18] text-[#e4dcc8] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-5%,#1a2540_0%,transparent_60%)]",
    stackMain: "mx-auto w-full max-w-[520px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border border-[#c9a84c]/18 bg-[#0e1428]/70 p-6 backdrop-blur-sm",
    sidebarOuter: "flex w-full min-h-dvh flex-col md:flex-row",
    sidebarLeft: "w-full shrink-0 px-3 pt-4 pb-4 md:sticky md:top-0 md:h-screen md:w-[240px] md:overflow-y-auto md:border-r md:border-[#c9a84c]/10 lg:w-[260px] flex flex-col gap-0",
    sidebarRight: "flex-1 min-w-0 px-6 pb-16 pt-8 md:px-10 md:pt-10",
    sidebarImageRing: "ring-1 ring-[#c9a84c]/30 ring-offset-1 ring-offset-[#080c18]",
    sidebarNavSection: "mt-4 mb-0.5 px-2 text-[10px] font-light uppercase tracking-[0.22em] text-[#e4dcc8]/22 select-none",
    sidebarNavItem: "group relative flex w-full items-center gap-2.5 rounded-md px-2 py-[5px] text-[13px] text-[#e4dcc8]/48 transition-colors hover:text-[#e4dcc8]/85",
    sidebarNavItemHover: "before:absolute before:inset-0 before:rounded-md before:bg-[#c9a84c]/6 before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
    sidebarNavIcon: "shrink-0 text-[#e4dcc8]/25 group-hover:text-[#c9a84c]/70 transition-colors",
    sidebarMeta: "text-[11px] font-light text-[#e4dcc8]/22 leading-snug",
    sidebarDivider: "my-3 border-t border-[#c9a84c]/10",
    sidebarResumeCard: "mx-1 rounded-md border border-[#c9a84c]/12 bg-[#c9a84c]/4 px-3 py-2.5",
    sidebarProjectCard: "rounded-lg border border-[#c9a84c]/10 bg-[#0e1428]/40 p-4 transition-all hover:border-[#c9a84c]/22 hover:bg-[#0e1428]/60",
    sidebarProjectIndex: "text-[10px] font-light tabular-nums tracking-widest text-[#c9a84c]/40",
    sidebarProjectTitle: "font-normal tracking-wide text-[#f0e6cc] leading-snug",
    sidebarSkillGroup: "flex flex-col gap-2",
    sidebarExpItem: "relative pl-3 before:absolute before:left-0 before:top-[6px] before:h-[calc(100%-6px)] before:w-px before:bg-[#c9a84c]/18",
    sidebarExpRole: "text-sm font-medium text-[#f0e6cc] leading-tight",
    sidebarExpOrg: "text-xs text-[#c9a84c]/60 mt-0.5",
    sidebarExpBullet: "text-sm text-[#e4dcc8]/38",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 7, trackBg: "#080c18", thumbBg: "#1a2540", thumbHover: "#c9a84c", radius: 2 }),
    heroName: "mt-4 text-3xl font-normal tracking-wide text-[#f0e6cc] md:text-4xl lg:text-5xl xl:text-6xl",
    heroHeadline: "mt-2 text-[11px] font-light uppercase tracking-[0.32em] text-[#c9a84c]/65",
    heroBio: "mt-3 text-sm font-light leading-relaxed text-[#e4dcc8]/38",
    pill: "inline-flex items-center gap-1.5 border border-[#c9a84c]/20 bg-[#c9a84c]/6 px-3 py-1 text-[11px] font-light text-[#c9a84c]/72",
    pillAccent: "inline-flex items-center gap-1.5 bg-[#c9a84c] px-3 py-1 text-[11px] font-semibold text-[#080c18]",
    section: "mt-4 border border-[#c9a84c]/10 bg-[#0e1428]/50 p-5 backdrop-blur-sm",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.32em] text-[#c9a84c]/42",
    ctaPrimary: "inline-flex items-center gap-2 bg-[#c9a84c] px-5 py-2.5 text-sm font-medium text-[#080c18] transition-all hover:bg-[#e0c070]",
    ctaOutline: "inline-flex items-center gap-2 border border-[#c9a84c]/28 bg-transparent px-5 py-2.5 text-sm font-light text-[#e4dcc8]/60 transition-all hover:border-[#c9a84c]/50 hover:text-[#e4dcc8]/85",
    linkRow: "flex items-center gap-3 border-b border-[#c9a84c]/10 py-3.5 text-[#e4dcc8]/52 transition-colors hover:text-[#c9a84c] last:border-b-0",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border border-[#c9a84c]/18 bg-[#c9a84c]/6 text-[#c9a84c]/65",
    projectCard: "border border-[#c9a84c]/10 bg-[#080c18] p-5 text-[#e4dcc8]/75",
    projectCardAlt: "border border-[#c9a84c]/14 bg-[#0e1428]/60 p-5 text-[#e4dcc8]/75",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#c9a84c]/16 bg-[#c9a84c]/4 text-[#c9a84c]/48 transition-colors hover:border-[#c9a84c]/38 hover:text-[#c9a84c]",
    chip: "border border-[#c9a84c]/14 bg-[#c9a84c]/5 px-3 py-0.5 text-xs font-light text-[#c9a84c]/62",
    footer: "mt-8 text-center text-xs font-light text-[#e4dcc8]/18",
    divider: "my-4 border-t border-[#c9a84c]/10",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CANDY — STACK · bold CMYK primaries · Boogaloo + Nunito
// Pop Art — Andy Warhol bold primary colors, graphic punchy energy
// ─────────────────────────────────────────────────────────────────────────────
const candyTemplate: ProfileTemplateDefinition = {
  id: "candy",
  label: "Candy",
  description: "Pop Art bold. CMYK primary colors, graphic punch, Andy Warhol energy.",
  layout: "stack",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Boogaloo&family=Nunito:wght@400;500;700;800&display=swap",
    fontBody: "'Nunito', sans-serif",
    fontDisplay: "'Boogaloo', sans-serif",
    page: "min-h-dvh bg-[#ffe100] text-[#0a0a0a]",
    stackMain: "mx-auto w-full max-w-[640px] px-4 pb-16 pt-6 sm:px-6 lg:max-w-3xl",
    stackHeroCard: "border-[3px] border-[#0a0a0a] bg-white p-6 shadow-[6px_6px_0px_#0a0a0a]",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 10, trackBg: "#ffe100", thumbBg: "#0a0a0a", thumbHover: "#ff2d55", radius: 0, border: "2px solid #ffe100" }),
    heroName: "mt-4 text-5xl font-normal leading-none tracking-tight text-[#0a0a0a] sm:text-6xl lg:text-8xl xl:text-[9rem]",
    heroHeadline: "mt-2 text-base font-bold uppercase tracking-[0.15em] text-[#0a0a0a]/60",
    heroBio: "mt-3 text-sm leading-relaxed text-[#0a0a0a]/55",
    pill: "inline-flex items-center gap-1.5 border-[3px] border-[#0a0a0a] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0a0a0a] shadow-[2px_2px_0_#0a0a0a]",
    pillAccent: "inline-flex items-center gap-1.5 border-[3px] border-[#0a0a0a] bg-[#ff2d55] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[2px_2px_0_#0a0a0a]",
    section: "mt-4 border-[3px] border-[#0a0a0a] bg-white p-5 shadow-[5px_5px_0_#0a0a0a]",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#0a0a0a]/40",
    ctaPrimary: "inline-flex items-center gap-2 border-[3px] border-[#0a0a0a] bg-[#ff2d55] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[4px_4px_0_#0a0a0a] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_#0a0a0a]",
    ctaOutline: "inline-flex items-center gap-2 border-[3px] border-[#0a0a0a] bg-[#0a96ff] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[4px_4px_0_#0a0a0a] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_#0a0a0a]",
    linkRow: "flex items-center gap-3 border-[2px] border-[#0a0a0a] bg-white px-4 py-3 shadow-[3px_3px_0_#0a0a0a] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#0a0a0a]",
    linkRowIcon: "flex h-8 w-8 shrink-0 items-center justify-center border-[2px] border-[#0a0a0a] bg-[#ffe100]",
    projectCard: "border-[3px] border-[#0a0a0a] bg-[#0a96ff] p-5 text-white shadow-[5px_5px_0_#0a0a0a]",
    projectCardAlt: "border-[3px] border-[#0a0a0a] bg-white p-5 text-[#0a0a0a] shadow-[5px_5px_0_#0a0a0a]",
    iconBtn: "flex h-7 w-7 items-center justify-center border-[2px] border-[#0a0a0a] bg-white text-[#0a0a0a] transition-all hover:bg-[#ffe100]",
    chip: "border-[2px] border-[#0a0a0a] bg-[#ffe100] px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#0a0a0a]",
    footer: "mt-10 text-center text-xs font-bold uppercase tracking-widest text-[#0a0a0a]/35",
    divider: "my-4 border-t-[3px] border-[#0a0a0a]",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HORIZON — SPLIT · cool midnight blue · Syne + DM Sans
// Split-screen: fixed identity left panel, scrollable content right panel
// ─────────────────────────────────────────────────────────────────────────────
const horizonTemplate: ProfileTemplateDefinition = {
  id: "horizon",
  label: "Horizon",
  description: "Split-screen. Fixed identity panel left, scrollable content right. Cool midnight blue.",
  layout: "split",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap",
    fontBody: "'DM Sans', sans-serif",
    fontDisplay: "'Syne', sans-serif",
    page: "min-h-dvh bg-[#0d1117] text-[#e6edf3]",
    stackMain: "", stackHeroCard: "",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "flex min-h-dvh flex-col lg:flex-row",
    splitLeft: "w-full lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[42vw] lg:overflow-y-auto flex flex-col border-b border-[#21262d] lg:border-b-0 lg:border-r-2 lg:border-[#21262d] bg-[#0a0f16]",
    splitLeftInner: "flex flex-col flex-1 px-8 py-7 lg:px-12 lg:py-9",
    splitRight: "w-full lg:ml-[42vw] lg:min-h-screen px-6 py-8 lg:px-14 lg:py-12",
    splitDivider: "hidden lg:block",
    splitHeroArea: "mt-auto",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 7, trackBg: "#0d1117", thumbBg: "#21262d", thumbHover: "#388bfd", radius: 4 }),
    heroName: "text-4xl font-extrabold tracking-tight text-[#e6edf3] sm:text-5xl lg:text-[3.5rem] xl:text-[4.5rem] leading-[1.02]",
    heroHeadline: "mt-3 text-base font-medium text-[#7d8590] leading-relaxed",
    heroBio: "mt-4 text-sm font-light text-[#8d96a0] leading-relaxed",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-[11px] font-medium text-[#8d96a0]",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#388bfd]/15 border border-[#388bfd]/30 px-3 py-1 text-[11px] font-semibold text-[#388bfd]",
    section: "mt-8 border-t border-[#21262d] pt-8",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7d8590]",
    ctaPrimary: "inline-flex items-center gap-2 rounded-md bg-[#388bfd] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#58a6ff] hover:shadow-[0_0_20px_rgba(56,139,253,0.3)]",
    ctaOutline: "inline-flex items-center gap-2 rounded-md border border-[#30363d] bg-transparent px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:border-[#8d96a0] hover:bg-[#21262d]",
    linkRow: "flex items-center gap-3 rounded-md py-2.5 text-[#8d96a0] transition-colors hover:text-[#e6edf3]",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#30363d] bg-[#161b22] text-[#8d96a0]",
    projectCard: "rounded-lg border border-[#21262d] bg-[#161b22] p-5 transition-all hover:border-[#30363d] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
    projectCardAlt: "rounded-lg border border-[#21262d] bg-[#0d1117] p-5",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-md border border-[#30363d] bg-[#21262d] text-[#8d96a0] transition-all hover:border-[#58a6ff] hover:text-[#58a6ff]",
    chip: "rounded-full border border-[#30363d] bg-[#161b22] px-2.5 py-0.5 text-[11px] font-medium text-[#8d96a0]",
    footer: "mt-8 text-[11px] text-[#484f58]",
    divider: "my-6 border-t border-[#21262d]",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ODYSSEY — SCROLLYTELLING · deep space indigo · Fraunces + Inter Tight
// Full-height snap sections, bg image hero, side nav dots
// ─────────────────────────────────────────────────────────────────────────────
const odysseyTemplate: ProfileTemplateDefinition = {
  id: "odyssey",
  label: "Odyssey",
  description: "Scrollytelling. Cinematic full-height sections, background image hero, side nav dots.",
  layout: "scrollytelling",
  requiresBgImage: true,
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,600&family=Inter+Tight:wght@300;400;500;600&display=swap",
    fontBody: "'Inter Tight', sans-serif",
    fontDisplay: "'Fraunces', serif",
    page: "bg-[#08090e] text-[#f0eee8]",
    stackMain: "", stackHeroCard: "",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden",
    stHeroSection: "relative flex min-h-dvh flex-col items-center justify-center text-center px-6",
    stContentSection: "relative flex min-h-dvh flex-col items-center justify-center px-6 bg-[#08090e]",
    stHeroOverlay: "absolute inset-0 bg-[#08090e]",
    stHeroContent: "relative z-10 max-w-3xl mx-auto",
    stSectionInner: "w-full max-w-2xl mx-auto",
    stProjectCard: "rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm",
    stNavDot: "block h-[6px] w-[6px] rounded-full bg-white/18 transition-all duration-300",
    stNavDotActive: "block h-[6px] w-[18px] rounded-full bg-white transition-all duration-300",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 6, trackBg: "#08090e", thumbBg: "#1a1b2e", thumbHover: "#6366f1", radius: 3 }),
    heroName: "text-5xl font-semibold italic leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl",
    heroHeadline: "mt-6 text-lg font-light text-white/60 tracking-wide",
    heroBio: "mt-4 text-base font-light text-white/45 leading-relaxed",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-medium text-white/55 backdrop-blur-sm",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#6366f1] px-3 py-1 text-[11px] font-semibold text-white",
    section: "mt-8 border-t border-white/10 pt-8",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30",
    ctaPrimary: "inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#08090e] transition-all hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
    ctaOutline: "inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white",
    linkRow: "flex items-center gap-3 py-3 text-white/50 transition-colors hover:text-white border-b border-white/8",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8",
    projectCard: "rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-all hover:border-white/20 hover:bg-white/[0.07]",
    projectCardAlt: "rounded-xl border border-white/8 bg-white/[0.03] p-5",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/50 transition-all hover:border-white/35 hover:text-white",
    chip: "rounded-full border border-white/10 bg-white/[0.06] px-3 py-0.5 text-[11px] font-medium text-white/50",
    footer: "mt-8 text-center text-[11px] text-white/20",
    divider: "my-6 border-t border-white/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOSAIC — MODULAR GRID · warm terracotta clay · Instrument Serif + Outfit
// Asymmetric CSS grid mosaic of variable-height content tiles
// ─────────────────────────────────────────────────────────────────────────────
const mosaicTemplate: ProfileTemplateDefinition = {
  id: "mosaic",
  label: "Mosaic",
  description: "Modular grid. Asymmetric tile mosaic, warm clay and rust palette.",
  layout: "modular",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap",
    fontBody: "'Outfit', sans-serif",
    fontDisplay: "'Instrument Serif', serif",
    page: "min-h-dvh bg-[#f5ede0] text-[#2a1f15]",
    stackMain: "", stackHeroCard: "",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "grid w-full min-h-dvh grid-cols-2 lg:grid-cols-4 auto-rows-[220px]",
    modularHeroTile: "col-span-2 row-span-2 flex flex-col justify-end bg-[#c9541a] p-7 lg:p-10 [background-image:radial-gradient(ellipse_100%_80%_at_50%_120%,rgba(26,12,3,0.4)_0%,transparent_60%)]",
    modularProjectTile: "col-span-1 row-span-1 flex flex-col justify-between border border-[#d9c4a8] bg-[#f5ede0] p-5 hover:bg-[#f0e4cc] transition-colors",
    modularSkillsTile: "col-span-2 row-span-1 flex flex-col justify-between border border-[#d9c4a8] bg-[#fdf6ec] p-6",
    modularExpTile: "col-span-2 row-span-2 flex flex-col border border-[#d9c4a8] bg-[#fff8f0] p-6 lg:p-8",
    modularConnectTile: "col-span-1 row-span-1 flex flex-col justify-between border border-[#d9c4a8] bg-[#2a1f15] p-5 text-[#f5ede0]",
    modularResumeTile: "col-span-1 row-span-1 flex flex-col justify-between border border-[#d9c4a8] bg-[#e8d5b8] p-5",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 8, trackBg: "#f5ede0", thumbBg: "#c9541a", thumbHover: "#a03c0e", radius: 4 }),
    heroName: "text-4xl font-normal italic leading-tight text-white sm:text-5xl lg:text-7xl",
    heroHeadline: "mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/60",
    heroBio: "mt-3 text-sm font-light text-white/55 leading-relaxed",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-[#d9c4a8] bg-[#fdf6ec] px-3 py-1 text-[11px] font-medium text-[#2a1f15]/60",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#2a1f15] px-3 py-1 text-[11px] font-semibold text-[#f5ede0]",
    section: "mt-6 border-t border-[#d9c4a8] pt-6",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2a1f15]/35",
    ctaPrimary: "inline-flex items-center gap-2 bg-white px-5 py-2.5 text-sm font-semibold text-[#c9541a] transition-all hover:bg-white/90",
    ctaOutline: "inline-flex items-center gap-2 border border-white/30 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/60 hover:text-white",
    linkRow: "flex items-center gap-3 py-2.5 text-[#2a1f15]/55 transition-colors hover:text-[#2a1f15] border-b border-[#d9c4a8] last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#d9c4a8] bg-[#f5ede0]",
    projectCard: "border border-[#d9c4a8] bg-[#f5ede0] p-4 hover:bg-[#f0e4cc] transition-colors",
    projectCardAlt: "border border-[#d9c4a8] bg-[#fdf6ec] p-4",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded border border-[#d9c4a8] bg-[#f5ede0] text-[#2a1f15]/50 transition-colors hover:bg-[#c9541a] hover:text-white hover:border-[#c9541a]",
    chip: "rounded border border-[#d9c4a8] bg-[#fdf6ec] px-2.5 py-0.5 text-[11px] font-medium text-[#2a1f15]/55",
    footer: "p-5 text-[11px] text-[#2a1f15]/30 border-t border-[#d9c4a8]",
    divider: "my-4 border-t border-[#d9c4a8]",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CINEMATIC — FULLSCREEN · bg image · Cormorant Garamond + Jost
// 100dvh image hero with overlay, clean content below
// ─────────────────────────────────────────────────────────────────────────────
const cinematicTemplate: ProfileTemplateDefinition = {
  id: "cinematic",
  label: "Cinematic",
  description: "Full-screen imagery. Dramatic background photo hero, refined content below.",
  layout: "fullscreen",
  requiresBgImage: true,
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Jost:wght@300;400;500;600&display=swap",
    fontBody: "'Jost', sans-serif",
    fontDisplay: "'Cormorant Garamond', serif",
    page: "bg-[#0e0e10] text-[#f4f0ea]",
    stackMain: "", stackHeroCard: "",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden text-center",
    fsHeroOverlay: "absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/50 to-[#0e0e10]/20",
    fsHeroContent: "relative z-10 mx-auto max-w-3xl px-6",
    fsContent: "mx-auto max-w-3xl px-6 pb-16 pt-14",
    fsSection: "mt-10 border-t border-white/10 pt-10",
    fsProjectCard: "rounded-xl border border-white/8 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:border-white/18 hover:bg-white/[0.07]",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 7, trackBg: "#0e0e10", thumbBg: "#2a2a2e", thumbHover: "#c4a882", radius: 3 }),
    heroName: "text-6xl font-light italic leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-[10rem]",
    heroHeadline: "mt-8 text-sm font-light uppercase tracking-[0.4em] text-white/50",
    heroBio: "mt-6 text-base font-light text-white/45 leading-relaxed",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-light text-white/45 backdrop-blur-sm",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full border border-[#c4a882]/40 bg-[#c4a882]/10 px-3 py-1 text-[11px] font-medium text-[#c4a882] backdrop-blur-sm",
    section: "mt-8 border-t border-white/8 pt-8",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.35em] text-white/28",
    ctaPrimary: "inline-flex items-center gap-2 border border-white/80 bg-white px-7 py-3 text-sm font-medium text-[#0e0e10] transition-all hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]",
    ctaOutline: "inline-flex items-center gap-2 border border-white/25 px-7 py-3 text-sm font-light text-white/70 backdrop-blur-sm transition-all hover:border-white/45 hover:text-white",
    linkRow: "flex items-center gap-3 py-3 text-white/45 transition-colors hover:text-white/80 border-b border-white/6 last:border-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/12 text-white/40",
    projectCard: "rounded-xl border border-white/8 bg-white/[0.04] p-6 transition-all hover:border-white/18 hover:bg-white/[0.07]",
    projectCardAlt: "rounded-xl border border-white/6 bg-white/[0.03] p-6",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/40 transition-all hover:border-[#c4a882]/50 hover:text-[#c4a882]",
    chip: "rounded-full border border-white/10 bg-white/[0.05] px-3 py-0.5 text-[11px] font-light text-white/45",
    footer: "mt-12 text-center text-[11px] font-light tracking-widest text-white/20 uppercase",
    divider: "my-8 border-t border-white/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT — Z-PATTERN · electric sky · Clash Display + Satoshi
// Editorial Z-pattern with alternating left/right content blocks
// ─────────────────────────────────────────────────────────────────────────────
const currentTemplate: ProfileTemplateDefinition = {
  id: "current",
  label: "Current",
  description: "Z-pattern editorial. Alternating left/right blocks, electric sky blue.",
  layout: "zpattern",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,600;0,800;1,400&display=swap",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontDisplay: "'Plus Jakarta Sans', sans-serif",
    page: "min-h-dvh bg-[#f8faff] text-[#0f172a]",
    stackMain: "", stackHeroCard: "",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "mx-auto w-full max-w-6xl px-6 pb-16 lg:px-8",
    zpHero: "py-16 lg:py-16 border-b-2 border-[#0f172a]",
    zpBlock: "grid grid-cols-1 gap-0 border-b border-[#e2e8f0] lg:grid-cols-2",
    zpBlockText: "flex flex-col justify-center px-0 py-7 lg:px-12 lg:py-11",
    zpBlockVisual: "flex items-center justify-center bg-[#0ea5e9] p-8 lg:p-12 min-h-[240px] [background-image:radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]",
    zpBlockAlt: "grid grid-cols-1 gap-0 border-b border-[#e2e8f0] lg:grid-cols-2",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 8, trackBg: "#f8faff", thumbBg: "#bae6fd", thumbHover: "#0ea5e9", radius: 6 }),
    heroName: "text-5xl font-extrabold leading-[0.95] tracking-tight text-[#0f172a] sm:text-7xl lg:text-8xl xl:text-[10rem]",
    heroHeadline: "mt-4 text-lg font-medium text-[#475569]",
    heroBio: "mt-4 text-base font-light text-[#64748b] leading-relaxed max-w-xl",
    pill: "inline-flex items-center gap-1.5 rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-[11px] font-medium text-[#64748b]",
    pillAccent: "inline-flex items-center gap-1.5 rounded-full bg-[#0ea5e9] px-3 py-1 text-[11px] font-semibold text-white",
    section: "mt-8 pt-8 border-t border-[#e2e8f0]",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f172a]/30",
    ctaPrimary: "inline-flex items-center gap-2 bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0ea5e9]",
    ctaOutline: "inline-flex items-center gap-2 border-2 border-[#0f172a] px-6 py-3 text-sm font-semibold text-[#0f172a] transition-all hover:bg-[#0f172a] hover:text-white",
    linkRow: "flex items-center gap-3 py-2.5 text-[#64748b] transition-colors hover:text-[#0ea5e9] border-b border-[#e2e8f0] last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white",
    projectCard: "border-2 border-[#0f172a] p-5 transition-all hover:bg-[#f1f5f9]",
    projectCardAlt: "border border-[#e2e8f0] bg-white p-5",
    iconBtn: "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white transition-all hover:bg-white hover:text-[#0ea5e9]",
    chip: "rounded-full border border-[#e2e8f0] bg-white px-3 py-0.5 text-[11px] font-medium text-[#64748b]",
    footer: "mt-12 text-[11px] text-[#94a3b8]",
    divider: "my-6 border-t border-[#e2e8f0]",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCH — F-PATTERN · newspaper · Playfair Display + IBM Plex Sans
// Newspaper F-pattern: strong top header, left lead story, right stream
// ─────────────────────────────────────────────────────────────────────────────
const dispatchTemplate: ProfileTemplateDefinition = {
  id: "dispatch",
  label: "Dispatch",
  description: "F-pattern editorial. Newspaper layout: lead story left, content stream right.",
  layout: "fpattern",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap",
    fontBody: "'IBM Plex Sans', sans-serif",
    fontDisplay: "'Playfair Display', serif",
    page: "min-h-dvh bg-[#faf9f6] text-[#1a1a18]",
    stackMain: "", stackHeroCard: "",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "mx-auto w-full max-w-7xl",
    fpHero: "border-b-[3px] border-[#1a1a18] px-6 py-7 lg:px-10 lg:py-10 [background-image:url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%231a1a18' fill-opacity='0.025'/%3E%3C/svg%3E\")]",
    fpRail: "px-6 py-6 lg:px-10 lg:py-8 lg:border-r-2 lg:border-[#1a1a18]",
    fpStream: "px-6 py-6 lg:px-8 lg:py-8",
    fpStreamItem: "border-b border-[#e8e5df] py-5 last:border-b-0",
    fpStreamItemAlt: "border-b border-[#e8e5df] py-5 bg-[#f3ede3] px-4 last:border-b-0",
    scrollbarCss: sb({ size: 8, trackBg: "#faf9f6", thumbBg: "#d4cfc5", thumbHover: "#1a1a18", radius: 0 }),
    heroName: "font-black leading-[0.9] tracking-tight text-[#1a1a18]",
    heroHeadline: "mt-3 font-light italic text-[#1a1a18]/55",
    heroBio: "mt-4 text-sm font-light text-[#1a1a18]/50 leading-relaxed",
    pill: "inline-flex items-center gap-1.5 border border-[#1a1a18]/20 bg-[#f3ede3] px-3 py-1 text-[11px] font-medium text-[#1a1a18]/55",
    pillAccent: "inline-flex items-center gap-1.5 bg-[#1a1a18] px-3 py-1 text-[11px] font-semibold text-[#faf9f6]",
    section: "mt-6 border-t-2 border-[#1a1a18] pt-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#1a1a18]/30",
    ctaPrimary: "inline-flex items-center gap-2 border-2 border-[#1a1a18] bg-[#1a1a18] px-5 py-2 text-sm font-semibold text-[#faf9f6] transition-all hover:bg-[#3a3a35]",
    ctaOutline: "inline-flex items-center gap-2 border-2 border-[#1a1a18] px-5 py-2 text-sm font-medium text-[#1a1a18] transition-all hover:bg-[#1a1a18] hover:text-[#faf9f6]",
    linkRow: "flex items-center gap-3 py-2 text-[#1a1a18]/50 transition-colors hover:text-[#1a1a18] border-b border-[#e8e5df] last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border border-[#e8e5df] bg-[#f3ede3]",
    projectCard: "border border-[#e8e5df] bg-white p-4 hover:border-[#1a1a18]/30 transition-colors",
    projectCardAlt: "border-l-4 border-[#1a1a18] pl-4 py-3",
    iconBtn: "flex h-6 w-6 items-center justify-center border border-[#1a1a18]/20 text-[#1a1a18]/40 transition-colors hover:border-[#1a1a18] hover:text-[#1a1a18]",
    chip: "border border-[#e8e5df] bg-[#f3ede3] px-2.5 py-0.5 text-[11px] font-medium text-[#1a1a18]/50",
    footer: "mt-8 border-t border-[#e8e5df] px-6 py-4 text-[11px] text-[#1a1a18]/30 lg:px-10",
    divider: "my-4 border-t border-[#e8e5df]",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// (registry follows after all template definitions below)
// ─────────────────────────────────────────────────────────────────────────────
// MORNING — MAGAZINE · near-black + cyan/teal + orange · Zilla Slab + DM Sans
// Dark editorial, slab serif cyan headline, orange rule accent
// ─────────────────────────────────────────────────────────────────────────────
const morningTemplate: ProfileTemplateDefinition = {
  id: "morning",
  label: "Morning",
  description: "Dark editorial. Cyan slab headline, orange accent, near-black background.",
  layout: "magazine",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap",
    fontBody: "'DM Sans', sans-serif",
    fontDisplay: "'Zilla Slab', serif",
    page: "min-h-dvh bg-[#181818] text-[#e8e4df]",
    stackMain: "mx-auto w-full max-w-[560px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border-b border-[#e05c2e]/40 pb-8",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "w-full pb-20",
    magazineHeroBanner: "relative w-full bg-[#181818] px-6 py-9 sm:px-10 lg:px-16 lg:py-12 xl:px-24 border-b border-[#e05c2e]/50 lg:grid lg:grid-cols-[1fr_260px] lg:items-end lg:gap-12",
    magazineGrid: "px-6 pt-8 sm:px-10 lg:px-16 xl:px-24 grid grid-cols-1 gap-5 lg:grid-cols-3",
    magazineColWide: "lg:col-span-2 flex flex-col gap-5",
    magazineColNarrow: "lg:col-span-1 flex flex-col gap-5",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 7, trackBg: "#181818", thumbBg: "#2e2e2e", thumbHover: "#e05c2e", radius: 0 }),
    heroName: "mt-5 text-5xl font-bold leading-[1.0] tracking-tight text-[#38d6e8] sm:text-6xl lg:text-7xl xl:text-[9rem] [text-shadow:0_0_40px_rgba(56,214,232,0.3)]",
    heroHeadline: "mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[#e05c2e]",
    heroBio: "mt-4 text-sm font-light leading-relaxed text-[#e8e4df]/55 lg:max-w-md",
    pill: "inline-flex items-center gap-1.5 border border-[#38d6e8]/20 bg-[#38d6e8]/6 px-3 py-1 text-[11px] font-medium text-[#38d6e8]/70",
    pillAccent: "inline-flex items-center gap-1.5 bg-[#e05c2e] px-3 py-1 text-[11px] font-semibold text-white",
    section: "border border-[#2e2e2e] bg-[#1e1e1e] p-5 transition-colors hover:border-[#3a3a3a]",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e05c2e]/70",
    ctaPrimary: "inline-flex items-center gap-2 border-2 border-[#e05c2e] bg-transparent px-6 py-2.5 text-sm font-semibold text-[#e8e4df] transition-all hover:bg-[#e05c2e] hover:text-white",
    ctaOutline: "inline-flex items-center gap-2 border border-[#2e2e2e] bg-[#2e2e2e] px-6 py-2.5 text-sm font-medium text-[#e8e4df]/70 transition-all hover:bg-[#3a3a3a]",
    linkRow: "flex items-center gap-3 border-b border-[#2e2e2e] py-3 text-[#e8e4df]/50 transition-colors hover:text-[#38d6e8] last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border border-[#2e2e2e] bg-[#1e1e1e] text-[#38d6e8]/60",
    projectCard: "border border-[#2e2e2e] bg-[#1e1e1e] p-5 transition-colors hover:border-[#38d6e8]/30",
    projectCardAlt: "border-l-2 border-[#38d6e8] bg-[#1e1e1e] p-5 pl-4",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#2e2e2e] text-[#38d6e8]/40 transition-colors hover:border-[#38d6e8]/50 hover:text-[#38d6e8]",
    chip: "border border-[#2e2e2e] bg-[#252525] px-2.5 py-0.5 text-[11px] font-medium text-[#e8e4df]/45",
    footer: "mt-10 text-[11px] text-[#e8e4df]/18",
    divider: "my-4 border-t border-[#2e2e2e]",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ELEGANCE — BENTO · white + yellow + black · Bodoni Moda + Outfit
// Luxury fashion editorial, high-contrast serif, yellow highlight bento grid
// ─────────────────────────────────────────────────────────────────────────────
const eleganceTemplate: ProfileTemplateDefinition = {
  id: "elegance",
  label: "Elegance",
  description: "Luxury editorial. Bodoni serif display, yellow accent, bold black & white bento.",
  layout: "bento",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700&family=Outfit:wght@300;400;500;600&display=swap",
    fontBody: "'Outfit', sans-serif",
    fontDisplay: "'Bodoni Moda', serif",
    page: "min-h-dvh bg-white text-[#111111]",
    stackMain: "mx-auto w-full max-w-[560px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border-b-4 border-[#111111] pb-8",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "w-full min-h-dvh",
    bentoGrid: "grid grid-cols-1 gap-0 [&>*]:border-b-2 [&>*]:border-[#111111] lg:grid-cols-3 lg:[&>*]:border-r-2 lg:[&>*]:border-[#111111] lg:[&>*:nth-child(3n)]:border-r-0",
    bentoHero: "col-span-1 bg-white px-8 py-8 lg:col-span-3 lg:px-16 lg:py-10 xl:px-24 xl:py-14 border-b-2 border-[#111111]",
    bentoProjects: "col-span-1 bg-white px-6 py-8 lg:col-span-2 lg:px-10 lg:py-10",
    bentoConnect: "col-span-1 bg-[#111111] px-6 py-8 text-white lg:col-span-1 lg:row-span-2 lg:px-8 lg:py-10",
    bentoResume: "col-span-1 bg-[#f5f5f5] px-6 py-8 lg:col-span-1 lg:px-10 lg:py-10",
    bentoSkills: "col-span-1 bg-[#f5e800] px-6 py-8 lg:col-span-1 lg:px-8 lg:py-10",
    bentoExperience: "col-span-1 bg-white px-6 py-8 lg:col-span-3 lg:px-16 lg:py-10",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 8, trackBg: "#ffffff", thumbBg: "#cccc00", thumbHover: "#111111", radius: 0 }),
    heroName: "mt-4 font-serif text-5xl font-black leading-[0.93] tracking-tight text-[#111111] sm:text-7xl lg:text-8xl xl:text-[10rem]",
    heroHeadline: "mt-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#111111]/40",
    heroBio: "mt-4 text-base font-light leading-relaxed text-[#111111]/55 lg:max-w-xl",
    pill: "inline-flex items-center gap-1.5 border border-[#111111]/15 bg-[#f5f5f5] px-3 py-1 text-[11px] font-medium text-[#111111]/55",
    pillAccent: "inline-flex items-center gap-1.5 bg-[#f5e800] px-3 py-1 text-[11px] font-semibold text-[#111111] underline underline-offset-2",
    section: "mt-6 border-t-2 border-[#111111]/10 pt-5",
    sectionTitle: "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#111111]/30",
    ctaPrimary: "inline-flex items-center gap-2 bg-[#f5e800] px-7 py-3 text-sm font-semibold text-[#111111] transition-all hover:bg-[#e8dc00]",
    ctaOutline: "inline-flex items-center gap-2 bg-[#111111] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2a2a2a]",
    linkRow: "flex items-center gap-3 border-b border-white/15 py-3.5 text-white/60 transition-colors hover:text-white last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border border-white/20 bg-white/8",
    projectCard: "border-2 border-[#111111]/10 p-5 transition-all hover:border-[#111111]/25",
    projectCardAlt: "border-l-4 border-[#f5e800] pl-4 py-4",
    iconBtn: "flex h-7 w-7 items-center justify-center border-2 border-white/20 text-white/50 transition-colors hover:border-white hover:text-white",
    chip: "border border-[#111111]/12 bg-[#f9f9f9] px-2.5 py-0.5 text-[11px] font-medium text-[#111111]/50",
    footer: "col-span-1 lg:col-span-3 border-t-2 border-[#111111] bg-white py-5 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-[#111111]/25",
    divider: "my-4 border-t border-[#111111]/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SAILHO — SIDEBAR · white + teal/mint + near-black · Syne + Source Serif 4
// Clean nautical — teal highlight block, bold condensed display, crisp white
// ─────────────────────────────────────────────────────────────────────────────
const sailhoTemplate: ProfileTemplateDefinition = {
  id: "sailho",
  label: "Sail Ho",
  description: "Clean nautical. Teal accent block, bold Syne display, crisp white sidebar.",
  layout: "sidebar",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&display=swap",
    fontBody: "'Source Serif 4', serif",
    fontDisplay: "'Syne', sans-serif",
    page: "min-h-dvh bg-[#f8f8f6] text-[#111111]",
    stackMain: "mx-auto w-full max-w-[560px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border-b-2 border-[#111111] pb-8",
    sidebarOuter: "flex w-full min-h-dvh flex-col md:flex-row",
    sidebarLeft: "w-full shrink-0 bg-white px-5 pt-8 pb-6 md:sticky md:top-0 md:h-screen md:w-[260px] md:overflow-y-auto md:border-r-2 md:border-[#111111]/20 md:px-7 md:py-10 lg:w-[290px] flex flex-col gap-0",
    sidebarRight: "flex-1 min-w-0 bg-[#f8f8f6] px-6 pb-16 pt-8 md:px-10 md:pt-10",
    sidebarImageRing: "ring-2 ring-[#1dcfc0] ring-offset-2 ring-offset-white",
    sidebarNavSection: "mt-5 mb-1 px-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#111111]/25 select-none",
    sidebarNavItem: "group relative flex w-full items-center gap-2.5 px-2 py-[6px] text-[13px] text-[#111111]/60 transition-colors hover:text-[#111111]",
    sidebarNavItemHover: "before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-[#1dcfc0] before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
    sidebarNavIcon: "shrink-0 text-[#111111]/30 group-hover:text-[#1dcfc0] transition-colors",
    sidebarMeta: "text-[11px] text-[#111111]/35 leading-snug",
    sidebarDivider: "my-4 border-t-2 border-[#111111]/8",
    sidebarResumeCard: "mx-0 border-l-2 border-[#1dcfc0] bg-[#1dcfc0]/8 px-3 py-2.5",
    sidebarProjectCard: "border-2 border-[#111111]/8 bg-white p-4 transition-all hover:border-[#1dcfc0]/60",
    sidebarProjectIndex: "text-[10px] font-bold tabular-nums tracking-[0.2em] text-[#1dcfc0]",
    sidebarProjectTitle: "font-bold text-[#111111] leading-snug",
    sidebarSkillGroup: "flex flex-col gap-2",
    sidebarExpItem: "relative pl-3 before:absolute before:left-0 before:top-1.5 before:h-[calc(100%-6px)] before:w-0.5 before:bg-[#1dcfc0]/40",
    sidebarExpRole: "text-sm font-bold text-[#111111] leading-tight",
    sidebarExpOrg: "text-xs text-[#1dcfc0] mt-0.5 font-medium",
    sidebarExpBullet: "text-sm text-[#111111]/50",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 6, trackBg: "#f8f8f6", thumbBg: "#d0d0cc", thumbHover: "#1dcfc0", radius: 0 }),
    heroName: "mt-3 text-4xl font-extrabold leading-[0.95] tracking-tight text-[#111111] md:text-5xl lg:text-6xl",
    heroHeadline: "mt-3 text-sm font-medium text-[#111111]/50 not-italic",
    heroBio: "mt-3 text-sm leading-relaxed text-[#111111]/45 not-italic",
    pill: "inline-flex items-center gap-1.5 border border-[#111111]/12 bg-white px-3 py-1 text-[11px] font-medium text-[#111111]/55 not-italic",
    pillAccent: "inline-flex items-center gap-1.5 bg-[#1dcfc0] px-3 py-1 text-[11px] font-bold text-white not-italic",
    section: "mt-5 border-t-2 border-[#111111]/8 pt-5",
    sectionTitle: "inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.28em] text-[#111111]/30",
    ctaPrimary: "inline-flex items-center gap-2 border-2 border-[#1dcfc0] bg-transparent px-5 py-2.5 text-sm font-bold text-[#111111] transition-all hover:bg-[#1dcfc0] hover:text-white not-italic",
    ctaOutline: "inline-flex items-center gap-2 border border-[#111111]/15 bg-white px-5 py-2.5 text-sm font-medium text-[#111111]/60 transition-all hover:border-[#111111]/30 not-italic",
    linkRow: "flex items-center gap-3 border-b border-[#111111]/8 py-3 text-[#111111]/55 transition-colors hover:text-[#1dcfc0] last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border border-[#111111]/10 bg-[#1dcfc0]/8 text-[#1dcfc0]",
    projectCard: "border-2 border-[#111111]/8 bg-white p-5 transition-all hover:border-[#1dcfc0]/50",
    projectCardAlt: "border-l-4 border-[#1dcfc0] bg-white pl-4 py-4",
    iconBtn: "flex h-7 w-7 items-center justify-center border-2 border-[#111111]/10 text-[#111111]/35 transition-colors hover:border-[#1dcfc0] hover:text-[#1dcfc0]",
    chip: "border border-[#111111]/10 bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#111111]/50",
    footer: "mt-10 text-[11px] text-[#111111]/22",
    divider: "my-4 border-t-2 border-[#111111]/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE — Z-PATTERN · near-black + white + charcoal · Fraunces + Jost
// Dramatic high-contrast serif, editorial alternating blocks, dark luxury
// ─────────────────────────────────────────────────────────────────────────────
const deviceTemplate: ProfileTemplateDefinition = {
  id: "device",
  label: "The Device",
  description: "Dark luxury editorial. Massive Fraunces serif, spaced-caps labels, Z-pattern.",
  layout: "zpattern",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Jost:wght@300;400;500;600&display=swap",
    fontBody: "'Jost', sans-serif",
    fontDisplay: "'Fraunces', serif",
    page: "min-h-dvh bg-[#111111] text-[#e8e4de]",
    stackMain: "mx-auto w-full max-w-[560px] px-4 pb-12 pt-6 sm:px-6",
    stackHeroCard: "border-b border-white/10 pb-8",
    sidebarOuter: "", sidebarLeft: "", sidebarRight: "",
    sidebarImageRing: "", sidebarNavSection: "", sidebarNavItem: "", sidebarNavItemHover: "", sidebarNavIcon: "", sidebarMeta: "", sidebarDivider: "", sidebarResumeCard: "", sidebarProjectCard: "", sidebarProjectIndex: "", sidebarProjectTitle: "", sidebarSkillGroup: "", sidebarExpItem: "", sidebarExpRole: "", sidebarExpOrg: "", sidebarExpBullet: "",
    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "mx-auto w-full max-w-6xl px-6 pb-16 lg:px-8",
    zpHero: "py-16 lg:py-16 border-b border-white/12",
    zpBlock: "grid grid-cols-1 gap-0 border-b border-white/8 lg:grid-cols-2",
    zpBlockText: "flex flex-col justify-center px-0 py-7 lg:px-14 lg:py-10",
    zpBlockVisual: "flex items-center justify-center bg-[#1a1a1a] p-8 lg:p-16 min-h-[240px] [background-image:radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(232,228,222,0.04)_0%,transparent_70%)]",
    zpBlockAlt: "grid grid-cols-1 gap-0 border-b border-white/8 lg:grid-cols-2",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",
    scrollbarCss: sb({ size: 7, trackBg: "#111111", thumbBg: "#2a2a2a", thumbHover: "#e8e4de", radius: 0 }),
    heroName: "text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-[10rem]",
    heroHeadline: "mt-5 text-[10px] font-medium uppercase tracking-[0.4em] text-white/38",
    heroBio: "mt-5 text-base font-light text-white/50 leading-relaxed max-w-xl",
    pill: "inline-flex items-center gap-1.5 border border-white/10 bg-white/4 px-3 py-1 text-[11px] font-medium text-white/45",
    pillAccent: "inline-flex items-center gap-1.5 border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80",
    section: "mt-8 border-t border-white/8 pt-8",
    sectionTitle: "inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.42em] text-white/28",
    ctaPrimary: "inline-flex items-center gap-2 border border-white bg-white px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-[#111111] transition-all hover:bg-white/90",
    ctaOutline: "inline-flex items-center gap-2 border border-white/25 bg-[#2a2a2a] px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-white/70 transition-all hover:border-white/45 hover:text-white",
    linkRow: "flex items-center gap-3 border-b border-white/8 py-3 text-white/45 transition-colors hover:text-white last:border-b-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border border-white/12 bg-white/4",
    projectCard: "border border-white/8 bg-[#1a1a1a] p-5 transition-all hover:border-white/18",
    projectCardAlt: "border border-white/6 bg-[#161616] p-5",
    iconBtn: "flex h-7 w-7 items-center justify-center border border-white/12 text-white/35 transition-colors hover:border-white/35 hover:text-white",
    chip: "border border-white/10 bg-white/4 px-2.5 py-0.5 text-[11px] font-light text-white/40",
    footer: "mt-12 text-[10px] font-medium uppercase tracking-[0.3em] text-white/18",
    divider: "my-6 border-t border-white/8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MANUSCRIPT — STACK · dark ink + aged gold · Cormorant Garamond + Epilogue
//
// Anti-scroll-monotony design. Three deliberate density shifts per scroll:
//   1. SPARSE hero — massive italic name, bio pushed 38% right for asymmetry
//   2. SECTION ANCHORS — generous top-border + spaced sectionTitle creates
//      breathing room that signals a new chapter (replaces uniform card cadence)
//   3. TIGHTER content — projects/skills use full-width with less padding
//
// Gold accent (#c8a96e) used exclusively for accent highlights, CTAs, and
// section overlines — never on body text. All body type is Epilogue light/300.
// Display type is Cormorant Garamond italic (not a typical "bold sans" hero).
// ─────────────────────────────────────────────────────────────────────────────
const manuscriptTemplate: ProfileTemplateDefinition = {
  id: "manuscript",
  label: "Manuscript",
  description: "Dark editorial. Cormorant italic display, gold accents, chapter-anchor section breaks that prevent scroll monotony.",
  layout: "stack",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Epilogue:wght@300;400;500;600&display=swap",
    fontBody: "'Epilogue', sans-serif",
    fontDisplay: "'Cormorant Garamond', serif",

    page: "min-h-dvh bg-[#0e0c0a] text-[#e8e0d4] [background-image:radial-gradient(ellipse_60%_40%_at_80%_0%,rgba(200,169,110,0.04)_0%,transparent_60%)]",
    stackMain: "mx-auto w-full max-w-[1100px] px-8 pb-16 pt-14 sm:px-12 lg:px-16",
    stackHeroCard: "border-b border-[#e8e0d4]/10 pb-14",

    // Sidebar — stack layout doesn't use these but they must be set
    sidebarOuter: "flex w-full min-h-dvh flex-col md:flex-row",
    sidebarLeft: "w-full shrink-0 px-6 pt-8 pb-6 md:sticky md:top-0 md:h-screen md:w-[260px] md:overflow-y-auto md:border-r md:border-[#e8e0d4]/8 md:px-7 md:py-10 flex flex-col gap-0",
    sidebarRight: "flex-1 min-w-0 px-6 pb-16 pt-8 md:px-10 md:pt-10",
    sidebarImageRing: "ring-1 ring-[#c8a96e]/30 ring-offset-1 ring-offset-[#0e0c0a]",
    sidebarNavSection: "mt-5 mb-1 px-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#e8e0d4]/20 select-none",
    sidebarNavItem: "group relative flex w-full items-center gap-2.5 px-2 py-[5px] text-[13px] text-[#e8e0d4]/45 transition-colors hover:text-[#e8e0d4]/80",
    sidebarNavItemHover: "before:absolute before:inset-0 before:bg-[#c8a96e]/5 before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
    sidebarNavIcon: "shrink-0 text-[#e8e0d4]/25 group-hover:text-[#c8a96e]/60 transition-colors",
    sidebarMeta: "text-[11px] text-[#e8e0d4]/22 leading-snug",
    sidebarDivider: "my-4 border-t border-[#e8e0d4]/6",
    sidebarResumeCard: "border border-[#c8a96e]/15 bg-[#c8a96e]/4 px-3 py-2.5",
    sidebarProjectCard: "border border-[#e8e0d4]/8 bg-[#14120f]/50 p-4 transition-all hover:border-[#c8a96e]/20",
    sidebarProjectIndex: "text-[10px] tabular-nums tracking-widest text-[#c8a96e]/40",
    sidebarProjectTitle: "font-light tracking-wide text-[#e8e0d4] leading-snug",
    sidebarSkillGroup: "flex flex-col gap-2",
    sidebarExpItem: "relative pl-3 before:absolute before:left-0 before:top-[6px] before:h-[calc(100%-6px)] before:w-px before:bg-[#c8a96e]/18",
    sidebarExpRole: "text-sm font-light text-[#e8e0d4] leading-tight",
    sidebarExpOrg: "text-xs text-[#c8a96e]/50 mt-0.5",
    sidebarExpBullet: "text-sm text-[#e8e0d4]/38",

    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",

    scrollbarCss: sb({ size: 6, trackBg: "#0a0806", thumbBg: "#2a2420", thumbHover: "#c8a96e", radius: 0 }),

    // The heroName is deliberately light + italic — opposite of the typical black-bold.
    // This creates differentiation from every other template at first glance.
    heroName: "mt-3 text-[clamp(52px,7vw,108px)] font-light italic leading-[0.92] tracking-tight text-[#e8e0d4]",
    heroHeadline: "mt-4 text-sm font-light leading-relaxed text-[#e8e0d4]/40 tracking-[0.04em]",
    heroBio: "mt-5 text-base italic font-light text-[#e8e0d4]/35 leading-[1.75] lg:max-w-[55%] lg:ml-[40%]",

    pill: "inline-flex items-center gap-1.5 border border-[#e8e0d4]/12 bg-[#e8e0d4]/3 px-3 py-1 text-[11px] font-light text-[#e8e0d4]/45 tracking-wide",
    pillAccent: "inline-flex items-center gap-1.5 border border-[#c8a96e]/35 bg-[#c8a96e]/10 px-3 py-1 text-[11px] font-medium text-[#c8a96e] tracking-wide",

    // Sections use generous top-padding as the visual chapter break.
    // The sectionTitle has wide letter-spacing + low opacity — it's a chapter label,
    // not a bold heading. The content weight contrast does the navigation work.
    section: "mt-14 border-t border-[#e8e0d4]/10 pt-10",
    sectionTitle: "inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.45em] text-[#c8a96e]/55",

    ctaPrimary: "inline-flex items-center gap-2 border border-[#c8a96e]/45 bg-[#c8a96e]/8 px-6 py-2.5 text-sm font-medium text-[#c8a96e] tracking-[0.08em] transition-all hover:bg-[#c8a96e] hover:text-[#0e0c0a] not-italic",
    ctaOutline: "inline-flex items-center gap-2 border border-[#e8e0d4]/18 px-6 py-2.5 text-sm font-light text-[#e8e0d4]/50 tracking-[0.06em] transition-all hover:border-[#e8e0d4]/38 hover:text-[#e8e0d4]/80 not-italic",

    linkRow: "flex items-center gap-3 border-b border-[#e8e0d4]/6 py-3.5 text-[#e8e0d4]/42 transition-colors hover:text-[#c8a96e] last:border-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border border-[#e8e0d4]/10 bg-[#c8a96e]/6 text-[#c8a96e]/55",

    // projectCard is full-bleed within the section, no inner card border.
    // Uses a left accent line + generous padding to separate items.
    projectCard: "border-t border-[#e8e0d4]/8 pt-8 pb-4 not-italic",
    projectCardAlt: "border border-[#e8e0d4]/6 bg-[#14120f]/50 p-5 not-italic",

    iconBtn: "flex h-7 w-7 items-center justify-center border border-[#e8e0d4]/12 text-[#e8e0d4]/35 transition-colors hover:border-[#c8a96e]/40 hover:text-[#c8a96e]",
    chip: "border border-[#e8e0d4]/12 bg-[#e8e0d4]/3 px-2.5 py-0.5 text-[11px] font-light text-[#e8e0d4]/42 tracking-[0.06em]",

    footer: "mt-0 border-t border-[#e8e0d4]/8 pt-5 pb-4 text-[11px] font-light text-[#e8e0d4]/18 tracking-[0.12em]",
    divider: "my-0 border-t border-[#e8e0d4]/6",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// VERDICT — STACK · chalk white + tungsten black · Bebas Neue + Instrument Serif + Barlow
//
// Anti-scroll-monotony design. The key mechanism:
//   • heroCard is inverted (black bg) — you enter dark, then scroll to light
//   • Alternating contrast is built into projectCard/projectCardAlt classes:
//     odd projects use the dark inverted card, even use the light card.
//     The shell already alternates between projectCard and projectCardAlt.
//   • Three accent colors are used across section titles / pills to
//     signal different content zones without changing layout
//   • Large Bebas Neue display type at 12vw creates a visual "anchor" at
//     hero that the rest of the page scaffolds from.
//
// Color logic: hero zone = black, content zone = chalk white (#f5f5f0),
// accent zone = crimson (#e63946), depth zone = steel (#457b9d).
// ─────────────────────────────────────────────────────────────────────────────
const verdictTemplate: ProfileTemplateDefinition = {
  id: "verdict",
  label: "Verdict",
  description: "Bold inversions. Bebas Neue hero, inverted-bg hero card, alternating dark/light project cards, crimson accent.",
  layout: "stack",
  styles: {
    fontImport: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600;700&display=swap",
    fontBody: "'Barlow', sans-serif",
    fontDisplay: "'Bebas Neue', display",

    page: "min-h-dvh bg-[#f5f5f0] text-[#111111]",
    stackMain: "mx-auto w-full max-w-[1120px] px-6 pb-0 pt-0 sm:px-8 lg:px-12",
    // Hero card is inverted — black on the outside, content scrolls into white
    stackHeroCard: "bg-[#111111] text-[#f5f5f0] -mx-6 px-6 pt-12 pb-14 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12",

    sidebarOuter: "flex w-full min-h-dvh flex-col md:flex-row",
    sidebarLeft: "w-full shrink-0 px-6 pt-8 pb-6 md:sticky md:top-0 md:h-screen md:w-[260px] md:overflow-y-auto md:border-r-2 md:border-[#111111]/15 md:px-7 md:py-10 flex flex-col gap-0",
    sidebarRight: "flex-1 min-w-0 px-6 pb-16 pt-8 md:px-10 md:pt-10",
    sidebarImageRing: "ring-1 ring-[#e63946]/35 ring-offset-1 ring-offset-[#f5f5f0]",
    sidebarNavSection: "mt-5 mb-1 px-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#111111]/22 select-none",
    sidebarNavItem: "group relative flex w-full items-center gap-2.5 px-2 py-[5px] text-[13px] text-[#111111]/50 transition-colors hover:text-[#111111]",
    sidebarNavItemHover: "before:absolute before:inset-0 before:bg-[#111111]/4 before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
    sidebarNavIcon: "shrink-0 text-[#111111]/28 group-hover:text-[#e63946] transition-colors",
    sidebarMeta: "text-[11px] text-[#111111]/32 leading-snug",
    sidebarDivider: "my-4 border-t-2 border-[#111111]/10",
    sidebarResumeCard: "border-l-2 border-[#e63946] bg-[#e63946]/5 pl-3 py-2.5",
    sidebarProjectCard: "border-2 border-[#111111]/10 bg-white p-4 transition-all hover:border-[#e63946]/40",
    sidebarProjectIndex: "text-[10px] font-bold tabular-nums tracking-[0.2em] text-[#e63946]",
    sidebarProjectTitle: "font-bold text-[#111111] leading-snug",
    sidebarSkillGroup: "flex flex-col gap-2",
    sidebarExpItem: "relative pl-3 before:absolute before:left-0 before:top-[5px] before:h-[calc(100%-5px)] before:w-[2px] before:bg-[#e63946]/35",
    sidebarExpRole: "text-sm font-semibold text-[#111111] leading-tight",
    sidebarExpOrg: "text-xs text-[#e63946] mt-0.5 font-medium",
    sidebarExpBullet: "text-sm text-[#111111]/45",

    magazineMain: "", magazineHeroBanner: "", magazineGrid: "", magazineColWide: "", magazineColNarrow: "",
    bentoMain: "", bentoGrid: "", bentoHero: "", bentoConnect: "", bentoResume: "", bentoProjects: "", bentoSkills: "", bentoExperience: "",
    splitOuter: "", splitLeft: "", splitLeftInner: "", splitRight: "", splitDivider: "", splitHeroArea: "",
    stSection: "", stHeroSection: "", stContentSection: "", stHeroOverlay: "", stHeroContent: "", stSectionInner: "", stProjectCard: "", stNavDot: "", stNavDotActive: "",
    modularGrid: "", modularHeroTile: "", modularProjectTile: "", modularSkillsTile: "", modularExpTile: "", modularConnectTile: "", modularResumeTile: "",
    fsHero: "", fsHeroOverlay: "", fsHeroContent: "", fsContent: "", fsSection: "", fsProjectCard: "",
    zpOuter: "", zpHero: "", zpBlock: "", zpBlockText: "", zpBlockVisual: "", zpBlockAlt: "",
    fpOuter: "", fpHero: "", fpRail: "", fpStream: "", fpStreamItem: "", fpStreamItemAlt: "",

    scrollbarCss: sb({ size: 8, trackBg: "#f5f5f0", thumbBg: "#111111", thumbHover: "#e63946", radius: 0 }),

    // Bebas Neue is display-only weight (no bold variant) — it reads heavy
    // because of its wide-tracking condensed geometry, not weight.
    heroName: "mt-0 text-[clamp(72px,12vw,160px)] font-normal leading-[0.88] tracking-[0.02em] text-[#f5f5f0]",
    heroHeadline: "mt-4 text-lg italic font-light leading-snug text-[#f5f5f0]/48",
    heroBio: "mt-4 text-sm font-light text-[#f5f5f0]/38 leading-relaxed max-w-xl",

    pill: "inline-flex items-center gap-1.5 border-[1.5px] border-[#f5f5f0]/20 bg-transparent px-3 py-1 text-[11px] font-medium text-[#f5f5f0]/50 tracking-wide",
    pillAccent: "inline-flex items-center gap-1.5 border-[1.5px] border-[#e63946] bg-transparent px-3 py-1 text-[11px] font-bold text-[#e63946] tracking-wide",

    // Sections land in the white (chalk) zone. The heavy 2px border + uppercase
    // Barlow label creates a clear zone break without needing card chrome.
    section: "mt-0 py-12 border-t-2 border-[#111111]",
    sectionTitle: "inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.38em] text-[#111111]/30",

    ctaPrimary: "inline-flex items-center gap-2 bg-[#e63946] px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#c02030] not-italic",
    ctaOutline: "inline-flex items-center gap-2 border-[1.5px] border-[#111111]/22 px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#111111]/55 transition-all hover:border-[#111111]/45 hover:text-[#111111] not-italic",

    linkRow: "flex items-center gap-3 py-2.5 text-[#111111]/40 transition-colors hover:text-[#e63946] border-b border-[#111111]/8 last:border-0",
    linkRowIcon: "flex h-7 w-7 shrink-0 items-center justify-center border-[1.5px] border-[#111111]/15 bg-white text-[#111111]/40",

    // The dark card (projectCard) gets used for index 0, 2, 4…
    // Light card (projectCardAlt) for index 1, 3, 5…
    // This creates the alternating inversion without shell changes.
    projectCard: "border-[1.5px] border-[#111111] bg-[#111111] text-[#f5f5f0] p-6 not-italic",
    projectCardAlt: "border-[1.5px] border-[#111111]/15 bg-white p-6 not-italic",

    iconBtn: "flex h-7 w-7 items-center justify-center border-[1.5px] border-[#111111]/20 text-[#111111]/40 transition-colors hover:border-[#e63946]/60 hover:text-[#e63946]",
    chip: "border-[1.5px] border-[#111111]/14 bg-transparent px-2.5 py-0.5 text-[11px] font-medium text-[#111111]/45 uppercase tracking-[0.06em]",

    // Footer undoes the page padding and uses full-bleed border — mirrors the hero.
    footer: "py-4 border-t-2 border-[#111111] -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 text-[11px] font-medium uppercase tracking-[0.18em] text-[#111111]/25",
    divider: "my-0 border-t-[1.5px] border-[#111111]/10",
  },
};

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
  swiss: swissTemplate,
  horizon: horizonTemplate,
  odyssey: odysseyTemplate,
  mosaic: mosaicTemplate,
  cinematic: cinematicTemplate,
  current: currentTemplate,
  dispatch: dispatchTemplate,
  morning: morningTemplate,
  elegance: eleganceTemplate,
  sailho: sailhoTemplate,
  device: deviceTemplate,
  manuscript: manuscriptTemplate,
  verdict: verdictTemplate,
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
};