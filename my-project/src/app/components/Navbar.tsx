"use client";

import React from "react";
import { motion } from "framer-motion";
// IMPORTANT: The following import will cause an error in this preview environment
// because it does not have the Next.js framework. However, this is the
// correct import for a real Next.js application.
import { useRouter, usePathname } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

// --- Data for Navigation Items ---
const navItems = [
  { href: "/", text: "Dashboard" },
  { href: "/pumps", text: "Pumps" },
  { href: "/alerts", text: "Alerts & Anomalies" },
  { href: "/ai-assistant", text: "AI Assistant" },
];

// --- The Enhanced Navbar Component ---
export default function Navbar() {
  // Get the current path from the Next.js router
  const pathname = usePathname();

  return (
    <nav className="bg-[#182363] text-white px-10 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
      {/* Left Section: Logo and Navigation */}
      <div className="flex items-center gap-10">
        <span className="font-bold text-2xl tracking-tight text-white">
          Pump Monitor
        </span>
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              text={item.text}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </div>

      {/* Right Section: Action Icons */}
      <div className="flex items-center gap-5">
        <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <MagnifyingGlassIcon className="w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition-colors" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <FunnelIcon className="w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition-colors" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Cog6ToothIcon className="w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition-colors" />
        </motion.div>
      </div>
    </nav>
  );
}

// --- Sub-component for each Navigation Item ---
type NavItemProps = {
  href: string;
  text: string;
  isActive: boolean;
};

function NavItem({ href, text, isActive }: NavItemProps) {
  // Get the router instance to handle navigation
  const router = useRouter();

  return (
    <motion.a
      href={href}
      onClick={(e) => {
        e.preventDefault(); // Prevent a full page reload
        router.push(href);  // Navigate using Next.js router
      }}
      className="relative px-5 py-2 rounded-md text-sm font-medium"
      animate={{ color: isActive ? "#FFFFFF" : "#d1d5db" /* text-gray-300 */ }}
      whileHover={{ color: "#FFFFFF" }}
      transition={{ duration: 0.3 }}
    >
      {/* Hover background for inactive items */}
      {!isActive && (
          <motion.div
            className="absolute inset-0 bg-[#2c3e8c] rounded-md"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
      )}

      {/* The animated background indicator for the active link */}
      {isActive && (
        <motion.div
          layoutId="active-nav-indicator" // This ID links the animation between items
          className="absolute inset-0 bg-[#3D5DE8] rounded-md"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      
      {/* The visible text needs a relative z-index to appear above the backgrounds */}
      <span className="relative z-10">{text}</span>
    </motion.a>
  );
}