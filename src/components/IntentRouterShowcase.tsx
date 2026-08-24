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
  ShoppingBag,
  Share2,
  Copy,
  ChevronRight,
  RotateCcw,
  Zap
} from 'lucide-react';
import { GlossaryBadge } from './GlossaryBadge';
import { SectionHeader } from './SectionHeader';

interface IntentRouterShowcaseProps {
  readingDepth: ReadingDepth;
  isHighlighted?: boolean;
  onToggleHighlight?: (id: string) => void;
}

export const IntentRouterShowcase: React.FC<IntentRouterShowcaseProps> = ({ 
  readingDepth,
  isHighlighted,
  onToggleHighlight
}) => {
  const [platformView, setPlatformView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeUiState, setActiveUiState] = useState<'eligible' | 'referral-blocked' | 'checkout-suppressed'>('eligible');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  // Mobile prototype interactive flow step (1 to 4)
  const [mobileStep, setMobileStep] = useState<number>(1);

  return (
    <section 
      id="intent-router" 
      className={`py-12 sm:py-16 border-b border-[#DCE4EE] dark:border-slate-800 transition-colors ${
        isHighlighted ? 'section-highlighted' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Copy Link & Highlight */}
        <SectionHeader
          num="07"
          category="Product Mechanism & Interactive Prototypes"
          sectionId="intent-router"
          isHighlighted={isHighlighted}
          onToggleHighlight={onToggleHighlight}
          title={<span>Product decision: CashKaro Intent Router.</span>}
          description={
            <span>
              Conditional on G1–G3 validation, V1 is a desktop-first Chrome extension for consented existing users across an allowlist of 3–5 partner retailers. Its promise is deliberately narrow: <strong>activate the known cashback path without forcing a journey restart</strong>.
            </span>
          }
        />

        {/* Platform Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs mb-8 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display">Interactive Prototype:</span>
            <div className="flex rounded-xl bg-[#F0EAD5] dark:bg-slate-900 p-1 border border-[#DEB6C5]/60 dark:border-slate-800">
              <button
                onClick={() => setPlatformView('desktop')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  platformView === 'desktop'
                    ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Extension (V1 Bet)</span>
              </button>
              <button
                onClick={() => setPlatformView('mobile')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  platformView === 'mobile'
                    ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Intent Router (V1.5 Flow)</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono hidden md:block">
            {platformView === 'desktop' ? 'V1 Scope: Chrome Extension' : 'V1.5 Spec: User-Initiated Share/Clipboard Recovery'}
          </div>
        </div>

        {/* JTBD Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F0EAD5]/70 dark:bg-blue-950/40 border border-[#DEB6C5] dark:border-blue-900/60 mb-8 text-xs sm:text-sm text-slate-800 dark:text-slate-200 transition-colors">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8F3760] dark:text-blue-400 block mb-1">
            Job To Be Done (JTBD)
          </span>
          <p className="font-medium text-slate-900 dark:text-white leading-snug">
            "When I have started shopping on an eligible partner retailer and can earn cashback, help me activate a reliable CashKaro-tracked journey with minimal friction, so I do not have to choose between preserving my cart progress and earning rewards."
          </p>
        </div>

        {/* ================= DESKTOP VIEW ================= */}
        {platformView === 'desktop' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10 animate-in fade-in duration-200">
            
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
                        className="w-full py-2 px-3 rounded-lg bg-[#316BEA] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>ACTIVATE CASHBACK</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Tracking Activated (<GlossaryBadge termKey="SubID">Click ID Tagged</GlossaryBadge>)</span>
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
                      <span className="font-mono text-[11px] uppercase tracking-wider">
                        <GlossaryBadge termKey="Attribution Guard">Attribution Precedence Locked</GlossaryBadge>
                      </span>
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
              <div className="p-4 rounded-xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                  Interactive State Toggle:
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <button
                    onClick={() => { setActiveUiState('eligible'); setIsActivated(false); }}
                    className={`p-2.5 rounded-lg text-left font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      activeUiState === 'eligible'
                        ? 'bg-[#D190AC] dark:bg-[#0080AB] text-white shadow-sm'
                        : 'bg-[#F0EAD5] dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 hover:bg-[#DEB6C5]/40'
                    }`}
                  >
                    <span>1. Eligible Intent (Prompt Shown)</span>
                    <span className="font-mono text-[10px]">Active</span>
                  </button>
                  <button
                    onClick={() => { setActiveUiState('referral-blocked'); setIsActivated(false); }}
                    className={`p-2.5 rounded-lg text-left font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      activeUiState === 'referral-blocked'
                        ? 'bg-[#8F3760] dark:bg-[#0B1728] text-white shadow-sm border border-amber-500/40'
                        : 'bg-[#F0EAD5] dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 hover:bg-[#DEB6C5]/40'
                    }`}
                  >
                    <span>2. Existing Referral (Suppressed)</span>
                    <span className="font-mono text-[10px]">Guardrail</span>
                  </button>
                  <button
                    onClick={() => { setActiveUiState('checkout-suppressed'); setIsActivated(false); }}
                    className={`p-2.5 rounded-lg text-left font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      activeUiState === 'checkout-suppressed'
                        ? 'bg-[#8F3760] dark:bg-[#0B1728] text-white shadow-sm'
                        : 'bg-[#F0EAD5] dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 hover:bg-[#DEB6C5]/40'
                    }`}
                  >
                    <span>3. Checkout / Sensitive (Suppressed)</span>
                    <span className="font-mono text-[10px]">AC3 Rule</span>
                  </button>
                </div>
              </div>

              {/* 4 Core Design Principles */}
              <div className="bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 text-xs transition-colors">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  4 Core UX & Attribution Principles
                </span>
                
                <div className="space-y-2 text-slate-800 dark:text-slate-300">
                  <div className="p-2.5 rounded-lg bg-[#F0EAD5]/60 dark:bg-slate-800/80 border border-[#DEB6C5]/50 dark:border-slate-700/80">
                    <strong className="text-slate-900 dark:text-white block">1. One Clear Value Statement:</strong>
                    Rate and terms are dynamically synced from server-side affiliate config.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F0EAD5]/60 dark:bg-slate-800/80 border border-[#DEB6C5]/50 dark:border-slate-700/80">
                    <strong className="text-slate-900 dark:text-white block">2. Explicit Action Only:</strong>
                    Zero auto-activation. Requires user click; never interrupts checkout flow.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F0EAD5]/60 dark:bg-slate-800/80 border border-[#DEB6C5]/50 dark:border-slate-700/80">
                    <strong className="text-slate-900 dark:text-white block">3. Existing Referral Wins:</strong>
                    Prior creator/partner affiliate tokens are respected and never overwritten.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F0EAD5]/60 dark:bg-slate-800/80 border border-[#DEB6C5]/50 dark:border-slate-700/80">
                    <strong className="text-slate-900 dark:text-white block">4. "Tracking Expected":</strong>
                    Communicates system state without falsely guaranteeing payout before <GlossaryBadge termKey="S2S Postback">postback</GlossaryBadge>.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= MOBILE VIEW (V1.5 PROTOTYPE) ================= */}
        {platformView === 'mobile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10 animate-in fade-in duration-200">
            
            {/* Left: Interactive Mobile Screen Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-[320px] sm:w-[350px] bg-slate-950 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 relative">
                
                {/* Speaker & Camera Notch */}
                <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-950 mr-2" />
                  <div className="w-10 h-1 bg-slate-800 rounded-full" />
                </div>

                {/* Mobile Phone Screen Area */}
                <div className="bg-slate-50 rounded-[28px] overflow-hidden min-h-[520px] flex flex-col justify-between border border-slate-200 relative text-slate-900">
                  
                  {/* Top Bar */}
                  <div className="bg-white p-3 border-b border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                      Amazon India App
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">11:42 AM</span>
                  </div>

                  {/* Step 1: Product View in Merchant App */}
                  {mobileStep === 1 && (
                    <div className="p-4 space-y-4 animate-in fade-in">
                      <div className="h-32 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                        [Sony Noise Cancelling Headphones]
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">Sony WH-1000XM5 Wireless</div>
                        <div className="text-emerald-700 font-bold text-base mt-1">₹26,990 <span className="text-xs text-slate-400 line-through">₹29,990</span></div>
                      </div>
                      
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                        <strong className="block mb-0.5">Moment of Intent:</strong>
                        User is on the merchant product page and taps <strong>Share</strong> or copies URL.
                      </div>

                      <button
                        onClick={() => setMobileStep(2)}
                        className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Simulate: Tap "Share Product"</span>
                      </button>
                    </div>
                  )}

                  {/* Step 2: CashKaro 1-Tap Recovery Smart Sheet */}
                  {mobileStep === 2 && (
                    <div className="p-4 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
                      <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 opacity-60">
                        [Amazon Product Shared...]
                      </div>

                      {/* CashKaro Floating Smart Sheet */}
                      <div className="bg-white rounded-2xl shadow-xl border-2 border-[#316BEA] p-4 text-slate-900 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded bg-[#316BEA] text-white flex items-center justify-center font-bold text-[9px]">
                              CK
                            </div>
                            <span className="font-display font-extrabold text-sm tracking-tight text-[#0B1F3A]">CashKaro Smart Intent</span>
                          </div>
                          <span className="text-[9px] font-mono bg-emerald-50 text-[#159A68] px-1.5 py-0.5 rounded font-bold">
                            7.5% CASHBACK
                          </span>
                        </div>

                        <div>
                          <div className="text-xs text-slate-500">Earn extra rewards on Amazon:</div>
                          <div className="text-lg font-extrabold text-[#316BEA] font-display">₹2,024 Cashback Available</div>
                        </div>

                        <button
                          onClick={() => setMobileStep(3)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#316BEA] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                          <Zap className="w-4 h-4" />
                          <span>ACTIVATE & RE-OPEN AMAZON</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Attribution Injection & Routing */}
                  {mobileStep === 3 && (
                    <div className="p-4 space-y-4 text-center animate-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-[#316BEA] flex items-center justify-center mx-auto mt-6">
                        <ShieldCheck className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">Verifying Attribution Precedence</div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Checking for creator affiliate tags... None found. Generating cryptographic <GlossaryBadge termKey="SubID">SubID</GlossaryBadge> session token.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-xl text-left">
                        <div>&gt; deep_link: amzn://product/sony?tag=ck-subid-892f</div>
                        <div>&gt; attribution_locked: true</div>
                        <div>&gt; launching_merchant_intent...</div>
                      </div>
                      <button
                        onClick={() => setMobileStep(4)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Continue to Merchant App</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Step 4: Successfully Tracked Session in Merchant App */}
                  {mobileStep === 4 && (
                    <div className="p-4 space-y-4 animate-in fade-in">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <strong className="block">CashKaro Tracking Activated!</strong>
                          <span>Amazon order will earn up to 7.5% rewards.</span>
                        </div>
                      </div>

                      <div className="h-32 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                        [Amazon Checkout: Cart Preserved]
                      </div>

                      <button
                        onClick={() => setMobileStep(1)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Replay Mobile Flow</span>
                      </button>
                    </div>
                  )}

                  {/* Step Dots Footer */}
                  <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Flow Step {mobileStep} of 4</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <button
                          key={step}
                          onClick={() => setMobileStep(step)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            mobileStep === step ? 'bg-[#316BEA] w-5' : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right: Mobile Intent Protocol Details */}
            <div className="lg:col-span-6 space-y-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1726] border border-[#DEB6C5]/70 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
                <div className="flex items-center justify-between border-b border-[#DEB6C5]/40 dark:border-slate-800 pb-3">
                  <span className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#8F3760] dark:text-blue-400" />
                    <span>Mobile V1.5 Recovery Protocol</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#F0D6DE] dark:bg-purple-950/80 text-[#8F3760] dark:text-purple-300 px-2 py-0.5 rounded font-bold border border-[#DEB6C5] dark:border-purple-800/60">
                    Gated on V1 Validation
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-800 dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-[#F0EAD5]/60 dark:bg-slate-800/80 border border-[#DEB6C5]/50 dark:border-slate-700/80 space-y-1">
                    <strong className="text-slate-900 dark:text-white block font-semibold">1. User-Initiated Share Intent:</strong>
                    <span>No automated accessibility service sniffing or background app spying. The user explicitly shares or copies a partner link to CashKaro.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F0EAD5]/60 dark:bg-slate-800/80 border border-[#DEB6C5]/50 dark:border-slate-700/80 space-y-1">
                    <strong className="text-slate-900 dark:text-white block font-semibold">2. Immediate SubID Deep-Linking:</strong>
                    <span>CashKaro resolves the merchant URL, verifies affiliate eligibility, and returns an OS deep-link URI directly reopening the merchant cart.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F0EAD5]/60 dark:bg-slate-800/80 border border-[#DEB6C5]/50 dark:border-slate-700/80 space-y-1">
                    <strong className="text-slate-900 dark:text-white block font-semibold">3. Zero Habit Disruption:</strong>
                    <span>Takes &lt;1.8 seconds end-to-end, solving mobile cart loss anxiety without requiring re-discovery in CashKaro.</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <em>Note: Mobile recovery is deliberately scoped for Phase 1.5 after desktop extension proves causal incrementality in G4.</em>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Deliberately Gated Architecture Footer Notice */}
        <div className="p-5 rounded-2xl bg-[#F0EAD5] dark:bg-slate-900 border border-[#DEB6C5] dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-300 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-[#8F3760] dark:text-[#25C3FF]" />
              <h4 className="font-display font-bold">Attribution Integrity & Privacy Guarantee</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#DEB6C5]/40 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono text-[10px] font-bold uppercase border border-[#DEB6C5]/60 dark:border-slate-700">
              Zero PII Policy
            </span>
          </div>
          <p className="leading-relaxed">
            Both Desktop V1 and Mobile V1.5 prototypes operate strictly on an <strong>allowlist of 3–5 partner merchants</strong>. No keystroke recording, no browsing surveillance on personal websites, and zero <GlossaryBadge termKey="SubID">PII passed</GlossaryBadge> in affiliate tracking strings.
          </p>
        </div>

      </div>
    </section>
  );
};
