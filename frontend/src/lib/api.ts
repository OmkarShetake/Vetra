import type { ApiErrorResponse } from '@/types'

function getBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').trim()
  const stripped = envUrl.replace(/\/+$/, '')
  if (!stripped.includes('/api')) {
    return `${stripped}/api/v1`
  }
  return stripped
}

const API_BASE_URL = getBaseUrl()

function resolveUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_BASE_URL}${cleanEndpoint}`
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('vetra-access-token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(resolveUrl(endpoint), {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json().catch(() => ({
        error: 'Unknown',
        message: `Request failed with status ${response.status}`,
      }))
      throw new Error(error.message || 'An unexpected error occurred')
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    const data = await response.json()
    return data.data ?? data
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(resolveUrl(endpoint), {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json().catch(() => ({
        error: 'Unknown',
        message: `Upload failed with status ${response.status}`,
      }))
      throw new Error(error.message || 'Upload failed')
    }

    const data = await response.json()
    return data.data ?? data
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('vetra-access-token', accessToken)
    localStorage.setItem('vetra-refresh-token', refreshToken)
  }

  clearTokens() {
    localStorage.removeItem('vetra-access-token')
    localStorage.removeItem('vetra-refresh-token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const apiClient = new ApiClient()

