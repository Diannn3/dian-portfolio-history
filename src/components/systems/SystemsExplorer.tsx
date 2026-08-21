import { useState } from 'react';

interface SystemDomain {
  id: string;
  tag: string;
  name: string;
  category: string;
  metric: string;
  metricLabel: string;
  complexity: string;
  invariant: string;
  description: string;
  codeSnippet: string;
  keyPoints: string[];
}

const domains: SystemDomain[] = [
  {
    id: 'distributed',
    tag: '01 // SYSTEMS',
    name: 'Edge-First Distributed Systems',
    category: 'Architecture',
    metric: '< 80ms',
    metricLabel: 'Edge Global P95 TTFB',
    complexity: 'O(1) Cache Lookup',
    invariant: 'Zero runtime JS database dependencies on public edge routes',
    description:
      'Designing distributed web applications with strict state isolation, serverless edge compute, Row Level Security (RLS), and zero unneeded background workers.',
    codeSnippet: `// Edge State & Security Isolation Pattern
export async function handleEdgeRequest(req: Request, env: Env): Promise<Response> {
  const cache = caches.default;
  const cachedResponse = await cache.match(req);
  if (cachedResponse) return cachedResponse;

  const tenant = validateTenantToken(req.headers.get('Authorization'));
  const payload = await fetchIsolatedState(env.DB_POOL, tenant.id);
  
  const response = new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  });

  await cache.put(req, response.clone());
  return response;
}`,
    keyPoints: [
      'Edge CDN stale-while-revalidate caching',
      'PostgreSQL Row-Level Security (RLS) enforcement',
      'Strict typed schema validation with zero runtime bloat'
    ]
  },
  {
    id: 'math',
    tag: '02 // MATHEMATICS',
    name: 'Discrete Graph & Isochrone Modeling',
    category: 'Algorithms',
    metric: 'A* Heuristic',
    metricLabel: 'Directed Graph Routing',
    complexity: 'O(E + V log V)',
    invariant: 'Continuous travel vectors discretized into topological graph nodes',
    description:
      'Applying discrete mathematics to real-world navigation and food delivery discovery: vertical staircase cost penalties, polygonal isochrone hulls, and multi-variable optimization.',
    codeSnippet: `// Topological 3D Wayfinding Distance Metric
function computeMultiFloorHeuristic(
  curr: Node3D,
  goal: Node3D,
  verticalPenaltyWeight = 1.45
): number {
  const dx = Math.abs(curr.x - goal.x);
  const dy = Math.abs(curr.y - goal.y);
  const dz = Math.abs(curr.floor - goal.floor);
  
  // Floor transitions incur non-linear stair/elevator traversal latency
  return Math.sqrt(dx * dx + dy * dy) + dz * verticalPenaltyWeight * 12.5;
}`,
    keyPoints: [
      'Topological indoor graph traversal with vertical cost weighting',
      'Convex hull and isochrone polygons for transit time boundaries',
      'Deterministic heuristic convergence without network latency'
    ]
  },
  {
    id: 'spatial',
    tag: '03 // SPATIAL',
    name: 'Spatial Computing & Computer Vision',
    category: 'WebGL & Workers',
    metric: '60 FPS',
    metricLabel: 'Zero-Frame Drop Guarantee',
    complexity: 'O(N) Tensor Landmarks',
    invariant: 'Heavy inference isolated in Web Workers to protect the UI thread',
    description:
      'Building web-based spatial interfaces with Three.js / R3F and real-time hand-tracking. Heavy camera landmark inference is offloaded to Web Workers using SharedArrayBuffers.',
    codeSnippet: `// Web Worker Vision Inference Pipeline
const visionWorker = new Worker('/workers/mediapipe-hand.js', { type: 'module' });

visionWorker.onmessage = (e: MessageEvent<HandLandmarkBuffer>) => {
  const { landmarks, gestureType, confidence } = e.data;
  if (confidence > 0.85) {
    // Transform normalized 2D camera coordinates into 3D world rays
    holographicRaycaster.updateFromGesture(landmarks, gestureType);
    renderer.invalidate(); // Demand-driven frame render
  }
};`,
    keyPoints: [
      'Three.js demand rendering (zero GPU frames when stationary)',
      '21-landmark MediaPipe tensor analysis inside dedicated Web Worker',
      'Holographic raycasting with velocity smoothing and deadband damping'
    ]
  },
  {
    id: 'agents',
    tag: '04 // AGENTS',
    name: 'Autonomous AI Agent Loops (MCP)',
    category: 'Context & Tooling',
    metric: '100% Deterministic',
    metricLabel: 'Tool Verification Pipeline',
    complexity: 'ReAct Loop Engine',
    invariant: 'Context engineering with explicit tool schemas and strict verification tests',
    description:
      'Architecting multi-agent systems via the Model Context Protocol (MCP). Combining tool calling, automated verification loops, and context compaction for error-free execution.',
    codeSnippet: `// ReAct Verification & Tool Dispatch Loop
export async function executeAgentLoop(
  prompt: string,
  tools: Map<string, MCPTool>
): Promise<ExecutionSummary> {
  const context = new ContextEngine({ maxTokens: 32000 });
  context.pushMessage({ role: 'user', content: prompt });

  while (!context.isTerminal()) {
    const action = await model.predictToolCall(context.getCompactedHistory());
    if (action.isDone) break;

    const tool = tools.get(action.toolName);
    const result = await tool.execute(action.parameters);
    
    // Validate output invariants before committing to state
    await runUnitVerification(result);
    context.pushToolResponse(action.id, result);
  }
  return context.synthesizeSummary();
}`,
    keyPoints: [
      'Model Context Protocol (MCP) server & client architectures',
      'Automated test validation before persisting agent actions',
      'Token-efficient context compaction and deterministic execution loops'
    ]
  }
];

export default function SystemsExplorer() {
  const [activeTab, setActiveTab] = useState<string>('distributed');
  const activeDomain = domains.find((d) => d.id === activeTab) || domains[0];

  return (
    <div className="w-full bg-[#050607] border border-[#22262B] rounded-xl overflow-hidden shadow-2xl">
      {/* Domain Selection Header Tabs */}
      <div className="flex flex-wrap border-b border-[#22262B] bg-[#101214]/90 backdrop-blur-md">
        {domains.map((domain) => {
          const isActive = domain.id === activeTab;
          return (
            <button
              key={domain.id}
              onClick={() => setActiveTab(domain.id)}
              className={`flex-1 min-w-[200px] py-4 px-6 text-left transition-all duration-200 border-r border-[#22262B] last:border-r-0 focus:outline-none ${
                isActive
                  ? 'bg-[#050607] text-[#8EBBC8] border-b-2 border-b-[#8EBBC8]'
                  : 'text-[#8C9296] hover:text-[#F5F5F7] hover:bg-[#181B1E]'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#666B6E]">
                {domain.tag}
              </div>
              <div className="font-display font-bold text-sm text-[#F5F5F7] mt-0.5">
                {domain.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Domain Telemetry & Details Grid */}
      <div className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Specs & Architectural Invariants */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-[#181B1E] border border-[#22262B] text-[#8EBBC8] font-mono text-[11px] uppercase tracking-wider rounded">
              {activeDomain.category}
            </span>
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-[#F5F5F7] tracking-tight">
              {activeDomain.name}
            </h3>
            <p className="font-body text-sm text-[#8C9296] leading-relaxed pt-1">
              {activeDomain.description}
            </p>
          </div>

          {/* Telemetry Badges Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-[#101214] border border-[#22262B] rounded-lg">
              <div className="font-mono text-[10px] text-[#666B6E] uppercase">
                {activeDomain.metricLabel}
              </div>
              <div className="font-mono text-lg font-bold text-[#8EBBC8] mt-1">
                {activeDomain.metric}
              </div>
            </div>

            <div className="p-3.5 bg-[#101214] border border-[#22262B] rounded-lg">
              <div className="font-mono text-[10px] text-[#666B6E] uppercase">Complexity</div>
              <div className="font-mono text-sm font-bold text-[#C8CDD0] mt-1">
                {activeDomain.complexity}
              </div>
            </div>
          </div>

          {/* Architectural Invariant Rule */}
          <div className="p-4 bg-[#101214] border-l-2 border-[#8EBBC8] border-y border-r border-[#22262B] rounded-r-lg space-y-1">
            <div className="font-mono text-[10px] text-[#8EBBC8] uppercase tracking-wider font-bold">
              SYSTEM INVARIANT
            </div>
            <div className="font-mono text-xs text-[#8C9296] leading-relaxed">
              {activeDomain.invariant}
            </div>
          </div>

          {/* Key Principles List */}
          <div className="space-y-2 pt-2">
            <div className="font-mono text-xs font-bold text-[#F5F5F7] uppercase tracking-wider">
              Key Engineering Anchors
            </div>
            <ul className="space-y-1.5 font-body text-xs text-[#8C9296]">
              {activeDomain.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#8EBBC8] font-mono">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Code Implementation Schema */}
        <div className="lg:col-span-7 bg-[#0A0C0E] border border-[#22262B] rounded-lg overflow-hidden flex flex-col shadow-inner">
          <div className="px-4 py-2.5 bg-[#101214] border-b border-[#22262B] flex items-center justify-between font-mono text-[11px] text-[#8C9296]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C]/80 inline-block"></span>
              <span className="text-[#C8CDD0]">implementation_spec.ts</span>
            </div>
            <span className="text-[10px] text-[#666B6E]">STRICT_TS_V5</span>
          </div>
          <div className="p-5 overflow-x-auto font-mono text-xs text-[#8EBBC8] leading-relaxed max-h-[380px] select-text">
            <pre className="text-[#F5F5F7]/90 font-mono text-[11.5px] leading-6">
              <code>{activeDomain.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
