import React from 'react';
import { ReadingDepth } from '../types';
import { SectionReveal } from './SectionReveal';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { HypothesesSection } from './HypothesesSection';
import { PrioritizationSection } from './PrioritizationSection';
import { ValidationGatesSection } from './ValidationGatesSection';
import { MindChangeSection } from './MindChangeSection';
import { IntentRouterShowcase } from './IntentRouterShowcase';
import { ProductSpecSection } from './ProductSpecSection';
import { ArchitectureSection } from './ArchitectureSection';
import { MeasurementSection } from './MeasurementSection';
import { ExperimentSimulator } from './ExperimentSimulator';
import { OperatingModelSection } from './OperatingModelSection';
import { FinalDecisionSection } from './FinalDecisionSection';

interface DocumentSectionsProps {
  readingDepth: ReadingDepth;
  highlightedSections: string[];
  onToggleHighlight: (id: string) => void;
  onOpenRecruiterHub: () => void;
}

export const DocumentSections: React.FC<DocumentSectionsProps> = ({
  readingDepth,
  highlightedSections,
  onToggleHighlight,
  onOpenRecruiterHub
}) => {
  return (
    <main className="flex-1 relative z-10">
      <SectionReveal>
        <HeroSection readingDepth={readingDepth} onOpenRecruiterHub={onOpenRecruiterHub} />
      </SectionReveal>

      <SectionReveal>
        <ProblemSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('problem')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <HypothesesSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('hypotheses')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <PrioritizationSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('prioritization')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <ValidationGatesSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('validation')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <MindChangeSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('mind-change')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <IntentRouterShowcase readingDepth={readingDepth} isHighlighted={highlightedSections.includes('intent-router')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <ProductSpecSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('product-spec')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <ArchitectureSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('architecture')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <MeasurementSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('measurement')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <ExperimentSimulator readingDepth={readingDepth} isHighlighted={highlightedSections.includes('simulator')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <OperatingModelSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('operating-model')} onToggleHighlight={onToggleHighlight} />
      </SectionReveal>

      <SectionReveal>
        <FinalDecisionSection readingDepth={readingDepth} isHighlighted={highlightedSections.includes('decision')} onToggleHighlight={onToggleHighlight} onOpenRecruiterHub={onOpenRecruiterHub} />
      </SectionReveal>
    </main>
  );
};
