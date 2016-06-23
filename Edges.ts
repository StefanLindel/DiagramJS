///<reference path='Base.ts'/>
module Diagram {
	'use strict';
	//				######################################################### Edge #########################################################
	export class Edge extends Node{
		protected $path:Array<PathElement>;
		$sNode:GraphNode;
		$tNode:GraphNode;
		private $m:number = 0;
		private $n:number = 0;
		protected $lineStyle:string;
		counter:number;
		private $gui:any;
		private $labels:Array<Object>;
		source:Info;
		target:Info;
		private style:string;
		private info:Info;
		private board:any;
		private $start:string;
		protected $end:string;
		protected $endPos:Pos;
		protected $top:Pos;
		protected $bot:Pos;
		protected $topCenter:Pos;
		protected $botCenter:Pos;
		constructor() {
			super("EDGE");
			this.$path = [];
			this.$lineStyle = Line.Format.SOLID;
		}
		public static Layout = {DIAG: 1, RECT: 0};
		public static Position = {UP: "UP", LEFT: "LEFT", RIGHT: "RIGHT", DOWN: "DOWN"};

		public withItem(source:Info, target:Info) : Edge {
			this.source = source;
			this.target = target;
			return this;
		}
		public set(id, value) {
			if (value) {
				this[id] = value;
			}
		}
		public removeFromBoard(board) {
			if (this.$gui) {
				board.removeChild(this.$gui);
				this.$gui = null;
			}
			if (this.$labels) {
				while (this.$labels.length > 0) {
					board.removeChild(this.$labels.pop());
				}
			}
		}
// TODO
// many Edges SOME DOWN AND SOME RIGHT OR LEFT
// INFOTEXT DONT SHOW IF NO PLACE
// INFOTEXT CALCULATE POSITION
		public calc(board)  : boolean{
			var result, options, linetyp, source, target, sourcePos, targetPos, divisor, startNode:GraphNode, endNode:GraphNode;
			startNode = <GraphNode>this.$sNode.getShowed();
			endNode = <GraphNode>this.$tNode.getShowed();
			startNode.$center = new Pos(startNode.getX(true) + (startNode.width / 2), startNode.getY(true) + (startNode.height / 2));
			endNode.$center = new Pos(endNode.getX(true) + (endNode.width / 2), endNode.getY(true) + (endNode.height / 2));
			divisor = (endNode.$center.x - startNode.$center.x);
			this.$path = [];
			source = startNode.getTarget(startNode);
			target = endNode.getTarget(endNode);
			if (divisor === 0) {
				if (startNode === endNode) {
					/* OwnAssoc */
					return false;
				}
				// Must be UP_DOWN or DOWN_UP
				if (startNode.$center.y < endNode.$center.y) {
					// UP_DOWN
					sourcePos = this.getCenterPosition(source, Edge.Position.DOWN);
					targetPos = this.getCenterPosition(target, Edge.Position.UP);
				} else {
					sourcePos = this.getCenterPosition(source, Edge.Position.UP);
					targetPos = this.getCenterPosition(target, Edge.Position.DOWN);
				}
			} else {
				// add switch from option or model
				options = this.$parent["options"];
				if (options) {
					linetyp = options.linetyp;
				}
				result = false;
				if (linetyp === "square") {
					result = this.calcSquareLine();
				}
				if (!result) {
					this.$m = (target.$center.y - source.$center.y) / divisor;
					this.$n = source.$center.y - (source.$center.x * this.$m);
					sourcePos = this.getPosition(this.$m, this.$n, source, target.$center);
					targetPos = this.getPosition(this.$m, this.$n, target, sourcePos);
				}
			}
			if (sourcePos && targetPos) {
				this.calcInfoPos(sourcePos, source, this.source);
				this.calcInfoPos(targetPos, target, this.target);
				source["$" + sourcePos.$id] += 1;
				target["$" + targetPos.$id] += 1;
				this.$path.push(new Line(sourcePos, targetPos, this.$lineStyle, this.style));
				if (this.info) {
					this.info.x = (sourcePos.x + targetPos.x) / 2;
					this.info.y = (sourcePos.y + targetPos.y) / 2;
				}
			}
			return true;
		};

		public addLine(x1:number, y1:number, x2?:number, y2?:number) {
			var start, end;
			if (!x2 && !y2 && this.$path.length > 0) {
				start = this.$path[this.$path.length - 1].target;
				end = new Pos(x1, y1);
			} else {
				start = new Pos(x1, y1);
				end = new Pos(x2, y2);
			}
			this.$path.push(new Line(start, end, this.$lineStyle, this.style));
		};

		public addLineTo(x1:number, y1:number, x2?:number, y2?:number) {
			var start, end;
			if (!x2 && !y2 && this.$path.length > 0) {
				start = this.$path[this.$path.length - 1].target;
				end = new Pos(start.x + x1, start.y + y1);
			} else {
				start = new Pos(x1, y1);
				end = new Pos(start.x + x2, start.y + y2);
			}
			this.$path.push(new Line(start, end, this.$lineStyle, this.style));
		};

		public calcSquareLine() {
			//	1. Case		/------\
			//				|...T...|
			//				\-------/
			//			|---------|
			//			|
			//		/-------\
			//		|...S...|
			//		\-------/
			if (this.$sNode.y - 40 > this.$tNode.y + this.$tNode.height) { // oberseite von source and unterseite von target
				this.addLineTo(this.$sNode.x + this.$sNode.width / 2, this.$sNode.y, 0, -20);
				this.addLine(this.$tNode.x + this.$tNode.width / 2, this.$tNode.y + this.$tNode.height + 20);
				this.addLineTo(0, -20);
				return true;
			}
			if (this.$tNode.y - 40 > this.$sNode.y + this.$sNode.height) { // oberseite von source and unterseite von target
				// fall 1 nur andersherum
				this.addLineTo(this.$sNode.x + this.$sNode.width / 2, this.$sNode.y + this.$sNode.height, 0, +20);
				this.addLine(this.$tNode.x + this.$tNode.width / 2, this.$tNode.y - 20);
				this.addLineTo(0, 20);
				return true;
			}
			//3. fall ,falls s (source) komplett unter t (target) ist
			// beide oberseiten
			//	3. Case
			//			 |--------
			//			/---\	 |
			//			| T |	/---\
			//			\---/	| S |
			//					-----
			// or
			//			-------|
			//			|	 /---\
			//		/----\	 | T |
			//		| S	 |	 \---/
			//		------
			//
			this.addLineTo(this.$sNode.x + this.$sNode.width / 2, this.$sNode.y, 0, -20);
			this.addLine(this.$tNode.x + this.$tNode.width / 2, this.$tNode.y - 20);
			this.addLineTo(0, 20);
			return true;
		};
		static Range(min:Pos, max:Pos, x:number, y:number) {
			max.x = Math.max(max.x, x);
			max.y = Math.max(max.y, y);
			min.x = Math.min(min.x, x);
			min.y = Math.min(min.y, y);
		}

		public calcOffset() {
			var i, z, min = new Pos(999999999, 999999999), max = new Pos(0, 0), item, svg, value, x, y;
			for (i = 0; i < this.$path.length; i += 1) {
				item = this.$path[i];
				if (item instanceof Line) {
					Edge.Range(min, max, item.source.x, item.source.y);
					Edge.Range(min, max, item.target.x, item.target.y);
				} else if (item instanceof Path) {
					value = document.createElement('div');
					svg = util.create({tag: "svg"});
					svg.appendChild(item.draw());
					value = svg.childNodes[0];
					x = y = 0;
					if (!value.pathSegList) {
						continue;
					}
					for (z = 0; z < value.pathSegList.length; z += 1) {
						item = value.pathSegList[z];
						switch (item.pathSegType) {
							case SVGPathSeg.PATHSEG_MOVETO_ABS:
							case SVGPathSeg.PATHSEG_LINETO_ABS:
							case SVGPathSeg.PATHSEG_ARC_ABS:
							case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
								x = item.x;
								y = item.y;
								break;
							case SVGPathSeg.PATHSEG_MOVETO_REL:
							case SVGPathSeg.PATHSEG_LINETO_REL:
							case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
							case SVGPathSeg.PATHSEG_ARC_REL:
								x = x + item.x;
								y = y + item.y;
								break;
						}
						Edge.Range(min, max, x, y);
					}
				}
			}
			return {x: min.x, y: min.y, width: max.x - min.x, height: max.y - min.y};
		};

		public draw(typ:string) : HTMLElement{
			var i, style, angle, item, offset;
			offset = this.calcOffset();
			if (this.getRoot().getTyp() === "svg") {
				this.board = this.$gui = util.create({tag: "g"});
			} else {
				this.$gui = util.create({tag: "svg", style: {position: "absolute"}});
				this.board = util.create({tag: "g", transform: "translate(-" + offset.x + ", -" + offset.y + ")"});
				this.$gui.appendChild(this.board);
			}
			util.setPos(this.$gui, offset.x, offset.y);
			util.setSize(this.$gui, offset.x, offset.y);
			for (i = 0; i < this.$path.length; i += 1) {
				item = this.$path[i];

				if (item instanceof Line) {
					style = item.style || this.style;
					this.board.appendChild(item.draw());
				} else if (item instanceof Path) {
					this.board.appendChild(item.draw());
				}
			}
			this.drawSourceText(style);
			if (this.info) {
				angle = this.info.draw();
				this.board.appendChild(new SymbolLibary().create({
					typ: "Arrow",
					x: this.info.x,
					y: this.info.y,
					rotate: angle
				}));
			}
			this.drawTargetText(style);
			return this.$gui;
		};
		public drawText(info, style) {
			if (this.$path.length < 1) {
				return;
			}
			var options, angle, p, item;
			p = this.$path[0];
			options = this.getRoot()["model"].options;
			if (options.rotatetext) {
				info.$angle = Math.atan((p.source.y - p.target.y) / (p.source.x - p.target.x)) * 60;
			}
			if (this.getRoot().getTyp() === "svg") {
				item = info.drawSVG();
			} else {
				item = info.drawHTML();
			}
			if (!this.$labels) {
				this.$labels = [];
			}
			if (item) {
				this.$labels.push(item);
				this.getRoot()["board"].appendChild(item);
			}
			return angle;
		};

		public drawSourceText(style) {
			this.drawText(this.source, style);
		};

		public drawTargetText(style) {
			this.drawText(this.target, style);
		};

		public endPos() :PathElement{
			return this.$path[this.$path.length - 1];
		};

		public edgePosition() {
			var pos = 0, i;
			for (i = 0; i < this.$sNode.$edges.length; i += 1) {
				if (this.$sNode.$edges[i] === this) {
					return pos;
				}
				if (this.$sNode.$edges[i].$tNode === this.$tNode) {
					pos += 1;
				}
			}
			return pos;
		};

		public getCenterPosition(node, pos:string) :Pos{
			var offset = node["$" + pos];
			if (pos === Edge.Position.DOWN) {
				return new Pos(Math.min(node.$center.x + offset, node.x + node.width), (node.y + node.height), Edge.Position.DOWN);
			}
			if (pos === Edge.Position.UP) {
				return new Pos(Math.min(node.$center.x + offset, node.x + node.width), node.y, Edge.Position.UP);
			}
			if (pos === Edge.Position.LEFT) {
				return new Pos(node.x, Math.min(node.$center.y + offset, node.y + node.height), Edge.Position.LEFT);
			}
			if (pos === Edge.Position.RIGHT) {
				return new Pos(node.x + node.width, Math.min(node.$center.y + offset, node.y + node.height), Edge.Position.RIGHT);
			}
		};

		public calcOwnEdge() {
			//this.source
			var sPos, tPos, offset = 20;
			this.$start = this.getFree(this.$sNode);
			if (this.$start.length > 0) {
				this.$end = this.getFreeOwn(this.$sNode, this.$start);
			} else {
				this.$start = Edge.Position.RIGHT;
				this.$end = Edge.Position.DOWN;
			}

			sPos = this.getCenterPosition(this.$sNode, this.$start);
			if (this.$start === Edge.Position.UP) {
				tPos = new Pos(sPos.x, sPos.y - offset);
			} else if (this.$start === Edge.Position.DOWN) {
				tPos = new Pos(sPos.x, sPos.y + offset);
			} else if (this.$start === Edge.Position.RIGHT) {
				tPos = new Pos(sPos.x + offset, sPos.y);
			} else if (this.$start === Edge.Position.LEFT) {
				tPos = new Pos(sPos.x - offset, sPos.y);
			}
			this.$path.push(new Line(sPos, tPos, this.$lineStyle));
			if (this.$end === Edge.Position.LEFT || this.$end === Edge.Position.RIGHT) {
				if (this.$start === Edge.Position.LEFT) {
					sPos = tPos;
					tPos = new Pos(sPos.x, this.$sNode.y - offset);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				} else if (this.$start === Edge.Position.RIGHT) {
					sPos = tPos;
					tPos = new Pos(sPos.x, this.$sNode.y + offset);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				}
				sPos = tPos;
				if (this.$end === Edge.Position.LEFT) {
					tPos = new Pos(this.$sNode.x - offset, sPos.y);
				} else {
					tPos = new Pos(this.$sNode.x + this.$sNode.width + offset, sPos.y);
				}
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				sPos = tPos;
				tPos = new Pos(sPos.x, this.$sNode.$center.y);
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				if (this.info) {
					this.info.x = (sPos.x + tPos.x) / 2;
					this.info.y = sPos.y;
				}
			} else if (this.$end === Edge.Position.UP || this.$end === Edge.Position.DOWN) {
				if (this.$start === Edge.Position.UP) {
					sPos = tPos;
					tPos = new Pos(this.$sNode.x + this.$sNode.width + offset, sPos.y);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				} else if (this.$start === Edge.Position.DOWN) {
					sPos = tPos;
					tPos = new Pos(this.$sNode.x - offset, sPos.y);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				}
				sPos = tPos;
				if (this.$end === Edge.Position.UP) {
					tPos = new Pos(sPos.x, this.$sNode.y - offset);
				} else {
					tPos = new Pos(sPos.x, this.$sNode.y + this.$sNode.height + offset);
				}
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				sPos = tPos;
				tPos = new Pos(this.$sNode.$center.x, sPos.y);
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				if (this.info) {
					this.info.x = sPos.x;
					this.info.y = (sPos.y + tPos.y) / 2;
				}
			}
			sPos = tPos;
			this.$path.push(new Line(sPos, this.getCenterPosition(this.$sNode, this.$end), this.$lineStyle));
		};

		public getFree(node) {
			var i;
			for (i in Edge.Position) {
				if (!Edge.Position.hasOwnProperty(i)) {
					continue;
				}
				if (!node.hasOwnProperty("$" + i)) {
					continue;
				}
				if (node["$" + i] === 0) {
					node["$" + i] = 1;
					return i;
				}
			}
			return "";
		};

		public getFreeOwn(node, start) {
			var id = 0, i, list = [Edge.Position.UP, Edge.Position.RIGHT, Edge.Position.DOWN, Edge.Position.LEFT, Edge.Position.UP, Edge.Position.RIGHT, Edge.Position.DOWN];
			for (i = 0; i < list.length; i += 1) {
				if (list[i] === start) {
					id = i;
					break;
				}
			}
			if (node["$" + list[id + 1]] === 0 || node["$" + list[id + 1]] < node["$" + list[id + 3]]) {
				node["$" + list[id + 1]] += 1;
				return list[id + 1];
			}
			node["$" + list[id + 3]] += 1;
			return list[id + 3];
		};

		public calcInfoPos(linePos, item, info:Info) {
			// Manuell move the InfoTag
			var newY, newX, spaceA = 20, spaceB = 0, step = 15;
			if (item.$parent.options && !item.$parent.options.rotatetext) {
				spaceA = 20;
				spaceB = 10;
			}
			if (info.custom || info.getText().length < 1) {
				return;
			}
			newY = linePos.y;
			newX = linePos.x;
			if (linePos.$id === Edge.Position.UP) {
				newY = newY - info.getHeight()- spaceA;
				if (this.$m !== 0) {
					newX = (newY - this.$n) / this.$m + spaceB + (item.$UP * step);
				}
			} else if (linePos.$id === Edge.Position.DOWN) {
				newY = newY + spaceA;
				if (this.$m !== 0) {
					newX = (newY - this.$n) / this.$m + spaceB + (item.$DOWN * step);
				}
			} else if (linePos.$id === Edge.Position.LEFT) {
				newX = newX - info.getWidth() - (item.$LEFT * step) - spaceA;
				if (this.$m !== 0) {
					newY = (this.$m * newX) + this.$n;
				}
			} else if (linePos.$id === Edge.Position.RIGHT) {
				newX += (item.$RIGHT * step) + spaceA;
				if (this.$m !== 0) {
					newY = (this.$m * newX) + this.$n;
				}
			}
			info.x = Math.round(newX);
			info.y = Math.round(newY);
		};

		public getUDPosition(m, n, e, pos, step?:number) {
			var x, y = e.getY();
			if (pos === Edge.Position.DOWN) {
				y += e.height;
			}
			x = (y - n) / m;
			if (step) {
				x += e["$" + pos] * step;
				if (x < e.getX()) {
					x = e.getX();
				} else if (x > (e.getX() + e.width)) {
					x = e.getX() + e.width;
				}
			}
			return new Pos(x, y, pos);
		};

		public getLRPosition(m, n, e, pos, step?:number) {
			var y, x = e.getX();
			if (pos === Edge.Position.RIGHT) {
				x += e.width;
			}
			y = m * x + n;
			if (step) {
				y += e["$" + pos] * step;
				if (y < e.getY()) {
					y = e.getY();
				} else if (y > (e.getY() + e.height)) {
					y = e.getY() + e.height;
				}
			}
			return new Pos(x, y, pos);
		}
		public getPosition(m, n, entity, refCenter) {
			var t, pos = [], list, distance = [], min = 999999999, position, i, step = 15;
			list = [Edge.Position.LEFT, Edge.Position.RIGHT];
			for (i = 0; i < 2; i += 1) {
				t = this.getLRPosition(m, n, entity, list[i]);
				if (t.y >= entity.getY() && t.y <= (entity.getY() + entity.height)) {
					t.y += (entity["$" + list[i]] * step);
					if (t.y > (entity.getY() + entity.height)) {
						// Alternative
						t = this.getUDPosition(m, n, entity, Edge.Position.DOWN, step);
					}
					pos.push(t);
					distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
				}
			}
			list = [Edge.Position.UP, Edge.Position.DOWN];
			for (i = 0; i < 2; i += 1) {
				t = this.getUDPosition(m, n, entity, list[i]);
				if (t.x >= entity.getX() && t.x <= (entity.getX() + entity.width)) {
					t.x += (entity["$" + list[i]] * step);
					if (t.x > (entity.getX() + entity.width)) {
						// Alternative
						t = this.getLRPosition(m, n, entity, Edge.Position.RIGHT, step);
					}
					pos.push(t);
					distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
				}
			}
			for (i = 0; i < pos.length; i += 1) {
				if (distance[i] < min) {
					min = distance[i];
					position = pos[i];
				}
			}
			return position;
		};

		public calcMoveLine(size, angle, move) {
			var lineangle, angle1, angle2, hCenter, startArrow, h;
			if (this.$path.length < 1) {
				return;
			}
			startArrow = this.endPos()["source"];
			this.$endPos = this.endPos().target;
			// calculate the angle of the line
			lineangle = Math.atan2(this.$endPos.y - startArrow.y, this.$endPos.x - startArrow.x);
			// h is the line length of a side of the arrow head
			h = Math.abs(size / Math.cos(angle));
			angle1 = lineangle + Math.PI + angle;
			hCenter = Math.abs((size / 2) / Math.cos(angle));

			this.$top = new Pos(this.$endPos.x + Math.cos(angle1) * h, this.$endPos.y + Math.sin(angle1) * h);
			this.$topCenter = new Pos(this.$endPos.x + Math.cos(angle1) * hCenter, this.$endPos.y + Math.sin(angle1) * hCenter);
			angle2 = lineangle + Math.PI - angle;
			this.$bot = new Pos(this.$endPos.x + Math.cos(angle2) * h, this.$endPos.y + Math.sin(angle2) * h);
			this.$botCenter = new Pos(this.$endPos.x + Math.cos(angle2) * hCenter, this.$endPos.y + Math.sin(angle2) * hCenter);
			if (move) {
				this.endPos().target = new Pos((this.$top.x + this.$bot.x) / 2, (this.$top.y + this.$bot.y) / 2);
			}
		};
	}
	//				######################################################### Generalisation #########################################################
	export class Generalisation extends Edge {
		constructor() {
			super();
			this.typ = "Generalisation";
		}

		public calc(board) : boolean{
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 50, true);
			this.$path.push(new Line(new Pos(this.$top.x, this.$top.y), new Pos(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Pos(this.$bot.x, this.$bot.y), new Pos(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Pos(this.$top.x, this.$top.y), new Pos(this.$bot.x, this.$bot.y)));
			return true;
		}

		public drawSourceText(style) {
		};

		public drawTargetText(style) {
		};
	}
	//				######################################################### Implements #########################################################
	export class Implements extends Generalisation {
		constructor() {
			super();
			this.typ = "Implements";
			this.$lineStyle = Line.Format.DOTTED
		}
	}
	//				######################################################### Unidirectional #########################################################
	export class Unidirectional extends Edge {
		constructor() {
			super();
			this.typ = "Unidirectional";
		}
		public calc(board) {
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 50, false);
			this.$path.push(new Line(new Pos(this.$top.x, this.$top.y), new Pos(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Pos(this.$bot.x, this.$bot.y), new Pos(this.$endPos.x, this.$endPos.y)));
			return true;
		};
	}
	//				######################################################### Aggregation #########################################################
	export class Aggregation extends Edge {
		constructor() {
			super();
			this.typ = "Aggregation";
		}

		public calc(board) {
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 49.8, true);
			this.$path.push(new Path().withPath([this.endPos().target, this.$topCenter, this.$endPos, this.$botCenter], true, true).withFill("#FFF"));
			return true;
		}
	}
	//				######################################################### Composition #########################################################
	export class Composition extends Edge {
		constructor() {
			super();
			this.typ = "Composition";
		}
		public calc(board) {
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 49.8, true);
			this.$path.push(new Path().withPath([this.endPos().target, this.$topCenter, this.$endPos, this.$botCenter],true, true).withFill("#000"));
			return true;
		}
	}
}