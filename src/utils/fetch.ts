type RequestConfig = {
  method?: string
  headers?: HeadersInit
  body?: BodyInit
}

export type FetchResponse<T> = {
  data: T | null
  error: Error | null
  status: number
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function fetchWrapper<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<FetchResponse<T>> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: config.method || 'GET',
      headers: {
        ...defaultHeaders,
        ...config.headers,
      },
      body: config.body,
    })

    const data = await response.json()

    // TODO add error logging Sentry and error handling

    console.log('response', response)
    return {
      data,
      error: response.status >= 400 ? new Error(response.statusText) : null,
      status: response.status,
    }
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      status: 500,
    }
  }
}

export const apiService = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data: unknown, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, { ...config, method: 'DELETE' }),
}
