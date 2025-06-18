"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import PumpTrendsChart from "./PumpTrendsChart";
import AnimatedCounter from "../../components/AnimatedCounter";
import { apiClient } from "../../lib/api-client";

interface PumpData {
  id: string;
  name: string;
  location: string;
  pump_type: string;
  status: string;
  pressure: number;
  temperature: number;
  vibration: number;
  flow_rate: number;
  power: number;
  total_runtime: number;
  average_uptime: number;
  efficiency: number;
  health_score: number;
  predicted_failure_days: number;
  confidence: number;
  predicted_issue: string;
}

interface MaintenanceLog {
  task: string;
  date: string;
  status: string;
  technician: string;
}

interface SensorData {
  time: string;
  value: number;
}

const statusBadge = {
  Completed: "bg-[#d3ecd3] text-gray-900 border border-[#1c8f45]",
  Pending: "bg-[#fff6b4] text-gray-900 border border-[#bf7600]",
  Scheduled: "bg-[#fff6b4] text-gray-900 border border-[#bf7600]",
  Urgent: "bg-[#ffd3d3] text-gray-900 border border-[#b20000]",
  Normal: "bg-[#d3ecd3] text-gray-900 border border-[#1c8f45]",
  Warning: "bg-[#fff6b4] text-gray-900 border border-[#bf7600]",
  Critical: "bg-[#ffd3d3] text-gray-900 border border-[#b20000]",
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

export default function PumpDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() for Next.js 15
  const { id } = use(params);
  
  const [pump, setPump] = useState<PumpData | null>(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [vibrationData, setVibrationData] = useState<SensorData[]>([]);
  const [tempData, setTempData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("historical");

  const sensorDiagnostics = [
    { sensor: "Vibration Sensor", date: "2024-05-01", status: "Normal" },
    { sensor: "Temperature Sensor", date: "2024-05-01", status: "Normal" },
    { sensor: "Pressure Sensor", date: "2024-03-15", status: pump?.status === "Critical" ? "Warning" : "Normal" },
    { sensor: "Flow Sensor", date: "2024-04-20", status: "Normal" },
  ];

  useEffect(() => {
    const fetchPumpData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch pump details
        const pumpResponse = await apiClient.getPumpDetails(id);
        if (pumpResponse.error) {
          setError(`Pump ${id} not found`);
          return;
        }
        setPump(pumpResponse.data as PumpData);

        // Fetch maintenance logs
        const maintenanceResponse = await apiClient.getPumpMaintenance(id);
        if (maintenanceResponse.data && typeof maintenanceResponse.data === 'object' && 'maintenance_logs' in maintenanceResponse.data) {
          const logs = (maintenanceResponse.data as any).maintenance_logs.map((log: any) => ({
            task: log.task,
            date: new Date(log.date).toLocaleDateString(),
            status: log.status,
            technician: log.technician,
          }));
          setMaintenanceLogs(logs);
        }

        // Fetch trends data
        const trendsResponse = await apiClient.getPumpTrends(id);
        if (trendsResponse.data && typeof trendsResponse.data === 'object' && 'sensor_data' in trendsResponse.data) {
          const sensorData = (trendsResponse.data as any).sensor_data;
          
          // Convert to chart format
          const vibData = sensorData.slice(0, 7).map((item: any, index: number) => ({
            time: `${index * 4}:00`,
            value: item.vibration
          }));
          
          const tempDataChart = sensorData.slice(0, 7).map((item: any, index: number) => ({
            time: `${index * 4}:00`,
            value: item.temperature
          }));

          setVibrationData(vibData);
          setTempData(tempDataChart);
        }

      } catch (err) {
        console.error("Error fetching pump data:", err);
        setError("Failed to load pump data");
      } finally {
        setLoading(false);
      }
    };

    fetchPumpData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3D5DE8] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pump details...</p>
        </div>
      </div>
    );
  }

  if (error || !pump) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || "Pump not found"}</p>
          <Link href="/pumps" className="text-[#3D5DE8] hover:underline">
            ← Back to Pumps
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'bg-[#d3ecd3] border-[#1c8f45]';
      case 'warning': return 'bg-[#fff6b4] border-[#bf7600]';
      case 'critical': return 'bg-[#ffd3d3] border-[#b20000]';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getCardColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'border-[#fca5a5] bg-[#fef2f2]';
      case 'warning': return 'border-[#fde047] bg-[#fefce8]';
      default: return 'border-[#86efac] bg-[#f0fdf4]';
    }
  };

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
                  className={`w-4 h-4 rounded-full ${
                    pump.status === 'Normal' ? 'bg-[#1c8f45]' :
                    pump.status === 'Warning' ? 'bg-[#bf7600]' : 'bg-[#b20000]'
                  } inline-block`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                />
              </h1>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="text-sm font-semibold text-gray-700">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-700 mt-2">
            <span className="font-semibold">ID:</span> {pump.id} <span className="mx-2">|</span> 
            <span className="font-semibold">Location:</span> {pump.location} <span className="mx-2">|</span>
            <span className="font-semibold">Type:</span> {pump.pump_type}
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
                  className={`border-2 rounded-lg p-4 flex flex-col justify-between ${getCardColor(pump.status)}`}
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
                  className={`border-2 rounded-lg p-4 flex flex-col justify-between ${getCardColor(pump.status)}`}
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
                  className={`border-2 rounded-lg p-4 flex flex-col justify-between ${getCardColor(pump.status)}`}
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
                    <AnimatedCounter to={pump.flow_rate} from={0} /> 
                    <span className="text-base font-bold">gpm</span>
                  </div>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className={`border-2 rounded-lg p-4 flex flex-col justify-between ${getCardColor(pump.status)}`}
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
              className={`${getStatusColor(pump.status)} border rounded p-3 flex justify-between items-center`}
            >
              <div>
                <div className="text-xs text-gray-700 font-semibold mb-2">Predicted Issue</div>
                <div className="text-xs text-gray-500 font-semibold">{pump.predicted_issue}</div>
              </div>
              <div className="text-xs text-gray-700 font-normal">{pump.confidence}% Confidence</div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-[#eff6ff] border border-[#bfdbfe] rounded p-3"
            >
              <div className="text-xs text-gray-700 font-semibold mb-1">Time to Failure</div>
              <div className="text-2xl font-bold text-[#182363] mb-1">
                <AnimatedCounter to={pump.predicted_failure_days} /> days
              </div>
              <div className="text-xs text-gray-500 font-semibold">Based on current degradation rate</div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-[#f0fdf4] border border-[#86efac] rounded p-3"
            >
              <div className="text-xs text-gray-700 font-semibold mb-1">Health Score</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                <AnimatedCounter to={pump.health_score} from={0} />%
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                {pump.health_score >= 80 ? 'Excellent condition' :
                 pump.health_score >= 60 ? 'Good condition' :
                 pump.health_score >= 40 ? 'Needs attention' : 'Critical condition'}
              </div>
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
                  <div className="text-xl font-bold text-[#182363]">
                    <AnimatedCounter to={pump.average_uptime} />%
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f9fafb] rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Total Runtime</div>
                  <div className="text-xl font-bold text-[#182363]">
                    <AnimatedCounter to={pump.total_runtime} /> hrs
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f9fafb] rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                  <div className="text-xl font-bold text-[#182363]">
                    <AnimatedCounter to={pump.efficiency} />%
                  </div>
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
                {maintenanceLogs.length > 0 ? maintenanceLogs.map((log, i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="flex items-center justify-between bg-[#fcfcfc] border border-[#e5e7eb] rounded-lg px-6 py-4"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{log.task}</div>
                      <div className="text-xs text-gray-500">{log.date}</div>
                      <div className="text-xs text-gray-600">Technician: {log.technician}</div>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusBadge[log.status as keyof typeof statusBadge]}`}>
                      {log.status}
                    </span>
                  </motion.div>
                )) : (
                  <div className="text-center text-gray-500 py-8">No maintenance logs found for this pump.</div>
                )}
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