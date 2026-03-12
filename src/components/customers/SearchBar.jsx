import React from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm text-slate-300">
      <HiOutlineMagnifyingGlass className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-full bg-transparent text-xs outline-none placeholder:text-slate-500 md:text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;

