import {Edge} from '../elements/edges';
import {Node} from '../elements/nodes';
import {Graph} from '../elements/Graph';
import Layout from './Layout';

export class DagreLayout implements Layout {
    public layout(graph: Graph) {
        if (!window['dagre']) {
            return;
        }
        let model = graph.model;

        const g = new window['dagre'].graphlib.Graph();
            // const g = new dagre.graphlib.Graph();
        g.setGraph({marginx: 20, marginy: 20}).setDefaultEdgeLabel(function () {
            return {};
        });

        if (model.nodes) {
            for (let id in model.nodes) {
                let node: Node = model.nodes[id];
                g.setNode(id, {width: node.getSize().x, height: node.getSize().y});
            }
        }

        if (model.edges) {
            for (let id in model.edges) {
                let edge: Edge = model.edges[id];
                g.setEdge(edge.$sNode.id, edge.$tNode.id);
            }
        }
        window['dagre'].layout(g);
        // dagre.layout(g);

        g.nodes().forEach(function (v) {
            if (model.nodes[v]) {
                model.nodes[v].withPos(g.node(v).x - g.node(v).width / 2, g.node(v).y - g.node(v).height / 2);
            }
        });
        g.edges().forEach(function (e) {
            for (let id in model.edges) {
                let edge: Edge = model.edges[id];
                if (edge.$sNode.id === e.v && edge.$tNode.id === e.w) {
                    let size = g.edge(e).points.length;
                    // let oldPoint;
                    for (let i = 0; i < size; i++) {
                        let point: SVGPoint = g.edge(e).points[i];
                        edge.addLine(point.x, point.y);
                        // if(oldPoint) {
                        //  edge.addLine(oldPoint.x, oldPoint.y, point.x, point.y);
                        // }
                        // oldPoint = point;
                    }
                }
            }
        });
    }
}
