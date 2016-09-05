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
	export interface Layout {
		layout(graph:Graph,node:BaseElement):void;
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

module Diagram {
	'use strict';
	export class EventBus {
		public static EVENT = {CREATED: "created", LOADRESOURCE: "loadResource", LOAD: "load", RASTER:"raster", HEADER:"header", MOUSEOVER:"mouseover", MOUSEMOVE:"mousemove", MOUSEOUT:"mouseout"};
		public $listeners:Object = {};

		public addElement(item:BaseElement) {
			var events:string[] = item.getEvent();
			for(var i=0;i<events.length;i++) {
				this.addListener(events[i], item);
			}
		}
		public addListener(event:string, newListener:BaseElement) {
			var listeners = this.getListeners(event);
			var existingListener;
			var idx:number;
			// ensure we order listeners by priority from
			// 0 (high) to n > 0 (low)
			for (idx = 0; (existingListener = listeners[idx]); idx++) {
				// prepend newListener at before existingListener
				listeners.splice(idx, 0, newListener);
			}
			listeners.push(newListener);
		}
		public getListeners(name:string) {
			var listeners = this.$listeners[name];
			if (!listeners) {
				this.$listeners[name] = listeners = [];
			}
			return listeners;
		}
		public fireEvent(source:BaseElement, typ:string, value:Object) {
			var nodes = this.getListeners(typ);
			for(var id in nodes) {
				if (nodes.hasOwnProperty(id) === false) {
					continue;
				}
				nodes[id].event(source, typ, value);
			}
		}
		public register(node : HTMLElement) {
			var that = this;
			for(var name in this.$listeners) {
				let localName = name;
				util.bind(node, name,  function(e) {
					that.fireEvent(this, localName, e);
				});
			}
		}
	}
	//				######################################################### Graph #########################################################
	export class Graph extends Nodes.Node {
		private model:Model;
		public $root:HTMLElement;
		private minSize:Point;
		private eventBus:EventBus;
		private loader:Loader;
		protected edgeFactory:Object;
		protected nodeFactory:Object;
		protected layoutFactory:Object;
		protected header:Header;

		//TODO private layoutFactory:Array<String, Layout>;
		constructor(json:any, options:Diagram.Options) {
			super("");
			json = json || {};
			json.top = json.top || 50;
			json.left = json.left || 10;

			this.eventBus = new EventBus();
			this.eventBus.addElement(this);
			this.loader = new Loader(this);
			this.header = new Header(this);
			this.eventBus.addElement(this.header);

			// Fill all Factories
			var nodes = Diagram.Nodes;
			this.nodeFactory = {};
			for(var id in nodes) {
				if (nodes.hasOwnProperty(id) === false) {
					continue;
				}
				this.nodeFactory[id] = nodes[id];
			}
			var edges = Diagram.Edges;
			this.edgeFactory = {};
			for(var id in edges) {
				if (edges.hasOwnProperty(id) === false) {
					continue;
				}
				this.edgeFactory[id] = edges[id];
			}

			var layouter = Diagram.Layouts;
			this.layoutFactory = {};
			for(var id in layouter) {
				if (layouter.hasOwnProperty(id) === false) {
					continue;
				}
				this.layoutFactory[id] = layouter[id];
			}
			this.model = new Model(json, options, this);
		}

		public addToNodeFactory(node:BaseElement) {
			var name:string = typeof(node);
			this.nodeFactory[name] = node;
		}

		public getModel() : Model {
			return this.model;
		}

		public event(source:Nodes.Node, typ:string, value:Object) : boolean{
			if(this.getTyp()==="svg") {
				if(EventBus.EVENT.CREATED === typ) {
					CSS.addStyles(this.$gui, value["$gui"]);
				}
			}
			return true;
		}

		public getEvent():string[] {
			return [EventBus.EVENT.CREATED];
		}
		public getLayout() : Layout {
			var layout = this.getOptions().layout || {};
			var layoutName:string;
			if (typeof layout === 'string' || layout instanceof String) {
				layoutName = <string>layout;
			} else {
				layoutName = layout["name"] || "DagreLayout";
			}
			if(this.layoutFactory[layoutName]) {
				return new this.layoutFactory[layoutName]();
			}
			return new Layouts.DagreLayoutOld();
		}
		public draw(typ?:string):HTMLElement {
			// model, width, height
			var n:Diagram.Nodes.Node, nodes:Object, model:Diagram.Model;
			model = this.model;
			nodes = model.nodes;
			if (!typ) {
				typ = this.getTyp();
			}
			//model.minSize = new Pos(model.options.minWidth || 0, model.options.minHeight || 0);
			if (this.loader.abort && this.loader.length() > 0) {
				return;
			}
			this.model.drawComponents();
			//TODO
			// for (i in nodes) {
			//	if (!nodes.hasOwnProperty(i)) {
			//		continue;
			//	}
			//	if (typeof (nodes[i]) === "function") {
			//		continue;
			//	}
			//	n = nodes[i];
			//	n.$gui = n.draw(typ);
			//v	if (typ === "svg") {
			//		//svgUtil.addStyle(board, "ClazzHeader");
			//		CSS.addStyles(this.board, n.$gui);
			//	}
			//	this.DragAndDrop.add(n.$gui);
			//	model.$gui.appendChild(n.$gui);
			//}//
		}
		public createNewEdge(typ:string) : Diagram.Nodes.Node {
			if(this.edgeFactory[typ]) {
				return new this.edgeFactory[typ]();
			}
			return super.createNewEdge(typ);
		}
		public createNewNode(typ:string) : Diagram.Nodes.Node {
			if(this.nodeFactory[typ]) {
				return new this.nodeFactory[typ]();
			} else if(SymbolLibary.isSymbolName(typ)) {
				return new Nodes.Symbol(typ);
			}
			return super.createNewNode(typ);
		}

		public getOptions():Options {
			return this.model.options;
		}
		public addNode(node) {
			return this.model.addNode(node);
		}
		public addEdge(source, target) {
			return this.model.addEdge(source, target);
		}
		public removeNode(id) {
			return this.model.removeNode(id);
		}
		public add(element : HTMLElement) {
			this.$gui.appendChild(element);
		}
		public remove(element : HTMLElement) {
			this.$gui.removeChild(element);
		}
		public initGraph(model:Model) {
			var i, n:Nodes.Node, isDiag:boolean, html:HTMLElement, e:Edges.Edge;
			model.validateModel();
			for (i in model.nodes) {
				if (!model.nodes.hasOwnProperty(i)) {
					continue;
				}
				if (typeof (model.nodes[i]) === "function") {
					continue;
				}
				n = model.nodes[i];
				isDiag = n.typ.indexOf("diagram", n.typ.length - 7) !== -1;
				if (isDiag) {
					this.initGraph(<Model>n);
				}
				html = n.draw(model.options.display);
				if (html) {
					util.sizeOf(html, this, n);
				}
			}
			for (i = 0; i < model.edges.length; i += 1) {
				e = model.edges[i];
				e.source.initInfo();
				e.target.initInfo();
			}
		}
		public initBoard(newTyp?:string) : void {
			if (!newTyp) {
				newTyp = this.getTyp();
			} else {
				this.model.options.display = newTyp;
				newTyp = newTyp.toLowerCase();
			}
			this.clearBoard();
			this.$gui = this.model.getBoard(newTyp);
			this.$root.appendChild(this.$gui);
		}
		public getTyp() :string {
			return this.model.options.display.toLowerCase();
		}
		public clearBoard = function (onlyElements?:boolean) :void {
			var i, n;
			if (this.board) {
				this.clearLines(this.model);
				for (i in this.model.nodes) {
					if (!this.model.nodes.hasOwnProperty(i)) {
						continue;
					}
					n = this.model.nodes[i];
					if (this.board.children.length > 0) {
						n.removeFromBoard(this.board);
					}
					n.$RIGHT = n.$LEFT = n.$UP = n.$DOWN = 0;
				}
				if (!onlyElements) {
					this.root.removeChild(this.board);
				}
			}
			if (!onlyElements && this.drawer) {
				this.drawer.clearBoard();
			}
		}
		public layout(minwidth?:number, minHeight?:number, model?:any) {
			var i:number;
			if (this.model.options.canvasid) {
				this.$root = document.getElementById(this.model.options.canvasid);
			}
			if (this.$root) {
				if (this.model.options.clearCanvas) {
					for (i = this.$gui.children.length - 1; i >= 0; i -= 1) {
						this.$root.removeChild(this.$gui.children[i]);
					}
				}
			} else {
				this.$root = document.createElement("div");
				this.$root.setAttribute("class", "Board");
				if (this.model.options.canvasid) {
					this.$root.id = this.model.options.canvasid;
				}
				document.body.appendChild(this.$root);
			}
			this.initBoard();
			this.eventBus.register(this.$gui);

			if (!model) {
				model = this.model;
			}
			this.initGraph(model);
			this.minSize = new Point(minwidth, minHeight);
			this.getLayout().layout(this, this.model);
		}
		public fireEvent(source:BaseElement, typ:string, value:Object) {
			this.eventBus.fireEvent(source, typ, value);
		}
	}
	window["Graph"] = Diagram.Graph;
	//				######################################################### Model #########################################################
  //TODO			list = {
  //				"Edge": Edge,
  //				"Generalisation": Generalisation,
  //				"Implements": Implements,
  //				"Unidirectional": Unidirectional,
  //				"Aggregation": Aggregation,
  //				"Composition": Composition
  //			};
	export class Model extends Nodes.Node {
		public nodes:Object;
		private $nodeCount:number;
		public edges:Array<Edges.Edge>;
		options:Options;

		constructor(json, options, parent) {
			super("");
			this.typ = "classdiagram";
			this.$isDraggable = true;
			this.$parent = parent;
			json = json || {};
			this.pos = new Point(json.left, json.top);
			this.size = new Point(0,0);
			if (json.minid) {
				this.id  = json.minid;
			}
			this.$nodeCount = 0;
			this.nodes = {};
			this.edges = [];
			json = json || {};
			this.typ = json.typ || "classdiagram";
			this.set("id", json.id);
			this.options = util.copy(util.copy(new Options(), json.options), options, true, true);
			this["package"] = "";
			this.set("info", json.info);
			this.set("style", json.style);
			var i;
			if (json.nodes) {
				for (i = 0; i < json.nodes.length; i += 1) {
					this.addNode(json.nodes[i]);
				}
			}
			if (json.edges) {
				for (i = 0; i < json.edges.length; i += 1) {
					this.addEdge(json.edges[i]);
				}
			}
		}
		public clear() {
			var i;
			Nodes.Node.prototype.clear.call(this);
			for (i in this.nodes) {
				if (!this.nodes.hasOwnProperty(i)) {
					continue;
				}
				this.nodes[i].clear();
			}
		}
		public drawComponents() {
			//TODO  FIRE FOR RASTER AND HEADER
			//this.fireEvent(this, EventBus.EVENT.RASTER);
			//TODO this.fireEvent(this, EventBus.EVENT.HEADER);
			var nodes, n, max;
			var min: Point;
			var i:string;
			var z:number;
			min = new Point(99999,99999);
			max = new Point(0,0);
			nodes = this.nodes;
			for (i in nodes) {
				if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === "function") {
					continue;
				}
				n = nodes[i];
				if (this.options.raster) {
					//FIXME 		this.raster.moveToRaster(n);
				}
				util.MinMax(n, min, max);
			}
			//FIXME z = min.y - this.header.height;
			z = min.y;
			if (z > 0) {
				for (i in nodes) {
					if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === "function") {
						continue;
					}
					nodes[i].y += z;
				}
				max.y += z;
			}
			this.calcLines();
			for (z = 0; z < this.edges.length; z += 1) {
				n = this.edges[z];
				util.MinMax(n.source, min, max);
				util.MinMax(n.target, min, max);
			}
			this.withSize(max.x, max.y);
			util.setSize(this.$gui, max.x, max.y);
			this.drawNodes();
			this.drawLines();
			return max;
		}
		public getNodeCount() {
			return this.$nodeCount;
		}
		public addEdge(source, target?:Diagram.Nodes.Node) {
			var edge, typ = "Edge", e;
			if(!target) {
				typ = source.typ || "Edge";
				typ = typ.charAt(0).toUpperCase() + typ.substring(1).toLowerCase();
				e = source;
			}
			edge = this.getRoot().createNewEdge(typ);
			if(target) {
				edge.withItem(this.addNode(source), this.addNode(target));
				e = edge;
			}

			edge.$parent = this;
			edge.source = new Info(e.source, this, edge);
			edge.target = new Info(e.target, this, edge);
			edge.$sNode = this.getNode(edge.source.id, true, 0);
			edge.$sNode.addEdge(edge);
			if (e.info) {
				if (typeof (e.info) === "string") {
					edge.info = {id: e.info};
				} else {
					edge.info = {id: e.info.id, property: e.info.property, cardinality: e.info.cardinality};
				}
			}
			edge.$parent = this;
			edge.set("style", e.style);
			edge.set("counter", e.counter);
			edge.$tNode = this.getNode(edge.target.id, true, 0);
			edge.$tNode.addEdge(edge);
			this.edges.push(edge);
			return edge;
		};
		public removeEdge(idSource, idTarget) {
			var z, e;
			for (z = 0; z < this.edges.length; z += 1) {
				e = this.edges[z];
				if (e.$sNode.id === idSource && e.$tNode.id === idTarget) {
					this.edges.splice(z, 1);
					z -= 1;
				} else if (e.$tNode.id === idSource && e.$sNode.id === idTarget) {
					this.edges.splice(z, 1);
					z -= 1;
				}
			}
		};
		public removeNode(id) {
			delete (this.nodes[id]);
			var i;
			for (i = 0; i < this.edges.length; i += 1) {
				if (this.edges[i].$sNode.id === id || this.edges[i].$tNode.id === id) {
					this.edges.splice(i, 1);
					i -= 1;
				}
			}
		};
		public addNode(node:any) {
			/* testing if node is already existing in the graph */
			var typ, n;
			if (typeof (node) === "string") {
				node = {id: node, typ: "Node"};
			}
			typ = node.typ || "Node";
			typ = typ.charAt(0).toUpperCase() + typ.substring(1).toLowerCase();
			n = this.getRoot().createNewNode(typ);
			if (node.id) {
				n.id = node.id;
			} else {
				n.id = node.typ + "$" + (this.$nodeCount + 1);
			}
			if(node["x"] || node["y"]) {
				n.withPos(node["x"], node["y"]);
			}
			if(node["width"] || node["height"]) {
				n.withPos(node["width"], node["height"]);
			}
			if (this.nodes[n.id] !== undefined) {
				return this.nodes[n.id];
			}
			this.nodes[n.id] = n;
			n.$parent = this;
			n.init(node);
			this.$nodeCount += 1;
			return this.nodes[n.id];
		}
		public getEdges() {
			return this.edges;
		}
		public calcLines() {
			var i, sourcePos, e, ownAssoc = [];
			for (i in this.nodes) {
				if (!this.nodes.hasOwnProperty(i) || typeof (this.nodes[i]) === "function") {
					continue;
				}
				this.nodes[i].clear();
			}
			for (i = 0; i < this.edges.length; i += 1) {
				e = this.edges[i];
				if (!e.calc(this.$gui)) {
					ownAssoc.push(e);
				}
			}
			for (i = 0; i < ownAssoc.length; i += 1) {
				ownAssoc[i].calcOwnEdge();
				sourcePos = ownAssoc[i].getCenterPosition(ownAssoc[i].$sNode, ownAssoc[i].$start);
				ownAssoc[i].calcInfoPos(sourcePos, ownAssoc[i].$sNode, ownAssoc[i].source);

				sourcePos = ownAssoc[i].getCenterPosition(ownAssoc[i].$tNode, ownAssoc[i].$end);
				ownAssoc[i].calcInfoPos(sourcePos, ownAssoc[i].$tNode, ownAssoc[i].target);
			}
		}
		public validateModel() {
			var e, z, n, id, node, list;
			if (this.typ === "classdiagram") {
				list = this.edges;
				for (e = 0; e < list.length; e += 1) {
					node = list[e].$sNode;
					z = node.id.indexOf(":");
					if (z > 0) {
						id = node.id.substring(z + 1);
						n = this.getNode(id, true, 1);
						delete (this.nodes[node.id]);
						this.edges[e].source.id = id;
						if (n) {
							this.edges[e].$sNode = n;
						} else {
							node.id = id;
							this.nodes[node.id] = node;
						}
					}
					node = list[e].$tNode;
					z = node.id.indexOf(":");
					if (z > 0) {
						id = node.id.substring(z + 1);
						n = this.getNode(id, true, 1);
						delete (this.nodes[node.id]);
						this.edges[e].target.id = id;
						if (n) {
							this.edges[e].$tNode = n;
						} else {
							node.id = id;
							this.nodes[node.id] = node;
						}
					}
					if (!list[e].source.cardinality) {
						list[e].source.cardinality = "one";
					}
					if (!list[e].target.cardinality) {
						list[e].target.cardinality = "one";
					}
					// Refactoring Edges for same property and typ set cardinality
					for (z = e + 1; z < list.length; z += 1) {
						id = typeof (window["java"]);
						if (!(id === typeof list[z])) {
							continue;
						}
						if (Diagram.Model.validateEdge(list[e], list[z])) {
							list[e].target.cardinality = "many";
							list.splice(z, 1);
							z -= 1;
						} else if (Diagram.Model.validateEdge(list[z], list[e])) {
							list[e].source.cardinality = "many";
							list.splice(z, 1);
							z -= 1;
						}
					}
				}
			}
		}
		public static validateEdge(sEdge, tEdge) {
			return (sEdge.source.id === tEdge.source.id && sEdge.target.id === tEdge.target.id) && (sEdge.source.property === tEdge.source.property && sEdge.target.property === tEdge.target.property);
		}
		public getOption(value:string) : any {
			if(this.options) {
				return this.options[value];
			}
			return null;
		}
		public getBoard(type) {
			if (type === "svg") {
				return this.$gui = util.create({tag: "svg"});
			}
			return this.$gui = util.create({tag: "div", model: this});
		}

		public getNode(id, isSub, deep) {
			var n, i, r;
			deep = deep || 0;
			if (this.nodes[id]) {
				return this.nodes[id];
			}
			if (!isSub) {
				return this.addNode(id);
			}
			for (i in this.nodes) {
				if (!this.nodes.hasOwnProperty(i)) {
					continue;
				}
				n = this.nodes[i];
				if (n instanceof Model) {
					r = n.getNode(id, isSub, deep + 1);
					if (r) {
						return r;
					}
				}
			}
			if (deep === 0) {
				return this.addNode(id);
			}
			return null;
		}
		public toJson() {
			return util.copy({}, this);
		}
		public drawLines() : void {
			this.clearLines();
			var i:number, e, startShow, endShow, items = [], id;
			for (i = 0; i < this.edges.length; i += 1) {
				e = this.edges[i];
				startShow = !e.$sNode.isClosed();
				endShow = !e.$tNode.isClosed();
				if (startShow && endShow) {
					this.$gui.appendChild(e.draw());
				} else if ((startShow && !endShow) || (!startShow && endShow)) {
					id = e.$sNode.getShowed().id + "-" + e.$tNode.getShowed().id;
					if (items.indexOf(id) < 0) {
						items.push(id);
						this.$gui.appendChild(e.draw());
					}
				}
			}
		}
		public drawNodes() : void {
			var n:Nodes.Node, typ:string = this.options.display.toLowerCase();
			for (var i in this.nodes) {
				if (!this.nodes.hasOwnProperty(i)) {
					continue;
				}
				if (typeof (this.nodes[i]) === "function") {
					continue;
				}
				n = this.nodes[i];
				n.$gui = n.draw(typ);
				if (typ === "svg") {
					//svgUtil.addStyle(board, "ClazzHeader");
					//FIXME
					//CSS.addStyles(this.$gui, n.$gui);
				}
				this.$gui.appendChild(n.$gui);
				this.fireEvent(this, EventBus.EVENT.CREATED, n);
			}
		}
		public clearLines() : void {
			var i:number;
			for (i = 0; i < this.edges.length; i += 1) {
				this.edges[i].removeFromBoard(this.$gui);
			}
		}
		public drawSVG(draw?:boolean) {
			var g = util.create({tag: "g", model: this}), that = this, width:number, height:number, item, root:any;
			root = this.getRoot();
			var pos = this.getPos();
			var size = this.getSize();
			if (this.status === "close") {
				width = util.sizeOf(this.$gui, this) + 30;
				height = 40;
				SymbolLibary.addChild(g, {
					tag: "text",
					$font: true,
					"text-anchor": "left",
					"x": (pos.x + 2),
					"y": pos.y + 12,
					value: this.id
				});
			} else {
				this.$gui = g;

				width = util.getValue(this.$gui.style.width);
				height = util.getValue(this.$gui.style.height);
				if (this["style"] && this["style"].toLowerCase() === "nac") {
					SymbolLibary.addChild(g, SymbolLibary.createGroup(this, SymbolLibary.drawStop(this)));
				}
			}
			SymbolLibary.addChild(g, {
				tag: "rect",
				"width": width,
				"height": height,
				"fill": "none",
				"strokeWidth": "1px",
				"stroke": util.getColor(this["style"], "#CCC"),
				"x": pos.x,
				"y": pos.y,
				"class": "draggable"
			});
			if (width > 0 && width !== size.x) {
				this.size.x = width;
			}
			if (this.status === "close") {
				// Open Button
				item = SymbolLibary.createGroup(this, SymbolLibary.drawMax(Diagram.Nodes.Node.create({x: (pos.x + width - 20), y: pos.y})));
				this.size.y = height;
			} else {
				item = SymbolLibary.createGroup(this, SymbolLibary.drawMin(Diagram.Nodes.Node.create({x: (pos.x + width - 20), y: pos.y})));
			}
			item.setAttribute("class", "hand");

			util.bind(item, "mousedown", function (e) {
				if (that.status === "close") {
					that.status = "open";
					g.model.redrawNode(that);
				} else {
					that.status = "close";
					// try to cleanup
					for (name in that.nodes) {
						if (that.nodes.hasOwnProperty(name)) {
							that.nodes[name].$gui = null;
						}
					}
					g.model.redrawNode(that);
				}
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				if (e.cancelBubble !== null) {
					e.cancelBubble = true;
				}
			});
			g.appendChild(item);
			return g;
		}
		public drawHTML(draw?:boolean) {
			var pos = this.getPos();
			var size = this.getSize();
			var graph, item = util.create({tag: "div", model: this});
			util.setPos(item, pos.x, pos.y);
			if (this.typ === "classdiagram") {
				item.className = "classdiagram";
			} else if (this.typ === "objectdiagram") {
				item.className = "objectdiagram";
			} else if (this.$parent.typ.toLowerCase() === "objectdiagram") {
				item.className = "objectElement";
			} else {
				item.className = "classElement";
			}
			this.$gui = item;
			if (draw) {
				item.style.borderColor = "red";
				if (this["style"] && this["style"].toLowerCase() === "nac") {
					item.appendChild(SymbolLibary.draw(null, {typ: "stop", x: 0, y: 0}));
				}
			} else {
				graph = this.$parent;
				graph.layout(0, 0, this);
			}
			util.setSize(item, this.$gui.style.width, this.$gui.style.height);
			return item;
		}
	}
	//				######################################################### Point #########################################################
	/** Creates new Point document object instance. Position with X, Y and ID
	 * @class
	 * @returns {Point}
	 * @name Point
	 */
	export class Point {
		x:number = 0;
		y:number = 0;
		$id:string;

		constructor(x?:number, y?:number, id?:string) {
			this.x = Math.ceil(x || 0);
			this.y = Math.ceil(y || 0);
			if (id) {
				this.$id = id;
			}
		};

		public add(pos:Point) {
			this.x += pos.x;
			this.y += pos.y;
			if (!this.$id) {
				this.$id = pos.$id;
			}
		}

		public center(posA:Point, posB:Point) {
			var count = 0;
			if (posA) {
				this.x += posA.x;
				this.y += posA.y;
				count++;
			}
			if (posB) {
				this.x += posB.x;
				this.y += posB.y;
				count++;
			}
			if (count > 0) {
				this.x = (this.x / count);
				this.y = (this.y / count);
			}
		}
		public isEmpty() : boolean {
			return this.x < 1 && this.y < 1;
		}
		public size(posA:Point, posB:Point) {
			var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
			if (posA) {
				x1 = posA.x;
				y1 = posA.y;
			}
			if (posB) {
				x2 = posB.x;
				y2 = posB.y;
			}
			if (x1 > x2) {
				this.x = x1 - x2;
			} else {
				this.x = x2 - x1;
			}
			if (y1 > y2) {
				this.y = y1 - y2;
			} else {
				this.y = y2 - y1;
			}
		};
	}
	//				######################################################### Options #########################################################
	export class Options {
		layout:Object;
		font:Object;
		canvasid:string;
		display:string;
		raster:boolean;
		propertyinfo:boolean;
		CardinalityInfo:boolean;
		private rotatetext:boolean;
		private linetyp:string;
		buttons:Array<string>;
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

	//				######################################################### Info #########################################################
	export class Info extends Nodes.Node {
		custom:boolean;
		private property:string;
		private cardinality:string;
		private $angle:number;
		private $counter:number;

		constructor(info:any, parent:Nodes.Node, counter:number) {
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
			this.$parent = parent;
			this.$isDraggable = true;
			this.$counter = counter;
		}

		public drawSVG(draw ?:boolean):HTMLElement {
			var text:string = this.getText(), child, group, i:number, items:Array<string> = text.split("\n");
			if (text.length < 1) {
				return null;
			}
			if (items.length > 1) {
				group = util.create({tag: "g", "class": "draggable", rotate: this.$angle, model: this});
				for (i = 0; i < items.length; i += 1) {
					var pos = this.getPos();
					child = util.create({
						tag: "text",
						$font: true,
						"text-anchor": "left",
						"x": pos.x,
						"y": pos.y
						+ (this.getSize().y * i)
					});
					child.appendChild(document.createTextNode(items[i]));
					group.appendChild(child);
				}
				this.fireEvent(this, EventBus.EVENT.CREATED, group);
				return group;
			}
			var pos = this.getPos();
			group = util.create({
				tag: "text",
				"#$font": true,
				"text-anchor": "left",
				"x": pos.x,
				"y": pos.y,
				value: text,
				"id": this.id,
				"class": "draggable InfoText",
				rotate: this.$angle,
				model: this
			});
			this.fireEvent(this, EventBus.EVENT.CREATED, group);
			return group;
		};

		public drawHTML(draw?:boolean):HTMLElement {
			var text:string = this.getText(), info;
			info = util.create({tag: "div", $font: true, model: this, "class": "EdgeInfo", value: text});
			if (this.$angle !== 0) {
				info.style.transform = "rotate(" + this.$angle + "deg)";
				info.style.msTransform = info.style.MozTransform = info.style.WebkitTransform = info.style.OTransform = "rotate(" + this.$angle + "deg)";
			}
			var pos = this.getPos();
			util.setPos(info, pos.x, pos.y);
			this.fireEvent(this, "created", info);
			return info;
		}

		public getText():string {
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

		public initInfo():string {
			var root:any = this.$parent.getRoot();
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
	//				######################################################### Line #########################################################
	export class Line implements BaseElement {
		public static FORMAT = {SOLID: "SOLID", DOTTED: "DOTTED", PATH: "PATH"};
		private line: string;
		private path: string;
		private angle: number;
		source: Point;
		public target:Point;
		public color:string;

		constructor(source?: Point, target?: Point, line?: string, color?: string) {
			this.source = source;
			this.target = target;
			this.line = line;
			this.color = color;
		}

		public getTyp(): string {
			return "SVG";
		}

		public getPos() {
			var pos = new Point();
			pos.center(this.source, this.target);
			return pos;
		};

		public getSize() {
			var pos = new Point();
			pos.size(this.source, this.target);
			return pos;
		}
		public withColor(color:string): Line {
			this.color = color;
			return this;
		}

		public withSize(x: number, y: number): BaseElement {
			return this;
		}

		public getCenter(): Point {
			var pos = this.getPos();
			var size = this.getSize();
			return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
		}

		public withPath(path: Array<Point>, close, angle?: any): Line {
			var i: number, d: string = "M" + path[0].x + " " + path[0].y;
			this.line = Line.FORMAT.PATH; // It is a Path not a Line
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
			if (angle instanceof Number) {
				this.angle = angle;
			} else if (angle) {
				//var lineangle, start = path[0], end = path[path.length - 1];
				//lineangle = Math.atan2(end.y - start.y, end.x - start.x);
			}
			return this;
		};

		public draw(): HTMLElement {
			if (this.line === "PATH") {
				return util.create({
					tag: "path",
					"d": this.path,
					"fill": this.color,
					stroke: "#000",
					"stroke-width": "1px"
				});
			}
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

		public getEvent() {
			return new String[0];
		}

		public fireEvent(source: Nodes.Node, typ: string, value: Object) {
		}

		public event(source: Nodes.Node, typ: string, value: Object) : boolean{return true;}
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
		public static draw(node:BaseElement, parent?:Object) {
			// Node is Symbol or simple Object
			var symbol, fn = this[SymbolLibary.getName(node)];
			if (typeof fn === "function") {
				symbol = fn.apply(this, [node]);
				if (!parent) {
					return Diagram.SymbolLibary.createGroup(node, symbol);
				}
				return Diagram.SymbolLibary.createGroup(node, symbol);
			} else if (node.getTyp()) {
				symbol = new Diagram.Nodes.Symbol(node.getTyp());
				var pos = node.getPos();
				var size = node.getSize();
				symbol.withPos(pos.x, pos.y);
				symbol.withSize(size.x, size.y);
				symbol["value"] = node["value"];
				parent = node["$parent"];
				return Diagram.SymbolLibary.draw(symbol, parent);
			}
			return null;
		}
		public static upFirstChar(txt:string) {
			return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
		}
		public static isSymbolName(typ:string) {
			var fn = Diagram.SymbolLibary["draw"+SymbolLibary.upFirstChar(typ)];
			return typeof fn === "function";
		}
		public static isSymbol(node:Diagram.Nodes.Symbol) {
			var fn = Diagram.SymbolLibary[SymbolLibary.getName(node)];
			return typeof fn === "function";
		}
		public static getName(node:BaseElement) {
			if (node.getTyp()) {
				return "draw" + SymbolLibary.upFirstChar(node.getTyp());
			}
			if (node["src"]) {
				return "draw" + SymbolLibary.upFirstChar(node["src"]);
			}
			return "drawNode";
		}
		public static createImage(node:Diagram.Nodes.Symbol, model) {
			var n, img:HTMLElement;
			//node.model = node;

			if (Diagram.SymbolLibary.isSymbol(node)) {
				return Diagram.SymbolLibary.draw(null, node);
			}
			n = {tag: "img", model: node, src: node["src"]};
			var size = node.getSize();
			if (size.isEmpty() == false) {
				n.width = size.x;
				n.height = size.y;
			} else {
				n.xmlns = "http://www.w3.org/1999/xhtml";
			}
			img = util.create(n);
			if (size.isEmpty()) {
				model.appendImage(img);
				return null;
			}
			return img;
		}
		public static createGroup(node:BaseElement, group) {
			var func, y:number, yr:number, z:number, box, item, transform, i, offsetX = 0, offsetY = 0;
			var svg:any;
			if(node.getTyp().toUpperCase() == "HTML") {
				svg = util.create({
					tag: "svg",
					style: {left: group.x + node.getPos().x, top: group.y + node.getPos().y, position: "absolute"}
				});
			} else {
				svg = util.create({tag: "g"});
				transform = "translate(" + group.pos.x + " " + group.pos.y + ")";
				if (group.scale) {
					transform += " scale(" + group.scale + ")";
				}
				if (group.rotate) {
					transform += " rotate(" + group.rotate + ")";
				}
				svg.setAttribute('transform', transform);
			}
			for (i = 0; i < group.items.length; i += 1) {
				svg.appendChild(util.create(group.items[i]));
			}
			var elements = node["elements"];
			util.setSize(svg, group.width+node.getSize().x, group.height+node.getSize().y);
			node["$heightMin"] = node.getSize().y;
			if (elements) {
				for (i = 0; i < elements.length; i += 1) {
					if (!elements[i] && elements[i].length < 1) {
						elements.splice(i, 1);
						i -= 1;
					}
				}
				box = util.create({tag: "g"});
				z = elements.length * 25 + 6;
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
				node["$heightMax"] = z + node["$heightMin"];

				svg["elements"] = elements;
				svg["activ"] = util.create({
					tag: "text",
					$font: true,
					"text-anchor": "left",
					"width": 60,
					"x": (10 + offsetX),
					"y": 20,
					value: node["activText"]
				});
				svg.appendChild(svg.activ);
				y = offsetY + 46;
				yr = offsetY + 28;

				func = function (event) {
					svg.activ.textContent = event.currentTarget.value;
				};
				for (z = 0; z < elements.length; z += 1) {
					box.appendChild(util.create({
						tag: "text",
						$font: true,
						"text-anchor": "left",
						"width": 60,
						"x": 10,
						"y": y,
						value: elements[z]
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
					item.value = elements[z];
					if (node["action"]) {
						item.onclick = node["action"];
					} else {
						item.onclick = func;
					}
					y += 26;
					yr += 26;
				}
				svg.choicebox = box;
			}
			svg.tool = node;
			svg.onclick = function () {
				if (svg.status === "close") {
					svg.open();
				} else {
					svg.close();
				}
			};
			svg.close = function () {
				if (svg.status === "open" && svg.choicebox) {
					this.removeChild(svg.choicebox);
				}
				svg.status = "close";
				svg.tool.size.height = svg.tool.heightMin;
				//typ.util.setSize(g, g.tool.width + g.tool.x, g.tool.height + g.tool.y);
				util.setSize(svg, svg.tool.size.x, svg.tool.size.y);
			};
			svg.open = function () {
				if (this.tagName === "svg") {
					return;
				}
				if (svg.status === "close" && svg.choicebox) {
					this.appendChild(svg.choicebox);
				}
				svg.status = "open";
				svg.tool.size.height = svg.tool.heightMax;
				util.setSize(svg, svg.tool.width, svg.tool.height);
				//typ.util.setSize(g, g.tool.width + g.tool.x + 10, g.tool.height + g.tool.y + 10);
			};
			svg.close();

			return svg;
		};

		public static addChild(parent, json) : void {
			var item;
			if (json.offsetLeft) {
				item = json;
			} else {
				item = util.create(json);
			}
			item.setAttribute("class", "draggable");
			parent.appendChild(item);
		};

		public static all(node) :void {
			SymbolLibary.drawSmiley(node);
			SymbolLibary.drawDatabase(node);
			SymbolLibary.drawLetter(node);
			SymbolLibary.drawMobilephone(node);
			SymbolLibary.drawWall(node);
			SymbolLibary.drawActor(node);
			SymbolLibary.drawLamp(node);
			SymbolLibary.drawArrow(node);
			SymbolLibary.drawButton(node);
			SymbolLibary.drawDropdown(node);
			SymbolLibary.drawClassicon(node);
			SymbolLibary.drawEdgeicon(node);
		};

		public static drawSmiley(node:BaseElement) : BaseElement {
			return Diagram.Nodes.SO.create({
				x: node.getPos().x,
				y: node.getPos().y,
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
			});
		};

		public static drawDatabase(node:BaseElement) :BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
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
			});
		};

		public static drawLetter(node:BaseElement) : BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
				width: 25,
				height: 17,
				items: [
					{tag: "path", stroke: "black", fill: "none", d: "m1,1l22,0l0,14l-22,0l0,-14z"},
					{tag: "path", stroke: "black", fill: "none", d: "m1.06,1.14l10.94,6.81l10.91,-6.91"}
				]
			});
		};

		public static drawMobilephone(node:BaseElement) :BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
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
			});
		};

		public static drawWall(node:BaseElement) :BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
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
			});
		};

		public static drawActor(node:BaseElement) :BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
				width: 25,
				height: 50,
				items: [
					{tag: "line", stroke: "#000", x1: "12", y1: "10", x2: "12", y2: "30"},
					{tag: "circle", stroke: "#000", cy: "5", cx: "12", r: "5"},
					{tag: "line", stroke: "#000", y2: "18", x2: "25", y1: "18", x1: "0"},
					{tag: "line", stroke: "#000", y2: "39", x2: "5", y1: "30", x1: "12"},
					{tag: "line", stroke: "#000", y2: "39", x2: "20", y1: "30", x1: "12"}
				]
			});
		};

		public static drawLamp(node:BaseElement) :BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
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
			});
		};

		public static drawStop(node:BaseElement) : BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
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
			});
		};

		public static drawMin(node:BaseElement) :BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
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
			});
		};

		public static drawArrow(node:BaseElement) :BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
				width: 10,
				height: 9,
				rotate: node["rotate"],
				items: [
					{tag: "path", fill: "#000", stroke: "#000", d: "M 0,0 10,4 0,9 z"}
				]
			});
		};

		public static drawMax(node:BaseElement) : BaseElement{
			return Diagram.Nodes.SO.create({
				x: node.getPos().x || 0,
				y: node.getPos().y || 0,
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
			});
		};

		public static drawButton(node:BaseElement) :BaseElement{
			var btnX, btnY, btnWidth, btnHeight, btnValue;

			btnX = node.getPos().x || 0;
			btnY = node.getPos().y || 0;
			btnWidth = node.getSize().x || 60;
			btnHeight = node.getSize().y || 28;
			btnValue = node["value"] || "";
			return Diagram.Nodes.SO.create({
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
			});
		};

		public static drawDropdown(node:BaseElement) : BaseElement{
			var btnX, btnY, btnWidth, btnHeight;

			btnX = node.getPos().x || 0;
			btnY = node.getPos().y || 0;
			btnWidth = node.getSize().x || 60;
			btnHeight = node.getSize().y || 28;
			return Diagram.Nodes.SO.create({
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
			});
		};

		public static drawClassicon(node:BaseElement) : BaseElement{
			var btnX, btnY, btnWidth, btnHeight;

			btnX = node.getPos().x || 0;
			btnY = node.getPos().y || 0;
			btnWidth = node.getSize().x || 60;
			btnHeight = node.getSize().y || 28;
			return Diagram.Nodes.SO.create({
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
			});
		};

		public static drawEdgeicon(node:BaseElement) : BaseElement{
			var btnX, btnY, btnWidth, btnHeight;

			btnX = node.getPos().x || 0;
			btnY = node.getPos().y || 0;
			btnWidth = node.getSize().x || 30;
			btnHeight = node.getSize().y || 35;
			return Diagram.Nodes.SO.create({
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
			});
		}
	}

	//				######################################################### CSS #########################################################
	export class CSS {
		private name:string;
		public css;

		constructor(name, item?:any) {
			var i, value, border:string, prop, el;
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

		public get(key:string):any {
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
			if(!item) {
				return;
			}
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

	//				######################################################### Header #########################################################
	export class Header extends Diagram.Nodes.Node  {
		private group;
		private visible:boolean;
		private toolitems:Array<any>=[];

		public getEvent():string[] {
			return [EventBus.EVENT.HEADER, EventBus.EVENT.MOUSEMOVE, EventBus.EVENT.MOUSEOUT];
		}

		public getPos():Point {
			return new Point(0,0);
		}
		public getSize() :Point {
			return this.size;
		}
		constructor($parent:Graph) {
			super("HEADER");
			this.size = new Point(60,28);
			this.$parent = $parent;
		}

		public draw(draw?:string) : HTMLElement {
			var temp, list, item, child, func, i, type, removeToolItems, parent:any, that=this;
			var x,y, root = <Graph>this.getRoot();

			type = root.getTyp().toUpperCase();
			list = ["HTML", "SVG", "PNG"];
			parent = this.getRoot();

			removeToolItems = function () {
				for (i = 0; i < that.toolitems.length; i += 1) {
					that.toolitems[i].close();
				}
				that.$parent["$gui"].removeChild(that.group);
			};
			temp = typeof (window["svgConverter"]);
			if (temp !== "undefined") {
				list.push("EPS");
				temp = typeof (window["jsPDF"]);
				list.push(temp !== "undefined" ? "PDF" : "");
			}
			if (type === "HTML") {
				that.group = parent.getBoard("svg");
			}else {
				that.group = util.create({tag:"g"})
			}
			item = parent.getModel().getOption("buttons");
			func = function (e) {
				var t = e.currentTarget.typ;
				parent.initBoard(t);
				parent.layout();
			};
			for (i = 0; i < item.length; i += 1) {
				if (item[i] !== type) {
					child = SymbolLibary.draw(Diagram.Nodes.SO.create({"typ": "Button", value: item[i], y: 8, x: 2, height: 28, width: 60, $parent: this}));
					child.style.verticalAlign = "top";
					util.bind(child, "mousedown", func);
					child.typ = item[i];
					that.toolitems.push(child);
				}
			}
			if (type === "HTML") {
				if (this.id) {
					func = function (e) {
						var t = e.currentTarget.value;
						if (t === "Save") {
							parent.SavePosition();
						} else if (t === "Load") {
							parent.LoadPosition();
						}
					};
					item = {
						typ: "Dropdown",
						x: 2,
						y: 8,
						width: 120,
						elements: ["Save", "Load"],
						activText: "Localstorage",
						action: func
					};
					that.toolitems.push(SymbolLibary.draw(item, this));
				}
			}
			child = Diagram.Nodes.SO.create({
				typ: "Dropdown",
				x: 66,
				y: 8,
				minheight: 28,
				maxheight: 28,
				width: 80,
				elements: list,
				activText: "Save",
				action: function (e) {
					removeToolItems();
					parent.SaveAs(e.currentTarget.value);
				}
			});
			this.toolitems.push(SymbolLibary.draw(child, this));

			x = child.x + child.width;
			child = this.toolitems[this.toolitems.length - 1].choicebox;
			child = child.childNodes[child.childNodes.length - 1];
			y = child.height.baseVal.value + child.y.baseVal.value + 10;
			this.withPos(x,y);
			for(i=0;i<this.toolitems.length;i +=1) {
				this.group.appendChild(this.toolitems[i]);
			}

			util.setSize(this.group, x, y);
			util.setPos(this.group, 0,0);
			CSS.addStyle(this.group, "SVGBtn");
			return this.group;
		}
		public getRoot(): Diagram.Nodes.Node {
			if (this.$parent) {
				return this.$parent.getRoot();
			}
			return this;
		}
		public fireEvent(source:BaseElement, typ:string, value:Object) {
			this.getRoot().fireEvent(source, typ, value);
		}
		public event(source:BaseElement, typ:string, value:Object) : boolean {
			if(typ===EventBus.EVENT.MOUSEOUT) {
				if(this.visible) {
					this.$parent["$gui"].removeChild(this.group);
					this.visible = false;
				}
			} else if(value["pageX"] >= this.getSize().x || value["pageY"] >= this.getSize().y ) {
				if(this.visible) {
					this.$parent["$gui"].removeChild(this.group);
					this.visible = false;
				}
			} else if(!this.visible) {
				if(!this.group) {
					this.draw();
				}
				this.$parent["$gui"].appendChild(this.group);
				this.visible = true;
			}
			//TODO util.bind(this.$parent["$gui"], "mouseover", function () {
			//	that.$parent["$gui"].appendChild(that.group);
			//});
			//util.bind(this.$parent["$gui"], "mouseout", function (event) {
			//	if (event.pageX >= that.width || event.pageY > that.height) {
			//		removeToolItems(that.$parent["$gui"]);
			//	}
			//});
			return true;
		}
	}
	//				######################################################### Raster #########################################################
	export class Raster extends Nodes.Node {
		private range:number=10;

		constructor($parent:Graph) {
			super("Raster");
			this.$parent = $parent;
		}

		public draw(draw?:string) : HTMLElement {
			var y:number, height:number, line:HTMLElement, i:number, parent:any = this.$parent;
			if (draw === "HTML") {
				this.$gui = parent.getBoard("svg");
			}else {
				this.$gui = util.create({tag:"g"})
			}
			y = parent["width"];
			height = this.pos.y;
			for (i = this.range; i < y; i += this.range) {
				line = new Line(new Point(i,0), new Point(i,height), null, "#ccc").draw();
				line.setAttribute("className", "lineRaster");
				this.$gui.appendChild(line);
			}
			for (i = this.range; i < height; i += this.range) {
				line = new Line(new Point(0, i), new Point(0, y), null, "#ccc").draw();
				line.setAttribute("className", "lineRaster");
				this.$gui.appendChild(line);
			}
			return this.$gui;
		}
		public moveToRaster(node:Nodes.Node) {
			var pos = node.getPos();
			node.withPos(parseInt("" + (pos.x / this.range), this.range) * this.range, parseInt("" + (pos.y / this.range), this.range) * this.range)
		}
	}
	//				######################################################### Loader #########################################################
	export class Loader implements BaseElement {
		private images:Array<HTMLImageElement>;
		private graph:Graph;
		public abort:boolean;

		constructor(graph:Graph) {
			this.graph = graph;
		}

		public getTyp() : string{
			return "";
		}

		public getEvent() : string[] {
			return [EventBus.EVENT.LOAD];
		}
		public getCenter() : Point {
			var pos = this.getPos();
			var size = this.getSize();
			return new Point(pos.x+size.x/2, pos.y+size.y/2);
		}
		public getPos() : Point {
			return null;
		}
		public getSize() : Point {
			return null;
		}
		public withSize(x:number,y:number):BaseElement {
			return this;
		}
		public length() {
			if(this.images) {
				return this.images.length;
			}
			return 0;
		}
		public draw(typ?:string) : HTMLElement {
			if (this.images.length === 0) {
				this.fireEvent(this, "loaded", null);
			} else {
				var img = this.images[0];
				this.graph.add(img);
			}
			return null;
		}
		public fireEvent(source:BaseElement, typ:string, value:Object) {
			this.graph.fireEvent(source, typ, value);
		};
		public onLoad(e) {
			var idx, img = e.target;
			idx = this.images.indexOf(img);
			img.model.withSize(img.width, img.height);
			this.graph.remove(img);
			if (idx !== -1) {
				this.images.splice(idx, 1);
			}
			this.draw();
		}
		public add(img:HTMLImageElement) {
			var that = this, func = function (e) {
				that.onLoad(e);
			};
			util.bind(img, "load", func);
			this.images.push(img);
			this.draw();
		}
		public event(source:BaseElement, typ:string, value:Object) : boolean{
			//TODO IMPLEMENT LOADED RESOURCE
			return true;
		}
	}
}

module Diagram.Edges {
	//				######################################################### Edge #########################################################
	export class Edge extends Diagram.Nodes.Node {
		public $sNode:Diagram.Nodes.Node;
		public $tNode:Diagram.Nodes.Node;
		private $m:number = 0;
		private $n:number = 0;
		protected $lineStyle:string;
		counter:number;
		private $labels:Array<Object>;
		protected $path:Array<Line>;
		public source:Info;
		target:Info;
		private style:string;
		private info:Info;
		private board:any;
		private $start:string;
		protected $end:string;
		protected $endPos:Point;
		protected $top:Point;
		protected $bot:Point;
		protected $topCenter:Point;
		protected $botCenter:Point;
		public static Position = {UP: "UP", LEFT: "LEFT", RIGHT: "RIGHT", DOWN: "DOWN"};
		static Range(min:Point, max:Point, x:number, y:number) {
			max.x = Math.max(max.x, x);
			max.y = Math.max(max.y, y);
			min.x = Math.min(min.x, x);
			min.y = Math.min(min.y, y);
		}

		constructor() {
			super("EDGE");
			this.$path = [];
			this.$lineStyle = Line.FORMAT.SOLID;
		};
		public withItem(source:Info, target:Info) : Edge {
			this.source = source;
			this.target = target;
			return this;
		};
		public set(id, value) {
			if (value) {
				this[id] = value;
			}
		};
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
		};
    // TODO
  // many Edges SOME DOWN AND SOME RIGHT OR LEFT
  // INFOTEXT DONT SHOW IF NO PLACE
  // INFOTEXT CALCULATE POSITION
		public calc(board)  : boolean {
			var result, options, linetyp, sourcePos, targetPos, divisor, startNode:Diagram.Nodes.Node, endNode:Diagram.Nodes.Node;
			startNode = <Diagram.Nodes.Node>this.$sNode.getShowed();
			endNode = <Diagram.Nodes.Node>this.$tNode.getShowed();

			divisor = (endNode.getCenter().x - startNode.getCenter().x);
			this.$path = [];
			startNode = startNode.getTarget(startNode);
			endNode = endNode.getTarget(endNode);
			if (divisor === 0) {
				if (startNode === endNode) {
					/* OwnAssoc */
					return false;
				}
				// Must be UP_DOWN or DOWN_UP
				if (startNode.getCenter().y < endNode.getCenter().y) {
					// UP_DOWN
					sourcePos = this.getCenterPosition(startNode, Edge.Position.DOWN);
					targetPos = this.getCenterPosition(endNode, Edge.Position.UP);
				} else {
					sourcePos = this.getCenterPosition(startNode, Edge.Position.UP);
					targetPos = this.getCenterPosition(endNode, Edge.Position.DOWN);
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
					this.$m = (endNode.getCenter().y - startNode.getCenter().y) / divisor;
					this.$n = startNode.getCenter().y - (startNode.getCenter().x * this.$m);
					sourcePos = Edge.getPosition(this.$m, this.$n, startNode, endNode.getCenter());
					targetPos = Edge.getPosition(this.$m, this.$n, endNode, sourcePos);
				}
			}
			if (sourcePos && targetPos) {
				this.calcInfoPos(sourcePos, startNode, this.source);
				this.calcInfoPos(targetPos, endNode, this.target);
				startNode["$" + sourcePos.$id] += 1;
				endNode["$" + targetPos.$id] += 1;
				this.$path.push(new Line(sourcePos, targetPos, this.$lineStyle, this.style));
				if (this.info) {
					this.info.withPos((sourcePos.x + targetPos.x) / 2, (sourcePos.y + targetPos.y) / 2)
				}
			}
			return true;
		}
		public addLineTo(x1:number, y1:number, x2?:number, y2?:number) {
			var start, end;
			if (!x2 && !y2 && this.$path.length > 0) {
				start = this.$path[this.$path.length - 1].target;
				end = new Point(start.x + x1, start.y + y1);
			} else {
				start = new Point(x1, y1);
				end = new Point(start.x + x2, start.y + y2);
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
			var startPos = this.$sNode.getPos();
			var startSize = this.$sNode.getSize();
			var endPos = this.$tNode.getPos();
			var endSize = this.$tNode.getSize();
			if (startPos.y - 40 > endPos.y + endSize.y) { // oberseite von source and unterseite von target
				this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
				this.addLine(endPos.x + endSize.x/ 2, endPos.y + endSize.y + 20);
				this.addLineTo(0, -20);
				return true;
			}
			if (endPos.y - 40 > startPos.y + startSize.y) { // oberseite von source and unterseite von target
				// fall 1 nur andersherum
				this.addLineTo(startPos.x + startSize.x  / 2, startPos.y + startSize.y, 0, +20);
				this.addLine(endPos.x + endSize.x/ 2, endPos.y - 20);
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
			this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
			this.addLine(endPos.x + endSize.x / 2, endPos.y - 20);
			this.addLineTo(0, 20);
			return true;
		};
		public calcOffset() {
			var i, z, min = new Point(999999999, 999999999), max = new Point(0, 0), item, svg, value, x, y;
			for (i = 0; i < this.$path.length; i += 1) {
				item = this.$path[i];
				if (item.typ==Line.FORMAT.PATH) {
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
				} else {
					Edge.Range(min, max, item.source.x, item.source.y);
					Edge.Range(min, max, item.target.x, item.target.y);
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
				if (item.typ==Line.FORMAT.PATH) {
					this.board.appendChild(item.draw());
				} else {
					style = item.style || this.style;
					this.board.appendChild(item.draw());
				}
			}
			this.drawSourceText(style);
			if (this.info) {
				angle = this.info.draw(typ);
				var pos = this.info.getPos();
				this.board.appendChild(SymbolLibary.draw(Diagram.Nodes.SO.create({
					"typ": "Arrow",
					x: pos.x,
					y: pos.y,
					rotate: angle
				})));
			}
			this.drawTargetText(style);
			return this.$gui;
		};
		public drawText(info, style) {
			if (this.$path.length < 1) {
				return;
			}
			var options, angle=0, p, item;
			p = this.$path[0];
			options = this.getRoot()["model"].options;
			if (options.rotatetext) {
				info.$angle = Math.atan((p.source.y - p.target.y) / (p.source.x - p.target.x)) * 60;
			}
			if (this.getRoot().typ === "svg") {
				item = info.drawSVG();
			} else {
				item = info.drawHTML();
			}
			if(style) {
				item.setAttribute("style", style);
			}
			if (!this.$labels) {
				this.$labels = [];
			}
			if (item) {
				this.$labels.push(item);
				this.getRoot().$gui.appendChild(item);
			}
			return angle;
		};
		public drawSourceText(style) {
			this.drawText(this.source, style);
		};
		public drawTargetText(style) {
			this.drawText(this.target, style);
		};
		public endPos() : Line {
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
				tPos = new Point(sPos.x, sPos.y - offset);
			} else if (this.$start === Edge.Position.DOWN) {
				tPos = new Point(sPos.x, sPos.y + offset);
			} else if (this.$start === Edge.Position.RIGHT) {
				tPos = new Point(sPos.x + offset, sPos.y);
			} else if (this.$start === Edge.Position.LEFT) {
				tPos = new Point(sPos.x - offset, sPos.y);
			}
			var startPos =this.$sNode.getPos();
			var startSize =this.$sNode.getSize();
			this.$path.push(new Line(sPos, tPos, this.$lineStyle));
			if (this.$end === Edge.Position.LEFT || this.$end === Edge.Position.RIGHT) {
				if (this.$start === Edge.Position.LEFT) {
					sPos = tPos;
					tPos = new Point(sPos.x, startPos.y - offset);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				} else if (this.$start === Edge.Position.RIGHT) {
					sPos = tPos;
					tPos = new Point(sPos.x, startPos.y + offset);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				}
				sPos = tPos;
				if (this.$end === Edge.Position.LEFT) {
					tPos = new Point(startPos.x - offset, sPos.y);
				} else {
					tPos = new Point(startPos.x + startSize.x + offset, sPos.y);
				}
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				sPos = tPos;
				tPos = new Point(sPos.x, this.$sNode.getCenter().y);
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				if (this.info) {
					this.info.withPos( (sPos.x + tPos.x) / 2, sPos.y);
				}
			} else if (this.$end === Edge.Position.UP || this.$end === Edge.Position.DOWN) {
				if (this.$start === Edge.Position.UP) {
					sPos = tPos;
					tPos = new Point(startPos.x +startSize.x + offset, sPos.y);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				} else if (this.$start === Edge.Position.DOWN) {
					sPos = tPos;
					tPos = new Point(startPos.x - offset, sPos.y);
					this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				}
				sPos = tPos;
				if (this.$end === Edge.Position.UP) {
					tPos = new Point(sPos.x, startPos.y - offset);
				} else {
					tPos = new Point(sPos.x, startPos.y + startSize.y + offset);
				}
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				sPos = tPos;
				tPos = new Point(this.$sNode.getCenter().x, sPos.y);
				this.$path.push(new Line(sPos, tPos, this.$lineStyle));
				if (this.info) {
					this.info.withPos(sPos.x, (sPos.y + tPos.y) / 2);
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
			var size = info.getSize();
			if (linePos.$id === Edge.Position.UP) {
				newY = newY - size.y - spaceA;
				if (this.$m !== 0) {
					newX = (newY - this.$n) / this.$m + spaceB + (item.$UP * step);
				}
			} else if (linePos.$id === Edge.Position.DOWN) {
				newY = newY + spaceA;
				if (this.$m !== 0) {
					newX = (newY - this.$n) / this.$m + spaceB + (item.$DOWN * step);
				}
			} else if (linePos.$id === Edge.Position.LEFT) {
				newX = newX - size.x - (item.$LEFT * step) - spaceA;
				if (this.$m !== 0) {
					newY = (this.$m * newX) + this.$n;
				}
			} else if (linePos.$id === Edge.Position.RIGHT) {
				newX += (item.$RIGHT * step) + spaceA;
				if (this.$m !== 0) {
					newY = (this.$m * newX) + this.$n;
				}
			}
			info.withPos(Math.ceil(newX), Math.ceil(newY));
		};
		public static getUDPosition(m:number, n:number, e:BaseElement, p:string, step?:number) {
			var pos = e.getPos();
			var size = e.getSize();
			var x, y = pos.y;
			if (p === Edge.Position.DOWN) {
				y += size.y;
			}
			x = (y - n) / m;
			if (step) {
				x += e["$" + p] * step;
				if (x < pos.x) {
					x = pos.x;
				} else if (x > (pos.x + size.x)) {
					x = pos.x + size.x;
				}
			}
			return new Point(x, y, p);
		};
		public static getLRPosition(m:number, n:number, e:BaseElement, p:string, step?:number) {
			var pos:Point = e.getPos();
			var size:Point = e.getSize();

			var y, x = pos.x;
			if (p === Edge.Position.RIGHT) {
				x += size.x;
			}
			y = m * x + n;
			if (step) {
				y += e["$" + p] * step;
				if (y < pos.y) {
					y = pos.y;
				} else if (y > (pos.y + size.y)) {
					y = pos.y + size.y;
				}
			}
			return new Point(x, y, p);
		}
		public static getPosition(m:number, n:number, entity:BaseElement, refCenter:Point) {
			var t, p = [], list, distance = [], min = 999999999, position, i, step = 15;
			var pos = entity.getPos();
			var size = entity.getSize();
			list = [Edge.Position.LEFT, Edge.Position.RIGHT];
			for (i = 0; i < 2; i += 1) {
				t = this.getLRPosition(m, n, entity, list[i]);
				if (t.y >= pos.y && t.y <= (pos.y + size.y + 1)) {
					t.y += (entity["$" + list[i]] * step);
					if (t.y > (pos.y + size.y)) {
						// Alternative
						t = Edge.getUDPosition(m, n, entity, Edge.Position.DOWN, step);
					}
					p.push(t);
					distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
				}
			}
			list = [Edge.Position.UP, Edge.Position.DOWN];
			for (i = 0; i < 2; i += 1) {
				t = Edge.getUDPosition(m, n, entity, list[i]);
				if (t.x >= pos.x && t.x <= (pos.x + size.x + 1)) {
					t.x += (entity["$" + list[i]] * step);
					if (t.x > (pos.x + size.x)) {
						// Alternative
						t = this.getLRPosition(m, n, entity, Edge.Position.RIGHT, step);
					}
					p.push(t);
					distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
				}
			}
			for (i = 0; i < p.length; i += 1) {
				if (distance[i] < min) {
					min = distance[i];
					position = p[i];
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

			this.$top = new Point(this.$endPos.x + Math.cos(angle1) * h, this.$endPos.y + Math.sin(angle1) * h);
			this.$topCenter = new Point(this.$endPos.x + Math.cos(angle1) * hCenter, this.$endPos.y + Math.sin(angle1) * hCenter);
			angle2 = lineangle + Math.PI - angle;
			this.$bot = new Point(this.$endPos.x + Math.cos(angle2) * h, this.$endPos.y + Math.sin(angle2) * h);
			this.$botCenter = new Point(this.$endPos.x + Math.cos(angle2) * hCenter, this.$endPos.y + Math.sin(angle2) * hCenter);
			if (move) {
				this.endPos().target = new Point((this.$top.x + this.$bot.x) / 2, (this.$top.y + this.$bot.y) / 2);
			}
		};

		public addLine(x1:number, y1:number, x2?:number, y2?:number) {
			var start, end;
			if (!x2 && !y2 && this.$path.length > 0) {
				start = this.$path[this.$path.length - 1].target;
				end = new Point(x1, y1);
			} else {
				start = new Point(x1, y1);
				end = new Point(x2, y2);
			}
			this.$path.push(new Line(start, end, this.$lineStyle, this.style));
		};
		public getCenterPosition(node:BaseElement, p:string) :Point {
			var offset = node["$" + p];
			var size = node.getSize();
			var pos = node.getPos();
			if (p === Edge.Position.DOWN) {
				return new Point(Math.min(node.getCenter().x + offset, pos.x + size.x), (pos.y + size.y), Edge.Position.DOWN);
			}
			if (p === Edge.Position.UP) {
				return new Point(Math.min(node.getCenter().x + offset, pos.x + size.x), pos.y, Edge.Position.UP);
			}
			if (p === Edge.Position.LEFT) {
				return new Point(pos.x, Math.min(node.getCenter().y + offset, pos.y + size.y), Edge.Position.LEFT);
			}
			if (p === Edge.Position.RIGHT) {
				return new Point(pos.x + size.x, Math.min(node.getCenter().y + offset, pos.y + size.y), Edge.Position.RIGHT);
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
			this.$path.push(new Line(new Point(this.$top.x, this.$top.y), new Point(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Point(this.$bot.x, this.$bot.y), new Point(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Point(this.$top.x, this.$top.y), new Point(this.$bot.x, this.$bot.y)));
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
			this.$lineStyle = Line.FORMAT.DOTTED
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
			this.$path.push(new Line(new Point(this.$top.x, this.$top.y), new Point(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Point(this.$bot.x, this.$bot.y), new Point(this.$endPos.x, this.$endPos.y)));
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
			this.$path.push(new Line().withPath([this.endPos().target, this.$topCenter, this.$endPos, this.$botCenter], true, true).withColor("#FFF"));
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
			this.$path.push(new Line().withPath([this.endPos().target, this.$topCenter, this.$endPos, this.$botCenter],true, true).withColor("#000"));
			return true;
		}
	}
}
