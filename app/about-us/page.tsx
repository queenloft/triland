
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SiteSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants';
import { Users, Target, Award, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    api.getSettings().then(data => {
        // Ensure we don't accidentally set empty values that cause a blank UI
        setSettings(prev => ({...prev, ...data}));
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
       {/* Modern Hero Section */}
       <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000" 
               alt="Office" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
             <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Building Trust, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Delivering Dreams.</span>
             </h1>
             <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
                We are {settings.companyName}, your premier partner in real estate excellence.
             </p>
          </div>
       </section>

       {/* Stats Section */}
       <section className="relative -mt-16 container mx-auto px-4 z-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div className="space-y-2">
                <div className="text-4xl font-extrabold text-slate-800">5+</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Years Experience</div>
             </div>
             <div className="space-y-2 border-l border-gray-100">
                <div className="text-4xl font-extrabold text-yellow-500">100+</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Properties Sold</div>
             </div>
             <div className="space-y-2 border-l border-gray-100">
                <div className="text-4xl font-extrabold text-slate-800">500+</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Happy Families</div>
             </div>
             <div className="space-y-2 border-l border-gray-100">
                <div className="text-4xl font-extrabold text-emerald-500">5+</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Awards Won</div>
             </div>
          </div>
       </section>

       {/* Main Content Split */}
       <section className="container mx-auto px-4 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="lg:w-1/2">
                <div className="relative">
                   <img 
                     src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000" 
                     alt="Meeting" 
                     className="rounded-2xl shadow-2xl w-full object-cover z-10 relative"
                   />
                   {/* Decorative Elements */}
                   <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-yellow-100 rounded-full -z-0 blur-2xl"></div>
                   <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-100 rounded-full -z-0 blur-2xl"></div>
                </div>
             </div>
             <div className="lg:w-1/2 space-y-8">
                <div>
                   <h4 className="text-yellow-600 font-bold uppercase tracking-wider mb-2">Who We Are</h4>
                   <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Redefining Real Estate with Integrity and Innovation</h2>
                </div>
                <div className="prose prose-lg text-slate-600 leading-relaxed">
                   {settings.aboutUsContent}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                   <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="font-medium text-slate-700">Legal Verification Support</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="font-medium text-slate-700">Transparent Pricing</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="font-medium text-slate-700">Expert Market Analysis</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="font-medium text-slate-700">Post-Sales Support</span>
                   </div>
                </div>
             </div>
          </div>
       </section>

       {/* Values Grid */}
       <section className="bg-slate-50 py-24">
         <div className="container mx-auto px-4">
             <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
                <p className="text-slate-500">We believe in more than just selling properties. We believe in building lasting relationships based on trust.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { title: 'Mission', icon: Target, desc: 'To streamline the property buying process with technology and transparency.', color: 'bg-blue-50 text-blue-600' },
                    { title: 'Vision', icon: TrendingUp, desc: 'To become the most trusted real estate partner in the region for families and investors.', color: 'bg-purple-50 text-purple-600' },
                    { title: 'Commitment', icon: Briefcase, desc: 'We are committed to finding you not just a house, but a home that fits your lifestyle.', color: 'bg-yellow-50 text-yellow-600' }
                 ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 text-center group">
                       <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform`}>
                          <item.icon size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                       <p className="text-slate-500 leading-relaxed">
                          {item.desc}
                       </p>
                    </div>
                 ))}
             </div>
         </div>
       </section>
    </div>
  );
};
