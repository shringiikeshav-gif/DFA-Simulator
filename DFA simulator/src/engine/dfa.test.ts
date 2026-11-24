import { describe, it, expect } from 'vitest';
import { validateDFA, simulateDFA, DFA } from './dfa';

// Example: DFA that accepts binary strings ending in '1'
// Alphabet: {0, 1}
// States: q0 (start, non-accepting), q1 (accepting)
// Transitions:
// (q0, 0) -> q0
// (q0, 1) -> q1
// (q1, 0) -> q0
// (q1, 1) -> q1
const binaryEndsInOne: DFA = {
  id: '1',
  name: 'Ends in 1',
  alphabet: ['0', '1'],
  states: [
    { id: 'q0', label: 'q0', isAccepting: false },
    { id: 'q1', label: 'q1', isAccepting: true },
  ],
  transitions: [
    { from: 'q0', symbol: '0', to: 'q0' },
    { from: 'q0', symbol: '1', to: 'q1' },
    { from: 'q1', symbol: '0', to: 'q0' },
    { from: 'q1', symbol: '1', to: 'q1' },
  ],
  startStateId: 'q0',
};

describe('DFA Engine', () => {
  describe('validateDFA', () => {
    it('should validate a correct complete DFA', () => {
      const result = validateDFA(binaryEndsInOne);
      expect(result.isValid).toBe(true);
    });

    it('should fail if a transition is missing', () => {
      const incompleteDFA = { ...binaryEndsInOne, transitions: binaryEndsInOne.transitions.slice(0, 3) };
      const result = validateDFA(incompleteDFA);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('missing a transition');
    });

    it('should fail if the start state is missing', () => {
      const brokenDFA = { ...binaryEndsInOne, startStateId: 'non-existent' };
      const result = validateDFA(brokenDFA);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Start state ID');
    });
  });

  describe('simulateDFA', () => {
    it('should accept strings ending in 1', () => {
      expect(simulateDFA(binaryEndsInOne, '1').isAccepted).toBe(true);
      expect(simulateDFA(binaryEndsInOne, '01').isAccepted).toBe(true);
      expect(simulateDFA(binaryEndsInOne, '11').isAccepted).toBe(true);
      expect(simulateDFA(binaryEndsInOne, '0001').isAccepted).toBe(true);
    });

    it('should reject strings ending in 0', () => {
      expect(simulateDFA(binaryEndsInOne, '0').isAccepted).toBe(false);
      expect(simulateDFA(binaryEndsInOne, '10').isAccepted).toBe(false);
      expect(simulateDFA(binaryEndsInOne, '010').isAccepted).toBe(false);
      expect(simulateDFA(binaryEndsInOne, '0000').isAccepted).toBe(false);
    });

    it('should handle the empty string', () => {
      // Start state q0 is not accepting, so empty string should be rejected
      expect(simulateDFA(binaryEndsInOne, '').isAccepted).toBe(false);
    });

    it('should throw error for symbols not in alphabet', () => {
      expect(() => simulateDFA(binaryEndsInOne, '2')).toThrow('not part of the DFA alphabet');
    });

    it('should produce a correct execution trace', () => {
      const result = simulateDFA(binaryEndsInOne, '01');
      expect(result.trace).toHaveLength(2);
      expect(result.trace[0]).toEqual({
        step: 1,
        currentState: 'q0',
        symbol: '0',
        nextState: 'q0'
      });
      expect(result.trace[1]).toEqual({
        step: 2,
        currentState: 'q0',
        symbol: '1',
        nextState: 'q1'
      });
    });
  });
});
