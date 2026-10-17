import type { BiblicalPerson, BiblicalRelationship, BiblicalEra, RelationshipType } from '../data/biblicalPeople';

export interface GraphNode {
  id: string;
  name: string;
  era: BiblicalEra;
  role: string;
  importance: 1 | 2 | 3;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  person: BiblicalPerson;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
}

export class ForceGraphSimulation {
  nodes: GraphNode[] = [];
  edges: GraphEdge[] = [];
  nodeMap: Map<string, GraphNode> = new Map();
  width: number = 800;
  height: number = 600;
  alpha: number = 1;
  alphaDecay: number = 0.02;
  alphaMin: number = 0.001;

  constructor(people: BiblicalPerson[], relationships: BiblicalRelationship[], width: number, height: number) {
    this.width = width;
    this.height = height;
    this.init(people, relationships);
  }

  init(people: BiblicalPerson[], relationships: BiblicalRelationship[]) {
    this.nodeMap.clear();
    const radiusByImportance: Record<number, number> = { 1: 22, 2: 17, 3: 13 };

    // Arrange nodes in initial spiral or cluster by era
    const eraAngles: Record<BiblicalEra, number> = {
      'Creation & Patriarchs': 0,
      'Exodus & Judges': (Math.PI * 2) / 6,
      'Monarchy & Prophets': (Math.PI * 4) / 6,
      'Exile & Return': (Math.PI * 6) / 6,
      'Gospels & Christ': (Math.PI * 8) / 6,
      'Apostles & Early Church': (Math.PI * 10) / 6,
    };

    this.nodes = people.map((p, i) => {
      const baseAngle = eraAngles[p.era] || 0;
      const angle = baseAngle + ((i % 10) - 5) * 0.15;
      const dist = 180 + Math.random() * 220;
      const node: GraphNode = {
        id: p.id,
        name: p.name,
        era: p.era,
        role: p.role,
        importance: p.importance,
        x: this.width / 2 + Math.cos(angle) * dist + (Math.random() - 0.5) * 40,
        y: this.height / 2 + Math.sin(angle) * dist + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        radius: radiusByImportance[p.importance] || 16,
        person: p,
      };
      this.nodeMap.set(p.id, node);
      return node;
    });

    this.edges = relationships
      .filter((r) => this.nodeMap.has(r.source) && this.nodeMap.has(r.target))
      .map((r) => ({
        source: r.source,
        target: r.target,
        type: r.type,
        label: r.label,
      }));

    this.alpha = 1;
  }

  restart() {
    this.alpha = 0.6;
  }

  tick() {
    if (this.alpha < this.alphaMin) return;

    const k = 0.05 * this.alpha;
    const centerK = 0.008 * this.alpha;
    const cx = this.width / 2;
    const cy = this.height / 2;

    // 1. Center attraction
    for (const node of this.nodes) {
      node.vx += (cx - node.x) * centerK;
      node.vy += (cy - node.y) * centerK;
    }

    // 2. Node-node repulsion (N^2 with optimization threshold)
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distSq = dx * dx + dy * dy;
        if (distSq === 0) {
          dx = (Math.random() - 0.5) * 2;
          dy = (Math.random() - 0.5) * 2;
          distSq = 4;
        }
        const dist = Math.sqrt(distSq);
        const minDist = a.radius + b.radius + 60;
        const repulseForce = (minDist * minDist * 45) / (distSq + 100);
        const fx = (dx / dist) * repulseForce * k;
        const fy = (dy / dist) * repulseForce * k;

        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    // 3. Edge spring tension
    const targetDist = 90;
    for (const edge of this.edges) {
      const s = this.nodeMap.get(edge.source);
      const t = this.nodeMap.get(edge.target);
      if (!s || !t) continue;

      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - targetDist) * 0.06 * this.alpha;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      s.vx += fx;
      s.vy += fy;
      t.vx -= fx;
      t.vy -= fy;
    }

    // 4. Position update with damping
    const damping = 0.78;
    for (const node of this.nodes) {
      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx;
      node.y += node.vy;
    }

    this.alpha *= 1 - this.alphaDecay;
  }

  findShortestPath(startId: string, endId: string): string[] | null {
    if (startId === endId) return [startId];
    if (!this.nodeMap.has(startId) || !this.nodeMap.has(endId)) return null;

    // Build adjacency
    const adj = new Map<string, string[]>();
    for (const edge of this.edges) {
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      if (!adj.has(edge.target)) adj.set(edge.target, []);
      adj.get(edge.source)!.push(edge.target);
      adj.get(edge.target)!.push(edge.source);
    }

    // BFS
    const queue: string[] = [startId];
    const visited = new Set<string>([startId]);
    const parent = new Map<string, string>();

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === endId) {
        const path: string[] = [];
        let step: string | undefined = endId;
        while (step) {
          path.unshift(step);
          step = parent.get(step);
        }
        return path;
      }

      for (const neighbor of adj.get(curr) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, curr);
          queue.push(neighbor);
        }
      }
    }

    return null;
  }
}
