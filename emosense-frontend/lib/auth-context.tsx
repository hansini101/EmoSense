'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from './api-config'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, first_name: string) => Promise<void>
  logout: () => void
  user: { id: number; username: string; first_name: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: number; username: string; first_name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load token from localStorage on mount and sync to cookies
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken) {
      setToken(savedToken)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
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

    setToken(authToken)
    setUser(userData)
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
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
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    document.cookie = `auth_token=${authToken}; path=/; max-age=86400`
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
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
        register,
        logout,
        user,
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
