import {Node} from './Node';
import {EventBus} from '../../EventBus';
import {Util} from '../../util';
import {Point} from '../BaseElements';

export class Clazz extends Node {
    protected labelHeight = 25;
    protected labelFontSize = 14;
    protected attrHeight = 25;
    protected attrFontSize = 12;
    private attributes: string[] = [];
    private methods: string[] = [];
    private style: string;

    constructor(json:JSON|string|Object|any) {
        super(json);
        if (!json) {
            json = {};
        }
        let y = this.labelHeight;
        this.label = json.name || json.label || ('New ' + this.property);
        this.style = json.style || 'flat';

        if (json['attributes']) {
            for (let attr of json['attributes']) {
                this.attributes.push(attr);
                y += this.attrHeight;
            }
        }
        if (json['methods']) {
            for (let method of json['methods']) {
                this.methods.push(method);
                y += this.attrHeight;
            }
            y += this.attrHeight;
        }
        this.withSize(150, y);
        return this;
    }

    public getSVG(): Element {
        if (this.style === 'modern') {
            return this.getModernStyle();
        }
        const pos: Point = this.getPos();
        const size: Point = this.getSize();

        // Full Shape
        const nodeShape = this.createShape({
            tag: 'rect',
            x: pos.x,
            y: pos.y,
            height: size.y,
            width: size.x,
            rx: 1,
            ry: 1,
            style: 'fill:white;stroke-width:2',
            stroke: 'black'
        });

        const edgeCreator = this.createShape({
            tag : 'rect',
            x: (pos.x+size.x)-2,
            y: pos.y-6,
            height: 8,
            width: 8,
            rx: 1,
            ry: 1,
            style: 'stroke-width:2',
            fill : 'black',
            stroke: 'black'
        });

        
        // line to separate label from attributes
        const separatorLabelAttr = this.createShape({
            tag : 'line',
            x1 : pos.x,                   //line doesn't overlap the full shape
            y1 : pos.y + this.labelHeight,
            x2 : pos.x + size.x,        //line doesn't overlap the full shape
            y2 : pos.y + this.labelHeight,
            stroke : 'rgb(0, 0, 0)',        //black
            'stroke-width' : 2
        });

        // line to separate label from attributes
        const separatorAttrMethods = this.createShape({
            tag : 'line',
            x1 : pos.x,                   //line doesn't overlap the full shape
            y1 : pos.y + this.labelHeight + (this.attrHeight * this.attributes.length),
            x2 : pos.x + size.x,        //line doesn't overlap the full shape
            y2 : pos.y + this.labelHeight + (this.attrHeight * this.attributes.length),
            stroke : 'rgb(0, 0, 0)',        //black
            'stroke-width' : 2
        });


        // = = = LABEL = = =
        let label = this.createShape({
            tag: 'text',
            x: pos.x + size.x / 2,
            y: pos.y + this.labelHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': this.labelFontSize,
            'font-weight': 'bold',
            fill: 'black'
        });
        label.textContent = this.label;

        let group = this.createShape({tag: 'g', id: this.id, transform: 'translate(0 0)'});
        group.appendChild(nodeShape);
        group.appendChild(edgeCreator);
        group.appendChild(separatorLabelAttr);
        group.appendChild(separatorAttrMethods);
        group.appendChild(label);

        // = = = ATTRIBUTES = = =
        if (this.attributes.length > 0) {
            let y = pos.y + this.labelHeight + this.attrHeight / 2;
            for (let element of this.attributes) {
                const attrText = {
                    tag: 'text',
                    x: pos.x + 10,
                    y: y,
                    'text-anchor': 'start',
                    'alignment-baseline': 'middle',
                    'font-family': 'Verdana',
                    'font-size': this.attrFontSize,
                    fill: 'black'
                };
                let text = this.createShape(attrText);
                text.textContent = element;
                group.appendChild(text);
                y += this.attrHeight;
            }
        }

        // = = = METHODS = = =
        let height = this.attributes.length * this.attrHeight;
        let y = pos.y + this.labelHeight + height + this.attrHeight / 2;
        if (this.methods.length > 0) {
            y += this.attrHeight / 2;
            for (let element of this.methods) {
                const attrText = {
                    tag: 'text',
                    x: pos.x + 10,
                    y: y,
                    'text-anchor': 'start',
                    'alignment-baseline': 'middle',
                    'font-family': 'Verdana',
                    'font-size': this.attrFontSize,
                    fill: 'black'
                };
                let text = this.createShape(attrText);
                text.textContent = element;
                group.appendChild(text);
                y += this.attrHeight;
            }
        }

        this.$view = group;
        return group;
    }

    public getNipple() : string{
        return "Nippel wurden aktiviert!";
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTMOUSEDOWN, EventBus.ELEMENTMOUSEMOVE, EventBus.ELEMENTCLICK, EventBus.ELEMENTDRAG, EventBus.ELEMENTDBLCLICK, EventBus.EDITOR];
    }

    public getPropertyAsString(type: string): string {
        let value = '';
        if (this[type]) {
            for (let property of this[type]) {
                value += property + '\n';
            }
        }
        return value;
    }

    // returns true if new properties are different from old ones
    public convertStringToProperty(values: string, type: string): boolean {
        if (!this[type]) {
            return false;
        }

        let properties = values.split(/\r?\n/);
        let newProperties: string[] = [];
        for (let property of properties) {
            if (property && property.length > 0) {
                newProperties.push(property);
            }
        }

        let changed = false;
        if (this[type].length !== newProperties.length) {
            changed = true;
        }
        else {
            for (let i = 0; i < this[type].length; i++) {
                if (!this[type][i] || !newProperties[i] || this[type][i] !== newProperties[i]) {
                    changed = true;
                }
            }
        }

        if (changed) {
            this[type] = newProperties;
            this.getSize().y = this.labelHeight + (this.attributes.length + this.methods.length) * this.attrHeight;
        }
        return changed;
    }

    private getModernStyle(): Element {
        let width, height, id, size, z, item, rect, g, board, styleHeader, headerHeight, x, y;
        board = this.getRoot()['board'];
        styleHeader = Util.getStyle('ClazzHeader');
        headerHeight = styleHeader.getNumber('height');
        width = 0;
        height = 10 + headerHeight;

        if (this.property === 'Object' || this.getRoot()['$graphModel'].getType().toLowerCase() === 'objectdiagram') {
            id = this.id.charAt(0).toLowerCase() + this.id.slice(1);
            item = 'Object';
        } else {
            id = this.id;
            item = 'Clazz';
            if (this['counter']) {
                id += ' (' + this['counter'] + ')';
            }
        }
        g = Util.create({tag: 'g', model: this});
        size = Util.sizeOf(id, this);
        width = Math.max(width, size.width);
        if (this.attributes && this.attributes.length > 0) {
            height = height + this.attributes.length * 25;
            for (z = 0; z < this.attributes.length; z += 1) {
                width = Math.max(width, Util.sizeOf(this.attributes[z], this).width);
            }
        } else {
            height += 20;
        }
        if (this.methods && this.methods.length > 0) {
            height = height + this.methods.length * 25;
            for (z = 0; z < this.methods.length; z += 1) {
                width = Math.max(width, Util.sizeOf(this.methods[z], this).width);
            }
        }
        width += 20;

        let pos = this.getPos();
        y = pos.y;
        x = pos.x;

        rect = {
            tag: 'rect',
            'width': width,
            'height': height,
            'x': x,
            'y': y,
            'class': item + ' draggable',
            'fill': 'none'
        };
        g.appendChild(Util.create(rect));
        g.appendChild(Util.create({
            tag: 'rect',
            rx: 0,
            'x': x,
            'y': y,
            height: headerHeight,
            'width': width,
            'class': 'ClazzHeader'
        }));

        item = Util.create({
            tag: 'text',
            $font: true,
            'class': 'InfoText',
            'text-anchor': 'right',
            'x': x + width / 2 - size.width / 2,
            'y': y + (headerHeight / 2) + (size.height / 2),
            'width': size.width
        });

        if (this.property === 'Object' || this.getRoot()['$graphModel'].type.toLowerCase() === 'objectdiagram') {
            item.setAttribute('text-decoration', 'underline');
        }
        item.appendChild(document.createTextNode(id));

        g.appendChild(item);
        g.appendChild(Util.create({
            tag: 'line',
            x1: x,
            y1: y + headerHeight,
            x2: x + width,
            y2: y + headerHeight,
            stroke: '#000'
        }));
        y += headerHeight + 20;

        if (this.attributes) {
            for (z = 0; z < this.attributes.length; z += 1) {
                g.appendChild(Util.create({
                    tag: 'text',
                    $font: true,
                    'text-anchor': 'left',
                    'width': width,
                    'x': (x + 10),
                    'y': y,
                    value: this.attributes[z]
                }));
                y += 20;
            }
            if (this.attributes.length > 0) {
                y -= 10;
            }
        }
        if (this.methods && this.methods.length > 0) {
            g.appendChild(Util.create({tag: 'line', x1: x, y1: y, x2: x + width, y2: y, stroke: '#000'}));
            y += 20;
            for (z = 0; z < this.methods.length; z += 1) {
                g.appendChild(Util.create({
                    tag: 'text',
                    $font: true,
                    'text-anchor': 'left',
                    'width': width,
                    'x': x + 10,
                    'y': y,
                    value: this.methods[z]
                }));
                y += 20;
            }
        }
        return g;
    }
}
