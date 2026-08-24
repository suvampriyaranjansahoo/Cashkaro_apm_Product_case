export type ReadingDepth = '30s' | '2m' | '7m';
export type ThemeMode = 'dark' | 'light';

export interface SectionMeta {
  id: string;
  num: string;
  title: string;
  shortTitle: string;
  summary30s: string;
}

export interface GateInfo {
  id: string;
  gate: string;
  title: string;
  method: string;
  passCondition: string;
  ifFails: string;
  metricTarget: string;
  status: 'passed' | 'active' | 'future';
}

export interface Hypothesis {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  tagColor: 'blue' | 'amber' | 'neutral';
  whyWeBelieve: string;
  whatWouldProve: string;
  whatWouldDisprove: string;
  productImplication: string;
  isSelected?: boolean;
}

export interface MindChangeScenario {
  id: string;
  title: string;
  trigger: string;
  consequence: string;
  pivotAction: string;
  category: 'Research' | 'Market' | 'Technical' | 'Experiment' | 'Trust' | 'Financial';
}

export interface SpecAC {
  id: string;
  title: string;
  description: string;
  category: 'Security' | 'Experience' | 'Attribution' | 'Data';
}
