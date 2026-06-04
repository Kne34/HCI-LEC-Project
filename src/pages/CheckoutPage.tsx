import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { useCart } from '../context/CartState';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, addOrder } = useCart();

  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    name: 'Keane Wilson Prakoso',
    phone: '081234567890',
    details: 'Jl. Kebon Jeruk No. 27, Jakarta Barat, DKI Jakarta, 11530'
  });

  const productId = searchParams.get('buyNow');
  const quantity = parseInt(searchParams.get('qty') || '1');

  const checkoutItems = useMemo(() => {
    if (productId) {
      const product = MOCK_PRODUCTS.find(p => p.id === Number(productId));
      if (product) {
        const finalQty = product.isReady && product.stock !== undefined ? Math.min(product.stock, quantity) : quantity;
        return [{ ...product, quantity: finalQty }];
      }
      return [];
    }
    return cart;
  }, [productId, quantity, cart]);

  const [selectedShipping, setSelectedShipping] = useState('Reguler');
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState('QRIS');
  const [voucherCode, setVoucherCode] = useState('');

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = selectedShipping === 'Instan' ? 25000 : (selectedShipping === 'Same Day' ? 15000 : 10000);
  const total = subtotal + shippingFee;

  const deliveryEstimate = useMemo(() => {
    const now = new Date();
    if (selectedShipping === 'Instan') return 'Tiba dalam 2-4 jam';
    if (selectedShipping === 'Same Day') return 'Tiba Besok';
    return now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [selectedShipping]);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderItems = checkoutItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        isReady: item.isReady
      }));

      const orderId = addOrder({
        items: orderItems,
        paymentMethod: selectedPayment || selectedPaymentCategory,
        shippingMethod: selectedShipping,
        shippingFee: shippingFee,
        subtotal: subtotal,
        total: total,
        statusNote: 'Pembayaran Selesai! Packing List segera Team Kyou Print!'
      });

      setPlacedOrderId(orderId);
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  if (checkoutItems.length === 0 && step !== 3) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <h2 className="text-2xl font-bold text-slate-800">Tidak ada item untuk dibeli</h2>
        <Link to="/" className="mt-4 text-orange-600 font-bold hover:underline">Kembali Belanja</Link>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg>
        </div>
        <h1 className="text-3xl font-black text-slate-900 italic mb-2">PEMBAYARAN BERHASIL!</h1>
        <p className="text-slate-500 mb-8 max-w-md">Terima kasih atas pesananmu. Admin Kyou akan segera memproses dan mengirimkan koleksi favoritmu.</p>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full max-w-sm mb-8">
           <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">ID Pesanan</span> <span className="font-bold text-slate-900">#{placedOrderId}</span></div>
           <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Metode</span> <span className="font-bold text-slate-900">{selectedPayment || selectedPaymentCategory}</span></div>
           <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Estimasi Tiba</span> <span className="font-bold text-green-600">{deliveryEstimate}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <button 
            onClick={() => navigate('/order-history')}
            className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 flex-1"
          >
            Lihat Riwayat Pesanan
          </button>
          <button 
            onClick={() => navigate('/')}
            className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 flex-1"
          >
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        {step === 1 ? (
          <h1 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight">Detail Pengiriman</h1>
        ) : step === 2 ? (
          <button 
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-slate-600 font-bold hover:text-orange-600 transition-colors group"
          >
            <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} /></svg>
            <span className="text-2xl font-black italic uppercase tracking-tight">Choose Payment Method</span>
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-12">
          {step === 1 ? (
            <div className="space-y-12 animate-in slide-in-from-left duration-500">
              <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Alamat Pengiriman</h2>
                  {!isEditingAddress && (
                    <button 
                      onClick={() => setIsEditingAddress(true)}
                      className="text-orange-500 text-xs font-bold hover:underline"
                    >
                      Ganti Alamat
                    </button>
                  )}
                </div>
                
                {isEditingAddress ? (
                  <div className="space-y-4 mb-12 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Penerima</label>
                        <input 
                          type="text" 
                          value={addressData.name}
                          onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nomor Telepon</label>
                        <input 
                          type="tel" 
                          value={addressData.phone}
                          onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                      <textarea 
                        value={addressData.details}
                        onChange={(e) => setAddressData({...addressData, details: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
                        rows={3}
                      />
                    </div>
                    <button 
                      onClick={() => setIsEditingAddress(false)}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                    >
                      Simpan Alamat
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-slate-50 bg-slate-50/30 mb-12 animate-in zoom-in-95 duration-300">
                    <p className="font-bold text-slate-900 text-sm mb-1">{addressData.name} | {addressData.phone}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{addressData.details}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metode Pengiriman</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'Reguler', name: 'Reguler', desc: '2-4 Hari', price: 10000 },
                      { id: 'Same Day', name: 'Same Day', desc: 'Besok Tiba', price: 15000 },
                      { id: 'Instan', name: 'Instan', desc: '2-4 Jam', price: 25000 }
                    ].map(ship => (
                      <button 
                        key={ship.id}
                        onClick={() => setSelectedShipping(ship.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedShipping === ship.id ? 'border-orange-500 bg-orange-50/30' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                      >
                        <p className={`text-sm font-bold ${selectedShipping === ship.id ? 'text-orange-600' : 'text-slate-700'}`}>{ship.name}</p>
                        <p className="text-[10px] text-slate-400">{ship.desc} • IDR {ship.price.toLocaleString('id-ID')}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notes untuk Kyou:</label>
                  <textarea 
                    placeholder="Contoh: Tolong packing bubble wrap lebih tebal ya!"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-orange-500 outline-none resize-none transition-all"
                    rows={2}
                  />
                </div>
              </section>

              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight">Detail Pesanan</h2>
                <section className="bg-slate-100/50 p-6 rounded-2xl border border-slate-100">
                  {checkoutItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-50 flex gap-4 mb-4 last:mb-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-slate-700 max-w-md line-clamp-2">{item.name}</h3>
                          <p className="font-bold text-orange-600 text-sm whitespace-nowrap ml-4">IDR {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-400 line-through">IDR {(item.price * 1.2).toLocaleString('id-ID')}</p>
                            <p className="text-xs text-slate-500 font-medium">Quantity: <span className="font-bold text-slate-700">{item.quantity} item(s)</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[
                  { id: 'VA', name: 'Virtual Account', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2' },
                  { id: 'QRIS', name: 'QRIS', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },
                  { id: 'EW', name: 'E-Wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedPaymentCategory(cat.id)}
                    className={`min-w-[140px] p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all relative ${selectedPaymentCategory === cat.id ? 'border-orange-500 bg-white shadow-lg shadow-orange-50' : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'}`}
                  >
                    {selectedPaymentCategory === cat.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} /></svg>
                      </div>
                    )}
                    {cat.id === 'QRIS' ? (
                      <div className="w-10 h-10 flex items-center justify-center text-slate-900 font-black text-lg italic tracking-tighter">QRIS</div>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={cat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} /></svg>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedPaymentCategory === cat.id ? 'text-orange-600' : ''}`}>{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'bca', name: 'BCA Transfer', cat: 'VA', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
                    { id: 'mandiri', name: 'Mandiri', cat: 'VA', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/3840px-Bank_Mandiri_logo_2016.svg.png' },
                    { id: 'qris_main', name: 'QRIS', cat: 'QRIS', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' },
                    { id: 'gopay', name: 'GoPay', cat: 'EW', img: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
                    { id: 'dana', name: 'DANA', cat: 'EW', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/1280px-Logo_dana_blue.svg.png' },
                    { id: 'shopeepay', name: 'ShopeePay', cat: 'EW', img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjC8J0HHOLKSppss14Im84sOJ5D-qB0LAKsxZ8esss0VNs2LJhNYR4S9KCDV7q-U332uEe9BlF1E7rzW6tqvrZfGiivxobhls2I2E9dWgok7LzdJuNOp_s-h4RmUvc4ENhs-RZ9hVEgrPkK9DUlTvhzOFY-WW0CYEAI_xgSFRjmLLYf77QOxNC5yg/w320-h141/ShopeePay%20Logo%20-%20%20(Koleksilogo.com).png' }
                  ].filter(p => p.cat === selectedPaymentCategory).map(pay => (
                    <button 
                      key={pay.id}
                      onClick={() => setSelectedPayment(pay.name)}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 group relative ${selectedPayment === pay.name ? 'border-orange-500 bg-orange-50/40 shadow-md scale-105' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}
                    >
                      {selectedPayment === pay.name && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} /></svg>
                        </div>
                      )}
                      <div className="h-8 w-full flex items-center justify-center">
                        <img src={pay.img} alt={pay.name} className={`max-h-full max-w-[80%] object-contain transition-all duration-300 ${selectedPayment === pay.name ? 'grayscale-0 brightness-100' : 'grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100'}`} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedPayment === pay.name ? 'text-orange-600' : 'text-slate-400'}`}>{pay.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-50 flex flex-col gap-4">
                  <p className="text-sm text-slate-600 leading-relaxed flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Pembayaran melalui <span className="font-bold text-orange-600">{selectedPayment || selectedPaymentCategory}</span> akan diverifikasi secara otomatis.</span>
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Masa berlaku pembayaran adalah <span className="font-bold italic">1 jam</span>.</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:top-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Punya kode voucher?</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Kode Voucher"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
              <button className="bg-slate-400 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-500 transition-all">Submit</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6">Payment Details</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Subtotal ({checkoutItems.length} item)</span>
                <span>IDR {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Shipping Fee ({selectedShipping})</span>
                <span>IDR {shippingFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-lg">Total</span>
                <span className="font-black text-xl text-orange-600">IDR {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (step === 1) setStep(2);
                else handlePlaceOrder();
              }}
              disabled={isProcessing || (step === 2 && !selectedPayment)}
              className={`w-full py-4 rounded-xl font-black text-white text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${isProcessing || (step === 2 && !selectedPayment) ? 'bg-slate-400' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-100'}`}
            >
              {isProcessing ? 'Processing...' : (step === 1 ? 'Pilih Pembayaran' : 'Bayar Sekarang')}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">Aman & Terpercaya di Kyou.id</p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
