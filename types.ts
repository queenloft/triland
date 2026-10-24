
export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT'
}

export enum PropertyCategory {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  PLOT = 'PLOT'
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  SOLD = 'SOLD'
}

export enum AdPosition {
  HOME_HERO = 'HOME_HERO',
  HOME_MIDDLE = 'HOME_MIDDLE',
  BUY_SIDEBAR = 'BUY_SIDEBAR',
  RENT_SIDEBAR = 'RENT_SIDEBAR',
  GLOBAL_TOP = 'GLOBAL_TOP',
  GLOBAL_BOTTOM = 'GLOBAL_BOTTOM'
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  listingType: ListingType;
  category: PropertyCategory;
  isLand: boolean;
  price: number;
  currency: string;
  location: string;
  city: string;
  state: string;
  landmark?: string;
  areaSqft: number;
  bedrooms?: number;
  bathrooms?: number;
  facing?: string;
  status: PropertyStatus;
  description: string;
  mainImageUrl: string;
  galleryImages: string[];
  isFeatured: boolean;
  createdAt: string;
  
  // Luxury Fields
  customId?: string;
  overview?: string;
  amenities?: string[];
  specifications?: Record<string, string>; // Key-Value e.g. { Flooring: "Italian Marble" }
  locationHighlights?: string[];
  youtubeUrl?: string;
}

export interface AdBanner {
  id: string;
  title: string;
  position: AdPosition;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  sourcePage: string;
  propertyId?: string;
  propertySlug?: string;
  propertyTitle?: string;
  date: string;
  isHandled: boolean;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  logoUrl?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  primaryEmail: string;
  whatsappNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  aboutUsContent: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface SaleListing {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyType: PropertyCategory;
  propertyTitle: string;
  location: string;
  city: string;
  state: string;
  areaSqft: string;
  price: string;
  bedrooms?: string;
  bathrooms?: string;
  description?: string;
  ownershipType: string;
  imageUrl?: string;
  submittedAt: string;
  isReviewed: boolean;
}
