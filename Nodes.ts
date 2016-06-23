///<reference path='Base.ts'/>
///<reference path='Edges.ts'/>
module Diagram {
    var svgUtil:SymbolLibary = new SymbolLibary();
    //				######################################################### Graph #########################################################
    export class Graph extends GraphNode{
        model:GraphModel;
        root:HTMLElement;
        board:HTMLElement;
        private init:boolean;
        private layouts:Array<any>;
        private loader:Loader;
        private lib:SymbolLibary;
        private layouter:any;
        private DragAndDrop:DragAndDrop;

        constructor(json:any, options:Diagram.Options) {
            super("");
            json = json || {};
            json.top = json.top || 50;
            json.left = json.left || 10;
            this.model = new GraphModel(json, options, this);
            this.layouts = [{name: "dagre", value: new DagreLayout()}];

            this.loader = new Loader(this);
            this.lib = new SymbolLibary();
            this.init = false;
        }
        public getOptions():Options {
            return this.model.options;
        }
        public initOption():void {
            if (this.init) {
                return;
            }
            this.init = true;
            var i, layout = this.layouts[0];
            for (i = 0; i < this.layouts.length; i += 1) {
                if (this.layouts[i].name === this.model.options.layout["name"].toLowerCase()) {
                    layout = this.layouts[i];
                    break;
                }
            }
            this.layouter = layout.value;
            if (this.model.options.canvasid) {
                this.root = document.getElementById(this.model.options.canvasid);
            }
            if (this.root) {
                if (this.model.options.clearCanvas) {
                    for (i = this.root.children.length - 1; i >= 0; i -= 1) {
                        this.root.removeChild(this.root.children[i]);
                    }
                }
            } else {
                this.root = document.createElement("div");
                this.root.setAttribute("class", "Board");
                if (this.model.options.canvasid) {
                    this.root.id = this.model.options.canvasid;
                }
                document.body.appendChild(this.root);
            }
            this.initBoard();
        }

        public initBoard(newTyp?:string) {
            if (!newTyp) {
                newTyp = this.getTyp();
            } else {
                this.model.options.display = newTyp;
                newTyp = newTyp.toLowerCase();
            }
            this.clearBoard();
            this.board = this.model.getBoard(newTyp);
            this.DragAndDrop = new DragAndDrop(this);
        }

        public getTyp() {
            return this.model.options.display.toLowerCase();
        };

        public addOption(typ, value) {
            this.model.options[typ] = value;
            this.init = false;
        };

        public clearBoard = function (onlyElements?:boolean) {
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
        };

        public addNode(node) {
            return this.model.addNode(node);
        };

        public addToEdge(source, target) {
            return this.model.addToEdge(source, target);
        };

        public removeNode(id) {
            return this.model.removeNode(id);
        }

        public draw(typ?:string) :HTMLElement {
            // model, width, height
            var i:string, n:GraphNode, nodes:Object, model:GraphModel;
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

            for (i in nodes) {
                if (!nodes.hasOwnProperty(i)) {
                    continue;
                }
                if (typeof (nodes[i]) === "function") {
                    continue;
                }
                n = nodes[i];
				n.$gui = n.draw(typ);
                if (typ === "svg") {
                    //svgUtil.addStyle(board, "ClazzHeader");
                    CSS.addStyles(this.board, n.$gui);
                }
                this.DragAndDrop.add(n.$gui);
                model.$gui.appendChild(n.$gui);
            }
        }
        public initGraph(model) {
            var i, n, isDiag, html, e;
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
                    this.initGraph(n);
                }
                html = n.draw(model.options.display);
                if (html) {
                    util.sizeOf(html, this, n);
                    if (isDiag) {
                        n.$center = new Pos(n.x + (n.width / 2), n.y + (n.height / 2));
                    }
                }
            }
            for (i = 0; i < model.edges.length; i += 1) {
                e = model.edges[i];
                e.source.initInfo();
                e.target.initInfo();
            }
        };

        public layout(minwidth?:number, minHeight?:number, model?:any) {
            this.initOption();
            if (!model) {
                model = this.model;
            }
            this.initGraph(model);
            if (this.loader.length() < 1) {
                this.layouter.layout(this, model, minwidth || 0, minHeight || 0);
            } else {
                this.loader.width = minwidth;
                this.loader.height = minHeight;
            }
        };

        public ExportPDF() {
            var converter, pdf = new window["jsPDF"]('l', 'px', [this.model.width, this.model.height]);
            converter = new window["svgConverter"](this.board, pdf, {removeInvalid: false});
            pdf.save('Download.pdf');
        };

        public ExportEPS() {
            var converter, doc = new window["svgConverter"].jsEPS({inverting: true});
            converter = new window["svgConverter"](this.board, doc, {removeInvalid: false});
            doc.save();
        };

        public ExportPNG() {
            var canvas, context, a, image = new Image();
            image.src = 'data:image/svg+xml;base64,' + util.utf8$to$b64(util.serializeXmlNode(this.board));
            image.onload = function () {
                canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                a = document.createElement('a');
                a.download = "download.png";
                a.href = canvas.toDataURL('image/png');
                a.click();
            };
        };

        public ExportHTML() {
            var data, body, script, json = this.model.toJson();
            body = document.createElement("body");
            script = document.createElement("script");
            body.appendChild(script);
            script.innerHTML = "new Graph(" + JSON.stringify(json, null, "\t") + ").layout();";
            data = "<html><head>" + document.head.innerHTML.trim() + "</head>" + body.toString() + "</html>";
            this.Save("text/json", data, "download.html");
        };

        public SaveAs(typ:String) {
            typ = typ.toLowerCase();
            if (typ === "svg") {
                this.Save("image/svg+xml", util.serializeXmlNode(this.board), "download.svg");
            } else if (typ === "html") {
                this.ExportHTML();
            } else if (typ === "png") {
                this.ExportPNG();
            } else if (typ === "pdf") {
                this.ExportPDF();
            } else if (typ === "eps") {
                this.ExportEPS();
            }
        };

        public SavePosition() {
            var data = [], node, id;
            for (id in this.model.nodes) {
                if (!this.model.nodes.hasOwnProperty(id)) {
                    continue;
                }
                node = this.model.nodes[id];
                data.push({id: node.id, x: node.x, y: node.y});
            }
            if (window.localStorage && this.model.id) {
                window.localStorage.setItem(this.model.id, JSON.stringify(data));
            }
        };

        public LoadPosition() {
            if (this.model.id && window.localStorage) {
                var node, id, data = window.localStorage.getItem(this.model.id);
                if (data) {
                    data = JSON.parse(data);
                    for (id in data) {
                        if (!data.hasOwnProperty(id)) {
                            continue;
                        }
                        node = data[id];
                        if (this.model.nodes[node.id]) {
                            this.model.nodes[node.id].x = node.x;
                            this.model.nodes[node.id].y = node.y;
                        }
                    }
                    this.clearBoard(true);
                    this.draw();
                }
            }
        };

        public Save(typ:string, data:Object, name:string) {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(new Blob([data], {type: typ}));
            a["download"] = name;
            a.click();
        }
    }
	//				######################################################### Clazz #########################################################
    export class Clazz extends GraphNode {
        private attributes:Array<string>;
        private methods:Array<string>;

        constructor(){super("");};

        public drawSVG(draw?:boolean) {
            var width, height, id, textWidth, x, y, z, item, rect, g, board, styleHeader, headerHeight;
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
            textWidth = util.sizeOf(id, this).width;
            width = Math.max(width, textWidth);
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

            y = this.getY(true);
            x = this.getX(true);

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
                "x": x + width / 2 - textWidth / 2,
                "y": y + (headerHeight / 2),
                "width": textWidth
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
            var first, z, cell, item, model, htmlElement = util.create({tag: "div", model: this});
            model = this.getRoot()["model"];
            htmlElement.className = "classElement";
            util.setPos(htmlElement, this.x, this.y);
            htmlElement.style.zIndex = 5000;

            model.createdElement(htmlElement, "class", this);
            item = util.create({tag: 'table', border: "0", style: {width: "100%", height: "100%"}});
            htmlElement.appendChild(item);
            if (this["head"] && this["head"].$src) {
                cell = util.createCell(item, "td", this);
                cell.style.textAlign = "center";
                if (!this["head"].$img) {
                    this["head"].$img = {};
                    this["head"].$img.src = this["head"].$src;
                    this["head"].$img.width = this["head"].$width;
                    this["head"].$img.height = this["head"].$height;
                }
                z = new SymbolLibary().createImage(this["head"].$img, this);
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
                cell.style.textDecorationLine = "underline";
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
                this.getRoot().createdElement(cell, "empty", this);
            }
            htmlElement.appendChild(item);
            htmlElement.node = this;
            this.$gui = htmlElement;
            return htmlElement;
        }
    }
    //				######################################################### Symbol #########################################################
    export class Symbol extends GraphNode {
        private lib:SymbolLibary;

        constructor(){
            super("");
            this.lib = new SymbolLibary();
        }

        public drawSVG() {
            return this.lib.draw(this, "svg");
        }

        public drawHTML() {
            return this.lib.draw(this);
        }
    }
    //				######################################################### Header #########################################################
    export class Raster extends Node {
        private $gui:any;
        private range:number=10;

        constructor($parent:GraphModel) {
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
            y = parent.width;
            height = this.height;
            for (i = this.range; i < y; i += this.range) {
                line = new Line(new Pos(i,0), new Pos(i,height), null, "#ccc").draw();
                line.setAttribute("className", "lineRaster");
                this.$gui.appendChild(line);
            }
            for (i = this.range; i < height; i += this.range) {
                line = new Line(new Pos(0, i), new Pos(0, y), null, "#ccc").draw();
                line.setAttribute("className", "lineRaster");
                this.$gui.appendChild(line);
            }
            return this.$gui;
        }
        public moveToRaster(node:GraphNode) {
            node.x = parseInt("" + (node.x / this.range), this.range) * this.range;
            node.y = parseInt("" + (node.y / this.range), this.range) * this.range;
        }
    }

        //				######################################################### Header #########################################################
    export class Header extends Node {
        private group;
        private toolitems:Array<any>=[];

        constructor($parent:GraphModel) {
            super("Header");
            this.$parent = $parent;

        }

        public draw(draw?:string) : HTMLElement {
            var temp, list, item, child, func, i, type, removeToolItems, parent:any, that=this;
            var lib: SymbolLibary;
            type = this.getRoot().getTyp().toUpperCase();
            list = ["HTML", "SVG", "PNG"];
            parent = this.$parent;

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

            util.bind(this.$parent["$gui"], "mouseover", function () {
                that.$parent["$gui"].appendChild(that.group);
            });
            util.bind(this.$parent["$gui"], "mouseout", function (event) {
                if (event.pageX >= that.width || event.pageY > that.height) {
                    removeToolItems(that.$parent["$gui"]);
                }
            });

            item = parent.options.buttons;
            func = function (e) {
                var t = e.currentTarget.typ;
                parent.initBoard(t);
                parent.layout();
            };
            lib = new SymbolLibary();
            for (i = 0; i < item.length; i += 1) {
                if (item[i] !== type) {
                    child = lib.draw({typ: "Button", value: item[i], y: 8, x: 2, height: 28, width: 60}, this);
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
                    that.toolitems.push(svgUtil.draw(item, this));
                }
            }
            child = {
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
            };
            this.toolitems.push(svgUtil.draw(child, this));
            this.width = child.x + child.width;
            child = this.toolitems[this.toolitems.length - 1].choicebox;
            child = child.childNodes[child.childNodes.length - 1];
            this.height = child.height.baseVal.value + child.y.baseVal.value + 10;

            for(i=0;i<this.toolitems.length;i +=1) {
                this.group.appendChild(this.toolitems[i]);
            }

            util.setSize(this.group, this.width, this.height);
            util.setPos(this.group, 0,0);
            CSS.addStyle(this.group, "SVGBtn");
            return this.group;
        }
    }
//				######################################################### Pattern #########################################################
    export class Pattern extends GraphNode {

        constructor(){super("");}
        public drawSVG(draw?:boolean) {
            var width, height, id, textWidth, x, y, rect, item, g = util.create({tag: "g", model: this});
            width = 0;
            height = 40;
            id = this.id;
            if (this.counter) {
                id += " (" + this.counter + ")";
            }
            textWidth = util.sizeOf(id, this).width;
            width = Math.max(width, textWidth);
            height += 20;
            width += 20;

            y = this.getY(true);
            x = this.getX(true);

            rect = {
                tag: "rect",
                "width": width,
                "height": height,
                "x": x,
                "y": y,
                "fill": "#fff",
                "class": "draggable"
            };
            rect.fill = "lightblue";

            g.appendChild(util.create(rect));
            item = util.create({
                tag: "text",
                $font: true,
                "text-anchor": "right",
                "x": x + width / 2 - textWidth / 2,
                "y": y + 20,
                "width": textWidth
            });
            item.appendChild(document.createTextNode(id));
            g.appendChild(item);
            g.appendChild(util.create({
                tag: "line",
                x1: x,
                y1: y + 30,
                x2: x + width,
                y2: y + 30,
                stroke: rect.stroke
            }));
            return g;
        }

        public drawHTML(draw?:boolean) {
            var cell, item = util.create({tag: "div", model: this});
            item.className = "patternElement";
            util.setPos(item, this.x, this.y);
            this.getRoot().createdElement(item, "class", this);
            item.appendChild(util.create({
                tag: 'table',
                border: "0",
                style: {width: "100%", height: "100%"}
            }));
            if (this["href"]) {
                cell = util.createCell(item, "th", this, "<a href=\"" + this["href"] + "\">" + this.id + "</a>", "id");
            } else {
                cell = util.createCell(item, "th", this, this.id, "id");
            }
            cell = util.createCell(item, "td", this, "&nbsp;");
            cell.className = 'first';
            this.getRoot().createdElement(cell, "empty", this);
            item.node = this;
            this.$gui = item;
            return item;
        }
    }
    //				######################################################### GraphModel #########################################################
    export class GraphModel extends GraphNode {
        nodes:Object;
        left:number;
        top:number;
        private minid:string;
        private $nodeCount:number;
        options:Options;
        private header:Header;
        private raster:Raster;

        private edges:Array<Edge>;

        constructor(json, options, parent) {
            super("");
            this.typ = "classdiagram";
            this.$isDraggable = true;
            this.$parent = parent;
            json = json || {};
            this.left = json.left || 0;
            this.top = json.top || 0;
            this.x = this.y = this.width = this.height = 0;
            if (json.minid) {
                this.minid = json.minid;
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
                    this.addEdgeModel(json.edges[i]);
                }
            }
        }

        public clear() {
            var i;
            GraphNode.prototype.clear.call(this);
            for (i in this.nodes) {
                if (!this.nodes.hasOwnProperty(i)) {
                    continue;
                }
                this.nodes[i].clear();
            }
        }

        public addEdgeModel(e) {
            var edge, list, typ = e.typ || "edge";
            typ = typ.charAt(0).toUpperCase() + typ.substring(1).toLowerCase();
            list = {
                "Edge": Edge,
                "Generalisation": Generalisation,
                "Implements": Implements,
                "Unidirectional": Unidirectional,
                "Aggregation": Aggregation,
                "Composition": Composition
            };
            if (list[typ]) {
                edge = new list[typ]();
            } else {
                edge = new Edge();
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

        public addToEdge(source, target) {
            var edge = new Edge().withItem(this.addNode(source), this.addNode(target));
            return this.addEdgeModel(edge);
        };

        public addNode(node) {
            /* testing if node is already existing in the graph */

            if (typeof (node) === "string") {
                node = {id: node, typ: "node"};
            }
            node.typ = node.typ || "node";
            node.typ = node.typ.charAt(0).toUpperCase() + node.typ.substring(1).toLowerCase();

            if (!(node.id)) {
                node.id = node.typ + "$" + (this.$nodeCount + 1);
            }
            if (this.nodes[node.id] !== undefined) {
                return this.nodes[node.id];
            }
            if (node.typ.indexOf("diagram", node.typ.length - 7) !== -1 || node.typ === "GraphModel") {
                node = new GraphModel(node, new Options(), this);
            } else if (new SymbolLibary().isSymbol(node)) {
                node = util.copy(new Symbol(), node);
            } else if (node.typ === "Clazz" || node.typ === "Object") {
                node = util.copy(new Clazz(), node);
            } else if (node.typ === "Pattern") {
                node = util.copy(new Pattern(), node);
            } else {
                node = util.copy(new GraphNode(""), node);
            }
            this.nodes[node.id] = node;
            node.$parent = this;
            this.$nodeCount += 1;
            return this.nodes[node.id];
        }
        public getNodeCount() {
            return this.$nodeCount;
        }
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
                if (n instanceof GraphModel) {
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
        public createdElement(element, typ) {
            this.getRoot().createdElement(element, typ);
        }
        public removeFromBoard(board) {
            if (this.$gui) {
                board.removeChild(this.$gui);
                this.$gui = null;
            }
        }
        public drawComponents() {
            if(!this.header) {
                this.header = new Header(this);
            }
            this.header.draw();
            if(this.options.raster) {
                this.raster = new Raster(this);
                this.$gui.appendChild(this.raster.draw());
            }
            this.resize();
        }
        private resize() {
            var nodes, n, max;
            var min: Pos;
            var i:string;
            var z:number;
            min = new Pos(0,0);
            max = new Pos(0,0);
            nodes = this.nodes;
            for (i in nodes) {
                if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === "function") {
                    continue;
                }
                n = nodes[i];
                if (this.options.raster) {
                    this.raster.moveToRaster(n);
                }
                util.MinMax(n, min, max);
            }
            z = min.y - this.header.height;
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
            this.height = max.y;
            this.width = max.x;
            util.setSize(this.$gui, max.x, max.y);
            this.drawLines();
            return max;
        }
        public drawLines() {
            this.clearLines();
            var i, e, startShow, endShow, items = [], id;
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
        public clearLines() {
            var i;
            for (i = 0; i < this.edges.length; i += 1) {
                this.edges[i].removeFromBoard(this.$gui);
            }
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
                        if (Diagram.GraphModel.validateEdge(list[e], list[z])) {
                            list[e].target.cardinality = "many";
                            list.splice(z, 1);
                            z -= 1;
                        } else if (Diagram.GraphModel.validateEdge(list[z], list[e])) {
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
        public getBoard(type) {
            if (type === "svg") {
                return this.$gui = util.create({tag: "svg"});
            }
            return this.$gui = util.create({tag: "div", model: this});
        }

        public drawSVG(draw?:boolean) {
            var g = util.create({tag: "g", model: this}), that = this, width, height, item, root:any;
            root = this.getRoot();
            if (this.status === "close") {
                width = util.sizeOf(this.$gui, this.minid || this.id) + 30;
                height = 40;
                svgUtil.addChild(g, {
                    tag: "text",
                    $font: true,
                    "text-anchor": "left",
                    "x": (this.x + 2),
                    "y": this.y + 12,
                    value: this.minid || this.id
                });
            } else {
                this.left = this.top = 30;
                this.$gui = g;

                width = util.getValue(this.$gui.style.width);
                height = util.getValue(this.$gui.style.height);
                if (this["style"] && this["style"].toLowerCase() === "nac") {
                    svgUtil.addChild(g, svgUtil.createGroup(this, svgUtil.drawStop(this)));
                }
            }
            svgUtil.addChild(g, {
                tag: "rect",
                "width": width,
                "height": height,
                "fill": "none",
                "strokeWidth": "1px",
                "stroke": util.getColor(this["style"], "#CCC"),
                "x": this.getX(true),
                "y": this.getY(true),
                "class": "draggable"
            });
            if (width > 0 && width !== this.width) {
                this.width = width;
            }
            if (this.status === "close") {
                // Open Button
                item = svgUtil.createGroup(this, svgUtil.drawMax({x: (this.x + width - 20), y: this.y}));
                this.height = height;
            } else {
                item = svgUtil.createGroup(this, svgUtil.drawMin({x: (this.x + width - 20), y: this.y}));
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
            var graph, item = util.create({tag: "div", model: this});
            util.setPos(item, this.x, this.y);
            if (this.typ === "classdiagram") {
                item.className = "classdiagram";
            } else if (this.typ === "objectdiagram") {
                item.className = "objectdiagram";
            } else if (this.$parent.typ.toLowerCase() === "objectdiagram") {
                item.className = "objectElement";
            } else {
                item.className = "classElement";
            }
            this.left = this.top = 30;
            this.$gui = item;
            if (draw) {
                this.$parent.draw();
                item.style.borderColor = "red";
                if (this["style"] && this["style"].toLowerCase() === "nac") {
                    item.appendChild(svgUtil.draw(null, {typ: "stop", x: 0, y: 0}));
                }
            } else {
                graph = <Graph>this.$parent;
                graph.layout(0, 0, this);
            }
            util.setSize(item, this.$gui.style.width, this.$gui.style.height);
            return item;
        }
    }
    //				######################################################### Loader #########################################################
    class Loader {
        private images:Array<HTMLImageElement>;
        private graph:Graph;
        abort:boolean;
        width:number;
        height:number;
        constructor(graph:Graph) {
            this.graph = graph;
        }

        public length() {
            if(this.images) {
                return this.images.length;
            }
            return 0;
        }
        public execute() {
            if (this.images.length === 0) {
                this.graph.layout(this.width, this.height);
            } else {
                var img = this.images[0];
                this.graph.root.appendChild(img);
            }
        };

        public onLoad(e) {
            var idx, img = e.target;
            idx = this.images.indexOf(img);
            img.model.width = img.width;
            img.model.height = img.height;
            this.graph.root.removeChild(img);
            if (idx !== -1) {
                this.images.splice(idx, 1);
            }
            this.execute();
        };

        public add(img:HTMLImageElement) {
            var that = this, func = function (e) {
                that.onLoad(e);
            };
            util.bind(img, "load", func);
            this.images.push(img);
            this.execute();
        }
    }
    //				######################################################### DRAG AND DROP #########################################################
    class DragAndDrop {
        private $parent:Graph;
        private objDrag:any;
        private mouse:Pos;
        private offset:Pos;
        private startObj:Pos;
        constructor(parent:Graph) {
            this.$parent = parent;
            this.objDrag = null;
            this.mouse = new Pos(0,0);
            this.offset = new Pos(0,0);
            this.startObj = new Pos(0,0);
            var that = this;
            parent.root.appendChild(parent.board);
            util.bind(parent.board, "mousemove", function (e) {
                that.doDrag(e);
            });
            util.bind(parent.board, "mouseup", function (e) {
                that.stopDrag(e);
            });
            util.bind(parent.board, "mouseout", function (e) {
                that.stopDrag(e);
            });
        }

        public add(element) {
            var that = this;
            util.bind(element, "mousedown", function (e) {
                that.startDrag(e);
            });
        }

        public setSelectable(node, value) {
            if (node.nodeType === 1) {
                if (value) {
                    node.setAttribute("unselectable", value);
                } else {
                    node.removeAttribute("unselectable");
                }
            }
            var child = node.firstChild;
            while (child) {
                this.setSelectable(child, value);
                child = child.nextSibling;
            }
        }

        public getDragNode(node) {
            if (node.model) {
                if (!node.model.$isdraggable) {
                    return null;
                }
                return node;
            }
            if (node.parentElement.model) {
                if (!node.parentElement.model.$isdraggable) {
                    return null;
                }
                return node.parentElement;
            }
            return null;
        }

        public startDrag(e) {
            var graph, i, n = this.getDragNode(event.currentTarget);
            if (!n) {
                return;
            }
            if (this.objDrag) {
                return;
            }
            this.objDrag = n;
            graph = this.objDrag.parentElement;
            if (graph) {
                for (i = 0; i < graph.children.length; i += 1) {
                    this.setSelectable(graph.children[i], "on");
                }
            }
            this.offset.x = util.getEventX(e);
            this.offset.y = util.getEventY(e);
            this.startObj.x = this.objDrag.model.x;
            this.startObj.y = this.objDrag.model.y;
        }

        public doDrag(e) {
            var x, y;
            this.mouse.x = util.getEventX(e);
            this.mouse.y = util.getEventY(e);
            if (this.objDrag !== null) {
                x = (this.mouse.x - this.offset.x) + this.startObj.x;
                y = (this.mouse.y - this.offset.y) + this.startObj.y;

                if (this.$parent.model.options.display === "svg") {
                    x = x - this.startObj.x;
                    y = y - this.startObj.y;
                    this.objDrag.setAttribute('transform', "translate(" + x + " " + y + ")");
                } else {
                    util.setPos(this.objDrag, x, y);
                    if (this.objDrag.model) {
                        this.objDrag.model.x = x;
                        this.objDrag.model.y = y;
                        this.objDrag.model.$parent.resize();
                    }
                }
            }
        }

        public stopDrag(e) {
            var x, y, z, item, entry, parent, pos;
            if (!this.objDrag) {
                return;
            }
            if (!(e.type === "mouseup" || e.type === "mouseout") && !e.currentTarget.$isdraggable) {
                return;
            }
            if (e.type === "mouseout") {
                x = util.getEventX(e);
                y =  util.getEventY(e);
                if (x < this.$parent.board.offsetWidth && y < this.$parent.board.offsetHeight) {
                    return;
                }
            }
            item = this.objDrag;
            this.objDrag = null;
            entry = item.parentElement;
            if (entry) {
                for (z = 0; z < entry.children.length; z += 1) {
                    this.setSelectable(entry.children[z], null);
                }
            }
            parent = item.parentElement;
            if (item.model) {
                if (item.model.$parent.options.display === "svg") {
                    if (item.getAttributeNS("", "transform")) {
                        z = item.getAttributeNS("", "transform");
                        if (z.substring(0, 6) !== "rotate") {
                            pos = z.slice(10, -1).split(' ');
                            item.model.x = item.model.x + Number(pos[0]);
                            item.model.y = item.model.y + Number(pos[1]);
                        }
                    }
                    item.model.$center = new Pos(item.model.x + (item.model.width / 2), item.model.y + (item.model.height / 2));
                    parent.removeChild(item);
                    if (item.model.board) {
                        item.model.board = null;
                    }
                } else {
                    this.$parent.board.removeChild(item);
                }

                if (item.model.typ === "Info") {
                    item.model.custom = true;
                    item.model.$edge.removeElement(item);
                    entry = item.model.$edge.getInfo(item.model);
                    item.model.$edge.drawText(this.$parent.board, entry, item.model);
                } else {
                    item.model.$gui = item.model.draw();
                    if (item.model.$gui) {
                        parent.appendChild(item.model.$gui);
                    }
                    entry = item.model.getEdges();
                    for (z = 0; z < entry.length; z += 1) {
                        entry[z].source.custom = false;
                        entry[z].target.custom = false;
                    }
                }
                parent = item.model.$parent;
                entry = parent;
//TODO                while (entry) {
//TODO                    this.$parent.model.resize(entry);
//TODO                    entry = entry.$parent;
//TODO                }
//TODO                if (parent.$parent) {
//TODO                    this.redrawNode(parent, true);
//TODO                    this.$parent.resize(this.$parent.model);
//TODO                } else {
//TODO                    this.$parent.resize(parent);
//TODO                }
            }
        }

        public redrawNode(node, draw) :void{
            var infoTxt, parent = node.$gui.parentElement;
            parent.removeChild(node.$gui);
            if (node.board) {
                node.board = null;
            }
            if (node.typ === "Info") {
                infoTxt = node.edge.getInfo(node.node);
                node.edge.drawText(this.$parent.board, infoTxt, node.node);
            } else {
                node.$gui = node.draw();
                if (node.$gui) {
                    parent.appendChild(node.$gui);
                }
            }
            node.$center = new Pos(node.x + (node.width / 2), node.y + (node.height / 2));
        }
    }
    //				######################################################### GraphLayout-Dagre #########################################################
    export class DagreLayout{
        public layout(graph, node, width, height) {
            var layoutNode, i, n, nodes, g, graphOptions = util.copy({directed: false}, node.options.layout);
            g = new window["dagre"].graphlib.Graph(graphOptions);
            g.setGraph(graphOptions);
            g.setDefaultEdgeLabel(function () { return {}; });
            nodes = node.nodes;
            for (i in nodes) {
                if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === "function") {
                    continue;
                }
                n = nodes[i];
                g.setNode(n.id, {label: n.id, width: n.width, height: n.height, x: n.x, y: n.y});
            }
            for (i = 0; i < node.edges.length; i += 1) {
                n = node.edges[i];
                g.setEdge(this.getNodeId(n.$sNode), this.getNodeId(n.$tNode));
            }
            window["dagre"].layout(g);
            // Set the layouting back
            for (i in nodes) {
                if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === "function") {
                    continue;
                }
                n = nodes[i];
                layoutNode = g.node(n.id);
                if (n.x < 1 && n.y < 1) {
                    n.x = Math.round(layoutNode.x - (n.width / 2));
                    n.y = Math.round(layoutNode.y - (n.height / 2));
                }
            }
            graph.draw();
        };
        public getNodeId(node) {
            if (node.$parent) {
                return this.getNodeId(node.$parent) || node.id;
            }
            return node.id;
        }
    }
}