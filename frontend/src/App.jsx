import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CTA from './components/CTA';
import Footer from './components/Footer';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import CustomerDashboard from './pages/CustomerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import NewOrder from './pages/NewOrder';
import MyOrders from './pages/MyOrders';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import './App.css';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CTA />
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
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
