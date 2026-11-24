import React from 'react';
import { LearningExample, PREDEFINED_EXAMPLES } from './examples';
import { DFA } from '../../types/automata';

interface ExampleBrowserProps {
  onSelectExample: (dfa: DFA) => void;
}

export function ExampleBrowser({ onSelectExample }: ExampleBrowserProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {PREDEFINED_EXAMPLES.map(example => (
        <div
          key={example.id}
          className="bg-white p-4 rounded-xl border shadow-sm hover:border-blue-400 transition cursor-pointer group"
          onClick={() => onSelectExample(example.dfa)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg group-hover:text-blue-600 transition">{example.title}</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
              Σ = {`{${example.alphabet.join(',')}}`}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{example.problemStatement}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-blue-500 font-medium">Load into simulator →</span>
            <div className="flex gap-1">
              {example.testStrings.slice(0, 3).map((ts, i) => (
                <span key={i} className={`text-[10px] px-1 rounded ${ts.expected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {ts.string}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
