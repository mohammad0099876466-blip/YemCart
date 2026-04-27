"use client";

import Link from "next/link";
import { useState } from "react";
import { Category, Banner } from "@/lib/types";
import { IconCart, IconClose, IconHeartOutline, IconMenu, IconSearch } from "@/components/Icons";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenSidebar: () => void;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  banner?: Banner | null;
}


export default function Header({
  search,
  onSearchChange,
  onOpenSidebar,
  categories,
  activeCategory,
  onSelectCategory,
  banner,
}: HeaderProps) {
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  return (
    <section className="relative rounded-[32px] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-600 p-5 text-white shadow-2xl sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white transition hover:bg-white/25"
          aria-label="فتح القائمة"
        >
          <IconMenu />
        </button>

        <div className="space-y-2 text-right">
          <p className="text-xs uppercase tracking-[0.35em] text-white/80">سوق اليمن</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">تسوّق أحدث الصيحات</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSearchOverlay(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white transition hover:bg-white/25"
            aria-label="بحث"
          >
            <IconSearch />
          </button>
          <Link href="/favorites" className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white transition hover:bg-white/25" aria-label="المفضلات">
            <IconHeartOutline />
          </Link>
          <Link href="/cart" className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white transition hover:bg-white/25" aria-label="السلة">
            <IconCart />
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-[32px] border border-white/20 bg-white/10 p-4 shadow-lg shadow-black/10 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">عروض متجددة</p>
            <h2 className="mt-2 text-3xl font-bold text-white">خصومات تصل حتى 70%</h2>
          </div>
          <div className="relative w-full sm:w-96">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/70">
              <IconSearch />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن المنتج..."
              className="w-full rounded-full border border-white/25 bg-white/10 py-3 pr-12 pl-12 text-sm text-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        {banner ? (
          <div className="mt-6 overflow-hidden rounded-[32px] bg-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">{banner.title}</p>
                <h3 className="mt-2 text-2xl font-bold text-white">{banner.subtitle}</h3>
              </div>
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                تسوق الآن
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="inline-flex gap-3">
          <button
            type="button"
            onClick={() => onSelectCategory("الكل")}
            className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
              activeCategory === "الكل" ? "border-white bg-white/20 text-white" : "border-white/30 bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                activeCategory === category.name
                  ? "border-white bg-white/20 text-white"
                  : "border-white/30 bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {showSearchOverlay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xl font-semibold text-slate-900">ابحث عن منتج</div>
              <button
                type="button"
                onClick={() => setShowSearchOverlay(false)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                aria-label="إغلاق البحث"
              >
                <IconClose />
              </button>
            </div>
            <div className="mt-6">
              <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث باسم المنتج، القسم أو الوصف..."
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
