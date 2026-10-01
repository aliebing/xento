import { notFound } from 'next/navigation';
import Navbar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import Teaser from '@/components/sections/Teaser';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Technologies from '@/components/sections/Technologies';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import References from '@/components/sections/References';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="bg-[#060b13] min-h-screen">
      {/* Fixierte, halbtransparente Navigation */}
      <Navbar lang={lang} dict={dict.nav} />

      {/* Hauptinhalt mit Abstand für die Navigation */}
      <main className="pt-20">
        <Teaser dict={dict.hero} />
        <Services dict={dict.services} />
        <Projects />
        <Technologies />
        <References />
        <About />
        <Contact />
      </main>

      <Footer lang={lang} dict={dict.footer} />
    </div>
  );
}
