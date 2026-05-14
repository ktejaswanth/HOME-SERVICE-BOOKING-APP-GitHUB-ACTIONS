import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, ShoppingBag, DollarSign, 
  Search, Bell, Filter, MoreVertical, 
  TrendingUp, TrendingDown, CheckCircle, 
  XCircle, AlertTriangle, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const data = [
  { name: 'Mon', bookings: 45 },
  { name: 'Tue', bookings: 52 },
  { name: 'Wed', bookings: 48 },
  { name: 'Thu', bookings: 61 },
  { name: 'Fri', bookings: 55 },
  { name: 'Sat', bookings: 89 },
  { name: 'Sun', bookings: 76 },
];

const AdminPanel = () => {
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    bookings: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch counts from Supabase
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: providersCount } = await supabase.from('providers').select('*', { count: 'exact', head: true });
      const { count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
      
      // Calculate revenue
      const { data: revenueData } = await supabase.from('bookings').select('total_price').eq('status', 'completed');
      const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;

      setStats({
        users: usersCount || 0,
        providers: providersCount || 0,
        bookings: bookingsCount || 0,
        revenue: totalRevenue
      });

      // Fetch recent bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name),
          customer:profiles!customer_id (full_name, email),
          provider:providers (
            profiles (full_name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      setRecentBookings(bookings || []);

      // Fetch pending providers
      const { data: pProviders } = await supabase
        .from('providers')
        .select(`
          *,
          profiles (full_name)
        `)
        .eq('is_verified', false)
        .limit(5);

      setPendingProviders(pProviders || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (id, status) => {
    try {
      const { error } = await supabase
        .from('providers')
        .update({ 
          is_verified: status === 'approved',
          verification_status: status
        })
        .eq('id', id);
      
      if (error) throw error;
      fetchAdminData();
    } catch (error) {
      console.error('Error verifying provider:', error);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: <Users size={24} />, color: 'bg-blue-100 text-blue-600', trend: '+5.4%' },
    { label: 'Total Providers', value: stats.providers, icon: <Briefcase size={24} />, color: 'bg-purple-100 text-purple-600', trend: '+2.1%' },
    { label: 'Total Bookings', value: stats.bookings, icon: <ShoppingBag size={24} />, color: 'bg-orange-100 text-orange-600', trend: '+12.5%' },
    { label: 'Total Revenue', value: `₹${(stats.revenue / 1000).toFixed(1)}k`, icon: <DollarSign size={24} />, color: 'bg-green-100 text-green-600', trend: '+8.2%' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar - Shared pattern but with Admin specific links */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">A</div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Admin<span className="text-indigo-600">Hub</span></span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Dashboard', icon: <TrendingUp size={20} />, active: true },
              { label: 'User Management', icon: <Users size={20} /> },
              { label: 'Provider Verification', icon: <CheckCircle size={20} /> },
              { label: 'Service Catalog', icon: <ShoppingBag size={20} /> },
              { label: 'Complaints', icon: <AlertTriangle size={20} /> },
              { label: 'Financials', icon: <DollarSign size={20} /> },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                  item.active 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search anything..." className="bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">AD</div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${card.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {card.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {card.trend}
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{card.label}</p>
                <h3 className="text-3xl font-extrabold text-gray-900">{card.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Booking Trends */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Booking Velocity</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">Weekly</button>
                  <button className="px-4 py-2 text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-50">Monthly</button>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#6366f1' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Provider Verification Pipeline */}
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Verification</h2>
              <div className="space-y-4">
                {pendingProviders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No pending applications</p>
                ) : (
                  pendingProviders.map((p, i) => (
                    <div key={i} className="p-4 rounded-3xl bg-gray-50 border border-transparent hover:border-indigo-100 group transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                            {p.profiles?.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{p.profiles?.full_name}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{p.specialization?.[0] || 'General'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">Pending</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => verifyProvider(p.id, 'approved')} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold hover:bg-indigo-700 transition-all">APPROVE</button>
                        <button onClick={() => verifyProvider(p.id, 'rejected')} className="flex-1 py-2 bg-white text-gray-400 border border-gray-100 rounded-xl text-[10px] font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">REJECT</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button className="w-full mt-6 py-4 border-2 border-dashed border-gray-100 rounded-[20px] text-gray-400 text-sm font-bold hover:border-indigo-200 hover:text-indigo-600 transition-all">
                View All Pending Applications
              </button>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <Filter size={16} /> Filters
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all">Export CSV</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Booking ID</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Service</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Assigned To</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-8 py-6 text-sm font-bold text-gray-900">#{booking.id.slice(0, 8)}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{booking.customer?.full_name}</span>
                          <span className="text-xs text-gray-400">{booking.customer?.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-600">{booking.services?.name}</td>
                      <td className="px-8 py-6">
                        {booking.provider?.profiles?.full_name ? (
                          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            {booking.provider.profiles.full_name}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500">{booking.booking_date}</td>
                      <td className="px-8 py-6 text-sm font-extrabold text-gray-900">₹{booking.total_price}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-600' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/50 text-center">
              <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center justify-center gap-2 mx-auto">
                View All Transactions <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;