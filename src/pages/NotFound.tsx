import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">404 — Page not found</h2>
        <p className="text-slate-500 mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="px-4 py-2 bg-sky-600 text-white rounded">Go home</Link>
      </div>
    </div>
  )
}
