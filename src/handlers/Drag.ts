import { EventHandler } from '../EventBus';
import {DiagramElement, Point} from '../elements/BaseElements';
import {Model} from '../elements/Model';
import {Node} from '../elements/nodes';
import {Graph} from '../elements/Graph';

export class Drag {

    private element: DiagramElement;
    private svgRoot: SVGSVGElement;
    private svgElement: SVGSVGElement;
    private dragging = false;
    private reinsert = false;
    private mouseOffset = new Point();

    constructor() {
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
    }

    public handle(event: Event, element: DiagramElement): boolean {
        // event.stopPropagation();
        switch (event.type) {
            case 'mousedown':
                if ((!this.dragging) || (element.id !== 'RootElement')) {
                    this.element = element;
                    this.svgElement = <SVGSVGElement>element.$viewElement;
                    this.start(event, element);
                }
                break;
            case 'mouseup':
                if (this.dragging) {
                    this.reset();
                }
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

    private start(evt, element) {
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

    private drag(evt, element: DiagramElement) {
        if (this.reinsert) {
            if (this.element.id !== 'RootElement') {
                this.svgRoot.appendChild(this.svgElement);
            }
            this.reinsert = false;

            let dragEvent = new Event('drag');
            element.$viewElement.dispatchEvent(dragEvent);
        }
        if (element.id === 'RootElement') {
            if (element.id !== this.element.id) {
                return;
            }
            let model = <Model>this.element;
            const x = evt.clientX - this.mouseOffset.x;
            const y = evt.clientY - this.mouseOffset.y;
            const newOrigin = (<Graph>model.$owner).options.origin.add(new Point(x, y));
            let values = this.svgRoot.getAttribute('viewBox').split(' ');
            const newViewBox = `${newOrigin.x * -1} ${newOrigin.y * -1} ${values[2]} ${values[3]}`;
            this.svgRoot.setAttribute('viewBox', newViewBox);
        }
        else {
            let node = <Node>element;
            const translation = this.svgElement.getAttributeNS(null, 'transform').slice(10, -1).split(' ');
            const sx = parseInt(translation[0]);
            const sy = parseInt(translation[1]);
            const transX = sx + evt.clientX - this.mouseOffset.x;
            const transY = sy + evt.clientY - this.mouseOffset.y;
            this.svgElement.setAttributeNS(null, 'transform', 'translate(' + transX + ' ' + transY + ')');
            node.getPos().addNum(transX - sx, transY - sy);
            node.redrawEdges();
        }
        this.mouseOffset.x = evt.clientX;
        this.mouseOffset.y = evt.clientY;
    }

}
