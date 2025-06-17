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
  Normal: "border border-[#1c8f45] bg-[#d3ecd3] text-gray-900",
  Warning: "border border-[#bf7600] bg-[#fff6b4] text-gray-900",
  Critical: "border border-[#b20000] bg-[#ffd3d3] text-gray-900",
};

export default function PumpsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Pumps</h1>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#f8f9fa] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  PUMP NAME
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  LOCATION
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  TYPE
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  PRESSURE (PSI)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  TEMPERATURE (°F)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pumps.map((pump, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {pump.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pump.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pump.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pump.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pump.pressure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pump.temp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[pump.status as keyof typeof statusStyles]}`}>
                      {pump.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const btnClass = "inline-flex items-center gap-2 px-4 py-2 border font-semibold border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors";
                      const btnContent = (
                        <>
                          <EyeIcon className="w-4 h-4" />
                          View
                        </>
                      );
                      return i === 0 ? (
                        <Link href={`/pumps/${pump.id}`} className={btnClass}>
                          {btnContent}
                        </Link>
                      ) : (
                        <button type="button" className={btnClass}>
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