# Engine Contract Freeze (Phase 1)

This document freezes the functional contract between UI and the kundali engine so the overhaul can proceed without changing core prediction/calculation behavior.

## Scope
- Source engine: `src/lib/analysisSynthesizer.ts`
- UI integration boundary: `src/lib/engineFacade.ts`
- State input source: `src/context/KundaliContext.tsx`

## Input Contract
Engine input is derived from `BirthFormData`:
- `fullName`
- `dob` (YYYY-MM-DD)
- `time` (HH:MM)
- `place`
- `lat`
- `lng`
- `gender`

## Output Contract
`generateUserProfile()` returns `UserProfile` including:
- Moon longitude (sidereal)
- Birth nakshatra and pada
- Rashi mapping
- Current Vimshottari dasha
- Dominant karma metadata
- Gunasthana estimate

`getTodayContext()` returns:
- `tithi`, `vara`, `nakshatra`, `paksha`

`getUpcomingVratDates()` returns:
- Date-wise vrat events (ekadashi/chaturdashi/purnima/amavasya/nakshatra)

## Phase-1 Non-Regression Checklist
- Same input profile must produce same output JSON shape.
- Dasha ordering and lord mapping must remain identical.
- Nakshatra selection logic must remain identical.
- Karma mapping keys must remain identical.
- No changes to core astronomical/calculation formulas in this phase.

## Migration Rule
All UI components should import engine APIs from `src/lib/engineFacade.ts` instead of directly importing from `analysisSynthesizer.ts`.
