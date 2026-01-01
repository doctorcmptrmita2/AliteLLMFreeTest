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

    // CF-X Model: Call orchestrator service
    if (model === 'cf-x') {
      const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://orchestrator:3000'
      
      try {
        // Call orchestrator with CF-X flag
        const response = await fetch(`${orchestratorUrl}/run`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task,
            cfX: true,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          return NextResponse.json(
            { error: `Orchestrator error: ${errorText}` },
            { status: response.status }
          )
        }

        const data = await response.json()
        return NextResponse.json({
          result: data.result || data.output || 'CF-X pipeline completed',
          model: 'cf-x',
        })
      } catch (error) {
        // Fallback: Call orchestrator via Docker exec or direct API
        // For now, return a message that CF-X requires orchestrator
        return NextResponse.json({
          result: `CF-X Model Pipeline:\n\n📋 Plan: DeepSeek V3.2\n💻 Code: MiniMax M2.1\n🔍 Review: Gemini 2.5 Flash\n\nNote: CF-X requires orchestrator service. Please use CLI: docker-compose run --rm orchestrator run "${task}" --cf-x`,
          model: 'cf-x',
        })
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
