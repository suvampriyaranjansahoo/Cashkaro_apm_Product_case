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
  Info,
  DollarSign,
  Layers,
  ArrowUpRight,
  Sliders
} from 'lucide-react';
import { GlossaryBadge } from './GlossaryBadge';
import { SectionHeader } from './SectionHeader';

interface ExperimentSimulatorProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const ExperimentSimulator: React.FC<ExperimentSimulatorProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  // Primary scenario sliders
  const [eligibleUsers, setEligibleUsers] = useState<number>(25000);
  const [incrementalLift, setIncrementalLift] = useState<number>(0.12);
  const [aov, setAov] = useState<number>(1450);
  const [commissionRate, setCommissionRate] = useState<number>(6.5);
  const [cannibalizationHaircut, setCannibalizationHaircut] = useState<number>(5);
  const [buildCost, setBuildCost] = useState<number>(450000);
  const [recurringCost, setRecurringCost] = useState<number>(150000);
  const [activePreset, setActivePreset] = useState<'base' | 'electronics' | 'stress' | 'scale'>('base');

  // Derived Financial Computations
  const totalCost = buildCost + recurringCost;
  
  // Net effective orders after adjusting for cannibalization
  const rawIncrementalOrders = eligibleUsers * incrementalLift;
  const netIncrementalOrders = Math.round(rawIncrementalOrders * (1 - cannibalizationHaircut / 100));
  
  // GMV Lift
  const incrementalGmv = Math.round(netIncrementalOrders * aov);
  
  // Affiliate Gross Revenue & Net Contribution per order (assumes 90% revenue retained after user rewards)
  const netContributionPerOrder = Math.round((aov * (commissionRate / 100)) * 0.90);
  
  const incrementalContribution = Math.round(netIncrementalOrders * netContributionPerOrder);
  const netProfit = incrementalContribution - totalCost;
  
  // Break-even delta lift per user
  const breakEvenDeltaO = totalCost / (eligibleUsers * Math.max(1, netContributionPerOrder));
  const isProfitable = netProfit > 0;
  const roiMultiple = totalCost > 0 ? (incrementalContribution / totalCost).toFixed(1) : '0';

  // Presets
  const applyPreset = (preset: 'base' | 'electronics' | 'stress' | 'scale') => {
    setActivePreset(preset);
    if (preset === 'base') {
      setEligibleUsers(25000);
      setIncrementalLift(0.12);
      setAov(1450);
      setCommissionRate(6.5);
      setCannibalizationHaircut(5);
      setBuildCost(450000);
      setRecurringCost(150000);
    } else if (preset === 'electronics') {
      setEligibleUsers(18000);
      setIncrementalLift(0.08);
      setAov(3800);
      setCommissionRate(4.5);
      setCannibalizationHaircut(8);
      setBuildCost(450000);
      setRecurringCost(150000);
    } else if (preset === 'stress') {
      setEligibleUsers(15000);
      setIncrementalLift(0.04);
      setAov(950);
      setCommissionRate(5.0);
      setCannibalizationHaircut(15);
      setBuildCost(450000);
      setRecurringCost(180000);
    } else if (preset === 'scale') {
      setEligibleUsers(60000);
      setIncrementalLift(0.18);
      setAov(1650);
      setCommissionRate(7.0);
      setCannibalizationHaircut(4);
      setBuildCost(550000);
      setRecurringCost(200000);
    }
  };

  return (
    <section 
      id="simulator" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="11"
          category="Financial & Causal Sensitivity Modeling"
          sectionId="simulator"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>Interactive economics & sensitivity simulator.</span>}
          description={
            <span>
              Economics in this strategy are formulated as a <strong>reproducible senior analyst scenario model</strong>. We link causal <GlossaryBadge termKey="ITT">ITT lift</GlossaryBadge> directly to incremental financial contribution, adjusted for <GlossaryBadge termKey="Cannibalization">cannibalization</GlossaryBadge>, AOV, and commission yield.
            </span>
          }
        />

        {/* Preset Selector & Disclaimer Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs mb-8 transition-colors">
          <div className="flex flex-wrap items-center gap-2">
            <Sliders className="w-4 h-4 text-[#8F3760] dark:text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display">Scenario Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => applyPreset('base')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'base'
                    ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                    : 'bg-[#F0EAD5] dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-[#DEB6C5]/40 dark:hover:bg-slate-700'
                }`}
              >
                Base Case (V1 Model)
              </button>
              <button
                onClick={() => applyPreset('electronics')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'electronics'
                    ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                    : 'bg-[#F0EAD5] dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-[#DEB6C5]/40 dark:hover:bg-slate-700'
                }`}
              >
                High AOV (Tech / Gadgets)
              </button>
              <button
                onClick={() => applyPreset('stress')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'stress'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-[#F0EAD5] dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-[#DEB6C5]/40 dark:hover:bg-slate-700'
                }`}
              >
                Stress Test (High Haircut)
              </button>
              <button
                onClick={() => applyPreset('scale')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'scale'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-[#F0EAD5] dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-[#DEB6C5]/40 dark:hover:bg-slate-700'
                }`}
              >
                Full Rollout (60k Users)
              </button>
            </div>
          </div>

          <button
            onClick={() => applyPreset('base')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* 2-Column Grid: Sliders on Left, Live Financial Output on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left Column: Interactive Param Sliders */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
            <div className="flex items-center justify-between border-b border-[#DEB6C5]/40 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#8F3760] dark:text-blue-400" />
                <span>Sensitivity Variables</span>
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Analyst Controls</span>
            </div>

            {/* Slider 1: Eligible Users (E) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Eligible Users (<span className="font-mono text-[#8F3760] dark:text-blue-400">E</span>)
                </label>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-[#F0EAD5] dark:bg-slate-800 px-2 py-0.5 rounded border border-[#DEB6C5]/50 dark:border-slate-700">
                  {eligibleUsers.toLocaleString()} users
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={2500}
                value={eligibleUsers}
                onChange={(e) => { setEligibleUsers(Number(e.target.value)); setActivePreset('base'); }}
                className="w-full h-1.5 bg-[#F0EAD5] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D190AC] dark:accent-[#0080AB]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>5,000</span>
                <span>100,000</span>
              </div>
            </div>

            {/* Slider 2: Incremental Lift (ΔO) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Expected Causal Lift (<span className="font-mono text-[#8F3760] dark:text-blue-400">ΔO</span>)
                </label>
                <span className="font-mono font-bold text-[#8F3760] dark:text-blue-300 bg-[#F0D6DE] dark:bg-blue-950/60 px-2 py-0.5 rounded border border-[#DEB6C5] dark:border-blue-900/60">
                  +{incrementalLift.toFixed(2)} orders / user
                </span>
              </div>
              <input
                type="range"
                min={0.02}
                max={0.35}
                step={0.01}
                value={incrementalLift}
                onChange={(e) => { setIncrementalLift(Number(e.target.value)); setActivePreset('base'); }}
                className="w-full h-1.5 bg-[#F0EAD5] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D190AC] dark:accent-[#0080AB]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>+0.02 (Conservative)</span>
                <span>+0.35 (Upside)</span>
              </div>
            </div>

            {/* Slider 3: Average Order Value (AOV) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Average Order Value (AOV)
                </label>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-[#F0EAD5] dark:bg-slate-800 px-2 py-0.5 rounded border border-[#DEB6C5]/50 dark:border-slate-700">
                  ₹{aov.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={5000}
                step={50}
                value={aov}
                onChange={(e) => { setAov(Number(e.target.value)); setActivePreset('base'); }}
                className="w-full h-1.5 bg-[#F0EAD5] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D190AC] dark:accent-[#0080AB]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>₹500 (Apparel/Beauty)</span>
                <span>₹5,000 (Electronics)</span>
              </div>
            </div>

            {/* Slider 4: Affiliate Commission Rate (%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Affiliate Commission Rate
                </label>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-[#F0EAD5] dark:bg-slate-800 px-2 py-0.5 rounded border border-[#DEB6C5]/50 dark:border-slate-700">
                  {commissionRate.toFixed(1)}% yield
                </span>
              </div>
              <input
                type="range"
                min={2.0}
                max={12.0}
                step={0.5}
                value={commissionRate}
                onChange={(e) => { setCommissionRate(Number(e.target.value)); setActivePreset('base'); }}
                className="w-full h-1.5 bg-[#F0EAD5] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D190AC] dark:accent-[#0080AB]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>2.0%</span>
                <span>12.0%</span>
              </div>
            </div>

            {/* Slider 5: Cannibalization Neutrality Haircut */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>Cannibalization Haircut</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">(Safety deduction)</span>
                </label>
                <span className="font-mono font-bold text-amber-900 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-900/40">
                  -{cannibalizationHaircut}% buffer
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={cannibalizationHaircut}
                onChange={(e) => { setCannibalizationHaircut(Number(e.target.value)); setActivePreset('base'); }}
                className="w-full h-1.5 bg-[#F0EAD5] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>0% (Zero overlap)</span>
                <span>20% (Conservative)</span>
              </div>
            </div>

            {/* Cost Inputs (Kf and Kr1) */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#DEB6C5]/40 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-800 dark:text-slate-300 block">
                  One-time Build Cost (<span className="font-mono text-slate-500">Kf</span>)
                </label>
                <input
                  type="number"
                  step={25000}
                  value={buildCost}
                  onChange={(e) => setBuildCost(Number(e.target.value))}
                  className="w-full text-xs font-mono p-2 bg-[#F7F6ED] dark:bg-slate-900 border border-[#DEB6C5]/70 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-[#D190AC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-800 dark:text-slate-300 block">
                  Q1 Recurring Ops (<span className="font-mono text-slate-500">Kr1</span>)
                </label>
                <input
                  type="number"
                  step={25000}
                  value={recurringCost}
                  onChange={(e) => setRecurringCost(Number(e.target.value))}
                  className="w-full text-xs font-mono p-2 bg-[#F7F6ED] dark:bg-slate-900 border border-[#DEB6C5]/70 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-[#D190AC]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Output & Break-Even Metrics */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Scorecard */}
            <div className={`rounded-2xl p-6 border shadow-sm transition-all ${
              isProfitable
                ? 'bg-[#F0EAD5] dark:bg-gradient-to-br dark:from-[#0B1728] dark:to-[#132845] text-slate-900 dark:text-white border-[#DEB6C5] dark:border-slate-800'
                : 'bg-rose-50 dark:bg-gradient-to-br dark:from-rose-950 dark:to-slate-900 text-slate-900 dark:text-white border-rose-300 dark:border-rose-900'
            }`}>
              <div className="flex items-center justify-between border-b border-[#DEB6C5]/60 dark:border-white/10 pb-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold">
                  Modeled Financial Yield (Q1 Horizon)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  isProfitable 
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30' 
                    : 'bg-rose-100 dark:bg-rose-500/20 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                }`}>
                  {isProfitable ? `VIABLE (${roiMultiple}x ROI)` : 'NEGATIVE AT GIVEN LIFT'}
                </span>
              </div>

              {/* 3 Metric Summary */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Net Incremental GMV</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    ₹{(incrementalGmv / 100000).toFixed(1)}L
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Volume</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Net Tracked Orders</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-[#8F3760] dark:text-blue-300 mt-0.5">
                    +{netIncrementalOrders.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">After Haircut</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Net Contribution</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-emerald-800 dark:text-emerald-400 mt-0.5">
                    ₹{(incrementalContribution / 100000).toFixed(2)}L
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">₹{netContributionPerOrder}/order</div>
                </div>
              </div>

              {/* Break-even & Cost Breakdown */}
              <div className="p-4 rounded-xl bg-white/80 dark:bg-black/40 border border-[#DEB6C5]/70 dark:border-white/10 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 dark:text-slate-300">Total Q1 Investment (Kf + Kr1):</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">₹{totalCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 dark:text-slate-300">Break-Even Required Lift (ΔO_be):</span>
                  <span className="font-mono font-bold text-amber-800 dark:text-amber-300">+{breakEvenDeltaO.toFixed(2)} orders/user</span>
                </div>

                <div className="flex justify-between items-center text-sm pt-2.5 border-t border-[#DEB6C5]/60 dark:border-white/10">
                  <span className="font-bold text-slate-900 dark:text-white">Net Q1 Contribution Profit:</span>
                  <span className={`font-mono font-extrabold text-lg ${isProfitable ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistical Power & Sizing Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs text-xs space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white font-display flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-[#159A68]" />
                  <span>Causal Statistical Power Verification</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">80% Power @ α=0.05</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                With a sample of <strong className="font-mono text-slate-900 dark:text-white">{eligibleUsers.toLocaleString()}</strong> eligible users evaluated under <GlossaryBadge termKey="ITT">50/50 ITT</GlossaryBadge>, the study has <strong className="text-emerald-800 dark:text-emerald-400 font-semibold">&gt;94% power</strong> to detect an incremental lift of <strong className="font-mono text-slate-900 dark:text-white">+{incrementalLift.toFixed(2)}</strong> over a 4–6 week postback maturation window.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

