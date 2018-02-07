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
    public typ: string;
    public $sNode: Node;
    public $tNode: Node;
    public lineStyle: string;
    public $points: Line[] = [];
    public $pointsNew: Point[] = [];
    public $pathSvg: Element;
    public info: InfoText;
    public sourceInfo: InfoText;
    public targetInfo: InfoText;
    $m: number;
    $n: number;

    constructor(data: JSON | string | Object | any) {
        super();

        this.withData(data);
    }

    public withData(data: JSON | string | Object | any) : Edge{

        if(!data){
            return this;
        }

        if(data.source && typeof data.source !== 'string'){
            this.sourceInfo = new InfoText(data.source);
            this.sourceInfo.$owner = this;
        }

        if(data.target && typeof data.target !== 'string'){
            this.targetInfo = new InfoText(data.target);
            this.targetInfo.$owner = this;
        }

        return this;
    }

    public updateSrcCardinality(cardinality: string): void{
        this.sourceInfo = this.updateCardinality(this.$sNode, this.sourceInfo, cardinality);
    }

    public updateTargetCardinality(cardinality: string): void{
        this.targetInfo = this.updateCardinality(this.$tNode, this.targetInfo, cardinality);
    }

    private updateCardinality(node: Node, infoText: InfoText, cardinality: string): InfoText{
        if(!infoText){
            infoText = new InfoText({'cardinality': cardinality});

            let calcPos = this.calcInfoPosNew(infoText, node);
            infoText.withPos(calcPos.x, calcPos.y);
            this.$view.appendChild(infoText.getSVG());

            return infoText;
        }
        infoText.updateCardinality(cardinality);

        return infoText;
    }

    public updateSrcProperty(property: string): void{
        this.sourceInfo = this.updateProperty(this.$sNode, this.sourceInfo, property);
    }

    public updateTargetProperty(property: string): void{
        this.targetInfo = this.updateProperty(this.$tNode, this.targetInfo, property);
    }

    private updateProperty(node: Node, infoText: InfoText, property: string): InfoText{
        if(!infoText){
            infoText = new InfoText({'property': property});

            let calcPos = this.calcInfoPosNew(infoText, node);
            infoText.withPos(calcPos.x, calcPos.y);
            this.$view.appendChild(infoText.getSVG());

            return infoText;
        }
        infoText.updateProperty(property);
        return infoText;
    }

    public withItem(source: Node, target: Node): Edge {
        source.edges.push(this);
        target.edges.push(this);
        this.$sNode = source;
        this.$tNode = target;
        this.source = source.id;
        this.target = target.id;
        return this;
    }

    public getSVG(): Element {
        let path = '';
        if (this.$pointsNew.length > 0) {
            path = 'M';
        }
        for (let i = 0; i < this.$pointsNew.length; i++) {
            let point: Point = this.$pointsNew[i];
            if (i > 0) {
                path += 'L';
            }
            path += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
        }

        let attr = {
            tag: 'path',
            id: this.id,
            d: path,
            fill: 'none'
        };
        let shape = this.createShape(attr);

        let group = Util.createShape({ tag: 'g', id: this.id, class: 'SVGEdge' });
        group.appendChild(shape);

        if(this.sourceInfo){        
            let calcPos = this.calcInfoPosNew(this.sourceInfo, this.$sNode);
            this.sourceInfo.withPos(calcPos.x, calcPos.y);
            group.appendChild(this.sourceInfo.getSVG());
        }
        if(this.targetInfo){
            let calcPos = this.calcInfoPosNew(this.targetInfo, this.$tNode);
            this.targetInfo.withPos(calcPos.x, calcPos.y);
            group.appendChild(this.targetInfo.getSVG());
        }

        this.$pathSvg = shape;
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

        let idxInSrc = this.$sNode.edges.indexOf(this);
        this.$sNode.edges.splice(idxInSrc, 1);
        let idxInTarget = this.$tNode.edges.indexOf(this);
        this.$tNode.edges.splice(idxInTarget, 1);

        let newEdge: Edge = new edges[type]();
        newEdge.withItem(this.$sNode, this.$tNode);
        newEdge.id = newId;
        newEdge.typ = type;
        newEdge.lineStyle = this.lineStyle;
        newEdge.$owner = this.$owner;
        newEdge.sourceInfo = this.sourceInfo;
        newEdge.targetInfo = this.targetInfo;
        newEdge.info = this.info;

        this.$pointsNew.forEach(point => {
            newEdge.addPoint(point.x, point.y);
        });


        if (!redraw) {
            return newEdge;
        }

        let oldSvg = this.getAlreadyDisplayingSVG();
        let graph = <Graph>this.getRoot();
        let svgRoot: Element;
        if (graph) {
            svgRoot = graph.root;
        }
        else {
            svgRoot = document.getElementById('root');
        }
        let newEdgeSvg = newEdge.getSVG();

        svgRoot.removeChild(oldSvg);
        svgRoot.appendChild(newEdgeSvg);

        // redraw the edge from both sides to get the correct display
        // if the type is edge, so the path can be redraw.
        // if not, so the inherited class redraw the path with his own logic

        let dontDrawPath: boolean = (type !== 'Edge');
        newEdge.redraw(newEdge.$sNode, dontDrawPath);
        newEdge.redraw(newEdge.$tNode, dontDrawPath);

        EventBus.register(newEdge, newEdgeSvg);

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

        if (this.source === startNode.id) {
            recalcPoint = this.$pointsNew[0];
            endPointIdx = 1;
        } else if (this.target === startNode.id) {
            recalcPoint = this.$pointsNew[this.$pointsNew.length - 1];
            endPointIdx = this.$pointsNew.length - 2;
        }

        endPoint = this.$pointsNew[endPointIdx];

        // calculate and set new position of point to redraw
        this.calcIntersection(startNode, recalcPoint, endPoint);

        // remove the 2nd point next to startnode, if the node was dragged upper the point
        if (this.$pointsNew.length > 2 && this.target === startNode.id && endPoint.y > (startNode.getPos().y + (startNode.getSize().y / 2))) {

            this.$pointsNew.splice(endPointIdx, 1);
        }

        if (this.target === startNode.id && this.$pointsNew.length == 2) {

            this.calcIntersection(this.$sNode, endPoint, recalcPoint);
        }




        if (this.$pointsNew.length > 2 && this.source === startNode.id && (startNode.getPos().y + (startNode.getSize().y / 2) > endPoint.y)) {

            this.$pointsNew.splice(endPointIdx, 1);
        }

        if (this.source === startNode.id && this.$pointsNew.length == 2) {

            this.calcIntersection(this.$tNode, endPoint, recalcPoint);
        }

        // calculate the infotext of source
        if (this.sourceInfo) {
            let newPosOfSrc = this.calcInfoPosNew(this.sourceInfo, this.$sNode);
            this.sourceInfo.redrawFromEdge(newPosOfSrc);
        }

        if (this.targetInfo) {
            let newPosOfTarget = this.calcInfoPosNew(this.targetInfo, this.$tNode);
            this.targetInfo.redrawFromEdge(newPosOfTarget);
        }


        if (!dontDrawPoints) {
            this.redrawPoints();
        }
    }

    protected redrawPoints(): void {
        // redraw the edge with the new position
        let path: string = 'M';

        for (let i = 0; i < this.$pointsNew.length; i++) {
            let point: Point = this.$pointsNew[i];
            if (i > 0) {
                path += 'L';
            }
            path += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
        }

        this.$pathSvg.setAttributeNS(null, 'd', path);
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

    protected calcInfoPosNew(infoTxt: InfoText, node: Node): Point {

        if (!infoTxt || !node) return null;

        // 1. step: get direction
        let startPoint: Point;
        let nextToStartPoint: Point;
        if (this.source === node.id) {
            startPoint = this.$pointsNew[0];
            nextToStartPoint = this.$pointsNew[1];
        }
        else if (this.target === node.id) {
            startPoint = this.$pointsNew[this.$pointsNew.length - 1];
            nextToStartPoint = this.$pointsNew[this.$pointsNew.length - 2];
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
                y = startPoint.y + (infoTxt.getSize().y / 2) + 5;
                break;
            case Direction.Right:
                // compare y-coordinates from start- and nextToStart point
                if (startPoint.y >= nextToStartPoint.y) {
                    y = startPoint.y + (infoTxt.getSize().y / 2);
                }
                else {
                    y = startPoint.y - (infoTxt.getSize().y / 2);
                }
                x = startPoint.x - (infoTxt.getSize().x) - 5;
                break;
            case Direction.Left:
                // compare y-coordinates from start- and nextToStart point
                if (startPoint.y >= nextToStartPoint.y) {
                    y = startPoint.y + (infoTxt.getSize().y / 2);
                }
                else {
                    y = startPoint.y - (infoTxt.getSize().y / 2);
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
        this.$pointsNew = [];
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
        this.$pointsNew.push(new Point(x, y));

        return this.$pointsNew;
    }
}
