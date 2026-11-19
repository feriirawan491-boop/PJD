# Dependency audit — 18 November 2026

Remediation performed:

- Removed `xlsx` and replaced browser exports with `write-excel-file` 4.1.1.
- Upgraded Vitest to 5.1.1, Vite to 8.3.8, and the React plugin to 6.3.0 using a fresh lockfile, without `--force` or peer dependency bypasses.
- Kept all production and development dependencies included in the full audit; no advisory exclusions or audit threshold changes.

Verification:

- `npm audit --omit=dev`: 0 vulnerabilities.
- Full `npm audit`: 17 high, 0 critical, 0 moderate. Remaining findings propagate from `picomatch` through development lint/test tools.
- Latest published picomatch observed: 4.0.7. Advisory GHSA-fc5q-39xc-vjpf covers all published versions in the npm audit response.
- TypeScript, ESLint, seven unit/component tests and production build pass after the updates.

The full zero-vulnerability requirement remains unmet. The user explicitly authorized pushing the current state after being informed of these remaining findings. Do not relabel or vendor vulnerable packages just to remove their registry audit entries.

Advisory: https://github.com/advisories/GHSA-fc5q-39xc-vjpf
