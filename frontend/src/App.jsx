import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
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
import ActiveDeliveries from './pages/ActiveDeliveries';
import DeliveryHistory from './pages/DeliveryHistory';
import DeliveryProfile from './pages/DeliveryProfile';
import StaffAllTasks from './pages/StaffAllTasks';
import StaffProfile from './pages/StaffProfile';
import StaffUpdateOrder from './pages/StaffUpdateOrder';
import PointOfSale from './pages/PointOfSale';
import MyOrders from './pages/MyOrders';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import GenerateReport from './pages/GenerateReport';
import UserManagement from './pages/UserManagement';
import ServiceManagement from './pages/ServiceManagement';
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
import OrderSuccess from './pages/OrderSuccess';
import PaymentSuccess from './pages/PaymentSuccess';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
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
            <Route path="/active-deliveries" element={<ActiveDeliveries />} />
            <Route path="/delivery-history" element={<DeliveryHistory />} />
            <Route path="/delivery-profile" element={<DeliveryProfile />} />
            <Route path="/staff/tasks" element={<StaffAllTasks />} />
            <Route path="/staff/pos" element={<PointOfSale />} />
            <Route path="/staff/profile" element={<StaffProfile />} />
            <Route path="/staff/update-order" element={<StaffUpdateOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/generate-report" element={<GenerateReport />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/service-management" element={<ServiceManagement />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/all-orders" element={<AllOrders />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App
