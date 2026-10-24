
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Facebook, Instagram, MapPin, Youtube, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const Layout: React.FC<LayoutProps> = ({ children, setCurrentPage, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    api.getSettings().then(data => {
        setSettings(prev => ({...prev, ...data}));
    });
    
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy', path: '/buy' },
    { name: 'Sell', path: '/sell' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact-us' },
  ];

  const handleNav = (path: string) => {
    setCurrentPage(path);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // WhatsApp Link Generator
  const whatsappLink = `https://wa.me/${settings.primaryPhone?.replace(/[^0-9]/g, '') || settings.primaryPhone.replace(/[^0-9]/g, '')}?text=Hi, I am interested in a property.`;

  // Trisun Logo Component
  const TrisunLogo = () => (
    <div className="flex items-center gap-0.5 group">
        {/* TR */}
        <span className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-purple-800 to-fuchsia-600 leading-none" style={{ fontFamily: 'sans-serif' }}>TR</span>
        
        {/* Vel Icon (I) */}
        <div className="flex flex-col items-center justify-end h-8 w-5 relative mx-0.5">
            {/* Spear Head */}
            <div className="w-4 h-5 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-sm relative z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-1 h-1 bg-red-600 rounded-full mt-1 shadow-inner opacity-80"></div>
            </div>
            {/* Staff */}
            <div className="w-1 h-4 bg-gradient-to-b from-yellow-500 to-orange-700 -mt-1"></div>
        </div>

        {/* SUN */}
        <span className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-purple-800 to-fuchsia-600 leading-none" style={{ fontFamily: 'sans-serif' }}>SUN</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans relative">
      {/* Top Bar - Dark & Sleek */}
      <div className="bg-slate-900 text-slate-300 py-2 text-xs md:text-sm transition-all duration-300">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <Phone size={14} className="text-yellow-500" />
              <span className="leading-tight">
                {settings.primaryPhone}
                {settings.secondaryPhone ? ` / ${settings.secondaryPhone}` : ''}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <Mail size={14} className="text-yellow-500" />
              <span>{settings.primaryEmail}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex gap-3 text-slate-400">
                 {settings.facebookUrl && <a href={settings.facebookUrl} className="hover:text-blue-500 transition-colors"><Facebook size={14}/></a>}
                 {settings.instagramUrl && <a href={settings.instagramUrl} className="hover:text-pink-500 transition-colors"><Instagram size={14}/></a>}
                 {settings.youtubeUrl && <a href={settings.youtubeUrl} className="hover:text-red-500 transition-colors"><Youtube size={14}/></a>}
             </div>
             <div className="h-4 w-px bg-slate-700 hidden md:block"></div>
             <button onClick={() => handleNav('/admin')} className="hover:text-yellow-400 transition-colors font-medium uppercase tracking-wider text-[10px]">Admin Login</button>
          </div>
        </div>
      </div>

      {/* Modern Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-lg border-gray-100 py-3' : 'bg-white/90 backdrop-blur-md py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex flex-col cursor-pointer"
            onClick={() => handleNav('/')}
          >
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.companyName} className="h-10 md:h-12 w-auto object-contain" />
            ) : (
              <img src="/logo.jpeg" alt="Trisun Logo" className="h-10 md:h-12 w-auto object-contain rounded-[10px]" />
            )}
          </div>

          {/* Desktop Nav - Glass Effect */}
          <nav className="hidden lg:flex items-center bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full px-2 py-2 border border-pink-300/40 shadow-lg shadow-pink-200/50">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link.path)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  currentPage === link.path 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-300 text-white shadow-lg shadow-pink-500/40 scale-105' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href={`tel:${settings.primaryPhone}`}
              className="group bg-slate-900 hover:bg-slate-800 text-white pl-5 pr-2 py-2 rounded-full flex items-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 ring-4 ring-slate-100"
            >
              <span className="text-sm font-bold">Get in Touch</span>
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                  <Phone size={16} strokeWidth={2.5} />
              </div>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl lg:hidden animate-in slide-in-from-top-5 duration-200 z-40">
                <div className="flex flex-col p-4 space-y-2">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => handleNav(link.path)}
                            className={`p-4 rounded-xl text-left font-bold flex justify-between items-center transition-colors ${
                                currentPage === link.path 
                                    ? 'bg-yellow-50 text-yellow-700' 
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {link.name}
                            {currentPage === link.path && <ChevronRight size={16} />}
                        </button>
                    ))}
                    <div className="border-t border-slate-100 my-2 pt-2">
                         <a href={`tel:${settings.primaryPhone}`} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                            <Phone size={18} /> Call Now
                         </a>
                    </div>
                </div>
            </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-in fade-in zoom-in"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon size={32} className="text-white" />
        <span className="absolute right-full mr-4 bg-white text-slate-800 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          Chat with us
        </span>
      </a>

      {/* Footer - Modern & Trendy */}
      <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300 pt-24 pb-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[140px] animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5 scale-110 origin-left mb-4">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt={settings.companyName} className="h-12 md:h-14 w-auto object-contain " />
                  ) : (
                    <img src="/logo.jpeg" alt="Trisun Logo" className="h-12 md:h-14 w-auto object-contain rounded-[10px]" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md text-sm">
                {settings.tagline || 'Your trusted partner in finding the perfect property. We make real estate simple, transparent, and efficient.'}
              </p>
              <div className="flex gap-3 pt-2">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} className="group relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 border border-slate-700 hover:border-blue-500">
                    <Facebook size={20} className="group-hover:scale-110 transition-transform"/>
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} className="group relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30 border border-slate-700 hover:border-pink-500">
                    <Instagram size={20} className="group-hover:scale-110 transition-transform"/>
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} className="group relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 border border-slate-700 hover:border-red-500">
                    <Youtube size={20} className="group-hover:scale-110 transition-transform"/>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-black text-white mb-6 uppercase tracking-wider relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></span>
              </h4>
              <ul className="space-y-3">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={() => handleNav(link.path)} 
                      className="group hover:text-yellow-400 transition-all duration-300 flex items-center gap-2 text-sm hover:translate-x-1"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-yellow-500 transition-all duration-300 rounded-full"></span>
                      <span>{link.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base font-black text-white mb-6 uppercase tracking-wider relative inline-block">
                Get In Touch
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2.5 rounded-lg text-yellow-500 flex-shrink-0 group-hover:from-yellow-500 group-hover:to-orange-500 group-hover:text-slate-900 transition-all duration-300 border border-slate-700">
                    <MapPin size={18} />
                  </div>
                  <span className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                    {settings.address},<br/>{settings.city}, {settings.state} - {settings.pincode}
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2.5 rounded-lg text-yellow-500 flex-shrink-0 group-hover:from-yellow-500 group-hover:to-orange-500 group-hover:text-slate-900 transition-all duration-300 border border-slate-700">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <a href={`tel:${settings.primaryPhone}`} className="text-xs font-medium text-slate-400 group-hover:text-yellow-400 transition-colors">
                      {settings.primaryPhone}
                    </a>
                    {settings.secondaryPhone && (
                      <a href={`tel:${settings.secondaryPhone}`} className="text-xs font-medium text-slate-400 group-hover:text-yellow-400 transition-colors">
                        {settings.secondaryPhone}
                      </a>
                    )}
                  </div>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2.5 rounded-lg text-yellow-500 flex-shrink-0 group-hover:from-yellow-500 group-hover:to-orange-500 group-hover:text-slate-900 transition-all duration-300 border border-slate-700">
                    <Mail size={18} />
                  </div>
                  <a href={`mailto:${settings.primaryEmail}`} className="text-xs font-medium text-slate-400 group-hover:text-yellow-400 transition-colors break-all">
                    {settings.primaryEmail}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800/50 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} <span className="font-bold text-slate-400">{settings.companyName}</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs text-slate-500">
                <button className="hover:text-yellow-400 transition-colors">Privacy Policy</button>
                <span className="text-slate-700">•</span>
                <button className="hover:text-yellow-400 transition-colors">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
