import {
  ChevronDown,
  Check,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CategoryDropdown({
  activeTab,
  categories,
  handleCategoryChange,
  loadingCategories,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-white border rounded-xl px-4 py-3 min-w-40 text-sm shadow-sm flex justify-between items-center">
          <span className="truncate">
            {activeTab === "all"
              ? "All Categories"
              : categories.find((c) => String(c.id) === String(activeTab))
                  ?.name || "Categories"}
          </span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2">
        <DropdownMenuItem
          onClick={() => handleCategoryChange("all")}
          className="flex justify-between"
        >
          All Categories
          {activeTab === "all" && <Check size={14} />}
        </DropdownMenuItem>

        <div className="my-1 border-t" />

        {loadingCategories ? (
          <div className="p-2 text-sm text-slate-400">Loading...</div>
        ) : (
          categories.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleCategoryChange(item.id)}
              className="flex justify-between"
            >
              {item.name}
              {String(activeTab) === String(item.id) && <Check size={14} />}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SortDropdown({ sortOptions, handleSortChange, sort }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-white border rounded-xl px-4 py-3 text-sm shadow-sm min-w-40 flex justify-between items-center">
          <span className="truncate">
            {sortOptions.find((s) => s.value === sort)?.label || "Sort"}
          </span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2">
        {sortOptions.map((s) => (
          <DropdownMenuItem
            key={s.value}
            onClick={() => handleSortChange(s.value)}
            className="flex justify-between"
          >
            {s.label}
            {sort === s.value && <Check size={14} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CategoriesPills({activeTab,getIcon, handleCategoryChange, loadingCategories, categories }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-6">
      {/* ALL */}
      <button
        onClick={() => handleCategoryChange("all")}
        className={`px-4 py-2 rounded-full text-xs border whitespace-nowrap ${
          activeTab === "all"
            ? "bg-pink-500 text-white"
            : "bg-white text-slate-700"
        }`}
      >
        All
      </button>

      {/* CATEGORIES */}
      {loadingCategories
        ? Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-slate-200 rounded-full animate-pulse"
              />
            ))
        : categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              className={`px-4 py-2 rounded-full text-xs border whitespace-nowrap flex items-center gap-2 ${
                String(activeTab) === String(c.id)
                  ? "bg-pink-500 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              {getIcon(c.name)}
              {c.name}
            </button>
          ))}
    </div>
  );
}
