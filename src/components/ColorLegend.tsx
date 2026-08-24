import React from 'react';

export const ColorLegend: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0E1726] border border-[#DCE4EE] dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400">
        <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500">Decision Code</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#159A68] inline-block shadow-xs"></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Pass / Scale / Validated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C27A14] inline-block shadow-xs"></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Gray / Extend Discovery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#BD3B34] inline-block shadow-xs"></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Fail / Stop / Guardrail</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#316BEA] inline-block shadow-xs"></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Selected Product Bet (V1)</span>
        </div>
      </div>
    </div>
  );
};

