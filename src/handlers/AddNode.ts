import { EventHandler, EventBus } from '../EventBus';
import { DiagramElement } from '../elements/BaseElements';
import { Graph } from '../elements/Graph';
import { Util } from '../util';
import { Node } from '../elements/nodes/index';

export class AddNode implements EventHandler {

    public MIN_SIZE_TO_ADD_NODE: number = 30;
    public MIN_SIZE_TO_ADD_TEXT: number = 10;
    private graph: Graph;
    private svgRect: SVGSVGElement;
    private svgGroupAddNode: SVGSVGElement;
    private svgTextAddNode: SVGSVGElement;
    private svgTextRectAddNode: SVGSVGElement;
    private isRectDrawing: boolean;
    private isDrawToLeft: boolean;
    private isDrawToTop: boolean;
    private isBigEnoughForAddNode: boolean;
    private x: number;
    private y: number;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(AddNode.name);
    }

    public setActive(active: boolean): void {
        if (active) {
            EventBus.setActiveHandler(AddNode.name);
        }
        else {
            EventBus.releaseActiveHandler();
        }
    }

    public handle(event: Event, element: DiagramElement): boolean {

        if (!this.canHandle()) {

            return true;
        }

        if (element.id !== 'RootElement') {
            return false;
        }

        switch (event.type) {
            case 'mousedown':
                if (element.id === 'RootElement') {
                    this.start(event, element);

                    this.setActive(true);
                }
                break;
            case 'mousemove':
                this.drawRect(event, element);
                break;
            case 'mouseleave':
                this.removeRect();
                this.setActive(false);
                break;
            case 'mouseup':
                this.addNode();
                this.setActive(false);
                break;

            default:
                break;
        }

        return true;
    }

    private drawRect(evt: Event | any, element: DiagramElement): void {

        if (!this.isRectDrawing) {
            return;
        }

        evt.stopPropagation();

        let width = Util.getEventX(evt) - this.x;
        let height = Util.getEventY(evt) - this.y;

        // rectangle is in a negative area, drawn to upper case. not possibble with svg
        if (width < 0) {
            this.isDrawToLeft = true;
            width *= -1;
        } else {
            this.isDrawToLeft = false;
        }

        if (height < 0) {
            this.isDrawToTop = true;
            height *= -1;
        } else {
            this.isDrawToTop = false;
        }

        if (width > this.MIN_SIZE_TO_ADD_NODE && height > this.MIN_SIZE_TO_ADD_NODE) {
            this.isBigEnoughForAddNode = true;
        } else {
            this.isBigEnoughForAddNode = false;
        }

        this.graph.root.style.cursor = 'pointer';

        // if line wasnt draw
        if (!this.svgRect) {

            let rectAddNode = Util.createShape({
                tag: 'rect',
                id: 'addNodeRect',
                x: this.x,
                y: this.y,
                width: 1,
                height: 1,
                class: 'SVGAddNode'
            });

            let group = Util.createShape({ tag: 'g', id: 'groupAddNode' });
            group.appendChild(rectAddNode);

            this.graph.root.appendChild(group);
            this.svgRect = rectAddNode;
            this.svgGroupAddNode = group;
        }
        else {

            let svgRectBBox = this.svgRect.getBBox();

            // if rect is big enough, show text as helper
            if ((svgRectBBox.width > this.MIN_SIZE_TO_ADD_TEXT
                || svgRectBBox.height > this.MIN_SIZE_TO_ADD_TEXT) && !this.svgTextAddNode) {

                let textAddNode = Util.createShape({
                    tag: 'text',
                    x: this.x,
                    y: this.y - 5,
                    'font-family': 'Verdana',
                    'font-size': 12,
                    fill: 'black'
                });
                textAddNode.textContent = 'Hold on and move to create a new class';
                this.svgGroupAddNode.appendChild(textAddNode);


                // get correct size of text node
                let sizeClientRect: ClientRect = textAddNode.getBoundingClientRect();

                let rectBackgroundForText = Util.createShape({
                    tag: 'rect',
                    x: this.x,
                    y: this.y - sizeClientRect.height,
                    width: sizeClientRect.width,
                    height: sizeClientRect.height,
                    fill: '#DDD',
                    'stroke-width': 0
                });

                this.svgTextRectAddNode = rectBackgroundForText;
                this.svgTextAddNode = textAddNode;
                this.svgGroupAddNode.appendChild(rectBackgroundForText);
                this.svgGroupAddNode.appendChild(textAddNode);
            }

            if (this.isDrawToLeft) {
                this.svgRect.setAttributeNS(null, 'x', '' + Util.getEventX(evt));
            }

            if (this.isDrawToTop) {
                this.svgRect.setAttributeNS(null, 'y', '' + Util.getEventY(evt));
            }

            // set width and height
            this.svgRect.setAttributeNS(null, 'width', width.toString());
            this.svgRect.setAttributeNS(null, 'height', height.toString());

            // set color
            if (this.isBigEnoughForAddNode) {
                this.svgRect.setAttributeNS(null, 'class', 'SVGAddNode-ready');

                // draw text
            }
            else {
                this.svgRect.setAttributeNS(null, 'class', 'SVGAddNode');
            }
        }
    }

    private removeRect(): void {
        this.isRectDrawing = false;
        this.isBigEnoughForAddNode = false;

        this.graph.root.style.cursor = 'default';

        if (this.svgGroupAddNode) {
            this.graph.root.removeChild(this.svgGroupAddNode);
            this.svgGroupAddNode = undefined;
        }

        if (this.svgRect) {
            this.svgRect = undefined;
        }

        if (this.svgTextAddNode) {
            this.svgTextAddNode = undefined;
        }

        if (this.svgTextRectAddNode) {
            this.svgTextRectAddNode = undefined;
        }
    }

    private addNode(): void {

        if (!this.isBigEnoughForAddNode) {
            this.removeRect();
            return;
        }

        this.removeRect();
        let node = this.graph.addElementWithValues('Class', { x: this.x, y: this.y });
        this.graph.drawElement(node);
    }

    private start(evt: Event | any, element: DiagramElement): void {

        if (this.isRectDrawing) {
            return;
        }
        this.isRectDrawing = true;

        this.x = Util.getEventX(evt);
        this.y = Util.getEventY(evt);
    }

}
