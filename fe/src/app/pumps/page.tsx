"use client";

import React, { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronUp, ChevronDown, Eye } from 'lucide-react';
import AnimatedCounter from "../components/AnimatedCounter";

type PumpStatus = 'ok' | 'warning' | 'critical';
type Pump = {
  id: string;
  name: string;
  location: string;
  pressure: number;
  temperature: number;
  vibration: number;
  status: PumpStatus;
  performance: number[];
};

// --- Mock Data for the Pumps Page ---
const allPumps: Pump[] = [
  { id: "P001", name: "Feed Pump A1", location: "Unit A", pressure: 45.2, temperature: 78, vibration: 1.2, status: 'ok', performance: [5, 6, 5, 7, 8, 6, 7] },
  { id: "P002", name: "Booster Pump B3", location: "Unit B", pressure: 52.1, temperature: 92, vibration: 2.5, status: 'warning', performance: [8, 7, 9, 10, 8, 9, 10] },
  { id: "P003", name: "Transfer Pump C2", location: "Unit C", pressure: 38.7, temperature: 105, vibration: 4.1, status: 'critical', performance: [12, 13, 11, 14, 15, 14, 13] },
  { id: "P004", name: "Circulation Pump A2", location: "Unit A", pressure: 41.3, temperature: 82, vibration: 1.5, status: 'ok', performance: [6, 7, 6, 8, 7, 8, 7] },
  { id: "P005", name: "Main Feed Pump", location: "Unit B", pressure: 48.9, temperature: 88, vibration: 2.1, status: 'warning', performance: [9, 8, 10, 9, 11, 10, 9] },
  { id: "P006", name: "Service Pump D1", location: "Unit C", pressure: 44.6, temperature: 76, vibration: 1.1, status: 'ok', performance: [5, 6, 5, 6, 7, 6, 5] },
  { id: "P007", name: "Coolant Pump A3", location: "Unit A", pressure: 46.1, temperature: 79, vibration: 1.3, status: 'ok', performance: [7, 6, 8, 7, 8, 7, 8] },
  { id: "P008", name: "Reserve Pump B1", location: "Unit B", pressure: 50.5, temperature: 95, vibration: 3.2, status: 'critical', performance: [11, 12, 10, 13, 14, 12, 13] },
  { id: "P009", name: "Auxiliary Pump C4", location: "Unit C", pressure: 40.2, temperature: 85, vibration: 1.8, status: 'warning', performance: [10, 9, 11, 10, 9, 11, 10] },
];

// --- Summary Stats ---
const summaryStats = [
  { label: "Total Pumps", value: allPumps.length, description: "Active units", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { label: "Normal Status", value: allPumps.filter(p => p.status === 'ok').length, description: "Operating normally", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { label: "Warning Status", value: allPumps.filter(p => p.status === 'warning').length, description: "Require attention", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  { label: "Critical Status", value: allPumps.filter(p => p.status === 'critical').length, description: "Immediate action needed", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
];

// --- Animation Variants ---
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

const tableVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } },
};

// --- Status Indicator Component ---
const StatusBadge = ({ status }: { status: PumpStatus }) => {
  const styles = {
    ok: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border inline-flex items-center gap-2 ${styles[status]}`}>
      <span className={`h-2 w-2 rounded-full ${styles[status].replace('-100', '-500').replace('text-', 'bg-').replace('border-', 'bg-')}`}></span>
      {status === 'ok' ? 'Normal' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// --- Mini Sparkline Chart Component ---
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const formattedData = data.map((value, index) => ({ name: index, value }));
    return(
        <div className="w-28 h-10">
            <ResponsiveContainer>
                <AreaChart data={formattedData}>
                    <defs>
                        <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
                            <stop offset="100%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#sparkline-${color})`} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Summary Card Component ---
function SummaryCard({ label, value, description, color, bg, border }: typeof summaryStats[0]) {
  return (
    <div className={`border ${border} ${bg} rounded-xl px-6 py-4 shadow-sm`}>
      <div className={`text-3xl font-bold ${color} mb-1`}>
        <AnimatedCounter to={value} />
      </div>
      <div className="font-semibold text-gray-900 mb-1">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
}

// --- Main Pumps Page Component ---
export default function PumpsPage() {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Pump; direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' });

  const sortedPumps = useMemo(() => {
    let sortableItems = [...allPumps];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  const requestSort = (key: keyof Pump) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const SortableHeader = ({ tkey, title }: {tkey: keyof Pump, title: string}) => (
    <th onClick={() => requestSort(tkey)} className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1">
            {title}
            {sortConfig?.key === tkey && (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
        </div>
    </th>
  );

  const handleViewPump = (pumpId: string) => {
    router.push(`/pumps/${pumpId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        
        {/* Page Header */}
        <motion.div 
          variants={headerVariants} 
          initial="hidden" 
          animate="visible" 
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Pumps Overview</h1>
          <p className="text-slate-600">Monitor and manage all pump systems across your facility</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-12" 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
        >
          {summaryStats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}>
              <SummaryCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Pumps Table */}
        <motion.div 
          variants={tableVariants}
          initial="hidden" 
          animate="visible"
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-800">All Pumps</h2>
            <p className="text-sm text-slate-600 mt-1">Complete list of pumps with real-time status and performance data</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <SortableHeader tkey="name" title="Pump Name" />
                  <SortableHeader tkey="location" title="Location" />
                  <SortableHeader tkey="status" title="Status" />
                  <SortableHeader tkey="pressure" title="Pressure (psi)" />
                  <SortableHeader tkey="temperature" title="Temp (°F)" />
                  <SortableHeader tkey="vibration" title="Vibration (g)" />
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Performance (7d)</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {sortedPumps.map((pump, index) => (
                  <motion.tr
                    key={pump.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{pump.name}</div>
                      <div className="text-xs text-slate-500">{pump.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">{pump.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={pump.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{pump.pressure.toFixed(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{pump.temperature}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{pump.vibration.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <Sparkline 
                          data={pump.performance} 
                          color={pump.status === 'ok' ? '#10b981' : pump.status === 'warning' ? '#f59e0b' : '#ef4444'} 
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <motion.button
                        onClick={() => handleViewPump(pump.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-[#3D5DE8] text-white text-xs font-medium rounded-lg hover:bg-[#274bb6] transition-colors shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}