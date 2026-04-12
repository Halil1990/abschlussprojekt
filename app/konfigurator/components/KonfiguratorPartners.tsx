import Image from "next/image";
import { CUSTOMER_REVIEWS } from "../constants";
import type { WorkwearProductId } from "../constants";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={
              i < Math.floor(rating)
                ? '#F58220'
                : i < rating
                  ? 'rgba(245, 130, 32, 0.5)'
                  : 'rgba(245, 130, 32, 0.3)'
            }
          />
        </svg>
      ))}
    </div>
  );
}

const partners = [
  { src: "/partner2.jpg", alt: "Partner 2" },
  { src: "/partner1.jpg", alt: "Partner 1" },
  { src: "/partner3.jpg", alt: "Partner 3" },
];

interface KonfiguratorPartnersProps {
  activeProduct?: WorkwearProductId;
}

export function KonfiguratorPartners({ activeProduct }: KonfiguratorPartnersProps) {
  return (
    <div className="rounded-4xl border border-white/20 bg-[linear-gradient(160deg,rgba(8,8,8,0.72),rgba(20,20,20,0.5))] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5">
      <h3 className="text-lg font-semibold text-white">
        Unsere Partner
      </h3>
      <div className="mt-6 flex flex-col gap-12">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10"
          >
            <Image
              src={partner.src}
              alt={partner.alt}
              width={220}
              height={120}
              className="h-20 w-auto rounded-lg object-contain"
            />
          </div>
        ))}
      </div>

      {/* Customer Reviews */}
      {activeProduct && (
        <div className="mt-6 flex flex-col gap-4">
          {(() => {
            const reviews = CUSTOMER_REVIEWS.filter(
              (r) => r.productId === activeProduct
            );
            const displayReviews = reviews.slice(0, 2);

            return displayReviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white/60">KUNDENBEWERTUNG</p>
                  <p className="text-xs text-white/50">{review.date}</p>
                </div>
                <div className="mt-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-2 text-sm font-medium text-white">{review.name}</p>
                <p className="text-xs text-white/70 leading-relaxed">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
