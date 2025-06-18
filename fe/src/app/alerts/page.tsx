"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import AnimatedCounter from "../components/AnimatedCounter";

const alerts = [
  {
    pump: "Transfer Pump C2",
    status: "Active",
    badge: "border border-[#b20000] text-[#b20000] bg-transparent",
    message: "Temperature spike detected - 105°F",
    details: [
      { label: "Pump ID:", value: "P003", color: "text-gray-500" },
      { label: "Type:", value: "temperature", color: "text-gray-500" },
      { label: "Time:", value: "2024-06-13 14:23:15", color: "text-gray-500" },
    ],
    rul: "5 days",
    confidence: "92%",
    border: "border-l-4 border-[#da5344]",
    bg: "bg-[#fbedec]",
    priority: "Critical",
    icon: ExclamationTriangleIcon,
    iconColor: "text-red-600",
  },
  {
    pump: "Booster Pump B3",
    status: "Acknowledged",
    badge: "border border-[#bf7600] text-[#bf7600] bg-transparent",
    message: "Vibration levels elevated",
    details: [
      { label: "Pump ID:", value: "P002", color: "text-gray-500" },
      { label: "Type:", value: "vibration", color: "text-gray-500" },
      { label: "Time:", value: "2024-06-13 12:45:22", color: "text-gray-500" },
    ],
    rul: "12 days",
    confidence: "87%",
    border: "border-l-4 border-[#bf7600]",
    bg: "bg-[#fff6b4]",
    priority: "High",
    icon: ClockIcon,
    iconColor: "text-yellow-600",
  },
  {
    pump: "Main Feed Pump",
    status: "Active",
    badge: "border border-[#b20000] text-[#b20000] bg-transparent",
    message: "Flow rate below optimal range",
    details: [
      { label: "Pump ID:", value: "P005", color: "text-gray-500" },
      { label: "Type:", value: "flow", color: "text-gray-500" },
      { label: "Time:", value: "2024-06-13 10:15:33", color: "text-gray-500" },
    ],
    rul: "18 days",
    confidence: "75%",
    border: "border-l-4 border-[#eab308]",
    bg: "bg-[#fefce8]",
    priority: "Medium",
    icon: ExclamationTriangleIcon,
    iconColor: "text-yellow-500",
  },
  {
    pump: "Feed Pump A1",
    status: "Resolved",
    badge: "border border-[#1c8f45] text-[#1c8f45] bg-transparent",
    message: "Pressure fluctuation detected",
    details: [
      { label: "Pump ID:", value: "P001", color: "text-gray-500" },
      { label: "Type:", value: "pressure", color: "text-gray-500" },
      { label: "Time:", value: "2024-06-12 16:30:45", color: "text-gray-500" },
    ],
    rul: "45 days",
    confidence: "65%",
    border: "border-l-4 border-[#3b82f6]",
    bg: "bg-[#dbeafe]",
    priority: "Low",
    icon: CheckCircleIcon,
    iconColor: "text-green-600",
  },
];

// --- Summary Stats ---
const alertStats = [
  { 
    label: "Total Alerts", 
    value: alerts.length, 
    description: "Active & acknowledged", 
    color: "text-slate-700", 
    bg: "bg-slate-50", 
    border: "border-slate-200",
    icon: ExclamationTriangleIcon,
    iconColor: "text-slate-600"
  },
  { 
    label: "Critical Alerts", 
    value: alerts.filter(a => a.priority === 'Critical').length, 
    description: "Immediate attention", 
    color: "text-red-600", 
    bg: "bg-red-50", 
    border: "border-red-200",
    icon: ExclamationTriangleIcon,
    iconColor: "text-red-500"
  },
  { 
    label: "Active Alerts", 
    value: alerts.filter(a => a.status === 'Active').length, 
    description: "Require action", 
    color: "text-orange-600", 
    bg: "bg-orange-50", 
    border: "border-orange-200",
    icon: ClockIcon,
    iconColor: "text-orange-500"
  },
  { 
    label: "Resolved Today", 
    value: alerts.filter(a => a.status === 'Resolved').length, 
    description: "Issues fixed", 
    color: "text-green-600", 
    bg: "bg-green-50", 
    border: "border-green-200",
    icon: CheckCircleIcon,
    iconColor: "text-green-500"
  },
];

// --- Animation Variants ---
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const headerVariants: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const alertVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  hover: { 
    scale: 1.02, 
    transition: { type: "spring", stiffness: 300 } 
  },
};

// --- Alert Summary Card Component ---
function AlertSummaryCard({ label, value, description, color, bg, border, icon: Icon, iconColor }: typeof alertStats[0]) {
  return (
    <motion.div 
      className={`border ${border} ${bg} rounded-xl px-6 py-4 shadow-sm`}
      whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`text-3xl font-bold ${color}`}>
          <AnimatedCounter to={value} />
        </div>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <div className="font-semibold text-gray-900 mb-1">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </motion.div>
  );
}

export default function AlertsPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    priority: "All Priorities",
    type: "All Types",
    status: "All Status"
  });

  return (
    <motion.div 
      initial="hidden"
      animate="visible" 
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        
        {/* Page Header */}
        <motion.div variants={headerVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Alerts & Anomalies</h1>
          <p className="text-slate-600">Monitor critical events and system anomalies across all pump systems</p>
        </motion.div>

        {/* Alert Summary Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-12" 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
        >
          {alertStats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <AlertSummaryCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div className="text-lg font-semibold text-slate-700">
            Recent Alerts
          </div>
          <div className="flex flex-wrap gap-4">
            {Object.entries(selectedFilters).map(([key, value]) => (
              <motion.select 
                key={key}
                className="border border-gray-300 rounded-lg px-4 py-2 text-base font-normal text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] shadow-sm"
                value={value}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, [key]: e.target.value }))}
                whileFocus={{ scale: 1.02 }}
              >
                <option>{value}</option>
              </motion.select>
            ))}
          </div>
        </motion.div>

        {/* Alerts List */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
          variants={itemVariants}
        >
          <motion.div 
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                variants={alertVariants}
                className={`rounded-xl flex flex-col md:flex-row md:items-center justify-between ${alert.bg} ${alert.border} p-6 shadow-sm border border-white/20`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <alert.icon className={`w-5 h-5 ${alert.iconColor}`} />
                    <span className="font-bold text-lg text-gray-900">{alert.pump}</span>
                    <motion.span 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${alert.badge}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    >
                      {alert.status}
                    </motion.span>
                    <motion.span 
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        alert.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        alert.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 + 0.4 }}
                    >
                      {alert.priority}
                    </motion.span>
                  </div>
                  <div className="text-base text-gray-900 mb-2 font-medium">{alert.message}</div>
                  <div className="text-xs text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
                    {alert.details.map((d, idx) => (
                      <span key={idx} className="flex items-center">
                        <span className="font-semibold mr-1">{d.label}</span>
                        <span className={`${d.color} font-semibold`}>{d.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <motion.div 
                  className="flex flex-col items-end min-w-[140px] mt-4 md:mt-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                >
                  <span className="font-bold text-sm text-gray-900 mb-1">RUL: {alert.rul}</span>
                  <span className="text-xs text-gray-500 font-semibold mb-3">Confidence: {alert.confidence}</span>
                  <div className="flex gap-2">
                    {alert.status !== 'Resolved' && (
                      <>
                        <motion.button
                          className="px-3 py-1 bg-[#3D5DE8] text-white text-xs font-medium rounded-lg hover:bg-[#274bb6] transition-colors shadow-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {alert.status === 'Active' ? 'Acknowledge' : 'Resolve'}
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Dismiss
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}