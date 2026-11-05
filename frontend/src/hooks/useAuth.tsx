import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { apiClient } from '@/lib/api'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (req: LoginRequest) => Promise<void>
  register: (req: RegisterRequest) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCurrentUser = useCallback(async () => {
    if (!apiClient.isAuthenticated()) {
      setLoading(false)
      return
    }
    try {
      const userData = await apiClient.get<User>('/auth/me')
      setUser(userData)
    } catch {
      apiClient.clearTokens()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const login = async (req: LoginRequest) => {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string; user: User }>(
      '/auth/login',
      req,
    )
    apiClient.setTokens(response.accessToken, response.refreshToken)
    setUser(response.user)
  }

  const register = async (req: RegisterRequest) => {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string; user: User }>(
      '/auth/register',
      req,
    )
    apiClient.setTokens(response.accessToken, response.refreshToken)
    setUser(response.user)
  }

  const logout = () => {
    apiClient.clearTokens()
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  const refreshUser = async () => {
    if (!apiClient.isAuthenticated()) return
    try {
      const userData = await apiClient.get<User>('/auth/me')
      setUser(userData)
    } catch {
      // Ignore refresh failures — user stays logged in with stale data
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
