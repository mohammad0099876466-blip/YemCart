"use client";

import { Category } from "@/lib/types";

interface SidebarProps {
  open: boolean;
  categories: Category[];
  activeCategory: string;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

export default function Sidebar({
  open,
  categories,
  activeCategory,
  onClose,
  onSelectCategory,
}: SidebarProps) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? "visible" : "pointer-events-none invisible"}`}>
      <div
        className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white p-5 shadow-2xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-semibold text-slate-600">التصنيفات</p>
            <h2 className="text-xl font-bold text-slate-900">اختر القسم</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            إغلاق
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSelectCategory("الكل")}
            className={`w-full rounded-2xl px-4 py-3 text-right text-sm font-semibold transition ${
              activeCategory === "الكل"
                ? "bg-blue-600 text-white"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={`w-full rounded-2xl px-4 py-3 text-right text-sm font-semibold transition ${
                activeCategory === category.name
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
