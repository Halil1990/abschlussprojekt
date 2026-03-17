import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export const metadata = {
  title: 'AGB – Nordwerk Workwear',
  description: 'Allgemeine Geschäftsbedingungen der K&K Solutions GmbH / Nordwerk Workwear',
};

export default function AGBPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-40 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-black text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-black">Allgemeine Geschäftsbedingungen</h1>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Geltungsbereich</h2>
            <p className="leading-relaxed">
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen der K&K Solutions GmbH und ihren Kunden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Leistungen</h2>
            <p className="leading-relaxed">
              Die K&K Solutions GmbH bietet Produkte und Dienstleistungen im Bereich Arbeitsbekleidung und Workwear unter der Marke Nordwerk Workwear an.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Vertragsschluss</h2>
            <p className="leading-relaxed">
              Ein Vertrag kommt erst durch schriftliche Bestätigung oder Lieferung der Ware durch die K&K Solutions GmbH zustande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Preise</h2>
            <p className="leading-relaxed">
              Alle Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer, sofern nicht anders angegeben.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Lieferung</h2>
            <p className="leading-relaxed">
              Lieferzeiten sind unverbindlich, sofern nicht ausdrücklich schriftlich bestätigt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Gewährleistung</h2>
            <p className="leading-relaxed">
              Es gelten die gesetzlichen Gewährleistungsrechte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Haftung</h2>
            <p className="leading-relaxed">
              Die Haftung der K&K Solutions GmbH ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit gesetzlich zulässig.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Schlussbestimmungen</h2>
            <p className="leading-relaxed">
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz der K&K Solutions GmbH.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
