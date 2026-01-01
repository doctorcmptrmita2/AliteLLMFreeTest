import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { task, model = 'standard' } = await request.json()

    if (!task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      )
    }

    // CF-X Model: 3-layer workflow (Direct LiteLLM calls)
    if (model === 'cf-x') {
      const litellmBaseUrl = process.env.LITELLM_BASE_URL || 'http://litellm:4000/v1'
      const litellmApiKey = process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'

      try {
        // Step 1: Plan with DeepSeek V3.2
        const planResponse = await fetch(`${litellmBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${litellmApiKey}`,
          },
          body: JSON.stringify({
            model: 'openrouter/deepseek/deepseek-v3.2',
            messages: [
              {
                role: 'system',
                content: 'You are a planning assistant. Break down the given task into a clear, step-by-step plan. Output only the plan, no explanations.',
              },
              {
                role: 'user',
                content: `Task: ${task}\n\nCreate a detailed plan:`,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        })

        if (!planResponse.ok) {
          throw new Error(`Plan step failed: ${await planResponse.text()}`)
        }

        const planData = await planResponse.json()
        const plan = planData.choices?.[0]?.message?.content || 'Plan oluşturulamadı'

        // Step 2: Code with MiniMax M2.1
        const codeResponse = await fetch(`${litellmBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${litellmApiKey}`,
          },
          body: JSON.stringify({
            model: 'openrouter/minimax/minimax-m2.1',
            messages: [
              {
                role: 'system',
                content: 'You are a coding assistant. Generate code based on the task and plan. Output clean, production-ready code with proper error handling.',
              },
              {
                role: 'user',
                content: `Task: ${task}\n\nPlan:\n${plan}\n\nGenerate the code:`,
              },
            ],
            temperature: 0.3,
            max_tokens: 4000,
          }),
        })

        if (!codeResponse.ok) {
          throw new Error(`Code step failed: ${await codeResponse.text()}`)
        }

        const codeData = await codeResponse.json()
        const code = codeData.choices?.[0]?.message?.content || 'Kod oluşturulamadı'

        // Step 3: Review with Gemini 2.5 Flash
        const reviewResponse = await fetch(`${litellmBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${litellmApiKey}`,
          },
          body: JSON.stringify({
            model: 'openrouter/google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a code reviewer. Review the code against the task and plan. Identify issues, suggest improvements, and verify completeness. Check for bugs, security issues, and best practices.',
              },
              {
                role: 'user',
                content: `Task: ${task}\n\nPlan:\n${plan}\n\nCode:\n${code}\n\nReview the code for any errors, bugs, or improvements:`,
              },
            ],
            temperature: 0.5,
            max_tokens: 2000,
          }),
        })

        if (!reviewResponse.ok) {
          throw new Error(`Review step failed: ${await reviewResponse.text()}`)
        }

        const reviewData = await reviewResponse.json()
        const review = reviewData.choices?.[0]?.message?.content || 'İnceleme yapılamadı'

        // Format output
        const result = `🚀 CF-X 3 Katmanlı Model Sonuçları\n\n` +
          `📋 PLAN (DeepSeek V3.2):\n${'='.repeat(60)}\n${plan}\n\n` +
          `💻 CODE (MiniMax M2.1):\n${'='.repeat(60)}\n${code}\n\n` +
          `🔍 REVIEW (Gemini 2.5 Flash):\n${'='.repeat(60)}\n${review}\n\n` +
          `✅ CF-X Pipeline tamamlandı!`

        return NextResponse.json({
          result,
          model: 'cf-x',
        })
      } catch (error) {
        return NextResponse.json(
          { 
            error: `CF-X Pipeline hatası: ${error instanceof Error ? error.message : String(error)}`,
            model: 'cf-x',
          },
          { status: 500 }
        )
      }
    }

    // Standard Model: Call LiteLLM directly
    const litellmBaseUrl = process.env.LITELLM_BASE_URL || 'http://litellm:4000/v1'
    const litellmApiKey = process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'

    const response = await fetch(`${litellmBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${litellmApiKey}`,
      },
      body: JSON.stringify({
        model: 'openrouter/openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a planning assistant. Create a detailed plan for the given task.',
          },
          {
            role: 'user',
            content: `Task: ${task}\n\nCreate a detailed step-by-step plan for this task.`,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `LiteLLM error: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const plan = data.choices?.[0]?.message?.content || 'Plan oluşturulamadı'

    return NextResponse.json({
      result: `PLAN:\n${plan}\n\n[Code ve Review adımları yakında eklenecek]`,
      model: 'standard',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
