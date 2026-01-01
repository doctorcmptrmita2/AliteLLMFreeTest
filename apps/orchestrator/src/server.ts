#!/usr/bin/env node
/**
 * Orchestrator HTTP API Server
 * Provides HTTP endpoints for CF-X and standard workflows
 */

import express from 'express';
import { LiteLLMClient } from './client.js';
import cors from 'cors';

// Load environment variables
const LITELLM_BASE_URL =
  process.env.LITELLM_BASE_URL ?? 'http://localhost:4000/v1';
const LITELLM_API_KEY = process.env.LITELLM_API_KEY;
const REQUEST_TIMEOUT_MS = Number.parseInt(
  process.env.REQUEST_TIMEOUT_MS ?? '120000',
  10
);
const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);

// Initialize client
const client = new LiteLLMClient({
  baseUrl: LITELLM_BASE_URL,
  apiKey: LITELLM_API_KEY,
  timeoutMs: REQUEST_TIMEOUT_MS,
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'orchestrator' });
});

// CF-X endpoint
app.post('/cf-x', async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    console.log('🚀 CF-X Request received:', task);

    const result = await client.cfX(task);

    const filesInfo = result.executedFiles.length > 0 
      ? `\n📁 Oluşturulan/Düzenlenen Dosyalar:\n${result.executedFiles.map(f => `  - ${f}`).join('\n')}\n`
      : '\n';

    return res.json({
      success: true,
      model: 'cf-x',
      result: {
        plan: result.plan,
        code: result.code,
        review: result.review,
        executedFiles: result.executedFiles,
      },
      formatted: `🚀 CF-X 3 Katmanlı Model Sonuçları\n\n` +
        `📋 PLAN (DeepSeek V3.2):\n${'='.repeat(60)}\n${result.plan}\n\n` +
        `💻 CODE (Grok 4.1 Fast):\n${'='.repeat(60)}\n${result.code}\n\n` +
        `🔍 REVIEW (Gemini 2.5 Flash):\n${'='.repeat(60)}\n${result.review}\n\n` +
        filesInfo +
        `✅ CF-X Pipeline tamamlandı!`,
    });
  } catch (error) {
    console.error('CF-X Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Standard workflow endpoint
app.post('/run', async (req, res) => {
  try {
    const { task, cfX } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    if (cfX) {
      // CF-X workflow (with tool calling)
      const result = await client.cfX(task);
      return res.json({
        success: true,
        model: 'cf-x',
        result: {
          plan: result.plan,
          code: result.code,
          review: result.review,
          executedFiles: result.executedFiles,
        },
      });
    } else {
      // Standard workflow (no tool calling by default)
      const plan = await client.plan(task);
      const code = await client.code(task, plan, false);
      const review = await client.review(task, plan, code);

      return res.json({
        success: true,
        model: 'standard',
        result: {
          plan,
          code,
          review,
          executedFiles: client.getExecutedFiles(),
        },
      });
    }
  } catch (error) {
    console.error('Run Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Orchestrator HTTP API Server running on port ${PORT}`);
  console.log(`   CF-X endpoint: POST /cf-x`);
  console.log(`   Standard endpoint: POST /run`);
});

