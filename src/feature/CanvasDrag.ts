import Graph from '../Graph';
import { Point } from '../elements/BaseElements';
import { isDragging } from './listeners';

export default class CanvasDrag {

  private graph: Graph;
  private svgRoot: SVGSVGElement;
  private dragging = false;
  private mouseOffsetX = 0;
  private mouseOffsetY = 0;

  constructor(canvas: Element, graph: Graph) {
    this.graph = graph;
    this.svgRoot = <SVGSVGElement>canvas;
    if (this.svgRoot) {
      this.svgRoot.addEventListener('mousedown', this.mouseDown.bind(this), false);
      this.svgRoot.addEventListener('mouseup', this.reset.bind(this));
      this.svgRoot.addEventListener('mousemove', this.mouseMove.bind(this));
      this.svgRoot.addEventListener('mouseleave', this.reset.bind(this));
    }
  }

  private mouseDown(evt) {
    if (isDragging()) {
      return;
    }
    this.dragging = true;
    console.log('dragging canvas');
    this.mouseOffsetX = evt.clientX;
    this.mouseOffsetY = evt.clientY;
  }

  private reset(evt) {
    this.dragging = false;
    console.log('dragging canvas stopped');
  }

  private mouseMove(evt) {
    if (this.dragging) {
      let x = evt.clientX - this.mouseOffsetX;
      let y = evt.clientY - this.mouseOffsetY;
      const offset = new Point(x, y);
      const origin = this.graph.options.origin;
      this.graph.options.origin = offset.sum(origin);
      this.graph.draw();
      this.mouseOffsetX = evt.clientX;
      this.mouseOffsetY = evt.clientY;
    }
  }

}
