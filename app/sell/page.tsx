import React, { useEffect, useState } from 'react';
import { Home, MapPin, DollarSign, Building2, User, Phone, Mail, MessageSquare, CheckCircle, Upload, X, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { PropertyCategory } from '../../types';

export const SellPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: PropertyCategory.APARTMENT,
    propertyTitle: '',
    location: '',
    city: '',
    state: '',
    areaSqft: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    ownershipType: 'Owner',
  });

  type FormData = typeof formData;
  type FormErrors = Partial<Record<keyof FormData, string>>;

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Hash-based routing: #/sell?location=...&propertyType=...
    const hash = window.location.hash;
    if (!hash.includes('?')) return;

    const params = new URLSearchParams(hash.split('?')[1]);
    const location = params.get('location') || '';
    const city = params.get('city') || '';
    const state = params.get('state') || '';
    const fromPropertyType = params.get('propertyType') || params.get('category') || '';

    const isValidPropertyType = (value: string): value is PropertyCategory => {
      return (Object.values(PropertyCategory) as string[]).includes(value);
    };

    const nextUpdates: Partial<typeof formData> = {};
    if (location) nextUpdates.location = location;
    if (city) nextUpdates.city = city;
    if (state) nextUpdates.state = state;
    if (fromPropertyType && isValidPropertyType(fromPropertyType)) nextUpdates.propertyType = fromPropertyType;

    const shouldApply = Object.keys(nextUpdates).length > 0;
    if (!shouldApply) return;

    setFormData((prev) => ({ ...prev, ...nextUpdates }));
    // If user came from Home "Sell" search, jump directly to Property Details
    setCurrentStep(2);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = e.target.name as keyof FormData;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateAll = (data: FormData) => {
    const nextErrors: FormErrors = {};

    // Step 1 (Personal)
    if (!data.name.trim()) nextErrors.name = 'Full Name is required.';
    if (!data.phone.trim()) nextErrors.phone = 'Phone Number is required.';

    // Step 2 (Property)
    if (!String(data.propertyType).trim()) nextErrors.propertyType = 'Property Type is required.';
    if (!data.propertyTitle.trim()) nextErrors.propertyTitle = 'Property Title is required.';
    if (!data.location.trim()) nextErrors.location = 'Location is required.';
    if (!data.city.trim()) nextErrors.city = 'City is required.';
    if (!data.state.trim()) nextErrors.state = 'State is required.';

    // Step 3 (Pricing)
    if (!data.areaSqft.toString().trim()) nextErrors.areaSqft = 'Area (Sqft) is required.';
    if (!data.price.toString().trim()) nextErrors.price = 'Expected Price is required.';

    const hasAny = Object.keys(nextErrors).length > 0;
    const firstInvalidStep =
      nextErrors.name || nextErrors.phone
        ? 1
        : nextErrors.propertyType || nextErrors.propertyTitle || nextErrors.location || nextErrors.city || nextErrors.state
          ? 2
          : 3;

    return { hasAny, errors: nextErrors, firstInvalidStep };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitAttempted(true);
    const validation = validateAll(formData);
    if (validation.hasAny) {
      setErrors(validation.errors);
      setCurrentStep(validation.firstInvalidStep);
      return;
    }

    setSubmitting(true);

    const submissionData = {
      ...formData,
      imageUrl: imagePreview, // Store the base64 image
      submittedAt: new Date().toISOString(),
    };

    try {
      await api.submitSaleListing(submissionData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          email: '',
          propertyType: PropertyCategory.APARTMENT,
          propertyTitle: '',
          location: '',
          city: '',
          state: '',
          areaSqft: '',
          price: '',
          bedrooms: '',
          bathrooms: '',
          description: '',
          ownershipType: 'Owner',
        });
        setImageFile(null);
        setImagePreview('');
        setSubmitted(false);
        setCurrentStep(1);
        setErrors({});
        setSubmitAttempted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting sale listing:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center animate-zoom-in border border-green-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Thank You!</h2>
          <p className="text-slate-600 leading-relaxed">
            Your property listing has been submitted successfully. Our team will review it and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  const stepIndicators = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Property Details', icon: Building2 },
    { num: 3, title: 'Pricing & Photos', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4 shadow-lg">
            Sell Your Property
          </div>
          <h1 className="text-5xl font-black text-slate-800 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            List Your Property With Us
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Fill out the form below and our expert team will help you find the right buyers for your property.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center items-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {stepIndicators.map((step, index) => (
            <React.Fragment key={step.num}>
              <div className={`flex flex-col items-center transition-all duration-300 ${currentStep >= step.num ? 'scale-100' : 'scale-90 opacity-50'}`}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-300 shadow-lg ${
                  currentStep > step.num 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.num 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white ring-4 ring-purple-200' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {currentStep > step.num ? <CheckCircle size={24} /> : <step.icon size={24} />}
                </div>
                <span className={`text-sm font-semibold hidden md:block ${currentStep >= step.num ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
              {index < stepIndicators.length - 1 && (
                <div className={`h-1 w-16 rounded-full transition-all duration-300 ${currentStep > step.num ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

          {submitAttempted && Object.keys(errors).length > 0 && (
            <div className="mb-8 p-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-700 font-semibold">
              Please fill all required fields. You are currently on the first step that has missing details.
            </div>
          )}
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <User className="text-purple-600" size={20} />
                </div>
                Your Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.name && <p className="mt-2 text-sm font-semibold text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 8344800800"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.phone && <p className="mt-2 text-sm font-semibold text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ownership Type *</label>
                  <select
                    name="ownershipType"
                    value={formData.ownershipType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Developers">Developers</option>
                    <option value="Builder">Builder</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="text-blue-600" size={20} />
                </div>
                Property Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  >
                    <option value={PropertyCategory.APARTMENT}>Apartment</option>
                    <option value={PropertyCategory.HOUSE}>House</option>
                    <option value={PropertyCategory.VILLA}>Villa</option>
                    <option value={PropertyCategory.LAND}>Land</option>
                    <option value={PropertyCategory.PLOT}>Plot</option>
                    <option value={PropertyCategory.COMMERCIAL}>Commercial</option>
                  </select>
                  {errors.propertyType && <p className="mt-2 text-sm font-semibold text-red-600">{errors.propertyType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Title *</label>
                  <input
                    type="text"
                    name="propertyTitle"
                    value={formData.propertyTitle}
                    onChange={handleChange}
                    placeholder="e.g., Luxury 3BHK Apartment"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.propertyTitle && <p className="mt-2 text-sm font-semibold text-red-600">{errors.propertyTitle}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location/Address *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.location && <p className="mt-2 text-sm font-semibold text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.city && <p className="mt-2 text-sm font-semibold text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.state && <p className="mt-2 text-sm font-semibold text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your property, amenities, and unique features..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Photos */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                Pricing & Photos
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Area (sq ft) *</label>
                  <input
                    type="number"
                    name="areaSqft"
                    value={formData.areaSqft}
                    onChange={handleChange}
                    placeholder="e.g., 1200"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.areaSqft && <p className="mt-2 text-sm font-semibold text-red-600">{errors.areaSqft}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Expected Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 50,00,000"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                  {errors.price && <p className="mt-2 text-sm font-semibold text-red-600">{errors.price}</p>}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Upload size={18} />
                  Property Image
                </label>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-purple-400 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="text-purple-600" size={32} />
                      </div>
                      <p className="text-slate-600 font-semibold mb-1">Click to upload property image</p>
                      <p className="text-sm text-slate-400">PNG, JPG, JPEG up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img src={imagePreview} alt="Property preview" className="w-full h-64 object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-semibold">Property Image</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Submit Property'} <CheckCircle size={20} />
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {[
            { icon: CheckCircle, title: 'Free Listing', desc: 'No charges for property listing' },
            { icon: Building2, title: 'Expert Support', desc: 'Dedicated team to help you' },
            { icon: DollarSign, title: 'Best Price', desc: 'Get the best value for your property' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="text-purple-600" size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
