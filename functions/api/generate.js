export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { system, user } = await request.json();

    if (!system || !user) {
      return json({ error: 'Missing prompt.' }, 400);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'Missing ANTHROPIC_API_KEY.' }, 500);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system,
        messages: [{ role: 'user', content: user }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return json({
        error: data.error?.message || `Anthropic API error: ${response.status}`
      }, response.status);
    }

    const text = data.content?.find((block) => block.type === 'text')?.text || '';
    return json({ text });
  } catch (error) {
    return json({ error: error.message || 'Unexpected server error.' }, 500);
  }
}

export async function onRequestGet() {
  return json({ ok: true, message: 'Plati API is running.' });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
