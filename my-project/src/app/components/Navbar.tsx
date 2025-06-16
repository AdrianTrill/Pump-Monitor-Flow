"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-[#182363] text-white px-10 py-4 flex items-center justify-between shadow">
      <div className="flex items-center gap-10">
        <span className="font-bold text-2xl tracking-tight">Pump Monitor</span>
        <div className="flex gap-1">
          <Link href="/" className={`px-5 py-2 rounded font-semibold ${pathname === "/" ? "bg-[#3D5DE8] text-white" : "hover:bg-[#2c3e8c] font-medium"}`}>Dashboard</Link>
          <Link href="/pumps" className={`px-5 py-2 rounded font-semibold ${pathname.startsWith("/pumps") ? "bg-[#3D5DE8] text-white" : "hover:bg-[#2c3e8c] font-medium"}`}>Pumps</Link>
          <Link href="/alerts" className={`px-5 py-2 rounded font-semibold ${pathname.startsWith("/alerts") ? "bg-[#3D5DE8] text-white" : "hover:bg-[#2c3e8c] font-medium"}`}>Alerts & Anomalies</Link>
          <Link href="/ai-assistant" className={`px-5 py-2 rounded font-semibold ${pathname.startsWith("/ai-assistant") ? "bg-[#3D5DE8] text-white" : "hover:bg-[#2c3e8c] font-medium"}`}>AI Assistant</Link>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <MagnifyingGlassIcon className="w-6 h-6" />
        <FunnelIcon className="w-6 h-6" />
        <Cog6ToothIcon className="w-6 h-6" />
      </div>
    </nav>
  );
} 