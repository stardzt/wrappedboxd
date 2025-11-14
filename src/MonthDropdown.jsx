import { useState, useEffect, useRef } from 'react';

function MonthDropdown({ moviesByMonth, selectedMonth, setSelectedMonth }) {
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef();

  const formatMonth = (monthStr) =>
    new Date(monthStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        className="flex items-center cursor-pointer py-1 rounded-sm text-xs font-bold tracking-widest uppercase text-gray-300"
        onClick={() => setShowMonthDropdown((prev) => !prev)}
      >
        {formatMonth(selectedMonth)}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 ml-1">
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {showMonthDropdown && (
        <div className="absolute z-10 mt-2 w-full text-gray-300 bg-slate-700 rounded shadow-lg max-h-60 overflow-auto">
          {Object.keys(moviesByMonth)
            .sort((a, b) => new Date(b) - new Date(a))
            .map((month) => (
              <button
                key={month}
                onClick={() => {
                  setSelectedMonth(month);
                  setShowMonthDropdown(false);
                }}
                className={`block w-full text-left px-2 py-1 text-xs capitalize text-gray-300 hover:bg-slate-600 ${
                  selectedMonth === month ? 'bg-slate-600 font-bold' : ''
                }`}
              >
                {formatMonth(month)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default MonthDropdown;
