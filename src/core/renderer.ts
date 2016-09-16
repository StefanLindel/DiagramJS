import Graph from './Graph';
import { util } from '../util';

export function draw(graph: Graph) {
  clearCanvas(graph);
  const model = graph.model;
  const canvas = graph.canvas;

  if (model.nodes) {
    for (let id in model.nodes) {
      let node = model.nodes[id];
      canvas.appendChild(node.getSVG());
    }
  }
  if (model.edges) {
    for (let id in model.edges) {
      let edge = model.edges[id];
      canvas.appendChild(edge.getSVG());
    }
  }

}

export function clearCanvas(graph: Graph) {

  const canvas = graph.canvas;
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }

  canvas.appendChild(createPattern());
  const background = util.createShape( {
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
  const defs = util.createShape({ tag: 'defs' });
  const pattern = util.createShape( {
    tag: 'pattern',
    id: 'raster',
    patternUnits: 'userSpaceOnUse',
    width: 40,
    height: 40
  });
  const path = 'M0 4 L0 0 L4 0 M36 0 L40 0 L40 4 M40 36 L40 40 L36 40 M4 40 L0 40 L0 36';
  const cross = util.createShape( {
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
