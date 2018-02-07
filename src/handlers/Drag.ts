import { EventHandler, EventBus } from '../EventBus';
import { DiagramElement, Point } from '../elements/BaseElements';
import { GraphModel } from '../elements/Model';
import { Node } from '../elements/nodes';
import { Graph } from '../elements/Graph';
import { Control } from '../Control';

export class Drag implements EventHandler {

    private element: DiagramElement;
    private svgRoot: SVGSVGElement;
    private svgElement: SVGSVGElement;
    private dragging = false;
    private reinsert = false;
    private mouseOffset = new Point();
    private graph: Graph;

    constructor(graph: Graph) {
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        this.graph = graph;
    }

    public handle(event: Event, element: DiagramElement): boolean {
        if (!this.canHandle()) {
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
                    this.start(event, element);
                    this.setActive(true);
                }
                break;
            case 'mouseup':
                if (this.dragging) {
                    this.reset();
                }
                this.setActive(false);

                break;
            case 'mousemove':
                if (this.dragging) {
                    return this.drag(event, element);
                }
                break;
            case 'mouseleave':
                if (this.dragging) {
                    this.reset();
                }
                this.setActive(false);
                break;
            default:
                break;
        }
        return true;
    }

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(Drag.name);
    }

    public setActive(active: boolean): void {
        if(active){
            EventBus.setActiveHandler(Drag.name);
        }
        else{
            EventBus.releaseActiveHandler();
        }
    }

    private reset() {
        this.dragging = false;
        this.svgElement.style.cursor = 'pointer';
    }

    private start(evt: Event | any, element: Control) {

        this.dragging = true;
        this.mouseOffset.x = evt.clientX;
        this.mouseOffset.y = evt.clientY;
        this.reinsert = true;
        this.svgElement.style.cursor = 'move';
    }

    private drag(evt: Event | any, element: DiagramElement): boolean {
        if (this.reinsert) {
            if (this.element.id !== 'RootElement') {
                // nesseccary to set the dragged object on top of svg children
                this.svgRoot.appendChild(this.svgElement);

                let dragEvent = new Event('click');
                element.$view.dispatchEvent(dragEvent);

                return false;
            }
        }
        this.reinsert = false;

/*        if (evt.type !== 'mousemove' ) {
            let dragEvent = new Event('drag');
            element.$view.dispatchEvent(dragEvent);
        }*/

        const translation = this.svgElement.getAttributeNS(null, 'transform').slice(10, -1).split(' ');
        const sx = parseInt(translation[0]);
        let sy = 0;
        if (translation.length > 1) {
            sy = parseInt(translation[1]);
        }

        const transX = sx + evt.clientX - this.mouseOffset.x;
        const transY = sy + evt.clientY - this.mouseOffset.y;
        this.svgElement.setAttributeNS(null, 'transform', 'translate(' + transX + ' ' + transY + ')');
        this.element.getPos().addNum(transX - sx, transY - sy);

        if(this.element instanceof Node){
            (<Node>this.element).redrawEdges();
        }

        this.mouseOffset.x = evt.clientX;
        this.mouseOffset.y = evt.clientY;

        return true;
    }
}
