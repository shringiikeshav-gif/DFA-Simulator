import { DFA } from '../../types/automata';

export interface LearningExample {
  id: string;
  title: string;
  problemStatement: string;
  alphabet: string[];
  dfa: DFA;
  explanation: string;
  testStrings: { string: string; expected: boolean }[];
}

export const PREDEFINED_EXAMPLES: LearningExample[] = [
  {
    id: 'ends-with-1',
    title: 'Ends with 1',
    problemStatement: 'Accepts binary strings that end with the symbol 1.',
    alphabet: ['0', '1'],
    dfa: {
      id: 'ex1',
      name: 'Ends with 1',
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
    },
    explanation: 'The DFA stays in q0 as long as it sees 0s. Whenever it sees a 1, it moves to q1. If the string ends while in q1, it means the last character was a 1, so the string is accepted.',
    testStrings: [
      { string: '1', expected: true },
      { string: '01', expected: true },
      { string: '11', expected: true },
      { string: '0', expected: false },
      { string: '10', expected: false },
    ],
  },
  {
    id: 'even-zeros',
    title: 'Even number of 0s',
    problemStatement: 'Accepts binary strings containing an even number of 0s.',
    alphabet: ['0', '1'],
    dfa: {
      id: 'ex2',
      name: 'Even 0s',
      alphabet: ['0', '1'],
      states: [
        { id: 'q_even', label: 'q_even', isAccepting: true },
        { id: 'q_odd', label: 'q_odd', isAccepting: false },
      ],
      transitions: [
        { from: 'q_even', symbol: '0', to: 'q_odd' },
        { from: 'q_even', symbol: '1', to: 'q_even' },
        { from: 'q_odd', symbol: '0', to: 'q_even' },
        { from: 'q_odd', symbol: '1', to: 'q_odd' },
      ],
      startStateId: 'q_even',
    },
    explanation: 'We use states to keep track of the "parity" of 0s. q_even means we have seen an even number of 0s so far. Seeing another 0 flips the parity to odd (q_odd).',
    testStrings: [
      { string: '00', expected: true },
      { string: '11', expected: true },
      { string: '010', expected: true },
      { string: '0', expected: false },
      { string: '000', expected: false },
    ],
  },
  {
    id: 'contains-00',
    title: 'Contains 00',
    problemStatement: 'Accepts binary strings that contain the substring "00".',
    alphabet: ['0', '1'],
    dfa: {
      id: 'ex3',
      name: 'Contains 00',
      alphabet: ['0', '1'],
      states: [
        { id: 'q0', label: 'q0', isAccepting: false },
        { id: 'q1', label: 'q1', isAccepting: false },
        { id: 'q2', label: 'q2', isAccepting: true },
      ],
      transitions: [
        { from: 'q0', symbol: '0', to: 'q1' },
        { from: 'q0', symbol: '1', to: 'q0' },
        { from: 'q1', symbol: '0', to: 'q2' },
        { from: 'q1', symbol: '1', to: 'q0' },
        { from: 'q2', symbol: '0', to: 'q2' },
        { from: 'q2', symbol: '1', to: 'q2' },
      ],
      startStateId: 'q0',
    },
    explanation: 'q0 is the start. If we see a 0, we move to q1 (halfway there). If we see another 0 immediately, we reach q2 (goal). Once in q2, we stay there regardless of future symbols because the condition "contains 00" is already met.',
    testStrings: [
      { string: '00', expected: true },
      { string: '1001', expected: true },
      { string: '010', expected: false },
      { string: '111', expected: false },
    ],
  },
];
