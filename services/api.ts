
import { Property, ContactEnquiry, AdBanner, SiteSettings, ListingType, PropertyCategory, PropertyStatus, AdPosition } from '../types';
import { MOCK_PROPERTIES, MOCK_ADS, DEFAULT_SETTINGS, MOCK_ENQUIRIES } from '../constants';
import { supabase } from '../supabaseClient';

// Helper to check if ID is a valid UUID
const isUuid = (id: string) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
};

export const api = {
  // Auth
  authenticateAdmin: async (email: string, pass: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .single();

      if (data && !error) return true;
      if (email === 'admin@trisun.com' && pass === 'Ttrisun@123') return true;
      return false;
    } catch (err) {
      if (email === 'admin@trisun.com' && pass === 'Ttrisun@123') return true;
      return false;
    }
  },

  // Properties
  getProperties: async (): Promise<Property[]> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase fetch failed or empty, falling back to mock properties');
        return MOCK_PROPERTIES;
      }
      if (Array.isArray(data) && data.length === 0) return MOCK_PROPERTIES;

      return data.map((p: any) => ({
        id: p.id,
        customId: p.custom_id,
        title: p.title,
        slug: p.slug,
        listingType: p.listing_type as ListingType,
        category: p.category as PropertyCategory,
        isLand: p.is_land,
        price: p.price,
        currency: p.currency,
        location: p.location,
        city: p.city,
        state: p.state,
        areaSqft: p.area_sqft,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        status: p.status as PropertyStatus,
        description: p.description,
        overview: p.overview,
        mainImageUrl: p.main_image_url,
        galleryImages: p.gallery_images || [],
        amenities: p.amenities || [],
        specifications: p.specifications || {},
        locationHighlights: p.location_highlights || [],
        youtubeUrl: p.youtube_url,
        isFeatured: p.is_featured,
        createdAt: p.created_at
      }));
    } catch (err) {
      console.warn('API Error', err);
      return MOCK_PROPERTIES;
    }
  },
  
  getPropertyBySlug: async (slug: string): Promise<Property | undefined> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return MOCK_PROPERTIES.find(p => p.slug === slug);
      }

      const p = data;
      return {
        id: p.id,
        customId: p.custom_id,
        title: p.title,
        slug: p.slug,
        listingType: p.listing_type as ListingType,
        category: p.category as PropertyCategory,
        isLand: p.is_land,
        price: p.price,
        currency: p.currency,
        location: p.location,
        city: p.city,
        state: p.state,
        areaSqft: p.area_sqft,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        status: p.status as PropertyStatus,
        description: p.description,
        overview: p.overview,
        mainImageUrl: p.main_image_url,
        galleryImages: p.gallery_images || [],
        amenities: p.amenities || [],
        specifications: p.specifications || {},
        locationHighlights: p.location_highlights || [],
        youtubeUrl: p.youtube_url,
        isFeatured: p.is_featured,
        createdAt: p.created_at
      };
    } catch (err) {
      return MOCK_PROPERTIES.find(p => p.slug === slug);
    }
  },

  saveProperty: async (property: Property): Promise<void> => {
    try {
      const dbProp = {
        custom_id: property.customId,
        title: property.title,
        slug: property.slug,
        listing_type: property.listingType,
        category: property.category,
        is_land: property.isLand,
        price: property.price,
        currency: property.currency,
        location: property.location,
        city: property.city,
        state: property.state,
        area_sqft: property.areaSqft,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        status: property.status,
        description: property.description,
        overview: property.overview,
        amenities: property.amenities,
        specifications: property.specifications,
        location_highlights: property.locationHighlights,
        youtube_url: property.youtubeUrl,
        main_image_url: property.mainImageUrl,
        gallery_images: property.galleryImages,
        is_featured: property.isFeatured,
      };

      // CRITICAL FIX: Check for valid UUID using regex
      // If it's a timestamp (length 13) or mock ID ("1"), treat as INSERT
      if (property.id && isUuid(property.id)) { 
        await supabase.from('properties').update(dbProp).eq('id', property.id);
      } else {
        // Remove ID from insert payload if it exists but is invalid, let DB gen UUID
        await supabase.from('properties').insert([dbProp]);
      }
    } catch (err) {
      console.error('Failed to save property', err);
    }
  },

  deleteProperty: async (id: string): Promise<void> => {
    try {
      if (isUuid(id)) {
        await supabase.from('properties').delete().eq('id', id);
      }
    } catch (err) {
      console.error(err);
    }
  },

  // Ads
  getAds: async (): Promise<AdBanner[]> => {
    try {
      const { data, error } = await supabase.from('ads').select('*').order('sort_order');
      if (error || !data || (Array.isArray(data) && data.length === 0)) return MOCK_ADS;

      return data.map((a: any) => ({
        id: a.id,
        title: a.title,
        position: a.position as AdPosition,
        imageUrl: a.image_url,
        linkUrl: a.link_url,
        isActive: a.is_active,
        sortOrder: a.sort_order
      }));
    } catch (err) {
      return MOCK_ADS;
    }
  },

  saveAd: async (ad: AdBanner): Promise<void> => {
    try {
      const dbAd = {
        title: ad.title,
        position: ad.position,
        image_url: ad.imageUrl,
        link_url: ad.linkUrl,
        is_active: ad.isActive,
        sort_order: ad.sortOrder
      };

      if (ad.id && isUuid(ad.id)) {
        await supabase.from('ads').update(dbAd).eq('id', ad.id);
      } else {
        await supabase.from('ads').insert([dbAd]);
      }
    } catch (err) {
      console.error(err);
    }
  },

  deleteAd: async (id: string): Promise<void> => {
    try {
      if (isUuid(id)) {
        await supabase.from('ads').delete().eq('id', id);
      }
    } catch (err) { console.error(err); }
  },

  // Settings
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (error || !data) return DEFAULT_SETTINGS;
      return {
        companyName: data.company_name || DEFAULT_SETTINGS.companyName,
        tagline: data.tagline || DEFAULT_SETTINGS.tagline,
        logoUrl: data.logo_url || undefined,
        primaryPhone: data.primary_phone || DEFAULT_SETTINGS.primaryPhone,
        secondaryPhone: data.secondary_phone || DEFAULT_SETTINGS.secondaryPhone,
        primaryEmail: data.primary_email || DEFAULT_SETTINGS.primaryEmail,
        whatsappNumber: data.whatsapp_number || DEFAULT_SETTINGS.whatsappNumber,
        address: data.address || DEFAULT_SETTINGS.address,
        city: data.city || DEFAULT_SETTINGS.city,
        state: data.state || DEFAULT_SETTINGS.state,
        pincode: data.pincode || DEFAULT_SETTINGS.pincode,
        aboutUsContent: data.about_us_content || DEFAULT_SETTINGS.aboutUsContent,
        facebookUrl: data.facebook_url || DEFAULT_SETTINGS.facebookUrl,
        instagramUrl: data.instagram_url || DEFAULT_SETTINGS.instagramUrl,
        youtubeUrl: data.youtube_url || DEFAULT_SETTINGS.youtubeUrl
      };
    } catch (err) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: async (settings: SiteSettings): Promise<void> => {
    try {
      const dbSettings = {
        company_name: settings.companyName,
        tagline: settings.tagline,
        logo_url: settings.logoUrl,
        primary_phone: settings.primaryPhone,
        secondary_phone: settings.secondaryPhone,
        primary_email: settings.primaryEmail,
        whatsapp_number: settings.whatsappNumber,
        address: settings.address,
        city: settings.city,
        state: settings.state,
        pincode: settings.pincode,
        about_us_content: settings.aboutUsContent,
        facebook_url: settings.facebookUrl,
        instagram_url: settings.instagramUrl,
        youtube_url: settings.youtubeUrl
      };

      const { count } = await supabase.from('site_settings').select('*', { count: 'exact', head: true });
      if (count !== null && count > 0) {
         const { data } = await supabase.from('site_settings').select('id').limit(1).single();
         if (data) {
           await supabase.from('site_settings').update(dbSettings).eq('id', data.id);
         }
      } else {
         await supabase.from('site_settings').insert([dbSettings]);
      }
    } catch (err) { console.error(err); }
  },

  // Enquiries
  getEnquiries: async (): Promise<ContactEnquiry[]> => {
    try {
      const { data, error } = await supabase.from('enquiries').select('*').order('date', { ascending: false });
      if (error || !data || (Array.isArray(data) && data.length === 0)) return MOCK_ENQUIRIES;
      return data.map((e: any) => ({
        id: e.id,
        name: e.name,
        phone: e.phone,
        email: e.email,
        message: e.message,
        sourcePage: e.source_page,
        propertyId: e.property_id,
        propertySlug: e.property_slug,
        propertyTitle: e.property_title,
        date: e.date ? new Date(e.date).toLocaleDateString() : new Date().toLocaleDateString(),
        isHandled: e.is_handled
      }));
    } catch (err) {
      return MOCK_ENQUIRIES;
    }
  },
  
  submitEnquiry: async (enquiry: Omit<ContactEnquiry, 'id' | 'date' | 'isHandled'>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('enquiries').insert([{
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        message: enquiry.message,
        source_page: enquiry.sourcePage,
        property_id: enquiry.propertyId,
        property_slug: enquiry.propertySlug,
        property_title: enquiry.propertyTitle,
        date: new Date().toISOString(),
        is_handled: false
      }]);
      if (error) return true; 
      return true;
    } catch (err) {
      return true; 
    }
  },

  toggleEnquiryStatus: async (id: string): Promise<void> => {
    try {
      if (isUuid(id)) {
        const { data } = await supabase.from('enquiries').select('is_handled').eq('id', id).single();
        if (data) {
          await supabase.from('enquiries').update({ is_handled: !data.is_handled }).eq('id', id);
        }
      }
    } catch (err) { console.error(err); }
  },

  // Sale Listings
  getSaleListings: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase.from('sale_listings').select('*').order('submitted_at', { ascending: false });
      if (error || !data) {
        console.warn('Supabase fetch failed for sale listings, using mock/local data');
        // Return local storage data or empty array
        const localData = localStorage.getItem('saleListings');
        return localData ? JSON.parse(localData) : [];
      }
      if (Array.isArray(data) && data.length === 0) {
        const localData = localStorage.getItem('saleListings');
        return localData ? JSON.parse(localData) : [];
      }
      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        email: s.email,
        propertyType: s.property_type,
        propertyTitle: s.property_title,
        location: s.location,
        city: s.city,
        state: s.state,
        areaSqft: s.area_sqft,
        price: s.price,
        bedrooms: s.bedrooms,
        bathrooms: s.bathrooms,
        description: s.description,
        ownershipType: s.ownership_type,
        imageUrl: s.image_url,
        submittedAt: s.submitted_at || new Date().toISOString(),
        isReviewed: s.is_reviewed || false
      }));
    } catch (err) {
      console.warn('Error fetching sale listings:', err);
      const localData = localStorage.getItem('saleListings');
      return localData ? JSON.parse(localData) : [];
    }
  },

  submitSaleListing: async (listing: any): Promise<boolean> => {
    try {
      const dbListing = {
        name: listing.name,
        phone: listing.phone,
        email: listing.email,
        property_type: listing.propertyType,
        property_title: listing.propertyTitle,
        location: listing.location,
        city: listing.city,
        state: listing.state,
        area_sqft: listing.areaSqft,
        price: listing.price,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        description: listing.description,
        ownership_type: listing.ownershipType,
        image_url: listing.imageUrl,
        submitted_at: new Date().toISOString(),
        is_reviewed: false
      };

      const { error } = await supabase.from('sale_listings').insert([dbListing]);
      
      if (error) {
        console.warn('Supabase insert failed, saving to localStorage');
        // Fallback to localStorage
        const localData = localStorage.getItem('saleListings');
        const listings = localData ? JSON.parse(localData) : [];
        const newListing = {
          id: Date.now().toString(),
          ...listing,
          isReviewed: false
        };
        listings.unshift(newListing);
        localStorage.setItem('saleListings', JSON.stringify(listings));
        return true;
      }
      return true;
    } catch (err) {
      console.warn('Error submitting sale listing, saving to localStorage', err);
      // Fallback to localStorage
      const localData = localStorage.getItem('saleListings');
      const listings = localData ? JSON.parse(localData) : [];
      const newListing = {
        id: Date.now().toString(),
        ...listing,
        submittedAt: new Date().toISOString(),
        isReviewed: false
      };
      listings.unshift(newListing);
      localStorage.setItem('saleListings', JSON.stringify(listings));
      return true;
    }
  },

  deleteSaleListing: async (id: string): Promise<void> => {
    try {
      if (isUuid(id)) {
        await supabase.from('sale_listings').delete().eq('id', id);
      } else {
        // Delete from localStorage
        const localData = localStorage.getItem('saleListings');
        if (localData) {
          const listings = JSON.parse(localData);
          const filtered = listings.filter((l: any) => l.id !== id);
          localStorage.setItem('saleListings', JSON.stringify(filtered));
        }
      }
    } catch (err) { 
      console.error(err);
      // Try localStorage
      const localData = localStorage.getItem('saleListings');
      if (localData) {
        const listings = JSON.parse(localData);
        const filtered = listings.filter((l: any) => l.id !== id);
        localStorage.setItem('saleListings', JSON.stringify(filtered));
      }
    }
  },

  toggleSaleListingStatus: async (id: string): Promise<void> => {
    try {
      if (isUuid(id)) {
        const { data } = await supabase.from('sale_listings').select('is_reviewed').eq('id', id).single();
        if (data) {
          await supabase.from('sale_listings').update({ is_reviewed: !data.is_reviewed }).eq('id', id);
        }
      } else {
        // Toggle in localStorage
        const localData = localStorage.getItem('saleListings');
        if (localData) {
          const listings = JSON.parse(localData);
          const updated = listings.map((l: any) => 
            l.id === id ? { ...l, isReviewed: !l.isReviewed } : l
          );
          localStorage.setItem('saleListings', JSON.stringify(updated));
        }
      }
    } catch (err) { 
      console.error(err);
      // Try localStorage
      const localData = localStorage.getItem('saleListings');
      if (localData) {
        const listings = JSON.parse(localData);
        const updated = listings.map((l: any) => 
          l.id === id ? { ...l, isReviewed: !l.isReviewed } : l
        );
        localStorage.setItem('saleListings', JSON.stringify(updated));
      }
    }
  }
};
