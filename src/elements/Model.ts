import { Graph } from './Graph';
import { DiagramElement, Point } from './BaseElements';
import { Edge } from './edges';
import { Node } from './nodes';
import { Control } from '../Control';
import { Util } from '../util';
import { EventBus } from '../EventBus';

export class GraphModel extends DiagramElement {
    nodes: Node[] = [];
    edges: Edge[] = [];
    workspace: string;

    public load(data?: any) {
        data = data || {};
        this.property = data.type || data.property || 'classdiagram';
        this.id = 'RootElement';
        if (data.nodes) {
            for (let node of data.nodes) {
                this.addNode(node);
            }
        }
        if (data.edges) {
            for (let edge of data.edges) {
                this.addEdge(edge);
            }
        }
    }

    public getNodeByPosition(x: number, y: number) : Node{
        for (let node of this.nodes) {
            let posOfNode: Point = (<Node>node).getPos();
            let sizeOfNode: Point = (<Node>node).getSize();

            if ((posOfNode.x <= x && (posOfNode.x + sizeOfNode.x) >= x)
                && (posOfNode.y <= y && (posOfNode.y + sizeOfNode.y) >= y)) {
                    return node;
            }
        }

        return null;
    }

    public init(owner: Control, property?: string, id?: string): Control {
        super.init(owner, property, id);
        this.initCanvas();
        return this;
    }

    public addElement(type: string): boolean {
        type = Util.toPascalCase(type);
        let id = this.getNewId(type);
        let element = <DiagramElement>this.getElement(type, id, {});
        if (element) {
            return true;
        }
        return false;
    }

    public addElementWithValues(type: string, optionalValues: Object): DiagramElement {
        type = Util.toPascalCase(type);
        let id = this.getNewId(type);
        let element = <DiagramElement>this.getElement(type, id, {});

        // position
        if(optionalValues){
            if(optionalValues.hasOwnProperty('x') && optionalValues.hasOwnProperty('y')){
                let x = optionalValues['x'];
                let y = optionalValues['y'];
                element.withPos(x, y);
            }
        }

        return element;
    }

    public removeAllElements(): void {

        let nodesLength = this.nodes.length;
        for (let i = 0; i < nodesLength; i++) {
            this.removeElement(this.nodes[0].id);
        }
    }


    public removeElement(id: string): boolean {

        let element = this.getDiagramElementById(id);
        if(!element) return false;

        (<Graph>this.$owner).removeElement(element);

        if (element instanceof Node) {

            let idxOfNode = this.nodes.indexOf(element);
            if(idxOfNode > -1){
                this.nodes.splice(idxOfNode, 1);
            }

            while(element.$edges.length > 0){
                this.removeElement(element.$edges[0].id);
            }

            element.$edges = [];
        }
        else if (element instanceof Edge) {

            let idxOfEdge = this.edges.indexOf(element);
            if(idxOfEdge > -1){
                this.edges.splice(idxOfEdge, 1);
            }

            // remove from source
            idxOfEdge = element.$sNode.$edges.indexOf(element);
            if(idxOfEdge > -1){
                element.$sNode.$edges.splice(idxOfEdge, 1);
            }

            // remove from target
            idxOfEdge = element.$tNode.$edges.indexOf(element);
            if(idxOfEdge > -1){
                element.$tNode.$edges.splice(idxOfEdge, 1);
            }
            
        }
        return true;
    }

    public getSVG(): Element {

        const size = 10;
        const path = `M${-size} 0 L${+size} 0 M0 ${-size} L0 ${+size}`;

        const attr = {
            tag: 'path',
            id: 'origin',
            d: path,
            stroke: '#999',
            'stroke-width': '1',
            fill: 'none'
        };
        let shape = this.createShape(attr);

        const attrText = {
            tag: 'text',
            x: 0 - size,
            y: 0 - size / 1.5,
            'text-anchor': 'end',
            'font-family': 'Verdana',
            'font-size': '9',
            fill: '#999'
        };
        let text = this.createShape(attrText);
        text.textContent = '(0, 0)';

        let group = this.createShape({ tag: 'g' });
        group.appendChild(shape);
        group.appendChild(text);

        return group;
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTMOUSEDOWN, EventBus.ELEMENTMOUSEUP, EventBus.ELEMENTMOUSELEAVE, EventBus.ELEMENTMOUSEMOVE, EventBus.ELEMENTMOUSEWHEEL, EventBus.ELEMENTCLICK, EventBus.ELEMENTDRAG];
    }
    private initCanvas() {
        const graph = <Graph>this.$owner;
        graph.canvasSize = { width: graph.canvas.clientWidth, height: graph.canvas.clientHeight };
        graph.root = Util.createShape({
            tag: 'svg',
            id: 'root',
            width: graph.canvasSize.width,
            height: graph.canvasSize.height
            // FIXME,viewBox: `${this.$graph.options.origin.x * -1} ${this.$graph.options.origin.y * -1} ${this.$graph.canvasSize.width} ${this.$graph.canvasSize.height}`
        });
        this.$view = graph.root;
        graph.canvas.appendChild(graph.root);

        // add export toolbar
        graph.addLayerToolBar();

        let mousewheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
        EventBus.register(this, this.$view);
    }

    public getNewId(prefix?: string): string {
        let id = (prefix ? prefix.toLowerCase() + '-' : '') + Math.floor(Math.random() * 100000);
        return id;
    }

    private addNode(node: Node): Node {
        let type = node['type'] || node.property || 'Node';
        type = Util.toPascalCase(type);
        let id = node['name'] || this.getNewId(type);
        return <Node>this.getElement(type, id, node);
    }

    private getNodeById(id: string) : Node {

        for(let node of this.nodes){
            if (node.id === id) {
                return node;
            }
        }

        return undefined;
    }

    private getNodeByLabel(label: string): Node {
        for (let node of this.nodes) {
            if (node.label === label) {
                return node;
            }
        }
        return undefined;
    }

    public getEdgeById(id: string): Edge{
        for (let edge of this.edges) {
            if (edge.id === id) {
                return edge;
            }
        }
        return undefined;
    }

    public getDiagramElementById(id: string): DiagramElement{

        return this.getNodeById(id) || this.getEdgeById(id);
    }

    public addEdge(edge: any, withPosOfNodes?: boolean): Edge {
        let type = edge.type || 'Edge';
        type = Util.toPascalCase(type);
        let id = this.getNewId(type);

        let newEdge = <Edge>this.getElement(type, id, edge);
        newEdge.type = type;

        let source: Node;
        let sourceAsString: string = edge.source.id || edge.source;
        if(sourceAsString){
            source = this.getNodeByLabel(sourceAsString);
            if (!source) {
                source = <Node>this.getElement('Clazz', this.getNewId('Clazz'), { name: edge.source });
                source.init(this);
            }
        }

        let target: Node;
        let targetAsString: string = edge.target.id || edge.target;
        if(targetAsString){
            target = this.getNodeByLabel(targetAsString);
            if (!target) {
                target = <Node>this.getElement('Clazz', this.getNewId('Clazz'), { name: edge.target });
                target.init(this);
            }
        }
        

        newEdge.withItem(source, target);

        if(withPosOfNodes){
            let srcX = source.getPos().x + (source.getSize().x / 2);
            let srcY = source.getPos().y + (source.getSize().y / 2);
    
            let targetX = target.getPos().x + (target.getSize().x / 2);
            let targetY = target.getPos().y + (target.getSize().y / 2);

            newEdge.addPoint(srcX, srcY);
            newEdge.addPoint(targetX, targetY);
        }

        return newEdge;
    }

    private getElement(type: string, id: string, data: Object): DiagramElement {
        const graph = <Graph>this.$owner;
        if (graph.nodeFactory[type]) {
            let element: Node = new graph.nodeFactory[type](data);
            Util.initControl(this, element, type, id, data);
            this.nodes.push(element);
            return element;
        }
        if (graph.edgeFactory[type]) {
            let element: Edge = new graph.edgeFactory[type](data);
            Util.initControl(this, element, type, id, data);
            this.edges.push(element);
            return element;
        }
        return null;
    }
}
