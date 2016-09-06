import BaseElement from '../elements/BaseElement';
import Graph from '../elements/Graph';

export interface Layout {
  layout(graph: Graph, node: BaseElement): void;
}
