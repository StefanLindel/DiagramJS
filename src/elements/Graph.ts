import * as edges from './edges';
import * as nodes from './nodes';
import * as layouts from '../layouts';
import Layout from '../layouts/Layout';
import {GraphModel} from '../elements/Model';
import Palette from '../Palette';
import {Size, Point} from './BaseElements';
import {Util} from '../util';
import {Control} from '../Control';
import Data from '../Data';
import {EventBus} from '../EventBus';
import {Editor, Drag, Select, Zoom, NewEdge} from '../handlers';
import Options from '../Options';
import {ImportFile} from '../handlers/ImportFile';

export class Graph extends Control {
    root: HTMLElement;
    canvas: Element;
    $graphModel: GraphModel;
    options: Options;
    canvasSize: Size;
    nodeFactory: Object;
    edgeFactory: Object;
    layoutFactory: Object;
    private currentlayout: Layout;

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
        EventBus.register(this,  this.root);
    }

    private static createPattern(): Element {
        const defs = Util.createShape({tag: 'defs'});
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
        pattern.appendChild(cross);
        defs.appendChild(pattern);
        return defs;
    }

    public load(json: JSON | Object, owner ?: Control): any {
        this.$graphModel = new GraphModel();
        this.$graphModel.init(this);
        this.$graphModel.load(json);
    }

    public clearModel(): void {
        this.$graphModel.removeAllElements();
        this.clearCanvas();
    }

    public init(owner: Control, property?: string, id?: string): Control {
        super.init(owner, property, id);
        this.layout();
        return this;
    }

    public propertyChange(entity: Data, property: string, oldValue: any, newValue: any) {
        return;
    }

    public addElement(type: string): boolean {
        let success = this.$graphModel.addElement(type);
        if (success === true) {
            this.layout();
        }
        return success;
    }

    public layout() {
        this.getLayout().layout(this, this.$graphModel);
        this.draw();
    }

    public reLayout(): void {
        this.getLayout().layout(this, this.$graphModel);
        console.log('ReLayout');
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTDRAGOVER, EventBus.ELEMENTDRAGLEAVE, EventBus.ELEMENTDROP];
    }

    public draw() {
        this.clearCanvas();
        const model = this.$graphModel;
        const canvas = this.canvas;
        let max: Point = new Point();

        if (model.nodes) {
            for (let id in model.nodes) {
                let node = model.nodes[id];
                let svg = node.getSVG();
                EventBus.register(node, svg);
                canvas.appendChild(svg);

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
        }
        Util.setSize(this.canvas, max.x, max.y);
        if (model.edges) {
            for (let id in model.edges) {
                let edge = model.edges[id];
                let svg = edge.getSVG();
                EventBus.register(edge, svg);
                canvas.appendChild(svg);
            }
        }
    }

    private clearCanvas() {
        const canvas = this.canvas;
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }

        canvas.appendChild(Graph.createPattern());
        const background = Util.createShape({
            tag: 'rect',
            id: 'background',
            width: 5000,
            height: 5000,
            x: -1500,
            y: -1500,
            stroke: '#999',
            'stroke-width': '1',
            fill: 'url(#raster)'
        });
        canvas.appendChild(background);
        canvas.appendChild(this.$graphModel.getSVG());
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
            this.root = document.getElementById(this.options.canvas);
        }
        if (!this.root) {
            this.root = document.createElement('div');
            this.root.setAttribute('class', 'diagram');
            document.body.appendChild(this.root);
        }
        EventBus.subscribe(new ImportFile(this), 'dragover', 'dragleave', 'drop');
    }

    private initFeatures(features: any) {
        if (features) {
            if (features.zoom) {
                let mousewheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
                EventBus.subscribe(new Zoom(), mousewheel);
            }
            if (features.editor) {
                EventBus.subscribe(new Editor(this), 'dblclick', 'editor');
            }
            if (features.drag) {
                EventBus.subscribe(new Drag(this), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
            }
            if (features.select) {
                EventBus.subscribe(new Select(this.$graphModel), 'click', 'drag');
            }
            if (features.palette) {
                let palette = new Palette(this);
            }
        }

        EventBus.subscribe(new NewEdge(this), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
    }
}
