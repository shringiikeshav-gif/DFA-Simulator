import { useState, useCallback } from 'react';
import { DFA, DFAState, DFATransition } from '../types/automata';

export function useDFAStore() {
  const [dfa, setDfa] = useState<DFA>({
    id: 'default',
    name: 'Untitled DFA',
    alphabet: ['0', '1'],
    states: [],
    transitions: [],
    startStateId: '',
  });

  const addState = (label: string, x: number, y: number) => {
    const id = `s${dfa.states.length}`;
    const newState: DFAState = {
      id,
      label,
      isAccepting: false,
    };

    // Set as start state if it's the first state
    const newStartId = dfa.states.length === 0 ? id : dfa.startStateId;

    setDfa(prev => ({
      ...prev,
      states: [...prev.states, newState],
      startStateId: newStartId,
    }));
    return id;
  };

  const toggleAccepting = (stateId: string) => {
    setDfa(prev => ({
      ...prev,
      states: prev.states.map(s =>
        s.id === stateId ? { ...s, isAccepting: !s.isAccepting } : s
      ),
    }));
  };

  const setStartState = (stateId: string) => {
    setDfa(prev => ({ ...prev, startStateId: stateId }));
  };

  const addTransition = (from: string, symbol: string, to: string) => {
    // Keep the DFA deterministic: one destination per state and input symbol.
    setDfa(prev => ({
      ...prev,
      transitions: [
        ...prev.transitions.filter(t => !(t.from === from && t.symbol === symbol)),
        { from, symbol, to },
      ],
    }));
  };

  const updateTransition = (
    from: string,
    oldSymbol: string,
    to: string,
    newSymbol: string
  ) => {
    const symbol = newSymbol.trim();
    if (!symbol || symbol === oldSymbol) return;

    setDfa(prev => {
      const hasSelectedTransition = prev.transitions.some(
        t => t.from === from && t.symbol === oldSymbol && t.to === to
      );
      if (!hasSelectedTransition) return prev;

      // If this state already has a transition for the new symbol, replace it
      // to preserve the DFA's deterministic-transition rule.
      const withoutConflict = prev.transitions.filter(
        t => !(t.from === from && t.symbol === symbol)
      );
      return {
        ...prev,
        transitions: withoutConflict.map(t =>
          t.from === from && t.symbol === oldSymbol && t.to === to
            ? { ...t, symbol }
            : t
        ),
      };
    });
  };

  return {
    dfa,
    setDfa,
    addState,
    toggleAccepting,
    setStartState,
    addTransition,
    updateTransition,
  };
}
