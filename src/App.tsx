import { Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import { CartProvider } from './context/CartContext';

const ProductWrapper = () => {
  const { id } = useParams();
  return <ProductDetailPage key={id} />;
};

const App: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
      <ScrollToTop />
      <Navbar />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage key={searchParams.get('q') || 'default'}/>} />
        <Route path="/product/:id" element={<ProductWrapper />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
      </Routes>


      <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
               <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                  <span className="text-white font-black text-sm italic">K</span>
                </div>
                <span className="font-black text-lg tracking-tighter text-slate-900">KYOU.ID</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kyou.id adalah marketplace hobi nomor 1 di Indonesia. Temukan ribuan figure, nendoroid, dan model kit original dengan harga terbaik.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-4 text-sm">Bantuan</h4>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">Cara Order</li>
                <li className="hover:text-blue-600 cursor-pointer">Pengiriman</li>
                <li className="hover:text-blue-600 cursor-pointer">Pembayaran</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-4 text-sm">Tentang</h4>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">Tentang Kyou</li>
                <li className="hover:text-blue-600 cursor-pointer">Karir</li>
                <li className="hover:text-blue-600 cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-4 text-sm">Ikuti Kami</h4>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors text-slate-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </CartProvider>
  );
};

export default App;
