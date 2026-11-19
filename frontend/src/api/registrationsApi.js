const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5205'

async function getJson(path, query = {}, signal) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      params.set(key, String(value))
    }
  }

  const search = params.size ? `?${params.toString()}` : ''
  const response = await fetch(`${API_BASE_URL}${path}${search}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Registration API returned ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export function getRegistrations(params = {}, signal) {
  return getJson('/api/registrations', params, signal)
}

export function getSummary(signal) {
  return getJson('/api/registrations/summary', {}, signal)
}
