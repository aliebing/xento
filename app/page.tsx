import Navbar from "@/components/ui/NavBar"; 
import Footer from "@/components/ui/Footer"; 
import Teaser from "@/components/sections/Teaser"; 
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Technologies from "@/components/sections/Technologies";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
     <div className="bg-[#060b13] min-h-screen">
      {/* Fixierte, halbtransparente Navigation */}
      <Navbar />
      
      {/* Hauptinhalt mit Abstand für die Navigation */}
      <main className="pt-20">
        <Teaser />
        <Services /> 
        <Projects /> 
        <Technologies /> 
        <About /> 
        <Contact /> 
      </main>
      
      <Footer />

    </div>
  );
}
