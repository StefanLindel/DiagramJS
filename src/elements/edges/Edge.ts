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
    info: InfoText;
    sourceInfo: InfoText;
    targetInfo: InfoText;
    $m: number;
    $n: number;

    private static getShortestPointFromSource(source: Node, target: Node): Point {
        let result: Point;

        return result;
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



        // LET'S GET DIRTY
        this.sourceInfo = new InfoText({ id: 'srcInfoTest', cardinality: '0..n', property: 'testtehujbljadst' });
        this.sourceInfo.withSize(50, 40);
        this.sourceInfo.$owner = this;

        let calcPos = this.calcInfoPosNew(this.sourceInfo, this.$sNode);
        this.sourceInfo.withPos(calcPos.x, calcPos.y);

        let srcInfoSvg = this.sourceInfo.getSVG();
        EventBus.register(this.sourceInfo, srcInfoSvg);

        let group = Util.createShape({ tag: 'g', id: this.id, class: 'SVGEdge' });
        group.appendChild(shape);
        group.appendChild(srcInfoSvg);

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
        newEdge.redrawNewFn(newEdge.$sNode, dontDrawPath);
        newEdge.redrawNewFn(newEdge.$tNode, dontDrawPath);

        EventBus.register(newEdge, newEdgeSvg);

        return newEdge;
    }

    public redrawNewFn(startNode: Node, dontDrawPoints?: boolean): void {

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
        if(this.sourceInfo){
            let newPosOfSrc = this.calcInfoPosNew(this.sourceInfo, this.$sNode);
            this.sourceInfo.redraw(newPosOfSrc);
        }

        if(this.targetInfo){
            let newPosOfTarget = this.calcInfoPosNew(this.targetInfo, this.$tNode);
            this.targetInfo.redraw(newPosOfTarget);
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

        if(!infoTxt || !node) return null;

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
                if(startPoint.x >= nextToStartPoint.x){
                    x = startPoint.x + 5;
                }
                else{
                    x = startPoint.x - (infoTxt.getSize().x);
                }
                y = startPoint.y + (infoTxt.getSize().y / 2);
                break;
            case Direction.Right:
                // compare y-coordinates from start- and nextToStart point
                if(startPoint.y >= nextToStartPoint.y){
                    y = startPoint.y + (infoTxt.getSize().y / 2);
                }
                else{
                    y = startPoint.y - (infoTxt.getSize().y / 2);
                }
                x = startPoint.x - (infoTxt.getSize().x) - 5;
                break;
            case Direction.Left:
                // compare y-coordinates from start- and nextToStart point
                if(startPoint.y >= nextToStartPoint.y){
                    y = startPoint.y + (infoTxt.getSize().y / 2);
                }
                else{
                    y = startPoint.y - (infoTxt.getSize().y / 2);
                }
                x = startPoint.x + 5;
                break;
            case Direction.Down:
                // compare x-coordinates from start- and nextToStart point
                if(startPoint.x >= nextToStartPoint.x){
                    x = startPoint.x + 5;
                }
                else{
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

    // Obsolete function
    public redraw() {
        this.redrawNewFn(this.$sNode);
    }

    // INFOTEXT CALCULATE POSITION
    public calc(board: Element): boolean {
        let result, options, linetyp, sourcePos: Point, targetPos: Point, divisor, startNode: Node, endNode: Node;
        startNode = <Node>this.$sNode.getShowed();
        endNode = <Node>this.$tNode.getShowed();

        divisor = (endNode.getCenter().x - startNode.getCenter().x);
        this.$points = [];
        if (divisor === 0) {
            if (startNode === endNode) {
                /* OwnAssoc */
                return false;
            }
            // Must be UP_DOWN or DOWN_UP
            if (startNode.getCenter().y < endNode.getCenter().y) {
                // UP_DOWN
                sourcePos = startNode.getCenterPosition(Point.DOWN);
                targetPos = endNode.getCenterPosition(Point.UP);
            } else {
                sourcePos = startNode.getCenterPosition(Point.UP);
                targetPos = endNode.getCenterPosition(Point.DOWN);
            }
        } else {
            // add switch from option or model
            options = this.$owner['options'];
            if (options) {
                linetyp = options.linetyp;
            }
            result = false;
            if (linetyp === 'square') {
                result = this.calcSquareLine();
            }
            if (!result) {
                this.$m = (endNode.getCenter().y - startNode.getCenter().y) / divisor;
                this.$n = startNode.getCenter().y - (startNode.getCenter().x * this.$m);
                sourcePos = Util.getPosition(this.$m, this.$n, startNode, endNode.getCenter());
                targetPos = Util.getPosition(this.$m, this.$n, endNode, sourcePos);
            }
        }
        if (sourcePos && targetPos) {
            if (this.sourceInfo) {
                this.calcInfoPos(sourcePos, startNode, this.sourceInfo);
            }
            if (this.targetInfo) {
                this.calcInfoPos(targetPos, endNode, this.targetInfo);
            }
            startNode['$' + sourcePos.getPosition()] += 1;
            endNode['$' + targetPos.getPosition()] += 1;

            const line: Line = new Line(this.lineStyle);
            line.init(this);
            line.source = sourcePos;
            line.target = targetPos;
            this.$points.push(line);
            if (this.info) {
                this.info.withPos((sourcePos.x + targetPos.x) / 2, (sourcePos.y + targetPos.y) / 2);
            }
        }
        return true;
    }

    public addLineTo(x1: number, y1: number, x2?: number, y2?: number) {
        let start, end;
        if (!x2 && !y2) {
            if (this.$points.length > 0) {
                start = this.$points[this.$points.length - 1].target;
                end = new Point(start.x + x1, start.y + y1);
            } else {
                start = new Point(x1, y1);
                end = new Point(x1, y1);
            }
        } else {
            start = new Point(x1, y1);
            end = new Point(start.x + x2, start.y + y2);
        }
        const line: Line = new Line(this.lineStyle);
        line.init(this);
        line.source = start;
        line.target = end;
        this.$points.push(line);
        // this.$points.push(new Line(start, end, this.$lineStyle, this.style));
    }

    public clearPoints(): any {
        this.$points = [];
        this.$pointsNew = [];
    }

    public addLine(x1: number, y1: number, x2?: number, y2?: number) {
        let start: Point, end: Point;
        if (!x2 && !y2) {
            if (this.$points.length > 0) {
                start = this.$points[this.$points.length - 1].target;
                end = new Point(x1, y1);
            } else {
                start = new Point(x1, y1);
                end = start;
            }
        } else {
            start = new Point(x1, y1);
            end = new Point(x2, y2);
        }
        const line: Line = new Line(this.lineStyle);
        line.init(this);
        line.source = start;
        line.target = end;
        this.$points.push(line);
    }

    public calcInfoPos(linePos: Point, item: Node, info: InfoText) {
        // Manuell move the InfoTag
        let newY: number, newX: number, spaceA: number = 20, spaceB: number = 0, step: number = 15;
        let owner: any = item.$owner;
        if (owner.options && !owner.options.rotatetext) {
            spaceA = 20;
            spaceB = 10;
        }
        if (info.custom || info.getText().length < 1) {
            return;
        }
        newY = linePos.y;
        newX = linePos.x;
        let size: Point = info.getSize();
        if (linePos.getPosition() === Point.UP) {
            newY = newY - size.y - spaceA;
            if (this.$m !== 0) {
                newX = (newY - this.$n) / this.$m + spaceB + (item.$TOP * step);
            }
        } else if (linePos.getPosition() === Point.DOWN) {
            newY = newY + spaceA;
            if (this.$m !== 0) {
                newX = (newY - this.$n) / this.$m + spaceB + (item.$DOWN * step);
            }
        } else if (linePos.getPosition() === Point.LEFT) {
            newX = newX - size.x - (item.$LEFT * step) - spaceA;
            if (this.$m !== 0) {
                newY = (this.$m * newX) + this.$n;
            }
        } else if (linePos.getPosition() === Point.RIGHT) {
            newX += (item.$RIGHT * step) + spaceA;
            if (this.$m !== 0) {
                newY = (this.$m * newX) + this.$n;
            }
        }
        info.withPos(Math.ceil(newX), Math.ceil(newY));
    }

    public calcSquareLine() {
        // 1. Case		/------\
        // 			|...T...|
        // 			\-------/
        // 		|---------|
        // 		|
        // 	/-------\
        // 	|...S...|
        // 	\-------/
        let startPos: Point = this.$sNode.getPos();
        let startSize: Point = this.$sNode.getSize();
        let endPos: Point = this.$tNode.getPos();
        let endSize: Point = this.$tNode.getSize();
        if (startPos.y - 40 > endPos.y + endSize.y) { // oberseite von source and unterseite von target
            this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
            this.addLine(endPos.x + endSize.x / 2, endPos.y + endSize.y + 20);
            this.addLineTo(0, -20);
            return true;
        }
        if (endPos.y - 40 > startPos.y + startSize.y) { // oberseite von source and unterseite von target
            // Case 1 the other way round
            this.addLineTo(startPos.x + startSize.x / 2, startPos.y + startSize.y, 0, +20);
            this.addLine(endPos.x + endSize.x / 2, endPos.y - 20);
            this.addLineTo(0, 20);
            return true;
        }
        // 3. Case ,falls s (source) komplett unter t (target) ist
        // beide oberseiten
        // 3. Case
        // 		 |--------
        // 		/---\	 |
        // 		| T |	/---\
        // 		\---/	| S |
        // 				-----
        // or
        // 		-------|
        // 		|	 /---\
        // 	/----\	 | T |
        // 	| S	 |	 \---/
        // 	------
        //
        this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
        this.addLine(endPos.x + endSize.x / 2, endPos.y - 20);
        this.addLineTo(0, 20);
        return true;
    }

    public calcOffset() {
        let i: number, z: number, x: number, y: number;
        let min: Point = new Point(999999999, 999999999), max: Point = new Point(0, 0);
        let item: Line, svg, value: any;
        for (i = 0; i < this.$points.length; i += 1) {
            item = this.$points[i];
            if (item.lineType === Line.FORMAT.PATH) {
                value = document.createElement('div');
                svg = Util.create({ tag: 'svg' });
                svg.appendChild(item.getSVG());
                value = svg.childNodes[0];
                x = y = 0;
                if (!value.pathSegList) {
                    continue;
                }
                for (z = 0; z < value.pathSegList.length; z += 1) {
                    let child: any = value.pathSegList[z];
                    switch (child.pathSegType) {
                        case SVGPathSeg.PATHSEG_MOVETO_ABS:
                        case SVGPathSeg.PATHSEG_LINETO_ABS:
                        case SVGPathSeg.PATHSEG_ARC_ABS:
                        case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
                            x = child.x;
                            y = child.y;
                            break;
                        case SVGPathSeg.PATHSEG_MOVETO_REL:
                        case SVGPathSeg.PATHSEG_LINETO_REL:
                        case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
                        case SVGPathSeg.PATHSEG_ARC_REL:
                            x = x + child.x;
                            y = y + child.y;
                            break;
                    }
                    Util.Range(min, max, x, y);
                }
            } else {
                Util.Range(min, max, item.source.x, item.source.y);
                Util.Range(min, max, item.target.x, item.target.y);
            }
        }
        return { x: min.x, y: min.y, width: max.x - min.x, height: max.y - min.y };
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
