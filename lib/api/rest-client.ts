interface RestClientResponse<T = any> {
  data?: T
  statusCode?: number
  message?: string
}

interface RestClientException extends Error {
  statusCode?: number
  response?: RestClientResponse
}

class RestClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL = "http://localhost:3000/api") {
    this.baseURL = baseURL
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken")
    }
  }

  private saveToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token)
      this.token = token
    }
  }

  private removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      this.token = null
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<RestClientResponse<T>> {
    const data = await response.json()

    if (!response.ok) {
      const error: RestClientException = new Error(data.message || "Request failed") as RestClientException
      error.statusCode = response.status
      error.response = {
        data: data.data,
        message: data.message,
        statusCode: response.status,
      }
      throw error
    }

    return {
      data: data,
      message: data.message,
      statusCode: response.status,
    }
  }

  async get<T>(path: string, queryParams?: Record<string, string>): Promise<RestClientResponse<T>> {
    const url = new URL(this.baseURL + path)
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(path: string, data?: any): Promise<RestClientResponse<T>> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(path: string, data?: any): Promise<RestClientResponse<T>> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(path: string): Promise<RestClientResponse<T>> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  // Auth methods
  setToken(token: string) {
    this.saveToken(token)
  }

  clearToken() {
    this.removeToken()
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const restClient = new RestClient()
export type { RestClientResponse, RestClientException }
