import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const location         = useLocation()

  if (!user) return null

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const isAdmin    = user.role === 'admin'
  const isEmployee = user.role === 'employee'

  return (
    <nav className="sticky top-0 z-40 glass border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">அ</span>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">AI Billing</span>
            <span className="hidden sm:block text-xs text-slate-400 leading-none">Tamil POS System</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {isEmployee && (
            <NavLink to="/billing" active={location.pathname === '/billing'}>
              🧾 Billing
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" active={location.pathname === '/admin'}>
              ⚙️ Dashboard
            </NavLink>
          )}
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-slate-200 text-sm font-semibold capitalize">{user.username}</span>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-employee'}`}>
              {user.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost text-sm px-3 py-2"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, active, children }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
      }`}
    >
      {children}
    </button>
  )
}
