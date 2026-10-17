import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Filter,
  Route,
  BookOpen,
  MapPin,
  X,
  Users,
  Compass,
  ChevronRight,
  Info,
  Network,
  GitBranch,
} from 'lucide-react';
import {
  BIBLICAL_PEOPLE,
  BIBLICAL_RELATIONSHIPS,
  BIBLICAL_ERAS,
} from '../data/biblicalPeople';
import type { BiblicalPerson } from '../data/biblicalPeople';
import { ForceGraphSimulation } from '../utils/graphEngine';
import type { GraphNode } from '../utils/graphEngine';
import { GenerationalTree } from './GenerationalTree';
import { TimelineSlider } from './TimelineSlider';

interface PeopleGraphProps {
  onNavigateToScripture: (book: string, chapter: number, verse?: number) => void;
  onNavigateToLocation: (locationId: string) => void;
  selectedPersonId?: string | null;
  onSelectPerson?: (personId: string | null) => void;
  theme: 'dark' | 'light';
  currentEraOrder: number;
  onEraChange: (eraOrder: number) => void;
}

export const PeopleGraph: React.FC<PeopleGraphProps> = ({
  onNavigateToScripture,
  onNavigateToLocation,
  selectedPersonId: propSelectedPersonId,
  onSelectPerson,
  theme,
  currentEraOrder,
  onEraChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // View Mode: 360° Network Graph vs Pedigree Generational Tree
  const [viewMode, setViewMode] = useState<'graph' | 'tree'>('graph');

  // Filters
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [selectedRelType, setSelectedRelType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pathfinding state
  const [pathfindingMode, setPathfindingMode] = useState<boolean>(false);
  const [pathStartId, setPathStartId] = useState<string>('adam');
  const [pathEndId, setPathEndId] = useState<string>('jesus');
  const [highlightedPath, setHighlightedPath] = useState<string[] | null>(null);

  // Legend visibility state
  const [showLegend, setShowLegend] = useState<boolean>(false);

  // Selected person
  const [activePerson, setActivePerson] = useState<BiblicalPerson | null>(null);

  // Camera viewport
  const cameraRef = useRef<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1 });
  const isDraggingCamera = useRef<boolean>(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const draggedNode = useRef<GraphNode | null>(null);
  const hoveredNode = useRef<GraphNode | null>(null);

  // Graph Simulation instance
  const simulationRef = useRef<ForceGraphSimulation | null>(null);

  // Filtered dataset (strictly bounded by currentEraOrder)
  const filteredData = useMemo(() => {
    let people = BIBLICAL_PEOPLE.filter((p) => p.eraOrder <= currentEraOrder);
    if (selectedEra !== 'All') {
      people = people.filter((p) => p.era === selectedEra);
    }
    const peopleIds = new Set(people.map((p) => p.id));

    let rels = BIBLICAL_RELATIONSHIPS.filter(
      (r) => peopleIds.has(r.source) && peopleIds.has(r.target)
    );
    if (selectedRelType !== 'All') {
      rels = rels.filter((r) => r.type === selectedRelType);
    }

    return { people, rels };
  }, [currentEraOrder, selectedEra, selectedRelType]);

  // Sync prop selected person
  useEffect(() => {
    if (propSelectedPersonId) {
      const p = BIBLICAL_PEOPLE.find((item) => item.id === propSelectedPersonId);
      if (p) {
        setActivePerson(p);
        // Center camera on node
        setTimeout(() => {
          const sim = simulationRef.current;
          if (sim) {
            const node = sim.nodeMap.get(p.id);
            if (node && canvasRef.current) {
              cameraRef.current = {
                x: canvasRef.current.width / 2 - node.x,
                y: canvasRef.current.height / 2 - node.y,
                zoom: 1.2,
              };
            }
          }
        }, 100);
      }
    }
  }, [propSelectedPersonId]);

  // Pathfinding calculation
  useEffect(() => {
    if (pathfindingMode && simulationRef.current && pathStartId && pathEndId) {
      const path = simulationRef.current.findShortestPath(pathStartId, pathEndId);
      setHighlightedPath(path);
    } else {
      setHighlightedPath(null);
    }
  }, [pathfindingMode, pathStartId, pathEndId]);

  // Canvas size & Simulation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const sim = new ForceGraphSimulation(filteredData.people, filteredData.rels, width, height);
    simulationRef.current = sim;

    // Reset camera to center
    cameraRef.current = { x: 0, y: 0, zoom: 0.95 };

    let animId: number;

    const render = () => {
      sim.tick();

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Background
        const isDark = theme === 'dark';
        ctx.fillStyle = isDark ? '#09090b' : '#f9fafb';
        ctx.fillRect(0, 0, width, height);

        // Apply Camera Transform
        ctx.save();
        ctx.translate(cameraRef.current.x, cameraRef.current.y);
        ctx.scale(cameraRef.current.zoom, cameraRef.current.zoom);

        // Draw Architectural Grid
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        const startX = -cameraRef.current.x / cameraRef.current.zoom;
        const startY = -cameraRef.current.y / cameraRef.current.zoom;
        const endX = startX + width / cameraRef.current.zoom;
        const endY = startY + height / cameraRef.current.zoom;

        for (let gx = Math.floor(startX / gridSize) * gridSize; gx <= endX; gx += gridSize) {
          ctx.beginPath();
          ctx.moveTo(gx, startY);
          ctx.lineTo(gx, endY);
          ctx.stroke();
        }
        for (let gy = Math.floor(startY / gridSize) * gridSize; gy <= endY; gy += gridSize) {
          ctx.beginPath();
          ctx.moveTo(startX, gy);
          ctx.lineTo(endX, gy);
          ctx.stroke();
        }

        // Draw Edges
        const activeNodeId = activePerson?.id;
        const hoveredNodeId = hoveredNode.current?.id;
        const pathSet = highlightedPath ? new Set(highlightedPath) : null;

        for (const edge of sim.edges) {
          const s = sim.nodeMap.get(edge.source);
          const t = sim.nodeMap.get(edge.target);
          if (!s || !t) continue;

          let isHighlighted = false;
          let isPathEdge = false;

          if (pathSet && pathSet.has(edge.source) && pathSet.has(edge.target)) {
            const idx1 = highlightedPath!.indexOf(edge.source);
            const idx2 = highlightedPath!.indexOf(edge.target);
            if (Math.abs(idx1 - idx2) === 1) {
              isPathEdge = true;
            }
          }

          if (
            (activeNodeId && (edge.source === activeNodeId || edge.target === activeNodeId)) ||
            (hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId))
          ) {
            isHighlighted = true;
          }

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);

          if (isPathEdge) {
            ctx.strokeStyle = isDark ? '#ffffff' : '#09090b';
            ctx.lineWidth = 3.5;
            ctx.setLineDash([]);
          } else if (isHighlighted) {
            ctx.strokeStyle = isDark ? '#e4e4e7' : '#27272a';
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
          } else {
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
            ctx.lineWidth = 1;
            if (edge.type === 'rivalry') {
              ctx.setLineDash([4, 4]);
            } else if (edge.type === 'alliance') {
              ctx.setLineDash([2, 2]);
            } else {
              ctx.setLineDash([]);
            }
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Edge Label on highlight
          if (isHighlighted || isPathEdge) {
            const midX = (s.x + t.x) / 2;
            const midY = (s.y + t.y) / 2;
            ctx.font = '10px Inter, sans-serif';
            ctx.fillStyle = isDark ? '#a1a1aa' : '#52525b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(edge.label, midX, midY - 6);
          }
        }

        // Draw Nodes
        for (const node of sim.nodes) {
          const isSelected = activeNodeId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isInPath = pathSet ? pathSet.has(node.id) : false;
          const isConnected =
            activeNodeId &&
            sim.edges.some(
              (e) =>
                (e.source === activeNodeId && e.target === node.id) ||
                (e.target === activeNodeId && e.source === node.id)
            );

          // Node Base Circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

          if (isSelected || isInPath) {
            ctx.fillStyle = isDark ? '#ffffff' : '#09090b';
          } else if (isHovered || isConnected) {
            ctx.fillStyle = isDark ? '#3f3f46' : '#e4e4e7';
          } else {
            ctx.fillStyle = isDark ? '#18181b' : '#ffffff';
          }
          ctx.fill();

          // Border Ring
          ctx.lineWidth = isSelected || isInPath ? 3 : 1.5;
          ctx.strokeStyle = isDark ? '#ffffff' : '#09090b';
          if (isSelected) {
            ctx.shadowColor = isDark ? '#ffffff' : '#000000';
            ctx.shadowBlur = 12;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Inner Icon / Initial
          ctx.font = `600 ${node.radius * 0.75}px 'Cinzel', serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isSelected || isInPath ? (isDark ? '#09090b' : '#ffffff') : isDark ? '#f4f4f5' : '#18181b';
          ctx.fillText(node.name[0], node.x, node.y + 1);

          // Name Label below
          ctx.font = `${node.importance === 1 ? '600 12px' : '400 11px'} Inter, sans-serif`;
          ctx.fillStyle = isDark ? '#f4f4f5' : '#18181b';
          ctx.fillText(node.name, node.x, node.y + node.radius + 14);

          // Role subtext (for importance 1 or hovered/selected)
          if (isSelected || isHovered || node.importance === 1) {
            ctx.font = '10px Inter, sans-serif';
            ctx.fillStyle = isDark ? '#a1a1aa' : '#71717a';
            ctx.fillText(node.role.split('/')[0].trim(), node.x, node.y + node.radius + 26);
          }
        }

        ctx.restore();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [filteredData, theme, activePerson, highlightedPath]);

  // Handle Mouse Events: Pan, Zoom, Drag, Click
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !simulationRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert screen coordinates to world coordinates
    const worldX = (mouseX - cameraRef.current.x) / cameraRef.current.zoom;
    const worldY = (mouseY - cameraRef.current.y) / cameraRef.current.zoom;

    // Check if clicked a node
    let clicked: GraphNode | null = null;
    for (const node of simulationRef.current.nodes) {
      const dx = node.x - worldX;
      const dy = node.y - worldY;
      if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
        clicked = node;
        break;
      }
    }

    if (clicked) {
      draggedNode.current = clicked;
      setActivePerson(clicked.person);
      if (onSelectPerson) onSelectPerson(clicked.person.id);
    } else {
      isDraggingCamera.current = true;
      dragStartPos.current = { x: mouseX - cameraRef.current.x, y: mouseY - cameraRef.current.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !simulationRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (draggedNode.current) {
      const worldX = (mouseX - cameraRef.current.x) / cameraRef.current.zoom;
      const worldY = (mouseY - cameraRef.current.y) / cameraRef.current.zoom;
      draggedNode.current.x = worldX;
      draggedNode.current.y = worldY;
      draggedNode.current.vx = 0;
      draggedNode.current.vy = 0;
      simulationRef.current.restart();
    } else if (isDraggingCamera.current) {
      cameraRef.current.x = mouseX - dragStartPos.current.x;
      cameraRef.current.y = mouseY - dragStartPos.current.y;
    } else {
      // Hover detection
      const worldX = (mouseX - cameraRef.current.x) / cameraRef.current.zoom;
      const worldY = (mouseY - cameraRef.current.y) / cameraRef.current.zoom;
      let hovered: GraphNode | null = null;
      for (const node of simulationRef.current.nodes) {
        const dx = node.x - worldX;
        const dy = node.y - worldY;
        if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
          hovered = node;
          break;
        }
      }
      hoveredNode.current = hovered;
      canvas.style.cursor = hovered ? 'pointer' : 'grab';
    }
  };

  const handleMouseUp = () => {
    draggedNode.current = null;
    isDraggingCamera.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.3, Math.min(3.5, cameraRef.current.zoom * zoomFactor));

    cameraRef.current.x = mouseX - (mouseX - cameraRef.current.x) * (newZoom / cameraRef.current.zoom);
    cameraRef.current.y = mouseY - (mouseY - cameraRef.current.y) * (newZoom / cameraRef.current.zoom);
    cameraRef.current.zoom = newZoom;
  };

  // Center & Reset View
  const handleResetCamera = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    cameraRef.current = {
      x: canvas.width / (2 * window.devicePixelRatio) - 400,
      y: canvas.height / (2 * window.devicePixelRatio) - 300,
      zoom: 0.95,
    };
  };

  // Direct Connections of Active Person
  const activeRelationships = useMemo(() => {
    if (!activePerson) return [];
    return BIBLICAL_RELATIONSHIPS.filter(
      (r) => r.source === activePerson.id || r.target === activePerson.id
    ).map((r) => {
      const isSource = r.source === activePerson.id;
      const otherId = isSource ? r.target : r.source;
      const otherPerson = BIBLICAL_PEOPLE.find((p) => p.id === otherId);
      return {
        ...r,
        otherPerson,
        displayLabel: r.label,
      };
    });
  }, [activePerson]);

  // Jump camera to person from search
  const handleSelectSearchedPerson = (personId: string) => {
    const p = BIBLICAL_PEOPLE.find((item) => item.id === personId);
    if (!p) return;
    setActivePerson(p);
    setSearchQuery('');
    const sim = simulationRef.current;
    if (sim && canvasRef.current) {
      const node = sim.nodeMap.get(p.id);
      if (node) {
        cameraRef.current = {
          x: canvasRef.current.width / (2 * window.devicePixelRatio) - node.x * 1.2,
          y: canvasRef.current.height / (2 * window.devicePixelRatio) - node.y * 1.2,
          zoom: 1.2,
        };
      }
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-neutral-950 flex flex-col">

      {/* ── View Mode Toggle + Timeline Slider bar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-neutral-950/95 border-b border-neutral-800 z-20 shrink-0">
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
              viewMode === 'graph'
                ? 'bg-neutral-100 text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-neutral-100'
            }`}
            title="360° Force-Directed Network Graph"
          >
            <Network className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Network Graph</span>
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
              viewMode === 'tree'
                ? 'bg-neutral-100 text-neutral-950 font-semibold'
                : 'text-neutral-400 hover:text-neutral-100'
            }`}
            title="Pedigree Generational Tree"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generational Tree</span>
          </button>
        </div>

        {/* Compact Timeline Slider inline */}
        <div className="flex-1 max-w-2xl">
          <TimelineSlider
            currentEraOrder={currentEraOrder}
            onEraChange={onEraChange}
            revealedCountText={`${filteredData.people.length} Figures`}
          />
        </div>
      </div>

      {/* ── Generational Tree View ── */}
      {viewMode === 'tree' && (
        <div className="flex-1 overflow-hidden">
          <GenerationalTree
            currentEraOrder={currentEraOrder}
            onNavigateToScripture={onNavigateToScripture}
            onNavigateToLocation={onNavigateToLocation}
            onSelectPerson={(id) => {
              setViewMode('graph');
              handleSelectSearchedPerson(id);
              if (onSelectPerson) onSelectPerson(id);
            }}
            onSwitchToGraphView={(id) => {
              setViewMode('graph');
              if (id) handleSelectSearchedPerson(id);
            }}
          />
        </div>
      )}

      {/* ── Network Graph View ── */}
      {viewMode === 'graph' && (
        <div ref={containerRef} className="relative flex-1 overflow-hidden">
          {/* Top Floating Control Toolbar */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-2rem)]">
        {/* Era Filter Selector */}
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg p-1 flex items-center gap-1 shadow-lg text-xs">
          <span className="text-[10px] font-mono uppercase text-neutral-400 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Era:
          </span>
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-neutral-200 py-1 px-2 rounded focus:outline-none text-xs"
          >
            <option value="All">All Eras (80+ figures)</option>
            {BIBLICAL_ERAS.map((era) => (
              <option key={era} value={era}>
                {era}
              </option>
            ))}
          </select>
        </div>

        {/* Relationship Filter */}
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg p-1 flex items-center gap-1 shadow-lg text-xs">
          <span className="text-[10px] font-mono uppercase text-neutral-400 px-2">Type:</span>
          <select
            value={selectedRelType}
            onChange={(e) => setSelectedRelType(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-neutral-200 py-1 px-2 rounded focus:outline-none text-xs"
          >
            <option value="All">All Relations</option>
            <option value="parent-child">Lineage & Family</option>
            <option value="spouse">Spousal</option>
            <option value="sibling">Siblings</option>
            <option value="mentor-disciple">Mentorship & Disciples</option>
            <option value="alliance">Covenant & Ministry</option>
            <option value="rivalry">Rivalry & Conflict</option>
          </select>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Find character..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 sm:w-48 pl-7 pr-3 py-1.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 shadow-lg"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
          {searchQuery && (
            <div className="absolute top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-md shadow-2xl z-30">
              {BIBLICAL_PEOPLE.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectSearchedPerson(p.id)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-800 text-neutral-200 flex items-center justify-between"
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-[10px] text-neutral-400 truncate max-w-[90px]">
                    {p.era.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connection Pathfinder Button */}
        <button
          onClick={() => setPathfindingMode(!pathfindingMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium backdrop-blur-md shadow-lg transition ${
            pathfindingMode
              ? 'bg-neutral-100 text-neutral-950 border-neutral-100 font-semibold'
              : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:text-neutral-100'
          }`}
          title="Calculate relational path connecting any two biblical figures"
        >
          <Route className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pathfinder</span>
        </button>

        {/* Graph Legend Button */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium backdrop-blur-md shadow-lg transition ${
            showLegend
              ? 'bg-neutral-100 text-neutral-950 border-neutral-100 font-semibold'
              : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:text-neutral-100'
          }`}
          title="Explain dots and connecting lines"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Legend</span>
        </button>
      </div>

      {/* Visual Relationship Legend (Explains dots and lines) */}
      {showLegend && (
        <div className="absolute top-16 right-4 sm:right-auto sm:left-4 z-20 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 p-4 rounded-xl shadow-2xl max-w-xs text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-200 font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>Network Graph Legend</span>
            </div>
            <button
              onClick={() => setShowLegend(false)}
              className="text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Explanation */}
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-neutral-400 block font-semibold">
              Dots = Biblical Characters
            </span>
            <div className="flex items-center gap-2 text-[11px] text-neutral-300">
              <div className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-950 font-bold font-heading text-[10px] flex items-center justify-center shrink-0">
                A
              </div>
              <span>Large Dots: Pivotal Figures (Adam, Abraham, David, Jesus)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-300">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-600 text-neutral-300 font-bold font-heading text-[8px] flex items-center justify-center shrink-0">
                S
              </div>
              <span>Medium / Small: Lineage Generations & Disciples</span>
            </div>
          </div>

          {/* Lines Explanation */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <span className="font-mono text-[10px] uppercase text-neutral-400 block font-semibold">
              Lines = Biblical Relationships
            </span>
            <div className="flex items-center gap-2 text-[11px] text-neutral-300">
              <div className="w-6 h-0.5 bg-neutral-100 shrink-0" />
              <span>Solid Line: Direct Lineage / Family / Spouses</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-300">
              <div className="w-6 h-0.5 border-t-2 border-dotted border-neutral-300 shrink-0" />
              <span>Dotted Line: Mentorship & Apostleship</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-300">
              <div className="w-6 h-0.5 border-t-2 border-dashed border-neutral-400 shrink-0" />
              <span>Dashed Line: Covenant Friendship / Allies</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-300">
              <div className="w-6 h-0.5 border-t border-neutral-600 shrink-0" />
              <span>Thin Line: Secondary Biblical Connections</span>
            </div>
          </div>

          <p className="text-[10px] text-neutral-500 italic pt-1 border-t border-neutral-800">
            Tip: Hover over any line or dot to reveal the relationship label and highlight connected figures.
          </p>
        </div>
      )}

      {/* Connection Pathfinder Bar (when active) */}
      {pathfindingMode && (
        <div className="absolute top-16 left-4 z-20 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 p-3 rounded-lg shadow-2xl flex flex-wrap items-center gap-3 text-xs max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-neutral-400">From:</span>
            <select
              value={pathStartId}
              onChange={(e) => setPathStartId(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-200 text-xs"
            >
              {BIBLICAL_PEOPLE.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-neutral-400">To:</span>
            <select
              value={pathEndId}
              onChange={(e) => setPathEndId(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-200 text-xs"
            >
              {BIBLICAL_PEOPLE.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {highlightedPath ? (
            <div className="w-full pt-1 border-t border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5 flex-wrap">
              <span className="text-neutral-500">Path ({highlightedPath.length} steps):</span>
              {highlightedPath.map((id, idx) => {
                const p = BIBLICAL_PEOPLE.find((item) => item.id === id);
                return (
                  <span key={id} className="flex items-center gap-1">
                    <span className="text-white font-semibold">{p?.name || id}</span>
                    {idx < highlightedPath.length - 1 && <span className="text-neutral-600">&rarr;</span>}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="w-full pt-1 border-t border-neutral-800 text-[11px] text-neutral-500">
              No direct path found within current filters.
            </div>
          )}
        </div>
      )}

      {/* Camera Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-1 rounded-lg shadow-xl">
        <button
          onClick={() => {
            cameraRef.current.zoom = Math.min(3.5, cameraRef.current.zoom * 1.25);
          }}
          className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            cameraRef.current.zoom = Math.max(0.3, cameraRef.current.zoom * 0.8);
          }}
          className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition"
          title="Fit & Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block select-none"
      />

      {/* Slide-over Inspector Drawer for Selected Person */}
      {activePerson && (
        <aside className="absolute top-0 right-0 z-30 w-full sm:w-96 h-full bg-neutral-950/95 backdrop-blur-md border-l border-neutral-800 p-6 flex flex-col overflow-y-auto shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                {activePerson.era}
              </span>
              <h2 className="font-heading text-2xl font-bold text-neutral-100 mt-0.5">
                {activePerson.name}
              </h2>
              {activePerson.hebrewGreek && (
                <div className="text-xs font-serif text-neutral-400 mt-0.5">
                  {activePerson.hebrewGreek}{' '}
                  {activePerson.meaning && (
                    <span className="italic font-sans text-neutral-500">
                      ({activePerson.meaning})
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setActivePerson(null)}
              className="p-1 text-neutral-400 hover:text-neutral-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role badge */}
          <div className="mt-4">
            <span className="inline-block px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-200">
              {activePerson.role}
            </span>
          </div>

          {/* Summary */}
          <div className="mt-4">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Biblical Profile
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {activePerson.summary}
            </p>
          </div>

          {/* Key Scripture References (Clickable to jump to reader) */}
          <div className="mt-5">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
              <span>Key Scripture References</span>
            </h3>
            <div className="space-y-1.5">
              {activePerson.verses.map((vRef, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const match = vRef.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)/);
                    if (match) {
                      const book = match[1].trim();
                      const chapter = parseInt(match[2]);
                      onNavigateToScripture(book, chapter);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition flex items-center justify-between text-xs text-neutral-200 group"
                >
                  <span className="font-mono">{vRef}</span>
                  <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300 flex items-center gap-1">
                    Read <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Associated Locations (Clickable to jump to Map) */}
          {activePerson.places.length > 0 && (
            <div className="mt-5">
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Geographic Locations</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {activePerson.places.map((placeId) => (
                  <button
                    key={placeId}
                    onClick={() => onNavigateToLocation(placeId)}
                    className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-200 capitalize transition flex items-center gap-1"
                  >
                    <span>{placeId.replace('-', ' ')}</span>
                    <Compass className="w-3 h-3 text-neutral-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct Relationships */}
          <div className="mt-5 flex-1">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>Direct Connections ({activeRelationships.length})</span>
            </h3>
            <div className="space-y-1.5">
              {activeRelationships.map((rel, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (rel.otherPerson) {
                      setActivePerson(rel.otherPerson);
                      handleSelectSearchedPerson(rel.otherPerson.id);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/80 hover:border-neutral-700 transition flex items-center justify-between text-xs text-neutral-200"
                >
                  <div>
                    <div className="font-semibold">{rel.otherPerson?.name || 'Unknown'}</div>
                    <div className="text-[10px] text-neutral-400">{rel.displayLabel}</div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                    {rel.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}
        </div>
      )}
    </div>
  );
};
