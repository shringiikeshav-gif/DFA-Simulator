import { DFA, ValidationResult, SimulationResult, SimulationStep } from '../types/automata';

export type { DFA } from '../types/automata';

// Function to check if the DFA is valid
export function validateDFA(dfa: DFA): ValidationResult {
  const errors: string[] = [];
  const stateIds = new Set(dfa.states.map(s => s.id));

  if (!stateIds.has(dfa.startStateId)) {
    errors.push(`Start state ID '${dfa.startStateId}' not found.`);
  }

  for (const t of dfa.transitions) {
    if (!stateIds.has(t.from)) errors.push(`From state ${t.from} is missing`);
    if (!stateIds.has(t.to)) errors.push(`To state ${t.to} is missing`);
    if (!dfa.alphabet.includes(t.symbol)) {
      errors.push(`Symbol ${t.symbol} is not in alphabet.`);
    }
  }

  for (const state of dfa.states) {
    for (const symbol of dfa.alphabet) {
      const transition = dfa.transitions.find(t => t.from === state.id && t.symbol === symbol);
      if (!transition) {
        errors.push(`State ${state.label} is missing a transition for symbol '${symbol}'.`);
      } else {
        const dups = dfa.transitions.filter(t => t.from === state.id && t.symbol === symbol);
        if (dups.length > 1) {
          errors.push(`State ${state.label} has too many transitions for ${symbol}.`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Simulates the DFA with an input string
export function simulateDFA(dfa: DFA, input: string): SimulationResult {
  let currState = dfa.startStateId;
  const trace: SimulationStep[] = [];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (!dfa.alphabet.includes(char)) {
      throw new Error(`Symbol '${char}' is not part of the DFA alphabet.`);
    }

    const trans = dfa.transitions.find(t => t.from === currState && t.symbol === char);

    if (!trans) {
      throw new Error(`No transition from ${currState} on ${char}.`);
    }

    trace.push({
      step: i + 1,
      currentState: currState,
      symbol: char,
      nextState: trans.to
    });

    currState = trans.to;
  }

  const finalState = dfa.states.find(s => s.id === currState);
  return {
    isAccepted: finalState?.isAccepting ?? false,
    finalState: currState,
    trace
  };
}
