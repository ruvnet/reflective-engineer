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