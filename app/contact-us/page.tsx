
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SiteSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants';
import { MapPin, Phone, Mail, Send, Clock, Globe } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    api.getSettings().then(data => {
      setSettings(prev => ({...prev, ...data}));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.submitEnquiry({ ...formData, sourcePage: 'CONTACT_PAGE' });
    setSent(true);
  };

  return (
    <div className="bg-white min-h-screen">
       {/* Header */}
       <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
             <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Contact Us</h1>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
       </div>

       <div className="container mx-auto px-4 py-16 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
             
             {/* Sidebar Info - Dark Theme */}
             <div className="lg:w-1/3 bg-slate-900 text-slate-300 p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                   <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
                   <p className="mb-10 text-slate-400">Fill up the form and our team will get back to you within 24 hours.</p>
                   
                   <div className="space-y-8">
                      <div className="flex items-start gap-4">
                         <Phone className="text-yellow-500 mt-1" size={20} />
                         <div>
                            <div className="font-bold text-white">{settings.primaryPhone}</div>
                            {settings.secondaryPhone && <div className="text-sm mt-1">{settings.secondaryPhone}</div>}
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <Mail className="text-yellow-500 mt-1" size={20} />
                         <div>
                            <div className="font-bold text-white">{settings.primaryEmail}</div>
                            <div className="text-sm mt-1">Support 24/7</div>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <MapPin className="text-yellow-500 mt-1" size={20} />
                         <div>
                            <div className="font-bold text-white">{settings.city}, {settings.state}</div>
                            <div className="text-sm mt-1 max-w-[200px]">{settings.address}</div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="relative z-10 mt-12">
                   <div className="flex gap-4">
                      {/* Social Icons Placeholder */}
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-yellow-500 hover:text-slate-900 transition-colors cursor-pointer"><Globe size={18}/></div>
                   </div>
                </div>
             </div>

             {/* Form Area - Light Theme */}
             <div className="lg:w-2/3 p-10 lg:p-16 bg-white">
                {sent ? (
                   <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                         <Send size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                      <p className="text-slate-500 max-w-sm">Thank you for reaching out. Our team will review your message and get back to you shortly.</p>
                      <button onClick={() => setSent(false)} className="mt-8 text-slate-900 font-bold hover:underline">Send another message</button>
                   </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">First Name</label>
                            <input 
                              required
                              className="w-full border-b border-gray-300 py-3 focus:border-yellow-500 outline-none transition-colors bg-transparent"
                              placeholder="John"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                            <input 
                              required
                              className="w-full border-b border-gray-300 py-3 focus:border-yellow-500 outline-none transition-colors bg-transparent"
                              placeholder="+91 8344800800"
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-semibold text-slate-700">Email Address</label>
                         <input 
                           required
                           type="email"
                           className="w-full border-b border-gray-300 py-3 focus:border-yellow-500 outline-none transition-colors bg-transparent"
                           placeholder="john@example.com"
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-semibold text-slate-700">Message</label>
                         <textarea 
                           required
                           rows={4}
                           className="w-full border-b border-gray-300 py-3 focus:border-yellow-500 outline-none transition-colors bg-transparent resize-none"
                           placeholder="Tell us about your property needs..."
                           value={formData.message}
                           onChange={e => setFormData({...formData, message: e.target.value})}
                         ></textarea>
                      </div>

                      <div className="pt-4">
                         <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all transform hover:-translate-y-1 shadow-lg flex items-center gap-2">
                            Send Message <Send size={18} />
                         </button>
                      </div>
                   </form>
                )}
             </div>
          </div>
       </div>
       
       {/* Map Section */}
       <div className="h-[400px] bg-slate-100 w-full flex items-center justify-center text-slate-400">
          <div className="text-center">
             <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
             <h3 className="font-bold text-lg text-slate-500">Find Us on Google Maps</h3>
             <p className="text-sm">Embed map integration here</p>
          </div>
       </div>
    </div>
  );
};
