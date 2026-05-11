import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartState';

const CartPage = () => {
  const { cart, removeFromCart, cartCount } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartCount === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-64 h-64 bg-slate-100 rounded-full flex items-center justify-center mb-8">
           <svg className="w-32 h-32 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
           </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 italic mb-2">KERANJANG KAMU KOSONG</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Wah, keranjang kamu masih sepi nih. Yuk, cari figure atau merchandise favoritmu sekarang!</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all hover:-translate-y-1"
        >
          Mulai Belanja
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-black text-slate-900 italic mb-10">KERANJANG BELANJA</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 animate-in slide-in-from-left duration-500">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">{item.series}</p>
                  <h3 className="font-bold text-slate-900 leading-tight mb-2 hover:text-orange-600 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-black text-lg text-slate-900">
                    <span className="text-sm font-bold mr-0.5">Rp</span>
                    {item.price.toLocaleString('id-ID')}
                    <span className="ml-2 text-sm text-slate-400 font-medium">x {item.quantity}</span>
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-96">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-24">
            <h2 className="font-black text-xl text-slate-900 italic mb-6">RINGKASAN BELANJA</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Total Barang ({cartCount})</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Biaya Pengiriman</span>
                <span className="text-green-600 font-bold uppercase text-xs">Gratis Ongkir</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Harga</span>
                <span className="font-black text-2xl text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-orange-700 hover:-translate-y-1 transition-all active:scale-95">
              Beli Sekarang
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">Aman & Terpercaya dengan Kyou.id</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
