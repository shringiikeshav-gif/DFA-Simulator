# 🚀 AutomataLab: Professional DFA Simulator

A high-performance, educational platform for designing, simulating, and optimizing Deterministic Finite Automata (DFA). Built for Computer Science students to bridge the gap between mathematical theory and practical implementation.

## 🌟 Features

- **Visual DFA Builder**: Interactive graph-based workspace using React Flow.
- **Deterministic Simulation**: Step-by-step string processing with execution traces.
- **Real-time Validation**: Instant mathematical verification of DFA completeness.
- **Optimization Tools**: 
  - **DFA Minimization**: Partition refinement algorithm to reduce state complexity.
  - **NFA to DFA Conversion**: Subset construction implementation (engine ready).
- **Learning Library**: Curated university-level examples (Parity, Substring detection, etc.).
- **Professional UI**: Modern, responsive interface built with Tailwind CSS and shadcn/ui.

## 📐 Mathematical Core

This project implements the formal definition of a DFA: $M = (Q, \Sigma, \delta, q_0, F)$.
- **Simulation**: $\delta^*(q, w)$ implementation for string acceptance.
- **Minimization**: Myhill-Nerode theorem based state partitioning.
- **Conversion**: Powerset construction for NFA $\rightarrow$ DFA.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **Diagramming**: @xyflow/react (React Flow).
- **Testing**: Vitest.
- **Persistence**: Supabase (Optional).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn

### Installation
\`\`\`bash
git clone <your-repo-url>
cd dfa-simulator
npm install
npm run dev
\`\`\`

### Running Tests
\`\`\`bash
npm test
\`\`\`

## 🎓 Educational Value

This project is designed for B.Tech CSE students. It focuses on:
1. **State Management**: Handling complex graph data in React.
2. **Algorithmic Thinking**: Implementing formal language theory.
3. **Software Architecture**: Separation of mathematical engine from UI layer.
