const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5205').replace(/\/+$/, '')

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
  return getJson('/api/registrations', params, signal).then((result) => ({
    ...result,
    totalPages: Math.max(1, result.totalPages || 0),
  }))
}

export function getSummary(signal) {
  return getJson('/api/registrations/summary', {}, signal)
}

export async function getAllRegistrations(signal) {
  const pageSize = 50
  const firstPage = await getRegistrations({ page: 1, pageSize }, signal)
  const items = [...firstPage.items]

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const result = await getRegistrations({ page, pageSize }, signal)
    items.push(...result.items)
  }

  return items
}

export async function createRegistration(values, signal) {
  const response = await fetch(`${API_BASE_URL}/api/registrations`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participantName: values.participantName.trim(),
      contactNumber: values.contactNumber.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      carMakeModel: values.carMakeModel.trim(),
      plateNumber: values.plateNumber.trim().toUpperCase(),
      registrationType: values.registrationType,
      amountPaid: 0,
    }),
    signal,
  })

  if (!response.ok) {
    let message = `Registration API returned ${response.status} ${response.statusText}`
    try {
      const problem = await response.json()
      message = problem.detail || problem.title || message
    } catch {
      // Keep the HTTP status message when the API doesn't return a problem body.
    }
    throw new Error(message)
  }

  return response.json()
}
