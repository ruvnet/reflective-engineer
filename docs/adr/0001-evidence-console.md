# ADR 0001: Local evidence replay before agent promotion

Status: accepted for v2.

The historical UI enabled browser provider calls and stored encrypted keys with client available encryption material. That cannot protect a credential from code running in the same origin. Its dependency graph included multiple overlapping provider SDKs.

Decision: ship a static evidence console with a shared dependency free evaluator, CLI and official MCP SDK. Retain historical source for reference but exclude it from the distribution and package dependencies. Remove unattended hosting deployment. Evidence uses an explicit version, bounded metrics, artifact digests and unique regression cases. Unknown fields are rejected. Display imported data using textContent, never HTML. CSP disables network connections and inline scripts.

The evaluator emits eligibility for manual review, never an automatic promotion. A hash identifies content but does not authenticate authorship or execution. MetaHarness and Autogenous integrations expose their separate provenance and promotion requirements; the console does not pretend to satisfy them from an uploaded JSON file.

Alternatives: browser stored provider keys expose paid credentials; server hosted credential use would add an identity and tenancy system beyond this increment. A second orchestrator would duplicate RuFlo. We instead reuse the current MetaHarness host profiles and keep domain logic narrow.

Acceptance: real browser import/edit/replay works at mobile width, malformed evidence is rejected, MCP and CLI decisions match and CI publishes only the supported static assets.

References: [MCP security](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices), [MetaHarness](https://github.com/ruvnet/metaharness), [Autogenous](https://github.com/ruvnet/autogenous).
