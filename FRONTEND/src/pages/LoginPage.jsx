import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login }     = useAuth()
  const navigate      = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', role: 'employee' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600)) // Simulate network
      const user = login(form.username, form.password, form.role)
      toast.success(`Welcome, ${user.username}!`)
      navigate(user.role === 'admin' ? '/admin' : '/billing')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: 'radial-gradient(ellipse at 60% 40%, #1e1b4b 0%, #0f172a 70%)' }}>
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4">
            <span className="text-white text-4xl font-bold">அ</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Billing System</h1>
          <p className="text-slate-400 mt-2 text-sm">Tamil Voice POS • Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="glass p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['employee', 'admin'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: r }))}
                    className={`py-2.5 px-4 rounded-lg text-sm font-semibold capitalize transition-all duration-200 border ${
                      form.role === r
                        ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 shadow-md shadow-indigo-500/20'
                        : 'border-slate-600/40 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {r === 'admin' ? '⚙️ Admin' : '🧾 Employee'}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="input"
                placeholder={form.role === 'admin' ? 'admin' : 'employee'}
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium mb-2">Demo credentials:</p>
            <div className="space-y-1 text-xs text-slate-500 font-mono">
              <p>Employee: <span className="text-slate-300">employee / emp123</span></p>
              <p>Admin:    <span className="text-slate-300">admin / admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
