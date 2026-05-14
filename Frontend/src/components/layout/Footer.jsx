import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Home<span className="text-indigo-400">Serve</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              We provide professional home services including cleaning, repairs, painting, and beauty treatments. Your trust is our priority.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors">All Services</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/become-provider" className="hover:text-indigo-400 transition-colors">Become a Professional</Link></li>
            </ul>
          </div>

          {/* Top Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Top Services</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/services/cleaning" className="hover:text-indigo-400 transition-colors">Home Cleaning</Link></li>
              <li><Link to="/services/electrician" className="hover:text-indigo-400 transition-colors">Electrician</Link></li>
              <li><Link to="/services/plumbing" className="hover:text-indigo-400 transition-colors">Plumbing</Link></li>
              <li><Link to="/services/ac-repair" className="hover:text-indigo-400 transition-colors">AC Repair</Link></li>
              <li><Link to="/services/salon" className="hover:text-indigo-400 transition-colors">Salon at Home</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-indigo-400 shrink-0" />
                <span>123 Tech Park, HSR Layout, Bangalore, Karnataka - 560102</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-indigo-400 shrink-0" />
                <span>+91 86880 88449</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-indigo-400 shrink-0" />
                <span>support@homeserve.in</span>
              </li>
              <li className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <Linkedin size={20} className="text-indigo-400 shrink-0" />
                <a href="https://www.linkedin.com/in/kodalipavani22/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Kodali Pavani</a>
              </li>
              <li className="flex items-center gap-3">
                <Linkedin size={20} className="text-indigo-400 shrink-0" />
                <a href="https://www.linkedin.com/in/ktejaswanth/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">K. Tejaswanth</a>
              </li>
              <li className="flex items-center gap-3">
                <Github size={20} className="text-indigo-400 shrink-0" />
                <a href="https://github.com/ktejaswanth" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">ktejaswanth</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 HomeServe Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
