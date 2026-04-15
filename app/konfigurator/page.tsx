/* eslint-disable @next/next/no-img-element */

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductSelectionSection from "./components/ProductSelectionSection";
import UploadModal from "./components/UploadModal";
import { TutorialModal } from "./components/TutorialModal";
import { KonfiguratorPartners } from "./components/KonfiguratorPartners";
import {
  DEFAULT_WORKWEAR_INDEX,
  WORKWEAR_VIEWS_PER_PRODUCT,
  PREVIEW_DROP_ID,
  type WorkwearProductId,
} from "./constants";
import type { PrintMaterial } from "./types";
import {
  getWorkwearProductByIndex,
  getWorkwearProductStartIndex,
} from "./productHelpers";
import {
  createInitialWorkwearZoneState,
  type WorkwearZoneState,
} from "./workwearState";
import { useZoneState, useAssetManagement, useWorkwearPersistence } from "./hooks";
import { KonfiguratorSidebar } from "./components/KonfiguratorSidebar";
import { KonfiguratorPreview } from "./components/KonfiguratorPreview";

export default function Konfigurator() {
  const initialWorkwearZoneState = createInitialWorkwearZoneState(
    DEFAULT_WORKWEAR_INDEX,
  );

  // Zone Management Hook
  const {
    zones,
    setZones,
    selectedZoneId,
    setSelectedZoneId,
    selectedZone,
    zoneCounterRef,
    previewFrameRef,
    rotateArtwork,
    rotateZoneById,
    scaleZoneById,
    setZoneArtworkOffset,
    clearZone,
  } = useZoneState(
    initialWorkwearZoneState.zones,
    initialWorkwearZoneState.selectedZoneId,
  );

  // Asset Management Hook
  const {
    assets,
    assetMap,
    handleFiles,
    removeAsset,
    cleanupAssets,
    clearAssetFromZones,
    assignAssetToZone: assignAssetToZoneUtil,
    handleDragEnd,
  } = useAssetManagement();

  // Workwear State Management
  const workwearStateRef = useRef<Record<number, WorkwearZoneState>>({
    [DEFAULT_WORKWEAR_INDEX]: initialWorkwearZoneState,
  });

  const [activeWorkwearIndex, setActiveWorkwearIndex] = useState(
    DEFAULT_WORKWEAR_INDEX,
  );
  const [previewOnly, setPreviewOnly] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasStartedConfigurator, setHasStartedConfigurator] = useState(false);
  const [isPreparingDraft, setIsPreparingDraft] = useState(false);
  const [draftPreparationError, setDraftPreparationError] = useState("");
  const [draftPreparationSuccess, setDraftPreparationSuccess] = useState("");
  const [availableImageIndexes, setAvailableImageIndexes] = useState<Set<number> | null>(null);
  const [printMaterial, setPrintMaterial] = useState<PrintMaterial>("druck");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDragAssetId, setActiveDragAssetId] = useState<string | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);

  // Persistence Hook
  const {
    saveCurrentWorkwearState,
    loadWorkwearState,
    prepareDraftAndSubmit,
  } = useWorkwearPersistence(
    zones,
    selectedZoneId,
    activeWorkwearIndex,
    setZones,
    setSelectedZoneId,
    setAvailableImageIndexes,
    zoneCounterRef,
    workwearStateRef,
  );

  // Sensors setup for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const { isOver: isOverPreview, setNodeRef: setPreviewDropRef } = useDroppable({
    id: PREVIEW_DROP_ID,
  });

  // Computed values
  const activeProduct = getWorkwearProductByIndex(activeWorkwearIndex);
  const productImageIndexes = useMemo(() => {
    const startIndex = getWorkwearProductStartIndex(activeProduct);
    return Array.from(
      { length: WORKWEAR_VIEWS_PER_PRODUCT },
      (_, offset) => startIndex + offset,
    );
  }, [activeProduct]);

  const visibleProductImageIndexes = useMemo(() => {
    if (!availableImageIndexes) return productImageIndexes;
    return productImageIndexes.filter((index) => availableImageIndexes.has(index));
  }, [availableImageIndexes, productImageIndexes]);

  // Assign asset to zone with proper callbacks
  const assignAssetToSelectedZone = (assetId: string) => {
    if (!selectedZone) return;
    assignAssetToZoneUtil(selectedZone.id, assetId, zones, setZones, setSelectedZoneId);
  };

  // Wrap asset removal with chain cleanup
  const removeAssetWithChainCleanup = (assetId: string) => {
    removeAsset(assetId);
    clearAssetFromZones(assetId, zones, setZones);
  };

  // Drag end handler with proper zone assignment
  const handleDragEndWithAssignment = (event: DragEndEvent) => {
    setActiveDragAssetId(null);
    handleDragEnd(event, zones, selectedZone, (zoneId: string, assetId: string) => {
      assignAssetToZoneUtil(zoneId, assetId, zones, setZones, setSelectedZoneId);
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    if (!activeId.startsWith("asset:")) {
      setActiveDragAssetId(null);
      return;
    }

    setActiveDragAssetId(activeId.slice("asset:".length));
  };

  const activeDragAsset = activeDragAssetId ? assetMap.get(activeDragAssetId) : undefined;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAssets();
    };
  }, [cleanupAssets]);

  // Scroll thumbnail strip on product change
  useEffect(() => {
    thumbnailStripRef.current?.scrollTo({ left: 0 });
  }, [activeProduct]);

  // Handle switch to unavailable image
  useEffect(() => {
    if (!availableImageIndexes || availableImageIndexes.has(activeWorkwearIndex)) {
      return;
    }

    const switchToIndex = (nextIndex: number) => {
      if (nextIndex === activeWorkwearIndex) return;
      saveCurrentWorkwearState(activeWorkwearIndex);
      loadWorkwearState(nextIndex);
      setActiveWorkwearIndex(nextIndex);
    };

    const fallbackInProduct = productImageIndexes.find((index) =>
      availableImageIndexes.has(index),
    );
    if (typeof fallbackInProduct === "number") {
      switchToIndex(fallbackInProduct);
      return;
    }

    const [firstAvailable] = availableImageIndexes;
    if (typeof firstAvailable === "number") {
      switchToIndex(firstAvailable);
    }
  }, [
    activeWorkwearIndex,
    availableImageIndexes,
    productImageIndexes,
    saveCurrentWorkwearState,
    loadWorkwearState,
  ]);

  // Hash navigation
  useEffect(() => {
    const applyHashSelectionState = () => {
      if (window.location.hash === "#auswahl") {
        setHasStartedConfigurator(false);
      }
    };

    const handleSelectionEvent = () => {
      setHasStartedConfigurator(false);
    };

    applyHashSelectionState();
    window.addEventListener("hashchange", applyHashSelectionState);
    window.addEventListener("konfigurator:show-selection", handleSelectionEvent);

    return () => {
      window.removeEventListener("hashchange", applyHashSelectionState);
      window.removeEventListener("konfigurator:show-selection", handleSelectionEvent);
    };
  }, []);

  // Workwear image selection
  const selectWorkwearImage = (nextIndex: number) => {
    if (nextIndex === activeWorkwearIndex) return;
    if (availableImageIndexes && !availableImageIndexes.has(nextIndex)) return;

    saveCurrentWorkwearState(activeWorkwearIndex);
    loadWorkwearState(nextIndex);
    setActiveWorkwearIndex(nextIndex);
  };

  // Start configurator for product
  const startConfiguratorForProduct = (product: WorkwearProductId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setHasStartedConfigurator(true);
    const startIndex = getWorkwearProductStartIndex(product);
    const productIndexes = Array.from(
      { length: WORKWEAR_VIEWS_PER_PRODUCT },
      (_, offset) => startIndex + offset,
    );
    const targetIndex = availableImageIndexes
      ? productIndexes.find((index) => availableImageIndexes.has(index)) ?? startIndex
      : startIndex;

    if (availableImageIndexes && !availableImageIndexes.has(targetIndex)) return;
    selectWorkwearImage(targetIndex);
  };

  // Prepare draft and submit
  const prepareDraftAndOpenMainForm = async () => {
    setIsPreparingDraft(true);
    setDraftPreparationError("");
    setDraftPreparationSuccess("");

    try {
      await prepareDraftAndSubmit(assets, printMaterial, activeWorkwearIndex);

      setDraftPreparationSuccess(
        "Konfiguration vorbereitet. Weiterleitung zum Kontaktformular...",
      );
      window.location.href = "/#kontakt";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unbekannter Fehler";
      setDraftPreparationError(message);
    } finally {
      setIsPreparingDraft(false);
    }
  };

  const sidebarProps: React.ComponentProps<typeof KonfiguratorSidebar> = {
    assets,
    selectedAsset: selectedZone?.assetId ? assetMap.get(selectedZone.assetId) : undefined,
    previewOnly,
    isPreparingDraft,
    draftPreparationError,
    draftPreparationSuccess,
    printMaterial,
    onAssetAssign: assignAssetToSelectedZone,
    onAssetRemove: removeAssetWithChainCleanup,
    onUploadModalOpen: () => setIsUploadModalOpen(true),
    onPreviewOnlyToggle: () => setPreviewOnly((prev) => !prev),
    onRotateLeft: () => rotateArtwork(-5),
    onRotateRight: () => rotateArtwork(5),
    onPrintMaterialChange: setPrintMaterial,
    onPrepareDraft: prepareDraftAndOpenMainForm,
    onBackToSelection: () => {
      saveCurrentWorkwearState(activeWorkwearIndex);
      setHasStartedConfigurator(false);
      setIsSidebarOpen(false);
    },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
        {hasStartedConfigurator ? (
          <button
            type="button"
            onClick={() => setIsTutorialOpen(true)}
            className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[linear-gradient(160deg,rgba(8,8,8,0.86),rgba(20,20,20,0.72))] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[linear-gradient(160deg,rgba(24,24,24,0.92),rgba(34,34,34,0.78))] sm:bottom-6 sm:right-6"
            aria-label="Tutorial öffnen"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nordwerk-orange text-base text-black shadow-sm">
              ?
            </span>
            <span className="hidden sm:inline">Tutorial öffnen</span>
            <span className="sm:hidden">Hilfe</span>
          </button>
        ) : null}

        <div className="mx-auto max-w-7xl">
          {!hasStartedConfigurator ? (
            <>
              <section className="mx-auto mb-8 w-full max-w-6xl rounded-2xl  bg-white px-4 py-5 shadow-sm sm:px-6 sm:py-6">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
                  <div className="relative text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nordwerk-orange text-lg font-bold text-black">
                      1
                    </span>
                    <p className="mt-2 text-[1.35rem] font-bold leading-tight text-black">Produkt auswählen</p>
                    <span className="pointer-events-none absolute -right-4.5 top-5 hidden text-3xl leading-none text-slate-300 lg:block">→</span>
                  </div>

                  <div className="relative text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nordwerk-orange text-lg font-bold text-black">
                      2
                    </span>
                    <p className="mt-2 text-[1.35rem] font-bold leading-tight text-black">Konfigurieren</p>
                    <span className="pointer-events-none absolute -right-4.5 top-5 hidden text-3xl leading-none text-slate-300 lg:block">→</span>
                  </div>

                  <div className="relative text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nordwerk-orange text-lg font-bold text-black">
                      3
                    </span>
                    <p className="mt-2 text-[1.35rem] font-bold leading-tight text-black">Anfrage senden</p>
                    <span className="pointer-events-none absolute -right-4.5 top-5 hidden text-3xl leading-none text-slate-300 lg:block">→</span>
                  </div>

                  <div className="text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nordwerk-orange text-lg font-bold text-black">
                      4
                    </span>
                    <p className="mt-2 text-[1.35rem] font-bold leading-tight text-black">Angebot erhalten</p>
                  </div>
                </div>
              </section>

              <ProductSelectionSection
                onStartConfigurator={startConfiguratorForProduct}
              />
              <h1 className="mt-8 hidden text-center text-2xl font-bold text-black md:block md:text-4xl pt-10">
                Auf Basis deiner Konfiguration prüfen wir deine Anfrage und erstellen dir im Anschluss ein individuelles Angebot.
              </h1>
            </>
          ) : (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEndWithAssignment}
              onDragCancel={() => setActiveDragAssetId(null)}
            >
              {isSidebarOpen ? (
                <div className="fixed inset-0 z-50 2xl:hidden" role="dialog" aria-modal="true">
                  <button
                    type="button"
                    aria-label="Sidebar schliessen"
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                  />
                  <div className="absolute right-0 top-0 h-full w-full max-w-105 overflow-y-auto p-3 sm:p-4">
                    <div className="mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-lg border border-white/25 bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                      >
                        Schliessen
                      </button>
                    </div>
                    <KonfiguratorSidebar
                      {...sidebarProps}
                      printMaterialInputName="printMaterial-mobile"
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid gap-6 2xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="hidden 2xl:block">
                  <KonfiguratorSidebar
                    {...sidebarProps}
                    printMaterialInputName="printMaterial-desktop"
                  />
                </div>

                <div
                  ref={(node) => {
                    setPreviewDropRef(node);
                  }}
                  className="flex gap-6"
                >
                  <div className="flex-1">
                    <KonfiguratorPreview
                      activeWorkwearIndex={activeWorkwearIndex}
                      zones={zones}
                      selectedZone={selectedZone}
                      assetMap={assetMap}
                      previewOnly={previewOnly}
                      isOverPreview={isOverPreview}
                      visibleProductImageIndexes={visibleProductImageIndexes}
                      previewFrameRef={previewFrameRef}
                      thumbnailStripRef={thumbnailStripRef}
                      onSelectZone={setSelectedZoneId}
                      onSelectWorkwearImage={selectWorkwearImage}
                      onClearZone={clearZone}
                      onRotateZone={rotateZoneById}
                      onScaleZone={scaleZoneById}
                      onMoveArtworkInZone={setZoneArtworkOffset}
                      onOpenTools={() => setIsSidebarOpen(true)}
                    />
                  </div>

                  <div className="hidden 2xl:block w-80">
                    <KonfiguratorPartners activeProduct={getWorkwearProductByIndex(activeWorkwearIndex)} />
                  </div>
                </div>
              </div>

              <DragOverlay>
                {activeDragAsset ? (
                  <div className="pointer-events-none flex items-center gap-2 rounded-lg border border-white/25 bg-black/80 px-2.5 py-2 shadow-xl">
                    <img
                      src={activeDragAsset.src}
                      alt={activeDragAsset.name}
                      className="h-10 w-10 rounded border border-white/25 object-cover"
                    />
                    <span className="max-w-45 truncate text-xs font-medium text-white/90">
                      {activeDragAsset.name}
                    </span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </main>
      <Footer />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFilesSelected={handleFiles}
      />
      {hasStartedConfigurator ? (
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      ) : null}
    </>
  );
}
