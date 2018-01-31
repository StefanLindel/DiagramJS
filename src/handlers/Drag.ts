import { EventHandler } from '../EventBus';
import { DiagramElement, Point } from '../elements/BaseElements';
import { GraphModel } from '../elements/Model';
import { Node } from '../elements/nodes';
import { Graph } from '../elements/Graph';
import { Control } from '../Control';

export class Drag implements EventHandler {

    private element: DiagramElement;
    private svgRoot: SVGSVGElement;
    private svgElement: SVGSVGElement;
    private nodeToDrag: Node;
    private dragging = false;
    private reinsert = false;
    private mouseOffset = new Point();
    private graph: Graph;

    constructor(graph: Graph) {
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        this.graph = graph;
    }

    public handle(event: Event, element: DiagramElement): boolean {
        if (!this.graph.isActiveHandler('Drag')) {
            return true;
        }

        if (this.svgRoot !== <SVGSVGElement><any>document.getElementById('root')) {
            this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        }

        switch (event.type) {
            case 'mousedown':
                if ((!this.dragging) && (element.id !== 'RootElement')) {
                    this.element = element;
                    this.svgElement = <SVGSVGElement>element.$view;
                    this.nodeToDrag = <Node>element;
                    this.start(event, element);
                    this.graph.setActiveHandler('Drag');
                }
                break;
            case 'mouseup':
                if (this.dragging) {
                    this.reset();
                }
                this.graph.releaseActiveHandler();

                break;
            case 'mousemove':
                if (this.dragging) {
                    this.drag(event, element);
                }
                break;
            case 'mouseleave':
                if (this.dragging) {
                    this.reset();
                }
                this.graph.releaseActiveHandler();
                break;
            default:
                break;
        }
        return true;
    }

    public isEnable(): boolean {
        return true;
    }

    private reset() {
        this.dragging = false;
        this.svgElement.style.cursor = 'pointer';
        this.svgRoot.style.cursor = 'default';
    }

    private start(evt: Event | any, element: Control) {

        this.dragging = true;
        this.mouseOffset.x = evt.clientX;
        this.mouseOffset.y = evt.clientY;

        if (this.element.id === 'RootElement') {
            this.svgRoot.style.cursor = 'move';
            this.svgRoot.style.cursor = 'grabbing';
            this.svgRoot.style.cursor = '-moz-grabbin';
            this.svgRoot.style.cursor = '-webkit-grabbing';
        }
        else {
            this.reinsert = true;
        }
    }

    private drag(evt: Event | any, element: DiagramElement) {
        if (this.reinsert) {
            if (this.element.id !== 'RootElement') {
                // nesseccary to set the dragged object on top of svg children
                this.svgRoot.appendChild(this.svgElement);
            }
        }
        this.reinsert = false;

        let dragEvent = new Event('drag');
        element.$view.dispatchEvent(dragEvent);

        evt.stopPropagation();

        const translation = this.svgElement.getAttributeNS(null, 'transform').slice(10, -1).split(' ');
        const sx = parseInt(translation[0]);
        let sy = 0;
        if (translation.length > 1) {
            sy = parseInt(translation[1]);
        }

        const transX = sx + evt.clientX - this.mouseOffset.x;
        const transY = sy + evt.clientY - this.mouseOffset.y;
        this.svgElement.setAttributeNS(null, 'transform', 'translate(' + transX + ' ' + transY + ')');
        this.nodeToDrag.getPos().addNum(transX - sx, transY - sy);
        this.nodeToDrag.redrawEdges();

        this.mouseOffset.x = evt.clientX;
        this.mouseOffset.y = evt.clientY;
    }

}
