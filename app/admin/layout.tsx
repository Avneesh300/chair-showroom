"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, BarChart2,
  Settings, LogOut, Menu, X, Layers, Ticket, Bell, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Reports", href: "/admin/reports", icon: BarChart2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-amber-950 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-amber-900">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-base">🪑</div>
            <div>
              <div className="font-serif font-bold text-white text-sm leading-none">SRS Admin</div>
              <div className="text-xs text-amber-400">Control Panel</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-amber-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? "bg-amber-700 text-white font-medium"
                    : "text-amber-200 hover:bg-amber-900 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {label}
                {isActive && <ChevronRight size={13} className="ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-amber-900 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-amber-200 hover:bg-amber-900 hover:text-white rounded-xl transition-colors"
          >
            <Package size={17} /> View Store
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-amber-200 hover:bg-red-900 hover:text-red-300 rounded-xl transition-colors">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-amber-700">
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">
              {navItems.find((n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label || "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative text-gray-500 hover:text-amber-700">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm">👤</div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-gray-800">{user?.name || "Admin"}</div>
                <div className="text-xs text-gray-400">{user?.email || "admin@srschairs.com"}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
