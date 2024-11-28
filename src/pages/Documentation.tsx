import MainNav from "../components/MainNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Code, Wand2, Network, Brain, GitBranch, Workflow } from "lucide-react";

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
          </Tabs>
        </section>
      </main>
    </div>
  );
}
