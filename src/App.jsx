import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QrCodePage from './pages/QrCodePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/qr" element={<QrCodePage />} />
    </Routes>
  );
}
