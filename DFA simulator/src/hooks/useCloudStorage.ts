import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { DFA } from '../types/automata';

export function useCloudStorage() {
  const [isSaving, setIsSaving] = useState(false);

  const saveAutomaton = async (dfa: DFA, userId: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('automata')
        .upsert({
          id: dfa.id,
          user_id: userId,
          name: dfa.name,
          data: dfa,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Saved successfully to cloud!');
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const loadAutomata = async (userId: string) => {
    const { data, error } = await supabase
      .from('automata')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  };

  return { saveAutomaton, loadAutomata, isSaving };
}
