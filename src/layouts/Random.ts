import { Point } from '../elements/BaseElements';
import Graph from '../Graph';
import { getRandomInt } from '../util';
import Layout from './Layout';

export class Random implements Layout {

  public layout(graph: Graph) {

    let model = graph.getModel();
    let maxSize = graph.getCanvasSize();

    if (model.nodes) {
      for (let id in model.nodes) {
        let node = model.nodes[id];
        let pos: Point = node.getPos();
        if (pos.x === 0 && pos.y === 0) {
          let x = getRandomInt(0, maxSize.width);
          let y = getRandomInt(0, maxSize.height);
          node.withPos(x, y);
        }
      }
    }

  }

}
