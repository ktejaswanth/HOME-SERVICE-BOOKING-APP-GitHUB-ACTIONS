import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  ChevronRight, ChevronLeft, CheckCircle2, 
  ShieldCheck, Info, CreditCard, Zap, Star, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

const BookServicePage = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [qrCode, setQrCode] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [bookingData, setBookingData] = useState({
    serviceId: '',
    providerId: '',
    date: '',
    time: '',
    address: '',
    city: 'Bangalore',
    instructions: '',
    paymentMethod: 'upi'
  });

  useEffect(() => {
    fetchServiceAndProviders();
  }, [serviceName]);

  const fetchServiceAndProviders = async () => {
    try {
      // Allow flexible matching for "ac repair" vs "ac repair & service"
      let searchName = serviceName;
      if (serviceName.includes('ac repair')) searchName = 'ac repair';
      
      const { data: serviceData } = await supabase
        .from('services')
        .select('*')
        .ilike('name', `%${searchName}%`)
        .limit(1)
        .single();
      
      if (serviceData) {
        setService(serviceData);
        setBookingData(prev => ({ ...prev, serviceId: serviceData.id }));

        const { data: psData } = await supabase
          .from('provider_services')
          .select('provider_id')
          .eq('service_id', serviceData.id);

        if (psData && psData.length > 0) {
          const providerIds = psData.map(ps => ps.provider_id);
          const { data: providersData } = await supabase
            .from('providers')
            .select('*, profiles(full_name, avatar_url, role)')
            .in('id', providerIds)
            .eq('is_verified', true)
            .eq('is_available', true);
          
          setProviders(providersData || []);
        } else {
          setProviders([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please login to book a service');
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: session.user.id,
          provider_id: bookingData.providerId,
          service_id: bookingData.serviceId,
          booking_date: bookingData.date,
          booking_time: bookingData.time,
          address: bookingData.address,
          city: bookingData.city,
          special_instructions: bookingData.instructions,
          service_price: service.base_price,
          total_price: service.base_price,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create a pending payment record
      const { data: paymentData } = await supabase
        .from('payments')
        .insert({
          booking_id: data.id,
          customer_id: session.user.id,
          amount: service.base_price,
          payment_method: 'upi',
          status: 'pending'
        })
        .select()
        .single();

      if (paymentData) setPaymentId(paymentData.id);

      // Generate UPI QR Code for payment if successful
      const upiUrl = `upi://pay?pa=ktejaswanth05@okaxis&pn=HomeServe&am=${service.base_price}&tn=Booking_${data.id.slice(0,8)}`;
      const qrDataUrl = await QRCode.toDataURL(upiUrl);
      setQrCode(qrDataUrl);
      
      setStep(4);
      toast.success('Booking initialized! Please complete payment.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleProofUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProof(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProofPreview(previewUrl);
    }
  };

  const finalizeBooking = async () => {
    setUploading(true);
    try {
      // Update payment record with dummy proof URL
      if (paymentId) {
        await supabase
          .from('payments')
          .update({ 
            status: 'processing',
            proof_url: `https://placeholder.com/proof_${paymentId}.jpg` 
          })
          .eq('id', paymentId);
      }

      // Simulate verification delay
      setTimeout(() => {
        toast.success('Payment proof submitted successfully!');
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error finalizing booking:', error);
      toast.error('Failed to submit proof. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto max-w-4xl px-4 md:px-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 px-4 sm:px-0">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100'
                }`}>
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= s ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {s === 1 ? 'Details' : s === 2 ? 'Schedule' : 'Confirm'}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-4 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                {!service ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Info size={32} /></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
                    <p className="text-gray-500 mb-6">We couldn't find the service you're looking for.</p>
                    <button onClick={() => navigate('/services')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Browse Services</button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl">
                          {service?.icon_url || '🛠️'}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{service?.name}</h3>
                          <p className="text-sm text-gray-500">{service?.category}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">{service?.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-indigo-100">
                        <span className="text-sm font-medium text-gray-500">Base Price</span>
                        <span className="text-2xl font-bold text-indigo-600">₹{service?.base_price}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="text-green-500" size={18} /> Why choose us?
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span>Background verified professionals</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span>45-day service guarantee</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span>Zero-contact service experience</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Service Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                        <textarea 
                          rows="3"
                          placeholder="House No, Building, Street, Landmark..."
                          className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none resize-none"
                          value={bookingData.address}
                          onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Special Instructions (Optional)</label>
                      <textarea 
                        rows="2"
                        placeholder="Any specific requirements..."
                        className="w-full py-3 px-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none resize-none"
                        value={bookingData.instructions}
                        onChange={(e) => setBookingData({ ...bookingData, instructions: e.target.value })}
                      ></textarea>
                    </div>

                    <button 
                      onClick={nextStep}
                      disabled={!bookingData.address}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      Next Step <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                </>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <button onClick={prevStep} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
                  <ChevronLeft size={20} /> Back
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Schedule Service</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <CalendarIcon size={18} className="text-indigo-600" /> Select Date
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2, 3, 4, 5].map((offset) => {
                          const date = new Date();
                          date.setDate(date.getDate() + offset);
                          const isSelected = bookingData.date === date.toISOString().split('T')[0];
                          return (
                            <button
                              key={offset}
                              onClick={() => setBookingData({ ...bookingData, date: date.toISOString().split('T')[0] })}
                              className={`p-4 rounded-2xl border transition-all text-center ${
                                isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'
                              }`}
                            >
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </p>
                              <p className="text-lg font-extrabold">{date.getDate()}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-indigo-600" /> Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map((time) => (
                          <button
                            key={time}
                            onClick={() => setBookingData({ ...bookingData, time })}
                            className={`py-3 rounded-2xl border transition-all font-bold text-sm ${
                              bookingData.time === time ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Info size={18} className="text-indigo-600" /> Booking Info
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Service</span>
                          <span className="font-bold text-gray-900">{service?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Estimated Duration</span>
                          <span className="font-bold text-gray-900">{service?.duration_minutes} mins</span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                          <span className="text-gray-500">Total Price</span>
                          <span className="text-xl font-bold text-indigo-600">₹{service?.base_price}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={nextStep}
                      disabled={!bookingData.date || !bookingData.time}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 sm:p-12"
              >
                <button onClick={prevStep} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
                  <ChevronLeft size={20} /> Back
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Confirm Professional</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {providers.length === 0 ? (
                      <div className="col-span-full p-8 text-center bg-gray-50 rounded-3xl border border-gray-100">
                        <Info className="mx-auto text-gray-400 mb-2" size={32} />
                        <h3 className="font-bold text-gray-900">No Professionals Available</h3>
                        <p className="text-sm text-gray-500">Sorry, there are currently no available professionals for this service. Please check back later.</p>
                      </div>
                    ) : (
                      providers.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setBookingData({ ...bookingData, providerId: p.id })}
                          className={`p-6 rounded-[32px] border transition-all text-left flex items-center gap-4 ${
                            bookingData.providerId === p.id ? 'bg-indigo-50 border-indigo-600 shadow-md' : 'bg-white border-gray-100 hover:border-indigo-200'
                          }`}
                        >
                          <img 
                            src={p.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${p.profiles?.full_name}&background=6366f1&color=fff`} 
                            className="w-16 h-16 rounded-2xl object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{p.profiles?.full_name || 'Verified Professional'}</h4>
                            <div className="flex items-center gap-1 text-yellow-400 mt-1">
                              <Star size={14} fill="currentColor" />
                              <span className="text-xs font-bold text-gray-700">{p.rating} ({p.total_reviews} reviews)</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Exp: {p.experience_years} years</p>
                          </div>
                          {bookingData.providerId === p.id && <CheckCircle2 className="text-indigo-600" size={24} />}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <button 
                      onClick={handleBooking}
                      disabled={loading || !bookingData.providerId}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>Confirm & Book Now <Zap size={20} fill="currentColor" /></>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Confirm Payment</h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto">Scan the QR code below using any UPI app to complete your booking.</p>
                
                <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 inline-block mb-10">
                  <img src={qrCode} alt="UPI QR Code" className="w-64 h-64 mx-auto mb-4 bg-white p-4 rounded-3xl" />
                  <p className="font-bold text-gray-900">Amount: ₹{service?.base_price}</p>
                </div>

                <div className="max-w-md mx-auto mb-10 bg-white border-2 border-dashed border-indigo-200 rounded-3xl p-8 text-center hover:border-indigo-500 transition-all group relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProofUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {!paymentProof ? (
                    <>
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                        <Upload size={28} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Upload Payment Proof</h3>
                      <p className="text-sm text-gray-500">Tap or drag screenshot here</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <img 
                          src={proofPreview} 
                          alt="Payment Proof" 
                          className="w-32 h-32 object-cover rounded-2xl border-4 border-green-50"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                      <h3 className="font-bold text-green-600 text-lg mb-1">Screenshot Uploaded</h3>
                      <p className="text-sm text-gray-500">{paymentProof.name}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentProof(null);
                          setProofPreview(null);
                        }}
                        className="mt-3 text-xs font-bold text-red-500 hover:underline"
                      >
                        Remove & Replace
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={finalizeBooking}
                    disabled={!paymentProof || uploading}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Submit Verification & Go to Dashboard'
                    )}
                  </button>
                  <p className="text-sm text-gray-400">Our professional will call you shortly after payment verification.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookServicePage;
