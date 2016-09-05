export default class DagreLayoutOld implements Layout {

  public layout(graph, node) {
    let g, layoutNode, nodes, graphOptions = copy({ directed: false }, node.options.layout);
    let i: any, n: Node, e: Edge, x: number, y: number;
    if (!window['dagre']) {
      return;
    }
    g = new window['dagre'].graphlib.Graph(graphOptions);
    g.setGraph(graphOptions);
    g.setDefaultEdgeLabel(function() { return {}; });
    nodes = node.nodes;
    for (i in nodes) {
      if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === 'function') {
        continue;
      }
      n = nodes[i];
      g.setNode(n.id, { label: n.id, width: n.getSize().x, height: n.getSize().y, x: n.getPos().x, y: n.getPos().y });
    }
    for (i = 0; i < node.edges.length; i += 1) {
      e = node.edges[i];
      g.setEdge(this.getNodeId(e.$sNode), this.getNodeId(e.$tNode));
    }
    window['dagre'].layout(g);
    // Set the layouting back
    for (i in nodes) {
      if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === 'function') {
        continue;
      }
      n = nodes[i];
      layoutNode = g.node(n.id);
      x = n.getPos().x;
      y = n.getPos().y;
      if (x < 1 && y < 1) {
        n.withPos(Math.ceil(layoutNode.x), Math.ceil(layoutNode.y));
      }
    }
    graph.draw();
  };

  public getNodeId(node) {
    if (node.$parent) {
      return this.getNodeId(node.$parent) || node.id;
    }
    return node.id;
  }

}
