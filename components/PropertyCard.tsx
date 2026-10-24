import React from 'react';
import { Property, ListingType } from '../types';
import { MapPin, BedDouble, Bath, Square, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick: (slug: string) => void;
  index?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, index = 0 }) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} L`;
    return `₹ ${price.toLocaleString()}`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer flex flex-col h-full animate-fade-in-up hover:-translate-y-2"
      onClick={() => onClick(property.slug)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={property.mainImageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
            property.listingType === ListingType.SALE ? 'bg-blue-600' : 'bg-emerald-600'
          }`}>
            For {property.listingType}
          </span>
        </div>
        {property.isLand && (
           <div className="absolute top-4 right-4">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
              Land
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
            <span className="text-white font-bold text-lg tracking-wide shadow-black drop-shadow-md">
              {formatPrice(property.price)}
            </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-yellow-600 transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={16} className="mr-1 text-yellow-500 flex-shrink-0" />
          <span className="truncate">{property.location}, {property.city}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <Square size={18} className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-600">{property.areaSqft} sqft</span>
          </div>
          {!property.isLand && (
            <>
              <div className="flex flex-col items-center justify-center text-center border-l border-gray-100">
                <BedDouble size={18} className="text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600">{property.bedrooms} Beds</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-l border-gray-100">
                <Bath size={18} className="text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600">{property.bathrooms} Baths</span>
              </div>
            </>
          )}
          {property.isLand && (
             <div className="col-span-2 flex flex-col items-center justify-center text-center border-l border-gray-100">
                <span className="text-xs text-slate-500">Type</span>
                <span className="text-xs font-semibold text-slate-600">{property.category}</span>
             </div>
          )}
        </div>
        
        <button className="w-full mt-4 bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-medium py-2 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 group-hover:bg-yellow-500 group-hover:text-slate-900">
          View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};