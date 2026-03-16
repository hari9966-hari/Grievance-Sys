import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FilterBar = ({ onFilterChange, categories = [] }) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    priority: '',
    onlyMine: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const newFilters = { ...filters, [name]: val };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      search: '',
      status: '',
      category: '',
      priority: '',
      onlyMine: false
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder={language === 'en' ? 'Search complaints...' : 'புகார்களைத் தேடுங்கள்...'}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-transparent focus:border-primary-500 focus:bg-white rounded-xl text-sm transition-all outline-none"
          />
        </div>

        {/* Quick Status Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto no-scrollbar">
          {['', 'Open', 'In Progress', 'Resolved', 'Escalated'].map((status) => (
            <button
              key={status}
              onClick={() => handleChange({ target: { name: 'status', value: status } })}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.status === status
                  ? 'bg-primary-600 text-white shadow-card'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {status === '' ? (language === 'en' ? 'All' : 'அனைத்தும்') : (language === 'en' ? status : t(`status.${status.toLowerCase().replace(' ', '')}`))}
            </button>
          ))}
        </div>

        {/* More Filters Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            isOpen ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          {language === 'en' ? 'Filters' : 'வடிகட்டிகள்'}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Filters */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-neutral-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              {language === 'en' ? 'Department/Category' : 'துறை / வகை'}
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border-transparent text-sm font-medium outline-none focus:bg-white focus:border-primary-500 transition-all"
            >
              <option value="">{language === 'en' ? 'All Categories' : 'அனைத்து வகைகள்'}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              {language === 'en' ? 'Severity' : 'தீவிரம்'}
            </label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleChange}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border-transparent text-sm font-medium outline-none focus:bg-white focus:border-primary-500 transition-all"
            >
              <option value="">{language === 'en' ? 'Any Priority' : 'அனைத்து முன்னுரிமை'}</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="onlyMine"
                checked={filters.onlyMine}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-neutral-300 text-primary-600 focus:ring-primary-500 transition-all"
              />
              <span className="text-sm font-bold text-neutral-700 group-hover:text-primary-600 transition-colors">
                {language === 'en' ? 'Show only my complaints' : 'எனது புகார்களை மட்டும் காட்டு'}
              </span>
            </label>
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 mt-2">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-neutral-500 hover:text-danger-600 hover:bg-danger-50 transition-all"
            >
              <X className="w-4 h-4" />
              {language === 'en' ? 'Clear All' : 'அனைத்தையும் நீக்கு'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
