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

//TODO:
// Header with Export
// Move Element
// Loader (Image)
// Save (Export) and load Drag and Drop
// Add all EventTypes
// Add ClazzEditor
// Add Color to Attributes

module Diagram {
	'use strict';
	export interface BaseElement {
		draw(typ:string):HTMLElement;
		getEvent():string[];
		getPos():Point;
		getSize():Point;
		getTyp():string;
		withSize(x:number,y:number):BaseElement;
		getCenter() : Point;
		fireEvent(source:BaseElement, typ:string, value:Object):void;
		event(source:BaseElement, typ:string, value:Object):boolean;
	}
}

module Diagram.Nodes {
	//				######################################################### GraphNode #########################################################
	export class Node implements BaseElement {
		protected $parent:Node = null;
		public id:string;
		public typ:string;
		protected status:string;
		protected $isDraggable:boolean = true;
		protected pos:Point = new Point();
		protected size:Point = new Point();
		protected counter:number;
		public $gui:HTMLElement;
		public $edges:Array<Edges.Edge>;
		private $RIGHT:number;
		private $LEFT:number;
		private $UP:number;
		private $DOWN:number;

		constructor(typ?:string, id?:string) {
			this.typ = typ || "node";
			this.id = id;
		}
		public init(json:JSON) {};
		public static create(node) : Node {
			var result:Node = new Node();
			if(node.x && node.y) {
				result.withPos(node.x, node.y);
			}
			if(node.width && node.height) {
				result.withSize(node.width, node.height);
			}
			return result;
		}
		public getTyp() :string {
			var root:Node = this.getRoot();
			return root.getTyp();
		}

		public getEvent():string[] {
			return [];
		}
		public getPos():Point {
			return this.pos;
		}
		public getCenter() : Point {
			var pos = this.getPos();
			var size = this.getSize();
			return new Point(pos.x+size.x/2, pos.y+size.y/2);
		}
		public getSize():Point {
			return this.size;
		};

		public withPos(x:number, y:number):Node {
			this.pos = new Point(x, y);
			return this;
		}
		public withSize(x:number, y:number):Node {
			this.size = new Point(x, y);
			return this;
		}
		public set(id, value):void {
			if (value) {
				this[id] = value;
			}
		}
		public createNewEdge(typ:string) : Diagram.Nodes.Node {
			return new Edges.Edge();
		}
		public createNewNode(typ:string) : Diagram.Nodes.Node {
			return new Nodes.Node();
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
		public draw(typ:string):HTMLElement {
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
		public drawSVG(draw?:boolean):HTMLElement {
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
						"x": (this.pos.x + 10),
						value: content.plain
					});
				}
				if (content.src) {
					item = SymbolLibary.createImage(content, this);
					if (!item) {
						return null;
					}
					return item;
				}
				item = util.create({tag: "g", model: this});
				if (content.svg) {
					item.setAttribute('transform', "translate(" + this.pos.x + " " + this.pos.y + ")");
					item.innerHTML = content.$svg;
					return item;
				}
				if (content.html) {
					item.setAttribute('transform', "translate(" + this.pos.x + " " + this.pos.y + ")");
					item.innerHTML = content.$svg;
					return item;
				}
			}
			item = util.create({
				tag: "circle",
				"class": "Node",
				cx: this.pos.x + 10,
				cy: this.pos.y + 10,
				r: "10",
				model: this,
				width: this.size.x,
				height: this.size.y
			});
			return item;
		}
		public drawHTML(draw?:boolean):HTMLElement {
			var item = util.create({tag: "div", model: this}), content;
			content = this["content"];
			util.setPos(item, this.pos.x, this.pos.y);
			if (content) {
				content.width = content.width || 0;
				content.height = content.height || 0;
				if (content.src) {
					item = SymbolLibary.createImage(content, this);
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
		public addEdge(source:BaseElement, target?:BaseElement) {
			var edge;
			if (target) {
				var root = <Graph>this.getRoot();
				edge = new Edges.Edge();
				edge.withItem(root.addNode(source), root.addNode(target));
				edge.source = new Info(edge.source, this, edge);
				edge.target = new Info(edge.target, this, edge);
				edge.$parent = this.$parent;
			} else {
				edge = source;
			}
			if (!this.$edges) {
				this.$edges = [];
			}
			this.$edges.push(edge);
		}
		public getTarget(startNode:Node):Node {
			if (this.isClosed()) {
				return this;
			} else if (this.status === "open" || this.$parent === null) {
				return startNode;
			}
			return this.$parent.getTarget(startNode);
		}
		public getShowed():Node {
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
		public clear():void {
			this.$RIGHT = this.$LEFT = this.$UP = this.$DOWN = 0;
		}
		public getRoot():Node {
			if (this.$parent) {
				return this.$parent.getRoot();
			}
			return this;
		}
		public fireEvent(source:BaseElement, typ:string, value:Object) : void {
			this.getRoot().fireEvent(source, typ, value);
		}
		public event(source:Nodes.Node, typ:string, value:Object) : boolean{
			return true;
		}
	}
	export class Symbol extends Nodes.Node {
		public $heightMax:number=0;
		public $heightMin:number=0;
		constructor(typ:string) {
			super(typ,typ);
		}
		public draw(typ?:string):HTMLElement {
			return SymbolLibary.draw(this);
		}
	}
	export class SO implements BaseElement {
		private pos:Point = new Point();
		private size:Point = new Point();
		private typ:string = "SO";

		public draw(typ?:string):HTMLElement {return null;}
		public getEvent():string[] {return [];}
		public getTyp():string {return this.typ;}

		public getPos():Point {
			return this.pos;
		}
		public getSize():Point {
			return this.size;
		}
		public withSize(x:number,y:number): SO {
			this.size = new Point(x,y);
			return this;
		}
		public getCenter(): Point {
			var pos = this.getPos();
			var size = this.getSize();
			return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
		}
		public withKeyValue(key:string, value:any) : SO{
			if(key === "typ") {
				this.typ = value;
			}else  if(key==="x") {
				this.pos.x = value;
			}else  if(key==="y") {
				this.pos.y = value;
			}else  if(key==="width") {
				this.size.x = value;
			}else  if(key==="height") {
				this.size.y = value;
			} else {
				this[key] = value;
			}
			return this;
		}
		public fireEvent(source:BaseElement, typ:string, value:Object) {

		}
		public event(source:BaseElement, typ:string, value:Object):boolean {
			return true;
		}
		public static create(element:Object) {
			var result:SO = new SO();
			for(var key in element) {
				if(element.hasOwnProperty(key) === false) {
					continue;
				}
				result.withKeyValue(key, element[key]);

			}
			return result;
		}
	}
	//				######################################################### Clazz #########################################################
	export class Clazz extends Nodes.Node {
		private attributes:Array<string> = [];
		private methods:Array<string> = [];

		constructor(){super("Clazz");};

		public init(json) {
			var i:number, value;
			value = json["attributes"];
			for(i=0;i<value.length;i++) {
				this.attributes.push(value[i]);
			}
			value = json["methods"];
			for(i=0;i<value.length;i++) {
				this.methods.push(value[i]);
			}
		}

		public drawSVG(draw?:boolean) {
			var width, height, id, size, x, y, z, item, rect, g, board, styleHeader, headerHeight;
			board = this.getRoot()["board"];
			styleHeader = util.getStyle("ClazzHeader");
			headerHeight = styleHeader.getNumber("height");
			width = 0;
			height = 10 + headerHeight;

			if (this.typ === "Object" || this.getRoot()["model"].typ.toLowerCase() === "objectdiagram") {
				id = this.id.charAt(0).toLowerCase() + this.id.slice(1);
				item = "Object";
			} else {
				id = this.id;
				item = "Clazz";
				if (this.counter) {
					id += " (" + this.counter + ")";
				}
			}
			g = util.create({tag: "g", model: this});
			size = util.sizeOf(id, this);
			width = Math.max(width, size.width);
			if (this.attributes && this.attributes.length > 0) {
				height = height + this.attributes.length * 25;
				for (z = 0; z < this.attributes.length; z += 1) {
					width = Math.max(width, util.sizeOf(this.attributes[z], this).width);
				}
			} else {
				height += 20;
			}
			if (this.methods && this.methods.length > 0) {
				height = height + this.methods.length * 25;
				for (z = 0; z < this.methods.length; z += 1) {
					width = Math.max(width, util.sizeOf(this.methods[z], this).width);
				}
			}
			width += 20;

			var pos = this.getPos();
			y = pos.y;
			x = pos.x;

			rect = {
				tag: "rect",
				"width": width,
				"height": height,
				"x": x,
				"y": y,
				"class": item + " draggable",
				"fill": "none"
			};
			g.appendChild(util.create(rect));
			g.appendChild(util.create({
				tag: "rect",
				rx: 0,
				"x": x,
				"y": y,
				height: headerHeight,
				"width": width,
				"class": "ClazzHeader"
			}));

			item = util.create({
				tag: "text",
				$font: true,
				"class": "InfoText",
				"text-anchor": "right",
				"x": x + width / 2 - size.width / 2,
				"y": y + (headerHeight / 2) + (size.height/2),
				"width": size.width
			});

			if (this.typ === "Object" || this.getRoot()["model"].typ.toLowerCase() === "objectdiagram") {
				item.setAttribute("text-decoration", "underline");
			}
			item.appendChild(document.createTextNode(id));

			g.appendChild(item);
			g.appendChild(util.create({
				tag: "line",
				x1: x,
				y1: y + headerHeight,
				x2: x + width,
				y2: y + headerHeight,
				stroke: "#000"
			}));
			y += headerHeight + 20;

			if (this.attributes) {
				for (z = 0; z < this.attributes.length; z += 1) {
					g.appendChild(util.create({
						tag: "text",
						$font: true,
						"text-anchor": "left",
						"width": width,
						"x": (x + 10),
						"y": y,
						value: this.attributes[z]
					}));
					y += 20;
				}
				if (this.attributes.length > 0) {
					y -= 10;
				}
			}
			if (this.methods && this.methods.length > 0) {
				g.appendChild(util.create({tag: "line", x1: x, y1: y, x2: x + width, y2: y, stroke: "#000"}));
				y += 20;
				for (z = 0; z < this.methods.length; z += 1) {
					g.appendChild(util.create({
						tag: "text",
						$font: true,
						"text-anchor": "left",
						"width": width,
						"x": x + 10,
						"y": y,
						value: this.methods[z]
					}));
					y += 20;
				}
			}
			return g;
		}

		public drawHTML() {
			var first, z, cell, item, model, htmlElement = util.create({tag: "div", model: this}), pos=this.getPos();
			model = this.getRoot()["model"];
			htmlElement.className = "classElement";
			util.setPos(htmlElement, pos.x, pos.y);
			htmlElement.style.zIndex = 5000;

			model.createdElement(htmlElement, "class", this);
			item = util.create({tag: 'table', border: "0", style: {width: "100%", height: "100%"}});
			htmlElement.appendChild(item);
			if (this["head"] && this["head"].$src) {
				cell = util.createCell(item, "td", this);
				cell.style["textAlign"] = "center";
				if (!this["head"].$img) {
					this["head"].$img = {};
					this["head"].$img.src = this["head"].$src;
					this["head"].$img.width = this["head"].$width;
					this["head"].$img.height = this["head"].$height;
				}
				z = SymbolLibary.createImage(this["head"].$img, this);
				if (z) {
					cell.appendChild(z);
				}
			}
			if (this["headinfo"]) {
				util.createCell(item, "td", this, this["headinfo"]).className = "head";
			}

			if (model.typ.toLowerCase() === "objectdiagram") {
				z = this.id.charAt(0).toLowerCase() + this.id.slice(1);
			} else {
				z = this.id;
			}
			if (this["href"]) {
				z = "<a href=\"" + this["href"] + "\">" + z + "</a>";
			}
			cell = util.createCell(item, "th", this, z, "id");
			if (model.typ.toLowerCase() === "objectdiagram") {
				cell.style["textDecorationLine"] = "underline";
			}
			cell = null;
			if (this.attributes) {
				first = true;
				for (z = 0; z < this.attributes.length; z += 1) {
					cell = util.createCell(item, "td", this, this.attributes[z], "attribute");
					if (!first) {
						cell.className = 'attributes';
					} else {
						cell.className = 'attributes first';
						first = false;
					}
				}
			}
			if (this.methods) {
				first = true;
				for (z = 0; z < this.methods.length; z += 1) {
					cell = util.createCell(item, "td", this, this.methods[z], "method");
					if (!first) {
						cell.className = 'methods';
					} else {
						cell.className = 'methods first';
						first = false;
					}
				}
			}
			if (!cell) {
				cell = util.createCell(item, "td", this, "&nbsp;");
				cell.className = 'first';
				this.fireEvent(this, "empty", cell);
			}
			htmlElement.appendChild(item);
			htmlElement.node = this;
			this.$gui = htmlElement;
			return htmlElement;
		}
	}
	//				######################################################### Pattern #########################################################
	export class Pattern  extends Nodes.Node {

		constructor() {super("Pattern");}

		public drawSVG(draw?:boolean) {
			var width:number = 0, height:number = 40, textWidth:number, rect, item, g = util.create({tag: "g", model: this});
			var id:string;
			var pos:Point;
			id = this.id;
			if (this.counter) {
				id += " (" + this.counter + ")";
			}
			textWidth = util.sizeOf(id, this).width;
			width = Math.max(width, textWidth);
			height += 20;
			width += 20;

			pos = this.getPos();

			rect = {
				tag: "rect",
				"width": width,
				"height": height,
				"x": pos.x,
				"y": pos.y,
				"fill": "#fff",
				"class": "draggable"
			};
			rect.fill = "lightblue";

			g.appendChild(util.create(rect));
			item = util.create({
				tag: "text",
				$font: true,
				"text-anchor": "right",
				"x": pos.x + width / 2 - textWidth / 2,
				"y": pos.y + 20,
				"width": textWidth
			});
			item.appendChild(document.createTextNode(id));
			g.appendChild(item);
			g.appendChild(util.create({
				tag: "line",
				x1: pos.x,
				y1: pos.y + 30,
				x2: pos.x + width,
				y2: pos.y + 30,
				stroke: rect.stroke
			}));
			return g;
		}

		public drawHTML(draw?:boolean) {
			var cell, item = util.create({tag: "div", model: this});
			var pos = this.getPos();
			item.className = "patternElement";
			util.setPos(item, pos.x, pos.y);
			this.fireEvent(this, EventBus.EVENT.CREATED, item);

			item.appendChild(util.create({
				tag: 'table',
				border: "0",
				style: {width: "100%", height: "100%"}
			}));
			if (this["href"]) {
				util.createCell(item, "th", this, "<a href=\"" + this["href"] + "\">" + this.id + "</a>", "id");
			} else {
				util.createCell(item, "th", this, this.id, "id");
			}
			cell = util.createCell(item, "td", this, "&nbsp;");
			cell.className = 'first';
			this.fireEvent(this, EventBus.EVENT.CREATED, cell);

			item.node = this;
			this.$gui = item;
			return item;
		}
	}
	//END
}
