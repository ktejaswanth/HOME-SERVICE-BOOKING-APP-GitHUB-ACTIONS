import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: role,
            }
          }
        });
        if (error) throw error;
        
        if (data.session) {
          toast.success('Registration successful!');
          onClose();
          if (role === 'provider') navigate('/provider-dashboard');
          else navigate('/dashboard');
        } else {
          toast.success('Registration successful! Please check your email.');
          setMode('login');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        
        // Fetch user profile to get role for redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        toast.success('Welcome back!');
        onClose();
        
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else if (profile?.role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      ></motion.div>

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-indigo-100">
              <User size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500">
              {mode === 'login' 
                ? 'Sign in to access your home services' 
                : 'Join HomeServe to book top-rated professionals'}
            </p>
          </div>

          {/* Role Switcher (Sign Up only) */}
          {mode === 'signup' && (
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
              <button 
                onClick={() => setRole('customer')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => setRole('provider')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'provider' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Service Provider
              </button>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {mode === 'signup' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                className="w-full py-4 pl-12 pr-12 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Chrome size={20} className="text-red-500" /> Google
            </button>
            <button 
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Github size={20} /> GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-500">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-indigo-600 font-bold hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
