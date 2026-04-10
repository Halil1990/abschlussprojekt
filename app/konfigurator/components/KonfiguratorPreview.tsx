/* eslint-disable @next/next/no-img-element */

import WorkwearZone from "./WorkwearZone";
import type { Asset, ZoneRectangle } from "../types";
import { WORKWEAR_IMAGES, ZONE_DROP_PREFIX } from "../constants";
import { getArtworkTransform } from "../utils";
import {
  getWorkwearProductByIndex,
  getWorkwearProductShortLabel,
  getWorkwearSideLabel,
} from "../productHelpers";

interface KonfiguratorPreviewProps {
  activeWorkwearIndex: number;
  zones: ZoneRectangle[];
  selectedZone: ZoneRectangle | null;
  assetMap: Map<string, Asset>;
  previewOnly: boolean;
  isOverPreview: boolean;
  visibleProductImageIndexes: number[];
  previewFrameRef: React.RefObject<HTMLDivElement | null>;
  thumbnailStripRef: React.RefObject<HTMLDivElement | null>;
  onSelectZone: (zoneId: string) => void;
  onSelectWorkwearImage: (index: number) => void;
  onClearZone: (zoneId: string) => void;
  onRotateZone: (zoneId: string, degrees: number) => void;
  onOpenTools: () => void;
}

export function KonfiguratorPreview({
  activeWorkwearIndex,
  zones,
  selectedZone,
  assetMap,
  previewOnly,
  isOverPreview,
  visibleProductImageIndexes,
  previewFrameRef,
  thumbnailStripRef,
  onSelectZone,
  onSelectWorkwearImage,
  onClearZone,
  onRotateZone,
  onOpenTools,
}: KonfiguratorPreviewProps) {
  const activeProduct = getWorkwearProductByIndex(activeWorkwearIndex);
  const activeWorkwearImage = WORKWEAR_IMAGES[activeWorkwearIndex];
  // const activeSideLabel = getWorkwearSideLabel(activeWorkwearImage);

  return (
    <section className="mx-auto w-full max-w-240 rounded-4xl border border-white/20 bg-[linear-gradient(160deg,rgba(8,8,8,0.72),rgba(20,20,20,0.5))] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={onOpenTools}
          className="absolute left-0 rounded-xl border border-white/25 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/60 2xl:hidden"
        >
          Werkzeuge
        </button>
        <h2 className="text-lg font-semibold text-white">Vorschau</h2>
      </div>
      {/* <p className="mt-1 pt-5 text-sm text-white/80">
        {getWorkwearProductShortLabel(activeProduct)} - {activeSideLabel}
      </p> */}

      <div className="mt-4 mx-auto w-full max-w-180 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="mx-auto max-w-155">
          <div className="relative py-3 sm:py-4">
            <div
              ref={previewFrameRef}
              className="relative mx-auto w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/25 shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
              style={{ aspectRatio: "768 / 1320" }}
            >
              <div
                className="absolute inset-0 origin-center transition-transform duration-200"
                style={{ transform: "none" }}
              >
                <img
                  src={activeWorkwearImage}
                  alt={`Workwear ${getWorkwearProductShortLabel(activeProduct)}`}
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                />

                {previewOnly
                  ? zones.map((zone) => {
                      const zoneAsset = zone.assetId
                        ? assetMap.get(zone.assetId)
                        : undefined;
                      if (!zoneAsset) return null;

                      return (
                        <div
                          key={zone.id}
                          style={{
                            left: zone.x + "%",
                            top: zone.y + "%",
                            width: zone.w + "%",
                            height: zone.h + "%",
                          }}
                          className="absolute overflow-hidden"
                        >
                          <img
                            src={zoneAsset.src}
                            alt={zoneAsset.name}
                            className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                            style={{
                              transform: getArtworkTransform(zone),
                              transformOrigin: "center",
                            }}
                          />
                        </div>
                      );
                    })
                  : zones.map((zone) => (
                      <WorkwearZone
                        key={zone.id}
                        zone={zone}
                        asset={
                          zone.assetId
                            ? assetMap.get(zone.assetId)
                            : undefined
                        }
                        isSelected={selectedZone?.id === zone.id}
                        previewIsOver={
                          isOverPreview && selectedZone?.id === zone.id
                        }
                        zoneDropPrefix={ZONE_DROP_PREFIX}
                        onSelect={onSelectZone}
                        onClearAsset={onClearZone}
                        onRotate={(degrees) => onRotateZone(zone.id, degrees)}
                      />
                    ))}

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div
          ref={thumbnailStripRef}
          className="mx-auto flex w-fit max-w-full gap-2 overflow-x-auto rounded-xl border border-white/10 bg-black/25 p-2 pb-2"
        >
          {visibleProductImageIndexes.map((index) => {
            const imageUrl = WORKWEAR_IMAGES[index];

            return (
              <div key={index} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectWorkwearImage(index)}
                  className={`relative overflow-hidden rounded-lg border-2 transition ${
                    activeWorkwearIndex === index
                      ? "border-nordwerk-orange shadow-lg shadow-nordwerk-orange/40"
                      : "border-white/20 hover:border-white/40"
                  }`}
                  style={{
                    width: "62px",
                    height: "92px",
                    aspectRatio: "768 / 1366",
                  }}
                  aria-label={`${getWorkwearProductShortLabel(activeProduct)} ${getWorkwearSideLabel(imageUrl)}`}
                >
                  <img
                    src={imageUrl}
                    alt={`${getWorkwearProductShortLabel(activeProduct)} Thumbnail ${getWorkwearSideLabel(imageUrl)}`}
                    className="h-full w-full object-cover"
                  />
                </button>
                <p className="mt-1 text-center text-[11px] font-medium text-white/80">
                  {getWorkwearSideLabel(imageUrl)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
