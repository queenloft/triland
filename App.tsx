import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import FloatingInstaShare from './components/FloatingInstaShare';
import { AdminLayout } from './components/AdminLayout';
import { HomePage } from './app/page';
import { ListingPage } from './app/buy/page';
import { ListingType } from './types';
import { PropertyDetailPage } from './app/property/[slug]/page';
import { AboutPage } from './app/about-us/page';
import { ContactPage } from './app/contact-us/page';
import { SellPage } from './app/sell/page';
import { AdminDashboard } from './app/admin/page';
import { AdminProperties } from './app/admin/properties/page';
import { AdminAds } from './app/admin/ads/page';
import { AdminSettings } from './app/admin/settings/page';
import { AdminEnquiries } from './app/admin/enquiries/page';
import { AdminSaleListings } from './app/admin/sale-listings/page';
import { api } from './services/api';

const App: React.FC = () => {
  // Helper to get current path from hash
  const getHashPath = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  };

  const [path, setPath] = useState(getHashPath());
  const [adminLogged, setAdminLogged] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@trisun.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  
  // Hash-based navigation
  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newPath = getHashPath();
      setPath(newPath);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Check admin auth on mount
    const isLogged = localStorage.getItem('adminLogged') === 'true';
    setAdminLogged(isLogged);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = async () => {
      setLoggingIn(true);
      setLoginError('');
      
      const success = await api.authenticateAdmin(emailInput, passwordInput);
      
      if (success) {
        localStorage.setItem('adminLogged', 'true');
        setAdminLogged(true);
        setLoginError('');
        setPasswordInput('');
        navigate('/admin');
      } else {
        setLoginError('Invalid Credentials');
      }
      setLoggingIn(false);
  };

  const handleLogout = () => {
      localStorage.removeItem('adminLogged');
      setAdminLogged(false);
      navigate('/');
  };

  // Admin Routes
  if (path.startsWith('/admin')) {
    const adminPath = path.split('?')[0]; // Ignore query params for admin routing too

    if (!adminLogged && adminPath !== '/admin/login') {
        // Show Login Form
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-100">
             <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-200">
               <div className="text-center mb-6">
                 <div className="w-12 h-12 bg-yellow-500 rounded-lg mx-auto flex items-center justify-center text-white font-bold text-xl mb-3">P</div>
                 <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
                 <p className="text-slate-500 text-sm">Sign in to manage your estate</p>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                   <input 
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" 
                    placeholder="Email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                   <input 
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" 
                    type="password" 
                    placeholder="Password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                   />
                 </div>
                 {loginError && <div className="text-red-500 text-sm text-center font-bold">{loginError}</div>}
                 <button 
                  onClick={handleLogin}
                  disabled={loggingIn}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-500"
                 >
                   {loggingIn ? 'Verifying...' : 'Login'}
                 </button>
                 <button onClick={() => navigate('/')} className="w-full text-sm text-slate-500 hover:text-slate-800">Back to Website</button>
               </div>
             </div>
          </div>
        );
    }

    const currentPage = adminPath.replace('/admin/', '') || 'dashboard';

    return (
      <AdminLayout 
        currentPage={currentPage === '/admin' ? 'dashboard' : currentPage} 
        onLogout={handleLogout}
        onNavigate={(p) => navigate(p === 'dashboard' ? '/admin' : `/admin/${p}`)}
      >
        {adminPath === '/admin' && <AdminDashboard />}
        {adminPath === '/admin/properties' && <AdminProperties />}
        {adminPath === '/admin/sale-listings' && <AdminSaleListings />}
        {adminPath === '/admin/ads' && <AdminAds />}
        {adminPath === '/admin/settings' && <AdminSettings />}
        {adminPath === '/admin/enquiries' && <AdminEnquiries />}
      </AdminLayout>
    );
  }

  // Public Routes
  // Clean path by removing query string for matching
  const cleanPath = path.split('?')[0];
  const isDetail = cleanPath.startsWith('/property/');
  const detailSlug = isDetail ? cleanPath.split('/')[2] : '';
  return (
    <>
      <Layout currentPage={cleanPath} setCurrentPage={navigate}>
        {cleanPath === '/' && <HomePage navigate={navigate} />}
        {cleanPath === '/buy' && <ListingPage navigate={navigate} type={ListingType.SALE} />}
        {cleanPath === '/sell' && <SellPage />}
        {cleanPath === '/rent' && <ListingPage navigate={navigate} type={ListingType.RENT} />}
        {cleanPath === '/about-us' && <AboutPage />}
        {cleanPath === '/contact-us' && <ContactPage />}
        {isDetail && <PropertyDetailPage slug={detailSlug} navigate={navigate} />}
      </Layout>
      <FloatingInstaShare />
    </>
  );
};

export default App;
