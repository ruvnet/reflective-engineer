import React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SetDefinition {
  name: string;
  description: string;
  elements: string[];
}

const SymbolicTemplate = () => {
  const [sets, setSets] = React.useState<SetDefinition[]>([
    { name: "U", description: "Universal set of actions", elements: [] },
    { name: "S", description: "Subset of cultural suppression actions", elements: [] },
    { name: "E", description: "Subset of enforcement actions", elements: [] },
    { name: "R", description: "Subset of research/propaganda actions", elements: [] },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-console-cyan mb-8 typing-animation">
          Symbolic Reasoning Template Generator
        </h1>

        {/* Set Definitions Section */}
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-800 rounded">
            {({ open }) => (
              <>
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="text-console-cyan">Step 1: Define Sets and Categories</span>
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-4 bg-gray-800/50 rounded">
            {sets.map((set, index) => (
              <div key={set.name} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">Set {set.name}:</span>
                  <Input
                    className="flex-1 bg-gray-800 border-gray-700"
                    value={set.description}
                    onChange={(e) => {
                      const newSets = [...sets];
                      newSets[index].description = e.target.value;
                      setSets(newSets);
                    }}
                  />
                </div>
                <Textarea
                  className="w-full bg-gray-800 border-gray-700"
                  placeholder={`Enter elements for set ${set.name}, separated by commas...`}
                  onChange={(e) => {
                    const newSets = [...sets];
                    newSets[index].elements = e.target.value.split(",").map((s) => s.trim());
                    setSets(newSets);
                  }}
                />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Predicates Section */}
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-800 rounded">
            {({ open }) => (
              <>
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="text-console-cyan">Step 2: Define Predicates</span>
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-4 bg-gray-800/50 rounded">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-purple-400">P(x): Cultural Suppression</label>
                <Textarea
                  className="w-full bg-gray-800 border-gray-700"
                  placeholder="Define predicate P(x)..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-purple-400">Q(x): Enforcement</label>
                <Textarea
                  className="w-full bg-gray-800 border-gray-700"
                  placeholder="Define predicate Q(x)..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-purple-400">T(x): Research/Propaganda</label>
                <Textarea
                  className="w-full bg-gray-800 border-gray-700"
                  placeholder="Define predicate T(x)..."
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Composition Section */}
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-800 rounded">
            {({ open }) => (
              <>
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="text-console-cyan">Step 3: Define Composition</span>
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-4 bg-gray-800/50 rounded">
            <Textarea
              className="w-full bg-gray-800 border-gray-700"
              placeholder="Define the composition of actions..."
              rows={6}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SymbolicTemplate;