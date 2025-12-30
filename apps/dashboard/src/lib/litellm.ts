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
    // Try different endpoint formats
    const endpoints = ['/key/list', '/v1/key/list']
    
    let data: any = null
    
    for (const endpoint of endpoints) {
      try {
        console.log('Fetching keys from LiteLLM:', endpoint)
        data = await litellmRequest(endpoint)
        
        // LiteLLM returns { data: [...] } or directly [...]
        if (data !== null && data !== undefined) {
          if (Array.isArray(data)) {
            return data
          }
          if (data.data && Array.isArray(data.data)) {
            return data.data
          }
          if (data.keys && Array.isArray(data.keys)) {
            return data.keys
          }
          // If we got a response but no array, return empty
          return []
        }
      } catch (e) {
        console.log(`Endpoint ${endpoint} failed, trying next...`)
        continue
      }
    }
    
    return []
  } catch (error) {
    console.error('Error fetching keys:', error)
    return []
  }
}

export async function getKeyInfo(keyId: string) {
  try {
    // Try different endpoint and parameter formats
    const endpoints = [
      `/key/info?key_id=${keyId}`,
      `/key/info?api_key=${keyId}`,
      `/key/info?token=${keyId}`,
      `/v1/key/info?key_id=${keyId}`,
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log('Fetching key info from LiteLLM:', endpoint)
        const data = await litellmRequest(endpoint)
        if (data !== null && data !== undefined) {
          return data
        }
      } catch (e) {
        console.log(`Endpoint ${endpoint} failed, trying next...`)
        continue
      }
    }
    
    return null
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
    // LiteLLM Admin API endpoints for usage
    const endpoints = [
      '/global/activity/usage',
      '/usage/global',
      '/v1/usage/global',
    ]
    
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    // Note: API key filtering may need to be done client-side
    const filterKey = apiKey || TEST_API_KEY
    
    let data: any = null
    let lastError: Error | null = null
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        const fullEndpoint = params.toString() ? `${endpoint}?${params.toString()}` : endpoint
        console.log('Fetching usage from LiteLLM:', fullEndpoint)
        data = await litellmRequest(fullEndpoint)
        
        if (data !== null && data !== undefined) {
          break
        }
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e))
        console.log(`Endpoint ${endpoint} failed, trying next...`)
        continue
      }
    }
    
    // If all endpoints failed, return null
    if (data === null || data === undefined) {
      console.warn('All usage endpoints failed')
      return null
    }
    
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
    // LiteLLM Admin API endpoints for spend
    const endpoints = [
      '/global/activity/spend',
      '/usage/spend',
      '/v1/usage/spend',
    ]
    
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    // Note: API key filtering may need to be done client-side
    const filterKey = apiKey || TEST_API_KEY
    
    let data: any = null
    let lastError: Error | null = null
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        const fullEndpoint = params.toString() ? `${endpoint}?${params.toString()}` : endpoint
        console.log('Fetching spend from LiteLLM:', fullEndpoint)
        data = await litellmRequest(fullEndpoint)
        
        if (data !== null && data !== undefined) {
          break
        }
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e))
        console.log(`Endpoint ${endpoint} failed, trying next...`)
        continue
      }
    }
    
    // If all endpoints failed, return null
    if (data === null || data === undefined) {
      console.warn('All spend endpoints failed')
      return null
    }
    
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
    // LiteLLM Admin API endpoint for logs
    // Try multiple endpoint formats based on LiteLLM version
    const endpoints = [
      '/global/activity/logs',
      '/logs',
      '/v1/logs',
    ]
    
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    // Note: API key filtering is done client-side as LiteLLM may not support it in query params
    
    let data: any = null
    let lastError: Error | null = null
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        const fullEndpoint = `${endpoint}?${params.toString()}`
        console.log('Fetching logs from LiteLLM:', fullEndpoint)
        data = await litellmRequest(fullEndpoint)
        
        // If we got data (even if empty), use this endpoint
        if (data !== null && data !== undefined) {
          break
        }
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e))
        console.log(`Endpoint ${endpoint} failed, trying next...`)
        continue
      }
    }
    
    // If all endpoints failed, return empty array
    if (data === null || data === undefined) {
      console.warn('All log endpoints failed, returning empty array')
      return []
    }
    
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
    
    // Try different endpoint formats
    const endpoints = ['/key/generate', '/v1/key/generate']
    
    for (const endpoint of endpoints) {
      try {
        console.log('Creating key via LiteLLM:', endpoint)
        const data = await litellmRequest(endpoint, {
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
        if (data) {
          return data
        }
      } catch (e) {
        console.log(`Endpoint ${endpoint} failed, trying next...`)
        continue
      }
    }
    
    throw new Error('All key generation endpoints failed')
  } catch (error) {
    console.error('Error creating key:', error)
    throw error
  }
}

export async function deleteKey(keyId: string) {
  try {
    // Try different delete endpoint and parameter formats
    const endpoints = [
      `/key/delete?key_id=${keyId}`,
      `/key/delete?api_key=${keyId}`,
      `/key/delete?token=${keyId}`,
      `/v1/key/delete?key_id=${keyId}`,
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log('Deleting key via LiteLLM:', endpoint)
        const data = await litellmRequest(endpoint, {
          method: 'DELETE',
        })
        if (data !== null && data !== undefined) {
          return data
        }
      } catch (e) {
        console.log(`Endpoint ${endpoint} failed, trying next...`)
        continue
      }
    }
    
    throw new Error('All key deletion endpoints failed')
  } catch (error) {
    console.error('Error deleting key:', error)
    throw error
  }
}

