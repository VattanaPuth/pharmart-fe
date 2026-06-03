export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all ${className}`}
    {...props}
  />
);