import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Shield, 
  Workflow, 
  Clock,
  Download,
  Check,
  Info,
  Sparkles,
  Zap,
  Lock,
  Share2
} from 'lucide-react';
import { ThemeMode } from '../types';

interface StrategyNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: 'trigger' | 'client_engine' | 'privacy' | 'overlay' | 'handoff' | 'settlement';
  stage: number;
  latencyMs: number;
  description: string;
  privacyNote: string;
  codeSnippet: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface StrategyLink extends d3.SimulationLinkDatum<StrategyNode> {
  source: string | StrategyNode;
  target: string | StrategyNode;
  label: string;
  type: 'sync' | 'async' | 'crypto';
}

interface CategoryDefinition {
  category: StrategyNode['category'];
  label: string;
  colorLight: string;
  colorDark: string;
  badgeBgLight: string;
  badgeBgDark: string;
  shortDesc: string;
  technicalRole: string;
  latency: string;
  securityGuarantee: string;
}

const CATEGORY_DEFINITIONS: Record<StrategyNode['category'], CategoryDefinition> = {
  trigger: {
    category: 'trigger',
    label: 'Trigger',
    colorLight: '#D97706',
    colorDark: '#F59E0B',
    badgeBgLight: '#FEF3C7',
    badgeBgDark: '#78350F',
    shortDesc: 'Declarative URL listener in Chrome/Mobile webview.',
    technicalRole: 'Declarative Browser Hook',
    latency: '< 2ms',
    securityGuarantee: 'Zero DOM scraping, no keystroke monitoring, and 0 access to password/input values.'
  },
  client_engine: {
    category: 'client_engine',
    label: 'Client Engine',
    colorLight: '#0284C7',
    colorDark: '#00AFD3',
    badgeBgLight: '#E0F2FE',
    badgeBgDark: '#0C4A6E',
    shortDesc: '45KB binary Bloom filter matching 1,500+ affiliate merchants.',
    technicalRole: 'Local Memory Classifier',
    latency: '8ms',
    securityGuarantee: '100% on-device memory vector. Zero telemetry packets sent to CashKaro servers on non-merchants.'
  },
  privacy: {
    category: 'privacy',
    label: 'Privacy Gate',
    colorLight: '#059669',
    colorDark: '#10B981',
    badgeBgLight: '#D1FAE5',
    badgeBgDark: '#064E3B',
    shortDesc: 'Zero-knowledge token & active session grace period validator.',
    technicalRole: 'Encrypted IndexedDB Gate',
    latency: '12ms',
    securityGuarantee: 'Prevents prompt fatigue without querying remote servers; evaluates state locally in encrypted storage.'
  },
  overlay: {
    category: 'overlay',
    label: 'Shadow DOM',
    colorLight: '#7C3AED',
    colorDark: '#8B5CF6',
    badgeBgLight: '#EDE9FE',
    badgeBgDark: '#4C1D95',
    shortDesc: 'Isolated 1-Tap UI pill displaying real-time partner cashback.',
    technicalRole: 'Sandboxed Web Component',
    latency: '18ms',
    securityGuarantee: 'Closed Shadow DOM boundary protects host retailer DOM and prevents third-party scripts from reading state.'
  },
  handoff: {
    category: 'handoff',
    label: 'SubID Token',
    colorLight: '#DB2777',
    colorDark: '#EC4899',
    badgeBgLight: '#FCE7F3',
    badgeBgDark: '#831843',
    shortDesc: 'Signed HMAC token (ck_subid_...) binding user hash to merchant.',
    technicalRole: 'Cryptographic Attributor',
    latency: '28ms - 38ms',
    securityGuarantee: 'Preserves product SKU and cart items; payload contains only one-way hashed user ID and timestamp.'
  },
  settlement: {
    category: 'settlement',
    label: 'S2S Webhook',
    colorLight: '#0D9488',
    colorDark: '#14B8A6',
    badgeBgLight: '#CCFBF1',
    badgeBgDark: '#134E4A',
    shortDesc: 'Server-to-server postback callback for attribution & wallet credit.',
    technicalRole: 'Async Partner Postback',
    latency: '42ms (Async)',
    securityGuarantee: 'Reconciles transaction against cryptographic SubID with 99.8% deterministic attribution.'
  }
};

const FLOW_NODES: StrategyNode[] = [
  {
    id: 'user_intent',
    name: '1. User Intent Event',
    category: 'trigger',
    stage: 1,
    latencyMs: 2,
    description: 'User enters shopping flow on partner merchant (e.g. amazon.in/dp/B09..., myntra.com, flipkart.com) via Chrome or Mobile browser.',
    privacyNote: 'Monitored via declarative tab URL listener. Zero keystrokes recorded.',
    codeSnippet: `chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) evaluateIntent(changeInfo.url);
});`
  },
  {
    id: 'bloom_filter',
    name: '2. Client Bloom Filter',
    category: 'client_engine',
    stage: 2,
    latencyMs: 8,
    description: 'Local 45KB binary Bloom filter instantly classifies domain/path against 1,500+ affiliate merchant patterns in memory.',
    privacyNote: '100% on-device memory lookup. 0 network packets sent to CashKaro servers.',
    codeSnippet: `const isMerchant = localBloomFilter.test(url.hostname);
if (!isMerchant) return; // Exit in <0.5ms with zero telemetry`
  },
  {
    id: 'zero_knowledge_eval',
    name: '3. Privacy & State Gate',
    category: 'privacy',
    stage: 3,
    latencyMs: 12,
    description: 'Verifies user authentication token in local encrypted IndexedDB and checks if session is already active or in grace period.',
    privacyNote: 'Evaluates state without querying remote database. Prevents repeated spam prompts.',
    codeSnippet: `const { token, activeSession } = await getLocalAuthState();
if (activeSession?.isValid(merchantId)) return suppressPrompt();`
  },
  {
    id: 'smart_interceptor',
    name: '4. Non-Intrusive UI Injector',
    category: 'overlay',
    stage: 4,
    latencyMs: 18,
    description: 'Shadow DOM injects a sleek 1-Tap Activation pill displaying exact merchant cashback rate (e.g. "Earn +6.5% Cashback on Amazon").',
    privacyNote: 'Isolated in Shadow DOM. Cannot read page DOM, form inputs, or passwords.',
    codeSnippet: `const shadowRoot = hostElement.attachShadow({ mode: 'closed' });
shadowRoot.appendChild(renderActivationPill(rateConfig));`
  },
  {
    id: 'crypto_token_gen',
    name: '5. Cryptographic SubID Token',
    category: 'handoff',
    stage: 5,
    latencyMs: 28,
    description: 'Upon explicit user click, generates a single-use cryptographically signed JWT subID binding (ck_subid_2026_x89a).',
    privacyNote: 'Payload contains only hashed user ID and timestamp. Zero browsing history.',
    codeSnippet: `const subId = signHandoffJwt({
  uid: hashUserId(user.id),
  merchantId,
  exp: Date.now() + 1800000 // 30 min window
});`
  },
  {
    id: 'deep_link_router',
    name: '6. Seamless S2S Deep Link',
    category: 'handoff',
    stage: 6,
    latencyMs: 38,
    description: 'Silently attaches CashKaro affiliate tracking parameters and resumes merchant checkout without losing cart contents.',
    privacyNote: 'Preserves product SKU in query parameters without altering cart state.',
    codeSnippet: `const trackingUrl = affiliateEngine.buildDeepLink({
  destinationUrl: currentUrl,
  subId,
  source: 'intent_router_v2'
});
window.location.replace(trackingUrl);`
  },
  {
    id: 's2s_postback',
    name: '7. S2S Postback & Settlement',
    category: 'settlement',
    stage: 7,
    latencyMs: 42,
    description: 'Merchant affiliate network fires asynchronous server-to-server webhook callback to CashKaro. User wallet credits pending cashback.',
    privacyNote: 'Reconciles transaction via matching SubID. 99.8% tracking certainty.',
    codeSnippet: `POST /api/webhooks/affiliate-postback
Payload: { sub_id: "ck_subid_2026_x89a", gmv: 3499, comm: 150.5 }
-> Reconciles and triggers Push Notification "₹98.00 Cashback Tracked!"`
  }
];

const FLOW_LINKS: StrategyLink[] = [
  { source: 'user_intent', target: 'bloom_filter', label: '< 2ms Local Hook', type: 'sync' },
  { source: 'bloom_filter', target: 'zero_knowledge_eval', label: 'Match Verified', type: 'sync' },
  { source: 'zero_knowledge_eval', target: 'smart_interceptor', label: 'Mount Shadow DOM', type: 'sync' },
  { source: 'smart_interceptor', target: 'crypto_token_gen', label: '1-Tap User Click', type: 'crypto' },
  { source: 'crypto_token_gen', target: 'deep_link_router', label: 'Signed SubID Token', type: 'crypto' },
  { source: 'deep_link_router', target: 's2s_postback', label: 'Merchant S2S Webhook', type: 'async' }
];

const SCENARIOS = [
  {
    id: 'amazon_direct',
    title: 'Scenario A: Direct Merchant Session (Amazon / Myntra)',
    description: 'User enters amazon.in directly. Intent Router detects merchant in 8ms, mounts 1-tap activation pill, and routes with zero cart disruption.',
    focusNode: 'smart_interceptor'
  },
  {
    id: 'existing_session',
    title: 'Scenario B: Active Handoff Grace Period',
    description: 'User already clicked a CashKaro link 10 minutes ago. Router detects active SubID in IndexedDB and suppresses prompt to prevent friction.',
    focusNode: 'zero_knowledge_eval'
  },
  {
    id: 'postback_reconciliation',
    title: 'Scenario C: S2S Webhook & Settlement Reconciliation',
    description: 'Merchant server fires postback webhook. Transaction reconciled against cryptographic SubID with 99.8% attribution certainty.',
    focusNode: 's2s_postback'
  }
];

interface StrategyCanvasProps {
  themeMode?: ThemeMode;
}

export const StrategyCanvas: React.FC<StrategyCanvasProps> = ({ themeMode = 'light' }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<StrategyNode>(FLOW_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<StrategyNode | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<StrategyNode['category'] | null>(null);
  const [activeScenario, setActiveScenario] = useState<string>('amazon_direct');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Auto-play simulation step sequence (pauses when hovering or manually inspecting)
  useEffect(() => {
    if (!isPlaying || hoveredNode !== null) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = (prev + 1) % FLOW_NODES.length;
        setSelectedNode(FLOW_NODES[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, hoveredNode]);

  // Compute Active Highlight Path for Hover Interaction
  const activeFocusNode = hoveredNode || selectedNode;
  const highlightedNodeIds = React.useMemo(() => {
    if (!activeFocusNode && !hoveredCategory) return new Set<string>();
    
    if (hoveredCategory) {
      return new Set(FLOW_NODES.filter(n => n.category === hoveredCategory).map(n => n.id));
    }

    if (activeFocusNode) {
      const set = new Set<string>();
      set.add(activeFocusNode.id);
      
      // Add direct upstream and downstream neighbors to data path
      const focusIndex = FLOW_NODES.findIndex(n => n.id === activeFocusNode.id);
      if (focusIndex > 0) set.add(FLOW_NODES[focusIndex - 1].id);
      if (focusIndex < FLOW_NODES.length - 1) set.add(FLOW_NODES[focusIndex + 1].id);
      
      return set;
    }

    return new Set<string>();
  }, [activeFocusNode, hoveredCategory]);

  const highlightedLinkIndices = React.useMemo(() => {
    if (!activeFocusNode) return new Set<number>();
    const set = new Set<number>();
    const focusIndex = FLOW_NODES.findIndex(n => n.id === activeFocusNode.id);
    
    // Incoming link
    if (focusIndex > 0) set.add(focusIndex - 1);
    // Outgoing link
    if (focusIndex < FLOW_LINKS.length) set.add(focusIndex);

    return set;
  }, [activeFocusNode]);

  // D3 Rendering Effect reacting to state, themeMode, and hover path
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const isDark = themeMode === 'dark' || document.documentElement.classList.contains('dark');
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean container

    const width = containerRef.current.clientWidth || 920;
    const height = 390;

    svg
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Create main zoomable group
    const g = svg.append('g').attr('class', 'canvas-content');

    // Define Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Defs for glowing markers, gradients, and drop shadows
    const defs = svg.append('defs');

    // Subtle background grid pattern
    const pattern = defs.append('pattern')
      .attr('id', 'd3-grid')
      .attr('width', 24)
      .attr('height', 24)
      .attr('patternUnits', 'userSpaceOnUse');

    pattern.append('circle')
      .attr('cx', 12)
      .attr('cy', 12)
      .attr('r', 1)
      .attr('fill', isDark ? '#1E293B' : '#E2D9C5')
      .attr('opacity', 0.6);

    // Filter for glowing highlight
    const glowFilter = defs.append('filter')
      .attr('id', 'glow-filter')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', isDark ? '6' : '4')
      .attr('result', 'blur');

    glowFilter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // Arrow markers
    const normalArrowColor = isDark ? '#334155' : '#CBD5E1';
    const activeArrowColor = isDark ? '#25C3FF' : '#8F3760';
    const hoverArrowColor = isDark ? '#02FEFF' : '#316BEA';

    defs.append('marker')
      .attr('id', 'arrow-head-normal')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', normalArrowColor);

    defs.append('marker')
      .attr('id', 'arrow-head-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', activeArrowColor);

    defs.append('marker')
      .attr('id', 'arrow-head-hover')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', hoverArrowColor);

    // Background rect with grid
    g.append('rect')
      .attr('width', width * 2)
      .attr('height', height * 2)
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .attr('fill', 'url(#d3-grid)')
      .attr('opacity', 0.85);

    // Linear fixed layout based on stages
    const paddingX = 80;
    const availableWidth = width - paddingX * 2;
    const stepX = availableWidth / (FLOW_NODES.length - 1);
    const centerY = height / 2;

    FLOW_NODES.forEach((node, index) => {
      node.fx = paddingX + index * stepX;
      node.fy = centerY + (index % 2 === 0 ? -28 : 28);
    });

    // Render connecting path lines
    const linkGroup = g.append('g').attr('class', 'links');
    const particleGroup = g.append('g').attr('class', 'particles');

    const hasHover = hoveredNode !== null || hoveredCategory !== null;

    linkGroup
      .selectAll('path')
      .data(FLOW_LINKS)
      .enter()
      .append('path')
      .attr('class', 'flow-link')
      .attr('stroke', (_, i) => {
        if (highlightedLinkIndices.has(i)) {
          return isDark ? '#02FEFF' : '#316BEA';
        }
        if (!hasHover && i <= activeStepIndex) {
          return isDark ? '#00AFD3' : '#8F3760';
        }
        return normalArrowColor;
      })
      .attr('stroke-width', (_, i) => {
        if (highlightedLinkIndices.has(i)) return 4;
        if (!hasHover && i === activeStepIndex - 1) return 3;
        return 2;
      })
      .attr('stroke-opacity', (_, i) => {
        if (hasHover) {
          return highlightedLinkIndices.has(i) ? 1.0 : 0.2;
        }
        return i <= activeStepIndex ? 0.9 : 0.45;
      })
      .attr('stroke-dasharray', (d) => d.type === 'crypto' ? '4 3' : d.type === 'async' ? '6 4' : 'none')
      .attr('fill', 'none')
      .attr('marker-end', (_, i) => {
        if (highlightedLinkIndices.has(i)) return 'url(#arrow-head-hover)';
        if (!hasHover && i <= activeStepIndex) return 'url(#arrow-head-active)';
        return 'url(#arrow-head-normal)';
      })
      .attr('filter', (_, i) => highlightedLinkIndices.has(i) ? 'url(#glow-filter)' : 'none')
      .attr('d', (d) => {
        const sourceNode = FLOW_NODES.find(n => n.id === d.source);
        const targetNode = FLOW_NODES.find(n => n.id === d.target);
        if (!sourceNode || !targetNode) return '';
        const sx = sourceNode.fx || 0;
        const sy = sourceNode.fy || 0;
        const tx = targetNode.fx || 0;
        const ty = targetNode.fy || 0;
        const dx = tx - sx;
        const dy = ty - sy;
        const cx1 = sx + dx * 0.5;
        const cy1 = sy;
        const cx2 = sx + dx * 0.5;
        const cy2 = ty;
        return `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`;
      });

    // Link label text
    linkGroup
      .selectAll('text.link-label')
      .data(FLOW_LINKS)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('x', (d) => {
        const s = FLOW_NODES.find(n => n.id === d.source);
        const t = FLOW_NODES.find(n => n.id === d.target);
        return ((s?.fx || 0) + (t?.fx || 0)) / 2;
      })
      .attr('y', (d) => {
        const s = FLOW_NODES.find(n => n.id === d.source);
        const t = FLOW_NODES.find(n => n.id === d.target);
        return ((s?.fy || 0) + (t?.fy || 0)) / 2 - 8;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '8.5px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', (_, i) => {
        if (highlightedLinkIndices.has(i)) return isDark ? '#02FEFF' : '#316BEA';
        return isDark ? '#64748B' : '#94A3B8';
      })
      .attr('font-weight', (_, i) => highlightedLinkIndices.has(i) ? 'bold' : 'normal')
      .attr('opacity', (_, i) => {
        if (hasHover) return highlightedLinkIndices.has(i) ? 1.0 : 0.15;
        return 0.75;
      })
      .text((d) => d.label);

    // Pulse animation particles on the active connection or hovered path
    const particleIndex = hasHover && activeFocusNode 
      ? FLOW_NODES.findIndex(n => n.id === activeFocusNode.id)
      : activeStepIndex;

    if (particleIndex > 0 && particleIndex < FLOW_NODES.length) {
      const activeLink = FLOW_LINKS[particleIndex - 1];
      const sourceNode = FLOW_NODES.find(n => n.id === activeLink.source);
      const targetNode = FLOW_NODES.find(n => n.id === activeLink.target);
      
      if (sourceNode && targetNode) {
        const particleColor = isDark ? '#02FEFF' : '#8F3760';
        const particle = particleGroup
          .append('circle')
          .attr('r', hasHover ? 5.5 : 4.5)
          .attr('fill', particleColor)
          .attr('filter', 'url(#glow-filter)');

        const sx = sourceNode.fx || 0;
        const sy = sourceNode.fy || 0;
        const tx = targetNode.fx || 0;
        const ty = targetNode.fy || 0;

        function animateParticle() {
          particle
            .attr('cx', sx)
            .attr('cy', sy)
            .attr('opacity', 1)
            .transition()
            .duration(hasHover ? 800 : 1200)
            .ease(d3.easeCubicInOut)
            .attr('cx', tx)
            .attr('cy', ty)
            .transition()
            .duration(180)
            .attr('opacity', 0)
            .on('end', () => {
              if (isPlaying || hasHover) animateParticle();
            });
        }
        animateParticle();
      }
    }

    // Render Strategy Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');

    const nodeSelection = nodeGroup
      .selectAll('.strategy-node')
      .data(FLOW_NODES)
      .enter()
      .append('g')
      .attr('class', 'strategy-node')
      .attr('transform', (d) => `translate(${d.fx}, ${d.fy})`)
      .style('cursor', 'pointer')
      .attr('opacity', (d) => {
        if (!hasHover) return 1.0;
        return highlightedNodeIds.has(d.id) ? 1.0 : 0.22;
      })
      .on('mouseenter', (_, d) => {
        setHoveredNode(d);
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
      })
      .on('click', (_, d) => {
        setSelectedNode(d);
        const index = FLOW_NODES.findIndex(n => n.id === d.id);
        setActiveStepIndex(index);
        setIsPlaying(false);
      });

    // Outer ripple for selected / hovered active step
    nodeSelection
      .filter((d) => d.id === activeFocusNode.id || (hoveredCategory !== null && d.category === hoveredCategory))
      .append('circle')
      .attr('r', 29)
      .attr('fill', 'none')
      .attr('stroke', isDark ? '#00AFD3' : '#8F3760')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.7)
      .attr('class', 'animate-ping');

    // Node main circle surface with theme-aware gradient fill
    nodeSelection
      .append('circle')
      .attr('r', (d) => (d.id === activeFocusNode.id ? 23 : 18.5))
      .attr('fill', (d) => {
        const catDef = CATEGORY_DEFINITIONS[d.category];
        if (d.id === activeFocusNode.id) {
          return isDark ? '#25C3FF' : '#8F3760';
        }
        return isDark ? catDef.colorDark : catDef.colorLight;
      })
      .attr('stroke', isDark ? '#0F172A' : '#FFFFFF')
      .attr('stroke-width', (d) => d.id === activeFocusNode.id ? 3.5 : 2.5)
      .attr('filter', (d) => {
        if (d.id === activeFocusNode.id) return 'url(#glow-filter)';
        return isDark ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))';
      });

    // Step numbers inside node
    nodeSelection
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#FFFFFF')
      .attr('font-size', (d) => d.id === activeFocusNode.id ? '12px' : '10px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text((d) => d.stage);

    // Node labels
    nodeSelection
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (_, i) => i % 2 === 0 ? '-2.3em' : '2.9em')
      .attr('class', () => `font-mono text-[10.5px] font-bold select-none transition-colors ${
        isDark ? 'fill-slate-100' : 'fill-slate-900'
      }`)
      .text((d) => d.name.replace(/^[0-9]+\.\s*/, ''));

    // Latency badge below node
    nodeSelection
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (_, i) => i % 2 === 0 ? '-3.6em' : '4.2em')
      .attr('class', () => `font-mono text-[9.5px] font-bold select-none ${
        isDark ? 'fill-[#25C3FF]' : 'fill-[#8F3760]'
      }`)
      .text((d) => `${d.latencyMs}ms`);

  }, [selectedNode, hoveredNode, hoveredCategory, activeStepIndex, isPlaying, themeMode, highlightedNodeIds, highlightedLinkIndices, activeFocusNode]);

  // Handle zoom controls
  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const handleScenarioChange = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      const targetNode = FLOW_NODES.find(n => n.id === scenario.focusNode);
      if (targetNode) {
        setSelectedNode(targetNode);
        const index = FLOW_NODES.findIndex(n => n.id === targetNode.id);
        setActiveStepIndex(index);
        setIsPlaying(false);
      }
    }
  };

  // High-Resolution PNG Export Handler
  const handleDownloadDiagram = useCallback(async () => {
    if (!svgRef.current) return;
    setIsExporting(true);

    try {
      const isDark = themeMode === 'dark' || document.documentElement.classList.contains('dark');
      const svgElement = svgRef.current;
      
      // Create offscreen canvas with high DPI scale (2.5x)
      const scale = 2.5;
      const width = (svgElement.clientWidth || 920);
      const height = (svgElement.clientHeight || 390);
      const canvasWidth = width * scale;
      const canvasHeight = height * scale;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');

      // 1. Draw themed background
      ctx.fillStyle = isDark ? '#060D18' : '#F7F6ED';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Subtle decorative grid border
      ctx.strokeStyle = isDark ? 'rgba(37, 195, 255, 0.2)' : 'rgba(222, 182, 197, 0.6)';
      ctx.lineWidth = 4 * scale;
      ctx.strokeRect(10 * scale, 10 * scale, canvasWidth - 20 * scale, canvasHeight - 20 * scale);

      // 2. Prepare SVG XML serialization
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);
      
      // Inject standard namespace if missing
      if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Draw the SVG diagram
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        // 3. Add High-Res Presentation Watermark & Header
        ctx.fillStyle = isDark ? '#F8FAFC' : '#0B1F3A';
        ctx.font = `bold ${13 * scale}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText('CashKaro Intent Router — Strategy Canvas Execution Flow', 20 * scale, 30 * scale);

        ctx.fillStyle = isDark ? '#25C3FF' : '#8F3760';
        ctx.font = `600 ${9 * scale}px "JetBrains Mono", monospace`;
        ctx.fillText('CONFIDENTIAL APM HIRING DOSSIER • SUVAM PRIYARANJAN SAHOO • 99.8% ATTRIBUTION CERTAINTY', 20 * scale, 45 * scale);

        // Footer Timestamp
        ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
        ctx.font = `500 ${8 * scale}px "JetBrains Mono", monospace`;
        const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        ctx.fillText(`Exported on ${timestamp} • End-to-End Latency Target: <42ms • Zero PII Leakage`, 20 * scale, canvasHeight - 18 * scale);

        // 4. Download file
        canvas.toBlob((blob) => {
          if (!blob) return;
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `cashkaro_intent_router_strategy_flow_${isDark ? 'dark' : 'light'}.png`;
          link.href = downloadUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          window.URL.revokeObjectURL(blobURL);

          setIsExporting(false);
          setExportSuccess(true);
          setTimeout(() => setExportSuccess(false), 3500);
        }, 'image/png', 0.95);
      };

      img.src = blobURL;
    } catch (err) {
      console.error('Failed to export strategy diagram:', err);
      setIsExporting(false);
    }
  }, [themeMode]);

  return (
    <div className="my-8 bg-white/95 dark:bg-slate-900/95 rounded-2xl p-5 sm:p-6 border border-[#DEB6C5]/70 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* Header with Title, Simulation Controls & Download */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#DEB6C5]/50 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#8F3760]/15 dark:bg-[#316BEA]/15 text-[#8F3760] dark:text-cyan-400 flex items-center justify-center">
              <Workflow className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
              <span>Strategy Canvas: Interactive Intent Router Execution Flow</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                D3 v7 Reactive
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            D3 topology mapping real-time client-side evaluation, zero-knowledge filters, and S2S affiliate token handoffs. Hover over any node to highlight its complete data path.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Download Diagram Button */}
          <button
            onClick={handleDownloadDiagram}
            disabled={isExporting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              exportSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#F0EAD5] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-[#DEB6C5]/70 dark:border-slate-700 hover:bg-[#DEB6C5]/40 dark:hover:bg-slate-700'
            }`}
            title="Export high-resolution PNG diagram for executive presentation slides"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Exported (High-Res PNG)</span>
              </>
            ) : isExporting ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin text-[#8F3760] dark:text-cyan-400" />
                <span>Rendering PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#8F3760] dark:text-cyan-400" />
                <span>Download Diagram</span>
              </>
            )}
          </button>

          {/* Play/Pause Simulator */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isPlaying
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-[#8F3760] dark:bg-[#316BEA] text-white hover:bg-[#722A4C] dark:hover:bg-blue-600'
            }`}
            title={isPlaying ? 'Pause auto-play simulation' : 'Start interactive playback'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Step</span>
              </>
            )}
          </button>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-[#F0EAD5]/80 dark:bg-slate-800 rounded-xl p-0.5 border border-[#DEB6C5]/60 dark:border-slate-700">
            <button
              onClick={() => handleZoom(1.2)}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#8F3760] dark:hover:text-cyan-400 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#8F3760] dark:hover:text-cyan-400 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#8F3760] dark:hover:text-cyan-400 transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Presets Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 my-4">
        {SCENARIOS.map((scenario) => {
          const isActive = activeScenario === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario.id)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-50/90 dark:bg-blue-950/60 border-[#8F3760] dark:border-blue-500 shadow-xs ring-1 ring-[#8F3760]/30 dark:ring-[#25C3FF]/30'
                  : 'bg-[#F7F6ED]/70 dark:bg-slate-800/60 border-[#DEB6C5]/50 dark:border-slate-700/50 hover:bg-[#F0EAD5] dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {scenario.title}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#8F3760] dark:bg-cyan-400 shrink-0 animate-pulse"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive D3 Canvas Container */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[390px] bg-[#F7F6ED]/80 dark:bg-[#060D18] rounded-2xl border border-[#DEB6C5]/60 dark:border-slate-800 overflow-hidden shadow-inner flex items-center justify-center transition-colors"
      >
        <svg ref={svgRef} className="w-full h-full select-none" />

        {/* Live Step / Hover Status Floating Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DEB6C5]/70 dark:border-slate-700 text-xs font-mono flex items-center gap-2 shadow-xs z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-700 dark:text-slate-300 font-bold">
            {hoveredNode ? 'Hover Path Active:' : `Step ${activeStepIndex + 1} of ${FLOW_NODES.length}:`}
          </span>
          <span className="text-[#8F3760] dark:text-cyan-400 font-bold">
            {hoveredNode ? hoveredNode.name : FLOW_NODES[activeStepIndex]?.name}
          </span>
          {hoveredNode && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
              Data Path Highlighted
            </span>
          )}
        </div>

        {/* Floating Quick Hint */}
        <div className="absolute top-3 right-3 hidden md:flex items-center gap-1.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#DEB6C5]/50 dark:border-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Hover node or legend to trace path • Drag to Pan</span>
        </div>

        {/* Interactive Legend with Definitions & Tooltips */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between flex-wrap gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#DEB6C5]/60 dark:border-slate-700 text-[10.5px] font-mono text-slate-700 dark:text-slate-300 shadow-sm z-10">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mr-1">
            <span>Legend:</span>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {(Object.values(CATEGORY_DEFINITIONS)).map((def) => {
              const isCatHovered = hoveredCategory === def.category;
              return (
                <div 
                  key={def.category}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(def.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      isCatHovered 
                        ? 'bg-slate-200 dark:bg-slate-700 shadow-xs ring-1 ring-slate-400' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: themeMode === 'dark' ? def.colorDark : def.colorLight }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {def.label}
                    </span>
                  </button>

                  {/* Rich Interactive Legend Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-30 font-sans">
                    <div className="flex items-center justify-between gap-1 mb-1 pb-1 border-b border-slate-800 font-mono text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-cyan-400">
                        {def.technicalRole}
                      </span>
                      <span className="text-emerald-400 font-semibold">{def.latency}</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed mb-2">
                      {def.shortDesc}
                    </p>
                    <div className="flex items-start gap-1 text-[10px] text-slate-400 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{def.securityGuarantee}</span>
                    </div>
                    {/* Tooltip caret */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Zero-Knowledge MV3</span>
          </div>
        </div>
      </div>

      {/* Node Deep Dive Inspector */}
      {selectedNode && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#F0EAD5]/70 dark:bg-slate-800/80 border border-[#DEB6C5]/70 dark:border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-[#DEB6C5]/60 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#8F3760] dark:bg-[#316BEA] text-white flex items-center justify-center text-xs font-bold font-mono">
                §{selectedNode.stage}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedNode.name}
                </h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                  Category: {selectedNode.category.replace('_', ' ')} • Role: {CATEGORY_DEFINITIONS[selectedNode.category].technicalRole}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{selectedNode.latencyMs}ms Latency</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            {/* Functional Mechanics & Privacy */}
            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Functional Execution:
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[11px] mb-0.5">Zero-Knowledge Guarantee:</strong>
                    <span className="text-[11px] leading-relaxed opacity-90">
                      {selectedNode.privacyNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Code Snippet */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                  Engine Code Hook
                </span>
                <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                  TypeScript / MV3
                </span>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-normal">
                <code>{selectedNode.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
