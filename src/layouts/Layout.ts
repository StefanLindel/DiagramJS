import Graph from '../Graph';
import {DiagramElement,Point} from '../elements/BaseElements';
interface Layout {
  layout(graph: Graph, node:DiagramElement): void;
}

export default Layout;
