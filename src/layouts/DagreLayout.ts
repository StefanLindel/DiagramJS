/// <reference path='../core/dagre.d.ts'/>
import { Size } from '../elements/BaseElements';
import Edge from '../elements/edges/Edge';
import Node from '../elements/nodes/Node';
import Graph from '../Graph';
import Layout from './Layout';
import * as dagre from 'dagre';

const nodeSize: Size = { width: 100, height: 70 };

export class DagreLayout implements Layout {

  public layout(graph: Graph) {

    let model = graph.getModel();

    const g = new dagre.graphlib.Graph();
    g.setGraph({ marginx: 180, marginy: 80 }).setDefaultEdgeLabel(function() { return {}; });

    if (model.nodes) {
      for (let id in model.nodes) {
        let node: Node = model.nodes[id];
        node.width = nodeSize.width;
        node.height = nodeSize.height;
        g.setNode(id, { width: node.width, height: node.height });
      }
    }

    if (model.edges) {
      for (let id in model.edges) {
        let edge: Edge = model.edges[id];
        g.setEdge(edge.source.id, edge.target.id);
      }
    }

    dagre.layout(g);

    g.nodes().forEach(function(v) {
      model.nodes[v].pos.x = g.node(v).x;
      model.nodes[v].pos.y = g.node(v).y;
      // console.log('Node ' + v + ': ' + JSON.stringify(g.node(v)));
    });
    g.edges().forEach(function(e) {
      for (let id in model.edges) {
        let edge: Edge = model.edges[id];
        if (edge.source.id === e.v && edge.target.id === e.w) {
          edge.points = g.edge(e).points;
          // console.log('Edge ' + e.v + ' -> ' + e.w + ': ' + JSON.stringify(g.edge(e)));
        }
      }
    });
  }

}
