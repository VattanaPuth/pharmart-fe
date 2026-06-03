// components/browse/CategoryPills.jsx
import { Pill, Leaf, Baby, Activity, HeartPulse, Sparkles } from "lucide-react";

const ICON_MAP = {
  med: <Pill size={14} />,
  vit: <Leaf size={14} />,
  baby: <Baby size={14} />,
  device: <Activity size={14} />,
  well: <HeartPulse size={14} />,
};

const getIcon = (name) => {
  const key = Object.keys(ICON_MAP).find(k => name?.toLowerCase().includes(k));
  return ICON_MAP[key] || <Sparkles size={14} />;
};

export const CategoryPills = ({ categories, activeTab, onSelect, loading }) => (
  <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
    <button
      onClick={() => onSelect("all")}
      className={`px-4 py-2 rounded-full text-xs border whitespace-nowrap transition-colors ${
        activeTab === "all" ? "bg-pink-500 text-white" : "bg-white text-slate-700"
      }`}
    >
      All
    </button>
    {loading ? (
      Array(5).fill(0).map((_, i) => (
        <div key={i} className="h-8 w-24 bg-slate-200 rounded-full animate-pulse" />
      ))
    ) : (
      categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`px-4 py-2 rounded-full text-xs border whitespace-nowrap flex items-center gap-2 transition-colors ${
            String(activeTab) === String(c.id) ? "bg-pink-500 text-white" : "bg-white text-slate-700"
          }`}
        >
          {getIcon(c.name)}
          {c.name}
        </button>
      ))
    )}
  </div>
);