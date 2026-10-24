import React, { useEffect, useState } from 'react';
import { Property, AdBanner, AdPosition, PropertyCategory } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyCardSkeleton } from '../components/PropertyCardSkeleton';
import { api } from '../services/api';
import { Search, CheckCircle, Quote, Home, Building2, Trees, Store, Landmark, ArrowRight, Key, CircleDollarSign } from 'lucide-react';

interface HomeProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomeProps> = ({ navigate }) => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  
  // Search State
  const [searchMode, setSearchMode] = useState<'Buy' | 'Rent' | 'Sell'>('Buy');
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const all = await api.getProperties();
      const allAds = await api.getAds();
      
      setAllProperties(all);
      setFeaturedProperties(all.filter(p => p.isFeatured).slice(0, 6));
      setAds(allAds.filter(a => a.isActive));

      // Calculate Category Counts
      const counts: Record<string, number> = {};
      all.forEach(p => {
        const cat = p.category;
        counts[cat] = (counts[cat] || 0) + 1;
      });
      setCategoryCounts(counts);

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchMode === 'Sell') {
      if (searchLocation) params.append('location', searchLocation);
      if (searchType) params.append('propertyType', searchType);
      const queryString = params.toString();
      navigate(`/sell${queryString ? '?' + queryString : ''}`);
      return;
    }

    const route = searchMode === 'Buy' ? '/buy' : '/rent';
    if (searchLocation) params.append('location', searchLocation);
    if (searchType) params.append('category', searchType);
    
    const queryString = params.toString();
    navigate(`${route}${queryString ? '?' + queryString : ''}`);
  };

  const heroAd = ads.find(a => a.position === AdPosition.HOME_HERO);
  const middleAd = ads.find(a => a.position === AdPosition.HOME_MIDDLE);

  // Category Definitions for UI
  const categoryCards = [
    { id: PropertyCategory.HOUSE, label: 'House', icon: Home, color: 'text-blue-600 bg-blue-50' },
    { id: PropertyCategory.LAND, label: 'Land / Plots', icon: Trees, color: 'text-green-600 bg-green-50' },
    { id: PropertyCategory.APARTMENT, label: 'Flat / Apartment', icon: Building2, color: 'text-orange-600 bg-orange-50' },
    { id: PropertyCategory.VILLA, label: 'Independent Villa', icon: Landmark, color: 'text-purple-600 bg-purple-50' },
    { id: PropertyCategory.COMMERCIAL, label: 'Commercial', icon: Store, color: 'text-red-600 bg-red-50' },
  ];

  // Tabs for Prime Properties Section
  const filterTabs = [
    { label: 'All', value: 'All' },
    { label: 'Farm House/Land', value: PropertyCategory.LAND },
    { label: 'Flat/Apartment', value: PropertyCategory.APARTMENT },
    { label: 'House', value: PropertyCategory.HOUSE },
    { label: 'Independent Villa', value: PropertyCategory.VILLA },
    { label: 'Plot', value: PropertyCategory.PLOT },
  ];

  // Filtering Logic
  const getFilteredProperties = () => {
    let filtered = allProperties;
    if (activeTab !== 'All') {
       if (activeTab === PropertyCategory.LAND) {
          // Show items marked as LAND category OR isLand flag
          filtered = allProperties.filter(p => p.category === PropertyCategory.LAND || p.isLand);
       } else {
          filtered = allProperties.filter(p => p.category === activeTab);
       }
    }
    // Return top 6 relevant items
    return filtered.slice(0, 6);
  };

  const displayedProperties = getFilteredProperties();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[550px] md:h-[650px] flex items-center justify-center animate-fade-in-up">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroAd ? heroAd.imageUrl : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000"} 
            alt="Hero Background" 
            className="w-full h-full object-cover animate-zoom-in"
            style={{ animationDuration: '1.5s' }}
          />
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Your Trusted <span className="text-yellow-400">Real Estate Partner</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            Browse your valuable properties for purchase and sale. We make finding your dream home simple and transparent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '520ms' }}>
            <button
              onClick={() => navigate('/buy')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Browse Properties
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/sell')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-colors border border-white/20"
            >
              Sell Your Property
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
             <select 
               className="flex-1 p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
               value={searchMode}
               onChange={(e) => setSearchMode(e.target.value as 'Buy' | 'Rent' | 'Sell')}
             >
               <option value="Buy">Buy</option>
               <option value="Sell">Sell</option>
             </select>
             <select 
               className="flex-1 p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
               value={searchType}
               onChange={(e) => setSearchType(e.target.value)}
             >
               <option value="">All Types</option>
               <option value="APARTMENT">Apartment</option>
               <option value="VILLA">Villa</option>
               <option value="HOUSE">House</option>
               <option value="LAND">Land</option>
               <option value="COMMERCIAL">Commercial</option>
             </select>
             <input 
               type="text" 
               placeholder={searchMode === 'Sell' ? "Property Location (e.g. Anna Nagar)" : "Location (e.g. Anna Nagar)"}
               className="flex-[2] p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none"
               value={searchLocation}
               onChange={(e) => setSearchLocation(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
             />
             <button 
               onClick={handleSearch}
               className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               <Search size={20} />
               {searchMode === 'Sell' ? 'Start Selling' : 'Search'}
             </button>
          </div>
        </div>
      </section>

      {/* Property Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Let's Explore The Different Types Of Properties</h2>
           <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-4"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
           {categoryCards.map((cat, index) => {
             // Combine counts for similar types if needed, e.g. LAND + PLOT
             let count = categoryCounts[cat.id] || 0;
             if (cat.id === PropertyCategory.LAND) count += (categoryCounts[PropertyCategory.PLOT] || 0);
             
             return (
               <div 
                 key={cat.id} 
                 onClick={() => {
                   if (searchMode === 'Sell') {
                     const params = new URLSearchParams();
                     params.append('propertyType', cat.id);
                     if (searchLocation) params.append('location', searchLocation);
                     navigate(`/sell?${params.toString()}`);
                     return;
                   }
                   navigate(searchMode === 'Buy' ? `/buy?category=${cat.id}` : `/rent?category=${cat.id}`);
                 }}
                 className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center animate-fade-in-up"
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                     <cat.icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-yellow-600 transition-colors">{cat.label}</h3>
                  <p className="text-slate-500 text-sm font-medium">{count} Properties</p>
               </div>
             );
           })}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-3xl font-bold text-slate-800 mb-2">Featured Properties</h2>
             <p className="text-slate-500">Handpicked properties just for you.</p>
           </div>
           <button onClick={() => navigate('/buy')} className="hidden md:flex items-center gap-2 text-yellow-600 font-bold hover:underline">
             View All <ArrowRight size={16}/>
           </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((p, index) => (
              <PropertyCard key={p.id} property={p} onClick={(slug) => navigate(`/property/${slug}`)} index={index} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
           <button onClick={() => navigate('/buy')} className="border-2 border-slate-800 text-slate-800 font-bold py-3 px-8 rounded-full hover:bg-slate-800 hover:text-white transition-all">
             View All Properties
           </button>
        </div>
      </section>

      {/* Middle Ad Banner */}
      {middleAd && (
        <section className="container mx-auto px-4">
           <div className="w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-lg relative group cursor-pointer animate-fade-in-up" onClick={() => middleAd.linkUrl && navigate(middleAd.linkUrl)}>
              <img src={middleAd.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Middle Banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-8 md:p-16">
                 <div className="text-white">
                    <span className="bg-yellow-500 text-xs font-bold px-3 py-1 rounded mb-4 inline-block shadow-sm">SPECIAL OFFER</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">{middleAd.title}</h3>
                    <button className="mt-4 bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-lg">Learn More</button>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Prime Properties with Filters (Replaces old Land section) */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-10">
             <h2 className="text-3xl font-bold text-slate-800 mb-4">Prime Properties</h2>
             <p className="text-slate-500 mb-8 text-center max-w-2xl">Browse through our exclusive collection of verified listings.</p>
             
             {/* Dynamic Filters */}
             <div className="flex flex-wrap justify-center gap-3">
                {filterTabs.map(tab => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                      activeTab === tab.value 
                        ? 'bg-slate-900 text-white shadow-md ring-2 ring-offset-2 ring-slate-900' 
                        : 'bg-white text-slate-600 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))
             ) : displayedProperties.length > 0 ? (
               displayedProperties.map((p, index) => (
                  <PropertyCard key={p.id} property={p} onClick={(slug) => navigate(`/property/${slug}`)} index={index} />
               ))
             ) : (
                <div className="col-span-3 text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
                   <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={24} />
                   </div>
                   <p className="text-slate-500 font-medium">No properties found in this category.</p>
                </div>
             )}
          </div>
          
          <div className="text-center mt-12">
             <button onClick={() => navigate('/buy')} className="text-yellow-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                View All Listings <ArrowRight size={16}/>
             </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Why Choose Us</h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">We bring you the best properties with complete transparency and legality checks.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Trusted Developers', desc: 'Over 5 years of experience in the market with 100+ happy customers.' },
            { title: 'Transparent Deals', desc: 'No hidden charges. We ensure legally verified documentation for every deal.' },
            { title: 'Prime Locations', desc: 'We specialize in properties located in high-growth and premium areas.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
            {/* Testimonials (Mock) */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-slate-800 p-8 rounded-xl relative hover:bg-slate-750 transition-colors animate-fade-in-up">
                <Quote className="text-yellow-500 absolute top-4 left-4 opacity-20" size={40} />
                <p className="text-slate-300 mb-6 italic relative z-10">"Found my dream villa through them. The process was smooth and the team was extremely helpful with documentation."</p>
                <div className="font-bold text-yellow-400">- Rajesh Kumar</div>
                <div className="text-xs text-slate-400">Bought a Villa in ECR</div>
             </div>
             <div className="bg-slate-800 p-8 rounded-xl relative hover:bg-slate-750 transition-colors animate-fade-in-up delay-200">
                <Quote className="text-yellow-500 absolute top-4 left-4 opacity-20" size={40} />
                <p className="text-slate-300 mb-6 italic relative z-10">"Very professional service. They showed me exactly what I was looking for without wasting time."</p>
                <div className="font-bold text-yellow-400">- Priya Sundar</div>
                <div className="text-xs text-slate-400">Rented an Apartment</div>
             </div>
          </div>
        </div>
      </section>

      {/* Platform Services Section (New) */}
      <section className="bg-[#FFFBF2] py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Text & Cards */}
            <div className="lg:w-1/2">

              <div className="space-y-6">
                  {/* Buy Card */}
                  <div onClick={() => navigate('/buy')} className="bg-white p-6 rounded-xl shadow-sm border border-orange-50 flex gap-5 items-start hover:shadow-xl transition-all cursor-pointer group animate-fade-in-up delay-200 hover:-translate-y-1">
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          <Home size={32} strokeWidth={1.5} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Buy a new home</h3>
                          <p className="text-slate-500 text-sm mb-3 leading-relaxed">Find your dream home with Trisun. We make the buying process smooth and stress-free.</p>
                          <span className="text-yellow-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Buy a house <ArrowRight size={16}/></span>
                      </div>
                  </div>

                  {/* Sell Card */}
                  <div onClick={() => navigate('/contact-us')} className="bg-white p-6 rounded-xl shadow-sm border border-orange-50 flex gap-5 items-start hover:shadow-xl transition-all cursor-pointer group animate-fade-in-up delay-300 hover:-translate-y-1">
                      <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          <CircleDollarSign size={32} strokeWidth={1.5} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">Sell a home</h3>
                          <p className="text-slate-500 text-sm mb-3 leading-relaxed">Get the best value for your property. Trust our expertise to close the deal efficiently.</p>
                          <span className="text-yellow-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Contact us <ArrowRight size={16}/></span>
                      </div>
                  </div>

                  {/* Rent Card */}
                  <div onClick={() => navigate('/rent')} className="bg-white p-6 rounded-xl shadow-sm border border-orange-50 flex gap-5 items-start hover:shadow-xl transition-all cursor-pointer group animate-fade-in-up delay-500 hover:-translate-y-1">
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          <Key size={32} strokeWidth={1.5} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors">Buy a commercial / Agricultural property</h3>
                          <p className="text-slate-500 text-sm mb-3 leading-relaxed">Discover your perfect commercial or agricultural property. We connect you with the best options in the market.</p>
                          <span className="text-yellow-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Find a property <ArrowRight size={16}/></span>
                      </div>
                  </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 relative hidden lg:block animate-fade-in-up delay-200">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[800px] w-full">
                    <img 
                      src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000&auto=format&fit=crop" 
                      alt="Real Estate Services" 
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};