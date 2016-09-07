import { Node } from '../elements/nodes';
import { Point } from '../elements/BaseElements';

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
      this.svgElement.addEventListener('mouseup', this.mouseUp.bind(this));
      this.svgRoot.addEventListener('mousemove', this.mouseMove.bind(this));
    }
  }

  private mouseDown(evt) {
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
    else if (this.svgElement.tagName.toUpperCase() === 'G') {
      this.mouseOffsetX = evt.clientX;
      this.mouseOffsetY = evt.clientY;
    }
  }

  private mouseUp(evt) {
    this.dragging = false;
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
      else if (this.svgElement.tagName.toUpperCase() === 'G') {
        let translation = this.svgElement.getAttributeNS(null, 'transform').slice(10, -1).split(' ');
        let sx = parseInt(translation[0]);
        let sy = parseInt(translation[1]);
        this.svgElement.setAttributeNS(null, 'transform', 'translate(' + (sx + evt.clientX - this.mouseOffsetX) + ' ' + (sy + evt.clientY - this.mouseOffsetY) + ')');
        this.mouseOffsetX = evt.clientX;
        this.mouseOffsetY = evt.clientY;
        this.node.pos = new Point((sx + evt.clientX - this.mouseOffsetX), (sy + evt.clientY - this.mouseOffsetY)).add(this.origNodePos);
      }
      this.node.redrawEdges();
    }
  }

}
/*
if (g.transform.baseVal.numberOfItems == 0) {
  g.setAttribute('transform', 'translate(' + 50 + ', ' + 50 + ')');
} else {
  t  = g.transform.baseVal.getItem(0),
  t.setMatrix(t.matrix.translate(50, 50));
}
}
*/
