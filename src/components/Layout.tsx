import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from './auth'

const NavLink = ({ to, children }: { to: string; children: any }) => {
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link to={to}
      className={`px-3 py-2 rounded ${active ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50"}`}
    >
      {children}
    </Link>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const doLogout = async () => {
    await logout()
    nav('/login')
  }
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow">
        <span className="font-bold text-lg">Drishti Dashboard</span>
        <nav className="flex gap-2">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/alerts">Alerts</NavLink>
          <NavLink to="/system">System</NavLink>
        </nav>
        {user ?
          <button onClick={doLogout} className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Logout</button>
          :
          <Link to="/login" className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">Login</Link>
        }
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
