import React, { useState } from 'react';
import { ReadingDepth } from '../types';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight,
  EyeOff,
  ShoppingBag
} from 'lucide-react';

interface IntentRouterShowcaseProps {
  readingDepth: ReadingDepth;
}

export const IntentRouterShowcase: React.FC<IntentRouterShowcaseProps> = ({ readingDepth }) => {
  const [activeUiState, setActiveUiState] = useState<'eligible' | 'referral-blocked' | 'checkout-suppressed'>('eligible');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  return (
    <section id="intent-router" className="py-12 sm:py-16 border-b border-[#DCE4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#316BEA] tracking-wider mb-2">
            <span>07</span>
            <span>/</span>
            <span>Product Solution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0B1F3A] tracking-tight">
            Product decision: CashKaro Intent Router.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Conditional on G1–G3 validation, V1 is a desktop-first Chrome extension for consented existing users in the validated segment. It appears only on an allowlist of 3–5 partner retailers. Its promise is deliberately narrow: <strong>activate the known cashback path without forcing a journey restart</strong>.
          </p>
        </div>

        {/* JTBD Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-[#C6DCFD] mb-8 text-xs sm:text-sm text-slate-800">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#316BEA] block mb-1">
            Job To Be Done (JTBD)
          </span>
          <p className="font-medium text-slate-900 leading-snug">
            "When I have started shopping on an eligible partner retailer and can earn cashback, help me activate a reliable CashKaro-tracked journey with minimal friction, so I do not have to choose between preserving my cart progress and earning rewards."
          </p>
        </div>

        {/* UI Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Left: Realistic Desktop Browser Window Mockup */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            
            {/* Chrome Browser Toolbar Mock */}
            <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>

              {/* URL Bar */}
              <div className="bg-slate-900/90 text-slate-300 text-[11px] font-mono px-4 py-1 rounded-md max-w-md w-full mx-4 flex items-center justify-between border border-slate-700/60">
                <div className="flex items-center gap-1.5 truncate">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-semibold">https://</span>
                  <span>www.partner-retailer.com/product/sony-wh1000xm5</span>
                  {activeUiState === 'referral-blocked' && (
                    <span className="text-amber-400">?ref=youtube_creator_tag</span>
                  )}
                  {activeUiState === 'checkout-suppressed' && (
                    <span className="text-slate-400">/checkout/payment</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">Desktop</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#316BEA] text-white flex items-center justify-center font-bold text-[10px]">
                  CK
                </div>
              </div>
            </div>

            {/* Browser Body with In-Page Content & Overlaid Extension Prompt */}
            <div className="bg-slate-100 p-6 relative min-h-[380px] flex flex-col justify-between">
              
              {/* Simulated Retailer Webpage Content */}
              <div className="opacity-40 pointer-events-none select-none space-y-4">
                <div className="h-6 w-36 bg-slate-300 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-slate-300 rounded-lg col-span-1"></div>
                  <div className="col-span-2 space-y-2">
                    <div className="h-5 w-4/5 bg-slate-300 rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                    <div className="h-8 w-28 bg-slate-400 rounded-lg mt-4"></div>
                  </div>
                </div>
              </div>

              {/* State 1: Active Extension Prompt */}
              {activeUiState === 'eligible' && (
                <div className="absolute top-6 right-6 w-72 bg-white rounded-xl shadow-2xl border-2 border-[#316BEA] p-4 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-200 z-10">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-[#316BEA] text-white flex items-center justify-center font-bold text-[9px]">
                        CK
                      </div>
                      <span className="font-display font-extrabold text-sm tracking-tight text-[#0B1F3A]">cashkaro</span>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-50 text-[#159A68] px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                      ELIGIBLE
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="text-[11px] font-medium text-slate-500">Cashback available at</div>
                    <div className="text-base font-bold text-slate-900 font-display">Partner Retailer</div>
                    <div className="text-xl font-extrabold text-[#316BEA] font-display">Up to 8.5% cashback</div>
                  </div>

                  {!isActivated ? (
                    <button
                      onClick={() => setIsActivated(true)}
                      className="w-full py-2 px-3 rounded-lg bg-[#316BEA] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>ACTIVATE CASHBACK</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Tracking Activated (Click ID Generated)</span>
                    </div>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Tracking expected after activation
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="hover:underline cursor-pointer">View terms</span>
                    <span className="hover:underline cursor-pointer" onClick={() => setIsActivated(false)}>Reset preview</span>
                  </div>
                </div>
              )}

              {/* State 2: Attribution Safety / Existing Referral Detected */}
              {activeUiState === 'referral-blocked' && (
                <div className="absolute top-6 right-6 w-80 bg-slate-900 text-white rounded-xl shadow-2xl border border-amber-500/50 p-4 text-xs animate-in fade-in duration-200 z-10">
                  <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="font-mono text-[11px] uppercase tracking-wider">Attribution Precedence Locked</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Existing affiliate / creator referral detected in URL parameters (<code className="text-amber-300 font-mono text-[10px]">ref=youtube_creator_tag</code>).
                  </p>
                  <div className="mt-3 p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                    <div className="font-semibold text-white">System Action: Prompt Suppressed</div>
                    <div>Preserving prior attribution integrity. CashKaro will never overwrite a legitimate partner link.</div>
                  </div>
                </div>
              )}

              {/* State 3: Checkout / Sensitive Page Suppressed */}
              {activeUiState === 'checkout-suppressed' && (
                <div className="absolute top-6 right-6 w-80 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-4 text-xs animate-in fade-in duration-200 z-10">
                  <div className="flex items-center gap-2 text-slate-400 font-bold mb-2">
                    <EyeOff className="w-4 h-4 shrink-0" />
                    <span className="font-mono text-[11px] uppercase tracking-wider">Sensitive Surface Suppression</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    User is on a payment or checkout screen (<code className="text-slate-300 font-mono text-[10px]">/checkout/payment</code>).
                  </p>
                  <div className="mt-3 p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                    <div className="font-semibold text-white">AC3 Policy Enforced</div>
                    <div>Zero intrusion during payment flows to protect merchant conversion and user focus.</div>
                  </div>
                </div>
              )}

              {/* Bottom State Bar */}
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Active UI State Simulator:</span>
                <span className="font-mono text-[11px] font-semibold text-[#316BEA]">
                  {activeUiState === 'eligible' && 'State A: Eligible Retailer Intent'}
                  {activeUiState === 'referral-blocked' && 'State B: Referral Overwrite Guard'}
                  {activeUiState === 'checkout-suppressed' && 'State C: Checkout Suppression'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: State Switcher & 4 Design Principles */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Interactive State Toggle Buttons */}
            <div className="p-4 rounded-xl bg-white border border-[#DCE4EE] shadow-xs space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Interactive State Toggle:
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  onClick={() => { setActiveUiState('eligible'); setIsActivated(false); }}
                  className={`p-2.5 rounded-lg text-left font-semibold transition-all flex items-center justify-between ${
                    activeUiState === 'eligible'
                      ? 'bg-[#316BEA] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>1. Eligible Intent (Prompt Shown)</span>
                  <span className="font-mono text-[10px]">Active</span>
                </button>
                <button
                  onClick={() => { setActiveUiState('referral-blocked'); setIsActivated(false); }}
                  className={`p-2.5 rounded-lg text-left font-semibold transition-all flex items-center justify-between ${
                    activeUiState === 'referral-blocked'
                      ? 'bg-[#0B1728] text-white shadow-sm border border-amber-500/40'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>2. Existing Referral (Suppressed)</span>
                  <span className="font-mono text-[10px]">Guardrail</span>
                </button>
                <button
                  onClick={() => { setActiveUiState('checkout-suppressed'); setIsActivated(false); }}
                  className={`p-2.5 rounded-lg text-left font-semibold transition-all flex items-center justify-between ${
                    activeUiState === 'checkout-suppressed'
                      ? 'bg-[#0B1728] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>3. Checkout / Sensitive (Suppressed)</span>
                  <span className="font-mono text-[10px]">AC3 Rule</span>
                </button>
              </div>
            </div>

            {/* 4 Core Design Principles */}
            <div className="bg-white border border-[#DCE4EE] rounded-xl p-4 sm:p-5 shadow-xs space-y-3 text-xs">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                4 Core UX & Attribution Principles
              </span>
              
              <div className="space-y-2 text-slate-700">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block">1. One Clear Value Statement:</strong>
                  Rate and terms are dynamically synced from server-side affiliate config.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block">2. Explicit Action Only:</strong>
                  Zero auto-activation. Requires user click; never interrupts checkout flow.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block">3. Existing Referral Wins:</strong>
                  Prior creator/partner affiliate tokens are respected and never overwritten.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block">4. "Tracking Expected":</strong>
                  Communicates system state without falsely guaranteeing payout before postback.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Deliberately Gated V1.5 Mobile Recovery Callout */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-300 text-xs sm:text-sm text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Smartphone className="w-4 h-4 text-[#316BEA]" />
              <h4 className="font-display font-bold">V1.5 Mobile Recovery — Deliberately Gated & Out of Scope for V1</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold uppercase">
              Phase 1.5 Protocol
            </span>
          </div>
          <p className="leading-relaxed">
            Mobile recovery is intentionally under-specified in V1 because it is gated on V1 desktop evidence and partner-specific deep link technical proof. When introduced, V1.5 is a <strong>user-initiated recovery path</strong> (via OS share sheet or owned surfaces) — <em>not background cross-app surveillance or automated accessibility interception</em>.
          </p>
        </div>

      </div>
    </section>
  );
};
