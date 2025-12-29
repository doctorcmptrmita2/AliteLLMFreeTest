// LiteLLM Admin API client

const LITELLM_BASE_URL = process.env.LITELLM_BASE_URL?.replace('/v1', '') || 'http://litellm:4000'
const LITELLM_MASTER_KEY = process.env.LITELLM_MASTER_KEY || ''

async function litellmRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${LITELLM_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(LITELLM_MASTER_KEY && { 'Authorization': `Bearer ${LITELLM_MASTER_KEY}` }),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`LiteLLM API error (${response.status}): ${errorText}`)
  }

  return response.json()
}

export async function getKeys() {
  try {
    const data = await litellmRequest('/key/list')
    return data.data || []
  } catch (error) {
    console.error('Error fetching keys:', error)
    return []
  }
}

export async function getKeyInfo(keyId: string) {
  try {
    const data = await litellmRequest(`/key/info?key_id=${keyId}`)
    return data
  } catch (error) {
    console.error('Error fetching key info:', error)
    return null
  }
}

export async function getUsage(startDate?: string, endDate?: string) {
  try {
    let endpoint = '/usage/global'
    if (startDate && endDate) {
      endpoint += `?start_date=${startDate}&end_date=${endDate}`
    }
    const data = await litellmRequest(endpoint)
    return data
  } catch (error) {
    console.error('Error fetching usage:', error)
    return null
  }
}

export async function getSpend(startDate?: string, endDate?: string) {
  try {
    let endpoint = '/usage/spend'
    if (startDate && endDate) {
      endpoint += `?start_date=${startDate}&end_date=${endDate}`
    }
    const data = await litellmRequest(endpoint)
    return data
  } catch (error) {
    console.error('Error fetching spend:', error)
    return null
  }
}

export async function getLogs(startDate?: string, endDate?: string, limit = 100) {
  try {
    let endpoint = `/logs?limit=${limit}`
    if (startDate && endDate) {
      endpoint += `&start_date=${startDate}&end_date=${endDate}`
    }
    const data = await litellmRequest(endpoint)
    return data.data || []
  } catch (error) {
    console.error('Error fetching logs:', error)
    return []
  }
}

export async function createKey(keyName: string, metadata?: Record<string, any>) {
  try {
    const data = await litellmRequest('/key/generate', {
      method: 'POST',
      body: JSON.stringify({
        metadata: {
          key_name: keyName,
          ...metadata,
        },
      }),
    })
    return data
  } catch (error) {
    console.error('Error creating key:', error)
    throw error
  }
}

export async function deleteKey(keyId: string) {
  try {
    const data = await litellmRequest(`/key/delete?key_id=${keyId}`, {
      method: 'DELETE',
    })
    return data
  } catch (error) {
    console.error('Error deleting key:', error)
    throw error
  }
}

