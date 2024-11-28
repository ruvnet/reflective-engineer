import MainNav from "../components/MainNav";
import { Info, Github, Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="About" />
      
      <main className="flex-1 p-4">
        <section className="glass-panel p-6 animate-matrix-fade">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-console-cyan" />
            <h1 className="text-2xl font-code text-console-cyan">About Symbolic Scribe</h1>
          </div>

          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-console-text text-lg">
                Symbolic Scribe is an advanced prompt engineering tool that leverages mathematical frameworks
                to generate structured, precise prompts for various domains. By combining rigorous mathematical
                principles with domain-specific knowledge, it helps create more effective and consistent
                interactions with AI systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Card className="glass-panel border-console-cyan">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-console-cyan" />
                    <span className="text-console-cyan">Mathematical Foundation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-console-text">
                    Built on fundamental mathematical principles including set theory, abstract algebra,
                    and category theory to ensure logical consistency and structural integrity in prompt
                    generation.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-console-cyan">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-console-cyan" />
                    <span className="text-console-cyan">Flexible Templates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-console-text">
                    Provides a variety of mathematical frameworks that can be adapted to different domains,
                    from information security to ethical considerations in AI systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-console-cyan">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-console-cyan" />
                    <span className="text-console-cyan">Open Source</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-console-text">
                    Developed as an open-source project, welcoming contributions and improvements from
                    the community to enhance prompt engineering capabilities.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="glass-panel p-6 mt-8">
              <h2 className="text-xl font-code text-console-cyan mb-4">Project Goals</h2>
              <ul className="space-y-4 text-console-text">
                <li className="flex items-start gap-2">
                  <span className="text-console-cyan">•</span>
                  Enhance prompt engineering through mathematical rigor and structured frameworks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-console-cyan">•</span>
                  Provide consistent and reliable templates for various domains and use cases
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-console-cyan">•</span>
                  Foster better understanding of AI system interactions through formal methods
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-console-cyan">•</span>
                  Create a collaborative platform for advancing prompt engineering techniques
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 mt-8">
              <h2 className="text-xl font-code text-console-cyan mb-4">Get Involved</h2>
              <p className="text-console-text">
                We welcome contributions from developers, mathematicians, and domain experts. Whether you're
                interested in adding new templates, improving existing ones, or enhancing the application's
                functionality, your input is valuable to the project's growth and evolution.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
