#!/usr/bin/env node
/**
 * Orchestrator CLI - Planner → Coder → Reviewer workflow
 * Commands: plan, code, review, run
 */

import { Command } from 'commander';
import { LiteLLMClient } from './client.js';

// Load environment variables
const LITELLM_BASE_URL =
  process.env.LITELLM_BASE_URL ?? 'http://localhost:4000/v1';
const LITELLM_API_KEY = process.env.LITELLM_API_KEY;
const REQUEST_TIMEOUT_MS = Number.parseInt(
  process.env.REQUEST_TIMEOUT_MS ?? '120000',
  10
);

// Initialize client
const client = new LiteLLMClient({
  baseUrl: LITELLM_BASE_URL,
  apiKey: LITELLM_API_KEY,
  timeoutMs: REQUEST_TIMEOUT_MS,
});

const program = new Command();

program
  .name('orchestrator')
  .description('Roo Code Test Harness - Planner → Coder → Reviewer workflow')
  .version('0.1.0');

// plan command
program
  .command('plan')
  .description('Generate a plan for a task')
  .argument('<task>', 'The task to plan')
  .action(async (task: string) => {
    try {
      console.log('📋 Planning...\n');
      const plan = await client.plan(task);
      console.log('Plan:\n');
      console.log(plan);
      process.exit(0);
    } catch (error) {
      console.error('❌ Planning failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// code command
program
  .command('code')
  .description('Generate code for a task with plan context')
  .argument('<task>', 'The task to code')
  .option('--context <plan>', 'The plan context (required)')
  .action(async (task: string, options: { context?: string }) => {
    if (!options.context) {
      console.error('❌ --context <plan> is required');
      process.exit(1);
    }

    try {
      console.log('💻 Coding...\n');
      const code = await client.code(task, options.context);
      console.log('Code:\n');
      console.log(code);
      process.exit(0);
    } catch (error) {
      console.error('❌ Coding failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// review command
program
  .command('review')
  .description('Review code for a task with plan and code context')
  .argument('<task>', 'The task to review')
  .option('--context <plan+code>', 'The plan and code context (required)')
  .action(async (task: string, options: { context?: string }) => {
    if (!options.context) {
      console.error('❌ --context <plan+code> is required');
      process.exit(1);
    }

    // Parse context (assumes format: "PLAN:\n...\n\nCODE:\n...")
    const parts = options.context.split('\n\nCODE:\n');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      console.error('❌ Context format should be: "PLAN:\n...\n\nCODE:\n..."');
      process.exit(1);
    }

    const plan = parts[0].replace(/^PLAN:\n?/, '').trim();
    const code = parts[1].trim();

    try {
      console.log('🔍 Reviewing...\n');
      const review = await client.review(task, plan, code);
      console.log('Review:\n');
      console.log(review);
      process.exit(0);
    } catch (error) {
      console.error('❌ Review failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// run command (full pipeline)
program
  .command('run')
  .description('Run full pipeline: plan → code → review')
  .argument('<task>', 'The task to execute')
  .option('--cf-x', 'Use CF-X model')
  .option('--tier <tier>', 'CF-X tier: normal, premium, or cheap (default: normal)')
  .action(async (task: string, options: { cfX?: boolean; tier?: string }) => {
    try {
      if (options.cfX) {
        // CF-X Model: 3-layer workflow
        const tier = (options.tier || 'normal') as 'normal' | 'premium' | 'cheap';
        const validTiers = ['normal', 'premium', 'cheap'];
        const modelTier = validTiers.includes(tier) ? tier : 'normal';
        
        console.log(`🚀 Running CF-X-${modelTier.toUpperCase()} Model Pipeline...\n`);
        console.log('Task:', task, '\n');
        console.log('Models:');
        
        const modelNames = {
          normal: {
            planner: 'DeepSeek V3.2',
            coder: 'Grok 4.1 Fast',
            reviewer: 'Gemini 2.5 Flash',
          },
          premium: {
            planner: 'Claude Sonnet 4.5',
            coder: 'Claude Sonnet 4.5',
            reviewer: 'Claude Sonnet 4.5',
          },
          cheap: {
            planner: 'GPT-4o-mini',
            coder: 'Grok 4.1 Fast',
            reviewer: 'GPT-4o-mini',
          },
        };
        
        const names = modelNames[modelTier];
        console.log(`  📋 Plan: ${names.planner}`);
        console.log(`  💻 Code: ${names.coder} (smart tool usage)`);
        console.log(`  🔍 Review: ${names.reviewer}\n`);

        const result = await client.cfX(task, modelTier);

        console.log('='.repeat(60));
        console.log(`📋 PLAN (${names.planner})`);
        console.log('='.repeat(60));
        console.log(result.plan);
        console.log('\n');

        console.log('='.repeat(60));
        console.log(`💻 CODE (${names.coder})`);
        console.log('='.repeat(60));
        console.log(result.code);
        console.log('\n');

        console.log('='.repeat(60));
        console.log(`🔍 REVIEW (${names.reviewer})`);
        console.log('='.repeat(60));
        console.log(result.review);
        console.log('\n');

        if (result.executedFiles.length > 0) {
          console.log('📁 Files created/modified:');
          result.executedFiles.forEach(f => console.log(`  - ${f}`));
          console.log('\n');
        }

        console.log(`🔧 Tools: ${result.needsTools ? 'Used' : 'Not needed (simple task)'}\n`);
        console.log('✅ CF-X Pipeline completed successfully!');
      } else {
        // Standard pipeline
        console.log('🚀 Running full pipeline...\n');
        console.log('Task:', task, '\n');

        // Step 1: Plan
        console.log('📋 Step 1/3: Planning...');
        const plan = await client.plan(task);
        console.log('✅ Plan generated\n');
        console.log('---\n');
        console.log(plan);
        console.log('---\n\n');

        // Step 2: Code
        console.log('💻 Step 2/3: Coding...');
        const code = await client.code(task, plan);
        console.log('✅ Code generated\n');
        console.log('---\n');
        console.log(code);
        console.log('---\n\n');

        // Step 3: Review
        console.log('🔍 Step 3/3: Reviewing...');
        const review = await client.review(task, plan, code);
        console.log('✅ Review completed\n');
        console.log('---\n');
        console.log(review);
        console.log('---\n');

        console.log('✅ Pipeline completed successfully!');
      }
      process.exit(0);
    } catch (error) {
      console.error('❌ Pipeline failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Parse arguments
program.parse();

