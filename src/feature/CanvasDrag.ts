import Graph from '../Graph';
import { Point } from '../elements/BaseElements';
import { isDragging } from './listeners';

export default class CanvasDrag {

  private graph: Graph;
  private svgRoot: SVGSVGElement;
  private dragging = false;
  private mouseOffset = new Point(0, 0);
  private origOffset: Point;

  constructor(canvas: Element, graph: Graph) {
    this.graph = graph;
    this.origOffset = graph.options.origin;
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
    this.mouseOffset.x = evt.clientX;
    this.mouseOffset.y = evt.clientY;
  }

  private reset(evt) {
    this.dragging = false;
  }

  private mouseMove(evt) {
    if (this.dragging) {
      const x = evt.clientX - this.mouseOffset.x;
      const y = evt.clientY - this.mouseOffset.y;
      const newOrigin = this.graph.options.origin.add(new Point(x, y));

      let values = this.svgRoot.getAttribute('viewBox').split(' ');
      const newViewBox = `${newOrigin.x * -1} ${newOrigin.y * -1} ${values[2]} ${values[3]}`;
      this.svgRoot.setAttribute('viewBox', newViewBox);

      this.mouseOffset.x = evt.clientX;
      this.mouseOffset.y = evt.clientY;
    }
  }

}
