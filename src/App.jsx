import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QrCodePage from './pages/QrCodePage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminMenu from './pages/AdminMenu.jsx';
import AdminHistory from './pages/AdminHistory.jsx';
import AdminRoute from './components/AdminRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/qr" element={<QrCodePage />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <AdminRoute>
            <AdminMenu />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <AdminRoute>
            <AdminHistory />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
