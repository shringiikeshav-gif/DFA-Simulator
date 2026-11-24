import { NFA, ConversionStep, type DFA, type DFAState, type DFATransition } from './types';

/**
 * Computes the epsilon closure of a set of NFA states.
 * The epsilon closure is the set of all states reachable from the given states using only epsilon transitions.
 */
export function computeEpsilonClosure(states: string[], nfa: NFA): string[] {
  const closure = new Set<string>(states);
  const stack = [...states];

  while (stack.length > 0) {
    const stateId = stack.pop()!;
    const epsilonTransitions = nfa.transitions.filter(t => t.from === stateId && t.symbol === 'ε');

    for (const t of epsilonTransitions) {
      if (!closure.has(t.to)) {
        closure.add(t.to);
        stack.push(t.to);
      }
    }
  }

  return Array.from(closure).sort();
}

/**
 * Converts an NFA to an equivalent DFA using the Subset Construction (Powerset Construction) algorithm.
 */
export function convertNFAToDFA(nfa: NFA): { dfa: DFA, steps: ConversionStep[] } {
  const alphabet = nfa.alphabet;
  const steps: ConversionStep[] = [];

  // The start state of the DFA is the epsilon closure of the NFA's start state
  const startClosure = computeEpsilonClosure([nfa.startStateId], nfa);
  const dfaStatesMap = new Map<string, string>(); // Map sorted subset string -> DFA state ID
  const dfaStates: DFAState[] = [];
  const dfaTransitions: DFATransition[] = [];

  const getDFAStateId = (subset: string[]) => {
    const key = subset.sort().join(',');
    if (!dfaStatesMap.has(key)) {
      const id = `S${dfaStatesMap.size}`;
      dfaStatesMap.set(key, id);

      // A DFA state is accepting if any of its NFA states are accepting
      const isAccepting = subset.some(stateId =>
        nfa.states.find(s => s.id === stateId)?.isAccepting
      );

      dfaStates.push({ id, label: `{${subset.join(',')}}`, isAccepting });
    }
    return dfaStatesMap.get(key)!;
  };

  const startId = getDFAStateId(startClosure);
  const queue: string[][] = [startClosure];
  const processedSubsets = new Set<string>();

  while (queue.length > 0) {
    const currentSubset = queue.shift()!;
    const currentKey = currentSubset.sort().join(',');

    if (processedSubsets.has(currentKey)) continue;
    processedSubsets.add(currentKey);

    const currentDfaId = getDFAStateId(currentSubset);

    for (const symbol of alphabet) {
      // 1. Find all states reachable from the current subset on this symbol
      const nextStates = new Set<string>();
      for (const stateId of currentSubset) {
        const transitions = nfa.transitions.filter(t => t.from === stateId && t.symbol === symbol);
        transitions.forEach(t => nextStates.add(t.to));
      }

      // 2. Compute epsilon closure of the resulting set
      const nextClosure = computeEpsilonClosure(Array.from(nextStates), nfa);
      const nextDfaId = getDFAStateId(nextClosure);

      dfaTransitions.push({ from: currentDfaId, symbol, to: nextDfaId });

      steps.push({
        subset: currentSubset,
        symbol: symbol,
        nextSubset: nextClosure
      });

      if (!processedSubsets.has(nextClosure.sort().join(','))) {
        queue.push(nextClosure);
      }
    }
  }

  return {
    dfa: {
      id: `dfa-${nfa.id}`,
      name: `DFA from ${nfa.name}`,
      alphabet,
      states: dfaStates,
      transitions: dfaTransitions,
      startStateId: startId,
    },
    steps
  };
}
