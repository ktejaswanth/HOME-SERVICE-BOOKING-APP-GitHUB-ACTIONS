import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter,Routes,Route}from 'react-router-dom'

import HomeServicesHomepage from './components/HomeServicesHomepage.jsx'
import AboutUs from './components/AboutUs.jsx'
import FAQs from './components/FAQs.jsx'
import Hirers from './components/Hirers.jsx'
import UsersHomepage from './components/UsersHomepage.jsx'
import MyAccount from './components/MyAccount.jsx'
import PricingPage from './components/PricingPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import ReliableRepairsPage from './components/ReliableRepairsPage.jsx'
import HealthCareServicesPage from './components/HealthCareServicesPage.jsx'
import BeautyServicesPage from './components/BeautyServicesPage.jsx'
import BookServicePage from './components/BookServicePage.jsx'
import Feedback from './components/Feedback.jsx'
import AdminBooking from './components/AdminBooking.jsx'
import AdminFeedback from './components/AdminFeedback.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <Routes>
  <Route path='/'element={<HomeServicesHomepage/>}/>
  <Route path='/aboutus' element={<AboutUs />} />
  <Route path='/faq' element={<FAQs />} />
  <Route path='/hiring' element={<Hirers />} />
  <Route path='/userhome' element={<UsersHomepage />} />
  <Route path='/myaccount' element={<MyAccount />} />
  <Route path='/pricing' element={<PricingPage />} />
  <Route path='/contact' element={<ContactPage />} />
  <Route path='/repairspage' element={<ReliableRepairsPage />} />
  <Route path='/healthpage' element={<HealthCareServicesPage />} />
  <Route path='/beautypage' element={<BeautyServicesPage />} />
  <Route path='/booking' element={<BookServicePage />} />
  <Route path ='/feedback' element={<Feedback />} />
  <Route path='/adminbooking' element={<AdminBooking/>}/>
  <Route path='/adminfeedback' element={<AdminFeedback/>}/>
  <Route path='/admin' element={<AdminDashboard />} />
  

  
  </Routes>
  </BrowserRouter>
  </StrictMode>,
)
