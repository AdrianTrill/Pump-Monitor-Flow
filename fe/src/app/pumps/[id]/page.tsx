"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PumpTrendsChart from "./PumpTrendsChart";
import AnimatedCounter from "../../components/AnimatedCounter";

const maintenanceLogs = [
  { task: "Routine Inspection", date: "2024-06-10", status: "Completed" },
  { task: "Bearing Replacement", date: "2024-05-15", status: "Completed" },
  { task: "Oil Change", date: "2024-04-20", status: "Completed" },
  { task: "Scheduled Inspection", date: "2024-06-25", status: "Pending" },
];

const sensorDiagnostics = [
  { sensor: "Vibration Sensor", date: "2024-05-01", status: "Normal" },
  { sensor: "Temperature Sensor", date: "2024-05-01", status: "Normal" },
  { sensor: "Pressure Sensor", date: "2024-03-15", status: "Warning" },
  { sensor: "Flow Sensor", date: "2024-04-20", status: "Normal" },
];

const statusBadge = {
  Completed: "bg-[#d3ecd3] text-gray-900 border border-[#1c8f45]",
  Pending: "bg-[#fff6b4] text-gray-900 border border-[#bf7600]",
  Normal: "bg-[#d3ecd3] text-gray-900 border border-[#1c8f45]",
  Warning: "bg-[#fff6b4] text-gray-900 border border-[#bf7600]",
};

// --- Animation Variants ---
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const metricsVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const insightsVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
};

export default function PumpDetailsPage() {
  // Mock data for Feed Pump A1
  const pump = {
    name: "Feed Pump A1",
    id: "P001",
    location: "Unit A - Sector 3",
    status: "Normal",
    statusBg: "bg-[#d3ecd3]",
    vibration: 2.3,
    temperature: 78,
    pressure: 45.2,
    flowRate: 1250,
    power: 75.5,
    lastUpdated: "12:01:40 PM",
    ai: {
      predictedIssue: "Bearing wear detected. Flow rate declining gradually.",
      confidence: "85% Confidence",
      timeToFailure: "18 days",
      recommendations: [
        "Schedule bearing inspection",
        "Monitor flow rate closely",
        "Check alignment",
        "Review lubrication schedule",
      ],
      healthScore: 73,
      healthScoreTrend: "Declining from 89% last week",
    },
    historical: {
      averageUptime: "98.5%",
      totalRuntime: "8,760 hrs",
      efficiency: "87.2%",
    },
  };

  const vibrationData = [
    { time: "00:00", value: 1.9 },
    { time: "04:00", value: 2.1 },
    { time: "08:00", value: 2.4 },
    { time: "12:00", value: 2.3 },
    { time: "16:00", value: 2.0 },
    { time: "20:00", value: 2.1 },
    { time: "24:00", value: 2.2 },
  ];
  
  const tempData = [
    { time: "00:00", value: 78 },
    { time: "04:00", value: 79 },
    { time: "08:00", value: 80 },
    { time: "12:00", value: 80 },
    { time: "16:00", value: 79 },
    { time: "20:00", value: 78 },
    { time: "24:00", value: 78 },
  ];

  const [tab, setTab] = useState("historical");

  return (
    <motion.div 
      initial="hidden"
      animate="visible" 
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-6">
        <motion.div variants={headerVariants}>
          <Link href="/pumps" className="text-[#3D5DE8] text-sm font-medium hover:underline">&lt; Back to Pumps</Link>
        </motion.div>
        
        {/* Pump Header Card */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mt-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                {pump.name}
                <motion.span 
                  className="w-4 h-4 rounded-full bg-[#1c8f45] inline-block"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                />
              </h1>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="text-sm font-semibold text-gray-700">{pump.lastUpdated}</div>
            </div>
          </div>
          <div className="text-sm text-gray-700 mt-2">
            <span className="font-semibold">ID:</span> {pump.id} <span className="mx-2">|</span> 
            <span className="font-semibold">Location:</span> {pump.location}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Sensor Data + Trends */}
          <motion.div 
            variants={metricsVariants}
            className="col-span-2 flex flex-col h-full gap-4"
          >
            {/* Live Sensor Data Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 flex-1 flex flex-col"
            >
              <div className="text-base font-semibold text-gray-900 mb-4">Live Sensor Data</div>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={containerVariants}
              >
                <motion.div 
                  variants={itemVariants}
                  className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4]"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-xs text-gray-500 font-semibold mb-1">Vibration</div>
                  <div className="text-2xl font-bold text-[#182363]">
                    <AnimatedCounter to={pump.vibration} from={0} /> 
                    <span className="text-base font-bold">mm/s</span>
                  </div>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4]"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-xs text-gray-500 font-semibold mb-1">Temperature</div>
                  <div className="text-2xl font-bold text-[#182363]">
                    <AnimatedCounter to={pump.temperature} from={0} /> 
                    <span className="text-base font-bold">°F</span>
                  </div>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4]"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-xs text-gray-500 font-semibold mb-1">Pressure</div>
                  <div className="text-2xl font-bold text-[#182363]">
                    <AnimatedCounter to={pump.pressure} from={0} /> 
                    <span className="text-base font-bold">psi</span>
                  </div>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="border-2 border-[#fde047] rounded-lg p-4 flex flex-col justify-between bg-[#fefce8]"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-xs text-gray-500 font-semibold mb-1">Flow Rate</div>
                  <div className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter to={pump.flowRate} from={0} /> 
                    <span className="text-base font-bold">gpm</span>
                  </div>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4]"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-xs text-gray-500 font-semibold mb-1">Power</div>
                  <div className="text-2xl font-bold text-[#182363]">
                    <AnimatedCounter to={pump.power} from={0} /> 
                    <span className="text-base font-bold">kW</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Trends Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 flex-1 flex flex-col"
            >
              <div className="text-base font-semibold text-gray-900 mb-4">24-Hour Trends</div>
              <PumpTrendsChart vibrationData={vibrationData} tempData={tempData} />
            </motion.div>
          </motion.div>

          {/* Right Column: AI Insights */}
          <motion.div 
            variants={insightsVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col gap-4 h-full"
          >
            <div className="text-base font-semibold text-[#182363] mb-4">AI Insights</div>

            <motion.div 
              variants={itemVariants}
              className="bg-[#fefce8] border border-[#fde047] rounded p-3 flex justify-between items-center"
            >
              <div>
                <div className="text-xs text-gray-700 font-semibold mb-2">Predicted Issue</div>
                <div className="text-xs text-gray-500 font-semibold">{pump.ai.predictedIssue}</div>
              </div>
              <div className="text-xs text-gray-700 font-normal">{pump.ai.confidence}</div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-[#eff6ff] border border-[#bfdbfe] rounded p-3"
            >
              <div className="text-xs text-gray-700 font-semibold mb-1">Time to Failure</div>
              <div className="text-2xl font-bold text-[#182363] mb-1">{pump.ai.timeToFailure}</div>
              <div className="text-xs text-gray-500 font-semibold">Based on current degradation rate</div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white border border-[#e5e7eb] rounded p-3"
            >
              <div className="text-xs text-gray-700 font-semibold mb-3">Recommendations</div>
              <ul className="text-xs text-gray-700 list-disc pl-4">
                {pump.ai.recommendations.map((rec, i) => (
                  <motion.li 
                    key={i} 
                    variants={itemVariants}
                    className="mb-1"
                  >
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-[#f0fdf4] border border-[#86efac] rounded p-3"
            >
              <div className="text-xs text-gray-700 font-semibold mb-1">Health Score</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                <AnimatedCounter to={pump.ai.healthScore} from={0} />%
              </div>
              <div className="text-xs text-gray-500 font-semibold">{pump.ai.healthScoreTrend}</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Historical Data Tabs */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
        >
          <div className="flex gap-8 border-b mb-4">
            {['historical', 'maintenance', 'diagnostics'].map((tabName) => (
              <motion.button
                key={tabName}
                className={`pb-2 font-semibold capitalize ${tab === tabName ? "text-[#3D5DE8] border-b-2 border-[#3D5DE8]" : "text-gray-400"}`}
                onClick={() => setTab(tabName)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tabName === 'historical' ? 'Historical Data' : 
                 tabName === 'maintenance' ? 'Maintenance Logs' : 'Sensor Diagnostics'}
              </motion.button>
            ))}
          </div>
          
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "historical" && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="bg-[#f9fafb] rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Average Uptime</div>
                  <div className="text-xl font-bold text-[#182363]">98.5%</div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f9fafb] rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Total Runtime</div>
                  <div className="text-xl font-bold text-[#182363]">8,760 hrs</div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f9fafb] rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                  <div className="text-xl font-bold text-[#182363]">87.2%</div>
                </motion.div>
              </motion.div>
            )}
            
            {tab === "maintenance" && (
              <motion.div 
                className="flex flex-col gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {maintenanceLogs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="flex items-center justify-between bg-[#fcfcfc] border border-[#e5e7eb] rounded-lg px-6 py-4"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{log.task}</div>
                      <div className="text-xs text-gray-500">{log.date}</div>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusBadge[log.status as keyof typeof statusBadge]}`}>
                      {log.status}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {tab === "diagnostics" && (
              <motion.div 
                className="flex flex-col gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sensorDiagnostics.map((sensor, i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="flex items-center justify-between bg-[#fcfcfc] border border-[#e5e7eb] rounded-lg px-6 py-4"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{sensor.sensor}</div>
                      <div className="text-xs text-gray-500">Last calibrated: {sensor.date}</div>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusBadge[sensor.status as keyof typeof statusBadge]}`}>
                      {sensor.status}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}