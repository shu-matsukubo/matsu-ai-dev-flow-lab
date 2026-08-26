export type HealthResponse = {
  status: 'ok'
}

export async function fetchHealth(
  fetcher: typeof fetch = fetch,
): Promise<HealthResponse> {
  const response = await fetcher('/api/health', {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`)
  }

  const payload: unknown = await response.json()

  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('status' in payload) ||
    payload.status !== 'ok'
  ) {
    throw new Error('Health response has an unexpected shape')
  }

  return { status: 'ok' }
}
