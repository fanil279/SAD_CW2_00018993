import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { useStore } from './context/StoreContext';
import Cart from './pages/Cart';
import Catalogue from './pages/Catalogue';
import Confirmation from './pages/Confirmation';
import FulfilmentDetails from './pages/FulfilmentDetails';
import FulfilmentSelect from './pages/Fulfilment';
import Login from './pages/Login';
import { OrderDetail, OrderList } from './pages/Orders';
import Payment from './pages/Payment';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Review from './pages/Review';
import { useEffect } from 'react';

function Guard({ children }: { children: JSX.Element }) { const { customer } = useStore(); return customer ? children : <Navigate to="/" replace />; }
function ScrollTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; }

export default function App() {
  return (<>
    <ScrollTop />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Guard><Layout /></Guard>}>
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/fulfilment" element={<FulfilmentSelect />} />
        <Route path="/delivery" element={<FulfilmentDetails type="delivery" mode="asap" />} />
        <Route path="/pickup" element={<FulfilmentDetails type="pickup" mode="asap" />} />
        <Route path="/schedule" element={<FulfilmentDetails mode="preorder" />} />
        <Route path="/review" element={<Review />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation/:ref" element={<Confirmation />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:ref" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></>);
}
