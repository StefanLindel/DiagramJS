/// <reference path='../core/dagre.d.ts'/>
import { Edge } from '../elements/edges';
import { Node } from '../elements/nodes';
import Graph from '../core/Graph';
import Layout from './Layout';
import * as dagre from 'dagre';

export class DagreLayout implements Layout {

  public layout(graph: Graph) {

    let model = graph.model;

    const g = new dagre.graphlib.Graph();
    g.setGraph({marginx: 35, marginy: 35}).setDefaultEdgeLabel(function() { return {}; });

    if (model.nodes) {
      for (let id in model.nodes) {
        let node: Node = model.nodes[id];
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
    });
    g.edges().forEach(function(e) {
      for (let id in model.edges) {
        let edge: Edge = model.edges[id];
        if (edge.source.id === e.v && edge.target.id === e.w) {
          edge.points = g.edge(e).points;
        }
      }
    });
  }

}
