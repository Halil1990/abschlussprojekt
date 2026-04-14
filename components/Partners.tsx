"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const partners = [
  { src: "/partner2.jpg", alt: "Partner 2" },
  { src: "/partner1.jpg", alt: "Partner 1" },
  { src: "/partner3.jpg", alt: "Partner 3" },
  { src: "/partner_4.jpg", alt: "Partner 4" },
  { src: "/partner_5.png", alt: "Partner 5" },
  { src: "/partner_6.jpg", alt: "Partner 6" },
];

const VISIBLE_PARTNERS = 3;
const CAROUSEL_SPEED_PX_PER_SECOND = 42;

export default function Partners() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const loopedPartners = [...partners, ...partners];

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frameId = 0;
    let previousTimestamp: number | null = null;
    let offsetX = 0;

    const animate = (timestamp: number) => {
      if (previousTimestamp === null) {
        previousTimestamp = timestamp;
      }

      const deltaSeconds = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;
      offsetX -= CAROUSEL_SPEED_PX_PER_SECOND * deltaSeconds;

      const singleSetWidth = track.scrollWidth / 2;
      if (Math.abs(offsetX) >= singleSetWidth) {
        offsetX += singleSetWidth;
      }

      track.style.transform = `translateX(${offsetX}px)`;
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section id="partner" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Unsere <span className="text-nordwerk-orange">Partner</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg px-2">
            Wir arbeiten mit starken Marken und zuverlässigen Partnern zusammen –
            für Qualität, auf die Sie sich verlassen können.
          </p>
        </div>

        {/* Partner Logos Carousel */}
        <div className="max-w-5xl mx-auto py-2">
          <div className="overflow-x-hidden overflow-y-visible">
            <div
              ref={trackRef}
              className="flex will-change-transform"
            >
              {loopedPartners.map((partner, index) => (
                <div key={`${partner.src}-${index}`} className="w-1/3 shrink-0 px-2 sm:px-3 py-2">
                  <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 h-full flex items-center justify-center transition-transform hover:scale-105">
                    {(() => {
                      const isAtlasLogo = partner.src === "/partner_6.jpg";

                      return (
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      width={250}
                      height={150}
                      className={`object-contain w-auto rounded-xl ${isAtlasLogo ? "max-h-24 sm:max-h-32 scale-115" : "max-h-20 sm:max-h-28"}`}
                    />
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
