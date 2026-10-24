import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { ContactEnquiry } from '../../../types';
import { Eye, X, Phone, Mail, MapPin, Calendar, FileText, Home, CheckCircle, XCircle } from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  const fetchEnqs = async () => {
    const res = await api.getEnquiries();
    setEnquiries(res);
  };

  useEffect(() => {
    fetchEnqs();
  }, []);

  const toggleStatus = async (id: string) => {
    await api.toggleEnquiryStatus(id);
    fetchEnqs();
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, isHandled: !selectedEnquiry.isHandled });
    }
  };

  // Detail View Modal
  if (selectedEnquiry) {
    return (
      <div className="animate-fade-in-up">
        <button
          onClick={() => setSelectedEnquiry(null)}
          className="mb-6 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          ← Back to Enquiries
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedEnquiry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{selectedEnquiry.name}</h2>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <Calendar size={14} />
                    {selectedEnquiry.date}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleStatus(selectedEnquiry.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedEnquiry.isHandled
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {selectedEnquiry.isHandled ? 'Mark as New' : 'Mark as Handled'}
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Phone size={20} className="text-blue-600" />
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Phone</p>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-green-600 hover:underline break-all">
                    {selectedEnquiry.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Source & Property */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-purple-600" />
              Enquiry Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Source Page</p>
                <p className="font-bold text-xl text-purple-600">{selectedEnquiry.sourcePage}</p>
              </div>
              {selectedEnquiry.propertyTitle && (
                <div 
                  onClick={() => {
                    if (selectedEnquiry.propertySlug) {
                      window.location.hash = `#/property/${selectedEnquiry.propertySlug}`;
                    }
                  }}
                  className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100 cursor-pointer hover:shadow-lg transition-all"
                >
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1">
                    <Home size={14} /> Property Interest
                  </p>
                  <p className="font-bold text-slate-800 hover:text-orange-600 transition-colors">{selectedEnquiry.propertyTitle}</p>
                  {selectedEnquiry.propertySlug && (
                    <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                      Click to view property →
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-green-600" />
              Message
            </h3>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                {selectedEnquiry.message}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200">
            {selectedEnquiry.isHandled ? (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold">
                <CheckCircle size={20} /> Marked as Handled
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-6 py-3 rounded-full font-bold">
                <XCircle size={20} /> Pending Response
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-800 mb-2">Customer Enquiries</h1>
        <p className="text-slate-600">Manage and respond to customer inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <span className="text-3xl font-black">{enquiries.length}</span>
          </div>
          <p className="font-semibold">Total Enquiries</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <XCircle size={24} />
            </div>
            <span className="text-3xl font-black">{enquiries.filter(e => !e.isHandled).length}</span>
          </div>
          <p className="font-semibold">Pending</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <span className="text-3xl font-black">{enquiries.filter(e => e.isHandled).length}</span>
          </div>
          <p className="font-semibold">Handled</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Name / Contact</th>
                <th className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Message</th>
                <th className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Source</th>
                <th className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map(e => (
                <tr key={e.id} className={`hover:bg-slate-50 transition-colors ${e.isHandled ? 'bg-slate-50/50' : 'bg-white'}`}>
                  <td className="p-4 whitespace-nowrap text-slate-500">{e.date}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{e.name}</div>
                    <div className="text-xs">{e.phone}</div>
                    <div className="text-xs">{e.email}</div>
                  </td>
                  <td className="p-4 max-w-xs truncate" title={e.message}>{e.message}</td>
                  <td className="p-4">
                    <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">{e.sourcePage}</span>
                    {e.propertyTitle && <div className="text-xs text-blue-600 mt-1 truncate max-w-[150px]" title={e.propertyTitle}>{e.propertyTitle}</div>}
                  </td>
                  <td className="p-4">
                    {e.isHandled ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <CheckCircle size={14} /> Handled
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <XCircle size={14} /> New
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setSelectedEnquiry(e)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-1"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button 
                        onClick={() => toggleStatus(e.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          e.isHandled 
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {e.isHandled ? 'New' : 'Handle'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-semibold">No enquiries found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};