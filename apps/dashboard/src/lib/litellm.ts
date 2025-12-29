// LiteLLM Admin API client

// Remove /v1 from base URL for admin endpoints (admin endpoints don't use /v1)
const getBaseUrl = () => {
  const url = process.env.LITELLM_BASE_URL || 'http://litellm:4000/v1'
  // Remove /v1 for admin API calls
  return url.replace('/v1', '').replace('/v1/', '')
}

const LITELLM_BASE_URL = getBaseUrl()
const LITELLM_MASTER_KEY = process.env.LITELLM_MASTER_KEY || 'sk-litellm-master-key-2025-roo-code-orchestrator'
// Test API Key - şimdilik bu key'e göre filtreleme yapılacak
const TEST_API_KEY = process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'

// Log config only in server-side
if (typeof window === 'undefined') {
  console.log('LiteLLM Config:', {
    baseUrl: LITELLM_BASE_URL,
    hasMasterKey: !!LITELLM_MASTER_KEY,
    testApiKey: TEST_API_KEY.substring(0, 10) + '...',
  })
}

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
    // LiteLLM returns { data: [...] } or directly [...]
    if (Array.isArray(data)) {
      return data
    }
    return data.data || data.keys || []
  } catch (error) {
    console.error('Error fetching keys:', error)
    return []
  }
}

export async function getKeyInfo(keyId: string) {
  try {
    // Try different endpoint formats
    let data
    try {
      data = await litellmRequest(`/key/info?key_id=${keyId}`)
    } catch (e) {
      // Try alternative format
      try {
        data = await litellmRequest(`/key/info?api_key=${keyId}`)
      } catch (e2) {
        // Try with token parameter
        data = await litellmRequest(`/key/info?token=${keyId}`)
      }
    }
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
    // For usage, we can filter by api_key
    const filterKey = apiKey || TEST_API_KEY
    if (filterKey) {
      params.append('api_key', filterKey)
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }
    
    const data = await litellmRequest(endpoint)
    
    // If filtering by API key and we got all data, filter client-side
    if (filterKey && data && !data.total_requests) {
      // Try to get key-specific usage
      try {
        const keyInfo = await getKeyInfo(filterKey)
        if (keyInfo) {
          return {
            total_requests: keyInfo.usage?.total_requests || 0,
            total_tokens: keyInfo.usage?.total_tokens || 0,
          }
        }
      } catch (e) {
        // Ignore key info errors
      }
    }
    
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
    // For spend, we can filter by api_key
    const filterKey = apiKey || TEST_API_KEY
    if (filterKey) {
      params.append('api_key', filterKey)
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }
    
    const data = await litellmRequest(endpoint)
    
    // If filtering by API key and we got all data, filter client-side
    if (filterKey && data && !data.total_spend) {
      // Try to get key-specific spend
      try {
        const keyInfo = await getKeyInfo(filterKey)
        if (keyInfo) {
          return {
            total_spend: keyInfo.spend || 0,
          }
        }
      } catch (e) {
        // Ignore key info errors
      }
    }
    
    return data
  } catch (error) {
    console.error('Error fetching spend:', error)
    return null
  }
}

export async function getLogs(startDate?: string, endDate?: string, limit = 100, apiKey?: string) {
  try {
    // LiteLLM log endpoint - admin API requires master key
    let endpoint = '/logs'
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    endpoint = `${endpoint}?${params.toString()}`
    
    console.log('Fetching logs from LiteLLM:', endpoint)
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
      console.warn('Unexpected log response format:', Object.keys(data))
      logs = []
    }
    
    console.log(`Received ${logs.length} logs from LiteLLM`)
    
    // Client-side filtering by API key if provided
    const filterKey = apiKey || TEST_API_KEY
    if (filterKey && logs.length > 0) {
      const filteredLogs = logs.filter((log: any) => {
        const logKey = log.api_key || log.user_api_key || ''
        const logKeyHash = log.user_api_key_hash || log.api_key_hash || ''
        
        // Check if log matches the API key (exact match or hash match)
        const keyMatch = logKey === filterKey || 
                        logKey.includes(filterKey) ||
                        logKeyHash.includes(filterKey.substring(0, 10))
        
        // If no key info in log, include it (might be from master key requests)
        return keyMatch || (!logKey && !logKeyHash)
      })
      
      console.log(`Filtered to ${filteredLogs.length} logs for API key: ${filterKey.substring(0, 10)}...`)
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
    // LiteLLM key generation format
    const payload: any = {}
    
    // Add metadata if provided
    if (keyName || metadata) {
      payload.metadata = {
        key_name: keyName,
        ...metadata,
      }
    }
    
    const data = await litellmRequest('/key/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    
    // Handle different response formats
    if (data.key) {
      return { token: data.key, key_id: data.key_id || data.key }
    }
    if (data.token) {
      return { token: data.token, key_id: data.key_id || data.token }
    }
    
    return data
  } catch (error) {
    console.error('Error creating key:', error)
    throw error
  }
}

export async function deleteKey(keyId: string) {
  try {
    // Try different delete formats
    let data
    try {
      data = await litellmRequest(`/key/delete?key_id=${keyId}`, {
        method: 'DELETE',
      })
    } catch (e) {
      // Try with api_key parameter
      data = await litellmRequest(`/key/delete?api_key=${keyId}`, {
        method: 'DELETE',
      })
    }
    return data
  } catch (error) {
    console.error('Error deleting key:', error)
    throw error
  }
}

