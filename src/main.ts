import Graph from './Graph';
import Options from './Options';

class Diagram {

  private data: Object;
  private graph: Graph;
  private options: Options;

  constructor(data?: Object, options?: Options) {
    let baseData = { typ: 'clazzdiagram', edges: [{ typ: 'edge', source: 'A', target: 'B' }] };
    this.data = data || baseData;
    this.options = options || {};
    this.graph = new Graph(this.data, this.options);
  }

  public layout() {
    this.graph.layout();
  }

}

let data = { typ: 'clazzdiagram', nodes: [{ type: 'node' }, { type: 'node', id: 'A' }, { type: 'node', id: 'D', x: 10, y: 20 }], edges: [{ type: 'edge', source: 'A', target: 'B' }, { type: 'edge', source: 'A', target: 'C' }, { type: 'edge', source: 'C', target: 'B' }] };

let dia = new Diagram(data, { canvas: 'canvas' });

document.getElementById('layoutbtn').onclick = function () {
  dia.layout();
};
