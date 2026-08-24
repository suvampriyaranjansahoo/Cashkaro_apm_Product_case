import React, { useState } from 'react';
import { ReadingDepth } from './types';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { HypothesesSection } from './components/HypothesesSection';
import { PrioritizationSection } from './components/PrioritizationSection';
import { ValidationGatesSection } from './components/ValidationGatesSection';
import { MindChangeSection } from './components/MindChangeSection';
import { IntentRouterShowcase } from './components/IntentRouterShowcase';
import { ProductSpecSection } from './components/ProductSpecSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { MeasurementSection } from './components/MeasurementSection';
import { ExperimentSimulator } from './components/ExperimentSimulator';
import { OperatingModelSection } from './components/OperatingModelSection';
import { FinalDecisionSection } from './components/FinalDecisionSection';
import { ArrowUp, Sparkles, BookOpen, Printer } from 'lucide-react';

export default function App() {
  const [readingDepth, setReadingDepth] = useState<ReadingDepth>('7m');
  const [activeSection, setActiveSection] = useState<string>('hero');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0B1F3A] flex flex-col selection:bg-[#316BEA]/15 selection:text-[#316BEA]">
      
      {/* Sticky Navigation Bar */}
      <Navigation
        readingDepth={readingDepth}
        setReadingDepth={setReadingDepth}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Document Content */}
      <main className="flex-1">
        <HeroSection readingDepth={readingDepth} />
        <ProblemSection readingDepth={readingDepth} />
        <HypothesesSection readingDepth={readingDepth} />
        <PrioritizationSection readingDepth={readingDepth} />
        <ValidationGatesSection readingDepth={readingDepth} />
        <MindChangeSection readingDepth={readingDepth} />
        <IntentRouterShowcase readingDepth={readingDepth} />
        <ProductSpecSection readingDepth={readingDepth} />
        <ArchitectureSection readingDepth={readingDepth} />
        <MeasurementSection readingDepth={readingDepth} />
        <ExperimentSimulator readingDepth={readingDepth} />
        <OperatingModelSection readingDepth={readingDepth} />
        <FinalDecisionSection readingDepth={readingDepth} />
      </main>

      {/* Global Minimal Footer */}
      <footer className="bg-[#0B1728] text-white py-12 border-t border-slate-800 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#316BEA] flex items-center justify-center font-display font-bold text-sm text-white">
              CK
            </div>
            <div>
              <div className="font-bold text-slate-100 font-display">
                CashKaro APM Product Case Study
              </div>
              <div className="text-slate-400 text-[11px]">
                Prepared by Suvam Priya Ranjan Sahoo • Strategic Investment Memo
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <button
              onClick={() => window.print()}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Memo</span>
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-[#316BEA] transition-colors flex items-center gap-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
