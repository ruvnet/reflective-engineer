export const CATEGORIES = {
  // Mathematical Frameworks
  "Mathematical Logic": "mathematical-logic",
  "Set Theory": "set-theory",
  "Category Theory": "category-theory",
  "Abstract Algebra": "abstract-algebra",
  "Topology": "topology",
  "Complex Analysis": "complex-analysis",
  "Symbolic Systems": "symbolic-systems",
  "System Analysis": "system-dynamics",
  "Number Theory": "number-theory",

  // Basic Prompting Frameworks
  "Zero-Shot": "zero-shot",
  "Few-Shot": "few-shot",
  "Chain of Thought": "chain-of-thought",
  "Role Playing": "role-playing",
  "Step by Step": "step-by-step",
  "Direct Instruction": "direct-instruction",
  "Task Decomposition": "task-decomposition",

  // Advanced Prompting Frameworks
  "Tree of Thoughts": "tree-of-thoughts",
  "ReAct": "react-framework",
  "Self-Consistency": "self-consistency",
  "Chain of Verification": "chain-of-verification",
  "Meta-Prompting": "meta-prompting",
  "Recursive Prompting": "recursive-prompting",
  "Socratic Method": "socratic-method",

  // Cutting Edge Frameworks
  "Constitutional AI": "constitutional-ai",
  "Automatic Reasoning": "automatic-reasoning",
  "Multi-Agent": "multi-agent",
  "Recursive Refinement": "recursive-refinement",
  "Adversarial Prompting": "adversarial-prompting",
  "Emergent Abilities": "emergent-abilities",
  "Self-Reflection": "self-reflection",
  
  // Specialized Frameworks
  "Retrieval Augmented": "retrieval-augmented",
  "Context Distillation": "context-distillation",
  "Prompt Chaining": "prompt-chaining",
  "Knowledge Graphs": "knowledge-graphs",
  "Semantic Control": "semantic-control",
  "Temporal Reasoning": "temporal-reasoning",
  "Causal Inference": "causal-inference",

  // Safety Frameworks
  "Red Teaming": "red-teaming",
  "Prompt Injection": "prompt-injection",
  "Jailbreak Prevention": "jailbreak-prevention",
  "Output Sanitization": "output-sanitization",
  "Bias Detection": "bias-detection",

  // Optimization Frameworks
  "Token Optimization": "token-optimization",
  "Context Window": "context-window",
  "Prompt Compression": "prompt-compression",
  "Response Shaping": "response-shaping",
  "Temperature Control": "temperature-control"
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
    "Inference Optimization",
    "Model Compression",
    "Knowledge Distillation",
    "Multi-task Learning",
    "Transfer Learning"
  ],
  "Prompt Engineering": [
    "Chain of Thought",
    "Few-Shot Learning",
    "Zero-Shot Prompting",
    "System Messages",
    "Context Windows",
    "Temperature Control",
    "Output Formatting",
    "Prompt Templates",
    "Role-based Prompting",
    "Task Decomposition",
    "Instruction Tuning",
    "Prompt Chaining",
    "In-context Learning",
    "Retrieval-Augmented Generation"
  ],
  "AI Safety": [
    "Alignment Theory",
    "Value Learning",
    "Robustness Testing",
    "Interpretability",
    "Reward Modeling",
    "Safety Constraints",
    "Ethical Guidelines",
    "Risk Assessment",
    "Adversarial Testing",
    "Model Monitoring",
    "Bias Mitigation",
    "Transparency Measures"
  ],
  "Applications": [
    "Text Generation",
    "Code Generation",
    "Data Analysis",
    "Content Creation",
    "Knowledge Extraction",
    "Dialog Systems",
    "Classification Tasks",
    "Semantic Search",
    "Document Processing",
    "Image Generation",
    "Audio Processing",
    "Machine Translation",
    "Question Answering",
    "Summarization"
  ],
  "Research": [
    "Model Architecture",
    "Training Methods",
    "Evaluation Metrics",
    "Benchmarking",
    "Performance Analysis",
    "Error Analysis",
    "Bias Detection",
    "Scaling Laws",
    "Attention Analysis",
    "Loss Landscapes",
    "Optimization Methods",
    "Dataset Curation"
  ],
  "Advanced Techniques": [
    "Constitutional AI",
    "Prompt Injection",
    "Model Merging",
    "Knowledge Graphs",
    "Semantic Control",
    "Output Steering",
    "Context Engineering",
    "Prompt Chaining",
    "Ensemble Methods",
    "Meta-learning",
    "Active Learning",
    "Reinforcement Learning"
  ],
  "Model Evaluation": [
    "Accuracy Metrics",
    "Fairness Assessment",
    "Robustness Testing",
    "Performance Benchmarks",
    "Error Analysis",
    "Bias Detection",
    "Quality Assurance",
    "User Feedback",
    "A/B Testing",
    "Regression Testing"
  ],
  "Deployment": [
    "Model Serving",
    "API Integration",
    "Scaling Strategies",
    "Version Control",
    "Monitoring Systems",
    "Error Handling",
    "Load Balancing",
    "Cost Optimization",
    "Security Measures",
    "Backup Strategies"
  ]
} as const;
