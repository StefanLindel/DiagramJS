import { Node } from '../elements/nodes';
import { Point } from '../elements/BaseElements';
import { isDragging } from './listeners';

export default class DragListener {

  private node: Node;
  private svgRoot: SVGSVGElement;
  private svgElement: SVGSVGElement;
  private dragging = false;
  private mouseOffsetX = 0;
  private mouseOffsetY = 0;
  private origNodePos: Point;

  constructor(element: Element, node: Node) {
    this.node = node;
    this.origNodePos = new Point(node.pos.x, node.pos.y);
    this.svgRoot = document.getElementsByTagName('svg')[0];
    this.svgElement = <SVGSVGElement>element;

    if (this.svgElement) {
      this.svgElement.addEventListener('mousedown', this.mouseDown.bind(this), false);
      this.svgElement.addEventListener('mouseup', this.reset.bind(this));
      this.svgRoot.addEventListener('mousemove', this.mouseMove.bind(this));
      this.svgRoot.addEventListener('mouseleave', this.reset.bind(this));
    }
  }

  public isDragging(): boolean {
    return this.dragging;
  }

  private mouseDown(evt) {
    if (isDragging()) {
      return;
    }
    console.log('dragging node');
    this.dragging = true;
    this.svgRoot.appendChild(this.svgElement);
    if (this.svgElement.tagName.toUpperCase() === 'RECT') {
      let p = this.svgRoot.createSVGPoint();
      let m = this.svgElement.getScreenCTM();
      p.x = evt.clientX;
      p.y = evt.clientY;
      p = p.matrixTransform(m.inverse());
      this.mouseOffsetX = p.x - parseInt(this.svgElement.getAttribute('x'));
      this.mouseOffsetY = p.y - parseInt(this.svgElement.getAttribute('y'));
    }
    else {
      this.mouseOffsetX = evt.clientX;
      this.mouseOffsetY = evt.clientY;
    }
  }

  private reset(evt) {
    this.dragging = false;
    console.log('dragging node stopped');
  }

  private mouseMove(evt) {
    let p = this.svgRoot.createSVGPoint();
    p.x = evt.clientX;
    p.y = evt.clientY;

    if (this.dragging) {
      if (this.svgElement.tagName.toUpperCase() === 'RECT') {
        let m = this.svgElement.getScreenCTM();
        p = p.matrixTransform(m.inverse());
        this.svgElement.setAttribute('x', (p.x - this.mouseOffsetX).toString());
        this.svgElement.setAttribute('y', (p.y - this.mouseOffsetY).toString());
      }
      else {
        let translation = this.svgElement.getAttributeNS(null, 'transform').slice(10, -1).split(' ');
        let sx = parseInt(translation[0]);
        let sy = parseInt(translation[1]);
        this.svgElement.setAttributeNS(null, 'transform', 'translate(' + (sx + evt.clientX - this.mouseOffsetX) + ' ' + (sy + evt.clientY - this.mouseOffsetY) + ')');
        this.node.pos = new Point((sx + evt.clientX - this.mouseOffsetX), (sy + evt.clientY - this.mouseOffsetY)).add(this.origNodePos);
        this.mouseOffsetX = evt.clientX;
        this.mouseOffsetY = evt.clientY;
      }
      this.node.redrawEdges();
    }
  }

}
