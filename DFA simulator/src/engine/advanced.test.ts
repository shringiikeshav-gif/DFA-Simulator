import { describe, it, expect } from 'vitest';
import { convertNFAToDFA } from './nfa/converter';
import { minimizeDFA } from './minimization/minimizer';
import { NFA } from './nfa/types';
import { DFA } from '../types/automata';

describe('Advanced Automata Algorithms', () => {
  describe('NFA to DFA Conversion', () => {
    it('should convert a simple NFA to DFA', () => {
      const nfa: NFA = {
        id: 'n1',
        name: 'NFA Ends with 1',
        alphabet: ['0', '1'],
        states: [
          { id: 'q0', label: 'q0', isAccepting: false },
          { id: 'q1', label: 'q1', isAccepting: true },
        ],
        transitions: [
          { from: 'q0', symbol: '0', to: 'q0' },
          { from: 'q0', symbol: '1', to: 'q0' },
          { from: 'q0', symbol: '1', to: 'q1' },
        ],
        startStateId: 'q0',
      };

      const { dfa } = convertNFAToDFA(nfa);
      expect(dfa.states).toHaveLength(2);
      expect(dfa.startStateId).toBeDefined();
      // In DFA, q0 on '1' should go to a state that includes both q0 and q1
      const startTransition = dfa.transitions.find(t => t.from === dfa.startStateId && t.symbol === '1');
      expect(startTransition?.to).not.toBe(dfa.startStateId);
    });

    it('should handle epsilon transitions', () => {
      const nfa: NFA = {
        id: 'n2',
        name: 'NFA Epsilon',
        alphabet: ['0'],
        states: [
          { id: 'q0', label: 'q0', isAccepting: false },
          { id: 'q1', label: 'q1', isAccepting: true },
        ],
        transitions: [
          { from: 'q0', symbol: 'ε', to: 'q1' },
        ],
        startStateId: 'q0',
      };

      const { dfa } = convertNFAToDFA(nfa);
      // Start state closure should be {q0, q1}, which is accepting
      const startState = dfa.states.find(s => s.id === dfa.startStateId);
      expect(startState?.isAccepting).toBe(true);
    });
  });

  describe('DFA Minimization', () => {
    it('should minimize a DFA with redundant states', () => {
      // DFA that accepts anything ending in 1
      // q0 (start) -> '1' -> q1 (acc)
      // q1 (acc) -> '1' -> q1 (acc)
      // q0 -> '0' -> q0
      // q1 -> '0' -> q0
      // But let's add a redundant state q2 that behaves exactly like q1
      const redundantDFA: DFA = {
        id: 'd1',
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
      };

      const minimized = minimizeDFA(redundantDFA);
      // q1 and q2 should be merged because they are both accepting and transition to the same groups
      expect(minimized.states.length).toBeLessThan(redundantDFA.states.length);
      expect(minimized.states.length).toBe(2);
    });
  });
});
