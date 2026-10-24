
import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { AdBanner, AdPosition } from '../../../types';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';

export const AdminAds: React.FC = () => {
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAd, setCurrentAd] = useState<Partial<AdBanner>>({});
  const [loading, setLoading] = useState(false);

  const fetchAds = async () => {
    const res = await api.getAds();
    setAds(res);
  };

  useEffect(() => {
    fetchAds();
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       try {
         const base64 = await fileToBase64(e.target.files[0]);
         setCurrentAd({ ...currentAd, imageUrl: base64 });
       } catch(err) {
         console.error(err);
       }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newAd: AdBanner = {
      // IMPORTANT: Pass empty string for new IDs so DB generates UUID
      id: currentAd.id || '',
      title: currentAd.title || 'Untitled Ad',
      position: currentAd.position || AdPosition.HOME_HERO,
      imageUrl: currentAd.imageUrl || '',
      linkUrl: currentAd.linkUrl || '',
      isActive: currentAd.isActive ?? true,
      sortOrder: currentAd.sortOrder || 0,
    };
    await api.saveAd(newAd);
    await fetchAds();
    setIsEditing(false);
    setCurrentAd({});
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this ad?')) {
      await api.deleteAd(id);
      fetchAds();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{currentAd.id ? 'Edit Ad' : 'Add New Ad'}</h2>
        <form onSubmit={handleSave} className="space-y-6">
           <div>
              <label className="block text-sm font-semibold mb-1">Ad Title</label>
              <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-400 outline-none" value={currentAd.title || ''} onChange={e => setCurrentAd({...currentAd, title: e.target.value})} />
           </div>
           
           <div>
              <label className="block text-sm font-semibold mb-1">Position</label>
              <select className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-400 outline-none bg-white" value={currentAd.position} onChange={e => setCurrentAd({...currentAd, position: e.target.value as AdPosition})}>
                 {Object.values(AdPosition).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
           </div>

           <div>
              <label className="block text-sm font-semibold mb-1">Ad Image</label>
              <div className="w-full h-48 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
                  {currentAd.imageUrl ? (
                    <img src={currentAd.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                       <Upload size={24} />
                       <span className="text-xs mt-1">Upload Banner</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {currentAd.imageUrl && (
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold">
                      Change Image
                    </div>
                  )}
              </div>
           </div>

           <div>
              <label className="block text-sm font-semibold mb-1">Link URL (Optional)</label>
              <input className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-400 outline-none" value={currentAd.linkUrl || ''} onChange={e => setCurrentAd({...currentAd, linkUrl: e.target.value})} placeholder="e.g. /contact-us" />
           </div>

           <div className="flex gap-6">
              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                <input type="checkbox" checked={currentAd.isActive ?? true} onChange={e => setCurrentAd({...currentAd, isActive: e.target.checked})} className="w-5 h-5 accent-yellow-500" />
                Is Active
              </label>
           </div>

           <div className="flex justify-end gap-4 pt-4 border-t">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 font-bold disabled:bg-slate-500">
                {loading ? 'Saving...' : 'Save Ad'}
              </button>
           </div>
        </form>
      </div>
    );
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Manage Advertisements</h2>
        <button 
          onClick={() => { setCurrentAd({ position: AdPosition.HOME_HERO }); setIsEditing(true); }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Ad
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
               <tr>
                 <th className="p-4">Preview</th>
                 <th className="p-4">Title</th>
                 <th className="p-4">Position</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {ads.map(ad => (
                 <tr key={ad.id} className="hover:bg-slate-50">
                    <td className="p-4"><img src={ad.imageUrl} className="w-24 h-12 object-cover rounded bg-slate-200" alt="Ad" /></td>
                    <td className="p-4 font-medium">{ad.title}</td>
                    <td className="p-4">{ad.position}</td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${ad.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                       </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                       <button onClick={() => { setCurrentAd(ad); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-slate-200 rounded"><Edit size={16}/></button>
                       <button onClick={() => handleDelete(ad.id)} className="p-2 text-red-600 hover:bg-slate-200 rounded"><Trash2 size={16}/></button>
                    </td>
                 </tr>
               ))}
               {ads.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No ads found.</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};
