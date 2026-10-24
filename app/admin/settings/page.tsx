
import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { SiteSettings } from '../../../types';
import { DEFAULT_SETTINGS } from '../../../constants';
import { Save, Database, Copy, Check, AlertTriangle, Upload } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       try {
         const base64 = await fileToBase64(e.target.files[0]);
         setSettings({ ...settings, logoUrl: base64 });
       } catch(err) {
         console.error(err);
       }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.saveSettings(settings);
    setMessage('Settings saved successfully!');
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

   const sqlScript = `-- FIX FOR ERROR: "Could not find the 'logo_url' column" (PGRST204)
-- Run this entire block in Supabase SQL Editor

-- 1. Add the missing logo_url column
alter table site_settings add column if not exists logo_url text;

-- 1b. Add the missing secondary_phone column (for 2nd mobile number)
alter table site_settings add column if not exists secondary_phone text;

-- 2. Refresh the Schema Cache (Critical for Supabase to see the new column)
NOTIFY pgrst, 'reload config';

-- ---------------------------------------------------------
-- OTHER COLUMNS (Run if you see other missing column errors)
alter table properties add column if not exists custom_id text;
alter table properties add column if not exists overview text;
alter table properties add column if not exists amenities text[];
alter table properties add column if not exists specifications jsonb;
alter table properties add column if not exists location_highlights text[];

-- PERMISSIONS (Run if data is not saving/loading)
alter table site_settings disable row level security;
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Site Configuration</h2>


      <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
         {/* Logo Upload Section */}
         <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
            <div className="flex items-center gap-6">
               <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                       <Upload size={24} />
                       <span className="text-xs mt-1">Logo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-700 mb-1">Website Logo</h3>
                  <p className="text-sm text-slate-500 mb-4">Upload your company logo (PNG/JPG). It will appear in the header and footer.</p>
                  <label className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-50">
                     Choose File
                     <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
               <input className="w-full border p-2 rounded" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Tagline</label>
               <input className="w-full border p-2 rounded" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Phone</label>
               <input className="w-full border p-2 rounded" value={settings.primaryPhone} onChange={e => setSettings({...settings, primaryPhone: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Secondary Phone</label>
               <input className="w-full border p-2 rounded" value={settings.secondaryPhone || ''} onChange={e => setSettings({...settings, secondaryPhone: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Email</label>
               <input className="w-full border p-2 rounded" value={settings.primaryEmail} onChange={e => setSettings({...settings, primaryEmail: e.target.value})} />
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
               <input className="w-full border p-2 rounded" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
               <input className="w-full border p-2 rounded" value={settings.city} onChange={e => setSettings({...settings, city: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">State</label>
               <input className="w-full border p-2 rounded" value={settings.state} onChange={e => setSettings({...settings, state: e.target.value})} />
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-semibold text-slate-700 mb-1">About Us Content</label>
               <textarea rows={5} className="w-full border p-2 rounded" value={settings.aboutUsContent} onChange={e => setSettings({...settings, aboutUsContent: e.target.value})}></textarea>
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Facebook URL</label>
               <input className="w-full border p-2 rounded" value={settings.facebookUrl || ''} onChange={e => setSettings({...settings, facebookUrl: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Instagram URL</label>
               <input className="w-full border p-2 rounded" value={settings.instagramUrl || ''} onChange={e => setSettings({...settings, instagramUrl: e.target.value})} />
            </div>
         </div>

         <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <span className="text-green-600 font-semibold">{message}</span>
            <button type="submit" disabled={loading} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">
               <Save size={18} /> Save Settings
            </button>
         </div>
      </form>
    </div>
  );
};
