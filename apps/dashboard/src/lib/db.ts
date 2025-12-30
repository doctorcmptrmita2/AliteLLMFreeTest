// PostgreSQL database client for direct data access
// This is a fallback when LiteLLM Admin API endpoints don't work

import { Pool } from 'pg'

// Get database connection from environment
const getDbPool = () => {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://litellm:litellm_pass@postgres:5432/litellm'
  
  return new Pool({
    connectionString: databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
}

// Get logs directly from PostgreSQL
export async function getLogsFromDb(
  startDate?: string,
  endDate?: string,
  limit = 100,
  apiKey?: string
): Promise<any[]> {
  const pool = getDbPool()
  
  try {
    let query = `
      SELECT 
        id,
        request_id,
        created_at,
        model,
        prompt_tokens,
        completion_tokens,
        total_tokens,
        spend,
        response_time,
        status_code,
        user_api_key_hash,
        user_id,
        path
      FROM "LiteLLM_RequestLogs"
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1
    
    if (startDate) {
      query += ` AND created_at >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }
    
    if (endDate) {
      query += ` AND created_at <= $${paramIndex}`
      params.push(endDate + ' 23:59:59')
      paramIndex++
    }
    
    if (apiKey) {
      // Try to match by API key hash
      query += ` AND (user_api_key_hash LIKE $${paramIndex} OR user_api_key_hash = $${paramIndex})`
      params.push(`%${apiKey.substring(0, 10)}%`)
      paramIndex++
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`
    params.push(limit)
    
    const result = await pool.query(query, params)
    
    return result.rows.map((row: any) => ({
      id: row.id,
      request_id: row.request_id,
      created_at: row.created_at,
      startTime: row.created_at,
      timestamp: row.created_at,
      model: row.model,
      model_name: row.model,
      prompt_tokens: row.prompt_tokens || 0,
      completion_tokens: row.completion_tokens || 0,
      total_tokens: row.total_tokens || (row.prompt_tokens || 0) + (row.completion_tokens || 0),
      spend: row.spend || 0,
      cost: row.spend || 0,
      duration: row.response_time,
      response_time: row.response_time,
      status_code: row.status_code,
      status: row.status_code,
      user_api_key_hash: row.user_api_key_hash,
      api_key_hash: row.user_api_key_hash,
      user_id: row.user_id,
      internal_user_id: row.user_id,
      request_path: row.path,
      path: row.path,
    }))
  } catch (error) {
    console.error('Error fetching logs from database:', error)
    return []
  } finally {
    await pool.end()
  }
}

// Get usage stats from database
export async function getUsageFromDb(
  startDate?: string,
  endDate?: string,
  apiKey?: string
): Promise<any> {
  const pool = getDbPool()
  
  try {
    let query = `
      SELECT 
        COUNT(*) as total_requests,
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        COALESCE(SUM(spend), 0) as total_spend
      FROM "LiteLLM_RequestLogs"
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1
    
    if (startDate) {
      query += ` AND created_at >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }
    
    if (endDate) {
      query += ` AND created_at <= $${paramIndex}`
      params.push(endDate + ' 23:59:59')
      paramIndex++
    }
    
    if (apiKey) {
      query += ` AND (user_api_key_hash LIKE $${paramIndex} OR user_api_key_hash = $${paramIndex})`
      params.push(`%${apiKey.substring(0, 10)}%`)
      paramIndex++
    }
    
    const result = await pool.query(query, params)
    const row = result.rows[0]
    
    return {
      total_requests: parseInt(row.total_requests) || 0,
      total_tokens: parseInt(row.total_tokens) || 0,
      requests: parseInt(row.total_requests) || 0,
      tokens: parseInt(row.total_tokens) || 0,
      total_spend: parseFloat(row.total_spend) || 0,
      spend: parseFloat(row.total_spend) || 0,
    }
  } catch (error) {
    console.error('Error fetching usage from database:', error)
    return null
  } finally {
    await pool.end()
  }
}

