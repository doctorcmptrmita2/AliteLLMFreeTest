// LiteLLM Admin API client

const LITELLM_BASE_URL = process.env.LITELLM_BASE_URL?.replace('/v1', '') || 'http://litellm:4000'
const LITELLM_MASTER_KEY = process.env.LITELLM_MASTER_KEY || ''
// Test API Key - şimdilik bu key'e göre filtreleme yapılacak
const TEST_API_KEY = process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'

async function litellmRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${LITELLM_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(LITELLM_MASTER_KEY && { 'Authorization': `Bearer ${LITELLM_MASTER_KEY}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`LiteLLM API error (${response.status}) for ${endpoint}:`, errorText)
      throw new Error(`LiteLLM API error (${response.status}): ${errorText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error in litellmRequest for ${endpoint}:`, error)
    throw error
  }
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

// Get usage for specific API key
export async function getKeyUsage(apiKey: string, startDate?: string, endDate?: string) {
  try {
    return await getUsage(startDate, endDate, apiKey)
  } catch (error) {
    console.error('Error fetching key usage:', error)
    return null
  }
}

// Get spend for specific API key
export async function getKeySpend(apiKey: string, startDate?: string, endDate?: string) {
  try {
    return await getSpend(startDate, endDate, apiKey)
  } catch (error) {
    console.error('Error fetching key spend:', error)
    return null
  }
}

export async function getUsage(startDate?: string, endDate?: string, apiKey?: string) {
  try {
    let endpoint = '/usage/global'
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    if (apiKey || TEST_API_KEY) params.append('api_key', apiKey || TEST_API_KEY)
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }
    const data = await litellmRequest(endpoint)
    return data
  } catch (error) {
    console.error('Error fetching usage:', error)
    return null
  }
}

export async function getSpend(startDate?: string, endDate?: string, apiKey?: string) {
  try {
    let endpoint = '/usage/spend'
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    if (apiKey || TEST_API_KEY) params.append('api_key', apiKey || TEST_API_KEY)
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }
    const data = await litellmRequest(endpoint)
    return data
  } catch (error) {
    console.error('Error fetching spend:', error)
    return null
  }
}

export async function getLogs(startDate?: string, endDate?: string, limit = 100, apiKey?: string) {
  try {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    // LiteLLM uses user_api_key_hash or api_key for filtering
    const filterKey = apiKey || TEST_API_KEY
    if (filterKey) {
      // Try both parameters
      params.append('user_api_key', filterKey)
    }
    
    const endpoint = `/logs?${params.toString()}`
    const data = await litellmRequest(endpoint)
    
    // Handle different response formats
    let logs = data.data || data.logs || data || []
    
    // If still need to filter client-side (if API filtering didn't work)
    if (filterKey && logs.length > 0) {
      logs = logs.filter((log: any) => {
        const logKey = log.api_key || log.user_api_key || log.user_api_key_hash || ''
        return logKey.includes(filterKey) || 
               logKey === filterKey ||
               log.user_api_key_hash?.includes(filterKey.substring(0, 10))
      })
    }
    
    return logs
  } catch (error) {
    console.error('Error fetching logs:', error)
    // Return empty array on error instead of throwing
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

