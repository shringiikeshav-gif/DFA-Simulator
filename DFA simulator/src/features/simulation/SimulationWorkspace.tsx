
import React, { useState, useEffect, useCallback } from 'react';
import {
  DFA,
  SimulationResult,
} from '../../types/automata';

import { simulateDFA } from '../../engine/dfa';

interface SimulationWorkspaceProps {
  dfa: DFA;
  onSimulationComplete: (result: SimulationResult) => void;
  onActiveStateChange: (stateId: string) => void;
}

export function SimulationWorkspace({
  dfa,
  onSimulationComplete,
  onActiveStateChange,
}: SimulationWorkspaceProps) {
  const [inputString, setInputString] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);

  const [isRunning, setIsRunning] = useState(false);

  // Reset the complete simulation.
  const resetSimulation = useCallback(() => {
    setInputString('');
    setSimulationResult(null);
    setCurrentStepIndex(-1);
    setIsRunning(false);

    // Return highlighting to the start state.
    onActiveStateChange(dfa.startStateId);
  }, [dfa.startStateId, onActiveStateChange]);

  // Reset whenever the DFA changes.
  useEffect(() => {
    resetSimulation();
  }, [dfa, resetSimulation]);

  // Run the DFA simulation.
  const handleSimulate = () => {
    try {
      const result = simulateDFA(dfa, inputString);

      setSimulationResult(result);

      setCurrentStepIndex(
        result.trace.length > 0 ? 0 : -1
      );

      setIsRunning(true);

      // Highlight the state reached after the first input symbol.
      onActiveStateChange(
        result.trace[0]?.nextState ?? dfa.startStateId
      );

      onSimulationComplete(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Simulation failed.';

      window.alert(message);
    }
  };

  // Move to the next simulation step.
  const nextStep = () => {
    if (
      !simulationResult ||
      currentStepIndex >= simulationResult.trace.length - 1
    ) {
      return;
    }

    const nextIndex = currentStepIndex + 1;

    setCurrentStepIndex(nextIndex);

    onActiveStateChange(
      simulationResult.trace[nextIndex].nextState
    );
  };

  // Move to the previous simulation step.
  const prevStep = () => {
    if (!simulationResult || currentStepIndex <= 0) return;

    const previousIndex = currentStepIndex - 1;

    setCurrentStepIndex(previousIndex);

    onActiveStateChange(
      simulationResult.trace[previousIndex].nextState
    );
  };

  // Get the current simulation step.
  const getCurrentStep = () => {
    if (
      !simulationResult ||
      currentStepIndex < 0
    ) {
      return null;
    }

    return simulationResult.trace[currentStepIndex] ?? null;
  };

  // Update input and clear the previous simulation.
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputString(event.target.value);

    setSimulationResult(null);
    setCurrentStepIndex(-1);
    setIsRunning(false);

    onActiveStateChange(dfa.startStateId);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">

      {/* Input section */}
      <div className="flex flex-col md:flex-row gap-4 items-end">

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Input String
          </label>

          <input
            type="text"
            value={inputString}
            onChange={handleInputChange}
            placeholder="e.g. 1011"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          onClick={handleSimulate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Simulate
        </button>

        {/* Dedicated Reset button */}
        <button
          onClick={resetSimulation}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          ↻ Reset
        </button>

      </div>

      {/* Simulation controls and results */}
      {isRunning && simulationResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

          {/* Previous and Next controls */}
          <div className="flex justify-center items-center gap-4">

            <button
              onClick={prevStep}
              disabled={currentStepIndex <= 0}
              className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-30"
            >
              ← Prev
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Step {currentStepIndex + 1} of {simulationResult.trace.length}
              </p>

              <p className="font-bold text-lg">
                State:{' '}
                <span className="text-green-600">
                  {getCurrentStep()?.nextState ?? dfa.startStateId}
                </span>
              </p>
            </div>

            <button
              onClick={nextStep}
              disabled={
                currentStepIndex >= simulationResult.trace.length - 1
              }
              className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-30"
            >
              Next →
            </button>

          </div>

          {/* Input symbol visualization */}
          <div className="flex justify-center gap-2 flex-wrap">

            {inputString.split('').map((char, index) => (
              <span
                key={index}
                className={`w-8 h-8 flex items-center justify-center rounded border font-mono transition-all ${
                  index === currentStepIndex
                    ? 'bg-blue-600 text-white scale-110 ring-2 ring-blue-300'
                    : 'bg-white'
                }`}
              >
                {char}
              </span>
            ))}

            {inputString === '' && (
              <span className="text-gray-400 italic text-sm">
                Empty string (ε)
              </span>
            )}

          </div>

          {/* Final result */}
          <div
            className={`p-4 rounded-lg text-center font-bold ${
              simulationResult.isAccepted
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {simulationResult.isAccepted
              ? '✓ String Accepted'
              : '✗ String Rejected'}
          </div>

        </div>
      )}

    </div>
  );
}
