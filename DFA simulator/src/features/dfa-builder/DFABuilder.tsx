
import React, { useState } from 'react';

import { useDFAStore } from '../../hooks/useDFAStore';
import { DFACanvas } from './DFACanvas';
import { validateDFA } from '../../engine/dfa';

import { SimulationWorkspace } from '../simulation/SimulationWorkspace';
import { SimulationResult } from '../../types/automata';
import { ExampleBrowser } from '../learning/ExampleBrowser';

export function DFABuilder() {
  const {
    dfa,
    setDfa,
    addState,
    toggleAccepting,
    setStartState,
    addTransition,
    updateTransition,
  } = useDFAStore();

  const [, setSimResult] = useState<SimulationResult | null>(null);

  const [activeStateId, setActiveStateId] =
    useState<string | null>(null);

  const [showExamples, setShowExamples] = useState(false);

  const validation = validateDFA(dfa);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <header className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            DFA Simulator
          </h1>

          <p className="text-gray-500">
            Design and test your automaton
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setShowExamples(!showExamples)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            {showExamples
              ? '← Back to Editor'
              : '📚 Example Library'}
          </button>

          <button
            onClick={() =>
              addState(`q${dfa.states.length}`, 0, 0)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add State
          </button>

        </div>
      </header>

      {showExamples ? (

        /* Example library */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h2 className="text-blue-800 font-bold text-xl mb-2">
              Learning Library
            </h2>

            <p className="text-blue-600 text-sm">
              Select an example to load it into the simulator and see how it works.
            </p>
          </div>

          <ExampleBrowser
            onSelectExample={(loadedDfa) => {
              setDfa(loadedDfa);
              setActiveStateId(loadedDfa.startStateId);
              setShowExamples(false);
            }}
          />

        </div>

      ) : (

        /* Main DFA builder */
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          <div className="xl:col-span-3 space-y-6">

            {/* DFA Canvas */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">

              <DFACanvas
                dfa={dfa}
                activeStateId={activeStateId ?? dfa.startStateId}
                onAddTransition={addTransition}
                onUpdateTransition={updateTransition}
              />

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-green-400 border border-green-600"></span>
                Green state = Currently active state
              </div>

              <p className="text-xs text-gray-400 mt-2 italic">
                Tip: Drag between states to create a transition.
                Click a transition label to edit its input symbol.
              </p>

            </div>

            {/* Simulation Workspace */}
            <SimulationWorkspace
              dfa={dfa}
              onSimulationComplete={setSimResult}
              onActiveStateChange={setActiveStateId}
            />

          </div>

          {/* State Properties and Validation */}
          <div className="space-y-6">

            <div className="bg-white p-4 rounded-xl shadow-sm border">

              <h2 className="text-lg font-semibold mb-4">
                State Properties
              </h2>

              <div className="space-y-3">

                {dfa.states.map(state => (

                  <div
                    key={state.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                  >

                    <span className="font-medium">
                      {state.label}
                    </span>

                    <div className="flex gap-2">

                      <button
                        onClick={() => toggleAccepting(state.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          state.isAccepting
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100'
                        }`}
                      >
                        {state.isAccepting
                          ? 'Accepting'
                          : 'Normal'}
                      </button>

                      <button
                        onClick={() => setStartState(state.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          state.id === dfa.startStateId
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100'
                        }`}
                      >
                        Start
                      </button>

                    </div>

                  </div>

                ))}

                {dfa.states.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No states added yet.
                  </p>
                )}

              </div>

            </div>

            {/* DFA Validation */}
            <div
              className={`p-4 rounded-xl border ${
                validation.isValid
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >

              <h2
                className={`text-lg font-semibold mb-2 ${
                  validation.isValid
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {validation.isValid
                  ? '✓ Valid DFA'
                  : '⚠ Incomplete DFA'}
              </h2>

              <ul className="text-sm space-y-1 text-red-600">
                {validation.errors.map((err, index) => (
                  <li key={index}>• {err}</li>
                ))}
              </ul>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
