import {DiagramElement} from '../elements/BaseElements';
import Layout from './Layout';
import Graph from '../elements/Graph';
import {Edge} from "../elements/edges/Edge";
export class LayoutGraphMin {
    public nodes: Object = {};
    public edges: Array<Object> = [];
    public outEdges: Object = {};
    public inEdges: Object = {};
    public dummyNodes: Array<Object> = [];
    public dummyEdges: Object = {};
    public count: number = 0;
    public minRank: number = Number.POSITIVE_INFINITY;
    public edgesLabel: Array<Object> = [];

    public nodeCount(): Number {
        return this.count;
    }

    public node(id: string) {
        return this.nodes[id];
    }

    public setNode(id: string, n: Object) {
        if (n && !this.nodes[id]) {
            this.nodes[id] = n;
            this.count = this.count + 1;
        } else if (!n && this.nodes[id]) {
            delete this.nodes[id];
        }
    }
}

//				######################################################### DagreGraph #########################################################
export class DagreLayoutMin implements Layout {
    public static EDGE_KEY_DELIM = "\x01";

    public layout(graph: Graph, node: DiagramElement) {
//	public layout(graph, node) {
        let g, layoutNode, nodes, newEdge, edges;
        let i, n, x, y, sId, tId, split = DagreLayoutMin.EDGE_KEY_DELIM;
        let e: Edge;

        nodes = node["nodes"];
        edges = node["edges"];
        g = new LayoutGraphMin();

        for (i in nodes) {
            if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === "function") {
                continue;
            }
            n = nodes[i];
            g.setNode(n.id, {id: n.id, width: n.getSize().x, height: n.getSize().y, x: n.getPos().x, y: n.getPos().y});
        }
        for (i in edges) {
            if (!edges.hasOwnProperty(i) || typeof (edges[i]) === "function") {
                continue;
            }
            e = edges[i];
            sId = this.getNodeId(e.$sNode);
            tId = this.getNodeId(e.$tNode);
            if (sId > tId) {
                let tmp = tId;
                tId = sId;
                sId = tmp;
            }
            let idAB = sId + split + tId + split;
            let idBA = tId + split + sId + split;
            if (sId != tId && g.edgesLabel.indexOf(idAB) < 0 && g.edgesLabel.indexOf(idBA) < 0) {
                newEdge = {source: sId, target: tId, minlen: 1, weight: 1};
                g.edges.push(newEdge);
                g.edgesLabel.push(idAB);
                // In Edges
                if (!g.inEdges[tId]) {
                    g.inEdges[tId] = [];
                }
                g.inEdges[tId].push(newEdge);

                // Out Edges
                if (!g.outEdges[sId]) {
                    g.outEdges[sId] = [];
                }
                g.outEdges[sId].push(newEdge);
            }
        }
        this.layouting(g);
        // Set the layouting back
        for (i in nodes) {
            if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === "function") {
                continue;
            }
            n = nodes[i];
            layoutNode = g.node(n.id);
            x = n.getPos().x;
            y = n.getPos().y;
            if (x < 1 && y < 1) {
                n.withPos(Math.ceil(layoutNode.x), Math.ceil(layoutNode.y))
            }
        }
        for (i in edges) {
            if (!edges.hasOwnProperty(i) || typeof (edges[i]) === "function") {
                continue;
            }
            e = edges[i];
            e.calc(graph.root);
        }
        graph.draw();
    }

    public getNodeId(node) {
        if (node.$parent) {
            return this.getNodeId(node.$parent) || node.id;
        }
        return node.id;
    }

    public layouting(g) {
        this.longestPath(g);
        this.normalizeRanks(g);
        this.normalizeEdge(g);
        //this.setSimpleOrder(g);
        this.order(g);
        g.ranksep = 25;
        // remove Dummy
        this.removeDummy(g);
        this.position(g);
    }

    public setSimpleOrder(g) {
        let i, n;
        for (i in g.nodes) {
            n = g.nodes[i];
            n.order = n.rank;
        }
    }

    /*
     * Applies heuristics to minimize edge crossings in the graph and sets the best
     * order solution as an order attribute on each node.
     *
     * Pre-conditions:
     *
     *    1. Graph must be DAG
     *    2. Graph nodes must be objects with a "rank" attribute
     *    3. Graph edges must have the "weight" attribute
     *
     * Post-conditions:
     *
     *    1. Graph nodes will have an "order" attribute based on the results of the
     *       algorithm.
     */
    public order(g) {
        let layering = Array(g.maxRank + 1);
        let visited = {};
        let node, n, order, i;
        for (i = 0; i < layering.length; i++) {
            layering[i] = [];
        }
        for (n in g.nodes) {
            if (visited[n]) continue;
            visited[n] = true;
            node = g.nodes[n];
            if (node.rank !== undefined) {
                layering[node.rank].push(n);
            }
        }
        for (order in layering) {
            for (n in layering[order]) {
                if (layering[order].hasOwnProperty(n) === false) {
                    continue;
                }
                g.nodes[layering[order][n]].order = parseInt(n);
            }
        }
        // Fix resolve conflict
        for (order in layering) {
            if (layering[order].length > 1) {
                for (n in layering[order]) {
                    if (layering[order].hasOwnProperty(n) === false) {
                        continue;
                    }
                    let name = layering[order][n];
                    let sum = 0;
                    let weight = 1;
                    let edges = g.dummyEdges[name];
                    if (edges) {
                        for (i in edges) {
                            if (edges.hasOwnProperty(i) === false) {
                                continue;
                            }
                            let edge = edges[i];
                            let nodeU = g.node(edge.target);
                            sum = sum + (edge.weight * nodeU.order);
                            weight = weight + edge.weight;
                        }
                    }
                    g.node(name).barycenter = sum / weight;
                    g.node(name).weight = weight;
                }
            } else if (layering[order].length > 0) {
                for (n in layering[order]) {
                    let name = layering[order][n];
                    g.node(name).barycenter = 1;
                    g.node(name).weight = 1;
                }
            }
        }
        for (order in layering) {
            for (n in layering[order]) {
                if (layering[order].hasOwnProperty(n) === false) {
                    continue;
                }
                let node = g.nodes[layering[order][n]];
                node.order = parseInt(n) + node.barycenter * node.weight;
                if (isNaN(node.order)) {
                    console.log("ERROR");
                }
            }
        }
    };

    public removeDummy(g) {
        for (let z in g.dummyNodes) {
            let node = g.dummyNodes[z];
            g.setNode(node.name, null);
        }
        g.dummyNodes = [];
        g.dummyEdges = {};
    };

    /*
     * Breaks any long edges in the graph into short segments that span 1 layer
     * each. This operation is undoable with the denormalize function.
     *
     * Pre-conditions:
     *
     *    1. The input graph is a DAG.
     *    2. Each node in the graph has a "rank" property.
     *
     * Post-condition:
     *
     *    1. All edges in the graph have a length of 1.
     *    2. Dummy nodes are added where edges have been split into segments.
     *    3. The graph is augmented with a "dummyChains" attribute which contains
     *       the first dummy in each chain of dummy nodes produced.
     */
    public normalizeEdge(g) {
        let i = 1;
        for (let id in g.edges) {
            let e:Edge = g.edges[id];
            let v:string = e.source;
            let vRank = g.node(v).rank;
            const w:string = e.target;
            const wRank:number = g.node(w).rank;
            let name:string;

            if (wRank === vRank + 1) continue;

            let dummy;
            for (vRank = vRank + 1; vRank < wRank; ++vRank) {
                name = "_d" + e.source + e.target + (i++);
                let newEdge = {source: v, target: name, minlen: 1, weight: 1};
                dummy = {width: 0, height: 0, edgeObj: e, rank: vRank, name: name};
                // Dummy Edges
                if (!g.dummyEdges[v]) {
                    g.dummyEdges[v] = [];
                }
                g.dummyEdges[v].push(newEdge);

                g.dummyNodes.push(dummy);
                g.setNode(dummy.name, dummy);
                v = name;
            }
        }
    };

    /*
     * Initializes ranks for the input graph using the longest path algorithm. This
     * algorithm scales well and is fast in practice, it yields rather poor
     * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
     * ranks wide and leaving edges longer than necessary. However, due to its
     * speed, this algorithm is good for getting an initial ranking that can be fed
     * into other algorithms.
     *
     * This algorithm does not normalize layers because it will be used by other
     * algorithms in most cases. If using this algorithm directly, be sure to
     * run normalize at the end.
     *
     * Pre-conditions:
     *
     *    1. Input graph is a DAG.
     *    2. Input graph node labels can be assigned properties.
     *
     * Post-conditions:
     *
     *    1. Each node will be assign an (unnormalized) "rank" property.
     */
    public longestPath(g) {
        let i, n, visited = [];
        for (i in g.nodes) {
            n = g.nodes[i];
            visited.push(i);
            n.rank = this.findAllPaths(g, n, 0, visited);
            g.minRank = Math.min(g.minRank, n.rank);
        }
    }

    public findAllPaths(g, n, currentCost, path) {
        let min: number = 0;
        let id: string;
        let z: number;
        let target;
        if (g.outEdges[n.id]) {
            for (z = 0; z < g.outEdges[n.id].length; z++) {
                id = g.outEdges[n.id][z].target;
                target = g.nodes[id];
                if (path[id]) {
                    min = Math.min(min, target.rank);
                } else if (path.indexOf(id) < 0) {
                    min = Math.min(min, this.findAllPaths(g, target, currentCost - 2, path));
                } else {
                    min = currentCost;
                }
            }
            return min;
        }
        return currentCost;
    };

    /*
     * Adjusts the ranks for all nodes in the graph such that all nodes v have
     * rank(v) >= 0 and at least one node w has rank(w) = 0.
     */
    public normalizeRanks(g) {
        let min = g.minRank;
        let value;
        g.maxRank = Number.NEGATIVE_INFINITY;
        g.maxHeight = 0;
        g.maxWidth = 0;
        for (let i in g.nodes) {
            let node = g.nodes[i];
            if (node.rank !== undefined) {
                node.rank -= min;
                value = Math.abs(node.rank);
                if (value > g.maxRank) {
                    g.maxRank = value;
                }
                g.maxHeight = Math.max(g.maxHeight, node.height);
                g.maxWidth = Math.max(g.maxWidth, node.width);
            }
        }
    };

    public position(g) {
        this.positionY(g);
        let list = this.positionX(g);
        for (let i in list) {
            for (let pos in list[i]) {
                if (list[i].hasOwnProperty(pos) === false) {
                    continue;
                }
                if (g.node(list[i][pos])) {
                    g.node(list[i][pos]).x = parseInt(pos) * g.maxWidth;
                }
            }

        }
    };

    public positionY(g) {
        let layering = this.buildLayerMatrix(g);
        let rankSep = g.ranksep;
        let prevY = 0;
        for (let layer in layering) {
            let maxHeight = g.maxHeight;
            for (let v in layering[layer]) {
                if (layering[layer].hasOwnProperty(v) === false) {
                    continue;
                }
                let id = layering[layer][v];
                g.nodes[id].y = prevY + maxHeight / 2;
            }
            prevY += maxHeight + rankSep;
        }
    }

    /*
     * Given a DAG with each node assigned "rank" and "order" properties, this
     * function will produce a matrix with the ids of each node.
     */
    public buildLayerMatrix(g) {
        let layering = Array(g.maxRank + 1);
        for (let i = 0; i < layering.length; i++) {
            layering[i] = [];
        }
        for (let n in g.nodes) {
            let node = g.nodes[n];
            if (node.rank !== undefined) {
                layering[node.rank][node.order] = n;
            }
        }
        return layering;
    };

    public positionX(g) {
        let layering = this.buildLayerMatrix(g);
        return layering;
    };
}
