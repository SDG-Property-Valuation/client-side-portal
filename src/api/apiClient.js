import axios from 'axios'

const DEFAULT_API_BASE_URL = 'http://localhost:8000'

const normalizeApiBaseUrl = (value) => {
  const trimmedValue = String(value ?? '').trim()

  if (!trimmedValue) {
    return DEFAULT_API_BASE_URL
  }

  return trimmedValue.replace(/\/+$/, '')
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export default apiClient
