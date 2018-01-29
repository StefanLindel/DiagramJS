import { DiagramElement } from '../elements/BaseElements';
import { Graph } from '../elements/Graph';
import { Util } from '../util';
import { Clazz } from '../elements/nodes/Clazz';
import { EventHandler } from '../EventBus';
import { Edge } from '../elements/index';

export class NewEdge implements EventHandler {
    private graph: Graph;
    private svgRoot: SVGSVGElement;
    private svgLine: SVGSVGElement;
    private isEdgeDrawing: boolean;
    private sourceNode: Clazz;
    private x: number;
    private y: number;

    private lastHighlightedNode: Element;

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

        if (!(<KeyboardEvent>event).ctrlKey) {
            this.removeLine();
            return true;
        }

        // draw a new edge

        switch (event.type) {
            case 'mousedown':
                if (element instanceof Clazz) {
                    this.start(event, element);
                }
                break;

            case 'mousemove':
                this.drawEdge(event, element);
                break;
            case 'mouseleave':
                break;
            case 'mouseup':
                this.setNewEdgeToNode(event);
                break;

            default: break;
        }

        return true;
    }

    private drawEdge(evt: Event | any, element: DiagramElement): void {

        if (!this.isEdgeDrawing) {
            return;
        }
        let lineToX = evt.layerX;
        let lineToy = evt.layerY;

        let path = `M${this.x} ${this.y} L${lineToX} ${lineToy}`;
        // if line wasnt draw
        if (!this.svgLine) {

            let attr = {
                tag: 'path',
                id: 'newLine',
                d: path,
                stroke: 'black',
                'stroke-width': '2',
                fill: 'none'
            };


            let shape = Util.createShape(attr);
            this.svgRoot.appendChild(shape);
            this.svgLine = shape;
        }
        else {

            // set new L path
            this.svgLine.setAttributeNS(null, 'd', path);

            // get node from position
            let targetNode = this.graph.$graphModel.getNodeByPosition(evt.layerX, evt.layerY);

            // if some targetnode is available, so highlight the node
            if(targetNode){

                // reset the last one
                if (this.lastHighlightedNode !== <Element>targetNode.$view.childNodes[0] && this.lastHighlightedNode) {
                    this.lastHighlightedNode.setAttributeNS(null, 'class', 'SVGClazz');
                }

                this.lastHighlightedNode = <Element>targetNode.$view.childNodes[0];
                this.lastHighlightedNode.setAttributeNS(null, 'class', 'SVGClazz-drawedge');
            }
            else if(this.lastHighlightedNode) {
                this.lastHighlightedNode.setAttributeNS(null, 'class', 'SVGClazz');
            }
        }
    }

    private removeLine(): void {
        this.isEdgeDrawing = false;        

        if (this.svgLine) {
            this.svgRoot.removeChild(this.svgLine);
            this.svgLine = null;
        }
    }

    private setNewEdgeToNode(event: Event | any): void {
        // get node from position
        let targetNode = this.graph.$graphModel.getNodeByPosition(event.layerX, event.layerY);

        if (!targetNode) {
            this.removeLine();

            return;
        }

        let edgeType = this.sourceNode.defaulEdgeType || 'Edge';

        let jsonData = {
            type: edgeType,
            source: this.sourceNode.label,
            target: targetNode.label
        };

        this.removeLine();

        this.graph.$graphModel.addEdge(<any>jsonData);
        this.graph.layout();
    }

    private start(evt: Event | any, element: DiagramElement): void {

        if (this.isEdgeDrawing) {
            return;
        }
        this.isEdgeDrawing = true;
        this.sourceNode = element as Clazz;

        this.x = evt.layerX;
        this.y = evt.layerY;

        // highlight the start node

    }
}
