const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'x-agent-key': apiKey } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const json = await res.json()

  if (!res.ok) {
    throw new Error(json?.error?.message ?? 'API error')
  }

  return json.data
}

// Public (no auth)
export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}

// Authenticated (requires api key)
export function authApi(apiKey: string) {
  return {
    get: <T>(path: string) => apiFetch<T>(path, {}, apiKey),
    post: <T>(path: string, body: unknown) =>
      apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }, apiKey),
    put: <T>(path: string, body: unknown) =>
      apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }, apiKey),
  }
}