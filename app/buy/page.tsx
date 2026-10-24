import React, { useEffect, useState } from 'react';
import { Property, ListingType, AdBanner, AdPosition } from '../../types';
import { PropertyCard } from '../../components/PropertyCard';
import { PropertyCardSkeleton } from '../../components/PropertyCardSkeleton';
import { api } from '../../services/api';
import { Filter, Search, SlidersHorizontal, MapPin } from 'lucide-react';

interface ListingPageProps {
  navigate: (path: string) => void;
  type: ListingType;
}

export const ListingPage: React.FC<ListingPageProps> = ({ navigate, type }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // FiltersR
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyLand, setOnlyLand] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      const all = await api.getProperties();
      const allAds = await api.getAds();
      
      const relevant = all.filter(p => p.listingType === type);
      setProperties(relevant);
      setFiltered(relevant);
      setAds(allAds.filter(a => a.isActive));
      
      // Apply URL params filtering after data load
      const hash = window.location.hash;
      if (hash.includes('?')) {
         const params = new URLSearchParams(hash.split('?')[1]);
         const loc = params.get('location');
         const cat = params.get('category');
         if (loc) setLocation(loc);
         if (cat) setPropertyType(cat);
      }
      
      setLoading(false);
    };
    fetchProps();
  }, [type]);

  useEffect(() => {
    let res = properties;
    if (location) {
      res = res.filter(p => 
        p.location.toLowerCase().includes(location.toLowerCase()) || 
        p.city.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (maxPrice) {
      res = res.filter(p => p.price <= parseInt(maxPrice));
    }
    if (propertyType) {
      res = res.filter(p => p.category === propertyType);
    }
    if (onlyLand) {
      res = res.filter(p => p.isLand);
    }
    setFiltered(res);
  }, [location, maxPrice, onlyLand, propertyType, properties]);

  const sidebarAd = ads.find(a => a.position === (type === ListingType.SALE ? AdPosition.BUY_SIDEBAR : AdPosition.RENT_SIDEBAR));
  const title = type === ListingType.SALE ? 'Properties for Sale' : 'Rental Listings';
  const subtitle = type === ListingType.SALE ? 'Find your dream home or investment today.' : 'Discover the perfect rental for your lifestyle.';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Modern Page Header */}
      <div className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center animate-zoom-in" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-3xl animate-fade-in-up">
              <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4 border border-yellow-500/30">
                {type === ListingType.SALE ? 'Buy Property' : 'Rent Property'}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">{title}</h1>
              <p className="text-lg text-slate-300 font-light max-w-2xl">{subtitle}</p>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
         <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Mobile Filter Toggle */}
            <button 
              className="lg:hidden bg-white p-4 rounded-xl shadow-lg flex items-center justify-between font-bold text-slate-800 animate-fade-in-up delay-100"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
               <span className="flex items-center gap-2"><Filter size={20} /> Filter Properties</span>
               <span className="bg-slate-100 px-2 py-1 rounded text-xs">{filtered.length} Results</span>
            </button>

            {/* Sidebar Filters */}
            <aside className={`lg:w-1/4 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28 animate-fade-in-up delay-100">
                <div className="flex items-center justify-between mb-6 text-slate-800 font-extrabold text-lg border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2"><SlidersHorizontal size={20} className="text-yellow-500"/> Filters</div>
                  <button 
                    onClick={() => { setLocation(''); setMaxPrice(''); setOnlyLand(false); setPropertyType(''); }}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Reset All
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400"/>
                        <input 
                          type="text" 
                          placeholder="City or Area..."
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Property Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all cursor-pointer appearance-none"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="HOUSE">Independent House</option>
                      <option value="VILLA">Luxury Villa</option>
                      <option value="LAND">Land / Plot</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Budget</label>
                     <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-400 font-semibold text-sm">₹</span>
                        <input 
                          type="number" 
                          placeholder="Any Price"
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                     </div>
                  </div>

                  {type === ListingType.SALE && (
                    <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl border border-yellow-100/50 cursor-pointer hover:bg-yellow-100/50 transition-colors" onClick={() => setOnlyLand(!onlyLand)}>
                       <span className="text-sm font-bold text-slate-800">Show Land Only</span>
                       <div className={`w-10 h-6 rounded-full relative transition-colors ${onlyLand ? 'bg-yellow-500' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${onlyLand ? 'left-5' : 'left-1'}`}></div>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {sidebarAd && (
                <div className="sticky top-[600px] animate-fade-in-up delay-300">
                   <div className="rounded-2xl overflow-hidden shadow-xl group">
                      <a href={sidebarAd.linkUrl ? (sidebarAd.linkUrl.startsWith('/') ? `#${sidebarAd.linkUrl}` : sidebarAd.linkUrl) : '#'}>
                        <img src={sidebarAd.imageUrl} alt={sidebarAd.title} className="w-full group-hover:scale-105 transition-transform duration-500" />
                      </a>
                   </div>
                </div>
              )}
            </aside>

            {/* Results */}
            <div className="lg:w-3/4">
               {/* Results Header */}
               <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up delay-200">
                  <div className="font-bold text-slate-700">
                    Showing <span className="text-slate-900 text-lg">{filtered.length}</span> Properties
                  </div>
                  <div className="text-sm text-slate-400 hidden md:block">
                     Sorted by <span className="font-semibold text-slate-700">Newest First</span>
                  </div>
               </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                   {[1,2,3,4,5,6].map(i => (
                      <PropertyCardSkeleton key={i} />
                   ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filtered.map((p, index) => (
                    <PropertyCard key={p.id} property={p} onClick={(slug) => navigate(`/property/${slug}`)} index={index} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-16 rounded-2xl text-center shadow-sm border border-gray-100 animate-fade-in-up">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-slate-300" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">No properties found</h3>
                   <p className="text-slate-500 max-w-md mx-auto">We couldn't find any properties matching your current filters. Try adjusting your search criteria.</p>
                   <button 
                     onClick={() => { setLocation(''); setMaxPrice(''); setOnlyLand(false); setPropertyType(''); }}
                     className="mt-6 text-yellow-600 font-bold hover:underline"
                   >
                     Clear all filters
                   </button>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};