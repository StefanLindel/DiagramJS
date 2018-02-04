import { EventHandler } from '../EventBus';
import { DiagramElement } from '../elements/BaseElements';
import { Graph } from '../elements/Graph';
import { Util } from '../util';
import { Node } from '../elements/nodes/index';

export class AddNode implements EventHandler {

    public MIN_SIZE_TO_ADD_NODE: number = 30;
    public MIN_SIZE_TO_ADD_TEXT: number = 10;
    private graph: Graph;
    private svgRoot: SVGSVGElement;
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
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        this.graph = graph;
    }

    public isEnable(): boolean {
        return true;
    }

    public handle(event: Event, element: DiagramElement): boolean {

        if (!this.graph.isActiveHandler('AddNode')) {

            return true;
        }

        //TODO: is this neccessary?
        if (this.svgRoot !== <SVGSVGElement><any>document.getElementById('root')) {
            this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        }

        if (element.id !== 'RootElement') {
            return false;
        }

        switch (event.type) {
            case 'mousedown':
                if (element.id === 'RootElement') {
                    this.start(event, element);

                    this.graph.setActiveHandler('AddNode');
                }
                break;
            case 'mousemove':
                this.drawRect(event, element);
                break;
            case 'mouseleave':
                this.removeRect();

                this.graph.releaseActiveHandler();
                break;
            case 'mouseup':
                this.addNode();
                this.graph.releaseActiveHandler();
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

        let width = evt.layerX - this.x;
        let height = evt.layerY - this.y;

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

        this.svgRoot.style.cursor = 'pointer';

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

            let group = Util.createShape({ tag: 'g', id: 'groupAddNode', transform: 'translate(0 0)' });
            group.appendChild(rectAddNode);

            this.svgRoot.appendChild(group);
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
                    x: this.x + 120,
                    y: (this.y - 10),
                    'text-anchor': 'middle',
                    'alignment-baseline': 'central',
                    'font-family': 'Verdana',
                    'font-size': 12,
                    fill: 'black'
                });
                textAddNode.textContent = 'Hold on and move to create a new class';
                this.svgGroupAddNode.appendChild(textAddNode);


                //TODO: get correct size of text node
                let sizeClientRect: ClientRect = textAddNode.getBoundingClientRect();

                let rectBackgroundForText = Util.createShape({
                    tag: 'rect',
                    x: this.x,
                    y: (this.y - 15),
                    width: sizeClientRect.width + 10,
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
                this.svgRect.setAttributeNS(null, 'x', evt.layerX);
            }

            if (this.isDrawToTop) {
                this.svgRect.setAttributeNS(null, 'y', evt.layerY);
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

        if (this.svgGroupAddNode) {
            this.svgRoot.removeChild(this.svgGroupAddNode);
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
        let node = this.graph.addElementWithValues('Clazz', { x: this.x, y: this.y });
        this.graph.drawElement(node);
    }

    private start(evt: Event | any, element: DiagramElement): void {

        if (this.isRectDrawing) {
            return;
        }
        this.isRectDrawing = true;

        this.x = evt.layerX;
        this.y = evt.layerY;
    }

}
