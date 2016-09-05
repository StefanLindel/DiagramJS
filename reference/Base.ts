/*
 NetworkParser
 Copyright (c) 2011 - 2014, Stefan Lindel
 All rights reserved.

 Licensed under the EUPL, Version 1.1 or (as soon they
 will be approved by the European Commission) subsequent
 versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
 You may obtain a copy of the Licence at:

 http://ec.europa.eu/idabc/eupl5

 Unless required by applicable law or agreed to in
 writing, software distributed under the Licence is
 distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied.
 See the Licence for the specific language governing
 permissions and limitations under the Licence.
 */
// VERSION: 2015.11.09 20:21
/*jslint forin:true, newcap:true, node: true, continue: true */
/*global document: false, window: false, navigator: false, unescape: false, java:false, Image: false, Blob: false, FileReader:false */
/*global jsPDF: false, svgConverter: false, dagre: false, SVGPathSeg: false*/
module Diagram {
	'use strict';
	//				######################################################### Pos #########################################################
	/**
	 * Creates new Pos document object instance. Position with X,Y and ID
	 * @class
	 * @returns {Pos}
	 * @name Pos
	 */
	export class Pos{
		x:number;
		y:number;
		private $id:string;
		constructor(x: number, y: number, id?: string) {this.x = Math.round(x || 0); this.y = Math.round(y || 0); if (id) {this.$id = id; } };
	}
	//				######################################################### Options #########################################################
	export class Options {
		layout : Object;
		font : Object;
		canvasid:string;
		display : string;
		raster : boolean;
		propertyinfo: boolean;
		CardinalityInfo: boolean;
		private rotatetext: boolean;
		private linetyp: string;
		buttons: Array<string>;

		minWidth:number;
		minHeight:string;
		clearCanvas:boolean;
		constructor() {
			this.display = "svg";
			this.font = {"font-size": "10px", "font-family": "Verdana"};
			this.layout = {name: "Dagre", rankDir: "TB", nodesep: 10};	// Dagre TB, LR
			this.CardinalityInfo = true;
			this.propertyinfo = true;
			this.rotatetext = true;
			this.linetyp = "center";
			this.buttons = ["HTML", "SVG"];	// ["HTML", "SVG", "PNG", "PDF"]
		}
	}
	 //				######################################################### GraphNode #########################################################
    export class Node {
        $parent:Node = null;
        id:string;
        typ:string;
        protected status:string;
        protected $isDraggable:boolean = true;
		x:number = 0;
		y:number = 0;
		width:number = 0;
		height:number = 0;
		counter:number;
		constructor(typ:string, id?:string) {
            this.id = id;
        }
		public getOptions() : Options {
			return null;
		}
		public getX(absolute:boolean):number {
			if (this.$parent && absolute) {
				return this.$parent.getX(true) + this.x;
			}
			return this.x;
		}
		public getY(absolute:boolean):number {
			if (this.$parent&& absolute) {
				return this.$parent.getY(true) + this.y;
			}
			return this.y;
		}
		public getHeight():number {
			return this.height;
		}
		public getWidth():number {
			return this.width;
		}
        public getRoot():Node {
            if (this.$parent) {
                return this.$parent.getRoot();
            }
            return this;
        }

        public set(id, value):void {
            if (value) {
                this[id] = value;
            }
        }

		public getTyp():string {
			return this.typ;
		}
        public get(id):any {
            return this[id]
        }

        public isClosed():boolean {
            if (this.status === "close") {
                return true;
            }
            if (this.$parent) {
                return this.$parent.isClosed();
            }
            return false;
        }

        public draw(typ?:string):HTMLElement {
            return null;
        }

        public getTarget(startNode:Node):Node {
            if (this.isClosed()) {
                return this;
            } else if (this.status === "open" || this.$parent === null) {
                return startNode;
            }
            return this.$parent.getTarget(startNode);
        }
		public getShowed() : Node {
			return this;
		}
        public createdElement(element:HTMLElement, typ:string, parent?:Node) : void {
        }
    }

	export class GraphNode extends Node{
		$gui:any;
		$edges:Array<any>;
		$center:Pos;
		private $RIGHT:number;
		private $LEFT:number;
		private $UP:number;
		private $DOWN:number;

		constructor(id?:string) {
            super("node", id);
		};
		public getEdges() : Array<any>{
			return this.$edges;
		}
		public clear() : void {
			this.$RIGHT = this.$LEFT = this.$UP = this.$DOWN = 0;
		};
		public getShowed() : Node {
			if (this.status === "close") {
				if (!this.$parent.isClosed()) {
					return this;
				}
			}
			if (this.isClosed()) {
				return this.$parent.getShowed();
			}
			return this;
		}
		public getHeight():number {
			return this.height;
		}
		public getWidth():number {
			return this.width;
		}
		public removeFromBoard(board) : void {
			if (this.$gui) {
				board.removeChild(this.$gui);
				this.$gui = null;
			}
		};
		public addEdge(edge) : void {
			if (!this.$edges) {
				this.$edges = [];
			}
			this.$edges.push(edge);
		}
		public draw(typ?:string) : HTMLElement{
			if (typ) {
				if (typ.toLowerCase() === "html") {
					return this.drawHTML();
				}
			} else {
				if (this.getRoot()["model"].options.display.toLowerCase() === "html") {
					return this.drawHTML();
				}
			}
			return this.drawSVG();
		}

		public drawSVG(draw?:boolean) : HTMLElement{
			var item, content;
			content = this["content"];
			if (content) {
				content.width = content.width || 0;
				content.height = content.height || 0;
				if (content.plain) {
					return util.create({
						tag: "text",
						$font: true,
						"text-anchor": "left",
						"x": (this.x + 10),
						value: content.plain
					});
				}
				if (content.src) {
					item = new SymbolLibary().createImage(content, this);
					if (!item) {
						return null;
					}
					return item;
				}
				item = util.create({tag: "g", model: this});
				if (content.svg) {
					item.setAttribute('transform', "translate(" + this.x + " " + this.y + ")");
					item.innerHTML = content.$svg;
					return item;
				}
				if (content.html) {
					item.setAttribute('transform', "translate(" + this.x + " " + this.y + ")");
					item.innerHTML = content.$svg;
					return item;
				}
			}
			item = util.create({
				tag: "circle",
				"class": "Node",
				cx: this.x + 10,
				cy: this.y + 10,
				r: "10",
				model: this,
				width: this.width,
				height: this.height
			});
			return item;
		};

		public drawHTML(draw?:boolean) : HTMLElement{
			var item = util.create({tag: "div", model: this}), content;
			content = this["content"];
			util.setPos(item, this.x, this.y);
			if (content) {
				content.width = content.width || 0;
				content.height = content.height || 0;
				if (content.src) {
					item = new SymbolLibary().createImage(content, this);
					if (!item) {
						return null;
					}
					item.appendChild(item);
				}
				if (content.html) {
					item.innerHTML = content.html;
				}
				return item;
			}
			return util.create({tag: "div", "class": "Node", model: this});
		}
	}
	//				######################################################### Info #########################################################
	export class Info extends Node{
        custom:boolean;
		private property:string;
		private cardinality:string;
		private $center:Pos;
		private $angle:number;
		private $counter:number;
		x:number = 0;
		y:number = 0;

		constructor(info:any, parent:GraphNode, counter:number) {
            super("Info");
			if (typeof (info) === "string") {
				this.id = info;
			} else {
				if (info.property) {
					this.property = info.property;
				}
				if (info.cardinality) {
					this.cardinality = info.cardinality;
				}
				this.id = info.id;
			}
			this.$center = new Pos(0,0);
			this.$parent = parent;
			this.$isDraggable = true;
			this.$counter = counter;
		}
		public drawSVG(draw ?:boolean) : HTMLElement{
			var text:string = this.getText(), child, group, i:number, items:Array<string> = text.split("\n");
			if (text.length < 1) {
				return null;
			}
			if (items.length > 1) {
				group = util.create({tag: "g", "class": "draggable", rotate: this.$angle, model: this});
				for (i = 0; i < items.length; i += 1) {
					child = util.create({
						tag: "text",
						$font: true,
						"text-anchor": "left",
						"x": this.getX(false),
						"y": this.getY(false) + (this.getHeight() * i)
					});
					child.appendChild(document.createTextNode(items[i]));
					group.appendChild(child);
				}
				this.getRoot().createdElement(group, "info", this);
				return group;
			}
			group = util.create({
				tag: "text",
				"#$font": true,
				"text-anchor": "left",
				"x": this.getX(false),
				"y": this.getY(false),
				value: text,
				"id": this.id,
				"class": "draggable InfoText",
				rotate: this.$angle,
				model: this
			});
			this.getRoot().createdElement(group, "info", this);
			return group;
		};

		public drawHTML(draw?:boolean) : HTMLElement {
			var text:string = this.getText(), info;
			info = util.create({tag: "div", $font: true, model: this, "class": "EdgeInfo", value: text});
			if (this.$angle !== 0) {
				info.style.transform = "rotate(" + this.$angle + "deg)";
				info.style.msTransform = info.style.MozTransform = info.style.WebkitTransform = info.style.OTransform = "rotate(" + this.$angle + "deg)";
			}
			util.setPos(info, this.getX(false), this.getY(false));
			this.getRoot().createdElement(info, "info", this);
			return info;
		}
		public getText() : string {
			var isProperty:boolean, isCardinality:boolean, infoTxt:string = "", graph:any = this.$parent;
			isCardinality = graph.typ === "classdiagram" && graph.options.CardinalityInfo;
			isProperty = graph.options.propertyinfo;

			if (isProperty && this.property) {
				infoTxt = this.property;
			}
			if (isCardinality && this.cardinality) {
				if (infoTxt.length > 0) {
					infoTxt += "\n";
				}
				if (this.cardinality.toLowerCase() === "one") {
					infoTxt += "0..1";
				} else if (this.cardinality.toLowerCase() === "many") {
					infoTxt += "0..*";
				}
			}
			if (this.$counter > 0) {
				infoTxt += " (" + this.$counter + ")";
			}
			return infoTxt;
		}
        public initInfo() : string {
            var root:any= this.$parent.getRoot();
            if (!root.model.options.CardinalityInfo && !root.model.options.propertyinfo) {
                return null;
            }
            var infoTxt = this.getText();
            if (infoTxt.length > 0) {
                util.sizeOf(infoTxt, root, this);
            }
            return infoTxt;
        }
	}
	export interface PathElement {target:any;}
	//				######################################################### Line #########################################################
	export class Line implements PathElement {
		private line:string;
		private color:string;
		source:Pos;
		target:Pos;
		constructor(source:Pos, target:Pos, line?:string, color?:string) {
			this.source = source;
			this.target = target;
			this.line = line;
			this.color = color;
		}

		public static Format = {SOLID: "SOLID", DOTTED: "DOTTED"};

		public draw(draw?:boolean) : HTMLElement {
			var line = util.create({
				tag: "line",
				'x1': this.source.x,
				'y1': this.source.y,
				'x2': this.target.x,
				'y2': this.target.y,
				"stroke": util.getColor(this.color)
			});
			if (this.line && this.line.toLowerCase() === "dotted") {
				line.setAttribute("stroke-miterlimit", "4");
				line.setAttribute("stroke-dasharray", "1,1");
			}
			return line;
		}
	}

	//				######################################################### Path #########################################################
	export class Path implements PathElement{
		private angle:number;
		private fill:string;
		private path:string;
		target:Pos;

		public withFill(fill:string) : Path{
			this.fill = fill;
			return this;
		}
		public withAngle(angle:number) : Path{
			this.angle = angle;
			return this;
		}

		public withPath(path:Array<Pos>, close, angle?:any) : Path{
			var i:number, d:string = "M" + path[0].x + " " + path[0].y;
			for (i = 1; i < path.length; i += 1) {
				d = d + "L " + path[i].x + " " + path[i].y;
			}
			if (close) {
				d = d + " Z";
                this.target = path[0];
			} else {
                this.target = path[path.length - 1];
            }
			this.path = d;
			if(angle instanceof Number) {
				this.angle = angle;
			}else if(angle)
			{
				var lineangle, start = path[0], end = path[path.length - 1];
				lineangle = Math.atan2(end.y - start.y, end.x - start.x);
			}
			return this;
		}
		public withString(path:string) {
			this.path = path;
			return this;
		}

		public draw(draw?:boolean) : HTMLElement {
			return util.create({tag: "path", "d": this.path, "fill": this.fill, stroke: "#000", "stroke-width": "1px"});
		};
	}
	//				###################################################### SymbolLibary ####################################################################################
// Example Items
// {tag: "path", d: ""}
// {tag: "rect", width:46, height:34}
// {tag: "ellipse", width:23, height:4}
// {tag: "line", x1:650, y1:-286, x2:650, y2:-252}
// {tag: "circle", r:5, x:12, y:0}
// {tag: "image", height: 30, width: 50, content$src: hallo}
// {tag: "text", "text-anchor": "left", x: "10"}
	export class SymbolLibary {
		public create(node) {
			if (this.isSymbol(node)) {
				return this.draw(node);
			}
			return null;
		}
		public upFirstChar(txt) {
			return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
		}
		public isSymbol(node) {
			var fn = this[this.getName(node)];
			return typeof fn === "function";
		}
		public getName(node) {
			if (node.typ) {
				return "draw" + this.upFirstChar(node.typ);
			}
			if (node.src) {
				return "draw" + this.upFirstChar(node.src);
			}
			return "drawNode";
		}
		public draw(node, parent?:Object) {
			var group, board, item, fn = this[this.getName(node)];
			if (typeof fn === "function") {
				group = fn.apply(this, [node]);
				if (!parent) {
					board = util.create({tag: "svg", style: {left: group.x, top: group.y, position: "absolute"}});
					node.width = node.width + 2;
					this.createGroup(node, group, board);
					return board;
				}
				return this.createGroup(node, group, null);
			}
		}
		public createImage(node, model) {
			var n, img;
			node.model = node;

			if (this.isSymbol(node)) {
				return this.draw(null, node);
			}
			n = {tag: "img", model: node, src: node.src};
			if (node.width || node.height) {
				n.width = node.width;
				n.height = node.height;
			} else {
				n.xmlns = "http://www.w3.org/1999/xhtml";
			}
			img = util.create(n);
			if (!node.width && !node.height) {
				model.appendImage(img);
				return null;
			}
			return img;
		}
		public createGroup(node, group, g?:any) {
			var func, y, yr, z, box, item, transform, i, offsetX = 0, offsetY = 0;
			if (!g) {
				g = util.create({tag: "g"});
				transform = "translate(" + group.x + " " + group.y + ")";
				if (group.scale) {
					transform += " scale(" + group.scale + ")";
				}
				if (group.rotate) {
					transform += " rotate(" + group.rotate + ")";
				}
				g.setAttribute('transform', transform);
			}
			for (i = 0; i < group.items.length; i += 1) {
				g.appendChild(util.create(group.items[i]));
			}
			if (!node.height) {
				node.height = group.height;
			}
			if (!node.minheight) {
				node.minheight = node.height;
			}
			if (!node.maxheight) {
				node.maxheight = node.height;
			}

			if (node.elements) {
				for (i = 0; i < node.elements.length; i += 1) {
					if (!node.elements[i] && node.elements[i].length < 1) {
						node.elements.splice(i, 1);
						i -= 1;
					}
				}
				box = util.create({tag: "g"});
				z = node.elements.length * 25 + 6;
				box.appendChild(util.create({
					tag: "rect",
					rx: 0,
					x: offsetX,
					y: (offsetY + 28),
					width: 60,
					height: z,
					stroke: "#000",
					fill: "#fff",
					opacity: "0.7"
				}));
				node.maxheight = z + node.minheight;

				g.elements = node.elements;
				g.activ = util.create({
					tag: "text",
					$font: true,
					"text-anchor": "left",
					"width": 60,
					"x": (10 + offsetX),
					"y": 20,
					value: node.activText
				});
				g.appendChild(g.activ);
				y = offsetY + 46;
				yr = offsetY + 28;

				func = function (event) {
					g.activ.textContent = event.currentTarget.value;
				};
				for (z = 0; z < node.elements.length; z += 1) {
					box.appendChild(util.create({
						tag: "text",
						$font: true,
						"text-anchor": "left",
						"width": 60,
						"x": 10,
						"y": y,
						value: node.elements[z]
					}));
					item = box.appendChild(util.create({
						tag: "rect",
						rx: 0,
						x: offsetX,
						y: yr,
						width: 60,
						height: 24,
						stroke: "none",
						"class": "SVGChoice"
					}));
					item.value = node.elements[z];
					if (node.action) {
						item.onclick = node.action;
					} else {
						item.onclick = func;
					}
					y += 26;
					yr += 26;
				}
				g.choicebox = box;
			}
			g.tool = node;
			g.onclick = function () {
				if (g.status === "close") {
					g.open();
				} else {
					g.close();
				}
			};
			g.close = function () {
				if (g.status === "open" && g.choicebox) {
					this.removeChild(g.choicebox);
				}
				g.status = "close";
				g.tool.height = g.tool.minheight;
				//typ.util.setSize(g, g.tool.width + g.tool.x, g.tool.height + g.tool.y);
				util.setSize(g, g.tool.width, g.tool.height);
			};
			g.open = function () {
				if (this.tagName === "svg") {
					return;
				}
				if (g.status === "close" && g.choicebox) {
					this.appendChild(g.choicebox);
				}
				g.status = "open";
				g.tool.height = g.tool.maxheight;
				util.setSize(g, g.tool.width, g.tool.height);
				//typ.util.setSize(g, g.tool.width + g.tool.x + 10, g.tool.height + g.tool.y + 10);
			};
			g.close();

			return g;
		};

		public addChild(parent, json) {
			var item;
			if (json.offsetLeft) {
				item = json;
			} else {
				item = util.create(json);
			}
			item.setAttribute("class", "draggable");
			parent.appendChild(item);
		};
		public drawSmily(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 50,
				height: 52,
				items: [
					{
						tag: "path",
						stroke: "black",
						fill: "none",
						d: "m49.01774,25.64542a24.5001,24.5 0 1 1 -49.0001,0a24.5001,24.5 0 1 1 49.0001,0z"
					},
					{tag: "path", d: "m8,31.5c16,20 32,0.3 32,0.3"},
					{tag: "path", d: "m19.15,20.32a1.74,2.52 0 1 1 -3.49,0a1.74,2.52 0 1 1 3.49,0z"},
					{tag: "path", d: "m33,20.32a1.74,2.52 0 1 1 -3.48,0a1.74,2.52 0 1 1 3.48,0z"},
					{tag: "path", d: "m5.57,31.65c3.39,0.91 4.03,-2.20 4.03,-2.20"},
					{tag: "path", d: "m43,32c-3,0.91 -4,-2.20 -4.04,-2.20"}
				]
			};
		};

		public drawDatabase(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 25,
				height: 40,
				items: [
					{
						tag: "path",
						stroke: "black",
						fill: "none",
						d: "m0,6.26c0,-6.26 25.03,-6.26 25.03,0l0,25.82c0,6.26 -25.03,6.26 -25.03,0l0,-25.82z"
					},
					{
						tag: "path",
						stroke: "black",
						fill: "none",
						d: "m0,6.26c0,4.69 25.03,4.69 25.03,0m-25.03,2.35c0,4.69 25.03,4.69 25.03,0m-25.03,2.35c0,4.69 25.03,4.69 25.03,0"
					}
				]
			};
		};

		public drawLetter(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 25,
				height: 17,
				items: [
					{tag: "path", stroke: "black", fill: "none", d: "m1,1l22,0l0,14l-22,0l0,-14z"},
					{tag: "path", stroke: "black", fill: "none", d: "m1.06,1.14l10.94,6.81l10.91,-6.91"}
				]
			};
		};

		public drawMobilphone(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 25,
				height: 50,
				items: [
					{
						tag: "path",
						d: "m 4.2 0.5 15.61 0c 2 0 3.7 1.65 3.7 3.7l 0 41.6c 0 2-1.65 3.7-3.7 3.7l-15.6 0c-2 0-3.7-1.6-3.7-3.7l 0-41.6c 0-2 1.6-3.7 3.7-3.7z",
						fill: "none",
						stroke: "black"
					},
					{tag: "path", d: "m 12.5 2.73a 0.5 0.5 0 1 1-1 0 0.5 0.5 0 1 1 1 0z"},
					{tag: "path", d: "m 14 46a 2 2 0 1 1-4 0 2 2 0 1 1 4 0z"},
					{tag: "path", d: "m 8 5 7 0"},
					{tag: "path", d: "m 1.63 7.54 20.73 0 0 34-20.73 0z"}
				]
			};
		};

		public drawWall(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 25,
				height: 50,
				items: [
					{tag: "path", d: "m26,45.44l-5,3.56l-21,-9l0,-36.41l5,-3.56l20.96,9l-0,36.4z"},
					{
						tag: "path",
						stroke: "white",
						d: "m2.21,11l18.34,7.91m-14.46,-12.57l0,6.3m8.2,21.74l0,6.35m-8.6,-10l0,6.351m4.1,-10.67l0,6.3m4.8,-10.2l0,6.3m-8.87,-10.23l0,6.35m4.78,-10.22l0,6.35m-8,14.5l18.34,7.91m-18.34,-13.91l18.34,7.91m-18.34,-13.91l18.34,7.91m-18.34,-13.91l18.34,7.91m0,-13l0,34m-18.23,-41.84l18.3,8m0,0.11l5,-3.57"
					}
				]
			};
		};

		public drawActor(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 25,
				height: 50,
				items: [
					{tag: "line", stroke: "#000", x1: "12", y1: "10", x2: "12", y2: "30"},
					{tag: "circle", stroke: "#000", cy: "5", cx: "12", r: "5"},
					{tag: "line", stroke: "#000", y2: "18", x2: "25", y1: "18", x1: "0"},
					{tag: "line", stroke: "#000", y2: "39", x2: "5", y1: "30", x1: "12"},
					{tag: "line", stroke: "#000", y2: "39", x2: "20", y1: "30", x1: "12"}
				]
			};
		};

		public drawLamp(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 25,
				height: 50,
				items: [
					{
						tag: "path",
						d: "m 22.47 10.58c-6.57 0-11.89 5.17-11.89 11.54 0 2.35 0.74 4.54 2 6.36 2 4 4.36 5.63 4.42 10.4l 11.15 0c 0.12-4.9 2.5-6.8 4.43-10.4 1.39-1.5 1.8-4.5 1.8-6.4 0-6.4-5.3-11.5-11.9-11.5z",
						fill: "white",
						stroke: "black"
					},
					{
						tag: "path",
						d: "m 18.4 40 8 0c 0.58 0 1 0.5 1 1 0 0.6-0.5 1-1 1l-8 0c-0.6 0-1-0.47-1-1 0-0.58 0.47-1 1-1z"
					},
					{
						tag: "path",
						d: "m 18.4 42.7 8 0c 0.58 0 1 0.47 1 1 0 0.58-0.47 1-1 1l-8 0c-0.58 0-1-0.47-1-1 0-0.58 0.46-1 1-1z"
					},
					{
						tag: "path",
						d: "m 18.4 45.3 8 0c 0.58 0 1 0.47 1 1 0 0.58-0.47 1-1 1l-8 0c-0.58 0-1-0.47-1-1 0-0.58 0.46-1 1-1z"
					},
					{tag: "path", d: "m 19.5 48c 0.37 0.8 1 1.3 1.9 1.7 0.6 0.3 1.5 0.3 2 0 0.8-0.3 1.4-0.8 1.9-1.8z"},
					{
						tag: "path",
						d: "m 6 37.5 4.2-4c 0.3-0.3 0.8-0.3 1 0 0.3 0.3 0.3 0.8 0 1.1l-4.2 4c-0.3 0.3-0.8 0.3-1.1 0-0.3-0.3-0.3-0.8 0-1z"
					},
					{
						tag: "path",
						d: "m 39 37.56-4.15-4c-0.3-0.3-0.8-0.3-1 0-0.3 0.3-0.3 0.8 0 1l 4.2 4c 0.3 0.3 0.8 0.3 1 0 0.3-0.3 0.3-0.8 0-1z"
					},
					{
						tag: "path",
						d: "m 38 23 5.8 0c 0.4 0 0.8-0.3 0.8-0.8 0-0.4-0.3-0.8-0.8-0.8l-5.8 0c-0.4 0-0.8 0.3-0.8 0.8 0 0.4 0.3 0.8 0.8 0.8z"
					},
					{
						tag: "path",
						d: "m 1.3 23 6 0c 0.4 0 0.8-0.3 0.8-0.8 0-0.4-0.3-0.8-0.8-0.8l-5.9 0c-0.4 0-0.8 0.3-0.8 0.8 0 0.4 0.3 0.8 0.8 0.8z"
					},
					{
						tag: "path",
						d: "m 34.75 11.2 4-4.1c 0.3-0.3 0.3-0.8 0-1-0.3-0.3-0.8-0.3-1 0l-4 4.1c-0.3 0.3-0.3 0.8 0 1 0.3 0.3 0.8 0.3 1 0z"
					},
					{
						tag: "path",
						d: "m 11.23 10-4-4c-0.3-0.3-0.8-0.3-1 0-0.3 0.3-0.3 0.8 0 1l 4.2 4c 0.3 0.3 0.8 0.3 1 0 0.3-0.3 0.3-0.8 0-1z"
					},
					{
						tag: "path",
						d: "m 21.64 1.3 0 5.8c 0 0.4 0.3 0.8 0.8 0.8 0.4 0 0.8-0.3 0.8-0.8l 0-5.8c 0-0.4-0.3-0.8-0.8-0.8-0.4 0-0.8 0.3-0.8 0.8z"
					},
					{
						tag: "path",
						d: "m 26.1 24.3c-0.5 0-1 0.2-1.3 0.4-1.1 0.6-2 3-2.27 3.5-0.26-0.69-1.14-2.9-2.2-3.5-0.7-0.4-2-0.7-2.5 0-0.6 0.8 0.2 2.2 0.9 2.9 1 0.9 3.9 0.9 3.9 0.9 0 0 0 0 0 0 0.54 0 2.8 0 3.7-0.9 0.7-0.7 1.5-2 0.9-2.9-0.2-0.3-0.7-0.4-1.2-0.4z"
					},
					{tag: "path", d: "m 22.5 28.57 0 10.7"}
				]
			};
		};

		public drawStop(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 30,
				height: 30,
				items: [
					{
						tag: "path",
						fill: "#FFF",
						"stroke-width": "2",
						stroke: "#B00",
						d: "m 6,6 a 14,14 0 1 0 0.06,-0.06 z m 0,0 20,21"
					}
				]
			};
		};

		public drawMin(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 20,
				height: 20,
				items: [
					{
						tag: "path",
						fill: "white",
						stroke: "#000",
						"stroke-width": 0.2,
						"stroke-linejoin": "round",
						d: "m 0,0 19,0 0,19 -19,0 z"
					},
					{
						tag: "path",
						fill: "none",
						stroke: "#000",
						"stroke-width": "1px",
						"stroke-linejoin": "miter",
						d: "m 4,10 13,-0.04"
					}
				]
			};
		};

		public drawArrow(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 10,
				height: 9,
				rotate: node.rotate,
				items: [
					{tag: "path", fill: "#000", stroke: "#000", d: "M 0,0 10,4 0,9 z"}
				]
			};
		};

		public drawMax(node) {
			return {
				x: node.x || 0,
				y: node.y || 0,
				width: 20,
				height: 20,
				items: [
					{
						tag: "path",
						fill: "white",
						stroke: "#000",
						"stroke-width": 0.2,
						"stroke-linejoin": "round",
						"stroke-dashoffset": 2,
						"stroke-dasharray": "4.8,4.8",
						d: "m 0,0 4.91187,0 5.44643,0 9.11886,0 0,19.47716 -19.47716,0 0,-15.88809 z"
					},
					{
						tag: "path",
						fill: "none",
						stroke: "#000",
						"stroke-width": "1px",
						"stroke-linejoin": "miter",
						d: "m 4,10 6,0.006 0.02,5 0.01,-11 -0.03,6.02 c 2,-0.01 4,-0.002 6,0.01"
					}
				]
			};
		};

		public drawButton(node) {
			var btnX, btnY, btnWidth, btnHeight, btnValue;

			btnX = node.x || 0;
			btnY = node.y || 0;
			btnWidth = node.width || 60;
			btnHeight = node.height || 28;
			btnValue = node.value || "";
			return {
				x: btnX,
				y: btnY,
				width: 60,
				height: 28,
				items: [
					{
						tag: "rect",
						rx: 8,
						x: 0,
						y: 0,
						width: btnWidth,
						height: btnHeight,
						stroke: "#000",
						filter: "url(#drop-shadow)",
						"class": "SVGBtn"
					},
					{tag: "text", $font: true, x: 10, y: 18, fill: "black", value: btnValue, "class": "hand"}
				]
			};
		};

		public drawDropdown(node) {
			var btnX, btnY, btnWidth, btnHeight;

			btnX = node.x || 0;
			btnY = node.y || 0;
			btnWidth = node.width || 60;
			btnHeight = node.height || 28;
			return {
				x: btnX,
				y: btnY,
				width: btnWidth,
				height: btnHeight,
				items: [
					{
						tag: "rect",
						rx: 0,
						x: 0,
						y: 0,
						width: btnWidth - 20,
						height: btnHeight,
						stroke: "#000",
						fill: "none"
					},
					{
						tag: "rect",
						rx: 2,
						x: btnWidth - 20,
						y: 0,
						width: 20,
						height: 28,
						stroke: "#000",
						"class": "SVGBtn"
					},
					{
						tag: "path",
						style: "fill:#000000;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1",
						d: "m " + (btnWidth - 15) + ",13 10,0 L " + (btnWidth - 10) + ",20 z"
					}
				]
			};
		};

		public drawClassicon(node) {
			var btnX, btnY, btnWidth, btnHeight;

			btnX = node.x || 0;
			btnY = node.y || 0;
			btnWidth = node.width || 60;
			btnHeight = node.height || 28;
			return {
				x: btnX,
				y: btnY,
				width: btnWidth,
				height: btnHeight,
				items: [
					{
						tag: "path",
						d: "m0,0l10.78832,0l0,4.49982l-10.78832,0.19999l0,9.19963l10.78832,0l0,-9.49962l-10.78832,0.19999l0,-4.59982z",
						style: "fill:none;stroke:#000000;"
					},
					{
						tag: "path",
						d: "m25.68807,0l10.78832,0l0,4.49982l-10.78832,0.19999l0,9.19963l10.78832,0l0,-9.49962l-10.78832,0.2l0,-4.59982z",
						style: "fill:none;stroke:#000000;"
					},
					{tag: "line", x1: 11, y1: 7, x2: 25, y2: 7, stroke: "#000"}
				]
			};
		};

		public drawEdgeicon(node) {
			var btnX, btnY, btnWidth, btnHeight;

			btnX = node.x || 0;
			btnY = node.y || 0;
			btnWidth = node.width || 30;
			btnHeight = node.height || 35;
			return {
				x: btnX,
				y: btnY,
				width: btnWidth,
				height: btnHeight,
				items: [
					{
						tag: "path",
						d: "M2,10 20,10 20,35 2,35 Z M2,17 20,17 M20,10 28,5 28,9 M 28.5,4.7 24,4",
						style: "fill:none;stroke:#000000;transform:scale(0.4);"
					}
				]
			};
		}
	}
	//				######################################################### CSS #########################################################
	export class CSS {
		private name:string;
		css:any;

		constructor(name, item?:any) {
			var i, value, border, prop, el;
			this.name = name;
			this.css = {};
			if (!item) {
				return;
			}

			el = window.getComputedStyle(item, null);
			border = el.getPropertyValue("border");
			for (i in el) {
				prop = i;
				value = el.getPropertyValue(prop);
				if (value && value !== "") {
					// optimize CSS
					if (border) {
						if (prop === "border-bottom" || prop === "border-right" || prop === "border-top" || prop === "border-left") {
							if (value !== border) {
								this.css[prop] = value;
							}
						} else if (prop === "border-color" || prop === "border-bottom-color" || prop === "border-right-color" || prop === "border-top-color" || prop === "border-left-color") {
							if (border.substring(border.length - value.length) !== value) {
								this.css[prop] = value;
							}
						} else if (prop === "border-width") {
							if (border.substring(0, value.length) !== value) {
								this.css[prop] = value;
							}
						} else {
							this.css[prop] = value;
						}
					} else {
						this.css[prop] = value;
					}
				}
			}
		}

		public add(key:string, value) {
			this.css[key] = value;
		};

		public get(key:string) :any{
			var i;
			for (i in this.css) {
				if (i === key) {
					return this.css[key];
				}
			}
			return null;
		};

		public getNumber(key) {
			return parseInt((this.get(key) || "0").replace("px", ""), 10);
		};

		public getString() : string{
			var str, style;
			str = "{";
			for (style in this.css) {
				if (!this.css.hasOwnProperty(style)) {
					continue;
				}
				str = str + style + ":" + this.css[style] + ";";
			}
			str = str + "}";
			return str;
		};

		public static getDefs(board) {
			var defs;
			if (board.getElementsByTagName("defs").length < 1) {
				defs = util.create({tag: "defs"});
				board.insertBefore(defs, board.childNodes[0]);
			} else {
				defs = board.getElementsByTagName("defs")[0];
			}
			return defs;
		};

		public getSVGString = function (board) {
			var str, pos, style, defs, value, filter, z;
			str = "{";
			for (style in this.css) {
				if (!this.css.hasOwnProperty(style)) {
					continue;
				}
				if (style === "border") {
					pos = this.css[style].indexOf(" ");
					str = str + "stroke-width: " + this.css[style].substring(0, pos) + ";";
					pos = this.css[style].indexOf(" ", pos + 1);
					str = str + "stroke:" + this.css[style].substring(pos) + ";";
				} else if (style === "background-color") {
					str = str + "fill: " + this.css[style] + ";";
				} else if (style === "background") {
					value = CSS.getSubstring(this.css[style], "linear-gradient", "(", ")", ",");
					if (value.length > 0) {
						defs = CSS.getDefs(board);
						if (value[0] === "45deg") {
							pos = 1;
							filter = util.create({
								tag: "linearGradient",
								"id": this.name,
								x1: "0%",
								x2: "100%",
								y1: "100%",
								y2: "0%"
							});
						} else {
							filter = util.create({
								tag: "linearGradient",
								"id": this.name,
								x1: "0%",
								x2: "0%",
								y1: "100%",
								y2: "0%"
							});
							pos = 0;
						}
						defs.appendChild(filter);
						while (pos < value.length) {
							value[pos] = value[pos].trim();
							z = value[pos].lastIndexOf(" ");
							filter.appendChild(util.create({
								tag: "stop",
								"offset": value[pos].substring(z + 1),
								style: {"stop-color": value[pos].substring(0, z)}
							}));
							pos += 1;
						}
						str = str + "fill: url(#" + this.name + ");";
						continue;
					}
					str = str + style + ": " + this.css[style] + ";";
					//box-shadow: inset 0 3px 4px #888;
//				<defs>
//					<filter id="drop-shadow">
//						<feGaussianBlur in="SourceAlpha" result="blur-out" stdDeviation="2"></feGaussianBlur>
//						<feOffset in="blur-out" dx="2" dy="2"></feOffset>
//						<feBlend in="SourceGraphic" mode="normal"></feBlend>
//					</filter>
//				</defs>
				} else {
					str = str + style + ": " + this.css[style] + ";";
				}
			}
			str = str + "}";
			return str;
		};

		public static getSubstring(str:string, search:string, startChar:string, endChar:string, splitter:string):any {
			var pos, end, count = 0, array = [];
			pos = str.indexOf(search);
			if (pos > 0) {
				end = str.indexOf(startChar, pos);
				pos = end + 1;
				if (end > 0) {
					while (end < str.length) {
						if (str.charAt(end) === startChar) {
							count += 1;
						}
						if (str.charAt(end) === endChar) {
							count -= 1;
							if (count === 0) {
								if (splitter && pos !== end) {
									array.push(str.substring(pos, end).trim());
								}
								break;
							}
						}
						if (str.charAt(end) === splitter && count === 1) {
							array.push(str.substring(pos, end).trim());
							pos = end + 1;
						}

						end += 1;
					}
					if (splitter) {
						return array;
					}
					return str.substring(pos, end);
				}
				return str.substring(pos);
			}
			return "";
		}

		public static addStyle(board, styleName) {
			var defs, style, css;
			if (styleName.baseVal || styleName.baseVal === "") {
				styleName = styleName.baseVal;
			}
			if (!styleName) {
				return;
			}
			defs = CSS.getDefs(board);
			if (defs.getElementsByTagName("style").length > 0) {
				style = defs.getElementsByTagName("style")[0];
			} else {
				style = util.create({tag: "style"});
				style.item = {};
				defs.appendChild(style);
			}
			if (!style.item[styleName]) {
				css = util.getStyle(styleName);
				style.item[styleName] = css;
				style.innerHTML = style.innerHTML + "\n." + styleName + css.getSVGString(board);
			}
		}

		public static addStyles(board, item) {
			var items, i, className = item.className;

			if (className) {
				if (className.baseVal || className.baseVal === "") {
					className = className.baseVal;
				}
			}
			if (className) {
				items = className.split(" ");
				for (i = 0; i < items.length; i += 1) {
					CSS.addStyle(board, items[i].trim());
				}
			}
			for (i = 0; i < item.childNodes.length; i += 1) {
				this.addStyles(board, item.childNodes[i]);
			}
		}
	}
}
module Diagram.util {
	export function getValue(value) {return parseInt(("0" + value).replace("px", ""), 10); }
	export function isIE() {return document.all && !window["opera"]; }
	export function isFireFox() {return navigator.userAgent.toLowerCase().indexOf('firefox') > -1; }
	export function isOpera() {return navigator.userAgent.indexOf("Opera") > -1; }
	export function getEventX(event) {return (this.isIE) ? window.event["clientX"] : event.pageX; }
	export function getEventY(event) {return (this.isIE) ? window.event["clientY"] : event.pageY; }

	/**
	 * copy One Json into another
	 * @function
	 * @param ref reference Json
	 * @param src source Json
	 * @param full all attributes include privet $
	 * @param replace set the original reference or copy it
	 * @returns ref
	 * @name copy
	 */
	export function copy(ref:any, src:any, full?:boolean, replace?:boolean) : any{
		if (src) {
			var i;
			for (i in src) {
				if (!src.hasOwnProperty(i) || typeof (src[i]) === "function") {
					continue;
				}
				if (i.charAt(0) === "$") {
					if (full) {ref[i] = src[i]; }
					continue;
				}
				if (typeof (src[i]) === "object") {
					if (replace) {
						ref[i] = src[i];
						continue;
					}
					if (!ref[i]) {
						if (src[i] instanceof Array) {
							ref[i] = [];
						} else {
							ref[i] = {};
						}
					}
					this.copy(ref[i], src[i], full);
				} else {
					if (src[i] === "") {
						continue;
					}
					ref[i] = src[i];
				}
			}
			if (src.width) {ref.$startWidth = src.width; }
			if (src.height) {ref.$startHeight = src.height; }
		}
		return ref;
	}
	export function isSVG(tag) {
		var i, list = ["svg", "path", "polygon", "polyline", "line", "rect", "filter", "feGaussianBlur", "feOffset", "feBlend", "linearGradient", "stop", "text", "symbol", "textPath", "defs", "fegaussianblur", "feoffset", "feblend", "circle", "ellipse", "g"];
		for (i = 0; i < list.length; i += 1) {
			if (list[i] === tag) {
				return true;
			}
		}
		return false;
	}
	export function create(node:any) {
		var style, item, xmlns, key, tag, k;
		if (document.createElementNS && (isSVG(node.tag) || node.xmlns || (node.model && node.model.getRoot().getTyp() === "svg"))) {
			if (node.xmlns) {
				xmlns = node.xmlns;
			} else {
				xmlns = "http://www.w3.org/2000/svg";
			}
			if (node.tag === "img" && xmlns) {
				item = document.createElementNS(xmlns, "image");
				item.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
				item.setAttributeNS("http://www.w3.org/1999/xlink", 'href', node.src);
			} else {
				item = document.createElementNS(xmlns, node.tag);
			}
		} else {
			item = document.createElement(node.tag);
		}
		tag = node.tag.toLowerCase();
		for (key in node) {
			if (!node.hasOwnProperty(key)) {
				continue;
			}
			k = key.toLowerCase();
			if (node[key] === null) {
				continue;
			}
			if (k === 'tag' || k.charAt(0) === '$' || k === 'model') {
				continue;
			}
			if (k.charAt(0) === '#') {
				item[k.substring(1)] = node[key];
				continue;
			}
			if (k === 'rotate') {
				item.setAttribute("transform", "rotate(" + node[key] + "," + node.model.x + "," + node.model.y + ")");
				continue;
			}
			if (k === 'value') {
				if (!node[key]) {
					continue;
				}
				if (tag !== "input") {
					if (tag === "text") {// SVG
						item.appendChild(document.createTextNode(node[key]));
					} else {
						item.innerHTML = node[key];
					}
				} else {
					item[key] = node[key];
				}
				continue;
			}
			if (k.indexOf("on") === 0) {
				this.bind(item, k.substring(2), node[key]);
				continue;
			}
			if (k.indexOf("-") >= 0) {
				item.style[key] = node[key];
			} else {
				if (k === "style" && typeof (node[key]) === "object") {
					for (style in node[key]) {
						if (!node[key].hasOwnProperty(style)) {
							continue;
						}
						if (node[key][style]) {
							if ("transform" === style) {
								item.style.transform = node[key][style];
								item.style.msTransform = item.style.MozTransform = item.style.WebkitTransform = item.style.OTransform = node[key][style];
							} else {
								item.style[style] = node[key][style];
							}
						}
					}
				} else {
					item.setAttribute(key, node[key]);
				}
			}
		}
		if (node.$parent) {
			node.$parent.appendChild(item);
		}
		if (node.model) {
			item.model = node.model;
		}
		return item;
	}
	export function setSize(item, x, y) {
		x = util.getValue(x);
		y = util.getValue(y);
		item.setAttribute("width", x);
		item.setAttribute("height", y);
		item.style.width = Math.ceil(x);
		item.style.height = Math.ceil(y);
	}
	export function setPos(item, x, y) {
		if (item.x && item.x.baseVal) {
			item.style.left = x + "px";
			item.style.top = y + "px";
		} else {
			item.x = x;
			item.y = y;
		}
	}
	export function getColor(style:string, defaultColor?:string) {
		if (style) {
			if (style.toLowerCase() === "create") {
				return "#008000";
			}
			if (style.toLowerCase() === "nac") {
				return "#FE3E3E";
			}
			if (style.indexOf("#") === 0) {
				return style;
			}
		}
		if (defaultColor) {
			return defaultColor;
		}
		return "#000";
	}
	export function getNumber(str) {
		return parseInt((str || "0").replace("px", ""), 10);
	}
	export function getStyle(styleProp) {
		var i, style, diff, current, ref, el = document.createElement("div"), css;
		document.body.appendChild(el);
		css = new CSS(styleProp);
		ref = new CSS(styleProp, el).css;
		style = window.getComputedStyle(el, null);
		el.className = styleProp;
		current = new CSS(styleProp, el).css;
		diff = util.getNumber(style.getPropertyValue("border-width"));
		for (i in current) {
			if (!current.hasOwnProperty(i)) {
				continue;
			}
			if (i === "width" || i === "height") {
				if (util.getNumber(current[i]) !== 0 && util.getNumber(current[i]) + diff * 2 !== util.getNumber(ref[i])) {
					css.add(i, current[i]);
				}
			} else if (current[i] !== ref[i]) {
				css.add(i, current[i]);
			}
		}
		document.body.removeChild(el);
		return css;
	}
	export function sizeOf(item, model, node?:any) {
		var board, rect;
		if (!item) {return; }
		board = model.getRoot().board;
		if (board.tagName === "svg") {
			if (typeof item === 'string') {
				item = util.create({tag: "text", $font: true, value: item});
				item.setAttribute("width", "5px");
			}
		} else if (typeof item === 'string') {
			item = document.createTextNode(item);
		}
		board.appendChild(item);
		rect = item.getBoundingClientRect();
		board.removeChild(item);
		if (node) {
			if (!node.$startWidth) {
				node.width = Math.round(rect.width);
			}
			if (!node.$startHeight) {
				node.height = Math.round(rect.height);
			}
		}
		return rect;
	}
	export function createCell(parent, tag, node, innerHTML?:string, typ?:string) {
		var tr = this.create({"tag": 'tr'}), cell;
		cell = this.create({"tag": tag, $font: true, value: innerHTML});
		node.getRoot().createdElement(cell, typ, node);
		tr.appendChild(cell);
		parent.appendChild(tr);
		return cell;
	}
	export function bind(el, eventName, eventHandler) {
		if (el.addEventListener) {
			el.addEventListener(eventName, eventHandler, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + eventName, eventHandler);
		}
	}
	export function MinMax(node, min, max) {
		max.x = Math.max(max.x, node.getX(false) + Number(node.getWidth()) + 10);
		max.y = Math.max(max.y, node.getY(false)+ Number(node.getHeight()) + 10);
		min.x = Math.max(min.x, node.getX(false));
		min.y = Math.max(min.y, node.getY(false));
	}
	export function serializeXmlNode(xmlNode) {
		if (window["XMLSerializer"] !== undefined) {
			return (new window["XMLSerializer"]()).serializeToString(xmlNode);
		}
		if (xmlNode.xml) {
			return xmlNode.xml;
		}
		return xmlNode.outerHTML;
	}
	export function utf8$to$b64(str:string) {
		return window.btoa(decodeURIComponent(encodeURIComponent(str)));
	}
	export function getModelNode(element) {
		if (!element.model) {
			if (element.parentElement) {
				return this.getModelNode(element.parentElement);
			}
			return null;
		}
		return element;
	}
	export function selectText(control:HTMLElement) {
		var selection, range;
		if (this.isIE()) {
			range = (<any>document.body).createTextRange();
			range.moveToElementText(control);
			range.select();
		} else if (this.isFireFox() || this.isOpera()) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(control);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
	/**
	 * copy Minimize Json
	 * @function
	 * @param target the target Json
	 * @param src source Json
	 * @param ref reference Json
	 * @returns {target}
	 */
	export function minJson(target:any, src:any, ref?:any) {
		var i, temp, value;
		for (i in src) {
			if (!src.hasOwnProperty(i) || typeof (src[i]) === "function") {
				continue;
			}
			if (src[i] === null || src[i] === "" || src[i] === 0 || src[i] === false || i.charAt(0) === "$") {
				continue;
			}
			value = src[i];
			if (value instanceof Options || ref !== null) {
				if (typeof (value) === "object") {
					temp = (value instanceof Array) ? [] : {};
					if (ref) {
						value = this.minJson(temp, value, ref[i]);
					} else {
						value = this.minJson(temp, value, new Options());
					}
				}
				if (ref && value === ref[i]) {
					continue;
				}
			}
			if (typeof (value) === "object") {
				if (value instanceof Array && value.length < 1) {
					continue;
				}
				if (value instanceof Array) {
					target[i] = this.minJson([], value);
				} else {
					temp = this.minJson({}, value);
					if (JSON.stringify(temp, null, "") === "{}") {
						continue;
					}
					target[i] = temp;
				}
			} else {
				target[i] = value;
			}
		}
		return target;
	}
	export function removeClass(ele:HTMLElement, cls:string) {
		if (this.hasClass(ele, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			ele.className = ele.className.replace(reg, ' ');
		}
	}
	export function hasClass(ele:HTMLElement, cls:string) :boolean {return ele.className.indexOf(cls) > 0; };
	export function addClass(ele:HTMLElement, cls:string) {
		if (!this.hasClass(ele, cls)) {
			ele.className = ele.className + " " + cls;
		}
	}

}