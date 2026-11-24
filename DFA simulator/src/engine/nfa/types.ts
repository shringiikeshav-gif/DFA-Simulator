export type { DFA, DFAState, DFATransition } from '../../types/automata';

export interface NFA {
  id: string;
  name: string;
  alphabet: string[];
  states: NFAState[];
  transitions: NFATransition[];
  startStateId: string;
}

export interface NFAState {
  id: string;
  label: string;
  isAccepting: boolean;
}

export interface NFATransition {
  from: string;
  symbol: string | 'ε'; // Supports epsilon transitions
  to: string;
}

export interface ConversionStep {
  subset: string[];
  symbol: string;
  nextSubset: string[];
}
