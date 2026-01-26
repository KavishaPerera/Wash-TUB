import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CTA from './components/CTA';
import Footer from './components/Footer';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import SetNewPassword from './pages/SetNewPassword';
import PasswordReset from './pages/PasswordReset';
import CustomerDashboard from './pages/CustomerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import NewOrder from './pages/NewOrder';
import MyOrders from './pages/MyOrders';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import GenerateReport from './pages/GenerateReport';
import UserManagement from './pages/UserManagement';
import AddUser from './pages/AddUser';
import AllOrders from './pages/AllOrders';
import Payment from './pages/Payment';
import SystemSettings from './pages/SystemSettings';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/generate-report" element={<GenerateReport />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/all-orders" element={<AllOrders />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
