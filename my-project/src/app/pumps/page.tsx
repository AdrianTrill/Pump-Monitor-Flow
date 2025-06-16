import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const pumps = [
  { name: "Feed Pump A1", id: "P001", location: "Unit A", type: "Centrifugal", pressure: 45.2, temp: 78, status: "Normal" },
  { name: "Booster Pump B3", id: "P002", location: "Unit B", type: "Centrifugal", pressure: 52.1, temp: 92, status: "Warning" },
  { name: "Transfer Pump C2", id: "P003", location: "Unit C", type: "Reciprocating", pressure: 38.7, temp: 105, status: "Critical" },
  { name: "Circulation Pump A2", id: "P004", location: "Unit A", type: "Rotary", pressure: 41.3, temp: 82, status: "Normal" },
  { name: "Main Feed Pump", id: "P005", location: "Unit B", type: "Centrifugal", pressure: 48.9, temp: 88, status: "Warning" },
  { name: "Service Pump D1", id: "P006", location: "Unit C", type: "Rotary", pressure: 44.6, temp: 76, status: "Normal" },
];

const statusStyles = {
  Normal: "border border-[#1c8f45] bg-[#d3ecd3] text-[#1c8f45]",
  Warning: "border border-[#bf7600] bg-[#fff6b4] text-[#bf7600]",
  Critical: "border border-[#b20000] bg-[#ffd3d3] text-[#b20000]",
};

export default function PumpsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#182363]">Pumps</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 font-semibold text-xs">
                <th className="px-4 py-3">PUMP NAME</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">LOCATION</th>
                <th className="px-4 py-3">TYPE</th>
                <th className="px-4 py-3">PRESSURE (PSI)</th>
                <th className="px-4 py-3">TEMPERATURE (°F)</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 text-base">
              {pumps.map((pump, i) => (
                <tr key={i} className="border-t last:border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{pump.name}</td>
                  <td className="px-4 py-3">{pump.id}</td>
                  <td className="px-4 py-3">{pump.location}</td>
                  <td className="px-4 py-3">{pump.type}</td>
                  <td className="px-4 py-3">{pump.pressure}</td>
                  <td className="px-4 py-3">{pump.temp}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${statusStyles[pump.status as keyof typeof statusStyles]}`}>{pump.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const btnClass = "w-[104px] flex items-center justify-center gap-2 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-100 transition";
                      const btnContent = <><EyeIcon className="w-5 h-5 text-gray-700" /><span className="font-medium text-gray-700">View</span></>;
                      return i === 0 ? (
                        <Link href={`/pumps/${pump.id}`} className={btnClass}>
                          {btnContent}
                        </Link>
                      ) : (
                        <button type="button" className={btnClass + " cursor-pointer"}>
                          {btnContent}
                        </button>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 