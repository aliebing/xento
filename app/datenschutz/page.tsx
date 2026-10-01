import Navbar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Xento IT-Solutions",
};

export default function DatenschutzPage() {
  return (
    <div className="bg-[#060b13] min-h-screen text-white">
      <Navbar minimal />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6 space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Datenschutzerklärung</h1>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
              <br />
              Alexander Liebing, Xento IT-Solutions
              <br />
              [Straße, PLZ, Ort ergänzen]
              <br />
              E-Mail: aliebing@gmx.de
            </p>
          </section>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">2. Kontaktformular</h2>
            <p>
              Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen,
              werden Ihre Angaben aus dem Formular inklusive der von Ihnen
              dort angegebenen Kontaktdaten (Name, E-Mail-Adresse, optional
              Firma, gewünschte Dienstleistung sowie Ihre Nachricht) zum
              Zwecke der Bearbeitung der Anfrage und für den Fall von
              Anschlussfragen bei uns gespeichert. Rechtsgrundlage für diese
              Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines
              Vertragsverhältnisses) bzw. Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an der Bearbeitung von Anfragen).
            </p>
            <p>
              Die Daten werden bei unserem Auftragsverarbeiter Supabase
              (Datenbank-Hosting) gespeichert. Ein entsprechender
              Auftragsverarbeitungsvertrag (AVV) besteht bzw. wird
              abgeschlossen. Die Daten werden gelöscht, sobald sie für die
              Erreichung des Zwecks ihrer Erhebung nicht mehr erforderlich
              sind, in der Regel nach abschließender Bearbeitung Ihrer
              Anfrage, sofern keine gesetzlichen Aufbewahrungspflichten
              entgegenstehen.
            </p>
          </section>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">3. Hosting</h2>
            <p>
              Diese Website wird bei [Hosting-Anbieter ergänzen] gehostet.
              Beim Aufruf der Website erhebt der Hoster automatisiert
              technische Zugriffsdaten (u. a. IP-Adresse, Datum und Uhrzeit
              des Zugriffs, aufgerufene Seite) in Server-Logfiles.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
              Interesse am sicheren und stabilen Betrieb der Website).
            </p>
          </section>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">4. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung,
              Löschung oder Einschränkung der Verarbeitung Ihrer
              gespeicherten personenbezogenen Daten, ein Widerspruchsrecht
              gegen die Verarbeitung sowie ein Recht auf Datenübertragbarkeit.
              Zudem steht Ihnen ein Beschwerderecht bei einer
              Datenschutz-Aufsichtsbehörde zu. Bei Fragen zur Erhebung,
              Verarbeitung oder Nutzung Ihrer personenbezogenen Daten wenden
              Sie sich bitte an aliebing@gmx.de.
            </p>
          </section>

          <p className="text-sm text-gray-500">
            Hinweis: Diese Erklärung ist eine Vorlage und muss vor
            Veröffentlichung geprüft und mit den vollständigen,
            rechtlich korrekten Angaben (insbesondere Anschrift, Hoster,
            Speicherdauer) ergänzt bzw. von fachkundiger Seite geprüft werden.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
