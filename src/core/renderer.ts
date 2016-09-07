import { Point } from '../elements/BaseElements';
import Graph from '../Graph';

export function draw(graph: Graph) {

  const model = graph.model;
  const canvas = graph.canvas;
  const origin = graph.options.origin || new Point(0, 0);
  const offset = new Point(20, 20).add(origin);

  if (model.elements) {
    for (let id in model.elements) {
      let elements = model.elements[id];
      canvas.appendChild(elements.getSVG(offset));
    }
  }

}

export function clearCanvas(graph: Graph) {

  const canvas = graph.canvas;
  const origin = graph.options.origin || new Point(0, 0);

  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
  canvas.appendChild(graph.model.getSVG(origin));

}
