import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartState';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const { products } = useCart();

  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 3);
  const recommendedProducts = products.slice(0, 12);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % topProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [topProducts.length]);

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      <section className="relative h-[500px] bg-slate-900 flex items-center overflow-hidden">
         <div className="absolute inset-0 opacity-40">
            <img src="https://goldrecordoutlet.com/wp-content/uploads/2020/08/anime.jpg" className="w-full h-full object-cover" alt="Hero Background" />
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">KYOU<span className="text-orange-600">.ID</span></h1>
            <p className="text-xl md:text-2xl font-bold mb-8 max-w-xl leading-tight">Temukan Figure dan Hobby Original Terlengkap di Indonesia.</p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/search?q=')} className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-orange-900/20">Mulai Belanja</button>
              <button onClick={() => navigate('/search?availability=preorder')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">Pre-Order List</button>
            </div>
         </div>
      </section>

      <section className="w-full bg-slate-50 py-16">
         <div className="max-w-[1300px] mx-auto px-4 sm:px-16 relative">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
                  <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">TOP 3 BEST SELLERS</h2>
               </div>
               <div className="flex gap-1.5">
                  {topProducts.map((_, i) => (
                     <button 
                        key={i} 
                        onClick={() => setActiveSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === i ? 'w-8 bg-orange-500' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                     />
                  ))}
               </div>
            </div>

            <div className="relative group">
               <div className="bg-slate-900 rounded-[32px] overflow-hidden relative h-[380px] md:h-[420px] flex items-center shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent"></div>

                  <div className="relative z-10 w-full h-full">
                     {topProducts.map((product, i) => (
                        <div 
                           key={product.id}
                           className={`absolute inset-0 transition-all duration-700 flex items-center px-8 md:px-20 gap-12 ${
                              activeSlide === i ? 'opacity-100 translate-x-0' : i < activeSlide ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                           }`}
                        >
                           <div className="flex-1 text-center md:text-left">
                              <h2 className="text-2xl md:text-4xl font-black text-white italic leading-tight mb-4">{product.name}</h2>
                              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                                 <span className="text-orange-500 text-2xl md:text-3xl font-black italic">Rp{product.price.toLocaleString('id-ID')}</span>
                                 <span className="text-slate-400 text-sm font-bold border-l border-slate-700 pl-4">Terjual {product.sold}+ unit</span>
                              </div>
                              <button 
                                 onClick={() => navigate(`/product/${product.id}`)}
                                 className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                              >
                                 Lihat Detail &rarr;
                              </button>
                           </div>
                           <div className="hidden md:block w-72 h-72 relative">
                              <div className="absolute inset-0 bg-orange-600 rounded-full blur-[80px] opacity-10"></div>
                              <img 
                                 src={product.image} 
                                 className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" 
                                 alt={product.name} 
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <button 
                  onClick={() => setActiveSlide((activeSlide - 1 + topProducts.length) % topProducts.length)}
                  className="absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-orange-600 hover:text-white transition-all"
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg>
               </button>
               <button 
                  onClick={() => setActiveSlide((activeSlide + 1) % topProducts.length)}
                  className="absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-orange-600 hover:text-white transition-all"
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg>
               </button>
            </div>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
             <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">KATEGORI POPULER</h2>
          </div>
          <button onClick={() => navigate('/search?category=')} className="text-orange-600 font-bold hover:underline">Lihat Semua Kategori</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {['Scale Figure', 'Nendoroid', 'Model Kit'].map((cat, i) => (
             <div 
               key={cat} 
               onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
               className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-all hover:-translate-y-2"
             >
                <img 
                  src={["https://m.media-amazon.com/images/I/71ghTnduCqL._AC_UF1000,1000_QL80_.jpg","https://genshinfans.com/cdn/shop/files/ZT01_c02358e5-66ab-42ea-99ee-822358617b7e.jpg?v=1748420573", "https://titipjepang.com/wp-content/uploads/2024/09/POTJ0924-837.jpg"][i]} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={cat}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                   <h3 className="text-2xl font-black text-white italic tracking-tighter">{cat}</h3>
                   <p className="text-orange-400 font-bold text-sm tracking-widest mt-2 uppercase">Lihat Koleksi &rarr;</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
             <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">REKOMENDASI UNTUKMU</h2>
          </div>
          <button onClick={() => navigate('/search?q=')} className="text-orange-600 font-bold hover:underline">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
           <button 
             onClick={() => navigate('/search?q=')}
             className="px-16 py-5 border-2 border-orange-600 text-orange-600 font-black rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-lg hover:shadow-orange-200"
           >
             Tampilkan Lebih Banyak
           </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
