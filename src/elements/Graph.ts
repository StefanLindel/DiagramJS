import * as edges from './edges';
import { Edge } from './edges';
import * as nodes from './nodes';
import * as layouts from '../layouts';
import Layout from '../layouts/Layout';
import { GraphModel } from './Model';
import Palette from '../Palette';
import * as PropertiesPanel from '../PropertiesPanel';
import { Point, Size } from './BaseElements';
import { Util } from '../util';
import { Control } from '../Control';
import Data from '../Data';
import { EventBus } from '../EventBus';
import { AddNode, Drag, NewEdge, PropertiesDispatcher, Select, Zoom } from '../handlers';
import Options from '../Options';
import { ImportFile } from '../handlers/ImportFile';
import { SymbolLibary } from './nodes/Symbol';
import { CSS } from '../CSS';
import { DiagramElement } from './index';
import { Toolbar } from '../Toolbar';

export class Graph extends Control {
    // canvas: HTMLElement;
    root: SVGElement;
    $graphModel: GraphModel;
    options: Options;
    canvasSize: Size;
    nodeFactory: Object;
    edgeFactory: Object;
    layoutFactory: Object;
    private currentlayout: Layout;
    private layerToolBar: SVGSVGElement;
    // https://stackoverflow.com/questions/15181452/how-to-save-export-inline-svg-styled-with-css-from-browser-to-image-file
    private containerElements = ['svg', 'g'];
    private relevantStyles = {
        'rect': ['fill', 'stroke', 'stroke-width'],
        'path': ['fill', 'stroke', 'stroke-width', 'opacity'],
        'circle': ['fill', 'stroke', 'stroke-width'],
        'line': ['stroke', 'stroke-width'],
        'text': ['fill', 'font-size', 'text-anchor', 'font-family'],
        'polygon': ['stroke', 'fill']
    };

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
        this.initFeatures(this.options.features);

        // load previous session, if user wants it
        // otherwise load the json data
        if(!this.lookupInLocalStorage()){
            this.load(json);
        }

        EventBus.register(this, this.$view);
    }

    public lookupInLocalStorage(): boolean {
        if (!Util.isLocalStorageSupported()) {
            return false;
        }
        let diagram = Util.getDiagramFromLocalStorage();
        if (diagram && diagram.length > 0) {
            if (confirm('Restore previous session?')) {
                let jsonData: JSON = JSON.parse(diagram);
                this.load(jsonData);
                return true;
            }
        }
        
        return false;
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
        this.save('image/svg+xml', this.serializeXmlNode(wellFormatedSvgDom), 'class_diagram.svg');
    }

    public getSvgWithStyleAttributes(): Node {
        let oDOM = this.$graphModel.$view.cloneNode(true);
        this.readElement(oDOM, this.$graphModel.$view);

        return oDOM;
    }

    public readElement(parent: any, origData: any) {
        let children = parent.childNodes;
        let origChildDat = origData.childNodes;

        for (let cd = 0; cd < children.length; cd++) {
            let child = children[cd];

            let tagName = child.tagName;
            if (this.containerElements.indexOf(tagName) !== -1) {
                this.readElement(child, origChildDat[cd]);
            } else if (tagName in this.relevantStyles) {
                let styleDef = window.getComputedStyle(origChildDat[cd]);

                let styleString = '';
                for (let st = 0; st < this.relevantStyles[tagName].length; st++) {
                    styleString += this.relevantStyles[tagName][st] + ':' + styleDef.getPropertyValue(this.relevantStyles[tagName][st]) + '; ';
                }

                child.setAttribute('style', styleString);
            }
        }

    }

    public saveAs(typ: string) {
        typ = typ.toLowerCase();
        if (typ === 'svg') {
            this.exportSVG();
        } else if (typ === 'png') {
            this.exportPNG();
            // } else if (typ === 'html') {
            //     this.ExportHTML();

        } else if (typ === 'pdf') {
            this.exportPDF();
            // } else if (typ === 'eps') {
            // this.ExportEPS();
        }
        else if (typ === 'json') {
            this.exportJson();
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

    public exportJson(): void {
        let typ = 'text/plain';
        let jsonObj = Util.toJson(this.$graphModel);
        let data = JSON.stringify(jsonObj, null, '\t');

        this.save(typ, data, 'class_diagram.json');
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
            pdf.save('class_diagram.pdf');

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
            a.download = 'class_diagram.png';
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
        if (Util.isParentOfChild(this.root, alreadyDisplayingSvg)) {
            this.root.removeChild(alreadyDisplayingSvg);
        }
    }

    public generate(workspace: string) {
        this.$graphModel.workspace = workspace;

        let data, result = Util.toJson(this.$graphModel);
        data = JSON.stringify(result, null, '\t');
        if (window['java'] && typeof window['java'].generate === 'function') {
            window['java'].generate(data);
        }
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

    private clearSvgRoot() {
        const root = this.root;
        this.$graphModel.$view.dispatchEvent(Util.createCustomEvent('click'));
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

        // delete inline Edit, if exists
        let inlineEdit = document.getElementById('inlineEdit');
        if (inlineEdit && document.body.contains(inlineEdit)) {
            document.body.removeChild(inlineEdit);
        }
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
            this.$view = document.getElementById(this.options.canvas);
        }
        if (!this.$view) {
            this.$view = document.createElement('div');
            this.$view.setAttribute('class', 'diagram');
            document.body.appendChild(this.$view);
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
                EventBus.subscribe(new Zoom(this), mousewheel);
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
                dispatcher.dispatch(PropertiesPanel.PropertiesPanel.PropertiesView.Clear);
                EventBus.subscribe(dispatcher, 'dblclick', 'click', EventBus.RELOADPROPERTIES);
            }
            if (features.addnode) {
                EventBus.subscribe(new AddNode(this), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
            }
        }
    }
}
