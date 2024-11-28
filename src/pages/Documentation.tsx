import MainNav from "../components/MainNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Code, Wand2, Network, Brain, GitBranch, Workflow, Shield } from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Documentation" />
      
      <main className="flex-1 p-4">
        <section className="glass-panel p-6 animate-matrix-fade">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-console-cyan" />
            <h1 className="text-2xl font-code text-console-cyan">Documentation</h1>
          </div>

          <Tabs defaultValue="getting-started" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-transparent h-auto p-0">
              <TabsTrigger value="getting-started" className="glass-panel data-[state=active]:border-console-cyan">
                <BookOpen className="w-4 h-4 mr-2" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="approaches" className="glass-panel data-[state=active]:border-console-cyan">
                <Brain className="w-4 h-4 mr-2" />
                Prompt Approaches
              </TabsTrigger>
              <TabsTrigger value="frameworks" className="glass-panel data-[state=active]:border-console-cyan">
                <Network className="w-4 h-4 mr-2" />
                Frameworks
              </TabsTrigger>
              <TabsTrigger value="workflows" className="glass-panel data-[state=active]:border-console-cyan">
                <Workflow className="w-4 h-4 mr-2" />
                Workflows
              </TabsTrigger>
              <TabsTrigger value="infosec" className="glass-panel data-[state=active]:border-console-cyan">
                <Shield className="w-4 h-4 mr-2" />
                InfoSec
              </TabsTrigger>
              <TabsTrigger value="red-teaming" className="glass-panel data-[state=active]:border-console-cyan">
                <Shield className="w-4 h-4 mr-2" />
                Red Teaming
              </TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-code text-console-cyan mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Quick Start Guide
                </h2>
                <div className="space-y-4 text-console-text">
                  <p>
                    The Symbolic Scribe helps you create structured mathematical prompts for AI interactions.
                    Follow these steps to get started:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Choose a template from the Templates page</li>
                    <li>Select your target domain (e.g., InfoSec, Ethics, AI Systems)</li>
                    <li>Define your mathematical structures and relationships</li>
                    <li>Generate and refine your prompt</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="approaches" className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-code text-console-cyan mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Prompt Engineering Approaches
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Set-Theoretic Approach</h3>
                    <p className="text-console-text mb-2">
                      Uses set theory to define clear boundaries and relationships between concepts:
                    </p>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`Let S = {x | x is a security vulnerability}
Let P = {y | y is a patch addressing x ∈ S}
Define R as the relation: R ⊆ S × P`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Category Theory Approach</h3>
                    <p className="text-console-text mb-2">
                      Models relationships and transformations between different structures:
                    </p>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`Category C of System States
Objects: Valid system configurations
Morphisms: State transitions
Functors: Security policies`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Abstract Algebra Approach</h3>
                    <p className="text-console-text mb-2">
                      Uses algebraic structures to model system behaviors:
                    </p>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`Group G of System Operations
Identity: No-op
Inverse: Rollback operations
Composition: Sequential operations`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="frameworks" className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-code text-console-cyan mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Mathematical Frameworks
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Logical Framework</h3>
                    <p className="text-console-text">
                      Formal logic for reasoning about system properties and behaviors:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                      <li>Propositional Logic: Basic truth values and operations</li>
                      <li>Predicate Logic: Quantified statements about system properties</li>
                      <li>Modal Logic: Reasoning about necessity and possibility</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Topological Framework</h3>
                    <p className="text-console-text">
                      Spatial relationships and continuous transformations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                      <li>Open/Closed Sets: Boundary conditions</li>
                      <li>Continuous Maps: Smooth transitions between states</li>
                      <li>Homeomorphisms: Structure-preserving transformations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Complex Analysis Framework</h3>
                    <p className="text-console-text">
                      Handling multiple interrelated variables:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                      <li>Complex Functions: Multi-dimensional relationships</li>
                      <li>Analytic Functions: Well-behaved transformations</li>
                      <li>Contour Integration: Path-dependent analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="workflows" className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-code text-console-cyan mb-4 flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  Common Workflows
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Security Analysis Workflow</h3>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Define the security domain using set theory</li>
                      <li>Model threat vectors as morphisms</li>
                      <li>Apply categorical composition for attack chains</li>
                      <li>Generate security policy functors</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Ethical Analysis Workflow</h3>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Define ethical principles as axioms</li>
                      <li>Model stakeholder relationships using category theory</li>
                      <li>Apply logical frameworks for consistency checking</li>
                      <li>Generate ethical constraint functors</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">AI System Analysis</h3>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Define system behaviors using abstract algebra</li>
                      <li>Model state spaces topologically</li>
                      <li>Apply complex analysis for multi-agent interactions</li>
                      <li>Generate system constraint morphisms</li>
                    </ol>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="infosec" className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-code text-console-cyan mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Considerations
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">API Key Security</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Client-side encryption of API keys using AES-256</li>
                      <li>Optional environment variable configuration</li>
                      <li>No server-side storage of sensitive data</li>
                      <li>Automatic key validation and rotation support</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Data Privacy</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>All processing happens client-side</li>
                      <li>No data persistence beyond local storage</li>
                      <li>Minimal external API communication</li>
                      <li>No tracking or analytics</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Advanced Security Measures</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-console-green mb-2">Mathematical Input Analysis</h4>
                        <pre className="bg-black/30 p-4 rounded-md text-console-text">
            {`# Input Validation Pipeline
            1. Parse mathematical structures
            2. Analyze semantic embeddings
            3. Compare with known attack patterns
            4. Validate transformations
            5. Check for semantic shifts`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="text-console-green mb-2">Embedding Space Monitoring</h4>
                        <pre className="bg-black/30 p-4 rounded-md text-console-text">
            {`# Vector Analysis
            1. Track embedding distances
            2. Monitor semantic clusters
            3. Detect anomalous mappings
            4. Validate transformations
            5. Check consistency`}
                        </pre>
                      </div>
                      <div>
                        <h4 className="text-console-green mb-2">API Key Management</h4>
                        <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Recommended key rotation schedule
1. Generate new key monthly
2. Update environment variables
3. Verify key functionality
4. Remove old key access`}
                        </pre>
                      </div>
                      
                      <div>
                        <h4 className="text-console-green mb-2">Prompt Security</h4>
                        <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Prompt security checklist
1. Review for sensitive data
2. Validate mathematical structures
3. Check for injection vectors
4. Test with minimal permissions`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">MathPrompt Attack Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-console-green mb-2">Core Technique</h4>
                        <p className="text-console-text mb-2">
                          MathPrompt transforms harmful prompts into symbolic mathematics problems that evade detection.
                          Success rates of 73.6% across modern LLMs, compared to 1% with unmodified harmful prompts.
                        </p>
                        <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Mathematical Encoding Components
1. Set Theory: A = {x | x ∈ Actions}
2. Abstract Algebra: G = (A, •) group structure
3. Symbolic Logic: P(x) ⟹ Q(x) implications`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="text-console-green mb-2">Vulnerability Analysis</h4>
                        <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Attack Vector Components
Let M be the set of mathematical transformations
Let P be the set of prompts
Let S be the set of safety mechanisms

∃m ∈ M: ∀s ∈ S, ∃p ∈ P: s(m(p)) ≠ s(p)
// There exists a transformation that evades all safety checks`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="text-console-green mb-2">Defense Strategy</h4>
                        <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Mitigation Framework
Let D be defensive measures
Let V be validation functions
Let E be embedding space

∀m ∈ M: ∃d ∈ D: d(m(p)) = d(p)
// Ensure defenses are invariant under mathematical transformation`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Security Analysis Framework</h3>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`Let S = {x | x is a security control}
Let T = {y | y is a threat vector}
Let R ⊆ S × T be the mitigation relation

∀t ∈ T, ∃s ∈ S: (s,t) ∈ R
// Every threat has at least one control

// Extended MathPrompt Defense
Let M = {m | m is a mathematical transformation}
Let V = {v | v is a validation function}
∀m ∈ M, ∃v ∈ V: v(m(x)) = v(x)
// Every transformation must be validated`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Incident Response</h3>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Immediately rotate compromised API keys</li>
                      <li>Clear local storage if necessary</li>
                      <li>Review access logs in OpenRouter dashboard</li>
                      <li>Update security controls as needed</li>
                    </ol>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="red-teaming" className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-code text-console-cyan mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Red Teaming Methodology
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Preparation Phase</h3>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Initial Setup
1. Model Architecture Analysis
2. Framework Selection
3. Test Case Design
4. Safety Protocol Implementation`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Testing Vectors</h3>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Core Testing Approaches
1. Semantic Injection Analysis
2. Boundary Testing
3. Context Window Manipulation
4. Mathematical Encoding Tests
5. Chain-of-Thought Analysis`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Mathematical Framework Analysis</h3>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Framework Components
Let M = {m | m is a mathematical transformation}
Let V = {v | v is a validation function}
Let S = {s | s is a security control}

∀m ∈ M, ∃v ∈ V: v(m(x)) = v(x)
// Every transformation must be validated`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Documentation & Analysis</h3>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Analysis Framework
1. Systematic Recording
   - Test case details
   - Results and observations
   - Vulnerability patterns

2. Impact Assessment
   - Security implications
   - Risk categorization
   - Mitigation priorities

3. Pattern Recognition
   - Common vulnerability types
   - Attack vector analysis
   - Defense strategy mapping`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Ethical Guidelines</h3>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Ethical Framework
1. Responsible Disclosure
   - Follow established protocols
   - Coordinate with stakeholders
   - Document findings securely

2. Harm Prevention
   - Containment measures
   - Testing boundaries
   - Safety checkpoints

3. Collaborative Improvement
   - Share findings responsibly
   - Contribute to defense strategies
   - Update methodologies`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-console-cyan mb-2">Defense Strategy Development</h3>
                    <pre className="bg-black/30 p-4 rounded-md text-console-text">
{`# Strategy Components
Let D be defensive measures
Let T be threat vectors
Let R be mitigation relation

∀t ∈ T, ∃d ∈ D: (d,t) ∈ R
// Every threat has a corresponding defense

# Implementation Steps
1. Identify vulnerability patterns
2. Develop mitigation strategies
3. Implement security controls
4. Validate effectiveness
5. Document and share findings`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
