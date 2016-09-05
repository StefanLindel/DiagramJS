import BaseElement from '../elements/BaseElement';
import Graph from '../elements/Graph';

interface Layout {
  layout(graph: Graph, node: BaseElement): void;
}

export default Layout;
