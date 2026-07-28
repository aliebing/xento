'use client';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Programmierung & Entwicklung',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ loading: false, success: 'Anfrage erfolgreich abgesendet und gespeichert!', error: null });
        setFormData({ name: '', email: '', company: '', service: 'Programmierung & Entwicklung', message: '' });
      } else {
        throw new Error(result.error || 'Fehler beim Speichern.');
      }
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message || 'Etwas ist schiefgelaufen.' });
    }
  };

  return (
    <section id="contact" className="w-full bg-[#0c1016] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      {/* Subtiler Hintergrund-Glow */}
      <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* Sektions-Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Starten wir Ihr Projekt
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed pt-2">
            Sie benötigen Unterstützung in der Programmierung, Beratung oder beim Support Ihrer Anwendungen? Schreiben Sie uns.
          </p>
        </div>

        {/* Haupt-Layout: 2 Spalten im Verhältnis 4 zu 8 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LINKSE SPALTE: Kontaktdaten */}
          <div className="lg:col-span-4 bg-[#0b111e]/40 border border-gray-800/60 rounded-2xl p-8 backdrop-blur-sm shadow-xl space-y-8 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Kontaktdaten</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Zögern Sie nicht, Kontakt aufzunehmen. Wir antworten in der Regel innerhalb von 24 Stunden.
              </p>
            </div>

            <div className="space-y-6">
              {/* E-Mail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">E-Mail</span>
                  <a href="mailto:aliebing@gmx.de" className="text-sm font-semibold text-gray-200 hover:text-cyan-400 transition-colors">aliebing@gmx.de</a>
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Telefon</span>
                  <a href="tel:+491629405960" className="text-sm font-semibold text-gray-200 hover:text-cyan-400 transition-colors">+49 162 9405960</a>
                </div>
              </div>

              {/* Standort */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Standort</span>
                  <p className="text-sm font-semibold text-gray-200 leading-relaxed">Karlsruhe, Deutschland (vor Ort & Remote)</p>
                </div>
              </div>
            </div>
          </div>

          {/* RECHTE SPALTE: Das Formular */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6 w-full flex flex-col h-full">
            <div className="flex-grow space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Ihr Name / Ansprechpartner *</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0b111e]/60 border border-gray-800 focus:border-cyan-500/50 rounded-xl px-4 py-3.5 text-sm text-gray-200 outline-none transition-colors placeholder-gray-600"
                  placeholder="z. B. Max Mustermann"
                />
              </div>
              
              {/* E-Mail */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">E-Mail Adresse *</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0b111e]/60 border border-gray-800 focus:border-cyan-500/50 rounded-xl px-4 py-3.5 text-sm text-gray-200 outline-none transition-colors placeholder-gray-600"
                  placeholder="ihre@mail.de"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Firma */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Firma</label>
                <input 
                  type="text" 
                  name="company" 
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-[#0b111e]/60 border border-gray-800 focus:border-cyan-500/50 rounded-xl px-4 py-3.5 text-sm text-gray-200 outline-none transition-colors placeholder-gray-600"
                  placeholder="z. B. Muster GmbH"
                />
              </div>
              
              {/* Gewünschte Dienstleistung Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Gewünschte Dienstleistung *</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-[#0b111e]/60 border border-gray-800 focus:border-cyan-500/50 rounded-xl px-4 py-3.5 text-sm text-gray-200 outline-none transition-colors appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                >
                  <option value="Programmierung & Entwicklung" className="bg-[#060b13]">Programmierung & Entwicklung</option>
                  <option value="Beratung & Konzeption" className="bg-[#060b13]">Beratung & Konzeption</option>
                  <option value="Support & Wartung" className="bg-[#060b13]">Support & Wartung</option>
                </select>
              </div>
            </div>

            {/* Nachricht / Details */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Details zu Ihrer Anfrage *</label>
              <textarea 
                name="message" 
                required
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-[#0b111e]/60 border border-gray-800 focus:border-cyan-500/50 rounded-xl px-4 py-3.5 text-sm text-gray-200 outline-none transition-colors placeholder-gray-600 resize-none"
                placeholder="Bitte geben Sie hier alle relevanten Informationen zu Ihrem Projekt oder Anliegen an."
              ></textarea>
            </div>

            {/* Statusmeldungen */}
            {status.loading && <p className="text-sm text-gray-400">Anfrage wird gesendet...</p>}
            {status.success && <p className="text-sm text-green-500">{status.success}</p>}
            {status.error && <p className="text-sm text-red-500">{status.error}</p>}
            </div>

            {/* Absenden Button */}
            <div>
              <button 
                type="submit" 
                disabled={status.loading}
                className={`w-full px-6 py-4 font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-200 ${status.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >           
                Anfrage absenden      
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
} 
