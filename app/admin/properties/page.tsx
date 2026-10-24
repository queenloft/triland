
import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Property, ListingType, PropertyCategory, PropertyStatus } from '../../../types';
import { Plus, Edit, Trash2, Upload, X, List, CheckSquare, Type, Star, Map, CheckCircle, Eye } from 'lucide-react';

export const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProp, setCurrentProp] = useState<Partial<Property>>({});
  const [loading, setLoading] = useState(false);
  const [fetchingProperties, setFetchingProperties] = useState(true);
  
  // Temporary State for Specification Key-Value Inputs
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const fetchProps = async () => {
    setFetchingProperties(true);
    const res = await api.getProperties();
    setProperties(res);
    setFetchingProperties(false);
  };

  useEffect(() => {
    fetchProps();
  }, []);

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setCurrentProp({ ...currentProp, mainImageUrl: base64 });
      } catch (err) {
        console.error("Error uploading image", err);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const files = Array.from(e.target.files);
        const promises = files.map(file => fileToBase64(file));
        const base64Strings = await Promise.all(promises);
        
        setCurrentProp(prev => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), ...base64Strings]
        }));
      } catch (err) {
        console.error("Error uploading gallery images", err);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setCurrentProp(prev => {
      const newGallery = [...(prev.galleryImages || [])];
      newGallery.splice(index, 1);
      return { ...prev, galleryImages: newGallery };
    });
  };

  // Specs Management
  const addSpec = () => {
    if (specKey && specValue) {
        setCurrentProp(prev => ({
            ...prev,
            specifications: { ...(prev.specifications || {}), [specKey]: specValue }
        }));
        setSpecKey('');
        setSpecValue('');
    }
  };
  const removeSpec = (key: string) => {
    const newSpecs = { ...(currentProp.specifications || {}) };
    delete newSpecs[key];
    setCurrentProp({ ...currentProp, specifications: newSpecs });
  };

  // Amenities Management
  const COMMON_AMENITIES = ['Swimming Pool', 'Gym', 'Smart Home', '24/7 Security', 'Power Backup', 'Lift', 'Parking', 'Clubhouse', 'Garden', 'Wifi'];
  const toggleAmenity = (am: string) => {
     const current = currentProp.amenities || [];
     if (current.includes(am)) {
         setCurrentProp({ ...currentProp, amenities: current.filter(a => a !== am) });
     } else {
         setCurrentProp({ ...currentProp, amenities: [...current, am] });
     }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const title = currentProp.title || 'Untitled';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `property-${Date.now()}`;

    const newProp: Property = {
      id: currentProp.id || '',
      customId: currentProp.customId || '',
      title: title,
      slug: slug,
      listingType: currentProp.listingType || ListingType.SALE,
      category: currentProp.category || PropertyCategory.APARTMENT,
      isLand: currentProp.isLand || false,
      price: Number(currentProp.price) || 0,
      currency: 'INR',
      location: currentProp.location || '',
      city: currentProp.city || '',
      state: currentProp.state || '',
      areaSqft: Number(currentProp.areaSqft) || 0,
      bedrooms: Number(currentProp.bedrooms) || 0,
      bathrooms: Number(currentProp.bathrooms) || 0,
      status: currentProp.status || PropertyStatus.AVAILABLE,
      description: currentProp.description || '',
      overview: currentProp.overview || '',
      amenities: currentProp.amenities || [],
      specifications: currentProp.specifications || {},
      locationHighlights: typeof currentProp.locationHighlights === 'string' 
        ? (currentProp.locationHighlights as string).split('\n').filter(l => l.trim() !== '') 
        : (currentProp.locationHighlights || []),
      youtubeUrl: currentProp.youtubeUrl || '',
      mainImageUrl: currentProp.mainImageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
      galleryImages: currentProp.galleryImages || [],
      isFeatured: currentProp.isFeatured || false,
      createdAt: currentProp.createdAt || new Date().toISOString().split('T')[0]
    };

    await api.saveProperty(newProp);
    await fetchProps();
    setIsEditing(false);
    setCurrentProp({});
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await api.deleteProperty(id);
      fetchProps();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{currentProp.id ? 'Edit Property' : 'Add New Property'}</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Basic Info */}
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Type size={18}/> Basic Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input required className="w-full border p-2 rounded" value={currentProp.title || ''} onChange={e => setCurrentProp({...currentProp, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Custom Property ID (e.g. LUX-001)</label>
                  <input className="w-full border p-2 rounded uppercase" value={currentProp.customId || ''} onChange={e => setCurrentProp({...currentProp, customId: e.target.value})} />
                </div>
             </div>
             
             {/* New Flags Section */}
             <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-slate-200/60">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer hover:bg-white p-2 rounded transition-colors select-none">
                      <input 
                        type="checkbox" 
                        checked={currentProp.isFeatured || false} 
                        onChange={e => setCurrentProp({...currentProp, isFeatured: e.target.checked})} 
                        className="w-5 h-5 accent-yellow-500 rounded focus:ring-yellow-500" 
                      />
                      <div className="flex items-center gap-1"><Star size={16} className={currentProp.isFeatured ? "fill-yellow-500 text-yellow-500" : "text-slate-400"}/> Mark as Featured</div>
                  </label>
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer hover:bg-white p-2 rounded transition-colors select-none">
                      <input 
                        type="checkbox" 
                        checked={currentProp.isLand || false} 
                        onChange={e => setCurrentProp({...currentProp, isLand: e.target.checked})} 
                        className="w-5 h-5 accent-yellow-500 rounded focus:ring-yellow-500" 
                      />
                      <div className="flex items-center gap-1"><Map size={16} className={currentProp.isLand ? "text-green-600" : "text-slate-400"}/> Is Land / Plot</div>
                  </label>
             </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
             <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select className="w-full border p-2 rounded bg-white" value={currentProp.listingType || 'SALE'} onChange={e => setCurrentProp({...currentProp, listingType: e.target.value as ListingType})}>
                  <option value="SALE">Sale</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select className="w-full border p-2 rounded bg-white" value={currentProp.category || 'APARTMENT'} onChange={e => setCurrentProp({...currentProp, category: e.target.value as PropertyCategory})}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
             </div>
             <div>
               <label className="block text-sm font-semibold mb-1">Price</label>
               <input required type="number" className="w-full border p-2 rounded" value={currentProp.price || ''} onChange={e => setCurrentProp({...currentProp, price: Number(e.target.value)})} />
             </div>
             <div>
               <label className="block text-sm font-semibold mb-1">Area (Sqft)</label>
               <input type="number" className="w-full border p-2 rounded" value={currentProp.areaSqft || ''} onChange={e => setCurrentProp({...currentProp, areaSqft: Number(e.target.value)})} />
             </div>
          </div>

          {/* Location */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold mb-1">Location (Area)</label>
                <input required className="w-full border p-2 rounded" value={currentProp.location || ''} onChange={e => setCurrentProp({...currentProp, location: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input required className="w-full border p-2 rounded" value={currentProp.city || ''} onChange={e => setCurrentProp({...currentProp, city: e.target.value})} />
             </div>
          </div>

          {/* Features */}
          {!currentProp.isLand && (
             <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-semibold mb-1">Bedrooms</label>
                   <input type="number" className="w-full border p-2 rounded" value={currentProp.bedrooms || ''} onChange={e => setCurrentProp({...currentProp, bedrooms: Number(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-sm font-semibold mb-1">Bathrooms</label>
                   <input type="number" className="w-full border p-2 rounded" value={currentProp.bathrooms || ''} onChange={e => setCurrentProp({...currentProp, bathrooms: Number(e.target.value)})} />
                </div>
             </div>
          )}

          {/* Luxury Content: Overview & Description */}
          <div className="col-span-2">
             <label className="block text-sm font-semibold mb-1">Lifestyle Overview (Short Summary)</label>
             <textarea className="w-full border p-2 rounded h-20" value={currentProp.overview || ''} onChange={e => setCurrentProp({...currentProp, overview: e.target.value})} placeholder="A short, catchy summary of the lifestyle..."></textarea>
          </div>

          <div className="col-span-2">
             <label className="block text-sm font-semibold mb-1">Detailed Description</label>
             <textarea className="w-full border p-2 rounded h-32" value={currentProp.description || ''} onChange={e => setCurrentProp({...currentProp, description: e.target.value})}></textarea>
          </div>

          {/* Amenities Checkbox */}
          <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><CheckSquare size={18}/> Amenities</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COMMON_AMENITIES.map(am => (
                  <label key={am} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={(currentProp.amenities || []).includes(am)} onChange={() => toggleAmenity(am)} className="accent-yellow-500" />
                    {am}
                  </label>
                ))}
             </div>
             <div className="mt-2">
               <input 
                  placeholder="Add custom amenity (Press Enter)" 
                  className="w-full text-sm p-2 border rounded"
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value;
                        if (val) toggleAmenity(val);
                        e.currentTarget.value = '';
                     }
                  }}
               />
             </div>
          </div>

          {/* Specifications */}
          <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><List size={18}/> Specifications</h3>
             <div className="flex gap-2 mb-2">
                <input placeholder="Feature (e.g. Flooring)" className="flex-1 border p-2 rounded text-sm" value={specKey} onChange={e => setSpecKey(e.target.value)} />
                <input placeholder="Detail (e.g. Italian Marble)" className="flex-1 border p-2 rounded text-sm" value={specValue} onChange={e => setSpecValue(e.target.value)} />
                <button type="button" onClick={addSpec} className="bg-slate-800 text-white px-4 rounded text-sm">Add</button>
             </div>
             <div className="space-y-1">
                {Object.entries(currentProp.specifications || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between bg-white p-2 rounded border border-gray-200 text-sm">
                     <span className="font-semibold">{k}: <span className="font-normal text-slate-600">{v as string}</span></span>
                     <button type="button" onClick={() => removeSpec(k)} className="text-red-500"><X size={14}/></button>
                  </div>
                ))}
             </div>
          </div>

          {/* Location Highlights */}
          <div className="col-span-2">
             <label className="block text-sm font-semibold mb-1">Location Highlights (One per line)</label>
             <textarea 
               className="w-full border p-2 rounded h-24" 
               value={Array.isArray(currentProp.locationHighlights) ? currentProp.locationHighlights.join('\n') : currentProp.locationHighlights} 
               onChange={e => setCurrentProp({...currentProp, locationHighlights: e.target.value.split('\n')})}
               placeholder="5 mins to Metro&#10;Near International School"
             ></textarea>
          </div>

          {/* YouTube URL */}
          <div className="col-span-2">
             <label className="block text-sm font-semibold mb-1">YouTube Video URL (Optional)</label>
             <input 
               type="url" 
               className="w-full border p-2 rounded" 
               value={currentProp.youtubeUrl || ''} 
               onChange={e => setCurrentProp({...currentProp, youtubeUrl: e.target.value})}
               placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
             />
             <p className="text-xs text-slate-500 mt-1">Add a YouTube video URL to show a video tour of the property</p>
          </div>

          {/* Images */}
          <div className="col-span-2">
             <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
               <Upload size={18} className="text-purple-600" />
               Main Property Image
             </label>
             
             {!currentProp.mainImageUrl ? (
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-purple-400 transition-all bg-slate-50 cursor-pointer group">
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleMainImageUpload} 
                   className="hidden" 
                   id="main-image-upload"
                 />
                 <label htmlFor="main-image-upload" className="cursor-pointer">
                   <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Upload className="text-purple-600" size={36} />
                   </div>
                   <p className="text-slate-700 font-semibold mb-1">Click to upload main image</p>
                   <p className="text-sm text-slate-500">PNG, JPG, JPEG up to 10MB</p>
                 </label>
               </div>
             ) : (
               <div className="relative rounded-xl overflow-hidden shadow-lg group">
                 <img src={currentProp.mainImageUrl} className="w-full h-64 object-cover" alt="Main" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                     <label htmlFor="main-image-upload" className="flex-1 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold text-center cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                       <Upload size={16} /> Change
                     </label>
                     <input 
                       type="file" 
                       accept="image/*" 
                       onChange={handleMainImageUpload} 
                       className="hidden" 
                       id="main-image-upload"
                     />
                     <button 
                       type="button" 
                       onClick={() => setCurrentProp({...currentProp, mainImageUrl: ''})}
                       className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                     >
                       <X size={16} /> Remove
                     </button>
                   </div>
                 </div>
                 <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                   <CheckCircle size={14} /> Main Image
                 </div>
               </div>
             )}
          </div>
          
          <div className="col-span-2">
             <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
               <Upload size={18} className="text-blue-600" />
               Gallery Images ({currentProp.galleryImages?.length || 0})
             </label>
             
             <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all bg-slate-50 cursor-pointer mb-4">
               <input 
                 type="file" 
                 accept="image/*" 
                 multiple 
                 onChange={handleGalleryUpload} 
                 className="hidden" 
                 id="gallery-upload"
               />
               <label htmlFor="gallery-upload" className="cursor-pointer">
                 <div className="flex items-center justify-center gap-3 text-slate-700">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                     <Upload className="text-blue-600" size={24} />
                   </div>
                   <div className="text-left">
                     <p className="font-semibold">Add Gallery Images</p>
                     <p className="text-sm text-slate-500">Click to select multiple images</p>
                   </div>
                 </div>
               </label>
             </div>

             {currentProp.galleryImages && currentProp.galleryImages.length > 0 && (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentProp.galleryImages.map((img, i) => (
                     <div key={i} className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                        <img src={img} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" alt={`Gallery ${i + 1}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button" 
                            onClick={() => removeGalleryImage(i)} 
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X size={14}/>
                          </button>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-900 text-center">
                              Image {i + 1}
                            </div>
                          </div>
                        </div>
                     </div>
                  ))}
               </div>
             )}
          </div>

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-4 mt-4 border-t pt-6">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded text-slate-600 hover:bg-slate-100 font-semibold">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 font-bold disabled:bg-slate-500 flex items-center gap-2">
              {loading ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Manage Properties</h2>
        <button 
          onClick={() => { setCurrentProp({}); setIsEditing(true); }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Property
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fetchingProperties ? (
                // Skeleton loader
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded bg-slate-200"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded w-20"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-6 bg-slate-200 rounded w-16"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-28"></div>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <div className="h-8 w-8 bg-slate-200 rounded"></div>
                      <div className="h-8 w-8 bg-slate-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden">
                          <img src={p.mainImageUrl} className="w-full h-full object-cover" alt="Prop" />
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                         {p.title}
                         {p.customId && <div className="text-xs text-slate-400 mt-0.5">{p.customId}</div>}
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-blue-100 text-blue-700">{p.listingType}</span>
                      </td>
                      <td className="p-4">₹ {p.price.toLocaleString()}</td>
                      <td className="p-4">{p.location}, {p.city}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => window.open(`#/property/${p.slug}`, '_blank')} className="p-2 hover:bg-slate-200 rounded text-green-600" title="View Property"><Eye size={16}/></button>
                        <button onClick={() => { setCurrentProp(p); setIsEditing(true); }} className="p-2 hover:bg-slate-200 rounded text-blue-600" title="Edit"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-slate-200 rounded text-red-600" title="Delete"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {properties.length === 0 && (
                     <tr><td colSpan={6} className="p-8 text-center text-slate-500">No properties found. Click 'Add Property' to create one.</td></tr>
                  )}
                </>
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
};
