import { FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-nordwerk-black text-white py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 text-center md:text-left">

        <div>
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-nordwerk-orange">Impressum</h3>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
            Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
          </p>
          <p className="text-gray-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
            K&K Solutions GmbH<br />
            Martinistraße 7<br />
            49565 Bramsche – Ueffeln<br />
            Deutschland
          </p>
          <p className="text-gray-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
            Telefon: 0172 5333844<br />
            E-Mail: info@k-k-solutions.de
          </p>
          <p className="text-gray-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
            Geschäftsführer: Alexander Knoth<br />
            Marke / Brand: Nordwerk Workwear
          </p>
          <p className="text-gray-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
            <span className="font-semibold text-gray-300">Registereintrag:</span><br />
            Eintragung im Handelsregister<br />
            Registergericht: Amtsgericht Osnabrück<br />
            Registernummer: HRB 220681
          </p>
          <p className="text-gray-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
            Umsatzsteuer-Identifikationsnummer<br />
            gemäß § 27a Umsatzsteuergesetz:<br />
            DE369254470
          </p>
        </div>

        <div className="md:text-right">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-nordwerk-orange">Rechtliches</h3>
          <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
            <li><a href="/datenschutz" className="hover:text-nordwerk-orange transition">Datenschutzerklärung</a></li>
            <li><a href="/agb" className="hover:text-nordwerk-orange transition">AGB</a></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-5 sm:pt-6 text-center px-4">
        <div className="flex justify-center gap-4 mb-3 sm:mb-4">
          <a
            href="https://www.instagram.com/nordwerk.workwear/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-nordwerk-orange transition"
            aria-label="Nordwerk Workwear auf Instagram"
          >
            <FaInstagram size={24} className="sm:w-7 sm:h-7" />
          </a>
          <a
            href="https://www.linkedin.com/company/nordwerk-workwear/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-nordwerk-orange transition"
            aria-label="Nordwerk Workwear auf LinkedIn"
          >
            <FaLinkedin size={24} className="sm:w-7 sm:h-7" />
          </a>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          © {new Date().getFullYear()} Nordwerk Workwear – Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}