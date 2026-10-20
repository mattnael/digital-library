import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Manage Content', path: '/admin/content' },
    { name: 'Category', path: '/admin/category' },
    { name: 'Activity Log', path: '/admin/activity-log' },
  ];

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-stone-800 font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#133227] text-white rounded-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-serif font-bold text-stone-900 tracking-tight">Project Title</span>
          <span className="bg-[#e5ede9] text-[#133227] text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-sans">
          <span className="font-bold text-[#133227] text-sm">{user?.fullName || 'Admin'}</span>
          <button
            onClick={handleSignOut}
            className="text-stone-500 hover:text-[#133227] flex items-center gap-0.5 transition cursor-pointer font-medium"
          >
            <span>SignOut</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200/80 p-6 space-y-2 shrink-0 hidden md:block">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#e5ede9] text-[#133227]'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
