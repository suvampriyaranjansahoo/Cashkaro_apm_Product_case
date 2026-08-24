import React, { useState } from 'react';
import { ReadingDepth } from '../types';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ExperimentSimulatorProps {
  readingDepth: ReadingDepth;
}

export const ExperimentSimulator: React.FC<ExperimentSimulatorProps> = ({ readingDepth }) => {
  // Slider states
  const [eligibleUsers, setEligibleUsers] = useState<number>(25000);
  const [incrementalLift, setIncrementalLift] = useState<number>(0.12);
  const [netContribution, setNetContribution] = useState<number>(85);
  const [buildCost, setBuildCost] = useState<number>(450000);
  const [recurringCost, setRecurringCost] = useState<number>(150000);

  // Computations
  const totalCost = buildCost + recurringCost;
  const grossIncrementalOrders = Math.round(eligibleUsers * incrementalLift);
  const incrementalContribution = Math.round(eligibleUsers * incrementalLift * netContribution);
  const netProfit = incrementalContribution - totalCost;
  const breakEvenDeltaO = (totalCost / (eligibleUsers * netContribution));
  const isProfitable = netProfit > 0;

  // Sensitivity scenarios
  const conservativeOrders = Math.round(eligibleUsers * 0.05);
  const conservativeContrib = Math.round(eligibleUsers * 0.05 * (netContribution * 0.75));
  const conservativeNet = conservativeContrib - totalCost;

  const upsideOrders = Math.round(eligibleUsers * 0.22);
  const upsideContrib = Math.round(eligibleUsers * 0.22 * (netContribution * 1.25));
  const upsideNet = upsideContrib - totalCost;

  const resetDefaults = () => {
    setEligibleUsers(25000);
    setIncrementalLift(0.12);
    setNetContribution(85);
    setBuildCost(450000);
    setRecurringCost(150000);
  };

  return (
    <section id="simulator" className="py-12 sm:py-16 border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>11</span>
            <span>/</span>
            <span>Financial & Causal Modeling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            Interactive economics & experiment simulator.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Economics in this strategy are formulated as a <strong>reproducible scenario model</strong>. We link causal ITT lift directly to incremental financial contribution and calculate the required break-even lift.
          </p>
        </div>

        {/* Disclaimer Badge */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Methodology Notice:</strong> Illustrative scenario model only — not CashKaro proprietary performance or financial data.
            </span>
          </div>
          <button
            onClick={resetDefaults}
            className="text-xs font-semibold text-amber-900 hover:underline flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        {/* 2-Column Grid: Sliders on Left, Live Financial Output on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left Column: Interactive Param Sliders */}
          <div className="lg:col-span-6 bg-white border border-[#DCE4EE] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 font-display flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#316BEA]" />
                <span>Simulation Parameters</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Dynamic Inputs</span>
            </div>

            {/* Slider 1: Eligible Users (E) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800">
                  Eligible Users (<span className="font-mono text-[#316BEA]">E</span>)
                </label>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {eligibleUsers.toLocaleString()} users
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={2500}
                value={eligibleUsers}
                onChange={(e) => setEligibleUsers(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#316BEA]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5,000</span>
                <span>100,000</span>
              </div>
            </div>

            {/* Slider 2: Incremental Lift (ΔO) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800">
                  Expected Incremental Lift (<span className="font-mono text-[#316BEA]">ΔO</span>)
                </label>
                <span className="font-mono font-bold text-[#316BEA] bg-blue-50 px-2 py-0.5 rounded">
                  +{incrementalLift.toFixed(2)} orders/user
                </span>
              </div>
              <input
                type="range"
                min={0.02}
                max={0.35}
                step={0.01}
                value={incrementalLift}
                onChange={(e) => setIncrementalLift(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#316BEA]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>+0.02 (Conservative)</span>
                <span>+0.35 (High)</span>
              </div>
            </div>

            {/* Slider 3: Net Contribution (C) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800">
                  Net Contribution / Order (<span className="font-mono text-[#316BEA]">C</span>)
                </label>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  ₹{netContribution} / order
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                step={5}
                value={netContribution}
                onChange={(e) => setNetContribution(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#316BEA]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹20 (Low margin)</span>
                <span>₹200 (High margin)</span>
              </div>
            </div>

            {/* Cost Sliders (Kf and Kr1) */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Build Cost (<span className="font-mono text-slate-500">Kf</span>)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={buildCost}
                  onChange={(e) => setBuildCost(Number(e.target.value))}
                  className="w-full text-xs font-mono p-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Q1 Ops Cost (<span className="font-mono text-slate-500">Kr1</span>)
                </label>
                <input
                  type="number"
                  step={25000}
                  value={recurringCost}
                  onChange={(e) => setRecurringCost(Number(e.target.value))}
                  className="w-full text-xs font-mono p-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Output & Break-Even Metrics */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Scorecard */}
            <div className={`rounded-2xl p-6 border shadow-md transition-all ${
              isProfitable
                ? 'bg-gradient-to-br from-[#0B1728] to-[#132845] text-white border-slate-800'
                : 'bg-gradient-to-br from-rose-950 to-slate-900 text-white border-rose-900'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Q1 Investment Model Output
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  isProfitable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {isProfitable ? 'ECONOMICALLY VIABLE' : 'UNVIABLE AT GIVEN LIFT'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-[11px] text-slate-400">Total Incremental Orders</div>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    +{grossIncrementalOrders.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">Incremental Gross Contribution</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                    ₹{incrementalContribution.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Total Q1 Cost (Kf + Kr1):</span>
                  <span className="font-mono font-semibold text-slate-300">₹{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                  <span className="font-bold text-white">Net Q1 Contribution Profit:</span>
                  <span className={`font-mono font-extrabold text-base ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Required Break-Even Lift (ΔO_be):</span>
                <span className="font-bold text-amber-300">
                  +{breakEvenDeltaO.toFixed(3)} orders/user
                </span>
              </div>
            </div>

            {/* Formula Reference Card */}
            <div className="bg-white border border-[#DCE4EE] rounded-xl p-4 text-xs space-y-2">
              <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                Mathematical Proof:
              </div>
              <div className="font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">
                Break-Even ΔO = (Kf + Kr1) ÷ (E × C)
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Scale only if conservative post-experiment ITT lift clearly exceeds <strong className="text-slate-900">ΔO_be</strong> with 95% confidence.
              </p>
            </div>

          </div>
        </div>

        {/* 3-Column Sensitivity Analysis Scenario Grid */}
        <div className="bg-white border border-[#DCE4EE] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Sensitivity Analysis Grid (Conservative vs Base vs Upside)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Fixed Cost: ₹{totalCost.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-xs">
            
            {/* Conservative */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                  Conservative Scenario
                </span>
                <span className="font-mono text-slate-500">ΔO = +0.05</span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Incremental Orders: <strong className="text-slate-800 font-mono">+{conservativeOrders.toLocaleString()}</strong></div>
                <div className="text-slate-500">Gross Contribution: <strong className="text-slate-800 font-mono">₹{conservativeContrib.toLocaleString()}</strong></div>
                <div className="text-slate-500 pt-1 border-t border-slate-100">
                  Net Outcome: <strong className={`font-mono ${conservativeNet >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {conservativeNet >= 0 ? '+' : ''}₹{conservativeNet.toLocaleString()}
                  </strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Tests downside resilience during seasonal lulls or lower take rates.</p>
            </div>

            {/* Base (Selected Sliders) */}
            <div className="p-5 space-y-3 bg-blue-50/40">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                  Base Scenario (Current)
                </span>
                <span className="font-mono text-[#316BEA]">ΔO = +{incrementalLift.toFixed(2)}</span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Incremental Orders: <strong className="text-slate-800 font-mono">+{grossIncrementalOrders.toLocaleString()}</strong></div>
                <div className="text-slate-500">Gross Contribution: <strong className="text-slate-800 font-mono">₹{incrementalContribution.toLocaleString()}</strong></div>
                <div className="text-slate-500 pt-1 border-t border-blue-200/50">
                  Net Outcome: <strong className={`font-mono ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
                  </strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Expected operating target across initial 3–5 allowlisted partner retailers.</p>
            </div>

            {/* Upside */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                  Upside Scenario
                </span>
                <span className="font-mono text-emerald-700">ΔO = +0.22</span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Incremental Orders: <strong className="text-slate-800 font-mono">+{upsideOrders.toLocaleString()}</strong></div>
                <div className="text-slate-500">Gross Contribution: <strong className="text-slate-800 font-mono">₹{upsideContrib.toLocaleString()}</strong></div>
                <div className="text-slate-500 pt-1 border-t border-slate-100">
                  Net Outcome: <strong className="font-mono text-emerald-700">
                    +₹{upsideNet.toLocaleString()}
                  </strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">High engagement scenario during festive peak periods (e.g. BBD / GIF).</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
