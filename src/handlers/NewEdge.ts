import { DiagramElement } from '../elements/BaseElements';
import { Graph } from '../elements/Graph';
import { Util } from '../util';
import { Class } from '../elements/nodes/Class';
import { EventHandler, EventBus } from '../EventBus';
import { Association } from '../elements/index';
import { Node } from '../elements/nodes/index';

export class NewEdge implements EventHandler {
    private graph: Graph;
    private svgLine: SVGSVGElement;
    private isEdgeDrawing: boolean;
    private sourceNode: Node;
    private x: number;
    private y: number;

    private lastTargetNode: Node;

    constructor(graph: Graph) {
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
        let lineToX = Util.getEventX(evt);
        let lineToy = Util.getEventY(evt);

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

            this.graph.root.appendChild(shape);
            this.graph.root.appendChild(this.sourceNode.$view);
        }
        else {

            // set new L path
            this.svgLine.setAttributeNS(null, 'd', path);

            // get node from position
            let targetNode = this.graph.$graphModel.getNodeByPosition(Util.getEventX(evt), Util.getEventY(evt));

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
            this.graph.root.removeChild(this.svgLine);
            this.svgLine = null;
        }

        if (this.lastTargetNode) {
            this.lastTargetNode.$view.setAttributeNS(null, 'class', 'SVGClazz');
        }
    }

    private setNewEdgeToNode(event: Event | any): void {
        // get node from position
        let targetNode = this.graph.$graphModel
            .getNodeByPosition(Util.getEventX(event), Util.getEventY(event));

        if (!targetNode) {
            this.removeLine();

            return;
        }

        this.removeLine();
        let edgeType = this.sourceNode.$defaulEdgeType || 'Association';

        let jsonData = {
            type: edgeType,
            source: this.sourceNode.id,
            target: targetNode.id
        };

        let newEdge = this.graph.$graphModel.addEdge(<any>jsonData, true);
        this.graph.drawElement(newEdge);
    }

    private start(evt: Event | any, element: DiagramElement): void {

        if (this.isEdgeDrawing) {
            return;
        }
        this.isEdgeDrawing = true;
        this.sourceNode = element as Class;

        this.x = this.sourceNode.getPos().x + (this.sourceNode.getSize().x / 2);
        this.y = this.sourceNode.getPos().y + (this.sourceNode.getSize().y / 2);

        // TODO: get this into util or select
        let lastInlineEdit = document.getElementById('inlineEdit');
        if (lastInlineEdit) {
            document.body.removeChild(lastInlineEdit);
        }
    }
}
