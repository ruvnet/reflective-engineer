# Validation record

Recorded 2026-09-11, Node24.19 on managed Linux x86_64. Supported v2 checks: npm test passes11 unit, policy, CLI and actual SDK stdio checks; npm run build passes; real Chromium UI passes2 tests covering desktop/mobile replay, malformed input and oversized import invalidation. Local root run uses BROWSER_UNSANDBOXED=1 explicitly; CI defaults to sandboxed Chromium. No remote provider call is tested or supported.

npm audit reports zero known vulnerabilities across the supported lockfile on the execution date. Historical src provider modules and old dependency manifest are excluded from the build, not certified. docs/benchmark.json records1000 deterministic two-case replays; timing is host dependent and not a model benchmark. Root review caught stale UI eligibility after oversized import; fixed with browser regression. Typed metrics and declared hashes remain unauthenticated input claims. No automatic promotion exists.

CI reruns checks on every PR and uploads only four supported static assets. Generated MetaHarness profiles and Autogenous integration have separate source provenance and evidence gates. Production memory storage/identity and authenticated execution provenance remain operator work tracked in issue3.

RuFlo3.25.6 deep security scan reported no critical/high and one medium React XSS signal in historical src/components/ui/chart.tsx. That component interpolates chart CSS in the legacy React tree, which is excluded from the v2 package and all four build assets. The current UI uses textContent and CSP. Treat the legacy signal as unresolved outside the supported surface, not as a runtime clean bill.

CI on ubuntu-latest failed Chromium sandbox startup because Ubuntu AppArmor disables unprivileged user namespaces for the downloaded headless shell. Browser CI now uses the sandbox compatible Ubuntu22.04 runner; chromiumSandbox remains enabled. An additional regression rejects array values that JavaScript regex coercion could mistake for artifact digest strings.
