import { restClient } from "@/lib/api/rest-client"
import type { LoginRequest, User } from "@/types/auth"
import { memberRepository } from "@/lib/repositories/member-repository"

class AuthService {
  private currentUser: User | null = null

  async login(credentials: LoginRequest): Promise<string> {
    try {
      // Ajustado para o formato correto da resposta
      const response = await restClient.post<{
        data: { access_token: string }
        error: boolean
        message: string | null
      }>("/login", credentials)

      if (response.data && !response.data.error && response.data.data.access_token) {
        const token = response.data.data.access_token
        restClient.setToken(token)

        // Buscar informações do usuário após login bem-sucedido
        await this.getCurrentUser()
        return token
      }

      throw new Error(response.data?.message || "Login failed")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      restClient.clearToken()
      this.currentUser = null
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!restClient.isAuthenticated()) {
      return null
    }

    try {
      const userData = await memberRepository.getCurrentUser()
      this.currentUser = userData
      return userData
    } catch (error) {
      console.error("Get current user error:", error)
      // If the token is invalid, clear it
      if ((error as any)?.statusCode === 401) {
        restClient.clearToken()
      }
      return null
    }
  }

  isAuthenticated(): boolean {
    return restClient.isAuthenticated()
  }

  getUser(): User | null {
    return this.currentUser
  }
}

export const authService = new AuthService()
