"use client";

import { listTemplates } from "@/lib/profile-templates";
import type { ProfileTemplateId, ProfileLayoutVariant } from "@/lib/profile-templates";

interface TemplatePickerProps {
  currentTemplateId?: ProfileTemplateId;
  onSelect: (id: ProfileTemplateId) => void;
}

const layoutLabels: Record<ProfileLayoutVariant, string> = {
  stack: "Centered",
  sidebar: "Sidebar",
  magazine: "Magazine",
};

const layoutDots: Record<ProfileLayoutVariant, string> = {
  stack: "bg-sky-400",
  sidebar: "bg-violet-400",
  magazine: "bg-amber-400",
};

// Visual preview swatches per template (bg + accent color pair)
const templateSwatches: Record<ProfileTemplateId, { bg: string; accent: string; text: string }> = {
  linkboard: { bg: "#f5f0e8", accent: "#f04939", text: "#1a1714" },
  dusk:      { bg: "#0d0b1a", accent: "#a78bfa", text: "#e8e4ff" },
  chalk:     { bg: "#f8f8f6", accent: "#1c1c1c", text: "#1c1c1c" },
  forest:    { bg: "#0f1a0f", accent: "#4ade80", text: "#e8f0e8" },
  neon:      { bg: "#0e0e12", accent: "#ff2d78", text: "#f0eeff" },
  ivory:     { bg: "#f9f5ee", accent: "#2a2520", text: "#2a2520" },
  blueprint: { bg: "#0a1628", accent: "#4a9eff", text: "#ddeeff" },
  terracotta:{ bg: "#f2ebe0", accent: "#c8541a", text: "#2c1810" },
  void:      { bg: "#000000", accent: "#ffffff", text: "#f5f5f5" },
  candy:     { bg: "#f5d6f5", accent: "#b06eff", text: "#2d1f4e" },
};

export function TemplatePicker({ currentTemplateId, onSelect }: TemplatePickerProps) {
  const templates = listTemplates();

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold">Choose a theme</h2>
        <div className="flex gap-3 text-xs text-black/50">
          {(["stack", "sidebar", "magazine"] as ProfileLayoutVariant[]).map((l) => (
            <span key={l} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${layoutDots[l]}`} />
              {layoutLabels[l]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {templates.map((template) => {
          const swatch = templateSwatches[template.id];
          const isActive = template.id === currentTemplateId;

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={[
                "group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all",
                isActive
                  ? "border-black shadow-lg scale-[1.02]"
                  : "border-black/10 hover:border-black/30 hover:shadow-md",
              ].join(" ")}
              aria-pressed={isActive}
              title={template.description}
            >
              {/* Swatch preview */}
              <div
                className="relative h-20 w-full overflow-hidden"
                style={{ backgroundColor: swatch.bg }}
              >
                {/* Simulated layout lines */}
                {template.layout === "stack" && (
                  <div className="absolute inset-x-4 top-4 flex flex-col gap-1.5">
                    <div className="h-2 w-3/4 rounded-sm opacity-25" style={{ backgroundColor: swatch.text }} />
                    <div className="h-1.5 w-1/2 rounded-sm opacity-15" style={{ backgroundColor: swatch.text }} />
                    <div className="mt-1 h-5 w-full rounded-lg opacity-15" style={{ backgroundColor: swatch.accent }} />
                  </div>
                )}
                {template.layout === "sidebar" && (
                  <>
                    <div className="absolute bottom-0 left-0 top-0 w-[30%] opacity-20" style={{ backgroundColor: swatch.text }} />
                    <div className="absolute right-2 top-3 flex w-[62%] flex-col gap-1.5">
                      <div className="h-1.5 w-full rounded-sm opacity-25" style={{ backgroundColor: swatch.text }} />
                      <div className="h-1.5 w-4/5 rounded-sm opacity-15" style={{ backgroundColor: swatch.text }} />
                      <div className="h-1.5 w-full rounded-sm opacity-15" style={{ backgroundColor: swatch.text }} />
                    </div>
                  </>
                )}
                {template.layout === "magazine" && (
                  <>
                    <div className="absolute left-0 right-0 top-0 h-[45%] opacity-15" style={{ backgroundColor: swatch.text }} />
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
                      <div className="h-5 flex-[2] rounded opacity-15" style={{ backgroundColor: swatch.text }} />
                      <div className="h-5 flex-1 rounded opacity-15" style={{ backgroundColor: swatch.text }} />
                    </div>
                  </>
                )}
                {/* Accent dot */}
                <div
                  className="absolute right-2 top-2 h-4 w-4 rounded-full shadow-sm"
                  style={{ backgroundColor: swatch.accent }}
                />
                {/* Active checkmark */}
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Label row */}
              <div className="flex items-center justify-between gap-1 bg-white px-2.5 py-2">
                <span className="text-[11px] font-semibold text-black/80">{template.label}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${layoutDots[template.layout]}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
