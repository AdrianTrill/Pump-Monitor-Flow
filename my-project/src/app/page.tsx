import React from "react";
import { MagnifyingGlassIcon, FunnelIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SystemHealthChart from "./components/SystemHealthChart";
import Link from "next/link";

const stats = [
  {
    label: "Total Pumps",
    value: 127,
    description: "Active units",
    border: "border-[#bfdbfe]",
    bg: "bg-[#eff6ff]",
  },
  {
    label: "Critical Alerts",
    value: 3,
    description: "Require immediate attention",
    border: "border-[#fca5a5]",
    bg: "bg-[#fef2f2]",
  },
  {
    label: "Predicted Failures",
    value: 8,
    description: "Next 30 days",
    border: "border-[#fde047]",
    bg: "bg-[#fefce8]",
  },
  {
    label: "System Health",
    value: "94%",
    description: "Overall performance",
    border: "border-[#86efac]",
    bg: "bg-[#f0fdf4]",
  },
];

const pumps = [
  {
    name: "Feed Pump A1",
    id: "P001",
    location: "Unit A",
    type: "Centrifugal",
    pressure: "45.2 psi",
    temp: "78°F",
    border: "border-[#86efac]",
    bg: "bg-[#f0fdf4]",
    dot: "bg-[#1c8f45]",
  },
  {
    name: "Booster Pump B3",
    id: "P002",
    location: "Unit B",
    type: "Centrifugal",
    pressure: "52.1 psi",
    temp: "92°F",
    border: "border-[#fde047]",
    bg: "bg-[#fefce8]",
    dot: "bg-[#fde047]",
  },
  {
    name: "Transfer Pump C2",
    id: "P003",
    location: "Unit C",
    type: "Reciprocating",
    pressure: "38.7 psi",
    temp: "105°F",
    border: "border-[#fca5a5]",
    bg: "bg-[#fef2f2]",
    dot: "bg-[#b20000]",
  },
  {
    name: "Circulation Pump A2",
    id: "P004",
    location: "Unit A",
    type: "Rotary",
    pressure: "41.3 psi",
    temp: "82°F",
    border: "border-[#86efac]",
    bg: "bg-[#f0fdf4]",
    dot: "bg-[#1c8f45]",
  },
  {
    name: "Main Feed Pump",
    id: "P005",
    location: "Unit B",
    type: "Centrifugal",
    pressure: "48.9 psi",
    temp: "88°F",
    border: "border-[#fde047]",
    bg: "bg-[#fefce8]",
    dot: "bg-[#fde047]",
  },
  {
    name: "Service Pump D1",
    id: "P006",
    location: "Unit C",
    type: "Rotary",
    pressure: "44.6 psi",
    temp: "76°F",
    border: "border-[#86efac]",
    bg: "bg-[#f0fdf4]",
    dot: "bg-[#1c8f45]",
  },
];

const healthData = [
  { time: "00:00", value: 94 },
  { time: "04:00", value: 93 },
  { time: "08:00", value: 96 },
  { time: "12:00", value: 94 },
  { time: "16:00", value: 95 },
  { time: "20:00", value: 96 },
  { time: "24:00", value: 95 },
];

function StatCard({ stat }: any) {
  return (
    <div
      className={`border ${stat.border} ${stat.bg} rounded-lg px-6 py-4 flex flex-col gap-1 shadow-sm min-w-[200px]`}
    >
      <div className={`text-2xl font-bold text-gray-900`}>{stat.value}</div>
      <div className="font-semibold text-gray-700">{stat.label}</div>
      <div className="text-xs text-gray-500">{stat.description}</div>
    </div>
  );
}

function PumpCard({ pump }: any) {
  return (
    <div
      className={`border-3 ${pump.border} ${pump.bg} rounded-lg px-5 py-4 flex flex-col gap-2 shadow min-w-[260px] relative`}
    >
      <div className="flex items-center justify-between">
        <div className={`font-semibold text-gray-900`}>{pump.name}</div>
        <span className={`w-3 h-3 rounded-full ${pump.dot}`}></span>
      </div>
      <div className="text-xs text-gray-700">
        ID: {pump.id} <br />
        Location: {pump.location} <br />
        Type: {pump.type}
      </div>
      <div className="flex justify-between text-sm font-semibold mt-2 text-gray-700">
        <span>Pressure: {pump.pressure}</span>
        <span>Temp: {pump.temp}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <main className="w-full px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-7">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">System Dashboard</h1>
          <div className="flex gap-3 justify-end">
            <select className="border border-gray-400 rounded px-3 py-2 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] placeholder-gray-500">
              <option className="text-gray-800">All Locations</option>
            </select>
            <select className="border border-gray-400 rounded px-3 py-2 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] placeholder-gray-500">
              <option className="text-gray-800">All Types</option>
            </select>
            <select className="border border-gray-400 rounded px-3 py-2 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] placeholder-gray-500">
              <option className="text-gray-800">All Severities</option>
            </select>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard stat={stat} key={i} />
          ))}
        </div>
        {/* Pump Status Overview */}
        <div className="bg-white rounded-lg p-7 mb-10 shadow">
          <h2 className="text-lg font-semibold mb-5 text-gray-900">Pump Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pumps.map((pump, i) => (
              <PumpCard pump={pump} key={i} />
            ))}
          </div>
        </div>
        {/* System Health Graph */}
        <div className="bg-white rounded-lg p-7 shadow">
          <h2 className="text-lg font-semibold mb-5 text-gray-900">System Health (24h)</h2>
          <SystemHealthChart />
        </div>
      </main>
    </div>
  );
}