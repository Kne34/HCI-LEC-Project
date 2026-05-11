import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { useCart } from '../context/CartState';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Detail Produk');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const product = MOCK_PRODUCTS.find(p => p.id === Number(id));
  const [activeImage, setActiveImage] = useState(product?.image || '');

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Produk tidak ditemukan</h2>
        <Link to="/" className="mt-4 text-orange-600 font-bold hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setTimeout(() => setIsAdding(false), 1500);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  return (
    <main className="flex-1 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>&rsaquo;</span>
        <Link to={`/search?q=${product.category}`} className="hover:text-orange-600">{product.category}</Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-start">
          
          <div className="w-full lg:w-[420px] flex-shrink-0 lg:top-24 mb-6 lg:mb-0">
            <div className="aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm mb-4">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.gallery.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 cursor-pointer overflow-hidden transition-all ${activeImage === img ? 'border-orange-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`thumbnail ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 text-sm mb-4">
              <span className="text-slate-500">Terjual <span className="text-slate-900 font-medium">{product.sold}+</span></span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                <span className="font-bold text-slate-900">{product.rating}</span>
                <span className="text-slate-500">(10,2rb rating)</span>
              </div>
            </div>

            <div className="text-3xl font-black text-slate-900 mb-6">
              Rp{product.price.toLocaleString('id-ID')}
            </div>

            <div className="h-[1px] bg-slate-100 w-full mb-6"></div>

            <div className="border-b border-slate-100 flex gap-8 mb-6">
              {['Detail Produk', 'Info Penting'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-orange-600' : 'text-slate-500 hover:text-orange-600'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
                </button>
              ))}
            </div>

            {activeTab === 'Detail Produk' ? (
              <div className="text-sm text-slate-700 space-y-4 leading-relaxed pb-20">
                <div className="grid grid-cols-2 gap-y-2 max-w-sm">
                  <span className="text-slate-500">Kondisi:</span> <span className="text-orange-600 font-bold">{product.condition}</span>
                  <span className="text-slate-500">Berat Satuan:</span> <span>{product.weight} g</span>
                  <span className="text-slate-500">Kategori:</span> <span className="text-orange-600 font-bold">{product.category}</span>
                  <span className="text-slate-500">Seri:</span> <span className="text-orange-600 font-bold">{product.series}</span>
                </div>
                <p className="pt-4 border-t border-slate-50">
                  {product.description}
                </p>
                <p>
                  Produk ini dijamin 100% Original Manufacture Guarantee. 
                  Kami selalu menggunakan packing bubble wrap tebal untuk memastikan keamanan barang sampai ke tangan Anda.
                </p>
                <p>
                  Stok terbatas! Segera miliki koleksi {product.series} favoritmu sebelum kehabisan. 
                  Tersedia pengiriman {product.shipping.join(', ')} untuk area tertentu.
                </p>
              </div>
            ) : (
              <div className="text-sm text-slate-700 space-y-8 pb-20">
                <section>
                  <h3 className="font-bold text-slate-900 mb-2">Kebijakan Pengembalian Produk</h3>
                  <p className={`text-slate-500 text-xs leading-relaxed mb-2 ${expandedSections.includes('kebijakan') ? '' : 'line-clamp-2'}`}>
                    Demi menjaga kenyamanan bagi kedua belah pihak, dimohon untuk merekaman video unboxing sebagai bukti untuk klaim retur. Kami tidak dapat melayani komplain dalam bentuk apapun apabila pembeli tidak menyertakan video unboxing paket. Apabila terdapat ketidaksesuaian produk (tipe, seri, & warna) yang dikirimkan dengan yang dipesan, mohon mengajukan komplain pada pusat resolusi yang tersedia dengan menyertakan video unboxing (terlihat label pengiriman dan produk yang dikirim). Untuk produk yang tidak sesuai, mohon segel kemasan untuk tidak dibuka. Apabila segel produk (luar & dalam) sudah dibuka, komplain tidak akan dilayani dan transaksi dianggap telah selesai dan sesuai. Video unboxing paket dimulai dari tampilan label pengiriman hingga barang fisik didalamnya (sudah terlihat produk). Kami tidak menerima video unboxing yang dilakukan setelah kemasan luar/segel resmi terbuka. Komplain dilakukan maks. 2x24 jam setelah pesanan sampai di alamat Anda. Komplain atau keluhan dapat dilakukan melalui kolom chat serta pusat resolusi, untuk penyelesaian komplain berdasarkan solusi yang disetujui oleh kedua belah pihak (penjual & pembeli) Pesanan akan diproses dan dikirimkan berdasarkan urutan pesanan masuk.Terima Kasih atas perhatiannya dan Selamat Berbelanja.
                  </p>
                  <button 
                    onClick={() => toggleSection('kebijakan')}
                    className="text-orange-600 font-bold text-xs hover:underline"
                  >
                    {expandedSections.includes('kebijakan') ? 'Sembunyikan' : 'Selengkapnya'}
                  </button>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 mb-2">Waktu Operasional Toko</h3>
                  <p className={`text-slate-500 text-xs leading-relaxed mb-2 ${expandedSections.includes('operasional') ? '' : 'line-clamp-2'}`}>
                    Senin-Sabtu: 09.00 - 15.00 WIB<br/>
                    Minggu Libur (Produkmu bisa dibeli)<br/>
                    Libur Nasional: Libur (diproses pada hari kerja berikutnya)
                  </p>
                  <button 
                    onClick={() => toggleSection('operasional')}
                    className="text-orange-600 font-bold text-xs hover:underline"
                  >
                    {expandedSections.includes('operasional') ? 'Sembunyikan' : 'Selengkapnya'}
                  </button>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 mb-2">Informasi Pesanan & Pengiriman</h3>
                  <p className={`text-slate-500 text-xs leading-relaxed mb-2 ${expandedSections.includes('pengiriman') ? '' : 'line-clamp-2'}`}>
                    Order yang masuk sebelum pukul 15:00 akan diproses di gudang dan diserahkan ke kurir pada hari yang sama. Pesanan yang diterima setelah waktu tersebut akan diproses dan diserahkan pada hari kerja berikutnya, sesuai dengan jadwal operasional toko. Mohon selalu berhati-hati terhadap modus penipuan. Kyou.id tidak pernah menghubungi customer melalui Whatsapp and atau sosial media lainnya. Kyou.id hanya menghubungi customer melalui Live Chat resmi.
                  </p>
                  <button 
                    onClick={() => toggleSection('pengiriman')}
                    className="text-orange-600 font-bold text-xs hover:underline"
                  >
                    {expandedSections.includes('pengiriman') ? 'Sembunyikan' : 'Selengkapnya'}
                  </button>
                </section>
              </div>
            )}
          </div>

          <div className="hidden lg:block w-[280px] flex-shrink-0 sticky top-24">
            <div className="p-4 border border-slate-200 rounded-2xl shadow-sm bg-white">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Atur jumlah dan catatan</h3>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center border border-slate-200 rounded-lg p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-600 font-bold"
                    >-</button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-orange-600 font-bold"
                    >+</button>
                 </div>
                 <p className="text-xs text-slate-500">Stok: <span className="font-bold text-slate-900">5.667</span></p>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-sm">Subtotal</span>
                <span className="font-black text-slate-900">Rp{(product.price * quantity).toLocaleString('id-ID')}</span>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                    isAdding 
                      ? 'bg-white border-2 border-orange-500 text-orange-600' 
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {isAdding ? '✓ Berhasil' : '+ Keranjang'}
                </button>
                <button 
                  onClick={() => navigate(`/checkout?buyNow=${product.id}&qty=${quantity}`)}
                  className="w-full py-3 border-2 border-orange-600 text-orange-600 rounded-xl font-black text-sm hover:bg-orange-50 transition-all"
                >
                  Beli Langsung
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-50">
                 <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-orange-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} /></svg>
                    Chat
                 </button>
                 <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-orange-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} /></svg>
                    Wishlist
                 </button>
                 <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-orange-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} /></svg>
                    Share
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <button className="p-3 border border-slate-200 rounded-xl text-slate-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} /></svg>
          </button>
          <button 
            onClick={handleAddToCart}
            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all border-2 ${
              isAdding 
                ? 'bg-white border-orange-500 text-orange-600' 
                : 'bg-white border-orange-600 text-orange-600'
            }`}
          >
            {isAdding ? '✓ Berhasil' : 'Keranjang'}
          </button>
          <button 
            onClick={() => navigate(`/checkout?buyNow=${product.id}&qty=${quantity}`)}
            className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-black text-sm active:scale-95 transition-all"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
