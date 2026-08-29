# Flow Feedback i00-tbootstrap-001-f03

- 発生元Issue: なし（Issue運用開始前）
- 発生元PR: なし
- 発生元Task: 2026-08-26-initial-bootstrap.md
- category: other
- symptom: project-level `.codex/agents` が存在するとCodex DesktopのWindows sandbox helper setup refreshが失敗した
- impact: 通常sandboxのterminal / patch操作が中断した
- evidence: agent TOMLを退避すると復旧し、公式schema準拠と標準TOML parse成功後も配置時だけ再現
- suggestion: Codex Desktop側でproject custom agentとWindows sandbox helperの組合せを調査する。repository設定自体は保持し、現環境の制約として報告する
