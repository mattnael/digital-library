import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowUpRight } from 'lucide-react';

export default function UserLayout({ children }) {
  const navigate = useNavigate();

  const [userName] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) return parsed.name;
        if (parsed.email) {
          const nameFromEmail = parsed.email.split('@')[0];
          return nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        }
      } catch {
        return 'User';
      }
    }
    return 'User';
  });

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-stone-800 font-sans flex flex-col">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-stone-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-30">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/dashboard')}
        >
          <div className="p-1.5 bg-[#133227] text-white rounded-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-serif font-bold text-stone-900 tracking-tight">Project Title</span>
        </div>

        {/* User profile & SignOut */}
        <div className="flex items-center gap-6 text-xs font-sans">
          <span className="font-bold text-[#133227] text-sm">{userName}</span>
          <button 
            onClick={handleSignOut}
            className="text-stone-500 hover:text-[#133227] flex items-center gap-0.5 transition cursor-pointer font-medium"
          >
            <span>SignOut</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}