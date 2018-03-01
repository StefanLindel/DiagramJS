import {DiagramElement} from '../BaseElements';
import {Association} from '../edges';
import { GraphModel } from '..';

export class Node extends DiagramElement {
    public $edges: Association[] = [];
    public $minWidth: number = 150;
    public $minheight: number = 25;
    public $defaulEdgeType : string;

    public label: string;

    constructor(data: JSON|string|Object|any) {
        super();

        // default size
        this.withSize(this.$minWidth, this.$minheight);

        if (data) {
            if (data['x'] && data['y']) {
                this.withPos(data['x'], data['y']);
            }
            if (data['width'] || data['height']) {
                this.withSize(data['width'], data['height']);
            }
            if (data['label']) {
                this.label = data['label'];
            }
        }
    }

    public getSVG(): Element {
        const pos = this.getPos();
        const size = this.getSize();

        const attr = {
            tag: 'rect',
            x: pos.x - size.x / 2,
            y: pos.y - size.y / 2,
            rx: 4,
            ry: 4,
            height: size.y,
            width: size.x,
            style: 'fill:white;stroke:black;stroke-width:2'
        };
        const shape = this.createShape(attr);

        const attrText = {
            tag: 'text',
            x: pos.x,
            y: pos.y,
            'text-anchor': 'middle',
            'alignment-baseline': 'middle',
            'font-family': 'Verdana',
            'font-size': '14',
            fill: 'black'
        };
        let text = this.createShape(attrText);
        text.textContent = this.id;

        let group = this.createShape({tag: 'g', id: this.id});
        group.appendChild(shape);
        group.appendChild(text);

        return group;
    }

    public copy(): Node { 
        let copy: Node; 
 
        // create new id 
        let model = <GraphModel>this.$owner || <GraphModel>this.getRoot(); 
        if (model) { 
            let type = this.property || Node.name; 
            let newId = model.getNewId(type); 
            copy = <Node>model.createElement(type, newId, null);
            copy.withSize(this.getSize().x, this.getSize().y);
            copy.$owner = model;
        } else { 
            copy.id = this.id + '-copy'; 
            copy.$owner = this.getRoot(); 
        } 
 
        return copy; 
    } 

    public redrawEdges() {
        for (let edge of this.$edges) {
            edge.redraw(this);
        }
    }
}
