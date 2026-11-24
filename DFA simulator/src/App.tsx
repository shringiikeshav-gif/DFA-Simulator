import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DFABuilder } from './features/dfa-builder/DFABuilder';
import { MinimizationTool } from './features/conversion/MinimizationTool';

export function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'tools'>('simulator');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 font-medium transition ${activeTab === 'simulator' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Simulator & Builder
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 font-medium transition ${activeTab === 'tools' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Optimization Tools
          </button>
        </div>

        {activeTab === 'simulator' ? <DFABuilder /> : <MinimizationTool />}
      </div>
    </Layout>
  );
}

export default App;
