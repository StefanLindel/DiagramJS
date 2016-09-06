import Model from '../Model';
import Edge from '../elements/edges/Edge';
import Node from '../elements/nodes/Node';
import { createShape } from '../util';

const width = 100;
const height = 70;

export function draw(canvas: Element, model: Model) {

  if (model.nodes) {
    for (let id in model.nodes) {
      let node = model.nodes[id];
      canvas.appendChild(createNodeElement(node));
    }
  }

  if (model.edges) {
    for (let id in model.edges) {
      let edge = model.edges[id];
      canvas.appendChild(createEdgeElement(edge));
    }
  }

}

function createNodeElement(node: Node): Element {

  let pos = node.getPos();

  let attr = {
    tag: 'rect',
    id: node.id,
    x: pos.x - width / 2,
    y: pos.y - height / 2,
    rx: 5,
    ry: 5,
    height: height,
    width: width,
    style: 'fill:none;stroke:black;stroke-width:2'
  };

  let attrText = {
    tag: 'text',
    x: pos.x,
    y: pos.y,
    'text-anchor': 'middle',
    'alignment-baseline': 'middle',
    'font-family': 'Verdana',
    'font-size': '14',
    fill: 'black'
  };

  let group = createShape({tag: 'g'});
  let text = createShape(attrText);
  text.textContent = node.id;
  let shape = createShape(attr);

  group.appendChild(shape);
  group.appendChild(text);

  return group;
}

function createEdgeElement(edge: Edge): Element {

  let path = 'M';
  for (let i = 0; i < edge.points.length; i++) {
    let point = edge.points[i];
    if (i > 0) {
      path += 'L';
    }
    path += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
  }

  let attr = {
    tag: 'path',
    id: edge.id,
    d: path,
    stroke: 'black',
    'stroke-width': '2',
    fill: 'none'
  };
  let shape = createShape(attr);

  return shape;
}

export function clearCanvas(canvas: Element) {
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
}
