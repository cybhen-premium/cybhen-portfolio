'use client';

import React, { useState, useEffect } from 'react';

function GalleryCard({ src, title, tag, hint }: { src: string; title: string; tag: string; hint: string }) {
  const [imgError, setImgError] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  return (
    <>
      {/* Card */}
      <div
        className="group relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-700 aspect-[4/3] hover:border-orange-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(249,115,22,0.15)] cursor-pointer"
        onClick={() => !imgError && setLightboxOpen(true)}
      >
        {!imgError ? (
          <img
            src={src}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">{hint}</p>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
          <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{tag}</span>
          <h4 className="text-base font-bold text-white">{title}</h4>
          <p className="text-zinc-400 text-xs mt-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            Click to expand
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={title}
              className="block max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-2xl"
              style={{ animation: 'lightboxIn 0.25s ease' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4 rounded-b-2xl">
              <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">{tag}</span>
              <h4 className="text-white font-bold text-lg">{title}</h4>
            </div>
          </div>

          <style>{`
            @keyframes lightboxIn {
              from { opacity: 0; transform: scale(0.92); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default function PortfolioPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [galleryTab, setGalleryTab] = useState<'designs' | 'data' | 'docs'>('designs');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setErrorMsg('');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to send on server.');
        setTimeout(() => setStatus('idle'), 6000);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Network error occurred.');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Experience', href: '#experience' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Resume', href: '/resume.pdf', target: '_blank', rel: 'noopener noreferrer' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <div className="min-h-screen bg-zinc-900 text-zinc-50 font-sans selection:bg-orange-500/30">
        {/* ===== NAVBAR ===== */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-900/95 backdrop-blur-md py-4 shadow-lg shadow-black/20' : 'bg-transparent py-6'
            }`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <img src="/logo.jpg" alt="Cybhen Premium Logo" className="h-10 w-auto rounded-md object-contain group-hover:scale-105 transition-transform duration-300" />
              <span className="text-xl font-bold tracking-tight">Cybhen Premium<span className="text-orange-500">.</span></span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="text-sm font-medium text-zinc-300 hover:text-orange-500 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/25">
                Hire Me
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-zinc-300 hover:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.00/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-zinc-800 border-t border-zinc-700 shadow-xl md:hidden flex flex-col py-4 px-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-zinc-300 hover:text-orange-500 block py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </nav>

        <main>
          {/* ===== HERO SECTION ===== */}
          <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden clip-bottom">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
                <span className="inline-block py-1.5 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300 mb-6 group cursor-default">
                  👋 Welcome! I am a <span className="text-orange-500 group-hover:text-orange-400 transition-colors">Multi-Disciplinary Pro</span>
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                  Creative Designer <br />
                  <span className="text-orange-500">&amp; Developer</span>
                </h1>
                <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto lg:mx-0">
                  Delivering high-quality visual aesthetics, robust technical solutions, and seamless document processing—all tailored to help you stand out and succeed.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
                  <a href="#portfolio" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:-translate-y-1">
                    View Portfolio
                  </a>
                  <a href="#contact" className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-8 py-4 rounded-full font-semibold transition-all hover:-translate-y-1">
                    Let's Talk
                  </a>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-12 pt-6 border-t border-zinc-800">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">5+</h3>
                    <p className="text-sm text-zinc-500">Years Experience</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">100+</h3>
                    <p className="text-sm text-zinc-500">Projects Completed</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 order-1 lg:order-2 flex justify-center">
                {/* === USER IMAGE HERO === */}
                <div className="w-full max-w-md aspect-[4/5] rounded-[40px] rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl relative overflow-hidden group border-4 border-zinc-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 opacity-60"></div>
                  <img
                    src="/me.jpeg"
                    alt="Cybhen Premium"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ===== SERVICES SECTION ===== */}
          <section id="services" className="py-24 bg-zinc-950 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mb-16">
                <h2 className="text-4xl font-bold mb-4">My <span className="text-orange-500">Services</span></h2>
                <p className="text-zinc-400 max-w-2xl">From professional creative design to reliable technical solutions and document processing, I provide a comprehensive suite of services.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Service 1 */}
                <div className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all hover:bg-zinc-800/50 hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] hover:-translate-y-2 flex flex-col">
                  <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden relative border border-zinc-800">
                    <img src="/services/graphic-design.svg" alt="Graphic Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-xl flex items-center justify-center text-orange-500 border border-zinc-700/50">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Graphic Design</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Stunning visual identities, branding, flyers, banners, and digital graphics tailored to captivate your audience.</p>
                </div>

                {/* Service 2 */}
                <div className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all hover:bg-zinc-800/50 hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] hover:-translate-y-2 lg:-translate-y-6 flex flex-col">
                  <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden relative border border-zinc-800">
                    <img src="/services/video-editing.svg" alt="Video Editing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-xl flex items-center justify-center text-orange-500 border border-zinc-700/50">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Video Editing</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Professional video editing rendering highly engaging content, smooth transitions, and cinematic color grading.</p>
                </div>

                {/* Service 3 */}
                <div className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all hover:bg-zinc-800/50 hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] hover:-translate-y-2 flex flex-col">
                  <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden relative border border-zinc-800">
                    <img src="/services/web-development.svg" alt="Web Development" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-xl flex items-center justify-center text-orange-500 border border-zinc-700/50">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Web Development</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Building modern, fully responsive, and blazing fast websites and web applications just like this one.</p>
                </div>

                {/* Service 4 */}
                <div className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all hover:bg-zinc-800/50 hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] hover:-translate-y-2 flex flex-col">
                  <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden relative border border-zinc-800">
                    <img src="/services/document-processing.svg" alt="Document Processing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-xl flex items-center justify-center text-orange-500 border border-zinc-700/50">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Document Processing</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Fast & reliable processing for passports, birth certificates, and official documentation setups.</p>
                </div>

                {/* Service 5 */}
                <div className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all hover:bg-zinc-800/50 hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] hover:-translate-y-2 flex flex-col">
                  <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden relative border border-zinc-800">
                    <img src="/services/data-sim.svg" alt="Data & Sim Services" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-xl flex items-center justify-center text-orange-500 border border-zinc-700/50">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Data & Sim Services</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">I sell reliable data bundles and perform swift MTN Agent Sim Registration services directly for you.</p>
                </div>

              </div>
            </div>
          </section>

          {/* ===== GALLERY / PORTFOLIO SECTION ===== */}
          <section id="portfolio" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

              {/* Section Header */}
              <div className="text-center mb-12">
                <span className="text-orange-500 font-semibold tracking-wide uppercase text-sm mb-2 block">Our Gallery</span>
                <h2 className="text-4xl font-bold mb-4">Let's Have A Look At My <span className="text-orange-500">Work</span></h2>
                <p className="text-zinc-400 max-w-xl mx-auto text-sm">Browse through my designs, data bundle offers, and document processing flyers.</p>
              </div>

              {/* Tab Switcher */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex bg-zinc-800 border border-zinc-700 rounded-2xl p-1.5 gap-1">
                  {([
                    { key: 'designs', label: '🎨 Designs' },
                    { key: 'data', label: '📶 Data Bundles' },
                    { key: 'docs', label: '📄 Doc Processing' },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      id={`gallery-tab-${tab.key}`}
                      onClick={() => setGalleryTab(tab.key)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${galleryTab === tab.key
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── TAB: Designs ── */}
              {galleryTab === 'designs' && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { src: '/designs/design1.jpg', title: 'Brand Identity', tag: 'Branding' },
                    { src: '/designs/design2.jpg', title: 'Social Media Post', tag: 'Digital' },
                    { src: '/designs/design3.jpg', title: 'Event Flyer', tag: 'Print' },
                    { src: '/designs/design4.jpg', title: 'Logo Design', tag: 'Branding' },
                    { src: '/designs/design5.jpg', title: 'Banner Ad', tag: 'Digital' },
                    { src: '/designs/design6.jpg', title: 'Certificate', tag: 'Print' },
                  ].map((item, i) => (
                    <GalleryCard key={i} src={item.src} title={item.title} tag={item.tag} hint={`Add your design image to /public/designs/design${i + 1}.jpg`} />
                  ))}
                </div>
              )}

              {/* ── TAB: Data Bundles ── */}
              {galleryTab === 'data' && (
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl">
                    <GalleryCard src="/data-bundles/data1.jpg" title="Data Bundle Packages" tag="MTN Data" hint="Add your flyer to /public/data-bundles/data1.jpg" />
                  </div>
                </div>
              )}

              {/* ── TAB: Document Processing ── */}
              {galleryTab === 'docs' && (
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl">
                    <GalleryCard src="/doc-processing/cert.jpeg" title="Document Processing Services" tag="Docs" hint="Add your document sample to /public/doc-processing/cert.jpeg" />
                  </div>
                </div>
              )}

              <div className="mt-12 text-center">
                <a
                  href="https://wa.me/233592756828?text=Hi%20Cybhen!%20I%27d%20like%20to%20order%20a%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]"
                >
                  Order a Service
                </a>
              </div>
            </div>
          </section>

          {/* ===== EXPERIENCE/WHY HIRE ME SECTION ===== */}
          <section id="experience" className="py-24 bg-zinc-950 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">

              {/* Why Hire Me Image / Artwork placeholder */}
              <div className="relative">
                <div className="aspect-square bg-zinc-800 rounded-full border-4 border-zinc-900 shadow-2xl relative overflow-hidden group">
                  <img
                    src="/me2.jpeg"
                    alt="Why Hire Me"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Floating badges */}
                <div className="absolute top-10 -right-6 bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-lg animate-[bounce_4s_infinite]">
                  <span className="text-orange-500 font-bold block text-xl">100%</span>
                  <span className="text-xs text-zinc-400">Client Satisfaction</span>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-bold mb-6 leading-tight">Why You Should <span className="text-orange-500">Hire Me</span> for Your Next Project?</h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  With a multifaceted skill set bridging creative design, high-quality video production, modern web development, and logistical services like data distribution and document processing, I am your one-stop solution. I ensure fast delivery, stunning results, and absolute dependability.
                </p>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-zinc-200">High-end Graphic & Web Design</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-zinc-200">Cinematic Video Edits tailored for Social Media</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-zinc-200">Swift Agent Sim Registration & Document handling</span>
                  </li>
                </ul>

                <a href="#contact" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] block w-fit">
                  Hire Me Now
                </a>
              </div>
            </div>
          </section>

          {/* ===== TESTIMONIALS SECTION ===== */}
          <section id="testimonials" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-orange-500 font-semibold tracking-wide uppercase text-sm mb-2 block">Client Reviews</span>
                <h2 className="text-4xl font-bold mb-4">What People Are <span className="text-orange-500">Saying</span></h2>
                <p className="text-zinc-400 max-w-xl mx-auto text-sm">Hear from some of my satisfied clients about their experiences working with me.</p>
              </div>

              <style>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-50% - 12px)); }
              }
              .animate-scroll {
                animation: scroll 40s linear infinite;
              }
              .animate-scroll:hover {
                animation-play-state: paused;
              }
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

              {/* Scrolling track */}
              <div className="flex gap-6 overflow-hidden no-scrollbar w-full relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-16 before:bg-gradient-to-r before:from-zinc-900 before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-16 after:bg-gradient-to-l after:from-zinc-900 after:to-transparent after:z-10 -mx-6 px-6 lg:-mx-8 lg:px-8">
                <div className="flex gap-6 animate-scroll w-max py-2">
                  {[
                    { name: 'Sarah Jenkins', role: 'Business Owner', text: 'Cybhen transformed our brand identity completely. The graphics were stunning, delivered on time, and exceeded all our expectations.', initials: 'SJ' },
                    { name: 'Michael Osei', role: 'Event Organizer', text: 'Fastest service ever! I needed emergency passport processing and data bundles for our team. Managed swiftly without any hassle.', initials: 'MO' },
                    { name: 'David Thompson', role: 'Tech Startup Founder', text: 'The web development work was top-notch. Our new site is incredibly fast, visually appealing, and exactly what we envisioned.', initials: 'DT' },
                    { name: 'Emelia Asante', role: 'Retailer', text: 'Absolutely love my new logo! It totally captures the essence of my brand. Delivery was super fast and highly professional.', initials: 'EA' },
                    { name: 'Kwabena Mensah', role: 'Student', text: 'The MTN data bundle services are a lifesaver. Quick processing and always reliable exactly when I need it to stay connected.', initials: 'KM' },
                    { name: 'Linda Boateng', role: 'Agency Director', text: 'The video edits were cinematic and exactly what our ad campaign needed. The transitions were incredibly smooth.', initials: 'LB' },
                    { name: 'Prince Arthur', role: 'Consultant', text: 'Got my certificates and business flyers designed here. Top notch aesthetic and truly premium quality. Highly recommended!', initials: 'PA' },
                    { name: 'Joycelyn Kusi', role: 'Health Pro', text: 'Processed my NHIS card through Cybhen. Professional, friendly, and very transparent throughout the whole process.', initials: 'JK' },
                    // Duplicated for seamless scrolling loop
                    { name: 'Sarah Jenkins', role: 'Business Owner', text: 'Cybhen transformed our brand identity completely. The graphics were stunning, delivered on time, and exceeded all our expectations.', initials: 'SJ' },
                    { name: 'Michael Osei', role: 'Event Organizer', text: 'Fastest service ever! I needed emergency passport processing and data bundles for our team. Managed swiftly without any hassle.', initials: 'MO' },
                    { name: 'David Thompson', role: 'Tech Startup Founder', text: 'The web development work was top-notch. Our new site is incredibly fast, visually appealing, and exactly what we envisioned.', initials: 'DT' },
                    { name: 'Emelia Asante', role: 'Retailer', text: 'Absolutely love my new logo! It totally captures the essence of my brand. Delivery was super fast and highly professional.', initials: 'EA' },
                    { name: 'Kwabena Mensah', role: 'Student', text: 'The MTN data bundle services are a lifesaver. Quick processing and always reliable exactly when I need it to stay connected.', initials: 'KM' },
                    { name: 'Linda Boateng', role: 'Agency Director', text: 'The video edits were cinematic and exactly what our ad campaign needed. The transitions were incredibly smooth.', initials: 'LB' },
                    { name: 'Prince Arthur', role: 'Consultant', text: 'Got my certificates and business flyers designed here. Top notch aesthetic and truly premium quality. Highly recommended!', initials: 'PA' },
                    { name: 'Joycelyn Kusi', role: 'Health Pro', text: 'Processed my NHIS card through Cybhen. Professional, friendly, and very transparent throughout the whole process.', initials: 'JK' }
                  ].map((testimonial, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-orange-500/50 transition-all hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] hover:-translate-y-2 flex flex-col justify-between w-[350px] flex-shrink-0">
                      <div>
                        <div className="flex gap-1 mb-6 text-orange-500">
                          {[...Array(5)].map((_, j) => (
                            <svg key={j} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed mb-8 italic">"{testimonial.text}"</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20">
                          {testimonial.initials}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                          <p className="text-zinc-500 text-xs">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* ===== FOOTER & CONTACT ===== */}
        <footer id="contact" className="bg-zinc-900 border-t border-zinc-800 pt-24 overflow-hidden relative pb-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="bg-zinc-800 rounded-[40px] p-8 md:p-16 mb-20 relative overflow-hidden border border-zinc-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full"></div>
              <div className="grid md:grid-cols-2 gap-12 relative z-10">

                <div>
                  <h3 className="text-4xl font-bold mb-4 text-white">Let's Connect <span className="text-orange-500">There</span></h3>
                  <p className="text-zinc-400 mb-8 max-w-sm">Have an awesome project in mind or need assistance with documents and data? Send me a message!</p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 border border-zinc-700">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-sm">Email me at</p>
                        <a href="mailto:cybhenpremium@gmail.com" className="text-white font-medium hover:text-orange-500 transition-colors">cybhenpremium@gmail.com</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 border border-zinc-700">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-sm">Call me at</p>
                        <a href="tel:+233592756828" className="text-white font-medium hover:text-orange-500 transition-colors">+233 59 275 6828</a>
                      </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href="https://wa.me/233592756828?text=Hi%20Cybhen!%20I%20found%20your%20portfolio%20and%20I'd%20love%20to%20chat."
                      target="_blank"
                      rel="noopener noreferrer"
                      id="whatsapp-contact-btn"
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-[#25D366]/10 border border-[#25D366]/30 group-hover:bg-[#25D366]/20 transition-colors">
                        <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-sm">Chat on WhatsApp</p>
                        <p className="text-[#25D366] font-semibold group-hover:underline transition-all">+233 59 275 6828</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Contact Form Details */}
                <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-700">
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-colors text-white placeholder-zinc-500"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-colors text-white placeholder-zinc-500"
                      />
                    </div>
                    <textarea
                      placeholder="Write your message..."
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 focus:outline-none focus:border-orange-500 transition-colors text-white placeholder-zinc-500 resize-none"
                    ></textarea>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] mt-2"
                    >
                      {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>

                    {status === 'success' && <p className="text-green-500 text-sm text-center mt-2 font-medium">Message sent successfully! I will get back to you soon.</p>}
                    {status === 'error' && <p className="text-red-500 text-sm text-center mt-2 font-medium">Error: {errorMsg}</p>}
                  </form>

                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <p className="text-zinc-400 text-sm text-center mb-5 font-medium">Or connect with me completely on:</p>
                    <div className="flex gap-3 items-center flex-wrap justify-center">
                      <a href="https://web.facebook.com/benjamin.amoako.930727" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] transition-all" aria-label="Facebook">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </a>
                      <a href="https://www.tiktok.com/@cybhen_premium?" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-950 hover:border-zinc-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all" aria-label="TikTok">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72A162.55 162.55 0 1 1 162.6 162.55V274c-47.53 0-86.07 38.55-86.07 86.08a86.07 86.07 0 1 0 125.8-6.17V0h113.62c4.44 56.63 48.06 99.44 102.05 107.57z" /></svg>
                      </a>
                      <a href="https://www.linkedin.com/in/benjaminosei9064/" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.4)] transition-all" aria-label="LinkedIn">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </a>
                      <a href="https://www.instagram.com/cybhenpremium" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-[0_0_15px_rgba(228,64,95,0.4)] transition-all" aria-label="Instagram">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                      </a>
                      <a href="https://x.com/cybhenPremium" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-black hover:border-black hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] transition-all" aria-label="X (Twitter)">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </a>
                      <a href="http://www.youtube.com/@benjamin_osei" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all" aria-label="YouTube">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-center md:justify-start items-center pt-8 border-t border-zinc-800">
              <p className="text-zinc-500 text-sm">
                © {new Date().getFullYear()} Cybhen Premium. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== WHATSAPP FLOATING BUTTON ===== */}
      <a
        href="https://wa.me/233592756828?text=Hi%20Cybhen!%20I%20found%20your%20portfolio%20and%20I'd%20love%20to%20chat."
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#25D366',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '50px',
          fontWeight: 700,
          fontSize: '14px',
          boxShadow: '0 8px 32px rgba(37,211,102,0.45)',
          textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px) scale(1.04)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 40px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0) scale(1)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(37,211,102,0.45)';
        }}
      >
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Chat on WhatsApp
      </a>
    </>
  );
}
