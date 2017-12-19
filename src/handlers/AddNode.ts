import { EventHandler } from '../EventBus';
import { DiagramElement, Point } from '../elements/BaseElements';
import { GraphModel } from '../elements/Model';
import { Node } from '../elements/nodes';
import { Graph } from '../elements/Graph';
import { Control } from '../Control';
import { Util } from '../util';

export class AddNode implements EventHandler {

    public MIN_SIZE_TO_ADD_NODE : number = 30;
    private graph: Graph;
    private svgRoot: SVGSVGElement;
    private svgRect: SVGSVGElement;
    private svgRectWithText: SVGSVGElement;
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

        evt.stopPropagation();

        let width = evt.layerX-this.x;
        let height = evt.layerY-this.y;

        if(width < 0 || height < 0){
            return;
        }

        if(width > this.MIN_SIZE_TO_ADD_NODE && height > this.MIN_SIZE_TO_ADD_NODE){
            this.isBigEnoughForAddNode = true;
        }
        else{
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
                stroke: 'rgba(0,0,255,1)',
                'stroke-width': '1',
                fill: 'rgba(0,0,255,0.225)'
            });

            let textAddNode = Util.createShape({
                tag: 'text',
                x: this.x+33,
                y: (this.y-10),
                'text-anchor': 'middle',
                'alignment-baseline': 'central',
                'font-family': 'Verdana',
                'font-size': 12,
                fill: 'black'
            });
            textAddNode.textContent = 'Create new';

            let group = Util.createShape({ tag: 'g', id: 'groupAddNode', transform: 'translate(0 0)' });
            group.appendChild(rectAddNode);
            group.appendChild(textAddNode);

            // let shape = Util.createShape(rectAddNode);
            this.svgRoot.appendChild(group);
            this.svgRect = rectAddNode;
            this.svgRectWithText = group;
        }
        else {

            // set width and height
            this.svgRect.setAttributeNS(null, 'width', width.toString());
            this.svgRect.setAttributeNS(null, 'height', height.toString());

            // set color
            if(this.isBigEnoughForAddNode){
                this.svgRect.setAttributeNS(null, 'stroke', 'rgba(0,255,0,1)');
                this.svgRect.setAttributeNS(null, 'fill', 'rgba(0,255,0,0.225)');
            }
            else{
                this.svgRect.setAttributeNS(null, 'stroke', 'rgba(0,0,255,1)');
                this.svgRect.setAttributeNS(null, 'fill', 'rgba(0,0,255,0.225)');
            }
        }
    }

    private removeRect(): void {
        this.isRectDrawing = false;    
        this.isBigEnoughForAddNode = false;

        if (this.svgRectWithText) {
            this.svgRoot.removeChild(this.svgRectWithText);
            this.svgRectWithText = null;
        }

        if(this.svgRect){
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
