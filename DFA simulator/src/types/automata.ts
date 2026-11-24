export interface DFAState {
  id: string;
  label: string;
  isAccepting: boolean;
}

export interface DFATransition {
  from: string; // State ID
  symbol: string;
  to: string;   // State ID
}

export interface DFA {
  id: string;
  name: string;
  alphabet: string[];
  states: DFAState[];
  transitions: DFATransition[];
  startStateId: string;
}

export interface SimulationStep {
  step: number;
  currentState: string;
  symbol: string;
  nextState: string;
}

export interface SimulationResult {
  isAccepted: boolean;
  finalState: string;
  trace: SimulationStep[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
