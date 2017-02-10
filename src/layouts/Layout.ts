import {Graph} from '../elements/Graph';
import {DiagramElement,Point} from '../elements/BaseElements';
interface Layout {
  layout(graph: Graph, node:DiagramElement): void;
}

export default Layout;
