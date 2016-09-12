import Graph from './core/Graph';
import Options from './core/Options';
import { Point } from './elements/BaseElements';

class Diagram {

  private data: Object;
  private graph: Graph;
  private options: Options;

  constructor(data?: Object, options?: Options) {
    const baseData = { typ: 'clazzdiagram', edges: [{ typ: 'edge', source: 'A', target: 'B' }] };
    this.data = data || baseData;
    this.options = options || {};
    this.graph = new Graph(this.data, this.options);
  }

  public layout() {
    this.graph.layout();
  }

  public addElement(type: string) {
    this.graph.addElement(type);
  }

}

let data = {
  typ: 'clazzdiagram',
  nodes: [
    {
      type: 'clazz',
      name: 'User',
      attributes: [ '+ name : string', '+ address : string', '- id : int'],
      methods: [ '+ register()', '+ login()' ]
    },
    {
      type: 'clazz',
      name: 'Order',
      attributes: [ '+ status : string', '+ date : string', '- orderId : int'],
      methods: [ '+ place()', '+ cancel()', '+ refund()' ]
    },
    {
      type: 'clazz',
      name: 'Account',
      attributes: [ '- id : int']
    },
    {
      type: 'clazz',
      name: 'Product',
      attributes: [ '+ name : string', '+ description : string', '+ photo : string', '- id : int'],
      methods: [ '+ addToOrder()' ]
    },
    {
      type: 'clazz',
      name: 'Payment',
      attributes: [ '+ provider : string', '+ amount : string' ],
      methods: [ '+ getStatus()' ]
    }
  ],
  edges: [
    { type: 'edge', source: 'Order', target: 'Product' },
    { type: 'edge', source: 'User', target: 'Order' },
    { type: 'edge', source: 'User', target: 'Account' },
    { type: 'edge', source: 'Order', target: 'Payment' },
    { type: 'edge', source: 'Payment', target: 'Account' }
  ]
};

const options: Options = {
  canvas: 'canvas',
  origin: new Point(150, 45),
  features: {
    drag: true,
    editor: true,
    palette: true,
    select: true,
    zoom: true
  }
};

let dia = new Diagram(data, options);

document.getElementById('layoutBtn').onclick = function () {
  dia.layout();
};

(function() {
  dia.layout();
})();
