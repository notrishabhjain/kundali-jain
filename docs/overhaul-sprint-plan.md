# Kundali Overhaul Sprint Plan (Execution Track)

## Sprint Goal
Prediction engine और calculation logic को बिना बदले UI + intelligence + content quality को production-grade बनाना।

## Sprint-1 (Done)
- Engine integration boundary via `engineFacade`.
- Rule-first intelligence skeleton.
- Structured karma insights.

## Sprint-2 (Done)
- Hindi/Devanagari quality guard (`check:hindi`).
- UI text normalization (respectful, user-facing Hindi labels).
- Karma manifestation + sadhana count/timing surfaced in dashboard.

## Sprint-3 (Done)
- Shared narrative composer for Vartaman/Karma/Remedy tabs.
- Decision trace panel in printable report.
- Language and Pancham Kaal assertions in CI.

## Non-Negotiables
- No core astronomical or dasha formula change.
- Address user as "आप".
- Every karma insight contains manifestation + count + timing + rationale.


## Sprint-4 (Next)
- NeoPop design token system migration across major tabs.
- Route-level performance optimization and chunk splitting.
- PDF export visual parity checks with on-screen components.
