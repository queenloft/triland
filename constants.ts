
import { Property, ListingType, PropertyCategory, PropertyStatus, AdBanner, AdPosition, SiteSettings, ContactEnquiry } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    customId: 'LUX-APT-001',
    title: 'The Azure Heights: Premium 3 BHK Apartment',
    slug: 'luxury-3-bhk-anna-nagar',
    listingType: ListingType.SALE,
    category: PropertyCategory.APARTMENT,
    isLand: false,
    price: 25000000,
    currency: 'INR',
    location: 'Anna Nagar',
    city: 'Chennai',
    state: 'TN',
    areaSqft: 2450,
    bedrooms: 3,
    bathrooms: 3,
    status: PropertyStatus.AVAILABLE,
    description: 'Experience the pinnacle of urban living at Azure Heights. This meticulously designed 3 BHK residence offers panoramic city views, smart home automation, and interiors curated by award-winning designers.',
    overview: 'Nestled in the heart of Anna Nagar, this residence redefines luxury. From the moment you step into the private foyer, you are greeted by expansive spaces bathed in natural light. The living area flows seamlessly into a wrap-around balcony, perfect for evening soirees.',
    amenities: ['Swimming Pool', 'Private Elevator', 'Smart Home Automation', 'Concierge Service', 'Gymnasium', 'Spa & Sauna', '24/7 Security', 'Power Backup'],
    specifications: {
        'Flooring': 'Italian Marble in Living, Wooden in Master Bedroom',
        'Kitchen': 'Modular Kitchen with Hettich fittings',
        'Bathrooms': 'Grohe Sanitary ware, Rain Showers',
        'Windows': 'UPVC Sound-proof glazing',
        'Air Conditioning': 'VRV Centralized AC'
    },
    locationHighlights: ['5 mins to Anna Nagar Metro', 'Walking distance to VR Mall', 'Close to top international schools', 'Premium healthcare facilities nearby'],
    mainImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    galleryImages: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true,
    createdAt: '2023-10-01'
  },
  {
    id: '2',
    customId: 'VIL-SEA-042',
    title: 'Oceanfront Majesty: 4 BHK Villa with Private Beach Access',
    slug: 'spacious-villa-garden-ecr',
    listingType: ListingType.SALE,
    category: PropertyCategory.VILLA,
    isLand: false,
    price: 85000000,
    currency: 'INR',
    location: 'ECR',
    city: 'Chennai',
    state: 'TN',
    areaSqft: 4200,
    bedrooms: 4,
    bathrooms: 5,
    status: PropertyStatus.AVAILABLE,
    description: 'Wake up to the sound of waves in this exclusive oceanfront villa. Featuring a private infinity pool, landscaped tropical gardens, and direct access to a pristine beach.',
    overview: 'A sanctuary of peace and luxury, Oceanfront Majesty is designed for those who seek exclusivity. The architecture blends modern minimalism with tropical warmth.',
    amenities: ['Private Beach Access', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Staff Quarters', 'Solar Power', 'Landscaped Garden'],
    specifications: {
        'Structure': 'RCC Framed Structure with Anti-termite treatment',
        'Flooring': 'Imported Spanish Tiles',
        'Security': 'Biometric Access & Perimeter Surveillance',
        'Water': 'Centralized Softening Plant'
    },
    locationHighlights: ['Directly on ECR Beach', '15 mins to Adyar', 'Near Sheraton Grand Resort', 'Private and Secure Gated Community'],
    mainImageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
    galleryImages: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true,
    createdAt: '2023-10-05'
  },
  {
    id: '3',
    customId: 'COM-OMR-99',
    title: 'Prime Commercial IT Park Land',
    slug: 'prime-commercial-land-omr',
    listingType: ListingType.SALE,
    category: PropertyCategory.LAND,
    isLand: true,
    price: 150000000,
    currency: 'INR',
    location: 'OMR',
    city: 'Chennai',
    state: 'TN',
    areaSqft: 10000,
    status: PropertyStatus.AVAILABLE,
    description: 'High-value commercial plot located directly on the IT Corridor. Perfect for Grade-A office complex or luxury hotel.',
    overview: 'Located in the heart of the Cyber Corridor, this plot offers high visibility and excellent connectivity. Ideal for headquarters of MNCs.',
    amenities: ['Corner Plot', 'Main Road Facing', 'Water Connection', 'Sewage Connection', 'Metro Access nearby'],
    specifications: {
        'FSI': '2.5 (Expandable)',
        'Frontage': '80 Feet',
        'Zone': 'Commercial / Mixed Use'
    },
    locationHighlights: ['On OMR Main Road', 'Next to TCS SIPCOT', 'High Footfall Area', 'Future Metro Station at 200m'],
    mainImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    galleryImages: [],
    isFeatured: false,
    createdAt: '2023-10-10'
  },
  {
    id: '4',
    customId: 'RNT-VEL-202',
    title: 'Modern 2 BHK in Gated Community',
    slug: 'affordable-2bhk-rent-velachery',
    listingType: ListingType.RENT,
    category: PropertyCategory.APARTMENT,
    isLand: false,
    price: 35000,
    currency: 'INR',
    location: 'Velachery',
    city: 'Chennai',
    state: 'TN',
    areaSqft: 1250,
    bedrooms: 2,
    bathrooms: 2,
    status: PropertyStatus.AVAILABLE,
    description: 'Semi-furnished flat near Phoenix Mall with modular kitchen and wardrobes. Community includes gym and play area.',
    overview: 'A perfect home for young families, offering safety, community living, and proximity to shopping and work hubs.',
    amenities: ['Clubhouse', 'Children Play Area', 'Covered Parking', 'Gym', 'Lift'],
    specifications: {
        'Furnishing': 'Semi-furnished (Wardrobes + AC)',
        'Parking': '1 Covered Slot',
        'Maintenance': 'Included in Rent'
    },
    locationHighlights: ['Walkable to Phoenix Mall', 'Near Guru Nanak College', 'Easy access to Airport', 'Quiet Residential Area'],
    mainImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    galleryImages: [],
    isFeatured: false,
    createdAt: '2023-10-12'
  }
];

export const MOCK_ADS: AdBanner[] = [
  {
    id: '1',
    title: 'Hero Banner 1',
    position: AdPosition.HOME_HERO,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000',
    isActive: true,
    sortOrder: 1
  },
  {
    id: '2',
    title: 'Middle Banner',
    position: AdPosition.HOME_MIDDLE,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000',
    isActive: true,
    sortOrder: 1,
    linkUrl: '/buy'
  },
  {
    id: '3',
    title: 'Sidebar Ad Sale',
    position: AdPosition.BUY_SIDEBAR,
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    sortOrder: 1,
    linkUrl: '/contact-us'
  }
];

export const MOCK_ENQUIRIES: ContactEnquiry[] = [
  { id: '1', name: 'John Doe', phone: '8344800800', email: 'john@example.com', message: 'Interested in the Villa', date: '2023-10-26', propertyId: '2', sourcePage: 'PROPERTY', isHandled: false },
  { id: '2', name: 'Jane Smith', phone: '9123456789', email: 'jane@test.com', message: 'Do you have rental flats in OMR?', date: '2023-10-25', sourcePage: 'CONTACT', isHandled: true }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'TRISUN',
  tagline: 'Your Trusted Real Estate Partner',
  primaryPhone: '+91 8344800800',
  secondaryPhone: '',
  primaryEmail: 'info@trisun.com',
  address: '123, Green Valley Road',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pincode: '600001',
  whatsappNumber: '918344800800',
  aboutUsContent: 'Welcome to TRISUN, where your dream home becomes a reality. Established in 2019, we have helped thousands of families find their perfect space. Our mission is to provide transparent, reliable, and premium real estate services.',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com'
};
