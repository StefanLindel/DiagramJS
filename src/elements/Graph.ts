import * as edges from './edges';
import * as nodes from './nodes';
import * as layouts from '../layouts';
import Layout from '../layouts/Layout';
import { GraphModel } from './Model';
import Palette from '../Palette';
import * as PropertiesPanel from '../PropertiesPanel';
import { Size, Point } from './BaseElements';
import { Util } from '../util';
import { Control } from '../Control';
import Data from '../Data';
import { EventBus } from '../EventBus';
import { Drag, Select, Zoom, NewEdge, AddNode, PropertiesDispatcher } from '../handlers';
import Options from '../Options';
import { ImportFile } from '../handlers/ImportFile';
import { SymbolLibary } from './nodes/Symbol';
import { CSS } from '../CSS';
import { DiagramElement } from './index';
import { Edge } from './edges';
import { Toolbar } from '../Toolbar';

export class Graph extends Control {
    canvas: HTMLElement;
    root: Element;
    $graphModel: GraphModel;
    options: Options;
    canvasSize: Size;
    nodeFactory: Object;
    edgeFactory: Object;
    layoutFactory: Object;
    private currentlayout: Layout;
    private layerToolBar: SVGSVGElement;

    constructor(json: any, options: Options) {
        super();
        json = json || {};
        if (json['data']) {
            options = json['options'];
            json = json['data'];
            this.id = json['id'];
        }
        this.options = options || {};
        if (json['init']) {
            return;
        }
        if (!this.options.origin) {
            this.options.origin = new Point(150, 45);
        }
        this.initFactories();
        this.initCanvas();
        this.$graphModel = new GraphModel();
        this.$graphModel.init(this);
        this.$graphModel.load(json);
        this.initFeatures(this.options.features);

        this.addLayerToolBar();

        EventBus.register(this, this.canvas);
    }

    private createPattern(): Element {
        const defs = Util.createShape({ tag: 'defs' });
        const pattern = Util.createShape({
            tag: 'pattern',
            id: 'raster',
            patternUnits: 'userSpaceOnUse',
            width: 40,
            height: 40
        });
        const path = 'M0 4 L0 0 L4 0 M36 0 L40 0 L40 4 M40 36 L40 40 L36 40 M4 40 L0 40 L0 36';
        const cross = Util.createShape({
            tag: 'path',
            d: path,
            stroke: '#DDD',
            'stroke-width': 1,
            fill: 'none'
        });

        const rect = Util.createShape({
            tag: 'rect',
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            fill: 'none'
        });
        pattern.appendChild(rect);
        pattern.appendChild(cross);
        defs.appendChild(pattern);
        return defs;
    }

    public addLayerToolBar(): boolean {
        if (this.layerToolBar && document.getElementById(this.layerToolBar.id)) {
            return false;
        }
        let subElements = ['HTML', ['Save', 'PNG', 'SVG', 'HTML', 'PDF']];

        let c: number, z: number = 0;
        for (c = 0; c < subElements.length; c += 1) {
            if (typeof subElements[c] === 'string') {
                z += 1;
            } else {
                z += subElements[c].length;
            }
        }
        z = z * 30 + 20;

        this.layerToolBar = Util.createShape({
            tag: 'svg',
            id: 'rootExportBar',
            width: '80px',
            height: z + 'px',
            x: '100px',
            style: 'position: inherit;right: 80px;'
        });
        this.layerToolBar.appendChild(CSS.getStdDef());
        let that = this;
        let func = function (event: Event) {
            let text = (<any>event.currentTarget).eventValue;
            text = text.replace('* ', '');
            // console.log((<any>event.currentTarget).value);
            that.saveAs(text);
        };
        let btn = { id: 'Storage', type: 'Hamburger', x: 2, y: 8, width: 140, elements: subElements, activText: 'Localstorage', action: func };
        let item = SymbolLibary.drawSVG(btn);
        this.layerToolBar.appendChild(item);
        //        buttons.push(item);
        //    }
        //    return buttons;
        // };
        // this.canvas.appendChild(this.layerToolBar);
        this.canvas.appendChild(this.layerToolBar);

        return true;
    }

    public save(typ: string, data: any, name: string) {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([data], { type: typ }));
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    public exportSVG() {
        let wellFormatedSvgDom = this.getSvgWithStyleAttributes();
        this.save('image/svg+xml', this.serializeXmlNode(wellFormatedSvgDom), 'download.svg');
    }

    public getSvgWithStyleAttributes(): Node {
        let oDOM = this.$graphModel.$view.cloneNode(true);
        this.read_Element(oDOM, this.$graphModel.$view)

        return oDOM;
    }

    //https://stackoverflow.com/questions/15181452/how-to-save-export-inline-svg-styled-with-css-from-browser-to-image-file
    private ContainerElements = ["svg", "g"];
    private RelevantStyles = { "rect": ["fill", "stroke", "stroke-width"], "path": ["fill", "stroke", "stroke-width"], "circle": ["fill", "stroke", "stroke-width"], "line": ["stroke", "stroke-width"], "text": ["fill", "font-size", "text-anchor", 'font-family'], "polygon": ["stroke", "fill"] };

    public read_Element(parent: any, OrigData: any) {

        var Children = parent.childNodes;
        var OrigChildDat = OrigData.childNodes;

        for (var cd = 0; cd < Children.length; cd++) {
            var Child = Children[cd];

            var TagName = Child.tagName;
            if (this.ContainerElements.indexOf(TagName) != -1) {
                this.read_Element(Child, OrigChildDat[cd])
            } else if (TagName in this.RelevantStyles) {
                var StyleDef = window.getComputedStyle(OrigChildDat[cd]);

                var StyleString = "";
                for (var st = 0; st < this.RelevantStyles[TagName].length; st++) {
                    StyleString += this.RelevantStyles[TagName][st] + ":" + StyleDef.getPropertyValue(this.RelevantStyles[TagName][st]) + "; ";
                }

                Child.setAttribute("style", StyleString);
            }
        }

    }

    public saveAs(typ: string) {
        typ = typ.toLowerCase();
        if (typ === 'svg') {
            this.exportSVG();
        } else if (typ === 'png') {
            this.exportPNG();
            // } else if (typ === "html") {
            //     this.ExportHTML();

        } else if (typ === "pdf") {
            this.exportPDF();
            // } else if (typ === "eps") {
            // this.ExportEPS();
        }
    }

    public serializeXmlNode(xmlNode: any) {
        if (window['XMLSerializer'] !== undefined) {
            return (new window['XMLSerializer']()).serializeToString(xmlNode);
        }
        if (xmlNode.xml !== undefined) {
            return xmlNode.xml;
        }
        return xmlNode.outerHTML;
    }

    public getSize(): Size {
        let width: number;
        let height: number;
        width = +this.root.getAttribute('width');
        height = +this.root.getAttribute('height');

        return { width: width, height: height };
    }

    public exportPDF(): void {
        if (!window['jsPDF']) {
            console.log('jspdf n.a.');
            return;
        }
        let typ = 'image/svg+xml';
        let xmlNode = this.serializeXmlNode(this.getSvgWithStyleAttributes());
        let url = window.URL.createObjectURL(new Blob([xmlNode], { type: typ }));

        let canvas, context, a, image = new Image();
        let size = this.getSize();

        image.onload = function () {
            canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            let pdf = new window['jsPDF']();

            pdf.addImage(canvas.toDataURL('image/jpeg'), 'jpeg', 15, 40, 180, 160);
            pdf.save('download.pdf');

        };

        image.src = url;
    }
    /*
        Graph.prototype.ExportPDF = function () {
            var converter, pdf = new jsPDF('l','px',[this.model.width, this.model.height]);
            converter = new svgConverter(this.board, pdf, {removeInvalid: false});
            pdf.save('Download.pdf');
        };
        Graph.prototype.ExportEPS = function () {
            var converter, doc = new svgConverter.jsEPS({inverting: true});
            converter = new svgConverter(this.board, doc, {removeInvalid: false});
            doc.save();
        };*/
    public exportPNG(): void {
        let canvas, context, a, image = new Image();
        let xmlNode = this.serializeXmlNode(this.getSvgWithStyleAttributes());
        let typ = 'image/svg+xml';
        let url = window.URL.createObjectURL(new Blob([xmlNode], { type: typ }));

        let size = this.getSize();

        image.onload = function () {
            canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            a = document.createElement('a');
            a.download = 'download.png';
            a.href = canvas.toDataURL('image/png');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        image.src = url;

    }

    public load(json: JSON | Object, owner?: Control): any {
        this.$graphModel = new GraphModel();
        this.$graphModel.init(this);
        this.$graphModel.load(json);
    }

    public clearModel(): void {
        this.$graphModel.removeAllElements();
        this.clearSvgRoot();
    }

    public init(owner: Control, property?: string, id?: string): Control {
        super.init(owner, property, id);
        this.layout();
        return this;
    }

    public propertyChange(entity: Data, property: string, oldValue: any, newValue: any) {
        return;
    }

    public getNextFreePosition(): Point {

        if (!this.$graphModel) {
            return new Point(50, 50);
        }

        let point = new Point(0, 50);

        let maxX = 0;
        let minX = 9000;

        for (let node of this.$graphModel.nodes) {
            maxX = Math.max(maxX, node.getPos().x);
            minX = Math.min(minX, node.getPos().x);
        }

        if (minX > 170) {
            point.x = 10;
        }
        else {
            point.x = maxX + 200;
        }

        return point;
    }

    public addElement(type: string, dontDraw?: boolean): boolean {
        let success = this.$graphModel.addElement(type);
        if (success === true) {
            this.layout(dontDraw);
        }
        return success;
    }

    public addElementWithValues(type: string, optionalValues?: Object, layout?: boolean, dontDraw?: boolean): DiagramElement {
        let element = this.$graphModel.addElementWithValues(type, optionalValues);
        if (element && layout) {
            this.layout(dontDraw);
        }
        return element;
    }

    public layout(dontDraw?: boolean) {
        this.getLayout().layout(this, this.$graphModel);

        if (dontDraw) return;

        this.draw();
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTDRAGOVER, EventBus.ELEMENTDRAGLEAVE, EventBus.ELEMENTDROP];
    }

    public draw() {
        this.clearSvgRoot();
        let model = this.$graphModel;
        let root = this.root;
        let max: Point = new Point();
        if (this.options) {
            max.x = this.options.minWidth || 0;
            max.y = this.options.minHeight || 0;
        }

        for (let node of model.nodes) {
            let svg = node.getSVG();
            EventBus.register(node, svg);
            root.appendChild(svg);

            let temp: number;
            temp = node.getPos().x + node.getSize().x;
            if (temp > max.x) {
                max.x = temp;
            }
            temp = node.getPos().y + node.getSize().y;
            if (temp > max.y) {
                max.y = temp;
            }

        }
        Util.setAttributeSize(this.root, max.x + 60, max.y + 40);

        for (let edge of model.edges) {
            let svg = edge.getSVG();
            EventBus.register(edge, svg);
            root.appendChild(svg);
        }

    }

    public drawElement(element: DiagramElement): void {
        if (!element) {
            return;
        }

        let svg = element.getSVG();
        this.root.appendChild(svg);

        // actualize root width size, if neccessary
        // get current width of root
        let rootSize = this.getSize();
        let newWidth = element.getPos().x + element.getSize().x + 40;
        let newHeight = element.getPos().y + element.getSize().y;

        if (rootSize.width < newWidth) {
            this.root.setAttributeNS(null, 'width', '' + newWidth);
        }

        if (rootSize.height < newHeight) {
            this.root.setAttributeNS(null, 'height', '' + newHeight);
        }

        // draw edge
        if (element instanceof Edge) {
            let edge = <Edge>element;
            edge.redraw(edge.$sNode);
            let srcSvg = element.$sNode.getAlreadyDisplayingSVG();
            let targetSvg = element.$tNode.getAlreadyDisplayingSVG();

            this.root.appendChild(srcSvg);
            this.root.appendChild(targetSvg);
        }

        EventBus.register(element, svg);
    }

    public removeElement(element: DiagramElement): void {
        if (!element) {
            return;
        }

        let alreadyDisplayingSvg = element.getAlreadyDisplayingSVG();
        if (!this.root.contains(alreadyDisplayingSvg)) {
            return;
        }

        this.root.removeChild(element.getAlreadyDisplayingSVG());
    }

    public generate(workspace: string) {
        this.$graphModel.workspace = workspace;

        let data, result = Util.toJson(this.$graphModel);
        data = JSON.stringify(result, null, '\t');
        if (window['java'] && typeof window['java'].generate === 'function') {
            window['java'].generate(data);
        }
    }

    private clearSvgRoot() {
        const root = this.root;
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }

        root.appendChild(this.createPattern());
        let background = Util.createShape({
            tag: 'rect',
            id: 'background',
            width: 5000,
            height: 5000,
            x: 0,
            y: 0,
            stroke: '#999',
            'stroke-width': '1',
            fill: 'url(#raster)'
        });
        root.appendChild(background);
    }

    private getLayout(): Layout {
        if (this.currentlayout) {
            return this.currentlayout;
        }

        let layout = this.options.layout || '';
        if (this.layoutFactory[layout]) {
            this.currentlayout = new this.layoutFactory[layout]();
        } else {
            this.currentlayout = new layouts.DagreLayout();
        }

        return this.currentlayout;
    }

    private initFactories() {

        let noder = nodes;
        this.nodeFactory = {};
        for (let id in noder) {
            if (noder.hasOwnProperty(id) === true) {
                this.nodeFactory[id] = noder[id];
            }
        }

        let edger = edges;
        this.edgeFactory = {};
        for (let id in edger) {
            if (edger.hasOwnProperty(id) === true) {
                this.edgeFactory[id] = edger[id];
            }
        }

        let layouter = layouts;
        this.layoutFactory = {};
        for (let id in layouter) {
            if (layouter.hasOwnProperty(id) === true) {
                this.layoutFactory[id] = layouter[id];
            }
        }
    }

    private initCanvas() {
        if (this.options.canvas) {
            this.canvas = document.getElementById(this.options.canvas);
        }
        if (!this.canvas) {
            this.canvas = document.createElement('div');
            this.canvas.setAttribute('class', 'diagram');
            document.body.appendChild(this.canvas);
        }
    }

    private initFeatures(features: any) {

        if (features) {
            if (features.newedge) {
                EventBus.subscribe(new NewEdge(this), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
            }
            if (features.import) {
                EventBus.subscribe(new ImportFile(this), 'dragover', 'dragleave', 'drop');
            }
            if (features.zoom) {
                let mousewheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
                EventBus.subscribe(new Zoom(), mousewheel);
            }
            if (features.drag) {
                EventBus.subscribe(new Drag(this), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
            }
            if (features.select) {
                EventBus.subscribe(new Select(this), 'click', 'drag');
            }
            if (features.palette) {
                let palette = new Palette(this);
            }
            if (features.toolbar) {
                new Toolbar(this).show();
            }
            if (features.properties) {
                let dispatcher = new PropertiesDispatcher(this);
                dispatcher.dispatch(PropertiesPanel.PropertiesPanel.PropertiesView.Edge);
                EventBus.subscribe(dispatcher, 'dblclick', 'click');
            }
            if (features.addnode) {
                EventBus.subscribe(new AddNode(this), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
            }
        }
    }
}
