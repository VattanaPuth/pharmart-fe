"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { LuPackage, LuStore } from "react-icons/lu";
import { updateQueryParams } from "@/lib/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const HeaderSearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = searchParams.get("type") || "products";
  const initialQuery = searchParams.get("q") || "";

  const [searchType, setSearchType] = useState(initialType);
  const [keyword, setKeyword] = useState(initialQuery);



  const handleSearch = () => {
   
    const basePath = searchType === "products" ? "/products" : "/stores";

    const params = new URLSearchParams(searchParams.toString());

    params.set("q", keyword.trim());
    params.set("type", searchType);
    params.set("page", "1");

    router.push(`${basePath}?${params.toString()}`);
  };

  const handleTypeChange = (value) => {
    setSearchType(value);

    updateQueryParams(router, searchParams, {
      type: value,
      page: 1,
    });

    // optional: also redirect page
    router.push(
      `/${value === "products" ? "products" : "stores"}?${new URLSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        type: value,
      })}`,
    );
  };

  return (
    <div
      className="
        flex items-center w-full lg:max-w-150 h-10 sm:h-12
        rounded-xl
        bg-white
        border border-gray-200
        overflow-hidden
        transition-all
        focus-within:border-[#F06292]
        focus-within:ring-1 focus-within:ring-[#F06292]
      "
    >
      {/* CATEGORY DROPDOWN */}
      <div className="h-full flex items-center">
        <Select value={searchType} onValueChange={handleTypeChange}>
          <SelectTrigger
            className="
              h-full px-3 sm:px-4
              bg-gray-50/50
              text-[#364153] font-semibold text-xs sm:text-sm
              border-0 border-r border-gray-100
              rounded-none
              focus:ring-0
              flex items-center gap-2
              hover:bg-gray-100/50
              transition-colors
            "
          >
            {/* The SelectValue will automatically show the selected item's text */}
            <SelectValue placeholder="Search Option" />
          </SelectTrigger>

          <SelectContent className="rounded-xl border-gray-100 shadow-xl">
            <SelectItem
              value="products"
              className="cursor-pointer focus:bg-pink-50 focus:text-[#F06292]"
            >
              <div className="flex items-center gap-2">
                <LuPackage className="text-[#F06292]" />
                <span>Products</span>
              </div>
            </SelectItem>

            <SelectItem
              value="stores"
              className="cursor-pointer focus:bg-pink-50 focus:text-[#F06292]"
            >
              <div className="flex items-center gap-2">
                <LuStore className="text-[#F06292]" />
                <span>Stores</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INPUT */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={
          searchType === "products"
            ? "Search medicines..."
            : "Search pharmacies..."
        }
        className="bg-transparent flex-1 px-3 text-sm sm:text-base text-slate-700 placeholder:text-gray-400 outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="
          h-full px-3 sm:px-3
          flex items-center justify-center
          bg-[#F06292] hover:bg-[#d85581]
          text-white
          transition-colors
        "
        aria-label="Submit Search"
      >
        <FaSearch size={16} />
      </button>
    </div>
  );
};
