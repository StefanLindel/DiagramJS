export default class Graph {

  public nodes: Object;
  public edges: Array<Object>;
  // public edgesLabel:Array<Object>;
  public outEdges: Object;
  public inEdges: Object;
  public dummyNodes: Array<Object>;
  public dummyEdges: Object;
  public count: number = 0;
  public minRank: number = Number.POSITIVE_INFINITY;

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
