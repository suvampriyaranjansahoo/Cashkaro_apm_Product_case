import React, { useState } from 'react';
import { VALIDATION_GATES } from '../data/caseData';
import { ReadingDepth } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Sliders, 
  GitBranch, 
  ShieldCheck, 
  Layers,
  HelpCircle,
  Play
} from 'lucide-react';

interface ValidationGatesSectionProps {
  readingDepth: ReadingDepth;
}

export const ValidationGatesSection: React.FC<ValidationGatesSectionProps> = ({ readingDepth }) => {
  const [activeGate, setActiveGate] = useState<string>('g1');
  const [simulatedG1, setSimulatedG1] = useState<'pass' | 'gray' | 'fail'>('pass');
  const [simulatedG2, setSimulatedG2] = useState<'pass' | 'fail'>('pass');
  const [simulatedG3, setSimulatedG3] = useState<'pass' | 'fail'>('pass');
  const [simulatedG4, setSimulatedG4] = useState<'pass' | 'fail'>('pass');

  const selectedGate = VALIDATION_GATES.find((g) => g.id === activeGate) || VALIDATION_GATES[0];

  // Calculate simulated workflow resolution
  const getSimulatedResolution = () => {
    if (simulatedG1 === 'fail') {
      return {
        stage: 'Halted at G1 Discovery',
        action: 'DO NOT BUILD ROUTER. Reframe core research to Trust Recovery or Discovery/Habit.',
        status: 'fail',
      };
    }
    if (simulatedG1 === 'gray') {
      return {
        stage: 'Conditional at G1',
        action: 'Conduct 3–5 additional blinded purchase reconstructions or tighten segment rules before committing engineering.',
        status: 'gray',
      };
    }
    if (simulatedG2 === 'fail') {
      return {
        stage: 'Halted at G2 Addressability',
        action: 'Desktop Chrome volume insufficient for statistical power. Pivot to owned web surface or test mobile share-sheet recovery.',
        status: 'fail',
      };
    }
    if (simulatedG3 === 'fail') {
      return {
        stage: 'Halted at G3 Instrumentability',
        action: 'Attribution conflict with partner network. Enforce fail-closed rules and re-negotiate integration terms.',
        status: 'fail',
      };
    }
    if (simulatedG4 === 'fail') {
      return {
        stage: 'Post-Experiment Decision (G4)',
        action: 'ZERO incremental lift observed in ITT holdout. Run 1 pre-specified remediable iteration if diagnostics isolate cause; otherwise KILL the router.',
        status: 'fail',
      };
    }
    return {
      stage: 'Validated for Scaled Rollout (G4 PASS)',
      action: 'Causal order lift verified with 95% confidence + conservative contribution clears Kf + Kr1. Replicate on partner allowlist.',
      status: 'pass',
    };
  };

  const simResult = getSimulatedResolution();

  return (
    <section id="validation" className="py-12 sm:py-16 border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>05</span>
            <span>/</span>
            <span>Validation Gates</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            Validation before engineering.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Each gate has a real organizational cost. The purpose of this framework is to <strong>stop spending partner, engineering, and research capacity</strong> on a mechanism before preceding behavioral uncertainties are systematically reduced.
          </p>
        </div>

        {/* Validation Gameboard: Interactive 4-Gate Track */}
        <div className="bg-white border border-[#DCE4EE] rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Sequential Gating Pipeline</span>
              <h3 className="text-base font-bold text-slate-900">Click any gate to inspect methodology and exit conditions</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#159A68]"></span>
              <span className="text-slate-600">G1 → G2 → G3 → G4</span>
            </div>
          </div>

          {/* 4 Node Interactive Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {VALIDATION_GATES.map((gate, index) => {
              const isSelected = activeGate === gate.id;
              return (
                <button
                  key={gate.id}
                  onClick={() => setActiveGate(gate.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#316BEA] shadow-md ring-2 ring-[#316BEA]/20'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isSelected ? 'bg-[#316BEA] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {gate.gate}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      Step {index + 1}/4
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{gate.title}</h4>
                  <div className="mt-2 text-[11px] font-mono text-[#316BEA] font-semibold truncate">
                    {gate.metricTarget}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Gate Deep Dive Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-slate-900 text-white border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#316BEA] text-white">
                  {selectedGate.gate} Protocol
                </span>
                <h4 className="text-base font-bold text-white font-display">{selectedGate.title}</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">Exit Criteria & Fallback Plan</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Research Method:</div>
                <p className="text-slate-200 leading-relaxed">{selectedGate.method}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Directional Pass Condition:</span>
                </div>
                <p className="text-emerald-100 leading-relaxed font-medium">{selectedGate.passCondition}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-rose-950/50 border border-rose-800/60 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-rose-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>If Gate Fails (Exit Action):</span>
                </div>
                <p className="text-rose-100 leading-relaxed">{selectedGate.ifFails}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Validation Decision Tree Simulator */}
        <div className="bg-white border border-[#DCE4EE] rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#316BEA]" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Interactive Validation Decision Tree Simulator
              </h3>
            </div>
            <span className="text-xs text-slate-500">Test different gate outcomes to view organizational decisions</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              
              {/* G1 Toggle */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-mono font-bold text-[10px] text-slate-500 block">G1 Discovery</span>
                <select
                  value={simulatedG1}
                  onChange={(e) => setSimulatedG1(e.target.value as any)}
                  className="w-full text-xs font-semibold p-1.5 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#316BEA]"
                >
                  <option value="pass">PASS (≥60%)</option>
                  <option value="gray">GRAY (50–59%)</option>
                  <option value="fail">FAIL (&lt;50%)</option>
                </select>
              </div>

              {/* G2 Toggle */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-mono font-bold text-[10px] text-slate-500 block">G2 Addressability</span>
                <select
                  value={simulatedG2}
                  onChange={(e) => setSimulatedG2(e.target.value as any)}
                  className="w-full text-xs font-semibold p-1.5 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#316BEA]"
                >
                  <option value="pass">PASS (Powered)</option>
                  <option value="fail">FAIL (Low reach)</option>
                </select>
              </div>

              {/* G3 Toggle */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-mono font-bold text-[10px] text-slate-500 block">G3 Spikes</span>
                <select
                  value={simulatedG3}
                  onChange={(e) => setSimulatedG3(e.target.value as any)}
                  className="w-full text-xs font-semibold p-1.5 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#316BEA]"
                >
                  <option value="pass">PASS (Joined)</option>
                  <option value="fail">FAIL (Conflict)</option>
                </select>
              </div>

              {/* G4 Toggle */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-mono font-bold text-[10px] text-slate-500 block">G4 ITT Lift</span>
                <select
                  value={simulatedG4}
                  onChange={(e) => setSimulatedG4(e.target.value as any)}
                  className="w-full text-xs font-semibold p-1.5 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#316BEA]"
                >
                  <option value="pass">PASS (+ Lift)</option>
                  <option value="fail">FAIL (No lift)</option>
                </select>
              </div>

            </div>

            {/* Resolution Display Card */}
            <div className={`lg:col-span-6 p-4 rounded-xl border text-xs sm:text-sm ${
              simResult.status === 'pass'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : simResult.status === 'gray'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  Resulting Decision:
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  simResult.status === 'pass'
                    ? 'bg-emerald-200 text-emerald-900'
                    : simResult.status === 'gray'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-rose-200 text-rose-900'
                }`}>
                  {simResult.stage}
                </span>
              </div>
              <p className="font-semibold leading-relaxed">
                {simResult.action}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
