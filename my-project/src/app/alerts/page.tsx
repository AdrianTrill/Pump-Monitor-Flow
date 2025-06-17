import React from "react";

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
  },
];

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Alerts & Anomalies</h1>
        <div className="flex justify-end gap-4 mb-6">
          <select className="border border-gray-300 rounded px-3 py-2 text-base font-normal text-gray-800 bg-white focus:outline-none">
            <option>All Priorities</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 text-base font-normal text-gray-800 bg-white focus:outline-none">
            <option>All Types</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 text-base font-normal text-gray-800 bg-white focus:outline-none">
            <option>All Status</option>
          </select>
        </div>
        <div className="bg-white rounded-xl p-6">
          <div className="flex flex-col gap-4">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`rounded-lg flex flex-col md:flex-row md:items-center justify-between ${alert.bg} ${alert.border} p-6`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg text-gray-900">{alert.pump}</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${alert.badge}`}>{alert.status}</span>
                  </div>
                  <div className="text-base text-gray-900 mb-1 font-normal">{alert.message}</div>
                  <div className="text-xs text-gray-700 mb-1 flex flex-wrap gap-x-2 gap-y-1">
                    {alert.details.map((d, idx) => (
                      <span key={idx} className="flex items-center">
                        <span className="font-semibold mr-1">{d.label}</span>
                        <span className={d.color + " font-semibold mr-2"}>{d.value}</span>
                        {idx < alert.details.length - 1 && <span className="text-gray-400 mx-1">|</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[120px] mt-4 md:mt-0">
                  <span className="font-bold text-sm text-gray-900">RUL: {alert.rul}</span>
                  <span className="text-xs text-gray-500 font-semibold">Confidence: {alert.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}