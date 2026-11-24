
import React, { useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { DFA, DFATransition } from '../../types/automata';

interface DFACanvasProps {
  dfa: DFA;
  activeStateId?: string | null;
  onAddTransition: (from: string, symbol: string, to: string) => void;
  onUpdateTransition?: (
    from: string,
    oldSymbol: string,
    to: string,
    newSymbol: string
  ) => void;
}

export function DFACanvas({
  dfa,
  activeStateId,
  onAddTransition,
  onUpdateTransition,
}: DFACanvasProps) {
  const [selectedTransition, setSelectedTransition] =
    useState<DFATransition | null>(null);

  const [editedSymbol, setEditedSymbol] = useState('');

  // Create DFA states and highlight the currently active state.
  const nodes: Node[] = useMemo(
    () =>
      dfa.states.map((state, index) => {
        const isActive = state.id === activeStateId;
        const isStart = state.id === dfa.startStateId;

        return {
          id: state.id,
          data: { label: state.label },
          position: {
            x: 100 + index * 150,
            y: 100,
          },
          style: {
            border: isActive
              ? '4px solid #16a34a'
              : state.isAccepting
              ? '4px double #1f2937'
              : '2px solid #1f2937',

            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            backgroundColor: isActive
              ? '#bbf7d0'
              : isStart
              ? '#e0f2fe'
              : 'white',

            boxShadow: isActive
              ? '0 0 0 6px rgba(34, 197, 94, 0.25)'
              : 'none',

            fontWeight: 'bold',
            transition: 'all 0.25s ease',
          },
        };
      }),
    [dfa.states, dfa.startStateId, activeStateId]
  );

  // Create transition edges.
  const edges: Edge[] = useMemo(
    () =>
      dfa.transitions.map((transition, index) => ({
        id: `transition-${index}`,
        source: transition.from,
        target: transition.to,
        label: transition.symbol,
        data: { transition },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#333',
        },
        style: {
          strokeWidth: 2,
          stroke: '#333',
        },
        labelStyle: {
          fill: '#ef4444',
          fontWeight: 'bold',
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      })),
    [dfa.transitions]
  );

  // Add a transition with an input symbol.
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const symbol = window.prompt(
        `Enter input symbol (${dfa.alphabet.join(', ')}):`,
        dfa.alphabet[0] ?? '0'
      );

      if (symbol === null || !symbol.trim()) return;

      const inputSymbol = symbol.trim();

      if (!dfa.alphabet.includes(inputSymbol)) {
        window.alert(
          `Invalid symbol! Enter one of: ${dfa.alphabet.join(', ')}`
        );
        return;
      }

      const existing = dfa.transitions.find(
        t =>
          t.from === params.source &&
          t.symbol === inputSymbol
      );

      if (existing) {
        if (existing.to === params.target) {
          window.alert('This transition already exists.');
        } else {
          window.alert(
            `DFA rule: This state already has a transition for input ${inputSymbol}.`
          );
        }
        return;
      }

      onAddTransition(
        params.source,
        inputSymbol,
        params.target
      );
    },
    [dfa.alphabet, dfa.transitions, onAddTransition]
  );

  // Select a transition for editing.
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      const transition = edge.data?.transition as
        | DFATransition
        | undefined;

      if (!transition) return;

      setSelectedTransition(transition);
      setEditedSymbol(transition.symbol);
    },
    []
  );

  // Save an edited transition.
  const saveTransition = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedTransition || !onUpdateTransition) return;

    const symbol = editedSymbol.trim();

    if (!symbol) return;

    if (!dfa.alphabet.includes(symbol)) {
      window.alert(
        `Invalid symbol! Enter one of: ${dfa.alphabet.join(', ')}`
      );
      return;
    }

    const conflict = dfa.transitions.some(
      t =>
        t.from === selectedTransition.from &&
        t.symbol === symbol &&
        !(
          t.from === selectedTransition.from &&
          t.to === selectedTransition.to &&
          t.symbol === selectedTransition.symbol
        )
    );

    if (conflict) {
      window.alert(
        `A transition for input ${symbol} already exists from this state.`
      );
      return;
    }

    onUpdateTransition(
      selectedTransition.from,
      selectedTransition.symbol,
      selectedTransition.to,
      symbol
    );

    setSelectedTransition(null);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        position: 'relative',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        fitView
        connectionLineStyle={{
          stroke: '#2563eb',
          strokeWidth: 2,
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Transition editing panel */}
      {selectedTransition && (
        <form
          onSubmit={saveTransition}
          onClick={event => event.stopPropagation()}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
            width: 250,
            padding: 14,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 10,
            boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Edit transition
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#6b7280',
              marginBottom: 8,
            }}
          >
            {dfa.states.find(
              state => state.id === selectedTransition.from
            )?.label ?? selectedTransition.from}
            {' → '}
            {dfa.states.find(
              state => state.id === selectedTransition.to
            )?.label ?? selectedTransition.to}
          </div>

          <label
            htmlFor="transition-symbol"
            style={{
              display: 'block',
              fontSize: 13,
              marginBottom: 5,
            }}
          >
            Input symbol
          </label>

          <input
            id="transition-symbol"
            autoFocus
            value={editedSymbol}
            onChange={event =>
              setEditedSymbol(event.target.value)
            }
            maxLength={1}
            required
            style={{
              width: '100%',
              border: '1px solid #9ca3af',
              borderRadius: 6,
              padding: '7px 9px',
              marginBottom: 10,
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedTransition(null)}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: '#f3f4f6',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!onUpdateTransition || !editedSymbol.trim()}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                color: '#fff',
                background: '#2563eb',
                opacity: onUpdateTransition ? 1 : 0.5,
              }}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
