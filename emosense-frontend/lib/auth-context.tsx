'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from './api-config'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  adminLogin: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, first_name: string) => Promise<void>
  logout: () => void
  user: { id: number; username: string; first_name: string } | null
  role: 'user' | 'admin' | null
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: number; username: string; first_name: string } | null>(null)
  const [role, setRole] = useState<'user' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load token from localStorage on mount and sync to cookies
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    const savedRole = localStorage.getItem('auth_role') as 'user' | 'admin' | null
    if (savedToken) {
      setToken(savedToken)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      if (savedRole) {
        setRole(savedRole)
      }
      // Set cookie for middleware
      document.cookie = `auth_token=${savedToken}; path=/; max-age=86400`
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed')
    }

    const data = await response.json()
    const authToken = data.token
    const userData = {
      id: data.user_id,
      username: data.username,
      first_name: data.first_name,
    }

    // Check if user is admin - REJECT if they are
    try {
      const adminCheckResponse = await fetch(`${API_BASE_URL}/api/check-admin/`, {
        headers: { 'Authorization': `Token ${authToken}` }
      })
      if (adminCheckResponse.ok) {
        // This is an admin, reject them
        throw new Error('Admin accounts must use the admin login page')
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Admin accounts must use the admin login page') {
        throw error
      }
      // Non-admin, continue
    }

    // Set user role (NOT admin)
    setToken(authToken)
    setUser(userData)
    setRole('user')
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    localStorage.setItem('auth_role', 'user')
    document.cookie = `auth_token=${authToken}; path=/; max-age=86400`
  }

  // NEW: Admin-only login
  const adminLogin = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed')
    }

    const data = await response.json()
    const authToken = data.token
    const userData = {
      id: data.user_id,
      username: data.username,
      first_name: data.first_name,
    }

    // Check if user is admin - REJECT if they are NOT
    try {
      const adminCheckResponse = await fetch(`${API_BASE_URL}/api/check-admin/`, {
        headers: { 'Authorization': `Token ${authToken}` }
      })
      if (!adminCheckResponse.ok) {
        // This is NOT an admin, reject them
        throw new Error('Only administrators can access the admin panel')
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Only administrators can access the admin panel') {
        throw error
      }
      // Network error or other issue, assume not admin
      throw new Error('Only administrators can access the admin panel')
    }

    // Set admin role
    setToken(authToken)
    setUser(userData)
    setRole('admin')
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    localStorage.setItem('auth_role', 'admin')
    document.cookie = `auth_token=${authToken}; path=/; max-age=86400`
  }

  const register = async (username: string, password: string, first_name: string) => {
    const response = await fetch(`${API_BASE_URL}/api/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, first_name }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Registration failed')
    }

    const data = await response.json()
    const authToken = data.token
    const userData = {
      id: data.user_id,
      username: data.username,
      first_name: data.first_name,
    }

    setToken(authToken)
    setUser(userData)
    setRole('user')
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    localStorage.setItem('auth_role', 'user')
    document.cookie = `auth_token=${authToken}; path=/; max-age=86400`
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setRole(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_role')
    document.cookie = 'auth_token=; path=/; max-age=0'
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loading,
        login,
        adminLogin,
        register,
        logout,
        user,
        role,
        isAdmin: role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
