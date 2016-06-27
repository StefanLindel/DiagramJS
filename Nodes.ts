///<reference path='core.ts'/>
///<reference path='Edges.ts'/>
module Diagram {
    var svgUtil:SymbolLibary = new SymbolLibary();
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