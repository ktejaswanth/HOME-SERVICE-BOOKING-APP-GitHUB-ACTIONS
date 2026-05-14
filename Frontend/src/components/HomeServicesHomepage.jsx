import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Droplets, Wind, ShieldCheck, Home, 
  Palette, Hammer, Scissors, Package, Search, 
  ArrowRight, Star, ChevronLeft, ChevronRight, Mail, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';

const services = [
  { id: 1, name: 'Electrician', icon: <Zap />, color: 'bg-yellow-100 text-yellow-600', count: '150+ Pros' },
  { id: 2, name: 'Plumbing', icon: <Droplets />, color: 'bg-blue-100 text-blue-600', count: '120+ Pros' },
  { id: 3, name: 'AC Repair', icon: <Wind />, color: 'bg-cyan-100 text-cyan-600', count: '80+ Pros' },
  { id: 4, name: 'Cleaning', icon: <ShieldCheck />, color: 'bg-green-100 text-green-600', count: '200+ Pros' },
  { id: 5, name: 'Painting', icon: <Palette />, color: 'bg-pink-100 text-pink-600', count: '60+ Pros' },
  { id: 6, name: 'Carpentry', icon: <Hammer />, color: 'bg-orange-100 text-orange-600', count: '90+ Pros' },
  { id: 7, name: 'Salon', icon: <Scissors />, color: 'bg-purple-100 text-purple-600', count: '110+ Pros' },
  { id: 8, name: 'Packers', icon: <Package />, color: 'bg-indigo-100 text-indigo-600', count: '40+ Pros' },
];

const testimonials = [
  {
    name: "Anjali Sharma",
    role: "Homeowner",
    text: "The AC repair service was incredibly professional and fast. Highly recommend!",
    img: "https://i.pravatar.cc/150?u=anjali"
  },
  {
    name: "Rahul Varma",
    role: "Apartment Resident",
    text: "Best cleaning service I have used in Bangalore. They reached into every corner.",
    img: "https://i.pravatar.cc/150?u=rahul"
  },
  {
    name: "Priya Das",
    role: "Working Professional",
    text: "The Salon at Home service is a life-saver for my busy schedule.",
    img: "https://i.pravatar.cc/150?u=priya"
  }
];

const HomeServicesHomepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-indigo-50 rounded-l-[100px] opacity-50 hidden lg:block"></div>
        <div className="absolute top-1/4 left-10 -z-10 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60"></div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-6 animate-pulse">
                ✨ Trusted by 10,000+ Happy Customers
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
                We Make Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Home Better</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Book professional services for your home with just a few clicks. Verified experts at your doorstep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search for 'AC Repair', 'Cleaning'..." 
                    className="w-full py-4 pl-12 pr-4 bg-white rounded-2xl shadow-xl border-none focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none text-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all">
                  Find Pro
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?u=user${i}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="User" />
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    +2k
                  </div>
                </div>
                <div>
                  <div className="flex text-yellow-400 gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-sm font-bold text-gray-900">4.9/5 Average Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-teal-500/20 rounded-[60px] blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" 
                className="relative z-10 w-full h-[600px] object-cover rounded-[60px] shadow-2xl border-8 border-white animate-float" 
                alt="Service" 
              />
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl z-20 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Quality Assured</p>
                    <p className="text-lg font-bold text-gray-900">100% Satisfaction</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose from a wide range of professional services for your home needs.</p>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service) => (
              <motion.div 
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="p-8 bg-[#F8F9FE] rounded-3xl text-center group cursor-pointer hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-300"
                onClick={() => navigate(`/book/${service.name.toLowerCase()}`)}
              >
                <div className={`w-20 h-20 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-indigo-600 transition-colors`}>
                  {React.cloneElement(service.icon, { size: 36 })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white">{service.name}</h3>
                <p className="text-sm text-gray-500 group-hover:text-indigo-100">{service.count}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16">
            <button 
              onClick={() => navigate('/services')}
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center gap-2"
            >
              View All Services <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#F8F9FE]">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Booking a professional service is easier than you think.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-indigo-200 -z-0"></div>

            {[
              { 
                step: '01', 
                title: 'Search & Choose', 
                desc: 'Browse through our extensive list of services and select the one you need.',
                icon: <Search className="text-indigo-600" size={32} />
              },
              { 
                step: '02', 
                title: 'Select Schedule', 
                desc: 'Pick a date and time that fits your convenience and provide details.',
                icon: <Zap className="text-teal-500" size={32} />
              },
              { 
                step: '03', 
                title: 'Get It Done', 
                desc: 'Our verified professional arrives at your doorstep and completes the job.',
                icon: <Home className="text-orange-500" size={32} />
              },
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 relative">
                  <span className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </span>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-48 -mt-48"></div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">What Our Customers Say</h2>
              <p className="text-xl text-gray-600">Read inspiring stories from people who have transformed their homes with our help.</p>
            </div>
            <div className="flex gap-4">
              <button className="p-4 bg-white rounded-2xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all border border-gray-100">
                <ChevronLeft size={24} />
              </button>
              <button className="p-4 bg-white rounded-2xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all border border-gray-100">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-[#F8F9FE] p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="flex text-yellow-400 mb-8 gap-1">
                  {[1, 2, 3, 4, 5].map(j => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-lg text-gray-700 italic mb-10 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} className="w-14 h-14 rounded-full border-4 border-white shadow-sm" alt={t.name} />
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[60px] p-12 lg:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">Ready to grow your service business?</h2>
            <p className="text-xl text-indigo-100 mb-12 leading-relaxed">Join 500+ professionals who are already earning more with HomeServe. Register today and start getting bookings.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl">
                Become a Professional
              </button>
              <button className="px-10 py-5 bg-indigo-700 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all border border-indigo-500/30 flex items-center justify-center gap-2">
                Watch Story <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><ArrowRight size={16} /></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeServicesHomepage;
