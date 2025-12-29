// LiteLLM Admin API client

// Remove /v1 from base URL for admin endpoints
const LITELLM_BASE_URL = process.env.LITELLM_BASE_URL?.replace('/v1', '') || 'http://litellm:4000'
const LITELLM_MASTER_KEY = process.env.LITELLM_MASTER_KEY || ''
// Test API Key - şimdilik bu key'e göre filtreleme yapılacak
const TEST_API_KEY = process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'

console.log('LiteLLM Config:', {
  baseUrl: LITELLM_BASE_URL,
  hasMasterKey: !!LITELLM_MASTER_KEY,
  testApiKey: TEST_API_KEY.substring(0, 10) + '...',
})

async function litellmRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${LITELLM_BASE_URL}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }

  // Add master key for admin endpoints
  if (LITELLM_MASTER_KEY) {
    headers['Authorization'] = `Bearer ${LITELLM_MASTER_KEY}`
  }

  try {
    console.log(`LiteLLM Request: ${url}`, { hasMasterKey: !!LITELLM_MASTER_KEY })
    
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`LiteLLM API error (${response.status}) for ${endpoint}:`, errorText)
      
      // Don't throw for 404 or empty responses - just return empty
      if (response.status === 404) {
        console.warn('LiteLLM endpoint not found, returning empty result')
        return { data: [] }
      }
      
      throw new Error(`LiteLLM API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error in litellmRequest for ${endpoint}:`, error)
    // For network errors, return empty data instead of throwing
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error, returning empty result')
      return { data: [] }
    }
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
    // LiteLLM log endpoint - try different formats
    let endpoint = '/logs'
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    // LiteLLM log filtering - try different parameter names
    const filterKey = apiKey || TEST_API_KEY
    if (filterKey) {
      // Try multiple parameter names that LiteLLM might use
      params.append('api_key', filterKey)
      // Also try user_api_key for filtering
      // params.append('user_api_key', filterKey) // Commented - might cause issues
    }
    
    endpoint = `${endpoint}?${params.toString()}`
    
    console.log('Fetching logs from:', endpoint)
    const data = await litellmRequest(endpoint)
    
    // Handle different response formats
    // LiteLLM might return: { data: [...] } or directly [...]
    let logs = []
    if (Array.isArray(data)) {
      logs = data
    } else if (data.data && Array.isArray(data.data)) {
      logs = data.data
    } else if (data.logs && Array.isArray(data.logs)) {
      logs = data.logs
    } else {
      console.warn('Unexpected log response format:', data)
      logs = []
    }
    
    console.log(`Received ${logs.length} logs from LiteLLM`)
    
    // Client-side filtering by API key if needed
    if (filterKey && logs.length > 0) {
      const filteredLogs = logs.filter((log: any) => {
        const logKey = log.api_key || log.user_api_key || log.user_api_key_hash || ''
        const logKeyHash = log.user_api_key_hash || ''
        
        // Check if log matches the API key
        return logKey === filterKey || 
               logKey.includes(filterKey) ||
               logKeyHash.includes(filterKey.substring(0, 10)) ||
               // If no key in log, include it (might be from master key)
               (!logKey && !logKeyHash)
      })
      
      console.log(`Filtered to ${filteredLogs.length} logs for API key`)
      return filteredLogs
    }
    
    return logs
  } catch (error) {
    console.error('Error fetching logs from LiteLLM:', error)
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

