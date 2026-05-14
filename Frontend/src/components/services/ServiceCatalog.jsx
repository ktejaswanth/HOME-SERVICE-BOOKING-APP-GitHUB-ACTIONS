import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, ArrowRight, Zap, Droplets, Wind, ShieldCheck, Palette, Hammer, Scissors, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const ServiceCatalog = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('popularity_score', { ascending: false });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'repairs', label: 'Repairs' },
    { id: 'cleaning', label: 'Cleaning' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'improvement', label: 'Home Improvement' },
    { id: 'care', label: 'Care Services' },
  ];

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <Navbar />

      <section className="pt-40 pb-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6">Our Services</h1>
            <p className="text-xl text-indigo-100 mb-10">Choose from 50+ professional services at transparent pricing.</p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="What service are you looking for?" 
                className="w-full py-4 pl-12 pr-4 bg-white text-gray-900 rounded-2xl shadow-2xl border-none focus:ring-4 focus:ring-indigo-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-gray-100 bg-white sticky top-20 z-20 overflow-x-auto">
        <div className="container">
          <div className="flex items-center gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[32px] h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/book/${service.name.toLowerCase()}`)}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {service.icon_url || '🛠️'}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Star size={16} fill="currentColor" /> 4.8
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center gap-6 mb-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={14} /> {service.duration_minutes}m</span>
                    <span className="flex items-center gap-1"><Zap size={14} /> Starts at ₹{service.base_price}</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-indigo-600 font-bold flex items-center gap-1">
                      Book Now <ArrowRight size={16} />
                    </span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/100?u=pro${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="Pro" />
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        +12
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ServiceCatalog;
