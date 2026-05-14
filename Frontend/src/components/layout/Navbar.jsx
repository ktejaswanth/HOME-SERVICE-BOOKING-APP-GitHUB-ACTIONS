import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, User, LogOut, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const fetchProfile = async (userId) => {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) setProfile(data);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            H
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
            Home<span className="text-indigo-600">Serve</span>
          </span>
        </Link>

        {/* Location Selector (Desktop) */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <MapPin size={18} className="text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">Bangalore</span>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/services" className="font-medium text-gray-600 hover:text-indigo-600">Services</Link>
          <Link to="/how-it-works" className="font-medium text-gray-600 hover:text-indigo-600">How It Works</Link>
          <Link to="/about" className="font-medium text-gray-600 hover:text-indigo-600">About</Link>
          <Link to="/contact" className="font-medium text-gray-600 hover:text-indigo-600">Contact</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 pl-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">{profile?.full_name?.split(' ')[0] || user.email.split('@')[0]}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{profile?.role || 'Customer'}</p>
                </div>
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                  {profile?.full_name?.charAt(0) || user.email.charAt(0)}
                </div>
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                  >
                    <Link 
                      to={profile?.role === 'admin' ? '/admin' : profile?.role === 'provider' ? '/provider-dashboard' : '/dashboard'} 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                    >
                      <User size={16} /> {profile?.role === 'admin' ? 'Admin Hub' : profile?.role === 'provider' ? 'Provider Dashboard' : 'Dashboard'}
                    </Link>
                    {profile?.role === 'customer' && (
                      <Link to="/bookings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors">
                        <Bell size={16} /> My Bookings
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container py-6 flex flex-col gap-4">
              <Link to="/services" className="text-lg font-medium text-gray-700">Services</Link>
              <Link to="/how-it-works" className="text-lg font-medium text-gray-700">How It Works</Link>
              <Link to="/about" className="text-lg font-medium text-gray-700">About Us</Link>
              <Link to="/contact" className="text-lg font-medium text-gray-700">Contact</Link>
              <div className="h-px bg-gray-100 my-2"></div>
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <MapPin size={18} /> Bangalore
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
