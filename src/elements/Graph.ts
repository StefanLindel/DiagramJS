import * as edges from './edges';
import * as nodes from './nodes';
import * as layouts from '../layouts';
import Layout from '../layouts/Layout';
import Model from '../elements/Model';
import Options from '../Options';
import Palette from '../Palette';
import {Size, Point} from './BaseElements';
import {util} from '../util';
import {Control} from "../Control";
import Data from "../Data";
import {EventBus} from "../EventBus";
import { Editor, Drag, Select, Zoom } from '../handlers';

export default class Graph extends Control {
    root: HTMLElement;
    canvas: Element;
    model: Model;
    options: Options;
    canvasSize: Size;
    nodeFactory: Object;
    edgeFactory: Object;
    layoutFactory: Object;

    constructor(json:any, options:Options) {
        super();
        json = json || {};
        this.options = options || {};
        if (json["init"]) {
            return;
        }
        if (!this.options.origin) {
            this.options.origin = new Point(150, 45);
        }
        this.initFactories();
        this.initCanvas();
        this.model = new Model(json);
        this.model.init(this);
        this.initFeatures(this.options.features);
    }

    public init(owner:Control, property?: string, id?: string) :Control{
        super.init(owner, property, id);
        this.layout();
        return this;
    }

    public propertyChange(entity: Data, property: string, oldValue, newValue) {

    }

    public addElement(type: string): boolean {
        let success = this.model.addElement(type);
        if (success === true) {
            this.layout();
        }
        return success;
    }

    public layout() {
        this.getLayout().layout(this, this.model);
        this.draw();
    }

    public draw() {
        this.clearCanvas();
        const model = this.model;
        const canvas = this.canvas;
        let max: Point = new Point();


        if (model.nodes) {
            for (let id in model.nodes) {
                let node = model.nodes[id];
                let svg = node.getSVG();
                //FIXME EventBus.registerSVG(svg);
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
        util.setSize(this.canvas, max.x, max.y);
        if (model.edges) {
            for (let id in model.edges) {
                let edge = model.edges[id];
                let svg = edge.getSVG();
                //FIXME EventBus.registerSVG(svg);
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
        const background = util.createShape({
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
        canvas.appendChild(this.model.getSVG());
    }

    private static createPattern(): Element {
        const defs = util.createShape({tag: 'defs'});
        const pattern = util.createShape({
            tag: 'pattern',
            id: 'raster',
            patternUnits: 'userSpaceOnUse',
            width: 40,
            height: 40
        });
        const path = 'M0 4 L0 0 L4 0 M36 0 L40 0 L40 4 M40 36 L40 40 L36 40 M4 40 L0 40 L0 36';
        const cross = util.createShape({
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

    private getLayout(): Layout {
        let layout = this.options.layout || '';
        if (this.layoutFactory[layout]) {
            return new this.layoutFactory[layout]();
        }
        return new layouts.DagreLayout();
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
    }

    private initFeatures(features) {
        if (features) {
            if (features.zoom) {
                let mousewheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
                EventBus.subscribe(new Zoom(), mousewheel);
            }
            if (features.editor) {
                EventBus.subscribe(new Editor(this), 'dblclick', 'editor');
            }
            if (features.drag) {
                EventBus.subscribe(new Drag(), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
            }
            if (features.select) {
                 EventBus.subscribe(new Select(this.model), 'click', 'drag');
            }
            if (features.palette) {
                new Palette(this);
            }
        }
    }
}
