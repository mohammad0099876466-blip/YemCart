"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "الرئيسية", href: "/", icon: "🏠" },
  { label: "بحث", href: "/products", icon: "🔍" },
  { label: "السلة", href: "/cart", icon: "🛒" },
  { label: "حسابي", href: "/dashboard", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white text-slate-700 shadow-[0_-10px_30px_rgba(15,23,42,0.07)] lg:hidden">
      <div className="mx-auto flex max-w-3xl justify-between px-4 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex flex-col items-center justify-center gap-1 rounded-3xl px-3 py-2 text-center text-xs font-semibold transition ${
                active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
