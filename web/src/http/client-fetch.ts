export type RequestConfig<TData = unknown> = {
  baseURL?: string
  url?: string
  method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS'
  params?: unknown
  data?: TData | FormData
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  signal?: AbortSignal
  headers?: [string, string][] | Record<string, string>
}

export type ResponseConfig<TData = unknown> = {
  data: TData
  status: number
  statusText: string
  headers: Headers
}

export type ResponseErrorConfig<TError = unknown> = TError

export const client = async <TData, TError = unknown, TVariables = unknown>(config: RequestConfig<TVariables>): Promise<ResponseConfig<TData>> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${config.url}`)

  Object.entries(config.params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      let formattedValue;
      if (value instanceof Date) {
        formattedValue = value.toISOString();
      } else {
        formattedValue = value === null ? 'null' : value.toString();
      }
      url.searchParams.append(key, formattedValue);
    }
  });

  config.headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  }

  const response = await fetch(url.toString(), {
    method: config.method.toUpperCase(),
    body: JSON.stringify(config.data),
    signal: config.signal,
    headers: config.headers,
  })

  const data = [204, 205, 304].includes(response.status) || !response.body ? {} : await response.json()

  if (!response.ok) {
    return Promise.reject(data as TError)
  }

  return {
    data: data as TData,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers as Headers,
  }
}

export default client
