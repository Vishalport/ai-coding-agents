# 🔍 CODE_REVIEW.md
**MoonDive Software** · POC Version

---

## How to Use
Paste a code block and say:
> "Review this code following the MoonDive CODE_REVIEW playbook. Give a score out of 10."

The AI will check every category below and return a structured review + score.

---

## Review Checklist

### 🔴 Critical (automatic score deduction — 2pts each)
| # | Check |
|---|-------|
| C1 | `console.log` left in production code |
| C2 | No error handling / bare try-catch with empty catch |
| C3 | Hardcoded secrets, URLs, or credentials in code |
| C4 | Syntax error or broken import |
| C5 | Password or sensitive data returned in API response |

### 🟡 Standard (score deduction — 1pt each)
| # | Check |
|---|-------|
| S1 | Magic strings or numbers (should be in enums) |
| S2 | Duplicate logic (should be in helpers) |
| S3 | Wrong import order (not following CODING_STANDARD.md) |
| S4 | Missing JSDoc on exported functions |
| S5 | Hardcoded color/spacing values (should use CSS variables) |
| S6 | `var` used instead of `const` / `let` |
| S7 | Arrow function vs regular function inconsistency |

### 🟢 Good Practice (bonus observation, no deduction)
| # | Check |
|---|-------|
| G1 | Meaningful variable names |
| G2 | Single responsibility — function does one thing |
| G3 | Edge cases handled |
| G4 | Code is readable without comments |

---

## Score Calculation

```
Start:        10 / 10
Critical hit: -2 per issue (C1–C5)
Standard hit: -1 per issue (S1–S7)
Minimum:       0 (score never goes negative)
```

---

## Review Output Format

When reviewing code, always respond in this format:

```
## 🔍 MoonDive Code Review

### ❌ Critical Issues
- [C1] console.log found on line 12 — remove before PR

### ⚠️ Standard Issues
- [S1] "active" hardcoded on line 8 — use UserStatus.ACTIVE from enums
- [S4] Missing JSDoc on exported function `getUser`

### ✅ Good Practices Observed
- [G1] Variable names are clear and meaningful
- [G2] Function has single responsibility

### 📊 Score: 7 / 10
> Reason: 1 critical issue (-2), 1 standard issue (-1)

### 💡 Suggested Fix
[paste the corrected version of the problematic lines here]
```

---

## Quick Review Prompt (copy-paste this)
```
Review the following code using the MoonDive CODE_REVIEW.md playbook.
Check all Critical, Standard, and Good Practice items.
Give a final score out of 10 with reasons.

[paste your code here]
```