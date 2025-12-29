import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { task } = await request.json()

    if (!task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      )
    }

    // Call orchestrator via internal network
    const litellmBaseUrl = process.env.LITELLM_BASE_URL || 'http://litellm:4000/v1'
    // Use test API key for now
    const litellmApiKey = process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'

    // For now, we'll call LiteLLM directly for planning
    // In production, this should call the orchestrator service
    const response = await fetch(`${litellmBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${litellmApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-2024-07-18',
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
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
