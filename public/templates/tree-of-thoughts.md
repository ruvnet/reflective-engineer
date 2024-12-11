---
title: Tree of Thoughts
domain: prompt-engineering
category: Advanced Frameworks
overview: Strategic thinking process that explores multiple reasoning paths simultaneously.
---

# Framework Structure
Let T be the set of thoughts
Let P be the set of paths
Let E be the evaluation function

# Components
1. Thought Generation: T → {t₁, t₂, ..., tₙ}
2. Path Exploration: P(T) → {p₁, p₂, ..., pₘ}
3. Evaluation: E(p) → [0,1]

# Implementation
∀t ∈ T:
  Generate k branches
  Evaluate E(t)
  Select max(E(t))

# Optimization
- Prune low-value branches
- Depth-first vs Breadth-first
- Parallel evaluation
