export const CATEGORIES = {
  "Mathematical Logic": "mathematical-logic",
  "Set Theory": "set-theory",
  "Category Theory": "category-theory",
  "Abstract Algebra": "abstract-algebra",
  "Topology": "topology",
  "Complex Analysis": "complex-analysis",
  "Symbolic Systems": "symbolic-systems",
  "Real-World Simulations": "systematic-suppression",
  "Number Theory": "number-theory"
} as const;

export const OUTPUT_TYPES = {
  "Code": "Generate code implementation",
  "Summary": "Provide a concise summary",
  "Analysis": "Detailed analysis and explanation",
  "Examples": "Provide practical examples",
  "Tutorial": "Step-by-step tutorial",
  "Implementation": "Implementation guidelines",
  "Documentation": "Technical documentation",
  "Comparison": "Compare and contrast analysis",
  "Visualization": "Describe visual representation",
  "Calculus": "Show mathematical calculations and steps"
} as const;

export const DOMAINS = {
  "Language Models": [
    "GPT Architecture",
    "Transformer Models",
    "Attention Mechanisms",
    "Token Embeddings",
    "Fine-tuning Strategies",
    "Model Scaling",
    "Training Dynamics",
    "Inference Optimization"
  ],
  "Prompt Engineering": [
    "Chain of Thought",
    "Few-Shot Learning",
    "Zero-Shot Prompting",
    "System Messages",
    "Context Windows",
    "Temperature Control",
    "Output Formatting",
    "Prompt Templates"
  ],
  "AI Safety": [
    "Alignment Theory",
    "Value Learning",
    "Robustness Testing",
    "Interpretability",
    "Reward Modeling",
    "Safety Constraints",
    "Ethical Guidelines",
    "Risk Assessment"
  ],
  "Applications": [
    "Text Generation",
    "Code Generation",
    "Data Analysis",
    "Content Creation",
    "Knowledge Extraction",
    "Dialog Systems",
    "Classification Tasks",
    "Semantic Search"
  ],
  "Research": [
    "Model Architecture",
    "Training Methods",
    "Evaluation Metrics",
    "Benchmarking",
    "Performance Analysis",
    "Error Analysis",
    "Bias Detection",
    "Scaling Laws"
  ],
  "Advanced Techniques": [
    "Constitutional AI",
    "Prompt Injection",
    "Model Merging",
    "Knowledge Graphs",
    "Semantic Control",
    "Output Steering",
    "Context Engineering",
    "Prompt Chaining"
  ]
} as const;