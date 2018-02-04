import { Graph } from './Graph';
import { DiagramElement, Point } from './BaseElements';
import { Edge } from './edges';
import { Node } from './nodes';
import { Control } from '../Control';
import { Util } from '../util';
import { EventBus } from '../EventBus';

export class GraphModel extends DiagramElement {
    nodes: Object = {};
    edges: Object = {};
    private counter = 0;

    public load(data?: any) {
        data = data || {};
        this.property = data.type || 'classdiagram';
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
        for (let idx in this.nodes) {
            let node = this.nodes[idx];

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

        for (let idx in this.nodes) {
            this.removeElement(this.nodes[idx].id);
        }
    }

    public removeElement(id: string): boolean {
        if (this.nodes[id]) {
            let node = this.nodes[id];
            delete this.nodes[id];
            for (let edge of node.edges) {
                delete this.edges[edge.id];
            }
        }
        else if (this.edges[id]) {
            delete this.edges[id];
        }
        else {
            return false;
        }
        (<Graph>this.$owner).layout();
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

        let mousewheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
        EventBus.register(this, this.$view);
    }

    public getNewId(prefix?: string): string {
        this.counter++;
        let id = (prefix ? prefix.toLowerCase() + '-' : '') + Math.floor(Math.random() * 100000);
        return id;
    }

    private addNode(node: Node): Node {
        let type = node['type'] || node.property || 'Node';
        type = Util.toPascalCase(type);
        let id = node['name'] || this.getNewId(type);
        return <Node>this.getElement(type, id, node);
    }

    private findNodeById(id: string) {
        if (this.nodes[id]) {
            return this.nodes[id];
        }
        return false;
    }

    private findNodeByLabel(label: string): Node | null {
        for (let index in this.nodes) {
            let node = this.nodes[index];

            if (node.label === label) {
                return node;
            }
        }
        return null;
    }

    public addEdge(edge: any, withPosOfNodes?: boolean): Edge {
        let type = edge.type || 'Edge';
        type = Util.toPascalCase(type);
        let id = this.getNewId(type);

        let newEdge = <Edge>this.getElement(type, id, edge);
        newEdge.typ = type;
        let source: Node = this.findNodeByLabel(edge.source);
        if (!source) {
            source = new Node({ label: edge.source });
            source.init(this);
            this.addNode(source);
        }
        let target: Node = this.findNodeByLabel(edge.target);
        if (!target) {
            target = new Node({ label: edge.target });
            target.init(this);
            this.addNode(target);
        }
        newEdge.withItem(source, target);

        if(withPosOfNodes){
            let srcX = source.getPos().x + (source.getSize().x / 2);
            let srcY = source.getPos().y + (source.getSize().y / 2);
    
            let targetX = target.getPos().x + (target.getSize().x / 2);
            let targetY = target.getPos().y + (target.getSize().y / 2);
    
            // sort them by y coordinate
            if(srcY < targetY){
                newEdge.addPoint(srcX, srcY);
                newEdge.addPoint(targetX, targetY);
            }
            else{
                newEdge.addPoint(targetX, targetY);
                newEdge.addPoint(srcX, srcY);
            }
        }

        return newEdge;
    }

    private getElement(type: string, id: string, data: Object): DiagramElement {
        const graph = <Graph>this.$owner;
        if (graph.nodeFactory[type]) {
            let element: DiagramElement = new graph.nodeFactory[type](data);
            Util.initControl(this, element, type, id, data);
            this.nodes[id] = element;
            return element;
        }
        if (graph.edgeFactory[type]) {
            let element: DiagramElement = new graph.edgeFactory[type](data);
            Util.initControl(this, element, type, id, data);
            this.edges[id] = element;
            return element;
        }
        return null;
    }
}
