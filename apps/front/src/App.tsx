import { useEffect, useState } from 'react'

import { fetchHealth } from './health.js'

type ApiState = 'checking' | 'available' | 'unavailable'

export function App() {
  const [apiState, setApiState] = useState<ApiState>('checking')

  useEffect(() => {
    let active = true

    void fetchHealth()
      .then(() => {
        if (active) setApiState('available')
      })
      .catch(() => {
        if (active) setApiState('unavailable')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <p className="eyebrow">AI development flow research</p>
      <h1>matsu AI dev flow lab</h1>
      <p>
        アプリの機能ではなく、要求・設計・実装・レビュー・承認ゲートの分離を検証するための最小環境です。
      </p>
      <section aria-live="polite" className={`health health--${apiState}`}>
        <span>API health</span>
        <strong>{apiState}</strong>
      </section>
    </main>
  )
}
