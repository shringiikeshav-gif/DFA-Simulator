import React, { useState } from 'react';
import { DFA } from '../../types/automata';
import { minimizeDFA } from '../../engine/minimization/minimizer';
import { DFACanvas } from '../dfa-builder/DFACanvas';

export function MinimizationTool() {
  const [inputDFA, setInputDFA] = useState<DFA | null>(null);
  const [minimizedDFA, setMinimizedDFA] = useState<DFA | null>(null);

  const handleMinimize = () => {
    if (!inputDFA) return;
    const result = minimizeDFA(inputDFA);
    setMinimizedDFA(result);
  };

  // Simple helper to create a redundant DFA for demonstration
  const loadExample = () => {
    setInputDFA({
      id: 'demo',
      name: 'Redundant DFA',
      alphabet: ['0', '1'],
      states: [
        { id: 'q0', label: 'q0', isAccepting: false },
        { id: 'q1', label: 'q1', isAccepting: true },
        { id: 'q2', label: 'q2', isAccepting: true },
      ],
      transitions: [
        { from: 'q0', symbol: '0', to: 'q0' },
        { from: 'q0', symbol: '1', to: 'q1' },
        { from: 'q1', symbol: '0', to: 'q0' },
        { from: 'q1', symbol: '1', to: 'q2' },
        { from: 'q2', symbol: '0', to: 'q0' },
        { from: 'q2', symbol: '1', to: 'q2' },
      ],
      startStateId: 'q0',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-2">DFA Minimization</h2>
        <p className="text-gray-500 mb-6">Remove redundant states while preserving the language.</p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={loadExample}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            Load Redundant Example
          </button>
          <button
            onClick={handleMinimize}
            disabled={!inputDFA}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
          >
            Minimize Now →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Original DFA</h3>
            <div className="h-[400px] border rounded-lg bg-gray-50">
              {inputDFA ? (
                <DFACanvas dfa={inputDFA} onAddTransition={() => {}} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic">
                  No DFA loaded
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Minimized DFA</h3>
            <div className="h-[400px] border rounded-lg bg-gray-50">
              {minimizedDFA ? (
                <DFACanvas dfa={minimizedDFA} onAddTransition={() => {}} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic">
                  No result yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
