// Mock authentication utilities
export type UserRole = "admin" | "judge"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  expertise?: string
}

// Mock JWT token handling
export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

export function setCurrentUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("current_user", JSON.stringify(user))
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("current_user")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export function clearAuth() {
  removeAuthToken()
  if (typeof window !== "undefined") {
    localStorage.removeItem("current_user")
  }
}

// Mock login function
export async function login(email: string, password: string): Promise<User> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user data based on email
  const isAdmin = email.includes("admin")
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name: isAdmin ? "Admin User" : "Judge User",
    role: isAdmin ? "admin" : "judge",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    expertise: isAdmin ? undefined : "Blockchain & DeFi",
  }

  const mockToken = `mock_jwt_${user.id}_${Date.now()}`
  setAuthToken(mockToken)
  setCurrentUser(user)

  return user
}

export function logout() {
  clearAuth()
}
