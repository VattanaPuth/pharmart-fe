import React from 'react'

export const Select = ({ options, placeholder, className = "", ...props }) => (
  <select
    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all bg-white ${className}`}
    {...props}
  >
    <option value="">{placeholder}</option>

    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);