import Image from "next/image";

const partners = [
  { src: "/partner2.jpg", alt: "Partner 2" },
  { src: "/partner1.jpg", alt: "Partner 1" },
  { src: "/partner3.jpg", alt: "Partner 3" },
];

export function KonfiguratorPartners() {
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
              className="h-20 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
