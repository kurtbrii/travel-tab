# Non-Functional (NFR)
1. NFR1: Enforce authentication, row-level access, and protect chat history; avoid logging sensitive content.
2. NFR2: Clearly present responses as informational guidance; add disclaimers.
3. NFR3: UX & Accessibility: Provide clear form validation, keyboard-navigable lists, and visible focus states (aim WCAG AA).
4. NFR4: Performance: Median chat round-trip ≤ 6s with OpenAI; stream if available.
5. NFR5: Dependencies: Use OpenAI via `OPENAI_API_KEY`; country list remains local (ISO set); no Google Maps in MVP.
6. NFR6: Privacy: Do not request or store high-sensitivity IDs (e.g., passport numbers) in MVP; redact obvious sensitive inputs before sending to OpenAI.
