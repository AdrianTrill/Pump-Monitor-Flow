"use client";
import React, { useState } from "react";
import Link from "next/link";
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
  Completed: "bg-[#d3ecd3] text-[#1c8f45] border border-[#1c8f45]",
  Pending: "bg-[#fff6b4] text-[#bf7600] border border-[#bf7600]",
  Normal: "bg-[#d3ecd3] text-[#1c8f45] border border-[#1c8f45]",
  Warning: "bg-[#fff6b4] text-[#bf7600] border border-[#bf7600]",
};

export default function PumpDetailsPage() {
  // Mock data for Feed Pump A1
  const pump = {
    name: "Feed Pump A1",
    id: "P001",
    location: "Unit A - Sector 3",
    status: "Normal",
    statusColor: "text-[#1c8f45]",
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
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <Link href="/pumps" className="text-[#3D5DE8] text-sm font-medium hover:underline">&lt; Back to Pumps</Link>
        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-[#182363] flex items-center gap-2">
            {pump.name}
            <span className="ml-2 w-3 h-3 rounded-full bg-[#1c8f45] inline-block"></span>
          </h1>
          <div className="text-sm text-gray-700 mt-1">
            <span className="font-semibold">ID:</span> {pump.id} <span className="mx-2">|</span> <span className="font-semibold">Location:</span> {pump.location}
          </div>
        </div>
        <div className="flex justify-end text-xs text-gray-500 mb-2">Last Updated <span className="ml-1 font-semibold text-gray-700">{pump.lastUpdated}</span></div>
        {/* Sensor Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg p-6 mb-4">
              <div className="text-base font-semibold text-[#182363] mb-4">Live Sensor Data</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4]">
                  <div className="text-xs text-gray-500">Vibration</div>
                  <div className="text-2xl font-bold text-[#182363]">{pump.vibration} <span className="text-base font-medium">mm/s</span></div>
                </div>
                <div className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4]">
                  <div className="text-xs text-gray-500">Temperature</div>
                  <div className="text-2xl font-bold text-[#182363]">{pump.temperature} <span className="text-base font-medium">°F</span></div>
                </div>
                <div className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4]">
                  <div className="text-xs text-gray-500">Pressure</div>
                  <div className="text-2xl font-bold text-[#182363]">{pump.pressure} <span className="text-base font-medium">psi</span></div>
                </div>
                <div className="border-2 border-[#fde047] rounded-lg p-4 flex flex-col justify-between bg-[#fefce8]">
                  <div className="text-xs text-gray-500">Flow Rate</div>
                  <div className="text-2xl font-bold text-[#bfa100]">{pump.flowRate} <span className="text-base font-medium">gpm</span></div>
                </div>
                <div className="border-2 border-[#86efac] rounded-lg p-4 flex flex-col justify-between bg-[#f0fdf4] col-span-2 md:col-span-4">
                  <div className="text-xs text-gray-500">Power</div>
                  <div className="text-2xl font-bold text-[#182363]">{pump.power} <span className="text-base font-medium">kW</span></div>
                </div>
              </div>
              <div className="text-base font-semibold text-[#182363] mb-4">24-Hour Trends</div>
              <PumpTrendsChart vibrationData={vibrationData} tempData={tempData} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
            <div className="text-base font-semibold text-[#182363] mb-4">AI Insights</div>
            <div className="bg-[#fefce8] border border-[#fde047] rounded p-3 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-700 font-semibold">Predicted Issue</div>
                <div className="text-xs text-gray-700">{pump.ai.predictedIssue}</div>
              </div>
              <div className="text-xs text-gray-700 font-semibold">{pump.ai.confidence}</div>
            </div>
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded p-3">
              <div className="text-xs text-gray-700 font-semibold">Time to Failure</div>
              <div className="text-2xl font-bold text-[#182363]">{pump.ai.timeToFailure}</div>
              <div className="text-xs text-gray-500">Based on current degradation rate</div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded p-3">
              <div className="text-xs text-gray-700 font-semibold mb-1">Recommendations</div>
              <ul className="text-xs text-gray-700 list-disc pl-4">
                {pump.ai.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f0fdf4] border border-[#86efac] rounded p-3">
              <div className="text-xs text-gray-700 font-semibold">Health Score</div>
              <div className="text-2xl font-bold text-[#1c8f45]">{pump.ai.healthScore}%</div>
              <div className="text-xs text-gray-500">{pump.ai.healthScoreTrend}</div>
            </div>
          </div>
        </div>
        {/* Historical Data Tabs */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex gap-8 border-b mb-4">
            <button
              className={`pb-2 font-semibold ${tab === "historical" ? "text-[#3D5DE8] border-b-2 border-[#3D5DE8]" : "text-gray-400"}`}
              onClick={() => setTab("historical")}
            >
              Historical Data
            </button>
            <button
              className={`pb-2 font-semibold ${tab === "maintenance" ? "text-[#3D5DE8] border-b-2 border-[#3D5DE8]" : "text-gray-400"}`}
              onClick={() => setTab("maintenance")}
            >
              Maintenance Logs
            </button>
            <button
              className={`pb-2 font-semibold ${tab === "diagnostics" ? "text-[#3D5DE8] border-b-2 border-[#3D5DE8]" : "text-gray-400"}`}
              onClick={() => setTab("diagnostics")}
            >
              Sensor Diagnostics
            </button>
          </div>
          {tab === "historical" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#f9fafb] rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Average Uptime</div>
                <div className="text-xl font-bold text-[#182363]">98.5%</div>
              </div>
              <div className="bg-[#f9fafb] rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Total Runtime</div>
                <div className="text-xl font-bold text-[#182363]">8,760 hrs</div>
              </div>
              <div className="bg-[#f9fafb] rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                <div className="text-xl font-bold text-[#182363]">87.2%</div>
              </div>
            </div>
          )}
          {tab === "maintenance" && (
            <div className="flex flex-col gap-4">
              {maintenanceLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between bg-[#fcfcfc] border border-[#e5e7eb] rounded-lg px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900">{log.task}</div>
                    <div className="text-xs text-gray-500">{log.date}</div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusBadge[log.status as keyof typeof statusBadge]}`}>{log.status}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "diagnostics" && (
            <div className="flex flex-col gap-4">
              {sensorDiagnostics.map((sensor, i) => (
                <div key={i} className="flex items-center justify-between bg-[#fcfcfc] border border-[#e5e7eb] rounded-lg px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900">{sensor.sensor}</div>
                    <div className="text-xs text-gray-500">Last calibrated: {sensor.date}</div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusBadge[sensor.status as keyof typeof statusBadge]}`}>{sensor.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 