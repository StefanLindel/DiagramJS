import Graph from '../Graph';
import { createShape } from '../util';

export function draw(graph: Graph) {
  clearCanvas(graph);
  const model = graph.model;
  const canvas = graph.canvas;

  if (model.elements) {
    for (let id in model.elements) {
      let elements = model.elements[id];
      canvas.appendChild(elements.getSVG());
    }
  }

}

export function clearCanvas(graph: Graph) {

  const canvas = graph.canvas;
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }

  canvas.appendChild(createPattern());
  const background = createShape( {
    tag: 'rect',
    id: 'background',
    width: 5000,
    height: 5000,
    x: -1500,
    y: -1500,
    stroke: '#999',
    'stroke-width': '1',
    fill: 'url(#raster)'
  });
  canvas.appendChild(background);
  canvas.appendChild(graph.model.getSVG());
}

function createPattern(): Element {
  const defs = createShape({ tag: 'defs' });
  const pattern = createShape( {
    tag: 'pattern',
    id: 'raster',
    patternUnits: 'userSpaceOnUse',
    width: 50,
    height: 50
  });
  const path = 'M0 5 L0 0 L5 0 M45 0 L50 0 L50 5 M50 45 L50 50 L45 50 M5 50 L0 50 L0 45';
  const cross = createShape( {
        tag: 'path',
        d: path,
        stroke: '#DDD',
        'stroke-width': 1,
        fill: 'none'
      });
  pattern.appendChild(cross);
  defs.appendChild(pattern);
  return defs;
}
