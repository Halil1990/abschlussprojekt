import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export const metadata = {
  title: 'Datenschutzerklärung – Nordwerk Workwear',
  description: 'Datenschutzerklärung der K&K Solutions GmbH / Nordwerk Workwear',
};

export default function DatenschutzPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-40 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-6 bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="max-w-3xl mx-auto text-black text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-black">Datenschutzerklärung</h1>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Verantwortlicher</h2>
            <p className="leading-relaxed">
              K&K Solutions GmbH<br />
              Martinistraße 7<br />
              49565 Bramsche – Ueffeln<br />
              Deutschland
            </p>
            <p className="mt-3 leading-relaxed">
              Telefon: 0172 5333844<br />
              E-Mail: info@k-k-solutions.de
            </p>
            <p className="mt-3 leading-relaxed">
              Geschäftsführer: Alexander Knoth
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Erhebung und Speicherung personenbezogener Daten</h2>
            <p className="leading-relaxed mb-4">
              Beim Besuch dieser Website werden automatisch Informationen durch den Server erfasst. Diese sogenannten Server-Logfiles können beinhalten:
            </p>
            <ul className="list-disc list-inside space-y-1 text-black">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Diese Daten dienen ausschließlich der technischen Überwachung und Verbesserung der Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Kontaktaufnahme</h2>
            <p className="leading-relaxed">
              Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zur Bearbeitung Ihrer Anfrage gespeichert. Eine Weitergabe dieser Daten erfolgt nicht ohne Ihre Einwilligung.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Analyse-Tools und Tracking</h2>
            <p className="leading-relaxed">
              Diese Website nutzt Analyse-Tools zur Auswertung des Nutzerverhaltens. Die Verarbeitung erfolgt ausschließlich auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Ihre Rechte</h2>
            <p className="leading-relaxed mb-4">
              Sie haben jederzeit das Recht auf:
            </p>
            <ul className="list-disc list-inside space-y-1 text-black">
              <li>Auskunft über Ihre gespeicherten Daten</li>
              <li>Berichtigung unrichtiger Daten</li>
              <li>Löschung Ihrer Daten</li>
              <li>Einschränkung der Verarbeitung</li>
              <li>Datenübertragbarkeit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">Beschwerderecht</h2>
            <p className="leading-relaxed">
              Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
