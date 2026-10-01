import Navbar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { legal } = await getDictionary(lang);
  return {
    title: legal.impressumTitle,
    alternates: {
      canonical: `/${lang}/impressum`,
      languages: { en: "/en/impressum", de: "/de/impressum", "x-default": "/en/impressum" },
    },
  };
}

export default async function ImpressumPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="bg-[#060b13] min-h-screen text-white">
      <Navbar minimal lang={lang} dict={dict.nav} />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6 space-y-8">
          {lang !== "de" ? (
            <p lang="en" className="rounded-xl border border-cyan-800/30 bg-cyan-950/30 px-4 py-3 text-sm text-cyan-200">
              {dict.legal.notice}
            </p>
          ) : null}
          <h1 className="text-4xl font-extrabold tracking-tight">Impressum</h1>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">Angaben gemäß § 5 DDG</h2>
            <p>
              Alexander Liebing
              <br />
              Xento IT-Solutions
              <br />
              [Straße und Hausnummer ergänzen]
              <br />
              [PLZ und Ort ergänzen] (Karlsruhe, Deutschland)
            </p>
          </section>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">Kontakt</h2>
            <p>
              Telefon: +49 162 9405960
              <br />
              E-Mail: aliebing@gmx.de
            </p>
          </section>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">Umsatzsteuer-ID</h2>
            <p>
              [Falls vorhanden: Umsatzsteuer-Identifikationsnummer gemäß § 27a
              Umsatzsteuergesetz ergänzen]
            </p>
          </section>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p>
              Alexander Liebing
              <br />
              [Anschrift wie oben]
            </p>
          </section>

          <section className="space-y-2 text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-100">Haftungsausschluss</h2>
            <p>
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              kann jedoch keine Gewähr übernommen werden. Diese Website
              enthält Links zu externen Websites Dritter, auf deren Inhalte
              kein Einfluss besteht. Für die Inhalte der verlinkten Seiten ist
              stets der jeweilige Anbieter verantwortlich.
            </p>
          </section>

          <p className="text-sm text-gray-500">
            Hinweis: Diese Seite ist eine Vorlage und muss vor
            Veröffentlichung mit den vollständigen, rechtlich korrekten
            Angaben (Anschrift, ggf. USt-ID, Handelsregisterdaten) ergänzt
            werden.
          </p>
        </div>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </div>
  );
}
