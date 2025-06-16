"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const healthData = [
  { time: "00:00", value: 94 },
  { time: "04:00", value: 93 },
  { time: "08:00", value: 96 },
  { time: "12:00", value: 94 },
  { time: "16:00", value: 95 },
  { time: "20:00", value: 96 },
  { time: "24:00", value: 95 },
];

export default function SystemHealthChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={healthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 14 }} axisLine={false} tickLine={false} />
          <YAxis domain={[90, 100]} tick={{ fill: '#6b7280', fontSize: 14 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 14 }} />
          <Line type="monotone" dataKey="value" stroke="#182363" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 