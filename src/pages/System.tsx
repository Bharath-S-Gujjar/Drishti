import React from 'react'

export default function System(){
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">System Status</h2>
        <div className="text-sm text-slate-500">All services</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <div className="text-sm text-slate-500">Camera Health</div>
          <div className="mt-2 font-semibold">98%</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-slate-500">Server Uptime</div>
          <div className="mt-2 font-semibold">99.99%</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-slate-500">Queue Length</div>
          <div className="mt-2 font-semibold">12</div>
        </div>
      </div>
    </div>
  )
}
