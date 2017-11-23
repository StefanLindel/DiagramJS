 import {Edge} from '../elements/edges';
import {Node} from '../elements/nodes';
import {Graph} from '../elements/Graph';
import Layout from './Layout';
import {DiagramElement} from '../elements/BaseElements';

export class DagreLayout implements Layout {

    private g: any;

    public layout(graph: Graph, node: DiagramElement) {
        if (!window['dagre']) {
            return;
        }
        let model = graph.$graphModel;

        let innerG: any;

        if (this.g) {
            innerG = this.g;
        } else {
             innerG = new window['dagre'].graphlib.Graph();
             this.g = innerG;

            // const g = new dagre.graphlib.Graph();
            innerG.setGraph({marginx: 20, marginy: 20}).setDefaultEdgeLabel(function () {
                return {};
            });
        }

        if (model.nodes) {
            for (let id in model.nodes) {
                let node: Node = model.nodes[id];
                innerG.setNode(id, {width: node.getSize().x, height: node.getSize().y});
            }
        }

        if (model.edges) {
            for (let id in model.edges) {
                let edge: Edge = model.edges[id];
                innerG.setEdge(edge.$sNode.id, edge.$tNode.id);
            }
        }
        window['dagre'].layout(innerG);
        // dagre.layout(g);

        innerG.nodes().forEach(function (v: string) {
            if (model.nodes[v]) {
                model.nodes[v].withPos(innerG.node(v).x - innerG.node(v).width / 2, innerG.node(v).y - innerG.node(v).height / 2);
            }
        });
        innerG.edges().forEach(function (e: any) {
            for (let id in model.edges) {
                let edge: Edge = model.edges[id];
                if (edge.$sNode.id === e.v && edge.$tNode.id === e.w) {
                    let size = innerG.edge(e).points.length;
                    // let oldPoint;
                    edge.clearPoints();
                    for (let i = 0; i < size; i++) {
                        let point: SVGPoint = innerG.edge(e).points[i];
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
