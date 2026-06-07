import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="card group cursor-pointer flex flex-col h-full hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <p className="text-lg font-bold text-slate-900">
            <span className="text-xs font-medium mr-0.5">Rp</span>
            {product.price.toLocaleString('id-ID')}
          </p>
          
          <div className="flex items-center mt-2 gap-2 text-[11px] text-slate-500">
            <div className="flex items-center text-amber-500">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
              <span className="ml-1 font-semibold text-slate-700">{product.rating}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span>Sold {product.sold}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
