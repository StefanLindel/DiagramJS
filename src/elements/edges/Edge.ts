import { DiagramElement, Point,Line } from '../BaseElements';
import { EventBus } from '../../EventBus';
import { Node } from '../nodes';

export const enum Direction {
  Up, Down, Left, Right
}

export class Edge extends DiagramElement {

  public source: string;
  public target: string;
  public $sNode: Node;
  public $tNode: Node;
  public lineStyle: string;
  public $points: Line[]=[];

  constructor(id?: string, type?: string) {
    super();
    this.type = type || 'Edge';
    this.id = id;
  }

  public init(data: Object) {
    // nothing to init..yet
  }

  public withItem(source: Node, target: Node): Edge {
    source.edges.push(this);
    target.edges.push(this);
    this.$sNode = source;
    this.$tNode = target;
    this.source = source.id;
    this.target = target.id;
    return this;
  };

  public getSVG(): Element {
		let path = "";
		if(this.$points.length>0) {
			path = 'M';
		}
    for (let i = 0; i < this.$points.length; i++) {
      let point = new Point(this.$points[i].getPos().x, this.$points[i].getPos().y);
      if (i > 0) {
        path += 'L';
      }
      path += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
    }

    let attr = {
      tag: 'path',
      id: this.id,
      d: path,
      stroke: 'black',
      'stroke-width': '3',
      fill: 'none'
    };
    let shape = this.createShape(attr);

    this.$view = shape;

		EventBus.register(this, 'click', 'editor');
    return shape;
  }

  public redraw() {
    let a = this.getShortestPathIntersection(this.$sNode, this.$tNode.getPos());
    let b = this.getShortestPathIntersection(this.$tNode, this.$sNode.getPos());
    this.$view.setAttribute('d', `M${a.x} ${a.y} L${b.x} ${b.y}`);
   //FIXME  this.$points = [ a, b ];
  }
	// TODO
// many Edges SOME DOWN AND SOME RIGHT OR LEFT
// INFOTEXT DONT SHOW IF NO PLACE
// INFOTEXT CALCULATE POSITION
// 		public calc(board: Element) : boolean {
// 			var result, options, linetyp, sourcePos, targetPos, divisor, startNode:Node, endNode:Node;
// 			startNode = <Node>this.$sNode.getShowed();
// 			endNode = <Node>this.$tNode.getShowed();
//
// 			divisor = (endNode.getCenter().x - startNode.getCenter().x);
// 			this.$path = [];
// 			startNode = startNode.getTarget(startNode);
// 			endNode = endNode.getTarget(endNode);
// 			if (divisor === 0) {
// 				if (startNode === endNode) {
// 					/* OwnAssoc */
// 					return false;
// 				}
// 				// Must be UP_DOWN or DOWN_UP
// 				if (startNode.getCenter().y < endNode.getCenter().y) {
// 					// UP_DOWN
// 					sourcePos = this.getCenterPosition(startNode, Edge.Position.DOWN);
// 					targetPos = this.getCenterPosition(endNode, Edge.Position.UP);
// 				} else {
// 					sourcePos = this.getCenterPosition(startNode, Edge.Position.UP);
// 					targetPos = this.getCenterPosition(endNode, Edge.Position.DOWN);
// 				}
// 			} else {
// 				// add switch from option or model
// 				options = this.$parent["options"];
// 				if (options) {
// 					linetyp = options.linetyp;
// 				}
// 				result = false;
// 				if (linetyp === "square") {
// 					result = this.calcSquareLine();
// 				}
// 				if (!result) {
// 					this.$m = (endNode.getCenter().y - startNode.getCenter().y) / divisor;
// 					this.$n = startNode.getCenter().y - (startNode.getCenter().x * this.$m);
// 					sourcePos = Edge.getPosition(this.$m, this.$n, startNode, endNode.getCenter());
// 					targetPos = Edge.getPosition(this.$m, this.$n, endNode, sourcePos);
// 				}
// 			}
// 			if (sourcePos && targetPos) {
// 				this.calcInfoPos(sourcePos, startNode, this.source);
// 				this.calcInfoPos(targetPos, endNode, this.target);
// 				startNode["$" + sourcePos.$id] += 1;
// 				endNode["$" + targetPos.$id] += 1;
// 				this.$path.push(new Line(sourcePos, targetPos, this.$lineStyle, this.style));
// 				if (this.info) {
// 					this.info.withPos((sourcePos.x + targetPos.x) / 2, (sourcePos.y + targetPos.y) / 2)
// 				}
// 			}
// 			return true;
// 		}
// 		public addLineTo(x1:number, y1:number, x2?:number, y2?:number) {
// 			var start, end;
// 			if (!x2 && !y2 && this.$path.length > 0) {
// 				start = this.$path[this.$path.length - 1].target;
// 				end = new Point(start.x + x1, start.y + y1);
// 			} else {
// 				start = new Point(x1, y1);
// 				end = new Point(start.x + x2, start.y + y2);
// 			}
// 			this.$path.push(new Line(start, end, this.$lineStyle, this.style));
// 		};
// 		public calcSquareLine() {
// 			//	1. Case		/------\
// 			//				|...T...|
// 			//				\-------/
// 			//			|---------|
// 			//			|
// 			//		/-------\
// 			//		|...S...|
// 			//		\-------/
// 			var startPos = this.$sNode.getPos();
// 			var startSize = this.$sNode.getSize();
// 			var endPos = this.$tNode.getPos();
// 			var endSize = this.$tNode.getSize();
// 			if (startPos.y - 40 > endPos.y + endSize.y) { // oberseite von source and unterseite von target
// 				this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
// 				this.addLine(endPos.x + endSize.x/ 2, endPos.y + endSize.y + 20);
// 				this.addLineTo(0, -20);
// 				return true;
// 			}
// 			if (endPos.y - 40 > startPos.y + startSize.y) { // oberseite von source and unterseite von target
// 				// fall 1 nur andersherum
// 				this.addLineTo(startPos.x + startSize.x  / 2, startPos.y + startSize.y, 0, +20);
// 				this.addLine(endPos.x + endSize.x/ 2, endPos.y - 20);
// 				this.addLineTo(0, 20);
// 				return true;
// 			}
// 			//3. fall ,falls s (source) komplett unter t (target) ist
// 			// beide oberseiten
// 			//	3. Case
// 			//			 |--------
// 			//			/---\	 |
// 			//			| T |	/---\
// 			//			\---/	| S |
// 			//					-----
// 			// or
// 			//			-------|
// 			//			|	 /---\
// 			//		/----\	 | T |
// 			//		| S	 |	 \---/
// 			//		------
// 			//
// 			this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
// 			this.addLine(endPos.x + endSize.x / 2, endPos.y - 20);
// 			this.addLineTo(0, 20);
// 			return true;
// 		};
// 		public calcOffset() {
// 			var i, z, min = new Point(999999999, 999999999), max = new Point(0, 0), item, svg, value, x, y;
// 			for (i = 0; i < this.$path.length; i += 1) {
// 				item = this.$path[i];
// 				if (item.typ==Line.FORMAT.PATH) {
// 					value = document.createElement('div');
// 					svg = util.create({tag: "svg"});
// 					svg.appendChild(item.draw());
// 					value = svg.childNodes[0];
// 					x = y = 0;
// 					if (!value.pathSegList) {
// 						continue;
// 					}
// 					for (z = 0; z < value.pathSegList.length; z += 1) {
// 						item = value.pathSegList[z];
// 						switch (item.pathSegType) {
// 							case SVGPathSeg.PATHSEG_MOVETO_ABS:
// 							case SVGPathSeg.PATHSEG_LINETO_ABS:
// 							case SVGPathSeg.PATHSEG_ARC_ABS:
// 							case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
// 								x = item.x;
// 								y = item.y;
// 								break;
// 							case SVGPathSeg.PATHSEG_MOVETO_REL:
// 							case SVGPathSeg.PATHSEG_LINETO_REL:
// 							case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
// 							case SVGPathSeg.PATHSEG_ARC_REL:
// 								x = x + item.x;
// 								y = y + item.y;
// 								break;
// 						}
// 						Edge.Range(min, max, x, y);
// 					}
// 				} else {
// 					Edge.Range(min, max, item.source.x, item.source.y);
// 					Edge.Range(min, max, item.target.x, item.target.y);
// 				}
// 			}
// 			return {x: min.x, y: min.y, width: max.x - min.x, height: max.y - min.y};
// 		};

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
  }

  private getShortestPathIntersection(node: Node, point: Point): Point {
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
  }
}