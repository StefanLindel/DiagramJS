import { EventHandler } from '../EventBus';
import { DiagramElement, Point } from '../elements/BaseElements';
import { GraphModel } from '../elements/Model';
import { Node } from '../elements/nodes';
import { Graph } from '../elements/Graph';
import { Control } from '../Control';
import { Util } from '../util';

export class AddNode implements EventHandler {

    public MIN_SIZE_TO_ADD_NODE : number = 10;
    private graph: Graph;
    private svgRoot: SVGSVGElement;
    private svgRect: SVGSVGElement;
    private isRectDrawing: boolean;
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

        if (this.svgRoot !== <SVGSVGElement><any>document.getElementById('root')) {
            this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        }

        if(element.id !== 'RootElement'){
            return false;
        }

        switch (event.type) {
            case 'mousedown':
            if(element.id === 'RootElement'){
                this.start(event, element);
            }
                break;
            case 'mousemove':
                this.drawRect(event, element);
                break;
            case 'mouseleave':
                break;
            case 'mouseup':
                this.addNode();
                break;

            default: break;
        }

        return true;
    }

    private drawRect(evt: Event | any, element: DiagramElement): void {

        if (!this.isRectDrawing) {
            return;
        }
        let width = evt.layerX-this.x;
        let height = evt.layerY-this.y;

        if(width > this.MIN_SIZE_TO_ADD_NODE && height > this.MIN_SIZE_TO_ADD_NODE){
            this.isBigEnoughForAddNode = true;
        }
        else{
            this.isBigEnoughForAddNode = false;
        }

        this.svgRoot.style.cursor = 'pointer';

        // if line wasnt draw
        if (!this.svgRect) {

            let rectAddNode = {
                tag: 'rect',
                id: 'addNodeRect',
                x: this.x,
                y: this.y,
                width: 1,
                height: 1,
                stroke: 'blue',
                'stroke-width': '2',
                fill: 'none'
            };

            let textAddNode = {
                tag: 'text',
                x: this.x,
                y: this.y,
                'text-anchor': 'middle',
                'alignment-baseline': 'central',
                'font-family': 'Verdana',
                'font-size': 14,
                'font-weight': 'bold',
                fill: 'black'
            }

            let group = Util.createShape({ tag: 'g', id: 'groupAddNode', transform: 'translate(0 0)' });
            group.appendChild(rectAddNode);
            group.appendChild(label);

            let shape = Util.createShape(rectAddNode);
            this.svgRoot.appendChild(shape);
            this.svgRect = shape;
        }
        else {

            // set width and height
            this.svgRect.setAttributeNS(null, 'width', width.toString());
            this.svgRect.setAttributeNS(null, 'height', height.toString());
        }
    }

    private removeRect(): void {
        this.isRectDrawing = false;    
        this.isBigEnoughForAddNode = false;

        if (this.svgRect) {
            this.svgRoot.removeChild(this.svgRect);
            this.svgRect = null;
        }
        
    }

    private addNode(): void{

        if(!this.isBigEnoughForAddNode){
            this.removeRect();
            return;
        }

        this.removeRect();
        this.graph.addElement('Clazz');
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
