# CredLens Tests 🧪

This document outlines the testing strategy for the CredLens project. We use **Vitest** as our primary testing framework because of its native TypeScript support, extreme execution speed, and zero-config setup for Next.js App Router projects.

## Running Tests

To run the full test suite once (ideal for CI/CD):
```bash
npm run test
```

To run tests in watch mode (ideal during active development):
```bash
npm run test:watch
```

## Testing Architecture

Our primary testing focus is on the `src/lib/audit-engine.ts`. Because the Audit Engine contains all of the hardcoded business logic and pricing mathematics, testing it heavily ensures that we never present incorrect financial data to a user.

### Coverage Scenarios
The `audit-engine.test.ts` covers the 5 major execution paths of our rules engine:

1. **Seat Optimization** (`test: should recommend seat optimization`)
   - Validates that if `input.seats > teamSize`, the engine flags the wasted spend and calculates exact savings for reducing seats.
   
2. **Plan Downgrades** (`test: should recommend downgrade for a solo user`)
   - Ensures that a solo user who accidentally selected an Enterprise or Team tier is routed down to the cheapest individual tier.
   
3. **Cross-Vendor Switch** (`test: should recommend cross-vendor switch`)
   - Verifies the competitor matching logic (e.g., suggesting a user switch from Windsurf Pro ($20/mo) to GitHub Copilot Pro ($10/mo) for identical features).
   
4. **Credex Volume Discount** (`test: should apply Credex discount`)
   - Checks that total aggregate spend across all tools triggers the correct Credex bulk discount tier (10% to 25%).
   
5. **Optimal Fallback** (`test: should keep optimal stack as-is`)
   - Confirms that if a user has zero wasted seats, the cheapest tools, and no applicable discounts, the engine correctly returns `0` savings and an "optimal" status.

## Continuous Integration
These tests are automatically executed on every push and pull request via our GitHub Actions workflow (`.github/workflows/ci.yml`). Deployments to Vercel will be blocked if any of the financial logic fails these assertions.
