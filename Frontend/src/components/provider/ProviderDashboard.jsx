import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Wallet, User, 
  Settings, LogOut, CheckCircle2, Clock, 
  MapPin, Phone, Star, TrendingUp, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const data = [
  { name: 'Mon', earnings: 1200 },
  { name: 'Tue', earnings: 2100 },
  { name: 'Wed', earnings: 1500 },
  { name: 'Thu', earnings: 2800 },
  { name: 'Fri', earnings: 1900 },
  { name: 'Sat', earnings: 3500 },
  { name: 'Sun', earnings: 4200 },
];

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Fetch provider details
      const { data: provider, error: pError } = await supabase
        .from('providers')
        .select(`
          *,
          profiles (*)
        `)
        .eq('profile_id', session.user.id)
        .single();

      if (pError) throw pError;
      setProviderData(provider);
      setIsOnline(provider.is_available);

      // Fetch jobs assigned to this provider
      const { data: jobsData, error: jError } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name),
          customer:profiles!customer_id (full_name, phone)
        `)
        .eq('provider_id', provider.id)
        .order('booking_date', { ascending: true });

      if (jError) throw jError;
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error fetching provider dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const { error } = await supabase
        .from('providers')
        .update({ is_available: !isOnline })
        .eq('id', providerData.id);
      
      if (error) throw error;
      setIsOnline(!isOnline);
      toast.success(isOnline ? "You're now offline" : "You're now online and available for jobs!");
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', jobId);
      if (error) throw error;
      toast.success(`Job marked as ${newStatus}`);
      fetchProviderData(); // Refresh jobs list
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-900 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">H</div>
            <span className="text-xl font-bold text-white">Home<span className="text-indigo-400">Serve</span></span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
              { id: 'jobs', label: 'My Jobs', icon: <Calendar size={20} /> },
              { id: 'earnings', label: 'Earnings', icon: <Wallet size={20} /> },
              { id: 'profile', label: 'Profile', icon: <User size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/');
            }}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 font-semibold hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Header */}
        <header className="bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {providerData?.profiles?.full_name?.split(' ')[0]}!</h1>
            <p className="text-gray-500 text-sm">You have {jobs.filter(j => j.status === 'pending').length} new jobs today.</p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
              <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
              <button 
                onClick={toggleAvailability}
                className={`w-12 h-6 rounded-full relative transition-all ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isOnline ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-8 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{providerData?.profiles?.full_name}</p>
                <p className="text-xs text-indigo-600 font-medium">Verified Expert</p>
              </div>
              <img 
                src={providerData?.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${providerData?.profiles?.full_name}&background=6366f1&color=fff`} 
                className="w-12 h-12 rounded-2xl object-cover shadow-md"
              />
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Earnings', value: `₹${providerData?.total_earnings?.toLocaleString()}`, icon: <Wallet size={24} />, color: 'bg-indigo-100 text-indigo-600', trend: '+12%' },
                  { label: 'Jobs Completed', value: providerData?.total_jobs_completed, icon: <CheckCircle2 size={24} />, color: 'bg-green-100 text-green-600', trend: '+5%' },
                  { label: 'Average Rating', value: providerData?.rating, icon: <Star size={24} />, color: 'bg-yellow-100 text-yellow-600', trend: '0.1' },
                  { label: 'Pending Jobs', value: jobs.filter(j => j.status === 'pending').length, icon: <Clock size={24} />, color: 'bg-orange-100 text-orange-600', trend: 'Today' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                        <TrendingUp size={12} /> {stat.trend}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Earnings Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
                    <select className="bg-gray-50 border-none rounded-xl text-sm font-bold px-4 py-2">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Area type="monotone" dataKey="earnings" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Jobs</h2>
                  <div className="space-y-6">
                    {jobs.filter(j => ['pending', 'confirmed'].includes(j.status)).slice(0, 4).map((job) => (
                      <div key={job.id} className="flex gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 group">
                        <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">May</span>
                          <span className="text-lg font-bold text-gray-900">{new Date(job.booking_date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.services?.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock size={12} /> {job.booking_time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> Bangalore
                          </p>
                        </div>
                      </div>
                    ))}
                    {jobs.filter(j => ['pending', 'confirmed'].includes(j.status)).length === 0 && (
                      <div className="text-center py-10">
                        <AlertCircle size={40} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">No jobs scheduled</p>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                    View Full Schedule
                  </button>
                </div>
              </div>

              {/* Active Jobs Table */}
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                  <button className="text-sm font-bold text-indigo-600">Download Report</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Service</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {jobs.slice(0, 5).map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50/50 transition-all">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                                {job.customer?.full_name?.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-gray-900">{job.customer?.full_name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-medium text-gray-600">{job.services?.name}</td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold text-gray-900">{job.booking_date}</p>
                            <p className="text-xs text-gray-500 mt-1">{job.booking_time}</p>
                          </td>
                          <td className="px-8 py-6 text-sm font-bold text-gray-900">₹{job.total_price}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              job.status === 'completed' ? 'bg-green-100 text-green-600' : 
                              job.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            {job.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => updateJobStatus(job.id, 'confirmed')} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md">Accept</button>
                                <button onClick={() => updateJobStatus(job.id, 'cancelled')} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Reject</button>
                              </div>
                            )}
                            {job.status === 'confirmed' && (
                              <button onClick={() => updateJobStatus(job.id, 'completed')} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all shadow-md">Mark Completed</button>
                            )}
                            {['completed', 'cancelled'].includes(job.status) && (
                              <span className="text-xs font-bold text-gray-400">No Action Needed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
