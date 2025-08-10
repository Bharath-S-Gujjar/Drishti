import React from "react";
import { useLiveLocation } from "../hooks/useLiveLocation";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// Demo data – replace with live backend data if needed
const crowdTrendData = [
  { time: "10 AM", value: 400 },
  { time: "11 AM", value: 750 },
  { time: "12 PM", value: 680 },
  { time: "1 PM", value: 800 },
  { time: "2 PM", value: 910 },
  { time: "3 PM", value: 1000 },
];

const dashboardData = {
  peopleCount: 1234,
  alerts: 3,
  systemStatus: "Healthy",
  recentAlerts: [
    { msg: "Camera 3: Motion detected", time: "2m ago" },
    { msg: "Zone B: Overcapacity warning", time: "10m ago" },
    { msg: "System update scheduled", time: "1h ago" }
  ]
};

export default function Dashboard() {
  const { coords, address, error } = useLiveLocation();

  return (
    <div className="p-6">
      {/* Live Location Section */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded shadow flex flex-col gap-4">
          <div className="text-gray-700 font-semibold text-lg">Live Location</div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {coords && (
            <div className="text-gray-800 text-sm">
              <span className="font-semibold">Lat:</span> {coords.lat.toFixed(6)}<br />
              <span className="font-semibold">Lon:</span> {coords.lon.toFixed(6)}<br />
              {address && (
                <>
                  <span className="font-semibold">Address:</span> {address}
                </>
              )}
            </div>
          )}
          {!coords && !error && <div className="text-gray-500 text-sm">Fetching location…</div>}
        </div>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* People Count */}
        <div className="bg-white p-6 rounded shadow">
          <div className="text-sm text-gray-500">People Count</div>
          <div className="text-3xl font-bold">{dashboardData.peopleCount.toLocaleString()}</div>
          <div className="mt-1 text-xs text-gray-400">Updated just now</div>
        </div>
        {/* Alerts */}
        <div className="bg-white p-6 rounded shadow">
          <div className="text-sm text-gray-500">Alerts</div>
          <div className="text-3xl font-bold">{dashboardData.alerts}</div>
          <div className="mt-1 text-xs text-gray-400">Updated just now</div>
        </div>
        {/* System */}
        <div className="bg-white p-6 rounded shadow">
          <div className="text-sm text-gray-500">System</div>
          <div className="text-3xl font-bold">{dashboardData.systemStatus}</div>
          <div className="mt-1 text-xs text-gray-400">Updated just now</div>
        </div>
      </div>

      {/* Chart + Recent Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Smooth animated crowd trends chart using Recharts */}
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <div className="text-lg font-semibold mb-3">
            Crowd trends <span className="text-sm font-normal text-gray-400">(Live)</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={crowdTrendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fill: "#666" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#666" }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", fontSize: "14px" }} 
                cursor={{ stroke: "#38bdf8", strokeWidth: 2, opacity: 0.3 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#38bdf8"
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 8, fill: "#1e40af", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent alerts */}
        <div className="bg-white p-6 rounded shadow">
          <div className="text-lg font-semibold mb-3">Recent alerts</div>
          <div className="flex flex-col gap-2">
            {dashboardData.recentAlerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-200 last:border-b-0 pb-2">
                <span className="text-gray-800 text-sm">{a.msg}</span>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
