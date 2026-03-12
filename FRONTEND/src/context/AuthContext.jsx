import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

// Mock user credentials
const MOCK_USERS = [
  { username: 'admin',    password: 'admin123',    role: 'admin'    },
  { username: 'employee', password: 'emp123',      role: 'employee' },
  { username: 'operator', password: 'op123',       role: 'employee' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('billing_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = useCallback((username, password, role) => {
    const found = MOCK_USERS.find(
      u => u.username === username && u.password === password && u.role === role
    )
    if (!found) {
      throw new Error('Invalid credentials or role mismatch')
    }
    const userData = { username: found.username, role: found.role }
    setUser(userData)
    localStorage.setItem('billing_user', JSON.stringify(userData))
    return userData
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('billing_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
