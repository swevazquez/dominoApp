# AGENTS.md — Dominoes Score Tracker

## 1. Purpose

This repository contains a mobile application for tracking Puerto Rican / Caribbean dominoes games, including hand-by-hand scoring, rule enforcement, and shareable game summaries.

This document defines how AI agents should:
- Understand the system
- Safely modify code
- Implement features
- Avoid breaking critical logic

---

## 2. Core Domain Concepts

Agents MUST understand these concepts before making changes.

### Teams
- Two teams:
  - "Us" → device user
  - "Them" → opposing team

### Game
A game consists of:
- A rule preset
- Multiple hands
- A target score
- A final outcome

### Hand
Each hand includes:
- winner → Us / Them
- winType → Normal | Capicú | Chuchazo | Tranque
- basePoints → user-entered
- appliedBonus → computed
- appliedPrize → computed
- totalPoints → computed

### Scoring Formula (CRITICAL)

Agents MUST NOT change this without explicit instruction:

totalPoints = basePoints + prize + bonus

Where:
- bonus = 100 if Capicú or Chuchazo
- bonus = 0 otherwise
- Capicú and Chuchazo are mutually exclusive

### Prize Logic (Con Premio)

Applies only for first 4 hands:

Hand 1 → 100  
Hand 2 → 75  
Hand 3 → 50  
Hand 4 → 25  

### Chiva (Special Condition)

A Chiva occurs when:
- One team wins
- Opponent score = 0

Agents must:
- Detect automatically
- Never rely on user input

### Tranque

- User selects winner
- User inputs points
- App applies scoring normally

---

## 3. Architecture Overview

Recommended structure:

/app
  /ui
  /screens
  /components

/domain
  Game.ts
  Hand.ts
  Rules.ts
  ScoringEngine.ts

/data
  GameRepository.ts
  LocalStorage.ts

/features
  gameplay/
  history/
  sharing/
  settings/

/tests
  scoring/
  gameplay/

---

## 4. Critical Components

### Scoring Engine (HIGH RISK)

/domain/ScoringEngine.*

Rules:
- Pure logic only (no UI)
- Deterministic
- Fully unit tested

Agents MUST:
- Add tests before modifying logic
- Validate all edge cases

### Game State

Game state includes:
- List of hands
- Running totals
- Game status (active / completed)

Agents MUST:
- Keep state immutable where possible
- Recalculate derived values (do not store redundant values)

---

## 5. Agent Workflows

### 5.1 Adding a Feature

Agent MUST:
1. Understand domain impact
2. Identify affected modules
3. Update:
   - Domain logic (if needed)
   - UI layer
   - Tests
4. Ensure:
   - No regression in scoring
   - No broken history data

### 5.2 Fixing a Bug

Agent MUST:
1. Reproduce bug via test
2. Add failing test
3. Fix logic
4. Verify:
   - No side effects on scoring
   - No regression in past games

### 5.3 Refactoring

Agent MUST:
- Not change scoring behavior
- Preserve:
  - Game history
  - Hand calculations
- Run all scoring tests

---

## 6. Testing Requirements

Agents MUST ensure coverage for:

- Normal hand scoring
- Capicú scoring
- Chuchazo scoring
- Prize application
- Tranque scoring
- Chiva detection
- Game end conditions
- Editing/deleting hands

Example:

it("applies capicu and prize correctly on hand 1", () => {
  const result = scoreHand({
    basePoints: 25,
    winType: "CAPICU",
    handNumber: 1,
    mode: "CON_PREMIO"
  });

  expect(result.totalPoints).toBe(25 + 100 + 100);
});

---

## 7. Guardrails (DO NOT BREAK)

Agents MUST NOT:

- Change scoring formula
- Allow Capicú and Chuchazo together
- Skip confirmation for destructive actions
- Allow invalid hand entries
- Break game history consistency

---

## 8. Data Integrity Rules

- Hand history is the source of truth
- Totals must be derived, not stored redundantly
- Editing a hand must:
  - Recalculate all subsequent scores
  - Update game outcome

---

## 9. UI Principles

Agents should maintain:

- Fast hand entry (low friction)
- Clear score visibility
- Minimal steps to log a hand
- Clean Apple-style UI

---

## 10. Performance Constraints

Agents should ensure:

- Hand logging < 1 second
- Score updates immediate
- History load < 2 seconds

---

## 11. Sharing Rules

Agents must ensure:

- Share images include:
  - Final score
  - Winner
  - Highlights (Capicú, Chuchazo, Chiva)
- Do not include player names unless present

---

## 12. Future Extensions (Agent Awareness)

Agents should design with extensibility for:

- Accounts and sync
- Multiplayer/shared games
- Stats and leaderboards
- Voice input
- Real-time collaboration

---

## 13. Safe Change Checklist

Before submitting changes, agents MUST verify:

- [ ] Scoring logic unchanged or validated
- [ ] All tests pass
- [ ] No regression in past game results
- [ ] UI still supports fast hand entry
- [ ] Data model remains consistent

---

## 14. When to Ask for Clarification

Agents MUST ask before proceeding if:

- Rules are ambiguous
- A change affects scoring logic
- A feature conflicts with domain rules
- Data persistence behavior is unclear

---

## Final Note

This project’s core risk is scoring correctness.

Agents should treat:
ScoringEngine as mission-critical.

Everything else (UI, sharing, etc.) is secondary to:
- Accuracy
- Consistency
- Trust