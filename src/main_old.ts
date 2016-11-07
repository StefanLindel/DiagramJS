import Graph from './Graph';
import Options from './Options';
import { Point } from './elements/BaseElements';

class Diagram {
  private graph: Graph;
  constructor(options?: Options) {
    this.graph = new Graph({init:true}, options);
  }
}
(function() {
	let dialoader = new Diagram();
})();
