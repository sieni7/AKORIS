# Token Budget — GOV-02 Quality Gate Keeper

| Category | Value |
|----------|-------|
| Context window | 6 000 tokens |
| Prompt budget | 1 500 tokens |
| Output budget | 1 000 tokens |
| Average usage | 2 500 tokens |
| Maximum usage | 5 000 tokens |

## Guidance

- Prompt doit contenir les critères QG applicables, les résultats des audits et le contexte de phase.
- Output limité à une décision courte (GO / NO GO / BLOCKED) avec justifications.
- Le budget output réduit (1k) encourage des décisions concises et factuelles.
