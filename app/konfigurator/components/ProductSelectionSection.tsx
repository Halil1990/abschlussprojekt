import Image from "next/image";
import { useMemo, useState } from "react";

import {
  WORKWEAR_PRODUCTS,
  WORKWEAR_PREVIEW_COLORS,
  type WorkwearProductId,
  type WorkwearPreviewColorId,
} from "../constants";
import {
  WORKWEAR_FRONTPAGE_ORDER,
  getWorkwearProductColorPreviewImage,
  getWorkwearProductPreviewImage,
} from "../productHelpers";

type ProductSelectionSectionProps = {
  onStartConfigurator: (product: WorkwearProductId) => void;
};

export default function ProductSelectionSection({
  onStartConfigurator,
}: ProductSelectionSectionProps) {
  const orderedProducts = useMemo(
    () =>
      WORKWEAR_FRONTPAGE_ORDER.map((productId) =>
        WORKWEAR_PRODUCTS.find((entry) => entry.id === productId),
      ).filter((product): product is (typeof WORKWEAR_PRODUCTS)[number] =>
        Boolean(product),
      ),
    [],
  );

  const [selectedColorByProduct, setSelectedColorByProduct] = useState<
    Record<WorkwearProductId, WorkwearPreviewColorId>
  >(() =>
    Object.fromEntries(
      orderedProducts.map((product) => [
        product.id,
        WORKWEAR_PREVIEW_COLORS[0].id,
      ]),
    ) as Record<WorkwearProductId, WorkwearPreviewColorId>,
  );

  const [failedColorImageKeySet, setFailedColorImageKeySet] = useState<Set<string>>(
    () => new Set(),
  );

  const productMeta: Record<WorkwearProductId, { ref: string; description: string }> = {
    jacke: {
      ref: "REF / J-402",
      description: "Robuste Arbeitsjacke mit funktionalen Zonen für den täglichen Einsatz.",
    },
    hose: {
      ref: "REF / H-882",
      description: "Strapazierfähige Bundhose mit Verstärkungen und bequemem Sitz.",
    },
    weste: {
      ref: "REF / W-112",
      description: "Leichte Weste mit viel Bewegungsfreiheit und praktischen Taschen.",
    },
    latzhose: {
      ref: "REF / L-990",
      description: "Komfortable Latzhose mit durchdachtem Schnitt für lange Arbeitstage.",
    },
  };

  const productDisplayNames: Record<WorkwearProductId, string> = {
    jacke: "Jacke",
    weste: "Weste",
    hose: "Stretchhose",
    latzhose: " Latzhose",
  };

  return (
    <>
      <section className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-2xl ">
        <div className="p-4 sm:p-5">
          <div className="grid gap-6 pt-6 md:grid-cols-2 md:gap-12 md:pt-8">
          {orderedProducts.map((product) => {
              const productLabel = productDisplayNames[product.id] ?? product.label;
              const selectedColorId = selectedColorByProduct[product.id];
              const colorImageKey = product.id + ':' + selectedColorId;
              const defaultPreviewImage = getWorkwearProductPreviewImage(product.id);
              const colorPreviewImage = getWorkwearProductColorPreviewImage(
                product.id,
                selectedColorId,
              );
              const previewImage = failedColorImageKeySet.has(colorImageKey)
                ? defaultPreviewImage
                : colorPreviewImage;
              const selectedColorLabel =
                WORKWEAR_PREVIEW_COLORS.find((color) => color.id === selectedColorId)
                  ?.label ?? WORKWEAR_PREVIEW_COLORS[0].label;
              const meta = productMeta[product.id];

              return (
                <article
                  key={product.id}
                  className="grid overflow-hidden rounded-xl  bg-[linear-gradient(160deg,rgba(8,8,8,0.72),rgba(20,20,20,0.5))] hover:border-zinc-600 sm:grid-cols-[1fr_1fr]"
                >
                  <div className="p-3 sm:p-4">
                    <div
                      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <Image
                        src={previewImage}
                        alt={`${productLabel} Vorschau in ${selectedColorLabel}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className={`pointer-events-none select-none object-contain p-6 sm:p-7 ${
                          product.id === "latzhose" ? "scale-130" : ""
                        }`}
                        onError={() => {
                          setFailedColorImageKeySet((prev) => {
                            if (prev.has(colorImageKey)) return prev;
                            const next = new Set(prev);
                            next.add(colorImageKey);
                            return next;
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:p-6">
                    <div>
                      <h2 className="text-[2.1rem] font-bold leading-none text-zinc-200">
                        {productLabel}
                      </h2>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                        {meta.description}
                      </p>
                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.09em] text-zinc-500">
                        Farbauswahl
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                    {WORKWEAR_PREVIEW_COLORS.map((color) => {
                      const isActive = selectedColorId === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => {
                            setSelectedColorByProduct((prev) => ({
                              ...prev,
                              [product.id]: color.id,
                            }));
                          }}
                          className={`h-7 w-7 rounded-full border-2 transition ${
                            isActive
                              ? "border-[#f59e0b] shadow-[0_0_0_1px_rgba(245,158,11,0.75)]"
                              : "border-zinc-200/70 hover:border-zinc-100"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          aria-pressed={isActive}
                          aria-label={`${productLabel} Farbe ${color.label}`}
                          title={color.label}
                        >
                          <span className="sr-only">{color.label}</span>
                        </button>
                      );
                    })}
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartConfigurator(product.id)}
                      className="mt-5 w-full rounded-md bg-nordwerk-orange px-4 py-3 text-base font-bold uppercase tracking-[0.06em] text-zinc-900 transition hover:brightness-105"
                    >
                      Konfigurieren
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
