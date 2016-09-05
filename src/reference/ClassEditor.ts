///<reference path='Nodes.ts'/>
module Diagram {
    // TODO
    // Validate input
    // Create Assocs
    // Edit Assocs
    // Delete Assocs
    // Edit Attribute and Methods
    // ################################## ClassEditor ####################################################
    export class ClassEditor extends GraphNode {
        private isIE:boolean;
        inputEvent:boolean=true;
        private nodes:any;
        private noButtons:boolean=true;
        model:GraphModel;
        board:HTMLElement;
        actions:Array<Action>;
        private inputNode:InputNode;
        private editNode:EditNode;
        private createEdge:CreateEdge;
        private toolBar:HTMLElement;
        private itemBar:HTMLElement;
        private codeViewer:HTMLElement;
        constructor(element, diagramTyp:string) {
            super();
            var parent, i, intern;
            this.isIE = util.isIE();
            this.inputEvent = true;
            this.nodes = {};
            this.model = new GraphModel(null, {buttons: [], typ: diagramTyp}, this);
            if (element) {
                if (typeof (element) === "string") {
                    this.board = this.model.$gui = this.model.getBoard("html");
                    this.model.drawHeader();
                    parent = document.getElementById(element);
                    if (!parent) {
                        document.body.appendChild(this.board);
                    } else {
                        for (i = parent.children.length - 1; i >= 0; i -= 1) {
                            parent.removeChild(parent.children[i]);
                        }
                        parent.appendChild(this.board);
                        parent.style.height = "100%";
                        parent.style["min-height"] = "";
                        parent.style["min-width"] = "";
                        parent.style.width = "100%";
                    }
                } else {
                    this.board = element;
                }
            } else {
                this.board = document.body;
            }
            this.inputNode = new InputNode(this);
            this.editNode = new EditNode(this);
            this.createEdge = new CreateEdge(this);
            this.actions = [new Selector(this), new MoveNode(this), this.createEdge, new CreateNode(this)];

            intern = new LocalEditor(this);
            this.loadModel(this.model);
        }
        public savePackage(e) {
            this.model["package"] = e.target.value;
        }

        public setBoardStyle(typ:string) {
            var b = this.board;
            util.removeClass(b, "Error");
            util.removeClass(b, "Ok");
            util.removeClass(b, "Add");
            if (typ === "dragleave") {
                if (b["errorText"]) {
                    b.removeChild(b["errorText"]);
                    b["errorText"] = null;
                }
                return true;
            }
            util.addClass(b, typ);
            if (typ === "Error") {
                if (!b["errorText"]) {
                    b["errorText"] = util.create({tag: "div", style: "margin-top: 30%", value: "NO TEXTFILE"});
                    b.appendChild(b["errorText"]);
                }
                return true;
            }
            return false;
        }

        public download(typ, data, name) {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(new Blob([data], {type: typ}));
            a["download"] = name;
            a.click();
        }

        public save() {
            var data, hasJava, result = {};
            util.copy(result, this.model);
            data = JSON.stringify(result, null, "\t");
            hasJava = typeof (window["java"]);
            if (hasJava !== 'undefined') {
                window["java"].save(data);
            } else {
                this.download("text/json", data, "model.json");
            }
        }

        public generate() {
            var data, result = util.minJson({}, this.model);
            data = JSON.stringify(result, null, "\t");
            window["java"].generate(data);
        }

        public close() {
            window["java"].exit();
        }

        public loadModel(model, addFile?:boolean, file?:any) {
            var i, that = this;
            if (!addFile) {
                this.model = new GraphModel(this, {buttons: []}, this);
                //this.model = that.copy(newModel, model);
            }
            this.getAction("Selector").setNode(null);
            for (i = this.board.children.length - 1; i >= 0; i -= 1) {
                this.board.removeChild(this.board.children[i]);
            }
            for (i in this.model.nodes) {
                if (!this.model.nodes.hasOwnProperty(i)) {
                    continue;
                }
                this.addNode(this.model.nodes[i]);
            }
            for (i in model.nodes) {
                if (!model.nodes.hasOwnProperty(i)) {
                    continue;
                }
                this.addNode(model.nodes[i]);
            }
            this.toolBar = util.create({
                tag: "div",
                id: "toolbar",
                "class": "Toolbar",
                style: "width:6px;height:120px",
                onMouseOver: function () {
                    that.maxToolbar();
                },
                onMouseOut: function (e) {
                    that.minToolbar(e);
                },
                $parent: this.board
            });

            this.itemBar = util.create({
                tag: "div",
                id: "itembar",
                "class": "Itembar",
                style: "width:6px;height:200px",
                onMouseOver: function () {
                    that.maxItembar();
                },
                onMouseOut: function (e) {
                    that.minItembar(e);
                },
                $parent: this.board
            });
            this.codeViewer = util.create({tag: "div", "class": "CodeView", $parent: this.board});
            util.create({
                tag: "div",
                "class": "pi",
                $parent: this.codeViewer,
                value: "&pi;",
                onMouseOver: function (e) {
                    that.maxCodeView(e);
                },
                onMouseOut: function (e) {
                    that.minCodeView(e);
                }
            });
        }
        public executeClassAdd(e) {
            var node = this.getAction("Selector").node;
            if (e.target.id === "Attribute") {
                this.inputNode.accept("attribute:Object", node);
            } else if (e.target.id === "Method") {
                this.inputNode.accept("methods()", node);
            }
        }

        public maxCodeView(e) {
            if (this.codeViewer) {
                return;
            }
            var html, rect, data, result = util.minJson({}, this.model);
            data = JSON.stringify(result, null, "\t");
            data = data.replace(new RegExp("\n", 'g'), "<br/>").replace(new RegExp(" ", 'g'), "&nbsp;");

            html = util.create({tag: "div", style: "position:absolute;", value: data});
            this.board.appendChild(html);
            rect = html.getBoundingClientRect();
            this.board.removeChild(html);
            this.codeViewer = util.create({
                tag: "div",
                "class": "code_box",
                style: {width: rect.width, height: rect.height},
                $parent: this.board,
                value: data
            });
        }

        public minCodeView(e) {
            if (!this.codeViewer) {
                return;
            }
            this.board.removeChild(this.codeViewer);
            this.codeViewer = null;
        }

        public maxToolbar() {
            if (this.toolBar.clientWidth > 100) {
                return;
            }
            var that = this, table, tr, cell, hasJava;

            this.toolBar["minWidth"] = this.toolBar.clientWidth;
            this.toolBar.style.width = "300px";
            table = util.create({tag: "table", $parent: this.toolBar});
            util.createCell(table, {"tag": "th", colspan: 2, value: "Properties"}, this);

            tr = util.create({tag: 'tr', $parent: table});
            util.create({"tag": "td", value: "Workspace:", $parent: tr});
            cell = util.create({"tag": "td", $parent: tr});
            this.createInputField({
                value: this.model["package"], $parent: cell, onChange: function (e) {
                    that.savePackage(e);
                }
            });

            cell = util.createCell(table, {
                "tag": "td",
                colspan: 2,
                style: "text-align:right;padding:10px 10px 0 0"
            }, this);
            util.create({
                tag: 'button',
                $parent: cell,
                style: "margin-left:10px;",
                value: "Save",
                onClick: function () {
                    that.save();
                }
            });
            hasJava = typeof (window["java"]);
            if (hasJava !== 'undefined') {
                util.create({
                    tag: 'button',
                    $parent: cell,
                    style: "margin-left:10px;",
                    value: "Generate",
                    onClick: function () {
                        that.generate();
                    }
                });
                util.create({
                    tag: 'button',
                    $parent: cell,
                    style: "margin-left:10px;",
                    value: "Exit",
                    onClick: function () {
                        that.close();
                    }
                });
            }
        }

        public maxItembar() {
            if (this.itemBar.clientWidth > 10) {
                return;
            }
            var that = this, table, th, item, node;

            this.itemBar["minWidth"] = this.itemBar.clientWidth;
            this.itemBar.style.width = "80px";

            table = util.create({tag: "table", style: "padding-left:10px", $parent: this.itemBar});
            util.createCell(table, {"tag": "th", value: "Item"}, this);
            th = util.createCell(table, {"tag": "th"}, this);
            item = util.create({
                "tag": "table",
                id: "node",
                draggable: "true",
                cellspacing: "0",
                ondragstart: function (e) {
                    that.startDrag(e);
                },
                style: "border:1px solid #000;width:30px;height:30px;cursor: pointer",
                $parent: th
            });
            util.createCell(item, {"tag": "td", style: "height:10px;border-bottom:1px solid #000;"}, this);
            util.createCell(item, {"tag": "td"}, this);
            node = this.getAction("Selector").node;

            if (node) {
                th = util.createCell(table, {"tag": "th"}, this);
                util.create({
                    tag: "button", id: "Attribute", value: "Attribute", onclick: function (e) {
                        that.executeClassAdd(e);
                    }, "style": "margin-top:5px;", $parent: th
                });
                util.create({
                    tag: "button", id: "Method", value: "Method", onclick: function (e) {
                        that.executeClassAdd(e);
                    }, "style": "margin-top:5px;", $parent: th
                });
            }
        }

        public createInputField(option) {
            var that = this, node;
            node = util.copy({
                tag: "input", type: "text", width: "100%", onFocus: function () {
                    that.inputEvent = false;
                }, onBlur: function () {
                    that.inputEvent = true;
                }
            }, option);
            if (option.$parent) {
                node.$parent = option.$parent;
            }
            if (option.onChange) {
                node.onChange = option.onChange;
            }
            return util.create(node);
        }
        public startDrag(e) {e.dataTransfer.setData("Text", e.target.id); };

        public minToolbar(e) {
            if (this.toolBar.clientWidth < 100 || this.getId(e.toElement, "toolbar")) {
                return;
            }
            var i;
            for (i = this.toolBar.children.length - 1; i >= 0; i -= 1) {
                this.toolBar.removeChild(this.toolBar.children[i]);
            }
            this.toolBar.style.width = this.toolBar["minWidth"];
            this.inputEvent = true;
        }

        public minItembar(e) {
            if (this.itemBar.clientWidth < 50 || this.getId(e.toElement, "itembar")) {
                return;
            }
            var i;
            for (i = this.itemBar.children.length - 1; i >= 0; i -= 1) {
                this.itemBar.removeChild(this.itemBar.children[i]);
            }
            this.itemBar.style.width = this.itemBar["minWidth"];
            this.inputEvent = true;
        }

        public getId(element, id) {
            if (element === null) {
                return false;
            }
            if (element.id === id) {
                return true;
            }
            return this.getId(element.parentElement, id);
        }

        public getAction(name) :any{
            var i:number;
            for (i = 0; i < this.actions.length; i += 1) {
                if (name === this.actions[i].name) {
                    return this.actions[i];
                }
            }
            return null;
        }

        public addNode(node) {
            var i, html = null, size, that = this, nodes:any;
            nodes = this.model.nodes;
            for (i = 0; i < nodes.length; i += 1) {
                if (this.model.nodes[i].id === node.id) {
                    html = this.model.nodes[i].draw();
                    break;
                }
            }
            if (!html) {
                node = this.model.addNode(node);
                html = this.model.nodes[i].draw();
            }
            if (this.getAction("Selector").node) {
                this.getAction("Selector").node = html;
            }
            this.board.appendChild(html);

            size = util.sizeOf(html, this.board);
            node.$minWidth = size.x;
            node.$minHeight = size.y;
            util.setSize(html, Math.max(Number(node.width), Number(node.$minWidth)), Math.max(Number(node.height), Number(node.$minHeight)));

            util.bind(html, "mouseup", function (e) {
                var n = util.getModelNode(e.target);
                if (n) {
                    that.getAction("Selector").setNode(n);
                }
            });
        }

        public removeNode(id) {
            this.model.removeNode(id);
        }

        public clearLines() {
            var i;
            for (i = 0; i < this.model["edges"].length; i += 1) {
                this.model["edges"][i].removeFromBoard(this.board);
            }
        };

        public drawlines() {
            this.clearLines();
            var infoTxt, e, i;
            for (i = 0; i < this.model["edges"].length; i += 1) {
                e = this.model["edges"][i];
                infoTxt = e.getInfo(e.source);
                if (infoTxt.length > 0) {
                    //e.draw();
                    //this.sizeHTML(this.drawer.getInfo(e.source, infoTxt, 0), e.source);
                }
                infoTxt = e.getInfo(e.target);
                if (infoTxt.length > 0) {
                    //this.sizeHTML(this.drawer.getInfo(e.target, infoTxt, 0), e.target);
                    //TODO Test
                }
            }
            //this.model.calcLines(this.drawer);
            for (i = 0; i < this.model["edges"].length; i += 1) {
                e.draw();
                //this.model.edges[i].draw();
            }
        }

        public removeCurrentNode() {
            var i, n, item, selector = this.getAction("Selector");
            item = selector.node;
            if (item) {
                selector.removeAll();
                this.board.removeChild(item);
                n = item.model;
                for (i = 0; i < n.nodes.length; i += 1) {
                    if (n.nodes[i].id === n.id) {
                        n.nodes.splice(i - 1, 1);
                        i -= 1;
                    }
                }
            }
        }

        public createdElement(element, type, node) {
            if (type) {
                if (type === "empty" || type === "attribute" || type === "method") {
                    this.createEdge.addElement(element, node);
                } else {
                    if (type !== "info") {
                        var that = this;
                        util.bind(element, "mousedown", function (e) {
                            that.getAction("MoveNode").callBack(type, e);
                        });
                    }
                    this.editNode.addElement(element, type);
                }
            }
        }
    }
    export class Action {
        $parent:ClassEditor;
        name:string
        constructor(parent:ClassEditor, name:string) {
            this.name = name;
        }
    }
    // ################################## CREATE ####################################################
    export class CreateNode extends Action {
        private minSize:number;
        private offset:Pos;
        private mouse:Pos;
        private createClass:boolean = false;
        private newClass:any;

        constructor(parent:ClassEditor) {
            super(parent, "CreateNode");
            this.minSize = 20;
            this.offset = new Pos(0,0);
            this.mouse = new Pos(0,0);
            this.createClass = false;
        }
        public startAction(event) {
            if (event.button === 2) {return; }
            if (event.target !== this.$parent.board) {return; }
            this.createClass = true;
            this.offset.x = this.mouse.x = this.getX(event);
            this.offset.y = this.mouse.y = this.getY(event);
            return true;
        }
        public doAction(event) {
            if (!this.createClass) {return; }
            this.mouse.x = this.getX(event);
            this.mouse.y = this.getY(event);
            this.createNode();
        }
        public setValue(x1, y1, x2, y2) {
            this.offset.x = x1;
            this.offset.y = y1;
            this.mouse.x = x2;
            this.mouse.y = y2;
            this.createNode();
        }
        public createNode() {
            var height, width = Math.abs(this.mouse.x - this.offset.x);
            height = Math.abs(this.mouse.y - this.offset.y);
            if (width > this.minSize && height > this.minSize) {
                if (!this.newClass) {
                    this.newClass = util.create({tag: "div", style: "position:absolute;opacity: 0.2;background-color:#ccc;"});
                    this.$parent.board.appendChild(this.newClass);
                }
                this.newClass.style.width = width;
                this.newClass.style.height = height;
                this.newClass.style.left = Math.min(this.mouse.x, this.offset.x);
                this.newClass.style.top = Math.min(this.mouse.y, this.offset.y);
            } else {
                if (this.newClass) {
                    this.$parent.board.removeChild(this.newClass);
                    this.newClass = null;
                }
            }
            return true;
        }
        public getX(event) {
            return util.getEventX(event) - this.$parent.board.offsetLeft;
        }
        public getY(event) {
            return util.getEventY(event) - this.$parent.board.offsetTop;
        }
        public outAction(event) {return this.stopAction(event); };
        public stopAction(event) {
            this.createClass = false;
            if (!this.newClass) {
                return false;
            }
            var node:any = {"typ": "node", "id": "Class" + (this.$parent.model.getNodeCount() + 1)};
            node.x = util.getValue(this.newClass.style.left);
            node.y = util.getValue(this.newClass.style.top);
            node.width = util.getValue(this.newClass.style.width);
            node.height = util.getValue(this.newClass.style.height);

            this.$parent.board.removeChild(this.newClass);
            this.newClass = null;
            this.$parent.addNode(node);
            return true;
        }
    }
    // ################################## SELECTOR ####################################################
    export class Selector extends Action {
        private size:number;
        private nodes:any;
        private mouse:Pos;
        private offset:Pos;
        private resizeNode:any;
        private sizeNode:Pos;
        private node:any;
        constructor(parent:ClassEditor) {
            super(parent, "Selector");
            this.size = 6;
            this.nodes = {};
            this.mouse = new Pos(0,0);
            this.offset = new Pos(0,0);
            this.resizeNode = null;
        }
        public start(e) {
            this.resizeNode = e.target.id;
            this.sizeNode = new Pos(this.node.model.width, this.node.model.height);
            this.offset.x = this.mouse.x = util.getEventX(e);
            this.offset.y = this.mouse.y = util.getEventY(e);
        }
        public doit(e) {
            if (!this.resizeNode) {
                return;
            }
            this.mouse.x = util.getEventX(e);
            this.mouse.y = util.getEventY(e);

            var n, multiX = 1, multiY = 1, diffX = 0, diffY = 0, newWidth, newHeight;
            if (this.resizeNode.charAt(0) === "n") {
                multiY = -1;
            }
            if (this.resizeNode.indexOf("w") >= 0) {
                multiX = -1;
            }
            n = this.node.model;

            newWidth = Math.max(n.$minWidth, this.sizeNode.x + (this.mouse.x - this.offset.x) * multiX);
            newHeight = Math.max(n.$minHeight, this.sizeNode.y + (this.mouse.y - this.offset.y) * multiY);

            if (this.resizeNode === "n") {
                diffY = n.height - newHeight;
                n.height = this.node.style.height = newHeight;
            } else if (this.resizeNode === "nw") {
                diffY = n.height - newHeight;
                n.height = this.node.style.height = newHeight;
                diffX = n.width - newWidth;
                n.width = this.node.style.width = newWidth;
            } else if (this.resizeNode === "ne") {
                diffY = n.height - newHeight;
                n.height = this.node.style.height = newHeight;
                n.width = this.node.style.width = newWidth;
            } else if (this.resizeNode === "sw") {
                diffX = n.width - newWidth;
                n.height = this.node.style.height = newHeight;
                n.width = this.node.style.width = newWidth;
            } else if (this.resizeNode === "s") {
                n.height = this.node.style.height = newHeight;
            } else if (this.resizeNode === "w") {
                diffX = n.width - newWidth;
                n.width = this.node.style.width = newWidth;
            } else if (this.resizeNode === "e") {
                n.width = this.node.style.width = newWidth;
            } else {
                n.width = this.node.style.width = newWidth;
                n.height = this.node.style.height = newHeight;
            }
            if (diffY !== 0) {
                n.y += diffY;
                this.node.style.top = n.y;
            }
            if (diffX !== 0) {
                n.x += diffX;
                this.node.style.left = n.x;
            }
            this.refreshNode();
        }
        public stop(e) {this.resizeNode = null; }
        public removeAll() {
            var i, select;
            for (i in this.nodes) {
                if (!this.nodes.hasOwnProperty(i)) {
                    continue;
                }
                select = this.nodes[i];
                this.$parent.board.removeChild(select);
            }
            this.nodes = {};
        }
        public setNode(node) {
            if (this.node) {
                this.removeAll();
            }
            this.node = node;
            this.refreshNode();
        }
        public refreshNode() {
            if (!this.node) {
                return;
            }
            var x, y, width, height, s, sh;
            x = util.getValue(this.node.style.left);
            y = util.getValue(this.node.style.top);
            width = util.getValue(this.node.clientWidth);
            height = util.getValue(this.node.clientHeight);
            s = this.size + 1;
            sh = this.size / 2 + 1;
            this.selector("nw", x - s, y - s);
            this.selector("n", x + (width / 2) - sh, y - s);
            this.selector("ne", x + width + 1, y - s);
            this.selector("w", x - s, y + height / 2 - sh);
            this.selector("sw", x - s, y + height + 1);
            this.selector("s", x + (width / 2) - sh, y + height + 1);
            this.selector("se", x + width + 1, y + height + 1);
            this.selector("e", x + width + 1, y + height / 2 - sh);
            this.addCreateAssoc(x + width, y);
        }
        public addCreateAssoc(x, y) {
            var n = this.nodes.assoc, symbolLib;
            if (!n) {
                n = {typ: "EdgeIcon", transform: "scale(0.2)", style: "cursor:pointer;top: " + x + "px;left:" + y + "px;" };
                symbolLib = new SymbolLibary();
                n = symbolLib.draw(null, n);
                n.style.left = x + 10;
                n.style.width = 40;
                n.style.height = 30;
                n.style.position = "absolute";
                n.style.top = y - 10;
                this.nodes.assoc = n;
                this.$parent.board.appendChild(n);
            }
        }
        public selector(id, x, y) {
            var n = this.nodes[id], that = this;
            if (!n) {
                n = util.create({tag: "div", "id": id, style: "position:absolute;background:#00F;width:" + this.size + "px;height:" + this.size + "px;cursor:" + id + "-resize;"});
                this.nodes[id] = n;
                util.bind(n, "mousedown", function (e) {that.start(e); });
                util.bind(n, "mousemove", function (e) {that.doit(e); });
                util.bind(n, "mouseup", function (e) {that.stop(e); });
                this.$parent.board.appendChild(n);
            }
            n.style.left = x;
            n.style.top = y;
        }
        public startAction() {
            if (!this.node) {
                return false;
            }
        }
        public doAction(event) {
            if (!this.resizeNode) {
                return false;
            }
            this.doit(event);
            return true;
        }
        public stopAction = function () {
            if (this.resizeNode) {
                this.resizeNode = false;
                return true;
            }
            return false;
        }
    }
    // ################################## MoveNode ####################################################
    export class MoveNode extends Action {
        private mouse:Pos;
        private offset:Pos;
        private node:any;
        private posNode:Pos;
        constructor(parent:ClassEditor) {
            super(parent, "MoveNode");
            this.mouse = new Pos(0,0);
            this.offset = new Pos(0,0);
        }
        public callBack(type, e) {
            if (type === "id") {
                var th = e.target, that = this;
                util.bind(th, "mousedown", function (e) {that.start(e); });
                util.bind(th, "mousemove", function (e) {that.doit(e); });
                util.bind(th, "mouseup", function (e) {that.stop(e); });
            }
        }
        public start(e) {
            this.node = util.getModelNode(e.target).model;
            this.posNode = new Pos(this.node.x, this.node.y);
            // SAVE ID
            this.offset.x = this.mouse.x = util.getEventX(e);
            this.offset.y = this.mouse.y = util.getEventY(e);
        }
        public doAction() {return this.node; };
        public doit(e) {
            if (!this.node) {
                return;
            }
            this.mouse.x = util.getEventX(e);
            this.mouse.y = util.getEventY(e);
            var newX, newY;
            newX = this.posNode.x + (this.mouse.x - this.offset.x);
            newY = this.posNode.y + (this.mouse.y - this.offset.y);

            this.node.x = this.node.$gui.style.left = newX;
            this.node.y = this.node.$gui.style.top = newY;
            this.$parent.getAction("Selector").refreshNode();
        }
        public stop(e) {
            this.node = null;
            this.$parent.drawlines();
        }
    }
    // ################################## InputNode ####################################################
    export class InputNode extends Action {
        private inputItem:any;
        private choiceBox:any;
        constructor(parent:ClassEditor) {
            super(parent, "InputNode");
            var that = this;
            document.body.addEventListener("keyup", function (e) {
                that.keyup(e);
            });
        }
        public keyup(e) {
            if (!this.$parent.inputEvent) {
                return;
            }
            var x = e.keyCode, selector, item, m, that = this;
            if (e.altKey || e.ctrlKey) {
                return;
            }
            if (x === 46) {
                this.$parent.removeCurrentNode();
            }
            if ((x > 64 && x < 91) && !e.shiftKey) {
                x += 32;
            }
            if ((x > 64 && x < 91) || (x > 96 && x < 123) || (x > 127 && x < 155) || (x > 159 && x < 166)) {
                selector = this.$parent.getAction("Selector");
                item = selector.node;
                if (item && !this.inputItem) {
                    m = item.model;
                    this.inputItem = util.create({tag: "input", type: "text", "#node": item, "value": String.fromCharCode(x), style: "position:absolute;left:" + m.x + "px;top:" + (m.y + m.height) + "px;width:" + m.width});
                    this.$parent.board.appendChild(this.inputItem);
                    this.choiceBox = new ChoiceBox(this.inputItem, this.$parent);
                    this.inputItem.addEventListener("keyup", function (e) {
                        that.changeText(e);
                    });
                    this.inputItem.focus();
                }
            }
        }
        public accept(text, n) {
            var id, model = n.model;
            id = n.model.id;
            if (this.addValue(text, model)) {
                if (id !== n.model.id) {
                    this.$parent.removeNode(id);
                    this.$parent.addNode(n.model);
                } else {
                    this.$parent.board.removeChild(n);
                    this.$parent.addNode(n.model);
                }
                this.$parent.getAction("Selector").refreshNode();
                return true;
            }
            return false;
        }
        public addValue(text, model) {
            if (text.length < 1) {
                return false;
            }
            if (text.indexOf(":") >= 0) {
                if (!model.attributes) {
                    model.attributes = [];
                }
                model.attributes.push(text);
                return true;
            }
            if (text.indexOf("(") > 0) {
                if (!model.methods) {
                    model.methods = [];
                }
                model.methods.push(text);
                return true;
            }
            //typ ClassEditor
            if (model.$parent.typ === "classdiagram") {
                model.id = this.fristUp(text);
            } else {
                model.id = text;
            }
            return true;
        }
        public fristUp(str:string) :string {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        public changeText(e) {
            if (!this.inputItem) {
                return;
            }
            var close = false, n, text;
            if (e.keyCode === 27) {close = true; }
            if (e.keyCode === 13) {
                n = this.inputItem.node;
                text = this.inputItem.value;
                if (this.accept(text, n)) {
                    close = true;
                }
            }
            if (close) {
                this.$parent.board.removeChild(this.inputItem);
                this.inputItem = null;
                if (this.choiceBox && this.choiceBox.div) {
                    this.$parent.board.removeChild(this.choiceBox.div);
                    this.choiceBox.div = null;
                    this.choiceBox = null;
                }
            }
        }
    }
    // ################################## ChoiceBox ####################################################
    export class ChoiceBox {
        private $parent:ClassEditor;
        private field:any;
        private list:Array<string>;
        private div:any;
        private typ:string;

        constructor(field, parent) {
            this.field = field;
            this.$parent = parent;
            this.list = [];
            var that = this;
            util.bind(field, "keyup", function (e) {that.change(e); });
        }
        public initAttributes() {
            this.list = ["Boolean", "Byte", "Character", "Double", "Float", "Integer", "Long", "Number", "Object", "Short", "String"];
            this.addFromGraph(this.$parent.model, "nodes.id");
            this.list.sort();
        }
        public addFromGraph(item, filter) {
            var i, z;
            for (i in item) {
                if (!item.hasOwnProperty(i)) {
                    continue;
                }
                if (item[i] instanceof Array) {
                    for (z = 0; z < item[i].length; z += 1) {
                        this.addFromGraph(item[i][z], filter.substring(filter.indexOf(".") + 1));
                    }
                }
                if (filter.indexOf(".") < 0 && i === filter) {
                    this.list.push(item[i]);
                }
            }
        }
        public change(e) {
            if (this.div) {
                this.$parent.board.removeChild(this.div);
                this.div = null;
            }
            if (e.keyCode === 27 || e.keyCode === 13) {
                return;
            }
            var t = e.target.value.toLowerCase(), that = this, i, div, func;
            this.typ = "";
            if (t.indexOf(":") >= 0) {
                this.initAttributes();
                this.typ = ":";
            }
            if (this.typ === "") {
                return;
            }
            t = t.substring(t.lastIndexOf(this.typ) + 1);
            div = util.create({tag: "div", "class": "ChoiceBox", style: "left:" + this.field.style.left + ";top:" + (util.getValue(this.field.style.top) + this.field.clientHeight + 4) + ";width:" + this.field.clientWidth});
            func = function () {that.select(this); };
            for (i = 0; i < this.list.length; i += 1) {
                if (this.list[i].toLowerCase().indexOf(t) >= 0) {
                    if (i % 2 === 0) {
                        util.create({tag: "div", value: this.list[i], $parent: div, onMouseup: func});
                    } else {
                        util.create({tag: "div", value: this.list[i], "class": "alt", $parent: div, onMouseup: func});
                    }
                }
            }
            if (div.children.length > 0) {
                this.div = div;
                this.$parent.board.appendChild(div);
            }
        }
        public select(input) {
            var pos = this.field.value.lastIndexOf(this.typ);
            this.field.value = this.field.value.substring(0, pos + 1) + input.innerHTML;
            if (this.div) {
                this.$parent.board.removeChild(this.div);
                this.div = null;
            }
            this.field.focus();
        }
    }
    // ################################## EditNode ####################################################
    export class EditNode extends Action {
        constructor(parent:ClassEditor) {
            super(parent, "EditNode");
        }
        public addElement(element, type) {
            var that = this;
            util.bind(element, "dblclick", function (e) {that.click(e, element, type); });
        }
        public click(e, control, type) {
            var that = this;
            control.oldValue = control.innerHTML;
            control.contentEditable = true;
            control.typ = type;
            this.$parent.inputEvent = false;
            util.selectText(control);
            control.onkeydown = function (e) {that.change(e, control); };
            control.onblur = function (e) {that.cancel(e, control); };
        }
        public cancel(e, control) {
            if (control.oldValue) {
                control.oldValue = null;
            }
            control.contentEditable = false;
        }
        public change(e, control) {
            if (e.keyCode !== 27 && e.keyCode !== 13) {
                return;
            }
            var value, t, i, node = util.getModelNode(control);
            control.contentEditable = false;
            this.$parent.inputEvent = true;
            if (e.keyCode === 27) {
                control.innerHTML = control.oldValue;
                control.oldValue = null;
                return;
            }
            value = control.innerHTML;
            control.oldValue = null;
            while (value.substring(value.length - 4) === "<br>") {
                value = value.substring(0, value.length - 4);
            }
            if (control.typ === "id") {
                node.model.id = value;
            } else if (control.typ === "attribute" || control.typ === "method") {
                t = control.typ + "s";
                for (i = 0; i < node.model[t].length; i += 1) {
                    if (node.model[t][i] === control.oldValue) {
                        if (value.length > 0) {
                            node.model[t][i] = value;
                        } else {
                            node.model[t].splice(i, 1);
                        }
                        break;
                    }
                }
            } else if (control.typ === "info") {
                node.model.property = value;
            }
            control.innerHTML = value;
        }
    }
    // ################################## CreateEdge ####################################################
    export class CreateEdge extends Action {
        private fromElement:any;
        private fromNode:any;
        private toElement:any;
        private toNode:any;
        private x:number;
        private y:number;
        private div:any;
        private list:Array<string>;
        constructor(parent:ClassEditor) {
            super(parent, "CreateEdge");
        }
        public addElement(element, node) {
            var that = this;
            util.bind(element, "mouseup", function (e) {that.up(e, element, node); });
            util.bind(element, "mousedown", function (e) {that.down(e, element, node); });
        }
        public down(e, element, node) {
            this.fromElement = element;
            this.fromNode = node;
            this.x = e.x;
            this.y = e.y;
        }

        public up(e, element, node) {
            if (!this.fromElement) {
                return;
            }
            if (this.$parent.getAction("Selector").node || Math.abs(e.x - this.x) + Math.abs(e.y - this.y) < 10) {
                this.fromElement = null;
                this.fromNode = null;
                return;
            }
            //this.getAction("Selector").setNode(null);
            e.stopPropagation();
            this.toElement = element;
            this.toNode = node;

            var i, div, width = 120, that = this, func;

            if (this.div) {
                return;
            }
            this.list = ["Generalisation", "Assoziation", "Abort"];

            div = util.create({tag: "div", "class": "ChoiceBox", style: {left: e.x, top: e.y, "width": width, zIndex: 6000}});
            func = function () {that.select(this); };

            for (i = 0; i < this.list.length; i += 1) {
                if (i % 2 === 0) {
                    util.create({tag: "div", value: this.list[i], $parent: div, onMouseup: func});
                } else {
                    util.create({tag: "div", value: this.list[i], "class": "alt", $parent: div, onMouseup: func});
                }
            }
            this.div = div;
            this.$parent.board.appendChild(div);
        }
        public startAction(e) {
            if (e.target === this.$parent.board && this.div) {
                this.$parent.board.removeChild(this.div);
                this.div = null;
            }
        }
        public select(e) {
            var edge, t = e.innerHTML;
            if (t === this.list[0]) {
                edge = this.$parent.model.addEdgeModel({"typ": "Generalisation", "source": {id: this.fromNode.id}, target: {id: this.toNode.id}});
                this.$parent.drawlines();
            }
            if (t === this.list[1]) {
                edge = this.$parent.model.addEdgeModel({"typ": "edge", "source": {id: this.fromNode.id, property: "from"}, target: {id: this.toNode.id, property: "to"}});
                this.$parent.drawlines();
            }
            this.$parent.board.removeChild(this.div);
            this.div = null;
            this.fromElement = null;
            this.fromNode = null;
            this.toNode = null;
            this.toElement = null;
        }
    }
    // ################################## DragClassEditor ####################################################
    export class LocalEditor {
        private $parent:ClassEditor;
        constructor(parent:ClassEditor) {
            var that = this, board;
            this.$parent = parent;
            board = this.$parent.board;
            util.bind(board, "mousedown", function (e) {
                that.doAction(e, "startAction");
            });
            util.bind(board, "mousemove", function (e) {
                that.doAction(e, "doAction");
            });
            util.bind(board, "mouseup", function (e) {
                that.doAction(e, "stopAction");
            });
            util.bind(board, "mouseout", function (e) {
                that.doAction(e, "outAction");
            });
            util.bind(board, "dragover", function (e) {
                that.dragClass(e);
            });
            util.bind(board, "dragleave", function (e) {
                that.dragClass(e);
            });
            util.bind(board, "drop", function (e) {
                that.dropModel(e);
            });
        }
        public dragStyler(e, typ) {
            e.stopPropagation();
            e.preventDefault();
            this.$parent.setBoardStyle(typ);
        }
        public dragClass(e) {
            if (this.dragStyler(e, e.type)) {
                return;
            }
            if (e.target !== this.$parent.board) {
                return;
            }
            var error = true, n, i, f, files = e.target.files || e.dataTransfer.files;
            // process all File objects
            if (!files || files.length < 1) {
                return;
            }
            for (i = 0; i < files.length; i += 1) {
                f = files[i];
                if (f.type.indexOf("text") === 0) {
                    error = false;
                } else if (f.type === "") {
                    n = f.name.toLowerCase();
                    if (n.indexOf("json", n.length - 4) !== -1) {
                        error = false;
                    }
                }
            }
            if (error) {
                this.dragStyler(e, "Error");
            } else if (e.ctrlKey) {
                this.dragStyler(e, "Add");
            } else {
                this.dragStyler(e, "Ok");
            }
        }
        public dropFile(content, file) {
            this.$parent.loadModel(JSON.parse(content), false, file);
        }
        public dropModel(e) {
            var i, n, f, files, x, y, that = this.$parent, func, data, load, reader;
            this.dragStyler(e, "dragleave");

            data = e.dataTransfer.getData("Text");
            if (data) {
                x = util.getEventX(e);
                y = util.getEventY(e);
                this.$parent.getAction("CreateNode").setValue(x, y, x + 100, y + 100);
                return;
            }

            files = e.target.files || e.dataTransfer.files;
            func = function (r) { that.loadModel(JSON.parse(r.target.result), e.ctrlKey, f); };
            for (i = 0; i < files.length; i += 1) {
                f = files[i];
                load = f.type.indexOf("text") === 0;
                if (!load && f.type === "") {
                    n = f.name.toLowerCase();
                    if (n.indexOf("json", n.length - 4) !== -1) {
                        load = true;
                    }
                }
                if (load) {
                    e.stopPropagation();
                    // file.name
                    reader = new FileReader();
                    reader.onload = func;
                    reader.readAsText(f);
                    break;
                }
            }
        }
        public doAction(event, functionName) {
            var i;
            for (i = 0; i < this.$parent.actions.length; i += 1) {
                if (typeof this.$parent.actions[i][functionName] === "function" && this.$parent.actions[i][functionName](event)) {
                    return;
                }
            }
            if (functionName === "stopAction" && event.target === this.$parent.board) {
                this.$parent.getAction("Selector").setNode(null);
            }
        }
    }
}