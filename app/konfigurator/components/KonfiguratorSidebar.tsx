"use client";

import { useState } from "react";
import type { Asset, PrintMaterial } from "../types";
import DraggableAssetCard from "./DraggableAssetCard";
import SizeChartModal from "./SizeChartModal";

interface KonfiguratorSidebarProps {
  assets: Asset[];
  selectedAsset: Asset | undefined;
  printMaterialInputName?: string;
  previewOnly: boolean;
  isPreparingDraft: boolean;
  draftPreparationError: string;
  draftPreparationSuccess: string;
  printMaterial: PrintMaterial;
  onAssetAssign: (assetId: string) => void;
  onAssetRemove: (assetId: string) => void;
  onUploadModalOpen: () => void;
  onPreviewOnlyToggle: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onPrintMaterialChange: (material: PrintMaterial) => void;
  onPrepareDraft: () => void;
  onBackToSelection: () => void;
}

export function KonfiguratorSidebar({
  assets,
  selectedAsset,
  printMaterialInputName = "printMaterial",
  previewOnly,
  isPreparingDraft,
  draftPreparationError,
  draftPreparationSuccess,
  printMaterial,
  onAssetAssign,
  onAssetRemove,
  onUploadModalOpen,
  onPreviewOnlyToggle,
  onRotateLeft,
  onRotateRight,
  onPrintMaterialChange,
  onPrepareDraft,
  onBackToSelection,
}: KonfiguratorSidebarProps) {
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  return (
    <>
      <aside className="rounded-4xl border border-white/20 bg-[linear-gradient(160deg,rgba(8,8,8,0.72),rgba(20,20,20,0.5))] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5">
        <button
          type="button"
          onClick={onUploadModalOpen}
          className="mt-4 w-full rounded-xl bg-nordwerk-orange px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          + Bilder hochladen
        </button>

        <div className="mt-4 max-h-96 space-y-3 overflow-y-auto overflow-x-hidden pr-1">
          {assets.length === 0 ? (
            <div className="rounded-xl border border-white/15 bg-black/30 p-4 text-sm text-white/80">
              Noch keine Bilder hochgeladen.
            </div>
          ) : (
            assets.map((asset) => (
              <DraggableAssetCard
                key={asset.id}
                asset={asset}
                onAssign={() => onAssetAssign(asset.id)}
                onRemove={() => onAssetRemove(asset.id)}
              />
            ))
          )}
        </div>
      
        {/* Aktive Zone Controls */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Aktive Zone
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              className="flex-1 rounded-lg bg-white/10 py-2 text-xs font-medium text-white transition hover:bg-white/20 disabled:opacity-40"
              onClick={onRotateLeft}
              disabled={!selectedAsset}
            >
              ↺ Links
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-white/10 py-2 text-xs font-medium text-white transition hover:bg-white/20 disabled:opacity-40"
              onClick={onRotateRight}
              disabled={!selectedAsset}
            >
              ↻ Rechts
            </button>
          </div>

          <button
            type="button"
            onClick={onPreviewOnlyToggle}
            className="mt-4 w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/15"
          >
            {previewOnly ? "Bearbeitung anzeigen" : "Nur Bild anzeigen"}
          </button>
        </div>

        {/* Druckmaterial */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Druckmaterial
          </p>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={printMaterialInputName}
                value="druck"
                checked={printMaterial === "druck"}
                onChange={(e) =>
                  onPrintMaterialChange(e.target.value as PrintMaterial)
                }
                className="cursor-pointer"
              />
              <span className="text-sm text-white/85">Druck</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={printMaterialInputName}
                value="stick"
                checked={printMaterial === "stick"}
                onChange={(e) =>
                  onPrintMaterialChange(e.target.value as PrintMaterial)
                }
                className="cursor-pointer"
              />
              <span className="text-sm text-white/85">Stick</span>
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="font-semibold underline tracking-[0.08em]" style={{ color: "#fbbf24" }}>
            Bitte geben Sie bei Ihrer Anfrage unbedingt die gewünschte Anzahl, Farbe sowie die Größen der Kleidungsstücke an, damit wir Ihre Anfrage schnell und korrekt bearbeiten können
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Größentabelle
          </p>
          <p className="mt-2 text-xs text-white/80">
            Größen direkt im Konfigurator prüfen, ohne die Nordwerk-Seite zu verlassen.
          </p>
          <button
            type="button"
            onClick={() => setIsSizeChartOpen(true)}
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/20"
          >
            Größentabelle anzeigen
          </button>
        </div>

        {/* Anfrage Form */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Anfrage über Hauptformular
          </p>
          <p className="mt-2 text-xs text-white/80">
            Die Konfiguration wird gespeichert und im Kontaktformular auf der
            Startseite mitgesendet.
          </p>
          <button
            type="button"
            onClick={onPrepareDraft}
            disabled={isPreparingDraft}
            className="mt-3 w-full rounded-lg bg-nordwerk-orange px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPreparingDraft
              ? "Konfiguration wird vorbereitet..."
              : "Zum Kontaktformular"}
          </button>
          {draftPreparationSuccess ? (
            <p className="mt-2 text-xs text-emerald-300">
              {draftPreparationSuccess}
            </p>
          ) : null}
          {draftPreparationError ? (
            <p className="mt-2 text-xs text-red-300">{draftPreparationError}</p>
          ) : null}
        </div>

        {/* Zurück zur Produktauswahl */}
        <button
          type="button"
          onClick={onBackToSelection}
          className="mt-6 w-full rounded-xl bg-nordwerk-orange px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          ← Zurück zur Produktauswahl
        </button>
      </aside>

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />
    </>
  );
}
