import React, { useState } from 'react';
import { ReadingDepth } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ArrowDown, 
  Info,
  HelpCircle,
  Calculator,
  Clock,
  Users,
  Target,
  ShieldCheck
} from 'lucide-react';
import { GlossaryBadge } from './GlossaryBadge';
import { SectionHeader } from './SectionHeader';

interface MeasurementSectionProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

interface MetricItem {
  id: string;
  label: string;
  value: string;
  subValue: string;
  badge: string;
  badgeType: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  icon: any;
  methodology: {
    formula: string;
    description: string;
    dataSources: string;
    statisticalStandard: string;
  };
}

const KEY_METRICS: MetricItem[] = [
  {
    id: 'north-star-lift',
    label: 'Target Incremental Lift (ΔO)',
    value: '+0.18',
    subValue: 'Tracked Orders / Eligible User',
    badge: 'North Star Target',
    badgeType: 'blue',
    icon: Target,
    methodology: {
      formula: 'ΔO = Mean(Orders_Treatment) − Mean(Orders_Control)',
      description: 'Intention-To-Treat (ITT) causal lift. All users assigned to treatment are evaluated in the denominator regardless of extension installation or prompt engagement, strictly preventing self-selection and survivorship bias.',
      dataSources: 'Affiliate network S2S postback logs matched to 1st-party user session IDs.',
      statisticalStandard: 'Two-sided α = 0.05, 95% Confidence Interval must strictly clear 0.'
    }
  },
  {
    id: 'itt-sample-size',
    label: 'Holdout Cohort Split & Size',
    value: '50/50 ITT',
    subValue: 'N = 48,000 Stratified Users',
    badge: '80% Power @ α=0.05',
    badgeType: 'purple',
    icon: Users,
    methodology: {
      formula: 'N_per_arm = 2 × (Z_α/2 + Z_β)² × σ² / MDE²',
      description: 'Stratified randomized split across historical shopping frequency (low, medium, high frequency cohorts) and primary merchant affinity to maintain identical baseline variance across treatment and holdout groups.',
      dataSources: 'User account registry & historical 90-day order frequency logs.',
      statisticalStandard: 'Powered at 80% to detect a Minimum Detectable Effect (MDE) of +0.08 orders over 6 weeks.'
    }
  },
  {
    id: 'postback-lag',
    label: 'Postback Maturation Window',
    value: '21 Days',
    subValue: 'Post-Transaction Buffer',
    badge: 'Settlement Buffer',
    badgeType: 'amber',
    icon: Clock,
    methodology: {
      formula: 'T_eval = Transaction_Timestamp + Return_Window_Max (21d)',
      description: 'Affiliate networks (Amazon Associates, Cuelinks, Impact, Optimise) require return/cancellation windows to settle before validating commissions. Metric reporting freezes until the 21-day maturity window closes to purge cancelled transactions.',
      dataSources: 'Retailer webhook callback statuses (Pending → Approved / Rejected).',
      statisticalStandard: '100% S2S reconciliation rate required before cohort metric finalization.'
    }
  },
  {
    id: 'contribution-margin',
    label: 'Net Unit Margin Contribution (C)',
    value: '₹150',
    subValue: 'Net Profit per Tracked Order',
    badge: 'Unit Economics',
    badgeType: 'emerald',
    icon: Calculator,
    methodology: {
      formula: 'C = (GMV × CommRate) − Cashback_Payout − NetworkFees − DisputeReserves',
      description: 'Derived from baseline ₹3,500 average order value (AOV) at 4.3% merchant commission (₹150.50 gross) minus 2.8% user cashback payout (₹98.00) plus partner sponsor bonuses (₹97.50 net).',
      dataSources: 'Affiliate commission remittance ledgers & user wallet payout accounts.',
      statisticalStandard: 'Validated against historical Q3-Q4 merchant payout reconciliations.'
    }
  },
  {
    id: 'break-even-lift',
    label: 'Break-Even Volume Lift (ΔO_be)',
    value: '+0.11',
    subValue: 'Orders to Clear Fixed Costs',
    badge: 'Financial Hurdle',
    badgeType: 'blue',
    icon: TrendingUp,
    methodology: {
      formula: 'ΔO_be = (K_f + K_r1) / (E × C)',
      description: 'Calculates the exact incremental lift required over 120,000 eligible users (E) to completely amortize fixed infrastructure (K_f = ₹800,000) and R&D engineering costs (K_r1 = ₹1,200,000) in Q1.',
      dataSources: 'Finance quarterly engineering budget & Cloud Run hosting infrastructure allocation.',
      statisticalStandard: 'Conservative lower bound of the 95% Confidence Interval must exceed ΔO_be.'
    }
  },
  {
    id: 'uninstall-guardrail',
    label: 'Max Churn & Mismatch Guardrail',
    value: '< 1.2%',
    subValue: '7-Day Rolling Tolerance Cap',
    badge: 'Circuit Breaker',
    badgeType: 'rose',
    icon: ShieldCheck,
    methodology: {
      formula: 'Rate_churn = Uninstalls_7d / Active_Install_Base_7d',
      description: 'Continuous telemetry guardrail monitoring unprompted extension uninstalls, opt-out toggles, and partner merchant attribution disputes. If 7-day rolling churn exceeds 1.2%, automatic rollback triggers.',
      dataSources: 'Chrome Web Store uninstall telemetry & partner affiliate discrepancy claims.',
      statisticalStandard: 'Daily rolling anomaly detection with immediate automated kill-switch.'
    }
  }
];

export const MeasurementSection: React.FC<MeasurementSectionProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <section 
      id="measurement" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="10"
          category="Causal Measurement Architecture"
          sectionId="measurement"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>Measurement: prove incrementality, not activity.</span>}
          description={
            <span>
              The primary outcome is <strong>incremental tracked orders per eligible existing user</strong>, measured via a persistent <GlossaryBadge termKey="ITT">50/50 Intention-To-Treat (ITT)</GlossaryBadge> holdout. Hover over any metric below to inspect its exact mathematical derivation and statistical methodology.
            </span>
          }
        />

        {/* Key Metrics Benchmark Grid with Interactive Hoverable Methodology Tooltips */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D190AC] dark:bg-[#0080AB] animate-pulse"></span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Key Experimental & Economic Parameters
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Info className="w-3.5 h-3.5 text-[#8F3760] dark:text-[#25C3FF]" />
              <span>Hover or tap cards for methodology</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {KEY_METRICS.map((metric) => {
              const IconComponent = metric.icon;
              const isHovered = activeTooltip === metric.id;

              return (
                <div
                  key={metric.id}
                  onMouseEnter={() => setActiveTooltip(metric.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => setActiveTooltip(activeTooltip === metric.id ? null : metric.id)}
                  tabIndex={0}
                  onFocus={() => setActiveTooltip(metric.id)}
                  onBlur={() => setActiveTooltip(null)}
                  className={`group relative card-surface p-5 rounded-2xl border transition-all cursor-pointer outline-none ${
                    isHovered
                      ? 'border-[#D190AC] dark:border-blue-500 shadow-lg ring-2 ring-[#D190AC]/20 dark:ring-blue-500/20 -translate-y-1'
                      : 'border-[#DEB6C5]/60 dark:border-slate-800 hover:border-[#D190AC]/80'
                  }`}
                  aria-describedby={`tooltip-${metric.id}`}
                >
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F0EAD5] dark:bg-slate-800 text-[#8F3760] dark:text-cyan-400 flex items-center justify-center font-bold">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      metric.badgeType === 'blue'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : metric.badgeType === 'emerald'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : metric.badgeType === 'purple'
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                        : metric.badgeType === 'rose'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}>
                      {metric.badge}
                    </span>
                  </div>

                  {/* Value and Label */}
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight flex items-baseline justify-between">
                      <span>{metric.value}</span>
                      <div className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#8F3760] dark:text-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Methodology</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {metric.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {metric.subValue}
                    </div>
                  </div>

                  {/* Interactive Methodology Tooltip Overlay */}
                  {isHovered && (
                    <div 
                      id={`tooltip-${metric.id}`}
                      role="tooltip"
                      className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 p-4 bg-slate-900/95 dark:bg-slate-950/95 text-white border border-slate-700 dark:border-cyan-500/40 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-200 animate-in fade-in zoom-in-95"
                    >
                      {/* Tooltip Header */}
                      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#DEB6C5] dark:text-[#25C3FF] font-display">
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Methodology & Derivation</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {metric.id}
                        </span>
                      </div>

                      {/* Formula */}
                      <div className="p-2 rounded-lg bg-slate-800/90 dark:bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300 dark:text-cyan-300 mb-2 font-bold break-all">
                        {metric.methodology.formula}
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                        {metric.methodology.description}
                      </p>

                      {/* Data Source & Statistical Standard */}
                      <div className="space-y-1 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                        <div>
                          <strong className="text-slate-300">Data Source:</strong> {metric.methodology.dataSources}
                        </div>
                        <div>
                          <strong className="text-slate-300">Statistical Gate:</strong> {metric.methodology.statisticalStandard}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Counterfactual Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Treatment Holdout Box */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-[#DEB6C5]/40 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D190AC] dark:bg-[#0080AB]"></span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">Treatment Group (50%)</h3>
              </div>
              <span className="text-xs font-mono bg-[#F0D6DE] dark:bg-blue-950/60 text-[#8F3760] dark:text-blue-300 px-2 py-0.5 rounded font-bold border border-[#DEB6C5] dark:border-blue-900/60">
                Intent Router Assigned
              </span>
            </div>
            
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Consented eligible users assigned to receive the extension. Users remain in this cohort whether they install, dismiss, or activate, eliminating opt-in bias.
            </p>

            <div className="p-3.5 rounded-xl bg-[#F7F6ED] dark:bg-slate-900/60 border border-[#DEB6C5]/60 dark:border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold">Observed Mean Orders:</div>
              <div className="text-sm font-bold text-[#8F3760] dark:text-blue-400">O_treatment = Mean(Tracked Orders / User)</div>
            </div>
          </div>

          {/* Control Counterfactual Box */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-[#DEB6C5]/40 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">Control Group (50%)</h3>
              </div>
              <span className="text-xs font-mono bg-[#F0EAD5] dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded font-bold border border-[#DEB6C5]/60 dark:border-slate-700">
                Normal Natural Journey
              </span>
            </div>
            
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Identical, stratified cohort experiencing the normal shopping journey without the extension. Approximates the true un-intervened counterfactual.
            </p>

            <div className="p-3.5 rounded-xl bg-[#F7F6ED] dark:bg-slate-900/60 border border-[#DEB6C5]/60 dark:border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold">Counterfactual Baseline:</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">O_control = Mean(Tracked Orders / User)</div>
            </div>
          </div>
        </div>

        {/* Incremental Formula Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#F0EAD5] via-[#F0D6DE]/70 to-[#F7F6ED] dark:from-blue-900 dark:to-slate-900 text-slate-900 dark:text-white border border-[#DEB6C5] dark:border-blue-800 shadow-sm mb-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F3760] dark:text-blue-300 font-bold block mb-1">
                Core Causal Lift Formula (ITT)
              </span>
              <div className="text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white">
                ΔO = O_treatment − O_control
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Reported with two-sided 95% Confidence Interval after <GlossaryBadge termKey="S2S Postback">postback</GlossaryBadge> maturation window.
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold block mb-1">
                Quarterly Fixed Cohort Contribution
              </span>
              <div className="text-base font-mono font-bold text-emerald-900 dark:text-emerald-300">
                ΔContribution = E × ΔO × C
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">Where C = Net commission margin less cashback & costs</span>
            </div>
          </div>
        </div>

        {/* Metric Hierarchy Scientific Instrument Panel */}
        <div className="bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-8 transition-colors">
          <div className="p-4 sm:p-5 bg-[#F0EAD5] dark:bg-slate-950 text-slate-900 dark:text-white border-b border-[#DEB6C5]/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F3760] dark:text-[#316BEA] font-semibold">
                Scientific Metric Architecture
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Metric Layers & Decision Functions</h3>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">4-Tier System</span>
          </div>

          <div className="divide-y divide-[#DEB6C5]/30 dark:divide-slate-800 text-xs">
            
            {/* Level 1: North Star */}
            <div className="p-4 sm:p-5 bg-[#F0D6DE]/30 dark:bg-blue-950/20 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-[#8F3760] dark:text-blue-400 block">1. North Star (ITT)</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Incremental Tracked Orders / Eligible User</strong>
              </div>
              <div className="md:col-span-5 text-slate-700 dark:text-slate-300">
                The causal difference between treatment and control cohorts over the test window.
              </div>
              <div className="md:col-span-4 font-mono font-semibold text-[#8F3760] dark:text-blue-400">
                Report absolute lift & 95% CI; drives scale/kill decision.
              </div>
            </div>

            {/* Level 2: Diagnostic Funnel */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">2. Diagnostic Funnel</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Eligible Visits → Prompts → Activations → Orders</strong>
              </div>
              <div className="md:col-span-5 text-slate-700 dark:text-slate-300">
                Isolates funnel bottlenecks (reach, relevance, activation, postback match).
              </div>
              <div className="md:col-span-4 text-slate-600 dark:text-slate-400 italic">
                Diagnostics only. NEVER substitute for North Star.
              </div>
            </div>

            {/* Level 3: Business Quality */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">3. Business Quality</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Net Commission Contribution & GMV</strong>
              </div>
              <div className="md:col-span-5 text-slate-700 dark:text-slate-300">
                Net affiliate commission less cashback payouts, partner rev-share, and disputes.
              </div>
              <div className="md:col-span-4 text-slate-800 dark:text-slate-300 font-medium">
                Separates true incremental revenue from subsidized channel shift.
              </div>
            </div>

            {/* Level 4: Guardrails */}
            <div className="p-4 sm:p-5 bg-rose-50/40 dark:bg-rose-950/20 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block">4. Guardrails</span>
                <strong className="text-sm text-slate-900 dark:text-white font-display">Attribution, Uninstalls & Partner Disputes</strong>
              </div>
              <div className="md:col-span-5 text-slate-700 dark:text-slate-300">
                Uninstalls, support complaints, affiliate postback mismatch, partner objections.
              </div>
              <div className="md:col-span-4 text-rose-800 dark:text-rose-300 font-bold">
                Automated halt on proposed operating target breach.
              </div>
            </div>

          </div>

          <div className="p-4 bg-[#F7F6ED] dark:bg-slate-950 text-slate-800 dark:text-slate-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[#DEB6C5]/60 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white">Production Telemetry Rule:</span>
            <span className="font-mono text-[#8F3760] dark:text-blue-400 font-semibold">Do NOT optimize on vanity extension installs, clicks, or gross assisted orders.</span>
          </div>
        </div>

      </div>
    </section>
  );
};

