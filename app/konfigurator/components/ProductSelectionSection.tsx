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

  return (
    <>
      <p className="mx-auto mt-3 max-w-2xl text-center text-black">
        Bitte Produkt auswählen und danach im Konfigurator bearbeiten.
      </p>

      <section className="mx-auto mt-8 max-w-5xl rounded-4xl border border-white/20 bg-[linear-gradient(160deg,rgba(8,8,8,0.72),rgba(20,20,20,0.5))] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {orderedProducts.map((product) => {
              const productLabel = product.label;
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

              return (
                <article
                  key={product.id}
                  className="
                    rounded-4xl border border-white/20 bg-white/5 p-4
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                    transition-all duration-200
                    hover:border-white/35
                  "
                >
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <div
                      className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/25 shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
                      style={{ aspectRatio: "768 / 1320" }}
                    >
                      <Image
                        src={previewImage}
                        alt={`${productLabel} Vorschau in ${selectedColorLabel}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="pointer-events-none select-none object-contain"
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
                  <h2 className="mt-4 text-center text-xl font-semibold text-white">
                    {productLabel}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
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
                          className={`h-7 min-w-7 rounded-full border-2 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition ${
                            isActive
                              ? "border-nordwerk-orange text-white"
                              : "border-white/35 text-white/75 hover:border-white/60 hover:text-white"
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
                    className="mt-4 w-full rounded-md bg-nordwerk-orange px-4 py-2 text-sm font-semibold text-black hover:scale-105 hover:text-white transition"
                  >
                    Konfigurieren
                  </button>
                </article>
              );
            })}
        </div>
      </section>
    </>
  );
}
