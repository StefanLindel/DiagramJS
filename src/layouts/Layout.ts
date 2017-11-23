import {Graph} from '../elements/Graph';
import {DiagramElement} from '../elements/BaseElements';
interface Layout {
  layout(graph: Graph, node: DiagramElement): void;
}

export default Layout;
