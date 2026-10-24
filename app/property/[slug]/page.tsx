import React, { useEffect, useState, useCallback } from 'react';
import { Property } from '../../../types';
import { api } from '../../../services/api';
import { PropertyCard } from '../../../components/PropertyCard';
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, User, CheckCircle, ArrowRight, Star, ShieldCheck, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface DetailProps {
  slug: string;
  navigate: (path: string) => void;
}

export const PropertyDetailPage: React.FC<DetailProps> = ({ slug, navigate }) => {
  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [relatedProps, setRelatedProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      window.scrollTo(0, 0);
      const data = await api.getPropertyBySlug(slug);
      const all = await api.getProperties();
      
      if (data) {
        document.title = `${data.title} | Premium Real Estate`;
        setProperty(data);
        // Combine main image and gallery for the slideshow
        setAllImages([data.mainImageUrl, ...(data.galleryImages || [])]);
        
        // Fetch 4 related properties
        setRelatedProps(all.filter(p => p.id !== data.id && p.listingType === data.listingType).slice(0, 4));
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const nextPhoto = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevPhoto = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhotoIndex((prev) => (prev + allImages.length - 1) % allImages.length);
  }, [allImages.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextPhoto, prevPhoto]);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.submitEnquiry({ name, phone, email, message: msg || 'I am interested in this property', propertyId: property?.id, propertySlug: property?.slug, propertyTitle: property?.title, sourcePage: 'PROPERTY' });
    setSent(true);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
        {/* Hero Skeleton */}
        <div className="relative h-[60vh] md:h-[70vh] w-full bg-slate-200 animate-pulse overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title Skeleton */}
              <div className="space-y-4 animate-fade-in-up">
                <div className="h-10 bg-slate-200 rounded-lg w-3/4 animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-6 bg-slate-200 rounded-full w-24 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-32 animate-pulse"></div>
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>

              {/* Content Blocks Skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}

              {/* Gallery Skeleton */}
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-slate-200 rounded-lg w-1/4"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-slate-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-slate-200 rounded-lg"></div>
                  ))}
                  <div className="h-14 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shimmer Animation */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .animate-shimmer {
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    );
  }
  
  if (!property) return <div className="p-20 text-center text-xl">Property not found.</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      
      {/* 1. Luxury Hero Gallery */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-slate-900 overflow-hidden group cursor-pointer animate-fade-in-up" onClick={() => openLightbox(0)}>
         <img src={property.mainImageUrl} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2s] animate-zoom-in" alt="Main" style={{ animationDuration: '1.5s' }} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
         
         {/* View Photos Button */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 flex items-center gap-2">
            <ZoomIn size={20} /> View All Photos ({allImages.length})
         </div>

         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
            <div className="container mx-auto">
               <div className="flex flex-wrap gap-3 mb-4 animate-fade-in-up delay-100">
                  <span className="bg-yellow-500 text-slate-900 px-3 py-1 font-bold uppercase tracking-widest text-xs rounded-sm">{property.listingType}</span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 font-bold uppercase tracking-widest text-xs rounded-sm border border-white/30">{property.category}</span>
                  {property.customId && <span className="bg-slate-800/50 backdrop-blur-sm px-3 py-1 text-xs rounded-sm font-mono border border-slate-700">ID: {property.customId}</span>}
               </div>
               <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 drop-shadow-xl animate-fade-in-up delay-200">{property.title}</h1>
               <div className="flex items-center gap-2 text-slate-300 text-lg animate-fade-in-up delay-300">
                  <MapPin size={20} className="text-yellow-500" /> {property.location}, {property.city}
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16 animate-fade-in-up delay-300">
           
           {/* 2. Quick Stats Bar */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                 <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Price</div>
                 <div className="text-2xl font-bold text-slate-900">₹ {(property.price).toLocaleString()}</div>
              </div>
              <div>
                 <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Area</div>
                 <div className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Square size={20} className="text-yellow-500"/> {property.areaSqft} <span className="text-sm font-normal text-slate-500">sqft</span></div>
              </div>
              {!property.isLand && (
                <>
                  <div>
                     <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Bedrooms</div>
                     <div className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Bed size={24} className="text-yellow-500"/> {property.bedrooms}</div>
                  </div>
                  <div>
                     <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Bathrooms</div>
                     <div className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Bath size={24} className="text-yellow-500"/> {property.bathrooms}</div>
                  </div>
                </>
              )}
           </div>

           {/* 3. Lifestyle Summary (Overview) */}
           {property.overview && (
             <div>
               <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                 <Star className="text-yellow-500" fill="currentColor" size={24} /> Lifestyle Overview
               </h2>
               <p className="text-xl leading-relaxed text-slate-600 font-light italic border-l-4 border-yellow-500 pl-6">
                 "{property.overview}"
               </p>
             </div>
           )}

           {/* 5. Detailed Description */}
           <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About This Property</h2>
              <div className="prose prose-lg text-slate-600 leading-relaxed max-w-none whitespace-pre-line">
                {property.description}
              </div>
           </div>

           {/* 4. Key Features / Amenities */}
           {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Exclusive Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                  {property.amenities.map((am, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                      <span className="font-medium">{am}</span>
                    </div>
                  ))}
                </div>
              </div>
           )}

           {/* 6. Specifications Table */}
           {property.specifications && Object.keys(property.specifications).length > 0 && (
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Specifications</h2>
                 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                       <tbody className="divide-y divide-slate-100">
                          {Object.entries(property.specifications).map(([key, val], i) => (
                            <tr key={i} className="hover:bg-slate-50">
                               <td className="p-4 w-1/3 bg-slate-50/50 font-semibold text-slate-600 border-r border-slate-100">{key}</td>
                               <td className="p-4 text-slate-800">{val as string}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {/* 7. Location Advantages */}
           {property.locationHighlights && property.locationHighlights.length > 0 && (
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">Location Highlights</h2>
                 <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10 grid gap-4">
                       {property.locationHighlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-4">
                             <div className="bg-yellow-500 rounded-full p-1 mt-1">
                                <CheckCircle size={12} className="text-slate-900" />
                             </div>
                             <span className="text-lg font-light">{h}</span>
                          </div>
                       ))}
                    </div>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                 </div>
              </div>
           )}
           
           {/* YouTube Video Section */}
           {property.youtubeUrl && (
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">Video Tour</h2>
                 <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={property.youtubeUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      title="Property Video Tour"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                 </div>
              </div>
           )}
           
           {/* Gallery Grid */}
           {property.galleryImages && property.galleryImages.length > 0 && (
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">Gallery</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.galleryImages.map((img, i) => (
                       <div key={i} className="relative overflow-hidden rounded-lg h-48 group cursor-pointer" onClick={() => openLightbox(i + 1)}>
                          <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Gallery" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                             <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>

        {/* Sidebar / CTA */}
        <div className="lg:col-span-1 animate-fade-in-up delay-500">
           <div className="sticky top-24 space-y-8">
              
              {/* 9. Contact Form */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 ring-1 ring-slate-900/5">
                 <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Interested in this property?</h3>
                    <p className="text-slate-500 text-sm mt-1">Fill out the form below to book a viewing.</p>
                 </div>

                 {sent ? (
                    <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-100">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="font-bold">Request Received!</div>
                      <div className="text-sm mt-1">Our luxury consultant will contact you shortly.</div>
                    </div>
                 ) : (
                   <form onSubmit={handleEnquiry} className="space-y-4">
                     <div className="relative">
                        <User size={16} className="absolute left-4 top-3.5 text-slate-400"/>
                        <input 
                          required 
                          value={name} onChange={e => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm font-medium" 
                          placeholder="Full Name" 
                        />
                     </div>
                     <div className="relative">
                        <Phone size={16} className="absolute left-4 top-3.5 text-slate-400"/>
                        <input 
                          required 
                          value={phone} onChange={e => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm font-medium" 
                          placeholder="Phone Number" 
                        />
                     </div>
                     <div className="relative">
                        <MessageCircle size={16} className="absolute left-4 top-3.5 text-slate-400"/>
                        <input 
                          required 
                          type="email" 
                          value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm font-medium" 
                          placeholder="Email Address" 
                        />
                     </div>
                     <textarea 
                       value={msg} onChange={e => setMsg(e.target.value)}
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm font-medium h-32 resize-none" 
                       placeholder="I am interested in this property..."
                     ></textarea>
                     
                     <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                        Send Enquiry <ArrowRight size={18} />
                     </button>
                   </form>
                 )}

                 <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button className="flex-1 py-3 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                       <Phone size={18} /> Call
                    </button>
                    <button className="flex-1 py-3 rounded-lg bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] flex items-center justify-center gap-2">
                       <MessageCircle size={18} /> WhatsApp
                    </button>
                 </div>
              </div>

              {/* Agent / Developers Card */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
                 <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl shadow-md">
                    P
                 </div>
                 <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Listing Agent</div>
                    <div className="font-bold text-slate-900 text-lg">Trisun</div>
                    <div className="text-xs text-slate-500">Luxury Property Specialist</div>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* Related Properties */}
      {relatedProps.length > 0 && (
         <div className="bg-slate-50 py-20 border-t border-slate-200">
            <div className="container mx-auto px-4">
               <h2 className="text-3xl font-bold text-slate-900 mb-10">Similar Exclusive Listings</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {relatedProps.map((p, index) => (
                     <PropertyCard key={p.id} property={p} onClick={(s) => navigate(`/property/${s}`)} index={index} />
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
           {/* Close Button */}
           <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition-all z-50">
              <X size={32} />
           </button>

           {/* Image Counter */}
           <div className="absolute top-6 left-6 text-white font-medium bg-black/50 px-4 py-2 rounded-full">
              {photoIndex + 1} / {allImages.length}
           </div>

           {/* Main Image Area */}
           <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10">
              {/* Left Arrow */}
              <button 
                onClick={prevPhoto} 
                className="absolute left-4 md:left-10 text-white bg-black/30 hover:bg-yellow-500 hover:text-black p-3 rounded-full transition-all z-50"
              >
                 <ChevronLeft size={40} />
              </button>

              <img 
                src={allImages[photoIndex]} 
                alt={`View ${photoIndex}`} 
                className="max-w-full max-h-full object-contain shadow-2xl animate-zoom-in duration-300 select-none"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
              />

              {/* Right Arrow */}
              <button 
                onClick={nextPhoto} 
                className="absolute right-4 md:right-10 text-white bg-black/30 hover:bg-yellow-500 hover:text-black p-3 rounded-full transition-all z-50"
              >
                 <ChevronRight size={40} />
              </button>
           </div>
           
           {/* Thumbs Preview (Desktop Only) */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-2 overflow-x-auto max-w-[80vw] p-2" onClick={(e) => e.stopPropagation()}>
              {allImages.map((img, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setPhotoIndex(idx)}
                   className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${idx === photoIndex ? 'border-yellow-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                 >
                    <img src={img} className="w-full h-full object-cover" alt="thumb" />
                 </div>
              ))}
           </div>
        </div>
      )}

    </div>
  );
};