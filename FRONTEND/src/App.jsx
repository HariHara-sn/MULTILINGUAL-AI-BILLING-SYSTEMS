import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import EmployeeBillingPage from './pages/EmployeeBillingPage'
import AdminDashboard from './pages/AdminDashboard'

// ── Role-based private route ─────────────────────────────────
function PrivateRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/billing'} replace />
  }
  return children
}

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f172a' }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Default redirect */}
          <Route
            path="/"
            element={
              user
                ? <Navigate to={user.role === 'admin' ? '/admin' : '/billing'} replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* Public */}
          <Route
            path="/login"
            element={user
              ? <Navigate to={user.role === 'admin' ? '/admin' : '/billing'} replace />
              : <LoginPage />
            }
          />

          {/* Employee only */}
          <Route
            path="/billing"
            element={
              <PrivateRoute role="employee">
                <EmployeeBillingPage />
              </PrivateRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
