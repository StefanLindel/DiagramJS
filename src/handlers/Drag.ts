import { EventHandler, EventBus } from '../EventBus';
import { DiagramElement, Point } from '../elements/BaseElements';
import { GraphModel } from '../elements/Model';
import { Node } from '../elements/nodes';
import { Graph } from '../elements/Graph';
import { Control } from '../Control';
import { Util } from '../util';

export class Drag implements EventHandler {

    private element: DiagramElement;
    private svgElement: SVGSVGElement;
    private dragging = false;
    private reinsert = false;
    private mouseOffset = new Point();
    private graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    public handle(event: Event, element: DiagramElement): boolean {
        if (!this.canHandle()) {
            return true;
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
                    this.drag(event, element);
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
        if (active) {
            EventBus.setActiveHandler(Drag.name);
        }
        else {
            EventBus.releaseActiveHandler();
        }
    }

    private reset() {
        this.dragging = false;
        this.svgElement.style.cursor = 'pointer';

        /*  WORKAROUND
            Chrome got problem with the Node.appendChild() method.
            Sometimes it works, sometimes not.
            So the background is, in the drag method will the current element be appended
            to front of the svg root.
            If this happend, the click event won't fire.
            So it will be fired manually.
            This problem occurs only in chrome.
        */
        if(Util.isChrome()){
            let clickEvt = Util.createCustomEvent('click');
            this.svgElement.dispatchEvent(clickEvt);
        }
    }

    private start(evt: Event | any, element: Control) {

        this.dragging = true;
        this.mouseOffset.x = evt.clientX;
        this.mouseOffset.y = evt.clientY;
        this.reinsert = true;

        this.svgElement.style.cursor = 'move';
    }

    private drag(evt: Event | any, element: DiagramElement) {

        if (this.reinsert) {
            if (this.element.id !== 'RootElement') {
                // nesseccary to set the dragged object on top of svg children
                this.graph.root.appendChild(this.svgElement);
            }

            let dragEvent = Util.createCustomEvent('drag');
            element.$view.dispatchEvent(dragEvent);
        }
        this.reinsert = false;

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
        this.element.getPos().addNum(transX - sx, transY - sy);

        if (this.element instanceof Node) {
            (<Node>this.element).redrawEdges();
        }

        this.mouseOffset.x = evt.clientX;
        this.mouseOffset.y = evt.clientY;
    }
}
