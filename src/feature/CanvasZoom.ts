import Graph from '../Graph';

export default class CanvasZoom {

  private graph: Graph;
  private svgRoot: SVGSVGElement;

  constructor(canvas: Element, graph: Graph) {
    this.graph = graph;
    this.svgRoot = <SVGSVGElement>canvas;
    if (this.svgRoot) {
      let mousewheel = 'onwheel' in document.createElement('div')
      ? 'wheel'
      : document.onmousewheel !== undefined
      ? 'mousewheel'
      : 'DOMMouseScroll'
      ;
      this.svgRoot.addEventListener(mousewheel, this.zoom.bind(this), false);
    }
  }

  private zoom(e) {

    let delta = e.deltaY || e.wheelDeltaY || -e.wheelDelta;
    let d = 1 + (delta / 1000);
    console.log(delta, d);

    let values = this.svgRoot.getAttribute('viewBox').split(' ');
    const newViewBox = `${values[0]} ${values[1]} ${parseInt(values[2]) * d} ${parseInt(values[3]) * d}`;
    this.svgRoot.setAttribute('viewBox', newViewBox);

    e.preventDefault();
  }

}
