import { DFA, DFAState, DFATransition } from '../../types/automata';

/**
 * Minimizes a DFA using the Partition Refinement (Myhill-Nerode) algorithm.
 */
export function minimizeDFA(dfa: DFA): DFA {
  const { states, alphabet, transitions, startStateId } = dfa;

  // 1. Remove unreachable states first
  const reachable = new Set<string>();
  const stack = [startStateId];
  while (stack.length > 0) {
    const curr = stack.pop()!;
    if (!reachable.has(curr)) {
      reachable.add(curr);
      transitions
        .filter(t => t.from === curr)
        .forEach(t => stack.push(t.to));
    }
  }

  const filteredStates = states.filter(s => reachable.has(s.id));
  const filteredTransitions = transitions.filter(t => reachable.has(t.from) && reachable.has(t.to));

  // 2. Initial Partition: Accepting vs Non-Accepting
  let partitions: Set<string>[] = [
    new Set(filteredStates.filter(s => s.isAccepting).map(s => s.id)),
    new Set(filteredStates.filter(s => !s.isAccepting).map(s => s.id)),
  ].filter(p => p.size > 0);

  let changed = true;
  while (changed) {
    changed = false;
    const newPartitions: Set<string>[] = [];

    for (const partition of partitions) {
      if (partition.size <= 1) {
        newPartitions.push(partition);
        continue;
      }

      // Split partition into groups that behave the same for all symbols
      const groups = new Map<string, Set<string>>();

      for (const stateId of partition) {
        // Create a "behavior key" for this state
        const behaviorKey = alphabet.map(symbol => {
          const trans = filteredTransitions.find(t => t.from === stateId && t.symbol === symbol);
          const targetId = trans?.to;
          // Find which partition index the target state belongs to
          return partitions.findIndex(p => p.has(targetId!));
        }).join('|');

        if (!groups.has(behaviorKey)) groups.set(behaviorKey, new Set());
        groups.get(behaviorKey)!.add(stateId);
      }

      if (groups.size > 1) changed = true;
      groups.forEach(group => newPartitions.push(group));
    }
    partitions = newPartitions;
  }

  // 3. Construct minimized DFA
  const stateToPartitionId = new Map<string, string>();
  partitions.forEach((p, idx) => {
    const pId = `P${idx}`;
    p.forEach(sId => stateToPartitionId.set(sId, pId));
  });

  const minimizedStates: DFAState[] = partitions.map((p, idx) => {
    const representative = Array.from(p)[0];
    const originalState = states.find(s => s.id === representative)!;
    return {
      id: `P${idx}`,
      label: `P${idx}`,
      isAccepting: originalState.isAccepting,
    };
  });

  const minimizedTransitions: DFATransition[] = [];
  partitions.forEach((p, idx) => {
    const representative = Array.from(p)[0];
    alphabet.forEach(symbol => {
      const trans = filteredTransitions.find(t => t.from === representative && t.symbol === symbol);
      if (trans) {
        minimizedTransitions.push({
          from: `P${idx}`,
          symbol,
          to: stateToPartitionId.get(trans.to)!,
        });
      }
    });
  });

  return {
    id: `min-${dfa.id}`,
    name: `Minimized ${dfa.name}`,
    alphabet,
    states: minimizedStates,
    transitions: minimizedTransitions,
    startStateId: stateToPartitionId.get(startStateId)!,
  };
}
