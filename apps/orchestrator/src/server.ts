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
    const { task, tier = 'normal' } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    // Validate tier
    const validTiers = ['normal', 'premium', 'cheap'];
    const modelTier = validTiers.includes(tier) ? tier : 'normal';

    console.log(`🚀 CF-X-${modelTier.toUpperCase()} Request received:`, task);

    const result = await client.cfX(task, modelTier as 'normal' | 'premium' | 'cheap');

    const filesInfo = result.executedFiles.length > 0 
      ? `\n📁 Oluşturulan/Düzenlenen Dosyalar:\n${result.executedFiles.map(f => `  - ${f}`).join('\n')}\n`
      : '\n';

    const toolsInfo = result.needsTools 
      ? `\n🔧 Araçlar: Kullanıldı (${result.executedFiles.length} dosya işlendi)\n`
      : `\n💬 Araçlar: Gerekli değildi (basit görev)\n`;

    return res.json({
      success: true,
      model: `cf-x-${modelTier}`,
      tier: modelTier,
      result: {
        plan: result.plan,
        code: result.code,
        review: result.review,
        executedFiles: result.executedFiles,
        needsTools: result.needsTools,
      },
      formatted: `🚀 CF-X-${modelTier.toUpperCase()} 3 Katmanlı Model Sonuçları\n\n` +
        `📋 PLAN:\n${'='.repeat(60)}\n${result.plan}\n\n` +
        `💻 CODE:\n${'='.repeat(60)}\n${result.code}\n\n` +
        `🔍 REVIEW:\n${'='.repeat(60)}\n${result.review}\n\n` +
        toolsInfo +
        filesInfo +
        `✅ CF-X-${modelTier.toUpperCase()} Pipeline tamamlandı!`,
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
      // CF-X workflow (with smart tool usage)
      const tier = req.body.tier || 'normal';
      const validTiers = ['normal', 'premium', 'cheap'];
      const modelTier = validTiers.includes(tier) ? tier : 'normal';
      
      const result = await client.cfX(task, modelTier as 'normal' | 'premium' | 'cheap');
      return res.json({
        success: true,
        model: `cf-x-${modelTier}`,
        tier: modelTier,
        result: {
          plan: result.plan,
          code: result.code,
          review: result.review,
          executedFiles: result.executedFiles,
          needsTools: result.needsTools,
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

