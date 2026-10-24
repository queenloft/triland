import React from 'react';
import { LayoutDashboard, Home, Layers, MessageSquare, Settings, LogOut, Plus, Megaphone } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout, currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'sale-listings', label: 'Sale Listings', icon: Layers },
    { id: 'ads', label: 'Manage Ads', icon: Megaphone },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full hidden md:flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-wider">ADMIN<span className="text-yellow-500">PANEL</span></h1>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id 
                  ? 'bg-yellow-500 text-slate-900 font-semibold shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
           >
             <LogOut size={20} />
             Logout
           </button>
        </div>
      </aside>

      {/* Mobile Header for Admin */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-50 p-4 flex justify-between items-center shadow-md">
         <span className="font-bold text-lg">Admin Panel</span>
         <button onClick={onLogout} className="bg-slate-800 p-2 rounded"><LogOut size={20}/></button>
      </div>

      {/* Content Area */}
      <main className="flex-grow md:ml-64 p-6 md:p-8 mt-16 md:mt-0 overflow-x-hidden">
         <div className="max-w-7xl mx-auto">
           {children}
         </div>
      </main>
    </div>
  );
};
