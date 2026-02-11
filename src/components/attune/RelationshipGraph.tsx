import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Users } from 'lucide-react';
import type { Person, ConnectionType } from '@/types/database';
import type { ConnectionWithPeople } from '@/services/connections';

interface RelationshipGraphProps {
  people: Person[];
  connections: ConnectionWithPeople[];
  onPersonClick?: (person: Person) => void;
  onPersonDoubleClick?: (person: Person) => void;
  selectedPersonId?: string | null;
  className?: string;
}

interface Node {
  id: string;
  name: string;
  group: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  fixed?: boolean;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  notes?: string | null;
}

const groupColors: Record<string, string> = {
  work: '#818cf8',      // Indigo
  family: '#f472b6',    // Pink
  friends: '#34d399',   // Green
  acquaintances: '#fbbf24', // Amber
  you: '#a855f7',       // Purple
};

const connectionTypeStyles: Record<ConnectionType, { color: string; dashArray: string; width: number }> = {
  knows: { color: '#6b7280', dashArray: 'none', width: 2 },
  works_with: { color: '#818cf8', dashArray: '8 4', width: 2.5 },
  related_to: { color: '#f472b6', dashArray: 'none', width: 3 },
};

export default function RelationshipGraph({
  people,
  connections,
  onPersonClick,
  onPersonDoubleClick,
  selectedPersonId,
  className = '',
}: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Convert connections to edges
  const edges: Edge[] = useMemo(() => {
    return connections.map((conn) => ({
      id: conn.id,
      source: conn.person_a_id,
      target: conn.person_b_id,
      type: conn.connection_type,
      notes: conn.notes,
    }));
  }, [connections]);

  // Orbital ring configuration for Circle of Influence
  // Each group has its own orbit ring at a specific distance from center
  const orbitalRings: Record<string, { distance: number; label: string }> = {
    work: { distance: 55, label: 'Work' },           // Innermost ring
    family: { distance: 90, label: 'Family' },       // Second ring
    friends: { distance: 125, label: 'Friends' },    // Third ring
    acquaintances: { distance: 160, label: 'Outer' }, // Outermost ring
  };

  // Initialize nodes with orbital positions
  useEffect(() => {
    if (people.length === 0) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Create "You" node at center
    const youNode: Node = {
      id: 'you',
      name: 'You',
      group: 'you',
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 22,
      fixed: true,
    };

    // Group people by their group
    const grouped = people.reduce((acc, person) => {
      if (!acc[person.group]) acc[person.group] = [];
      acc[person.group].push(person);
      return acc;
    }, {} as Record<string, Person[]>);

    const personNodes: Node[] = people.map((person) => {
      const ringInfo = orbitalRings[person.group] || { distance: 150 };
      const groupPeople = grouped[person.group] || [];
      const indexInGroup = groupPeople.findIndex((p) => p.id === person.id);
      const totalInGroup = groupPeople.length;

      // Distribute evenly around the ring with some randomness
      const baseAngle = (2 * Math.PI * indexInGroup) / Math.max(totalInGroup, 1);
      const angleOffset = (Math.random() - 0.5) * 0.3; // Small random offset
      const angle = baseAngle + angleOffset;

      // Add slight distance variation to prevent overlap
      const distanceVariation = (Math.random() - 0.5) * 15;
      const distance = ringInfo.distance + distanceVariation;

      return {
        id: person.id,
        name: person.name,
        group: person.group,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: 14, // Smaller to fit in constrained widget
      };
    });

    setNodes([youNode, ...personNodes]);
  }, [people, dimensions]);

  // Force simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const simulate = () => {
      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((node) => ({ ...node }));
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;

        // Apply forces
        for (let i = 0; i < newNodes.length; i++) {
          const node = newNodes[i];
          if (node.fixed || node.id === draggedNode) continue;

          // Center gravity (very weak for slow movement)
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * 0.0003;
          node.vy += dy * 0.0003;

          // Repulsion from other nodes
          for (let j = 0; j < newNodes.length; j++) {
            if (i === j) continue;
            const other = newNodes[j];
            const ddx = node.x - other.x;
            const ddy = node.y - other.y;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
            const minDist = node.radius + other.radius + 15;

            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.15;
              node.vx += ddx * force;
              node.vy += ddy * force;
            }
          }

          // Attraction along edges
          edges.forEach((edge) => {
            if (edge.source === node.id || edge.target === node.id) {
              const otherId = edge.source === node.id ? edge.target : edge.source;
              const other = newNodes.find((n) => n.id === otherId);
              if (other) {
                const ddx = other.x - node.x;
                const ddy = other.y - node.y;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
                const idealDist = 80;
                const force = (dist - idealDist) * 0.003;
                node.vx += (ddx / dist) * force;
                node.vy += (ddy / dist) * force;
              }
            }
          });

          // Apply velocity with strong damping for slow, smooth movement
          node.x += node.vx;
          node.y += node.vy;
          node.vx *= 0.95;
          node.vy *= 0.95;

          // Boundary constraints
          const padding = node.radius + 10;
          node.x = Math.max(padding, Math.min(dimensions.width - padding, node.x));
          node.y = Math.max(padding, Math.min(dimensions.height - padding, node.y));
        }

        return newNodes;
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes.length, edges, draggedNode, dimensions]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle node drag
  const handleMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedNode(nodeId);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedNode || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    setNodes((prev) =>
      prev.map((node) =>
        node.id === draggedNode
          ? { ...node, x, y, vx: 0, vy: 0 }
          : node
      )
    );
  }, [isDragging, draggedNode, pan, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedNode(null);
  }, []);

  // Get node by ID
  const getNode = useCallback((id: string) => nodes.find((n) => n.id === id), [nodes]);

  // Check if node is connected to hovered/selected node
  const isHighlighted = useCallback((nodeId: string) => {
    const highlightId = hoveredNode || selectedPersonId;
    if (!highlightId) return false;
    if (nodeId === highlightId) return true;
    return edges.some(
      (e) =>
        (e.source === highlightId && e.target === nodeId) ||
        (e.target === highlightId && e.source === nodeId)
    );
  }, [hoveredNode, selectedPersonId, edges]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  if (people.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Users className="w-16 h-16 text-foreground/20 mb-4" />
        <p className="text-foreground/50 text-sm">Add people to see your relationship graph</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-foreground/70" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-foreground/70" />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Reset view"
        >
          <Maximize2 className="w-4 h-4 text-foreground/70" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1 text-[10px]">
        {Object.entries(groupColors).filter(([k]) => k !== 'you').map(([group, color]) => (
          <div key={group} className="flex items-center gap-0.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-foreground/50 capitalize">{group}</span>
          </div>
        ))}
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[200px] max-h-[260px] overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Glow filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Orbital rings */}
          <g className="orbital-rings">
            {Object.entries(orbitalRings).map(([group, { distance, label }]) => {
              const color = groupColors[group] || '#888';
              const hasNodesInRing = nodes.some(n => n.group === group);
              return (
                <g key={`ring-${group}`}>
                  {/* Ring path */}
                  <circle
                    cx={dimensions.width / 2}
                    cy={dimensions.height / 2}
                    r={distance}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    strokeOpacity={hasNodesInRing ? 0.25 : 0.1}
                    strokeDasharray="4 6"
                  />
                  {/* Ring label */}
                  <text
                    x={dimensions.width / 2 + distance + 5}
                    y={dimensions.height / 2 - 5}
                    fontSize={9}
                    fill={color}
                    opacity={0.5}
                    style={{ pointerEvents: 'none' }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Edges */}
          <g className="edges">
            {edges.map((edge) => {
              const sourceNode = getNode(edge.source);
              const targetNode = getNode(edge.target);
              if (!sourceNode || !targetNode) return null;

              const style = connectionTypeStyles[edge.type];
              const isEdgeHighlighted =
                hoveredNode === edge.source ||
                hoveredNode === edge.target ||
                selectedPersonId === edge.source ||
                selectedPersonId === edge.target;

              return (
                <motion.line
                  key={edge.id}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={style.color}
                  strokeWidth={isEdgeHighlighted ? style.width + 1 : style.width}
                  strokeDasharray={style.dashArray}
                  strokeOpacity={isEdgeHighlighted ? 0.9 : 0.4}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  filter={isEdgeHighlighted ? 'url(#glow)' : undefined}
                />
              );
            })}

            {/* Edges from "You" to people */}
            {nodes
              .filter((n) => n.id !== 'you')
              .map((node) => {
                const youNode = getNode('you');
                if (!youNode) return null;

                const isNodeHighlighted = isHighlighted(node.id) || selectedPersonId === node.id;

                return (
                  <motion.line
                    key={`you-${node.id}`}
                    x1={youNode.x}
                    y1={youNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={groupColors[node.group]}
                    strokeWidth={isNodeHighlighted ? 2 : 1}
                    strokeOpacity={isNodeHighlighted ? 0.5 : 0.15}
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                );
              })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isYou = node.id === 'you';
              const isSelected = selectedPersonId === node.id;
              const isHovered = hoveredNode === node.id;
              const highlighted = isHighlighted(node.id);
              const color = groupColors[node.group] || groupColors.acquaintances;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => !isYou && handleMouseDown(node.id, e)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (!isYou && onPersonClick) {
                      const person = people.find((p) => p.id === node.id);
                      if (person) onPersonClick(person);
                    }
                  }}
                  onDoubleClick={() => {
                    if (!isYou && onPersonDoubleClick) {
                      const person = people.find((p) => p.id === node.id);
                      if (person) onPersonDoubleClick(person);
                    }
                  }}
                  style={{ cursor: isYou ? 'default' : 'pointer' }}
                >
                  {/* Outer glow */}
                  {(isSelected || isHovered) && (
                    <circle
                      r={node.radius + 8}
                      fill={color}
                      opacity={0.2}
                      filter="url(#glow-strong)"
                    />
                  )}

                  {/* Node circle */}
                  <motion.circle
                    r={node.radius}
                    fill={`url(#gradient-${node.group})`}
                    stroke={isSelected || isHovered ? 'white' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={isSelected || isHovered ? 3 : 2}
                    filter={highlighted ? 'url(#glow)' : undefined}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      fill: color,
                      opacity: highlighted || isYou ? 1 : 0.7,
                    }}
                  />

                  {/* Node label */}
                  <text
                    textAnchor="middle"
                    dy={isYou ? "0.35em" : node.radius + 10}
                    fontSize={isYou ? 10 : 9}
                    fontWeight={isYou || isSelected ? 600 : 500}
                    fill={isYou ? 'white' : 'rgba(255,255,255,0.8)'}
                    style={{
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {isYou ? 'You' : node.name.split(' ')[0]}
                  </text>

                  {/* Initial letter for non-You nodes */}
                  {!isYou && (
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize={12}
                      fontWeight={700}
                      fill="white"
                      style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      {node.name.charAt(0).toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Connection type legend */}
      <div className="mt-2 flex justify-center gap-4 text-xs text-foreground/50">
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-gray-500" />
          <span>Knows</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-indigo-400" style={{ background: 'repeating-linear-gradient(90deg, #818cf8 0, #818cf8 4px, transparent 4px, transparent 8px)' }} />
          <span>Works with</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-pink-400" style={{ height: '3px' }} />
          <span>Related to</span>
        </div>
      </div>
    </div>
  );
}
