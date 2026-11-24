import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center">
          <span className="text-xl font-bold tracking-tight">DFA Simulator</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <a href="#simulator" className="hover:text-blue-600 transition">Simulator</a>
          <a href="#tools" className="hover:text-blue-600 transition">Tools</a>
          <a href="#learning" className="hover:text-blue-600 transition">Learning</a>
        </div>
      </nav>
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
}
