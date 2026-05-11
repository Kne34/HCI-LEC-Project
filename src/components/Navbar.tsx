import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartState';

const Navbar: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const handleSearchClick = () => {
    navigate(`/search?q=${encodeURIComponent(inputValue)}`);
  };

  const handleLogoClick = () => {
    setInputValue('');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl italic">K</span>
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 hidden sm:block">KYOU<span className="text-orange-600 italic">.ID</span></span>
          </div>

          <div className="flex-1 max-w-2xl relative order-2 md:order-none">
            <input 
              type="text" 
              placeholder="Cari..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-100 border-none rounded-xl py-2 md:py-2.5 pl-10 md:pl-12 pr-4 text-xs md:text-sm focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all outline-none"
            />
            <svg 
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 cursor-pointer hover:text-orange-600 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              onClick={handleSearchClick}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2 md:gap-4 order-3">
            <div 
              onClick={() => navigate('/cart')}
              className="relative group cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
            <button className="hidden md:block text-sm font-bold text-slate-700 hover:text-orange-600">Masuk</button>
            <button className="btn-primary text-xs md:text-sm px-3 md:px-5">Daftar</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
