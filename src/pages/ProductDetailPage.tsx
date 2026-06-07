import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartState';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(Number(id));
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Product Detail');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const product = products.find(p => p.id === Number(id));
  const [activeImage, setActiveImage] = useState(product?.image || '');

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <Link to="/" className="mt-4 text-orange-600 font-bold hover:underline">Back to Home</Link>
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
            <h1 className="text-[24px] font-bold text-slate-900 leading-snug mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 text-sm mb-4">
              <span className="text-slate-500"><span className="text-slate-900 font-medium">{product.sold}+</span> sold</span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                <span className="font-bold text-slate-900">{product.rating}</span>
                <span className="text-slate-500">(10.2k ratings)</span>
              </div>
            </div>

            <div className="text-3xl font-black text-slate-900 mb-6">
              Rp{product.price.toLocaleString('id-ID')}
            </div>

            <div className="h-[1px] bg-slate-100 w-full mb-6"></div>

            <div className="border-b border-slate-100 flex gap-8 mb-6">
              {['Product Detail', 'Important Info'].map(tab => (
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

            {activeTab === 'Product Detail' ? (
              <div className="text-sm text-slate-700 space-y-4 leading-relaxed pb-20">
                <div className="grid grid-cols-2 gap-y-2 max-w-sm">
                  <span className="text-slate-500">Condition:</span> <span className="text-orange-600 font-bold">{product.condition}</span>
                  <span className="text-slate-500">Weight:</span> <span>{product.weight} g</span>
                  <span className="text-slate-500">Category:</span> <span className="text-orange-600 font-bold">{product.category}</span>
                  <span className="text-slate-500">Series:</span> <span className="text-orange-600 font-bold">{product.series}</span>
                </div>
                <p className="pt-4 border-t border-slate-50">
                  {product.description}
                </p>
                <p>
                  This product is guaranteed 100% Original Manufacture Guarantee. 
                  We always use thick bubble wrap packaging to ensure the safety of the items to your hands.
                </p>
                <p>
                  Limited stock! Get your favorite {product.series} collection before it runs out. 
                  Shipping available via {product.shipping.join(', ')} for specific areas.
                </p>
              </div>
            ) : (
              <div className="text-sm text-slate-700 space-y-8 pb-20">
                <section>
                  <h3 className="font-bold text-slate-900 mb-2">Product Return Policy</h3>
                  <p className={`text-slate-500 text-xs leading-relaxed mb-2 ${expandedSections.includes('kebijakan') ? '' : 'line-clamp-2'}`}>
                    For the convenience of both parties, please record an unboxing video as proof for return claims. We cannot serve complaints of any kind if the buyer does not include a package unboxing video. If there is a product discrepancy (type, series, & color) sent compared to what was ordered, please file a complaint on the available resolution center by enclosing the unboxing video (showing the shipping label and the product sent). For products that do not match, please do not open the packaging seal. If the product seal (outer & inner) has been opened, complaints will not be served and the transaction is considered completed and correct. The package unboxing video starts from the display of the shipping label to the physical item inside (product is already visible). We do not accept unboxing videos made after the outer packaging/official seal has been opened. Complaints must be made max. 2x24 hours after the order reaches your address. Complaints or grievances can be made through the chat column as well as the resolution center, for the settlement of complaints based on the solution agreed upon by both parties (seller & buyer). Orders will be processed and shipped based on the order sequence. Thank you for your attention and Happy Shopping.
                  </p>
                  <button 
                    onClick={() => toggleSection('kebijakan')}
                    className="text-orange-600 font-bold text-xs hover:underline"
                  >
                    {expandedSections.includes('kebijakan') ? 'Hide' : 'Read More'}
                  </button>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 mb-2">Store Operational Hours</h3>
                  <p className={`text-slate-500 text-xs leading-relaxed mb-2 ${expandedSections.includes('operasional') ? '' : 'line-clamp-2'}`}>
                    Monday-Saturday: 09:00 - 15:00 WIB<br/>
                    Sunday Off (Your product can still be bought)<br/>
                    National Holiday: Closed (processed on the next business day)
                  </p>
                  <button 
                    onClick={() => toggleSection('operasional')}
                    className="text-orange-600 font-bold text-xs hover:underline"
                  >
                    {expandedSections.includes('operasional') ? 'Hide' : 'Read More'}
                  </button>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 mb-2">Order & Shipping Information</h3>
                  <p className={`text-slate-500 text-xs leading-relaxed mb-2 ${expandedSections.includes('pengiriman') ? '' : 'line-clamp-2'}`}>
                    Orders received before 15:00 will be processed in the warehouse and handed over to the courier on the same day. Orders received after that time will be processed and handed over on the next business day, according to the store's operational schedule. Please always be careful of fraudulent schemes. Kyou.id never contacts customers via Whatsapp or other social media. Kyou.id only contacts customers through the official Live Chat.
                  </p>
                  <button 
                    onClick={() => toggleSection('pengiriman')}
                    className="text-orange-600 font-bold text-xs hover:underline"
                  >
                    {expandedSections.includes('pengiriman') ? 'Hide' : 'Read More'}
                  </button>
                </section>
              </div>
            )}
          </div>

          <div className="hidden lg:block w-[280px] flex-shrink-0 sticky top-24">
            <div className="p-4 border border-slate-200 rounded-2xl shadow-sm bg-white">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Set quantity and notes</h3>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center border border-slate-200 rounded-lg p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-600 font-bold"
                    >-</button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => product.isReady ? Math.min(product.stock, prev + 1) : prev + 1)}
                      className={`w-8 h-8 flex items-center justify-center font-bold ${
                        product.isReady && quantity >= product.stock 
                          ? 'text-slate-300 cursor-not-allowed' 
                          : 'text-orange-600 hover:scale-110'
                      }`}
                      disabled={product.isReady && quantity >= product.stock}
                    >+</button>
                 </div>
                 <p className="text-xs text-slate-500">Stock: <span className="font-bold text-slate-900">{product.stock}</span></p>
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
                  {isAdding ? '✓ Success' : '+ Cart'}
                </button>
                <button 
                  onClick={() => navigate(`/checkout?buyNow=${product.id}&qty=${quantity}`)}
                  className="w-full py-3 border-2 border-orange-600 text-orange-600 rounded-xl font-black text-sm hover:bg-orange-50 transition-all"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={`flex items-center gap-1 text-[11px] font-bold transition-all ${isWishlisted ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'}`}
                  >
                     <svg className={`w-3 h-3 ${isWishlisted ? 'fill-current text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} /></svg>
                     {isWishlisted ? 'Wishlisted' : 'Wishlist'}
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
            {isAdding ? '✓ Success' : 'Cart'}
          </button>
          <button 
            onClick={() => navigate(`/checkout?buyNow=${product.id}&qty=${quantity}`)}
            className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-black text-sm active:scale-95 transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
