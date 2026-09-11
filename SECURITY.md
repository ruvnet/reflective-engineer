# Security and supported scope

Supported surface: console/, mcp/, current dependencies and generated harness. Historical src/ and templates are migration material and are not built, served or installed. Do not revive browser provider integrations without a separate credential isolation design. Clear old site storage when migrating. No historical credential value is included in review evidence.

Confirmed historical risks: browser credential exposure despite reversible client side encryption; automatic Fly deployment using an unpinned action and no tests; broad provider dependencies. V2 removes these from the supported artifact and replaces deployment with gated artifact delivery.

Input is hostile data. Strict object fields, finite metrics, 64 KiB evidence, 200 cases, unique bounded IDs and SHA256 strings are enforced. Replay is pure and deterministic. Imported metrics are unauthenticated assertions; a false report can look eligible but cannot trigger effects. Never treat eligibility as signed execution proof. No network, eval, HTML injection, shell or deployment tool is exposed. Local validation requires operator opt in and fixed subprocess commands, scrubbed environment, one process, 30 seconds and 128 KiB output.

Dependency audit uses the current npm lockfile and advisory feed at execution time. CI rechecks. Browser tests use sandboxed Chromium in CI; local managed root testing requires an explicit test-only sandbox override. No production browser accepts that setting.

Report security issues privately through GitHub security advisories. Stop promotion if provenance cannot be authenticated. Durable memory, federation writes and production identities require operator configuration and are not activated by this release.
