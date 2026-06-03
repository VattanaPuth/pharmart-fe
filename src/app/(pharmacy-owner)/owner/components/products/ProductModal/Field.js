export const Field = ({ label, required, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {label}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>

    {children}
  </div>
);

