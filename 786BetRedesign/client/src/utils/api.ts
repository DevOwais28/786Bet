// Simple API utility wrapping Fetch API to mimic Axios-like interface used in the project
// Provides get, post, put, delete methods that return a response object with a `data` field.
// Usage mirrors Axios so existing code (e.g., api.get(url).then(res => res.data)) continues to work.

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

async function request<T>(url: string, options: RequestInit = {}): Promise<{ data: T }> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    // Try to parse error body; fallback to status text
    let errorMessage: string;
    try {
      const err = await response.json();
      errorMessage = err?.message || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Attempt to parse JSON; if empty response, return null
  const data = (await response.text()).trim();
  return { data: data ? (JSON.parse(data) as T) : (null as unknown as T) };
}

export const api = {
  get: <T = any>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T = any>(url: string, body?: any) =>
    request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(url: string, body?: any) =>
    request<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(url: string) => request<T>(url, { method: 'DELETE' }),
};
