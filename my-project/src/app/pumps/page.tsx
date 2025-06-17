"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronUp, ChevronDown } from 'lucide-react';

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

// --- Status Indicator Component ---
const StatusBadge = ({ status }: { status: PumpStatus }) => {
  const styles = {
    ok: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-2 ${styles[status]}`}>
      <span className={`h-2 w-2 rounded-full ${styles[status].replace('-100', '-500').replace('text-', 'bg-')}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
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

// --- Main Pumps Page Component ---
export default function PumpsPage() {
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
    <th onClick={() => requestSort(tkey)} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100">
        <div className="flex items-center gap-1">
            {title}
            {sortConfig?.key === tkey && (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
        </div>
    </th>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-12rem)] flex flex-col">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Pumps Overview</h1>
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <SortableHeader tkey="name" title="Pump Name" />
              <SortableHeader tkey="location" title="Location" />
              <SortableHeader tkey="status" title="Status" />
              <SortableHeader tkey="pressure" title="Pressure (psi)" />
              <SortableHeader tkey="temperature" title="Temp (°F)" />
              <SortableHeader tkey="vibration" title="Vibration (g)" />
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Performance (7d)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedPumps.map((pump, index) => (
              <motion.tr
                key={pump.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{pump.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{pump.location}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={pump.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{pump.pressure.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{pump.temperature}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{pump.vibration.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Sparkline data={pump.performance} color={pump.status === 'ok' ? '#10b981' : pump.status === 'warning' ? '#f59e0b' : '#ef4444'} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}