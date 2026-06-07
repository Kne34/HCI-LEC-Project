import React, { useState } from 'react';

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, children }) => (
  <div className="mb-6 overflow-hidden">
    <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

interface FilterItemProps {
  label: string;
  count?: number;
  checked: boolean;
  onChange: (label: string, checked: boolean) => void;
  icon?: React.ReactNode;
}

const FilterItem: React.FC<FilterItemProps> = ({ label, count, checked, onChange, icon }) => (
  <label className="flex items-center group cursor-pointer">
    <input 
      type="checkbox" 
      checked={checked}
      onChange={(e) => onChange(label, e.target.checked)}
      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 transition-all cursor-pointer" 
    />
    <div className="ml-3 flex items-center flex-1">
      {icon && <span className="mr-2">{icon}</span>}
      <span className="text-sm text-slate-600 group-hover:text-orange-600 transition-colors">{label}</span>
    </div>
    {count !== undefined && count > 0 && (
      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{count}</span>
    )}
  </label>
);

interface FilterSidebarProps {
  selectedFilters: string[];
  onFilterChange: (label: string, checked: boolean) => void;
  onReset: () => void;
  priceRange: { min: string; max: string };
  onPriceChange: (type: 'min' | 'max', value: string) => void;
  filterCounts: Record<string, number>;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  selectedFilters, 
  onFilterChange, 
  onReset,
  priceRange,
  onPriceChange,
  filterCounts,
  isMobileOpen = false,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isChecked = (label: string) => selectedFilters.includes(label);
  const getCount = (label: string) => filterCounts[label] || 0;

  const initialLocations = ["DKI Jakarta", "Jabodetabek", "Bandung", "Medan", "Surabaya"];
  const moreLocations = ["Bali", "Makassar", "Semarang", "Yogyakarta", "Palembang", "Malang"];
  const allLocations = [...initialLocations, ...moreLocations];
  const displayedLocations = isExpanded ? allLocations : initialLocations;

  const sidebarContent = (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-slate-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="font-bold text-lg text-slate-900">Filter</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="text-xs text-orange-600 font-semibold hover:underline"
          >
            Reset
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
            </button>
          )}
        </div>
      </div>

      <FilterGroup title="Location">
        {displayedLocations.map(loc => (
          <FilterItem 
            key={loc} 
            label={loc} 
            checked={isChecked(loc)} 
            onChange={onFilterChange} 
            count={getCount(loc)}
          />
        ))}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-orange-600 font-bold mt-2 hover:text-orange-700 transition-colors"
        >
          {isExpanded ? 'Hide' : 'Show more'}
        </button>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rp</span>
            <input 
              type="number" 
              placeholder="Min Price" 
              value={priceRange.min}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" 
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rp</span>
            <input 
              type="number" 
              placeholder="Max Price" 
              value={priceRange.max}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" 
            />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Condition">
        <FilterItem label="New" checked={isChecked("New")} onChange={onFilterChange} count={getCount("New")} />
        <FilterItem label="Used" checked={isChecked("Used")} onChange={onFilterChange} count={getCount("Used")} />
      </FilterGroup>

      <FilterGroup title="Rating">
        <FilterItem 
          label="4 Stars & Up" 
          checked={isChecked("4 Stars & Up")} 
          onChange={onFilterChange} 
          count={getCount("4 Stars & Up")}
          icon={
            <div className="flex text-amber-400">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
            </div>
          }
        />
      </FilterGroup>

      <FilterGroup title="Availability">
        <FilterItem label="PreOrder" checked={isChecked("PreOrder")} onChange={onFilterChange} count={getCount("PreOrder")} />
        <FilterItem label="Ready Stock" checked={isChecked("Ready Stock")} onChange={onFilterChange} count={getCount("Ready Stock")} />
      </FilterGroup>

      <FilterGroup title="Shipping Duration">
        <FilterItem label="Instant" checked={isChecked("Instant")} onChange={onFilterChange} count={getCount("Instant")} />
        <FilterItem label="Same Day" checked={isChecked("Same Day")} onChange={onFilterChange} count={getCount("Same Day")} />
      </FilterGroup>

      <FilterGroup title="Date Added">
        <FilterItem label="7 Days" checked={isChecked("7 Days")} onChange={onFilterChange} count={getCount("7 Days")} />
        <FilterItem label="14 Days" checked={isChecked("14 Days")} onChange={onFilterChange} count={getCount("14 Days")} />
        <FilterItem label="1 Month" checked={isChecked("1 Month")} onChange={onFilterChange} count={getCount("1 Month")} />
        <FilterItem label="3 Months" checked={isChecked("3 Months")} onChange={onFilterChange} count={getCount("3 Months")} />
      </FilterGroup>

      <FilterGroup title="Product Category">
        <FilterItem label="Scale Figure" checked={isChecked("Scale Figure")} onChange={onFilterChange} count={getCount("Scale Figure")} />
        <FilterItem label="Nendoroid" checked={isChecked("Nendoroid")} onChange={onFilterChange} count={getCount("Nendoroid")} />
        <FilterItem label="Model Kit" checked={isChecked("Model Kit")} onChange={onFilterChange} count={getCount("Model Kit")} />
        <FilterItem label="Merchandise" checked={isChecked("Merchandise")} onChange={onFilterChange} count={getCount("Merchandise")} />
      </FilterGroup>
    </div>
  );

  return (
    <>
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-24">
          {sidebarContent}
        </div>
      </aside>

      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        <div 
          className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white transition-transform duration-300 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-full overflow-y-auto p-4">
             {sidebarContent}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
