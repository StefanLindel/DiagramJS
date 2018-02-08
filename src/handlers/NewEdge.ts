import { DiagramElement } from '../elements/BaseElements';
import { Graph } from '../elements/Graph';
import { Util } from '../util';
import { Clazz } from '../elements/nodes/Clazz';
import { EventHandler, EventBus } from '../EventBus';
import { Edge } from '../elements/index';
import { Node } from '../elements/nodes/index';

export class NewEdge implements EventHandler {
    private graph: Graph;
    private svgRoot: SVGSVGElement;
    private svgLine: SVGSVGElement;
    private isEdgeDrawing: boolean;
    private sourceNode: Node;
    private x: number;
    private y: number;

    private lastTargetNode: Node;

    constructor(graph: Graph) {
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        this.graph = graph;
    }

    public setActive(active: boolean): void {
        if (active) {
            EventBus.setActiveHandler(NewEdge.name);
        }
        else {
            EventBus.releaseActiveHandler();
        }
    }

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(NewEdge.name);
    }

    public handle(event: Event, element: DiagramElement): boolean {

        if (this.svgRoot !== <SVGSVGElement><any>document.getElementById('root')) {
            this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        }

        if (!((<KeyboardEvent>event).ctrlKey || EventBus.isHandlerActiveOrFree('NewEdge', true))) {
            this.removeLine();
            return true;
        }

        switch (event.type) {
            case 'mousedown':
                if (element instanceof Node) {
                    this.start(event, element);
                    this.setActive(true);
                }
                break;

            case 'mousemove':
                this.drawEdge(event, element);
                break;
            case 'mouseleave':
                this.setActive(false);
                break;
            case 'mouseup':
                this.setNewEdgeToNode(event);
                this.setActive(false);
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
                id: 'newEdgePath',
                d: path,
                class: 'SVGEdge'
            };


            let shape = Util.createShape(attr);
            this.svgLine = shape;

            this.svgRoot.appendChild(shape);
            this.svgRoot.appendChild(this.sourceNode.$view);
        }
        else {

            // set new L path
            this.svgLine.setAttributeNS(null, 'd', path);

            // get node from position
            let targetNode = this.graph.$graphModel.getNodeByPosition(evt.layerX, evt.layerY);

            // if some targetnode is available, so highlight the node
            if (targetNode) {

                // reset the last one
                if (this.lastTargetNode && this.lastTargetNode.id !== targetNode.id) {
                    this.lastTargetNode.$view.setAttributeNS(null, 'class', 'SVGClazz');
                }

                this.lastTargetNode = targetNode;
                this.lastTargetNode.$view.setAttributeNS(null, 'class', 'SVGClazz-drawedge');
            }
            else if (this.lastTargetNode) {
                this.lastTargetNode.$view.setAttributeNS(null, 'class', 'SVGClazz');
            }
        }
    }

    private removeLine(): void {
        this.isEdgeDrawing = false;

        if (this.svgLine) {
            this.svgRoot.removeChild(this.svgLine);
            this.svgLine = null;
        }

        if (this.lastTargetNode) {
            this.lastTargetNode.$view.setAttributeNS(null, 'class', 'SVGClazz');
        }
    }

    private setNewEdgeToNode(event: Event | any): void {
        // get node from position
        let targetNode = this.graph.$graphModel.getNodeByPosition(event.layerX, event.layerY);

        if (!targetNode) {
            this.removeLine();

            return;
        }

        this.removeLine();

        // TODO: show combobox of all available edge types
        let edgeType = this.sourceNode.$defaulEdgeType || 'Edge';

        let jsonData = {
            type: edgeType,
            source: this.sourceNode.label,
            target: targetNode.label
        };

        let newEdge = this.graph.$graphModel.addEdge(<any>jsonData, true);
        this.graph.drawElement(newEdge);
    }

    private start(evt: Event | any, element: DiagramElement): void {

        if (this.isEdgeDrawing) {
            return;
        }
        this.isEdgeDrawing = true;
        this.sourceNode = element as Clazz;

        this.x = this.sourceNode.getPos().x + (this.sourceNode.getSize().x / 2);
        this.y = this.sourceNode.getPos().y + (this.sourceNode.getSize().y / 2);

        // TODO: highlight the start node

    }
}
