import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartState';

const Navbar: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const navigate = useNavigate();
  const { cartCount, wishlist } = useCart();

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
              placeholder="Search..." 
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
              title="Cart"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <div 
              onClick={() => navigate('/order-history')}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-orange-600"
              title="Order History"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div 
              onClick={() => navigate('/order-history?view=wishlist')}
              className="relative p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-orange-600 hidden sm:block"
              title="Wishlist"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-orange-500 text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-700 hover:text-orange-600 text-sm font-bold"
              >
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600">
                  KW
                </div>
                <span className="hidden sm:block">Hello Keane</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2 py-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 pb-2.5 mb-2.5 border-b border-slate-50 text-left">
                      <p className="text-xs font-black text-slate-800">Keane Wilson Prakoso</p>
                      <p className="text-[10px] text-slate-400 font-medium">keane@gmail.com</p>
                    </div>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/order-history');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order History
                    </button>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/order-history?view=wishlist');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Wishlist
                    </button>
                    <div className="h-px bg-slate-50 my-2"></div>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        alert('Logged out successfully (Simulation).');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


