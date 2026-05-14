import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, CreditCard, Heart, 
  User, Settings, LogOut, Bell, Search, Filter, 
  ChevronRight, Calendar, Clock, MapPin, CheckCircle2, Zap, Droplets
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      
      // Fetch bookings for this user
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name, icon_url),
          providers (
            profiles (full_name, avatar_url)
          )
        `)
        .eq('customer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (jobId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', jobId);
      if (error) throw error;
      toast.success('Booking cancelled successfully');
      fetchUserData(); // Refresh data
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', label: 'My Bookings', icon: <ShoppingBag size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
            <span className="text-xl font-bold">Home<span className="text-indigo-600">Serve</span></span>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-gray-50">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/');
            }}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-500 font-semibold hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search bookings..." 
                  className="bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <button className="relative w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">Premium Member</p>
                </div>
                <img 
                  src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=6366f1&color=fff`} 
                  className="w-10 h-10 rounded-xl object-cover shadow-md"
                  alt="Profile"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                  <h3 className="text-3xl font-bold text-gray-900">{bookings.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Completed</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'completed').length}
                  </h3>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                    <Clock size={24} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Upcoming</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length}
                  </h3>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                    <button onClick={() => setActiveTab('bookings')} className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-3xl border border-gray-100 hover:shadow-lg transition-all flex items-center gap-4"
                      >
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl">
                          {booking.services?.icon_url || '🛠️'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{booking.services?.name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar size={12} /> {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{booking.total_price}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="bg-white p-12 rounded-[32px] text-center border-2 border-dashed border-gray-100">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-500 font-medium">No bookings yet</p>
                        <button 
                          onClick={() => navigate('/services')}
                          className="mt-4 text-indigo-600 font-bold hover:underline"
                        >
                          Book your first service
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar - Active Tracker */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Active Tracking</h2>
                  <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Zap size={20} />
                      </div>
                      <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">IN PROGRESS</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Electrical Repair</h3>
                    <p className="text-indigo-100 text-sm mb-6">Pro: Ramesh Kumar</p>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <p className="text-xs text-indigo-100">Professional is on the way</p>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-white rounded-full"></div>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all">
                      Contact Professional
                    </button>
                  </div>

                  {/* Promo Card */}
                  <div className="bg-gradient-to-br from-teal-400 to-emerald-500 rounded-[32px] p-6 text-white overflow-hidden relative">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2">Get 50% Off</h3>
                      <p className="text-teal-50 text-sm mb-6">On your next home cleaning booking</p>
                      <button className="px-6 py-2 bg-white/20 border border-white/30 rounded-xl text-xs font-bold hover:bg-white/30 transition-all">
                        CODE: CLEAN50
                      </button>
                    </div>
                    <Droplets className="absolute -bottom-6 -right-6 text-white/10" size={120} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
             <div className="space-y-6">
               <div className="flex items-center gap-4 mb-8">
                 <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">All</button>
                 <button className="px-6 py-2 bg-white text-gray-500 rounded-xl text-sm font-bold border border-gray-100 hover:bg-gray-50 transition-all">Ongoing</button>
                 <button className="px-6 py-2 bg-white text-gray-500 rounded-xl text-sm font-bold border border-gray-100 hover:bg-gray-50 transition-all">Completed</button>
                 <button className="px-6 py-2 bg-white text-gray-500 rounded-xl text-sm font-bold border border-gray-100 hover:bg-gray-50 transition-all ml-auto">
                   <Filter size={18} />
                 </button>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-6 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center text-4xl">
                        {booking.services?.icon_url || '🛠️'}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.services?.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">Booking ID: #{booking.id.slice(0, 8)}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-gray-500">
                          <span className="flex items-center gap-1"><Calendar size={14} /> {booking.booking_date}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {booking.booking_time}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> Bangalore</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center md:items-end gap-2">
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <p className="text-2xl font-bold text-gray-900 mt-2">₹{booking.total_price}</p>
                        {['pending', 'confirmed'].includes(booking.status) ? (
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            className="mt-2 text-red-500 font-bold text-sm hover:underline flex items-center gap-1"
                          >
                            Cancel Booking
                          </button>
                        ) : (
                          <button className="mt-2 text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                            View Details <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
