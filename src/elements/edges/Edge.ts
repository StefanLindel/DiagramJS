import { DiagramElement, Line, Point } from '../BaseElements';
import { Node } from '../nodes';
import { InfoText } from '../nodes/InfoText';
import { Util } from '../../util';
import { EventBus } from '../../EventBus';
import * as edges from '../edges';
import { Graph } from '../Graph';
import { Generalisation, Association } from '../edges';

export const enum Direction {
    Up, Down, Left, Right
}

export class Edge extends DiagramElement {
    public source: string;
    public target: string;
    public type: string;
    public $sNode: Node;
    public $tNode: Node;
    public lineStyle: string;
    public $points: Point[] = [];
    public $pathSvg: Element;
    public $pathWideSvg: Element;
    public info: InfoText;
    public sourceInfo: InfoText;
    public targetInfo: InfoText;
    $m: number;
    $n: number;

    constructor(data: JSON | string | Object | any) {
        super();

        this.withData(data);
    }

    public withData(data: JSON | string | Object | any): Edge {

        if (!data) {
            return this;
        }
        let srcInfo;
        let trgInfo;

        if (data.source && typeof data.source !== 'string') {
            srcInfo = data.source;
        }
        else if (data.sourceInfo && typeof data.sourceInfo !== 'string') {
            srcInfo = data.sourceInfo;
        }

        if (srcInfo) {
            this.sourceInfo = new InfoText(srcInfo);
            this.sourceInfo.$owner = this;
        }


        if (data.target && typeof data.target !== 'string') {
            trgInfo = data.target;
        }
        else if (data.targetInfo && typeof data.targetInfo !== 'string') {
            trgInfo = data.targetInfo;
        }

        if (trgInfo) {
            this.targetInfo = new InfoText(trgInfo);
            this.targetInfo.$owner = this;
        }

        return this;
    }

    public updateSrcCardinality(cardinality: string): void {
        this.sourceInfo = this.updateCardinality(this.$sNode, this.sourceInfo, cardinality);
        this.redrawSourceInfo();

        Util.saveToLocalStorage(this.$owner);
    }

    public updateTargetCardinality(cardinality: string): void {
        this.targetInfo = this.updateCardinality(this.$tNode, this.targetInfo, cardinality);
        this.redrawTargetInfo();

        Util.saveToLocalStorage(this.$owner);
    }

    private updateCardinality(node: Node, infoText: InfoText, cardinality: string): InfoText {
        if (!infoText) {
            infoText = new InfoText({ 'cardinality': cardinality });
            infoText.$owner = this;

            let calcPos = this.calcInfoPosNew(infoText, node);
            infoText.withPos(calcPos.x, calcPos.y);
            this.$view.appendChild(infoText.getSVG());

            return infoText;
        }

        infoText.cardinality = cardinality;
        if (infoText.isEmpty()) {
            this.$view.removeChild(infoText.$view);

            return undefined;
        }

        infoText.updateCardinality(cardinality);

        return infoText;
    }

    public updateSrcProperty(property: string): void {
        this.sourceInfo = this.updateProperty(this.$sNode, this.sourceInfo, property);
        this.redrawSourceInfo();

        Util.saveToLocalStorage(this.$owner);
    }

    public updateTargetProperty(property: string): void {
        this.targetInfo = this.updateProperty(this.$tNode, this.targetInfo, property);
        this.redrawTargetInfo();

        Util.saveToLocalStorage(this.$owner);
    }

    private updateProperty(node: Node, infoText: InfoText, property: string): InfoText {
        if (!infoText) {
            infoText = new InfoText({ 'property': property });
            infoText.$owner = this;

            let calcPos = this.calcInfoPosNew(infoText, node);
            infoText.withPos(calcPos.x, calcPos.y);
            this.$view.appendChild(infoText.getSVG());

            return infoText;
        }

        infoText.property = property;
        if (infoText.isEmpty()) {
            this.$view.removeChild(infoText.$view);

            return undefined;
        }

        infoText.updateProperty(property);

        return infoText;
    }

    public withItem(source: Node, target: Node): Edge {
        source.$edges.push(this);
        target.$edges.push(this);
        this.$sNode = source;
        this.$tNode = target;
        this.source = source.label;
        this.target = target.label;
        return this;
    }

    public getSVG(): Element {
        let group = Util.createShape({ tag: 'g', id: this.id, class: 'SVGEdge' });

        let path: string = this.getPath();
        let attr = {
            tag: 'path',
            d: path,
            fill: 'none'
        };
        let pathLine = this.createShape(attr);

        attr['style'] = 'stroke-width:20;opacity:0';
        let extendedPathLine = Util.createShape(attr);

        group.appendChild(extendedPathLine);
        group.appendChild(pathLine);

        if (this.sourceInfo) {
            let calcPos = this.calcInfoPosNew(this.sourceInfo, this.$sNode);
            this.sourceInfo.withPos(calcPos.x, calcPos.y);
            group.appendChild(this.sourceInfo.getSVG());
        }
        if (this.targetInfo) {
            let calcPos = this.calcInfoPosNew(this.targetInfo, this.$tNode);
            this.targetInfo.withPos(calcPos.x, calcPos.y);
            group.appendChild(this.targetInfo.getSVG());
        }

        this.$pathWideSvg = extendedPathLine;
        this.$pathSvg = pathLine;
        this.$view = group;

        return group;
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTCLICK, EventBus.ELEMENTDBLCLICK, EventBus.EDITOR, EventBus.OPENPROPERTIES];
    }

    public convertEdge(type: string, newId: string, redraw?: boolean): Edge {
        if (!edges[type]) {
            return this;
        }

        let newEdge: Edge = new edges[type]();
        newEdge.withItem(this.$sNode, this.$tNode);
        newEdge.id = newId;
        newEdge.type = type;
        newEdge.lineStyle = this.lineStyle;
        newEdge.$owner = this.$owner;

        if (this.sourceInfo) {
            newEdge.sourceInfo = new InfoText({ property: this.sourceInfo.property, cardinality: this.sourceInfo.cardinality });
            newEdge.sourceInfo.$owner = newEdge;
        }

        if (this.targetInfo) {
            newEdge.targetInfo = new InfoText({ property: this.targetInfo.property, cardinality: this.targetInfo.cardinality });
            newEdge.targetInfo.$owner = newEdge;
        }

        this.$points.forEach(point => {
            newEdge.addPoint(point.x, point.y);
        });

        let graph = <Graph>this.getRoot();
        if (!graph) {
            return this;
        }

        // update model. insert the edge exact on the same index, like the old edge
        let idx = graph.$graphModel.edges.indexOf(this);
        graph.$graphModel.removeElement(this.id);
        if (idx > -1) {
            graph.$graphModel.edges.splice(idx, 0, newEdge);
        }
        else {
            graph.$graphModel.edges.push(newEdge);
        }


        if (!redraw) {
            return newEdge;
        }

        let svgRoot: Element;
        if (graph) {
            svgRoot = graph.root;
        }
        else {
            svgRoot = document.getElementById('root');
        }
        let newEdgeSvg = newEdge.getSVG();

        // update graph
        graph.removeElement(this);
        svgRoot.appendChild(newEdgeSvg);

        // redraw the edge from both sides to get the correct display
        // if the type is edge, so the path can be redraw.
        // if not, so the inherited class redraw the path with his own logic

        let dontDrawPath: boolean = (type !== 'Edge');
        newEdge.redraw(newEdge.$sNode, dontDrawPath);
        newEdge.redraw(newEdge.$tNode, dontDrawPath);

        EventBus.register(newEdge, newEdgeSvg);

        this.sourceInfo = undefined;
        this.targetInfo = undefined;

        return newEdge;
    }

    public redraw(startNode: Node, dontDrawPoints?: boolean): void {

        if (!startNode) {
            return;
        }
        // redraw the first point
        // check which point is the near to startnode
        let endPoint: Point;
        let recalcPoint: Point;
        let endPointIdx: number;

        if (this.$sNode.id === startNode.id) {
            recalcPoint = this.$points[0];
            endPointIdx = 1;
        } else if (this.$tNode.id === startNode.id) {
            recalcPoint = this.$points[this.$points.length - 1];
            endPointIdx = this.$points.length - 2;
        }

        endPoint = this.$points[endPointIdx];

        // calculate and set new position of point to redraw
        this.calcIntersection(startNode, recalcPoint, endPoint);

        // remove the 2nd point next to startnode, if the node was dragged upper the point
        if (this.$points.length > 2 && this.$tNode.id === startNode.id && endPoint.y > (startNode.getPos().y + (startNode.getSize().y / 2))) {

            this.$points.splice(endPointIdx, 1);
        }

        if (this.$tNode.id === startNode.id && this.$points.length == 2) {

            this.calcIntersection(this.$sNode, endPoint, recalcPoint);
        }




        if (this.$points.length > 2 && this.$sNode.id === startNode.id && (startNode.getPos().y + (startNode.getSize().y / 2) > endPoint.y)) {

            this.$points.splice(endPointIdx, 1);
        }

        if (this.$sNode.id === startNode.id && this.$points.length == 2) {

            this.calcIntersection(this.$tNode, endPoint, recalcPoint);
        }

        if (!dontDrawPoints) {
            this.redrawPointsAndInfo();
        }
    }

    protected redrawPointsAndInfo(): void {
        // redraw the edge with the new position
        let path: string = this.getPath();
        this.$pathSvg.setAttributeNS(null, 'd', path);
        this.$pathWideSvg.setAttributeNS(null, 'd', path);

        this.redrawSourceInfo();
        this.redrawTargetInfo();
    }

    protected redrawSourceInfo() {
        if (this.sourceInfo) {
            let newPosOfSrc = this.calcInfoPosNew(this.sourceInfo, this.$sNode);
            this.sourceInfo.redrawFromEdge(newPosOfSrc);
        }
    }

    protected redrawTargetInfo() {
        if (this.targetInfo) {
            let newPosOfTarget = this.calcInfoPosNew(this.targetInfo, this.$tNode);
            this.targetInfo.redrawFromEdge(newPosOfTarget);
        }
    }

    public getPath(): string {

        if (this.$points.length == 0) return '';

        let path: string = 'M';
        for (let i = 0; i < this.$points.length; i++) {
            let point: Point = this.$points[i];
            if (i > 0) {
                path += 'L';
            }
            path += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
        }

        return path;
    }

    private calcIntersection(startNode: Node, recalcPoint: Point, endPoint: Point): Point {

        // https://www.mathelounge.de/21534/schnittpunkt-einer-linie-mit-den-randern-eines-rechtecks
        let h = startNode.getSize().y;
        let w = startNode.getSize().x;

        let x1: number = startNode.getPos().x + (w / 2);
        let y1: number = startNode.getPos().y + (h / 2);

        let x2: number = endPoint.x;
        let y2: number = endPoint.y;

        let newX: number = recalcPoint.x;
        let newY: number = recalcPoint.y;

        if (x2 > x1) {
            newX = x1 + (w / 2);
        }
        else if (x2 < x1) {
            newX = x1 - (w / 2);
        }
        else {
            newX = x1;
        }

        if ((x2 - x1) != 0) {
            newY = ((y2 - y1) / (x2 - x1) * (newX - x1)) + y1;
        }
        else {
            if (y1 > y2) {
                newY = startNode.getPos().y;
            }
            else {
                newY = startNode.getPos().y + h;
            }
        }

        // if the statement is not true, so the intersection is at the horizontal line
        if (!((y1 - (h / 2) <= newY) && newY <= y1 + (h / 2))) {

            if (y2 > y1) {
                newY = y1 + (h / 2);
            }
            else {
                newY = y1 - (h / 2);
            }

            if ((x2 - x1) != 0) {
                let tmp = ((y2 - y1) / (x2 - x1));
                newX = (newY + (tmp * x1) - y1) / tmp;
            }
            else {
                newX = x1;
            }
        }

        recalcPoint.x = Math.ceil(newX);
        recalcPoint.y = Math.ceil(newY);

        return null;
    }

    public calcInfoPosNew(infoTxt: InfoText, node: Node): Point {

        if (!infoTxt || !node) return null;

        // 1. step: get direction
        let startPoint: Point;
        let nextToStartPoint: Point;
        if (this.$sNode.id === node.id) {
            startPoint = this.$points[0];
            nextToStartPoint = this.$points[1];
        }
        else if (this.$tNode.id === node.id) {
            startPoint = this.$points[this.$points.length - 1];
            nextToStartPoint = this.$points[this.$points.length - 2];
        }

        let direction: Direction = this.getDirectionOfPointToNode(node, startPoint);

        let x: number;
        let y: number;

        switch (direction) {
            case Direction.Up:
                // compare x-coordinates from start- and nextToStart point
                if (startPoint.x >= nextToStartPoint.x) {
                    x = startPoint.x + 5;
                }
                else {
                    x = startPoint.x - (infoTxt.getSize().x);
                }
                y = startPoint.y + (infoTxt.getSize().y / 2);
                break;
            case Direction.Right:
                // compare y-coordinates from start- and nextToStart point
                if (startPoint.y >= nextToStartPoint.y) {
                    y = startPoint.y + (infoTxt.getSize().y / 2);
                }
                else {
                    y = startPoint.y - (infoTxt.getSize().y / 2) - 5;
                }
                x = startPoint.x - (infoTxt.getSize().x) - 5;
                break;
            case Direction.Left:
                // compare y-coordinates from start- and nextToStart point
                if (startPoint.y >= nextToStartPoint.y) {
                    y = startPoint.y + (infoTxt.getSize().y / 2);
                }
                else {
                    y = startPoint.y - (infoTxt.getSize().y / 2) - 5;
                }
                x = startPoint.x + 5;
                break;
            case Direction.Down:
                // compare x-coordinates from start- and nextToStart point
                if (startPoint.x >= nextToStartPoint.x) {
                    x = startPoint.x + 5;
                }
                else {
                    x = startPoint.x - (infoTxt.getSize().x);
                }
                y = startPoint.y - (infoTxt.getSize().y / 2) - 5;
                break;
            default:
                break;
        }

        // assign calculated position to infotext
        return new Point(x, y);
    }

    public clearPoints(): any {
        this.$points = [];
        this.$points = [];
    }

    protected getDirectionOfPointToNode(node: Node, pointNearNode: Point): Direction {

        /*
            Example to calculate the direction of nearest point to Node

            node
         x1_ _ _ _
          |       |
          |       |. pointNearNode
          |       |
          |_ _ _ x2

          the calculation would return Direction.Left
        */

        let x1: Point = node.getPos();
        let x2: Point = new Point((x1.x + node.getSize().x), (x1.y + node.getSize().y));
        let direction: Direction = Direction.Down;

        if (x1.y >= pointNearNode.y) {
            direction = Direction.Down;
        }
        if (x2.y <= pointNearNode.y) {
            direction = Direction.Up;
        }
        if (x1.x >= pointNearNode.x) {
            direction = Direction.Right;
        }
        if (x2.x <= pointNearNode.x) {
            direction = Direction.Left;
        }

        return direction;
    }

    public addPoint(x: number, y: number): Point[] {
        this.$points.push(new Point(x, y));

        return this.$points;
    }
}
