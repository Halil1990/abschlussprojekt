import Image from 'next/image';

export default function About() {
    return (
      <section id="ueber-uns" className="scroll-mt-36 sm:scroll-mt-40 py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          
          <div className="text-center md:text-left order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Über <span className="text-nordwerk-orange">Nordwerk</span>
            </h2>
  
            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              Nordwerk Workwear ist ein junges Unternehmen mit klarem Fokus: Wir statten Handwerk und Industrie präzise, gewerkspezifisch und normgerecht aus. Keine Standardlösungen, sondern durchdachte Bekleidungskonzepte, die zum Einsatzbereich passen.
            </p>

            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              Wir wissen, worauf es in der Praxis ankommt. Jeder von uns bringt eigene Erfahrung aus dem Handwerk mit. Anforderungen wie Bewegungsfreiheit, Strapazierfähigkeit, Schutzfunktionen und Alltagstauglichkeit sind für uns keine Theorie, sondern Grundlage jeder Empfehlung.
            </p>

            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              Ob Schweißer, Elektriker, Heizungs- und Sanitärbetrieb oder Maschinenbediener in der Kunststoffverarbeitung – wir stellen die passende Ausstattung zusammen. Funktional. Sicher. Einheitlich im Auftritt.
            </p>

            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              Ein wesentlicher Bestandteil unseres Angebots ist die Veredelung. Mit modernster Drucktechnik und über 30 Jahren Erfahrung im Bereich Textilveredelung liefern wir saubere, langlebige Ergebnisse. Logo, Schriftzug oder individuelles Design – alles aus einer Hand.
            </p>

            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              Wir beraten persönlich, analysieren Anforderungen im Betrieb und entwickeln ein strukturiertes Bekleidungskonzept für Ihr Unternehmen. Ziel ist ein professionelles, sicheres und einheitliches Erscheinungsbild – intern wie extern.
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Nordwerk steht für klare Lösungen, kurze Wege und zuverlässige Umsetzung.
            </p>
          </div>
  
          <div className="bg-white h-32 sm:h-48 md:h-64 rounded-2xl flex items-center justify-center overflow-hidden order-1 md:order-2 relative flex flex-row gap-4">
            <div className="flex-1 relative h-full">
              <Image
                src="/schweißer.jpg"
                alt="Schweißer"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <div className="flex-1 relative h-full">
              <Image
                src="/arbeiter.jpg"
                alt="Arbeiter"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
  
        </div>
      </section>
    );
  }