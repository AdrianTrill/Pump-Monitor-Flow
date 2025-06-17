"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import AnimatedCounter from "./components/AnimatedCounter";
import SystemHealthChart from "./components/SystemHealthChart";

// --- SVG Icons for PumpCard ---
const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
);

const GaugeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
        <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>
    </svg>
);


// --- Main Page Data ---
const stats = [
  { label: "Total Pumps", value: 127, description: "Active units", border: "border-blue-200", bg: "bg-blue-50", text: "text-blue-800" },
  { label: "Critical Alerts", value: 3, description: "Require immediate attention", border: "border-red-300", bg: "bg-red-50", text: "text-red-600" },
  { label: "Predicted Failures", value: 8, description: "Next 30 days", border: "border-yellow-300", bg: "bg-yellow-50", text: "text-yellow-600" },
  { label: "System Health", value: "94%", description: "Overall performance", border: "border-green-300", bg: "bg-green-50", text: "text-green-600" },
];

const pumps: PumpCardProps[] = [
    { name: "Feed Pump A1", id: "P001", location: "Unit A", type: "Centrifugal", pressure: "45.2 psi", temp: "78°F", status: 'ok' },
    { name: "Booster Pump B3", id: "P002", location: "Unit B", type: "Centrifugal", pressure: "52.1 psi", temp: "92°F", status: 'warning' },
    { name: "Transfer Pump C2", id: "P003", location: "Unit C", type: "Reciprocating", pressure: "38.7 psi", temp: "105°F", status: 'critical' },
    { name: "Circulation Pump A2", id: "P004", location: "Unit A", type: "Rotary", pressure: "41.3 psi", temp: "82°F", status: 'ok' },
    { name: "Main Feed Pump", id: "P005", location: "Unit B", type: "Centrifugal", pressure: "48.9 psi", temp: "88°F", status: 'warning' },
    { name: "Service Pump D1", id: "P006", location: "Unit C", type: "Rotary", pressure: "44.6 psi", temp: "76°F", status: 'ok' },
];

type StatCardProps = (typeof stats)[0];
type PumpCardProps = {
    name: string;
    id: string;
    location: string;
    type: string;
    pressure: string;
    temp: string;
    status: 'ok' | 'warning' | 'critical';
};


// --- Reusable Card Components ---
function StatCard({ label, value, description, border, bg, text }: StatCardProps) {
  const isPercentage = typeof value === 'string' && value.includes('%');
  const numericValue = isPercentage ? parseFloat(value) : (value as number);

  return (
    <div className={`border ${border} ${bg} rounded-xl px-6 py-4 flex flex-col gap-1 shadow-md min-w-[200px]`}>
      <div className={`text-3xl font-bold ${text}`}>
        {isPercentage ? <><AnimatedCounter to={numericValue} />%</> : <AnimatedCounter to={numericValue} />}
      </div>
      <div className="font-semibold text-gray-900">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
}

// Enhanced PumpCard with colored background and subtle shine animation
function PumpCard({ name, id, location, type, pressure, temp, status }: PumpCardProps) {
  const statusStyles = {
    ok: { text: "text-green-800", dot: "bg-green-500", border: "border-green-300", bg: "bg-green-50" },
    warning: { text: "text-yellow-800", dot: "bg-yellow-500", border: "border-yellow-300", bg: "bg-yellow-50" },
    critical: { text: "text-red-800", dot: "bg-red-500", border: "border-red-300", bg: "bg-red-50" },
  };
  const currentStatus = statusStyles[status];

  const shineVariants: Variants = {
    rest: { x: "-110%", skewX: '-25deg' },
    hover: { x: "110%", transition: { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] } }
  };

  return (
    <div className={`border ${currentStatus.border} ${currentStatus.bg} rounded-xl p-4 h-full flex flex-col gap-3 relative overflow-hidden shadow-lg`}>
      <motion.div
        className="absolute top-0 left-0 w-3/4 h-full opacity-0 group-hover:opacity-100"
        style={{ background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)" }}
        variants={shineVariants}
      />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className={`font-semibold ${currentStatus.text}`}>{name}</div>
        <span className={`w-3 h-3 rounded-full ${currentStatus.dot} relative flex items-center justify-center`}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatus.dot} opacity-75`}></span>
        </span>
      </div>
      <div className="relative z-10 text-xs text-gray-500 border-t border-gray-200/80 pt-2">
          ID: <span className="font-medium text-slate-600">{id}</span><br />
          Location: <span className="font-medium text-slate-600">{location}</span><br />
          Type: <span className="font-medium text-slate-600">{type}</span>
      </div>
      <div className="relative z-10 flex justify-between text-sm font-semibold mt-auto text-gray-800">
          <div className="flex items-center gap-2">
              <GaugeIcon />
              <span className="text-slate-700">{pressure}</span>
          </div>
          <div className="flex items-center gap-2">
              <ThermometerIcon />
              <span className="text-slate-700">{temp}</span>
          </div>
      </div>
    </div>
  );
}

// --- Framer Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const headerVariants: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardWrapperVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -8, scale: 1.03 }
};

// --- Main Exported Component ---
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <main className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <motion.div variants={headerVariants} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <h1 className="text-4xl font-bold text-slate-800">System Dashboard</h1>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <select className="border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] transition-all">
              <option>All Locations</option>
            </select>
            <select className="border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] transition-all">
              <option>All Types</option>
            </select>
            <select className="border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] transition-all">
              <option>All Severities</option>
            </select>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-12" variants={containerVariants} initial="hidden" animate="visible">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Pump Status Overview</h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
            {pumps.map((pump, i) => (
              <motion.div key={i} variants={itemVariants} className="h-full">
                  <motion.a 
                    href="#" 
                    className="cursor-pointer block h-full group" 
                    variants={cardWrapperVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ y: 0, scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <PumpCard {...pump} />
                  </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">System Health (24h)</h2>
          <SystemHealthChart />
        </div>
      </main>
    </div>
  );
}