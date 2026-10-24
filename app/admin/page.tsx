import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Property, ContactEnquiry } from '../../types';
import { Home, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, sale: 0, rent: 0, enquiries: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState<ContactEnquiry[]>([]);

  useEffect(() => {
    const load = async () => {
      const props = await api.getProperties();
      const enqs = await api.getEnquiries();
      setStats({
        total: props.length,
        sale: props.filter(p => p.listingType === 'SALE').length,
        rent: props.filter(p => p.listingType === 'RENT').length,
        enquiries: enqs.length
      });
      setRecentEnquiries(enqs.slice(0, 5));
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Properties', val: stats.total, icon: Home, color: 'bg-blue-500' },
    { label: 'For Sale', val: stats.sale, icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'For Rent', val: stats.rent, icon: ShoppingBag, color: 'bg-purple-500' },
    { label: 'Total Enquiries', val: stats.enquiries, icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${c.color} text-white flex items-center justify-center shadow-md`}>
              <c.icon size={24} />
            </div>
            <div>
              <div className="text-slate-500 text-sm font-medium">{c.label}</div>
              <div className="text-2xl font-bold text-slate-800">{c.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Recent Enquiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 uppercase text-xs font-semibold text-slate-500">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEnquiries.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="p-4">{e.date}</td>
                  <td className="p-4 font-medium text-slate-800">{e.name}</td>
                  <td className="p-4">{e.phone}</td>
                  <td className="p-4 truncate max-w-xs" title={e.message}>{e.message}</td>
                  <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">New</span></td>
                </tr>
              ))}
              {recentEnquiries.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center">No enquiries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};