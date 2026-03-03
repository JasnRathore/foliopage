"use client";

import { useRef, useState, useCallback } from "react";
import {
  ArrowsLeftRight,
  Rows,
  SquaresFour,
  FilmScript,
  ArrowsDownUp,
  GridFour,
  Layout,
  FrameCorners,
  ArrowsIn,
  Check,
  UploadSimple,
  ImageSquare,
  Sliders,
  X,
} from "@phosphor-icons/react";
import {
  defaultProfileTemplateId,
  listTemplates,
  resolveProfileTemplate,
} from "@/lib/profile-templates";
import type { ProfileTemplateId, ProfileLayoutVariant } from "@/lib/profile-templates";

// ─── Layout meta ──────────────────────────────────────────────────────────────

const LAYOUT_META: Record<
  ProfileLayoutVariant,
  { label: string; description: string; Icon: React.ElementType }
> = {
  stack: { label: "Stack", description: "Centered single column. Clean and scannable.", Icon: Rows },
  sidebar: { label: "Sidebar", description: "Linear-style app nav. Fixed identity panel left.", Icon: Layout },
  magazine: { label: "Magazine", description: "Full-bleed hero banner + two-column grid.", Icon: GridFour },
  bento: { label: "Bento", description: "Swiss-grid asymmetric tile mosaic.", Icon: SquaresFour },
  split: { label: "Split", description: "Fixed 42vw identity left, scrollable content right.", Icon: ArrowsLeftRight },
  scrollytelling: { label: "Cinematic", description: "Full-height snap sections with background image.", Icon: FilmScript },
  modular: { label: "Modular", description: "Variable-height CSS grid tile mosaic.", Icon: GridFour },
  fullscreen: { label: "Full-Screen", description: "100dvh background image hero, content below.", Icon: FrameCorners },
  zpattern: { label: "Z-Pattern", description: "Alternating left/right editorial blocks.", Icon: ArrowsDownUp },
  fpattern: { label: "F-Pattern", description: "Newspaper masthead + left lead + right stream.", Icon: ArrowsIn },
};

const TEMPLATE_THEME_SWATCHES: Record<ProfileTemplateId, [string, string, string]> = {
  linkboard: ["#f4efe5", "#f04939", "#d4e84a"],
  dusk: ["#1a1208", "#c8941a", "#f0e8d8"],
  chalk: ["#f7f4ef", "#111111", "#d9d6ce"],
  forest: ["#080f0e", "#1aff8c", "#d4ede6"],
  neon: ["#08090e", "#6366f1", "#f0eee8"],
  ivory: ["#faf9f6", "#1a1a18", "#e8e5df"],
  blueprint: ["#2f63c9", "#f2eee3", "#161616"],
  terracotta: ["#f5ede0", "#c9541a", "#2a1f15"],
  void: ["#0d1117", "#388bfd", "#e6edf3"],
  candy: ["#ff2d55", "#0a96ff", "#ffe100"],
  swiss: ["#e04038", "#000000", "#ffffff"],
  horizon: ["#111827", "#06b6d4", "#f8fafc"],
  odyssey: ["#08090e", "#6366f1", "#f0eee8"],
  mosaic: ["#f5ede0", "#c9541a", "#2a1f15"],
  cinematic: ["#0e0e10", "#c4a882", "#f4f0ea"],
  current: ["#f8faff", "#0ea5e9", "#0f172a"],
  dispatch: ["#faf9f6", "#1a1a18", "#f3ede3"],
  morning: ["#181818", "#38d6e8", "#e05c2e"],
  elegance: ["#ffffff", "#111111", "#f5e800"],
  sailho: ["#f8f8f6", "#1dcfc0", "#111111"],
  device: ["#111111", "#ffffff", "#2a2a2a"],
  manuscript: ["#0e0c0a", "#c8a96e", "#e8e0d4"],
  verdict: ["#111111", "#e63946", "#f5f5f0"],
};

// ─── Layout preview thumbnails ────────────────────────────────────────────────

function LayoutPreview({ layout, active }: { layout: ProfileLayoutVariant; active: boolean }) {
  const stroke = active ? "rgba(255,255,255,0.8)" : "rgba(14,14,14,0.4)";
  const fill = active ? "rgba(255,255,255,0.15)" : "rgba(14,14,14,0.07)";
  const accent = active ? "rgba(255,255,255,0.3)" : "rgba(14,14,14,0.14)";
  const W = 80; const H = 54;

  const schematics: Record<ProfileLayoutVariant, React.ReactNode> = {
    stack: (
      <>
        <rect x="12" y="4" width="56" height="14" rx="2" fill={accent} />
        <rect x="12" y="21" width="56" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="12" y="29" width="56" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="12" y="37" width="56" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="12" y="45" width="36" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    sidebar: (
      <>
        <rect x="2" y="2" width="22" height="50" rx="1" fill={accent} />
        <rect x="27" y="2" width="51" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="27" y="12" width="51" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="27" y="22" width="51" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="27" y="32" width="51" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="27" y="42" width="31" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    magazine: (
      <>
        <rect x="2" y="2" width="76" height="16" rx="1" fill={accent} />
        <rect x="2" y="21" width="48" height="31" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="53" y="21" width="25" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="53" y="38" width="25" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    bento: (
      <>
        <rect x="2" y="2" width="76" height="12" rx="1" fill={accent} />
        <rect x="2" y="17" width="48" height="18" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="53" y="17" width="25" height="18" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="2" y="38" width="25" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="30" y="38" width="23" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="56" y="38" width="22" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    split: (
      <>
        <rect x="2" y="2" width="36" height="50" rx="1" fill={accent} />
        <line x1="40" y1="2" x2="40" y2="52" stroke={stroke} strokeWidth=".75" strokeDasharray="3 2" />
        <rect x="43" y="2" width="35" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="43" y="12" width="35" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="43" y="22" width="35" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="43" y="32" width="35" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="43" y="42" width="22" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    scrollytelling: (
      <>
        <rect x="2" y="2" width="76" height="50" rx="1" fill={accent} opacity=".4" />
        <rect x="2" y="2" width="76" height="50" rx="1" fill="none" stroke={stroke} strokeWidth=".5" />
        <text x="40" y="24" textAnchor="middle" fill={stroke} fontSize="7" fontWeight="600">HERO</text>
        <text x="40" y="33" textAnchor="middle" fill={stroke} fontSize="5" opacity=".6">bg image</text>
        <circle cx="74" cy="20" r="1.5" fill={stroke} />
        <circle cx="74" cy="27" r="1.5" fill={stroke} opacity=".4" />
        <circle cx="74" cy="34" r="1.5" fill={stroke} opacity=".4" />
        <circle cx="74" cy="41" r="1.5" fill={stroke} opacity=".4" />
      </>
    ),
    modular: (
      <>
        <rect x="2" y="2" width="36" height="26" rx="1" fill={accent} />
        <rect x="41" y="2" width="17" height="12" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="61" y="2" width="17" height="12" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="41" y="16" width="17" height="12" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="61" y="16" width="17" height="12" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="2" y="31" width="36" height="21" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="41" y="31" width="17" height="21" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="61" y="31" width="17" height="10" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="61" y="43" width="17" height="9" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    fullscreen: (
      <>
        <rect x="2" y="2" width="76" height="32" rx="1" fill={accent} opacity=".5" />
        <rect x="2" y="2" width="76" height="32" rx="1" fill="none" stroke={stroke} strokeWidth=".5" />
        <text x="40" y="17" textAnchor="middle" fill={stroke} fontSize="6" fontWeight="700">NAME</text>
        <line x1="30" y1="21" x2="50" y2="21" stroke={stroke} strokeWidth=".5" opacity=".5" />
        <rect x="2" y="37" width="76" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="2" y="47" width="50" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    zpattern: (
      <>
        <rect x="2" y="2" width="76" height="12" rx="1" fill={accent} />
        <line x1="2" y1="18" x2="78" y2="18" stroke={stroke} strokeWidth=".5" opacity=".4" />
        <rect x="2" y="20" width="35" height="12" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="43" y="20" width="35" height="12" rx="1" fill={accent} opacity=".5" />
        <line x1="78" y1="36" x2="2" y2="36" stroke={stroke} strokeWidth=".5" opacity=".4" strokeDasharray="2 2" />
        <rect x="2" y="38" width="35" height="12" rx="1" fill={accent} opacity=".5" />
        <rect x="43" y="38" width="35" height="12" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
    fpattern: (
      <>
        <rect x="2" y="2" width="76" height="12" rx="1" fill={accent} />
        <rect x="2" y="17" width="76" height="6" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="2" y="26" width="30" height="26" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="35" y="26" width="43" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="35" y="34" width="43" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
        <rect x="35" y="42" width="28" height="5" rx="1" fill={fill} stroke={stroke} strokeWidth=".5" />
      </>
    ),
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-hidden>
      {schematics[layout] ?? null}
    </svg>
  );
}

function ThemeSwatches({ colors }: { colors: readonly string[] }) {
  return (
    <div className="flex items-center gap-1">
      {colors.map((color, idx) => (
        <span
          key={`${color}-${idx}`}
          className="h-3.5 w-3.5 border border-[#0e0e0e]/20"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      ))}
    </div>
  );
}

// ─── Bg image upload zone ─────────────────────────────────────────────────────

interface BgImageUploaderProps {
  value: string;
  overlay: number;
  onImageChange: (url: string) => void;
  onOverlayChange: (value: number) => void;
}

function BgImageUploader({ value, overlay, onImageChange, onOverlayChange }: BgImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") onImageChange(result);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="mt-4 border border-[#0e0e0e]/10 bg-[#f0ece2] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#0e0e0e]/40 flex items-center gap-1.5">
          <ImageSquare size={11} aria-hidden />
          Background Image
        </p>
        {value && (
          <button
            type="button"
            onClick={() => onImageChange("")}
            className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/40 transition-colors hover:text-[#e8320a]"
          >
            <X size={10} aria-hidden />
            Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="relative aspect-video overflow-hidden border border-[#0e0e0e]/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Background preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black transition-opacity" style={{ opacity: overlay / 100 }} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 border border-white/20 bg-black/60 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur-sm transition-colors hover:text-white"
          >
            <UploadSimple size={9} aria-hidden />
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={[
            "flex w-full flex-col items-center justify-center border-2 border-dashed py-8 px-4 text-center transition-all",
            dragging
              ? "border-[#e8320a]/50 bg-[#e8320a]/5"
              : "border-[#0e0e0e]/15 hover:border-[#e8320a]/40 hover:bg-[#e8320a]/[0.03]",
          ].join(" ")}
        >
          <UploadSimple size={18} className="mb-2 text-[#0e0e0e]/30" aria-hidden />
          <p className="text-xs font-black text-[#0e0e0e]/50">
            Drop image or <span className="text-[#e8320a]">browse files</span>
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/30">JPG · PNG · WebP · max 8 MB</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        tabIndex={-1}
      />

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#0e0e0e]/40">
            <Sliders size={9} aria-hidden />
            Overlay darkness
          </p>
          <span className="font-mono text-[9px] tabular-nums text-[#0e0e0e]/40">{overlay}%</span>
        </div>
        <input
          type="range"
          min={0} max={90} step={5}
          value={overlay}
          onChange={(e) => onOverlayChange(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none bg-[#0e0e0e]/10 accent-[#e8320a]"
        />
        <div className="mt-1 flex justify-between">
          <span className="font-mono text-[9px] text-[#0e0e0e]/25">Lighter</span>
          <span className="font-mono text-[9px] text-[#0e0e0e]/25">Darker</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main TemplatePicker ───────────────────────────────────────────────────────

export interface TemplatePickerProps {
  value?: ProfileTemplateId;
  currentTemplateId?: ProfileTemplateId;
  bgImageUrl?: string;
  bgImageOverlay?: number;
  onChange?: (id: ProfileTemplateId) => void;
  onSelect?: (id: ProfileTemplateId) => void;
  onBgImageChange?: (url: string) => void;
  onBgImageOverlayChange?: (value: number) => void;
}

const LAYOUT_ORDER: ProfileLayoutVariant[] = [
  "stack", "sidebar", "magazine", "bento",
  "split", "scrollytelling", "modular", "fullscreen", "zpattern", "fpattern",
];

function randomIndex(max: number): number {
  if (max <= 1) return 0;
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
}

export function TemplatePicker({
  value,
  currentTemplateId,
  bgImageUrl,
  bgImageOverlay,
  onChange,
  onSelect,
  onBgImageChange,
  onBgImageOverlayChange,
}: TemplatePickerProps) {
  const allTemplates = listTemplates();
  const [activeLayout, setActiveLayout] = useState<ProfileLayoutVariant | "all">("all");

  const selectedTemplateId = value ?? currentTemplateId ?? defaultProfileTemplateId;
  const handleChange = onChange ?? onSelect ?? (() => { });
  const handleBgImageChange = onBgImageChange ?? (() => { });
  const handleBgImageOverlayChange = onBgImageOverlayChange ?? (() => { });
  const currentBgImageUrl = bgImageUrl ?? "";
  const currentBgImageOverlay = bgImageOverlay ?? 50;

  const selectedTemplate = resolveProfileTemplate(selectedTemplateId);
  const showBgUpload = selectedTemplate.requiresBgImage === true;
  const randomEligibleTemplates = allTemplates.filter((template) => !template.requiresBgImage);

  function pickRandomTheme(): void {
    if (randomEligibleTemplates.length === 0) return;
    const candidates =
      randomEligibleTemplates.length > 1
        ? randomEligibleTemplates.filter((template) => template.id !== selectedTemplateId)
        : randomEligibleTemplates;
    const selected =
      candidates[randomIndex(candidates.length)] ?? randomEligibleTemplates[0];
    if (selected) {
      handleChange(selected.id);
    }
  }

  const byLayout = LAYOUT_ORDER.reduce<Record<ProfileLayoutVariant, typeof allTemplates>>(
    (acc, layout) => {
      acc[layout] = allTemplates.filter((t) => t.layout === layout);
      return acc;
    },
    {} as Record<ProfileLayoutVariant, typeof allTemplates>,
  );

  const visibleTemplates = activeLayout === "all" ? allTemplates : (byLayout[activeLayout] ?? []);

  return (
    <div className="border border-[#0e0e0e]/10 bg-[#f8f6f0]">

      {/* Header */}
      <div className="border-b border-[#0e0e0e]/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#0e0e0e]/35">Appearance</p>
            <h3 className="mt-0.5 text-sm font-black text-[#0e0e0e]">Choose a template</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={pickRandomTheme}
              className="border border-[#0e0e0e]/12 bg-white px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-widest text-[#0e0e0e]/50 transition-all hover:border-[#0e0e0e]/25 hover:text-[#0e0e0e]"
            >
              Random theme
            </button>
            {selectedTemplateId && (
              <div className="flex items-center gap-2">
                <ThemeSwatches colors={TEMPLATE_THEME_SWATCHES[selectedTemplateId]} />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#0e0e0e]/40">
                  {selectedTemplate.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Layout filter tabs */}
      <div className="overflow-x-auto border-b border-[#0e0e0e]/10 px-5 py-3">
        <div className="flex min-w-max gap-1">
          <button
            type="button"
            onClick={() => setActiveLayout("all")}
            className={[
              "whitespace-nowrap px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-all",
              activeLayout === "all"
                ? "border border-[#e8320a] bg-[#e8320a] text-white"
                : "border border-[#0e0e0e]/10 text-[#0e0e0e]/50 hover:border-[#0e0e0e]/25 hover:text-[#0e0e0e]",
            ].join(" ")}
          >
            All
          </button>
          {LAYOUT_ORDER.map((layout) => {
            const meta = LAYOUT_META[layout];
            const Icon = meta.Icon;
            return (
              <button
                key={layout}
                type="button"
                onClick={() => setActiveLayout(layout)}
                className={[
                  "flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-all",
                  activeLayout === layout
                    ? "border border-[#e8320a] bg-[#e8320a] text-white"
                    : "border border-[#0e0e0e]/10 text-[#0e0e0e]/50 hover:border-[#0e0e0e]/25 hover:text-[#0e0e0e]",
                ].join(" ")}
              >
                <Icon size={10} aria-hidden />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout description strip */}
      {activeLayout !== "all" && (
        <div className="border-b border-[#0e0e0e]/10 bg-[#0e0e0e]/[0.03] px-5 py-2.5">
          <p className="text-[11px] leading-relaxed text-[#0e0e0e]/55">
            {LAYOUT_META[activeLayout].description}
          </p>
        </div>
      )}

      {/* Template grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visibleTemplates.map((template) => {
            const isActive = template.id === selectedTemplateId;
            const meta = LAYOUT_META[template.layout];
            const Icon = meta.Icon;
            const colors = TEMPLATE_THEME_SWATCHES[template.id as ProfileTemplateId] ?? TEMPLATE_THEME_SWATCHES.linkboard;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleChange(template.id as ProfileTemplateId)}
                className={[
                  "group relative flex flex-col overflow-hidden text-left transition-all focus-visible:outline-none",
                  isActive
                    ? "ring-2 ring-[#e8320a] ring-offset-1 ring-offset-[#f8f6f0]"
                    : "hover:ring-1 hover:ring-[#0e0e0e]/20",
                ].join(" ")}
              >
                {/* Preview area */}
                <div
                  style={{
                    backgroundImage: `linear-gradient(145deg, ${colors[0]} 0%, ${colors[1]} 66%, ${colors[2]} 100%)`,
                  }}
                  className="relative flex w-full aspect-[3/2] items-center justify-center p-4 transition-opacity"
                >
                  <LayoutPreview layout={template.layout} active={isActive} />

                  {isActive && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center bg-[#e8320a]">
                      <Check size={10} weight="bold" className="text-white" aria-hidden />
                    </div>
                  )}

                  {template.requiresBgImage && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 border border-white/20 bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
                      <ImageSquare size={8} className="text-white/70" aria-hidden />
                      <span className="font-mono text-[8px] uppercase tracking-widest text-white/70">bg photo</span>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className={[
                  "flex flex-col gap-1 border-t px-3 py-2.5 transition-colors",
                  isActive
                    ? "border-[#e8320a]/30 bg-[#e8320a]/5"
                    : "border-[#0e0e0e]/10 bg-white group-hover:bg-[#0e0e0e]/[0.02]",
                ].join(" ")}>
                  <div className="flex items-center justify-between gap-1">
                    <span className={[
                      "text-[11px] font-black leading-tight tracking-tight transition-colors",
                      isActive ? "text-[#e8320a]" : "text-[#0e0e0e]/70 group-hover:text-[#0e0e0e]",
                    ].join(" ")}>
                      {template.label}
                    </span>
                    <span className="flex shrink-0 items-center gap-0.5 font-mono text-[8px] uppercase tracking-widest text-[#0e0e0e]/30">
                      <Icon size={8} aria-hidden />
                      {meta.label}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[10px] leading-snug text-[#0e0e0e]/45">
                    {template.description}
                  </p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#0e0e0e]/25">Theme</span>
                    <ThemeSwatches colors={colors} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Background image upload */}
        {showBgUpload && (
          <BgImageUploader
            value={currentBgImageUrl}
            overlay={currentBgImageOverlay}
            onImageChange={handleBgImageChange}
            onOverlayChange={handleBgImageOverlayChange}
          />
        )}

        {/* Selected template summary */}
        {selectedTemplateId && (
          <div className="mt-4 flex items-center justify-between gap-2 border border-[#0e0e0e]/10 bg-[#0e0e0e]/[0.03] px-4 py-2.5">
            <p className="text-[11px] text-[#0e0e0e]/50">
              <span className="font-black text-[#0e0e0e]/75">{selectedTemplate.label}</span>
              <span className="mx-1 text-[#0e0e0e]/25">·</span>
              {LAYOUT_META[selectedTemplate.layout].label}
              {selectedTemplate.requiresBgImage && (
                <span className="ml-1.5 text-[#0e0e0e]/35">· background image recommended</span>
              )}
            </p>
            <ThemeSwatches colors={TEMPLATE_THEME_SWATCHES[selectedTemplateId]} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplatePicker;
