import React, { useState, useEffect } from 'react';
import { Home, User, Phone, Mail, MapPin, DollarSign, Calendar, Eye, Trash2, CheckCircle, XCircle, Building2, Search, Filter } from 'lucide-react';
import { api } from '../../../services/api';
import { SaleListing } from '../../../types';

export const AdminSaleListings: React.FC = () => {
  const [listings, setListings] = useState<SaleListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<SaleListing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed'>('all');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    const data = await api.getSaleListings();
    setListings(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await api.deleteSaleListing(id);
      loadListings();
    }
  };

  const toggleReviewed = async (id: string) => {
    await api.toggleSaleListingStatus(id);
    loadListings();
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'reviewed' && listing.isReviewed) ||
                         (statusFilter === 'pending' && !listing.isReviewed);
    return matchesSearch && matchesStatus;
  });

  const pendingCount = listings.filter(l => !l.isReviewed).length;
  const reviewedCount = listings.filter(l => l.isReviewed).length;

  if (selectedListing) {
    return (
      <div className="animate-fade-in-up">
        <button
          onClick={() => setSelectedListing(null)}
          className="mb-6 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          ← Back to Listings
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{selectedListing.propertyTitle}</h2>
                  <p className="text-slate-500 text-sm">{selectedListing.propertyType}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleReviewed(selectedListing.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedListing.isReviewed
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {selectedListing.isReviewed ? 'Mark as Pending' : 'Mark as Reviewed'}
              </button>
              <button
                onClick={() => handleDelete(selectedListing.id)}
                className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>

          {/* Owner Information */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-purple-600" />
              Owner Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Name</p>
                  <p className="font-semibold text-slate-800">{selectedListing.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Phone</p>
                  <a href={`tel:${selectedListing.phone}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedListing.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                  <a href={`mailto:${selectedListing.email}`} className="font-semibold text-green-600 hover:underline">
                    {selectedListing.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Building2 size={18} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Ownership Type</p>
                  <p className="font-semibold text-slate-800">{selectedListing.ownershipType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              Property Details
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <MapPin size={20} className="text-purple-600 mb-2" />
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Location</p>
                <p className="font-bold text-slate-800">{selectedListing.location}</p>
                <p className="text-sm text-slate-600">{selectedListing.city}, {selectedListing.state}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <DollarSign size={20} className="text-green-600 mb-2" />
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Expected Price</p>
                <p className="font-bold text-2xl text-green-600">₹{Number(selectedListing.price).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                <Home size={20} className="text-orange-600 mb-2" />
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Area</p>
                <p className="font-bold text-2xl text-orange-600">{selectedListing.areaSqft} sq ft</p>
              </div>
              {selectedListing.bedrooms && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Bedrooms</p>
                  <p className="font-bold text-xl text-slate-800">{selectedListing.bedrooms}</p>
                </div>
              )}
              {selectedListing.bathrooms && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Bathrooms</p>
                  <p className="font-bold text-xl text-slate-800">{selectedListing.bathrooms}</p>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Submitted</p>
                <p className="font-semibold text-slate-800">{new Date(selectedListing.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {selectedListing.description && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Description</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedListing.description}</p>
              </div>
            </div>
          )}

          {/* Image */}
          {selectedListing.imageUrl && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Property Image</h3>
              <div className="relative group rounded-xl overflow-hidden shadow-lg max-w-2xl">
                <img src={selectedListing.imageUrl} alt="Property" className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-semibold">{selectedListing.propertyTitle}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-800 mb-2">Sale Listings</h1>
        <p className="text-slate-600">Manage property submissions from users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <span className="text-3xl font-black">{listings.length}</span>
          </div>
          <p className="font-semibold">Total Listings</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <span className="text-3xl font-black">{pendingCount}</span>
          </div>
          <p className="font-semibold">Pending Review</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <span className="text-3xl font-black">{reviewedCount}</span>
          </div>
          <p className="font-semibold">Reviewed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by property name, owner, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('reviewed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                statusFilter === 'reviewed' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Reviewed
            </button>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading listings...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">No sale listings found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{listing.propertyTitle}</p>
                        <p className="text-sm text-slate-500">{listing.propertyType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{listing.name}</p>
                        <p className="text-sm text-slate-500">{listing.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{listing.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-600">₹{Number(listing.price).toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-6 py-4">
                      {listing.isReviewed ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                          <CheckCircle size={14} /> Reviewed
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                          <Calendar size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-1"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
