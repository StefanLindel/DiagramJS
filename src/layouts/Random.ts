import { Point } from '../elements/BaseElements';
import Graph from '../Graph';
import { util } from '../util';
import Layout from './Layout';

export class Random implements Layout {

  public layout(graph: Graph) {

    let model = graph.model;

    if (model.nodes) {
      for (let id in model.nodes) {
        let node = model.nodes[id];
        let pos: Point = node.getPos();
        if (pos.x === 0 && pos.y === 0) {
          let x = util.getRandomInt(0, graph.canvasSize.width);
          let y = util.getRandomInt(0, graph.canvasSize.height);
          node.withPos(x, y);
        }
      }
    }
  }
}
