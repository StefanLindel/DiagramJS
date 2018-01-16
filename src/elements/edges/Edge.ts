import {DiagramElement, Line, Point} from '../BaseElements';
import {Node} from '../nodes';
import {InfoText} from '../nodes/InfoText';
import {Util} from '../../util';
import {EventBus} from '../../EventBus';
import * as edges from '../edges';

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
    info: InfoText;
    sourceInfo: InfoText;
    targetInfo: InfoText;
    $m: number;
    $n: number;

    
    protected $targetElement : Element;

    private static getShortestPointFromSource(source: Node, target: Node): Point {
        let result: Point;

        return result;
    }

    private static getShortestPathIntersection(node: Node, point: Point): Point {
        let x = point.x;
        let y = point.y;

        let minX = node.getPos().x - node.getSize().x / 2;
        let minY = node.getPos().y - node.getSize().y / 2;
        let maxX = minX + node.getSize().x;
        let maxY = minY + node.getSize().y;

        let midX = (minX + maxX) / 2;
        let midY = (minY + maxY) / 2;
        let m = (midY - y) / (midX - x);

        if (x <= midX) { // check "left" side
            let minXy = m * (minX - x) + y;
            if (minY < minXy && minXy < maxY) {
                return new Point(minX, minXy);
            }
        }

        if (x >= midX) { // check "right" side
            let maxXy = m * (maxX - x) + y;
            if (minY < maxXy && maxXy < maxY) {
                return new Point(maxX, maxXy);
            }
        }

        if (y <= midY) { // check "top" side
            let minYx = (minY - y) / m + x;
            if (minX < minYx && minYx < maxX) {
                return new Point(minYx, minY);
            }
        }

        if (y >= midY) { // check "bottom" side
            let maxYx = (maxY - y) / m + x;
            if (minX < maxYx && maxYx < maxX) {
                return new Point(maxYx, maxY);
            }
        }
        return new Point();
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
        if (this.$points.length > 0) {
            path = 'M';
        }
        for (let i = 0; i < this.$points.length; i++) {
            let point: Point = this.$points[i].target;
            if (i > 0) {
                path += 'L';
            }
            path += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
        }

        let attr = {
            tag: 'path',
            id: this.id,
            d: path,
            fill: 'none',
            class: 'SVGEdge'
        };
        let shape = this.createShape(attr);

        this.$view = shape;

        return shape;
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTCLICK, EventBus.EDITOR];
    }

    public convertEdge(type: string, newId: string) : Edge{
        if(!edges[type]){
            return this;
        }
        
        let idxInSrc = this.$sNode.edges.indexOf(this);
        this.$sNode.edges.splice(idxInSrc, 1);
        let idxInTarget = this.$tNode.edges.indexOf(this);
        this.$tNode.edges.splice(idxInTarget, 1);
        
        let newEdge : Edge = new edges[type]();
        newEdge.withItem(this.$sNode, this.$tNode);
        newEdge.id = newId;
        newEdge.typ = type;

        return newEdge;
    }

    public redraw() {
        // let a = this.getShortestPathIntersection(this.$sNode, this.$tNode.getPos());
        // let b = this.getShortestPathIntersection(this.$tNode, this.$sNode.getPos());

        // this.$view.setAttribute('d', `M${a.x} ${a.y} L${b.x} ${b.y}`);

        // TODO: setup points, not only the path of view



        let targetNodePos = this.$tNode.getPos();
        let sourceNodePos = this.$sNode.getPos();

        let targetNodeSize = this.$tNode.getSize();
        let sourceNodeSize = this.$sNode.getSize();

        let mx, my, lx, ly: number;

        if (targetNodePos.y < sourceNodePos.y) {
            ly = targetNodePos.y + targetNodeSize.y;
            my = sourceNodePos.y;
        }
        else {
            ly = targetNodePos.y;
            my = sourceNodePos.y + sourceNodeSize.y;
        }

        mx = sourceNodePos.x + sourceNodeSize.x / 2;
        lx = targetNodePos.x + targetNodeSize.x / 2;

        let diff;
        if (mx > targetNodePos.x + targetNodeSize.x && sourceNodePos.x <= targetNodePos.x + targetNodeSize.x) {
            diff = (mx - (targetNodePos.x + targetNodeSize.x));
            mx -= diff;
            // lx += diff;

            this.$view.setAttribute('d', `M${mx} ${my} L${lx} ${ly} Z`);

            // reset points
            this.clearPoints();
            this.addLine(mx, my);
            this.addLine(lx, ly);
            return;
        }

        if (sourceNodePos.x > targetNodePos.x + targetNodeSize.x) {
            let diff = sourceNodePos.x - (targetNodePos.x + targetNodeSize.x);
            mx = sourceNodePos.x;
            lx += diff;

            if (lx >= (targetNodePos.x + targetNodeSize.x)) {
                lx = (targetNodePos.x + targetNodeSize.x);
            }

            this.$view.setAttribute('d', `M${mx} ${my} L${lx} ${ly} Z`);

            // reset points
            this.clearPoints();
            this.addLine(mx, my);
            this.addLine(lx, ly);
            return;
        }

        if (targetNodePos.x > mx && targetNodePos.x <= sourceNodePos.x + sourceNodeSize.x) {
            diff = (lx - (sourceNodePos.x + sourceNodeSize.x));
            mx += diff;
            // lx = sourceNodePos.x+sourceNodeSize.x;

            this.$view.setAttribute('d', `M${mx} ${my} L${lx} ${ly} Z`);

            // reset points
            this.clearPoints();
            this.addLine(mx, my);
            this.addLine(lx, ly);
            return;
        }

        if (sourceNodePos.x + sourceNodeSize.x < targetNodePos.x) {
            let diff = targetNodePos.x - (sourceNodePos.x + sourceNodeSize.x);
            mx = sourceNodePos.x + sourceNodeSize.x;
            lx -= diff;

            if (lx <= targetNodePos.x) {
                lx = targetNodePos.x;
            }

            this.$view.setAttribute('d', `M${mx} ${my} L${lx} ${ly} Z`);

            // reset points
            this.clearPoints();
            this.addLine(mx, my);
            this.addLine(lx, ly);
            return;
        }

        this.$view.setAttribute('d', `M${mx} ${my} L${lx} ${ly} Z`);

        // reset points
        this.clearPoints();
        this.addLine(mx, my);
        this.addLine(lx, ly);
        // FIXME  this.$points = [ a, b ];
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

// many Edges SOME DOWN AND SOME RIGHT OR LEFT
// INFOTEXT DONT SHOW IF NO PLACE

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
                svg = Util.create({tag: 'svg'});
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
        return {x: min.x, y: min.y, width: max.x - min.x, height: max.y - min.y};
    }

    protected getDirection(a: Point, b: Point): Direction {
        if (b.x < a.x) {
            return Direction.Left;
        }
        if (b.x > a.x) {
            return Direction.Right;
        }
        if (b.y < a.y) {
            return Direction.Up;
        }
        if (b.y > a.y) {
            return Direction.Down;
        }
        return Direction.Down;
    }
}
