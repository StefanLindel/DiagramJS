import Graph from './Graph';
import Options from './Options';
import { Point } from './elements/BaseElements';

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

let data = {
  typ: 'clazzdiagram',
  nodes: [
    {
      type: 'clazz',
      id: 'User',
      attributes: [ '+ name : string', '+ address : string', '- id : int'],
      methods: [ '+ register()', '+ login()' ]
    },
    {
      type: 'clazz',
      id: 'Order',
      attributes: [ '+ status : string', '+ date : string', '- orderId : int'],
      methods: [ '+ place()', '+ cancel()', '+ refund()' ]
    },
    {
      type: 'clazz',
      id: 'Account',
      attributes: [ '- id : int'],
      methods: [ '+ delete()' ]
    },
    {
      type: 'clazz',
      id: 'Product',
      attributes: [ '+ name : string', '+ description : string', '+ photo : string', '- id : int'],
      methods: [ '+ addToOrder()' ]
    },
    {
      type: 'clazz',
      id: 'Payment',
      attributes: [ '+ provider : string', '+ amount : string' ],
      methods: [ '+ getStatus()' ]
    }
  ],
  edges: [
    { type: 'aggregation', source: 'Order', target: 'Product' },
    { type: 'edge', source: 'User', target: 'Order' },
    { type: 'edge', source: 'User', target: 'Account' },
    { type: 'edge', source: 'Order', target: 'Payment' },
    { type: 'edge', source: 'Payment', target: 'Account' }
  ]
};

let dia = new Diagram(data, { canvas: 'canvas', origin: new Point(135, 50) });

document.getElementById('layoutbtn').onclick = function () {
  dia.layout();
};
