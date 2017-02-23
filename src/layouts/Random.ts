import { Point } from '../elements/BaseElements';
import {Graph} from '../elements/Graph';
import { Util } from '../util';
import Layout from './Layout';

export class Random implements Layout {

  public layout(graph: Graph) {

    let model = graph.model;

    if (model.nodes) {
      for (let id in model.nodes) {
        let node = model.nodes[id];
        let pos: Point = node.getPos();
        if (pos.x === 0 && pos.y === 0) {
          let x = Util.getRandomInt(0, graph.canvasSize.width);
          let y = Util.getRandomInt(0, graph.canvasSize.height);
          node.withPos(x, y);
        }
      }
    }
  }
}
