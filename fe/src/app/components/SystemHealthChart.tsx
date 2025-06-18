"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const healthData = [
  { time: "00:00", value: 94 }, { time: "04:00", value: 93 },
  { time: "08:00", value: 96 }, { time: "12:00", value: 94 },
  { time: "16:00", value: 95 }, { time: "20:00", value: 96 },
  { time: "24:00", value: 94.5 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200">
        <p className="label font-bold text-slate-700">{`${label}`}</p>
        <p className="intro text-sm text-[#3D5DE8]">{`Health: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default function SystemHealthChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8 }}
      className="h-[350px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={healthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3D5DE8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3D5DE8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[85, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="#3D5DE8" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}