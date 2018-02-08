import { Edge } from '../elements/edges';
import { Node } from '../elements/nodes';
import { Graph } from '../elements/Graph';
import Layout from './Layout';
import { DiagramElement } from '../elements/BaseElements';

export class DagreLayout implements Layout {

    public layout(graph: Graph, node: DiagramElement) {
        if (!window['dagre']) {
            return;
        }
        let model = graph.$graphModel;
        let g = new window['dagre'].graphlib.Graph();

        g.setGraph({ marginx: 20, marginy: 20 }).setDefaultEdgeLabel(function () {
            return {};
        });

        for (let node of model.nodes) {
            g.setNode(node.id, { width: node.getSize().x, height: node.getSize().y });
        }

        for (let edge of model.edges) {
            g.setEdge(edge.$sNode.id, edge.$tNode.id);
        }

        window['dagre'].layout(g);

        g.nodes().forEach(function (nodeId: string) {
            for (let node of model.nodes) {
                if (node.id === nodeId) {
                    node.withPos(g.node(nodeId).x - g.node(nodeId).width / 2, g.node(nodeId).y - g.node(nodeId).height / 2);
                }
            }
        });
        g.edges().forEach(function (e: any) {
            for (let edge of model.edges) {
                if (edge.$sNode.id === e.v && edge.$tNode.id === e.w) {
                    let size = g.edge(e).points.length;
                    edge.clearPoints();
                    for (let i = 0; i < size; i++) {
                        let point: SVGPoint = g.edge(e).points[i];
                        edge.addPoint(point.x, point.y);
                    }
                }
            }
        });
    }
}
