"use client";
import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockMessages = [
  {
    sender: "assistant",
    text:
      "Hello! I'm your AI assistant. I can help you analyze pump performance, predict failures, and provide maintenance recommendations. What would you like to know?",
  },
  {
    sender: "user",
    text: "Show me pumps with temperature issues",
  },
  {
    sender: "assistant",
    text:
      "I found 2 pumps with temperature-related concerns:\n• Transfer Pump C2 (P003): Currently at 105°F - Critical level\n• Booster Pump B3 (P002): Running at 92°F - Above normal range",
  },
];

const suggestions = [
  {
    title: "Schedule inspection for Pump A23",
    desc: "Bearing wear detected with 85% confidence",
    color: "bg-[#fef2f2] border-[#fca5a5]",
    button: { label: "Schedule Now", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
  },
  {
    title: "Review lubrication schedule",
    desc: "Multiple pumps showing increased friction",
    color: "bg-[#fefce8] border-[#fde047]",
    button: { label: "View Details", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
  },
  {
    title: "Temperature monitoring alert",
    desc: "Unit C pumps running above normal range",
    color: "bg-[#fef2f2] border-[#fca5a5]",
    button: { label: "Investigate", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
  },
  {
    title: "Preventive maintenance due",
    desc: "5 pumps approaching maintenance interval",
    color: "bg-[#dbeafe] border-[#93c5fd]",
    button: { label: "Plan Maintenance", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
  },
];

const anomalyCorrelations = [
  { name: "Vibration + Heat", value: 0.85 },
  { name: "Pressure + Flow", value: 0.75 },
  { name: "Heat + Power", value: 0.6 },
  { name: "Vibration + Pressure", value: 0.4 },
];

const keyFindings = [
  "Strong correlation between vibration and heat anomalies (89%)",
  "Pressure and flow issues often occur together (76%)",
  "Most failures preceded by combined sensor anomalies",
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend() {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { sender: "assistant", text: "(AI response placeholder)" },
        ]);
      }, 800);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      <div className="w-full flex-1 flex flex-col pt-8 pb-8 px-8">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">AI Assistant</h1>
        {/* Large Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-4xl">
            <input
              className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] bg-white shadow-sm text-gray-900 placeholder:text-gray-400"
              placeholder="Ask me anything about your pumps... (e.g., 'Show pumps with overheating risk')"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        {/* Main Content: Suggestions + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Suggestions Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="font-semibold text-gray-900 text-lg mb-4">AI Suggestions</div>
            <div className="flex flex-col gap-4">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className={`border ${s.color} rounded-xl px-6 py-4 flex items-center justify-between min-h-[92px] shadow-sm`}
                >
                  <div>
                    <div className="font-semibold text-gray-900 text-base mb-1">{s.title}</div>
                    <div className="text-gray-700 text-sm">{s.desc}</div>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-normal text-sm transition ${s.button.color}`}
                  >
                    {s.button.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Chat Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="font-semibold text-gray-900 text-lg">AI Chat</div>
            </div>
            <div className="flex flex-col h-[420px] p-4 gap-3">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-lg text-base whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-[#3D5DE8] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="mt-2 flex gap-2"
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  className="flex-1 border border-gray-400 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] focus:border-[#3D5DE8] bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#3D5DE8] text-white font-normal px-6 py-2 rounded-lg hover:bg-[#274bb6] transition"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Anomaly Correlations + Key Findings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-8 shadow-sm">
          <div className="flex-1 min-w-[250px]">
            <div className="font-semibold text-gray-900 mb-2">Anomaly Correlations</div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={anomalyCorrelations} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#182363', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 1]} tick={{ fill: '#6b7280', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 14 }} />
                  <Bar dataKey="value" fill="#232e6b" radius={[6, 6, 0, 0]} barSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-1 min-w-[220px] flex flex-col justify-center">
            <div className="font-semibold text-gray-700 mb-2">Key Findings:</div>
            <ul className="list-disc pl-5 text-gray-700 text-base space-y-2">
              {keyFindings.map((finding, i) => (
                <li key={i}>{finding}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}