import React from 'react'

export default function Alerts(){
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Predictive Alerts</h2>
        <div className="text-sm text-slate-500">Manage</div>
      </div>
      <div className="space-y-4">
        <div className="p-4 border rounded flex items-center justify-between">
          <div>
            <div className="font-medium">Overcapacity — Zone B</div>
            <div className="text-xs text-slate-500">Triggered by camera cluster 2</div>
          </div>
          <div className="text-sm text-red-600">Active</div>
        </div>

        <div className="p-4 border rounded flex items-center justify-between">
          <div>
            <div className="font-medium">Motion anomaly — Camera 3</div>
            <div className="text-xs text-slate-500">Unusual movement detected</div>
          </div>
          <div className="text-sm text-amber-600">Pending</div>
        </div>
      </div>
    </div>
  )
}
