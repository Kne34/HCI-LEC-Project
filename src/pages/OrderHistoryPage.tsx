import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartState';
import type { Order, OrderItem } from '../types';

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, cancelOrder, addToCart, wishlist, toggleWishlist, products } = useCart();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Sedang Diproses' | 'Pengiriman Selesai' | 'Dibatalkan'>('Semua');
  
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const activeSidebarMenu = searchParams.get('view') === 'wishlist' ? 'wishlist' : 'orders';

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    showToast(`ID Pesanan #${id} berhasil disalin!`);
  };

  const handleBuyAgain = (items: OrderItem[]) => {
    items.forEach(item => {
      const actualProduct = products.find(p => p.id === item.id);
      if (actualProduct) {
        addToCart(actualProduct);
      } else {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          series: 'Kyou Collection',
          rating: 5,
          sold: 0,
          category: 'Scale Figure',
          location: 'Indonesia',
          condition: 'Baru',
          shipping: [],
          addedAt: new Date().toISOString(),
          weight: 500,
          gallery: [item.image],
          description: '',
          isReady: item.isReady,
          stock: item.stock ?? 0
        });
      }
    });
    showToast(`${items.length} item berhasil ditambahkan kembali ke keranjang!`);
    setTimeout(() => navigate('/cart'), 800);
  };

  const handleConfirmCancel = () => {
    if (cancellingOrderId) {
      cancelOrder(cancellingOrderId);
      setCancellingOrderId(null);
      showToast('Pesanan berhasil dibatalkan.');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (activeTab !== 'Semua' && order.status !== activeTab) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesItemName = order.items.some(item => 
          item.name.toLowerCase().includes(query)
        );
        return matchesId || matchesItemName;
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const tabCounts = useMemo(() => {
    return {
      Semua: orders.length,
      'Sedang Diproses': orders.filter(o => o.status === 'Sedang Diproses').length,
      'Pengiriman Selesai': orders.filter(o => o.status === 'Pengiriman Selesai').length,
      Dibatalkan: orders.filter(o => o.status === 'Dibatalkan').length,
    };
  }, [orders]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white text-sm font-semibold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        <aside className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl font-black mb-3 border border-orange-200">
              KW
            </div>
            <h3 className="font-black text-slate-800 text-base leading-tight">Keane Wilson Prakoso</h3>
            <p className="text-xs text-slate-400 font-medium mb-3">keane@gmail.com</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">My Hobby Journey</p>
            <button 
              onClick={() => {
                navigate('/order-history');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeSidebarMenu === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Riwayat Pesanan
            </button>
            <button 
              onClick={() => {
                navigate('/order-history?view=wishlist');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeSidebarMenu === 'wishlist' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </button>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          {activeSidebarMenu === 'orders' ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h1 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight mb-6">Riwayat Pesanan</h1>

              <div className="space-y-6 mb-8">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cari berdasarkan ID Pesanan atau Nama Produk..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-orange-100 focus:bg-white outline-none transition-all"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
                  {(['Semua', 'Sedang Diproses', 'Pengiriman Selesai', 'Dibatalkan'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                        activeTab === tab 
                          ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {tab}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {tabCounts[tab]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">Tidak ada pesanan ditemukan</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">Coba ubah kata kunci pencarian atau ganti filter kategori.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="border border-slate-100 bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-50 mb-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <div 
                            onClick={(e) => handleCopyId(order.id, e)}
                            className="flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-700 transition-colors group"
                            title="Click to copy Order ID"
                          >
                            <span className="text-xs font-bold font-mono">#{order.id}</span>
                            <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 4h5m-5 4h5M8 21h4" />
                            </svg>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          {order.isPreOrder ? (
                            <span className="badge bg-blue-50 text-blue-600 border border-blue-100 text-[9px] px-2 py-0.5 rounded-lg">Pre-Order</span>
                          ) : (
                            <span className="badge bg-green-50 text-green-600 border border-green-100 text-[9px] px-2 py-0.5 rounded-lg">Ready Stock</span>
                          )}
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                          order.status === 'Sedang Diproses' 
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : order.status === 'Pengiriman Selesai'
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-4 mb-5">
                        {order.items.map(item => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{item.name}</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">QTY: {item.quantity} Unit</p>
                              </div>
                              <p className="font-bold text-slate-900 text-sm mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-50/50 rounded-2xl px-4 py-3.5 border border-slate-100 flex items-start gap-3 mb-5">
                        <span className="w-5 h-5 rounded-full bg-slate-200/50 flex items-center justify-center text-[10px] font-bold text-slate-500 mt-0.5">i</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{order.statusNote}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Belanja</p>
                          <p className="text-lg font-black text-orange-600 mt-0.5">Rp {order.total.toLocaleString('id-ID')}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {order.status === 'Sedang Diproses' && (
                            <>
                              <button 
                                onClick={() => showToast(`Lacak Pesanan #${order.id}: Sedang dikemas oleh tim Kyou.`)}
                                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5"
                              >
                                Lacak
                              </button>
                              <button 
                                onClick={() => setCancellingOrderId(order.id)}
                                className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                Batalkan
                              </button>
                            </>
                          )}
                          {order.status === 'Dibatalkan' && (
                            <button 
                              onClick={() => handleBuyAgain(order.items)}
                              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md shadow-orange-100 transition-all"
                            >
                              Beli Lagi
                            </button>
                          )}
                          {order.status === 'Pengiriman Selesai' && (
                            <>
                              <button 
                                onClick={() => setReviewOrder(order)}
                                className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
                              >
                                Ulas Produk
                              </button>
                              <button 
                                onClick={() => handleBuyAgain(order.items)}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md shadow-orange-100 transition-all"
                              >
                                Beli Lagi
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h1 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight mb-6">Wishlist Saya</h1>
              {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">Wishlist kamu masih kosong</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">Kamu belum menambahkan item favorit apa pun ke wishlist.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all shadow-md shadow-orange-100"
                  >
                    Mulai Cari Produk
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map(product => (
                    <div key={product.id} className="card group relative flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-slate-100 rounded-2xl overflow-hidden bg-white">
                      
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                          onClick={() => navigate(`/product/${product.id}`)}
                        />
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                          title="Hapus dari Wishlist"
                        >
                          <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
                          {product.isReady ? (
                            <span className="badge badge-ready shadow-sm">Ready Stock</span>
                          ) : (
                            <span className="badge badge-new shadow-sm">Pre Order</span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">{product.series}</p>
                        <h3 
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        
                        <div className="mt-auto pt-3">
                          <p className="text-base font-bold text-slate-900">
                            <span className="text-xs font-medium mr-0.5">Rp</span>
                            {product.price.toLocaleString('id-ID')}
                          </p>
                          <button 
                            onClick={() => {
                              addToCart(product);
                              showToast('Item berhasil ditambahkan ke keranjang!');
                            }}
                            className="w-full mt-4 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-xs hover:bg-orange-700 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            + Keranjang
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

      </div>

      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-2">Batalkan Pesanan?</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">Tindakan ini akan membatalkan pesanan secara permanen. Apakah kamu yakin ingin melanjutkan?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setCancellingOrderId(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all uppercase tracking-wider"
                >
                  Kembali
                </button>
                <button 
                  onClick={handleConfirmCancel}
                  className="flex-1 py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-all uppercase tracking-wider shadow-lg shadow-red-100"
                >
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-900 italic uppercase">Tulis Ulasan</h3>
                <button 
                  onClick={() => setReviewOrder(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {reviewOrder.items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center pb-3 border-b border-slate-50">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-slate-50" />
                    <span className="text-xs font-bold text-slate-700 line-clamp-1 flex-1">{item.name}</span>
                  </div>
                ))}
                
                <div className="pt-4 space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Rating Produk</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} className="text-amber-400 hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Komentar Ulasan</label>
                  <textarea 
                    placeholder="Tulis pendapatmu tentang koleksi ini..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-orange-500 outline-none resize-none transition-all"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setReviewOrder(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all uppercase tracking-wider"
                >
                  Kembali
                </button>
                <button 
                  onClick={() => {
                    setReviewOrder(null);
                    showToast('Terima kasih! Ulasan kamu berhasil dikirim.');
                  }}
                  className="flex-1 py-3 bg-orange-600 text-white font-black text-xs rounded-xl hover:bg-orange-700 transition-all uppercase tracking-wider shadow-lg shadow-orange-100"
                >
                  Kirim Ulasan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderHistoryPage;
