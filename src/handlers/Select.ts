import { EventHandler } from '../core/EventBus';
import { DiagramElement } from '../elements/BaseElements';
import { Node } from '../elements/nodes';
import { createShape } from '../util';
import Model from '../elements/Model';

export class Select implements EventHandler {

  private svgRoot: SVGSVGElement;
  private editShape: SVGSVGElement;
  private deleteShape: SVGSVGElement;
  private model: Model;
  private padding = 10;

  constructor(model: Model) {
    this.model = model;
    this.svgRoot = <SVGSVGElement><any>document.getElementById('root');

    const editPath = `M0 1 L7 1 L7 0 L13 0 L13 1 L20 1 L20 5 L18 5 L18 25 L2 25 L2 5 L0 5 L0 1 M2 5 L18 5 M6 8 L6 20 M10 9 L10 22 M14 8 L14 20 `;
    const editAttr = {
      tag: 'path',
      id: 'edit',
      d: editPath,
      stroke: '#333',
      'stroke-width': '2',
      fill: '#DDD'
    };
    const editShape = createShape(editAttr);
    this.editShape = editShape;

    const deletePath = `M0 1 L7 1 L7 0 L13 0 L13 1 L20 1 L20 5 L18 5 L18 25 L2 25 L2 5 L0 5 L0 1 M2 5 L18 5 M6 8 L6 20 M10 9 L10 22 M14 8 L14 20 `;
    const deleteAttr = {
      tag: 'path',
      id: 'trashcan',
      d: deletePath,
      stroke: '#333',
      'stroke-width': '2',
      fill: '#DDD'
    };
    const deleteShape = createShape(deleteAttr);
    this.deleteShape = deleteShape;
  }

  public handle(event, element: DiagramElement) {
    let e = <Node>element;
    if (document.getElementById('trashcan') === null) {
      this.svgRoot.appendChild(this.deleteShape);
    }
    const x = e.pos.x + e.width / 2 + this.padding;
    const y = e.pos.y - e.height / 2 + this.padding / 2;
    this.deleteShape.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ')');
    this.deleteShape.onclick = e => this.model.removeElement(element.id);
  }

}
