import { Node } from './Node';
import { EventBus } from '../../EventBus';
import { Util } from '../../util';
import { Point } from '../BaseElements';
import Attribute from './Attribute';
import Method from './Method';
import { Size } from '../index';
import ClazzProperty from './ClazzProperty';
import {SymbolLibary} from './Symbol';
import {StereoType} from "./StereoType";

export class Clazz extends Node {
    public attributes: Attribute[] = [];
    public methods: Method[] = [];
    public modifier: string;
    public stereoType: string;

    protected $attrHeight = 25;
    protected $attrFontSize = 12;
    protected $labelView: Element;

    constructor(json: JSON | string | Object | any) {
        super(json);
        return this;
    }

    public load(json?: any) {
        if (!json) {
            json = {};
        }
        let y = this.$labelHeight;
        let labelObj = json.name || json.id || ('New ' + this.property);

        let width: number = 150;
        width = Math.max(width, Util.sizeOf(labelObj).width + 60);

        if (json['attributes']) {
            for (let attr of json['attributes']) {

                let attrObj = new Attribute(attr);
                attrObj.$owner = this;
                this.attributes.push(attrObj);
                y += this.$attrHeight;
                width = Math.max(width, Util.sizeOf(attrObj.toString()).width);
            }
        }
        if (json['stereotype']) {
            this.stereoType = json['stereotype'];
        }
        if (json['methods']) {
            for (let method of json['methods']) {

                let methodObj = new Method(method);
                methodObj.$owner = this;
                this.methods.push(methodObj);

                y += this.$attrHeight;
                width = Math.max(width, Util.sizeOf(methodObj.toString()).width);
            }
            y += this.$attrHeight;
        }
        this.withSize(width, y);
    }

    public getAttributes(): Attribute[] {
        return this.attributes;
    }

    public getMethods(): Method[] {
        return this.methods;
    }

    public getToolBarIcon(): Element {
        let icon = SymbolLibary.draw({type: 'Clazz', property: 'HTML', width: '50', height: '50', transform: 'translate(-26,-21)'});
        return icon;
        // let group = this.createShape(
//    abstract: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Abstract</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
//    interface: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Interface</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
    }

    public getSVG(): Element {
        const pos: Point = this.getPos();
        const size: Point = this.getSize();

        let group = this.createShape({ tag: 'g', id: this.id, class: 'SVGClazz', transform: 'translate(0 0)' });

        if (this.stereoType) {
            let type = new StereoType(this.stereoType, pos.x, pos.y);
            group.appendChild(type.getSVG());
        }

        // Full Shape
        let options = null;
        let style;
        let clazzName;
        if (this.$owner['options']) {
            let options = this.$owner['options'];
            if (options) {
                style = options.style;
            }
        }
        // = = = Background = = =
        if (style === 'modern') {
            clazzName = 'ClazzHeader';
        }
        clazzName = 'ClazzHeader';
        const nodeShape = this.createShape({
            tag: 'rect',
            x: pos.x,
            y: pos.y,
            height: size.y,
            width: size.x,
            rx: 5,
            ry: 5,
            fill: 'none',
            stroke: 'black',
            'stroke-width': 1
        });
        if (clazzName) {
            nodeShape.setAttribute('className', clazzName);
            let styleHeader = Util.getStyle('ClazzHeader');
            // headerHeight = styleHeader.getNumber('height');
        }

        // = = = LABEL = = =
        let label = this.createShape({
            tag: 'text',
            x: pos.x + size.x / 2,
            y: pos.y + this.$labelHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': this.$labelFontSize,
            fill: 'black'
        });
        label.textContent = this.id;
        this.$labelView = label;

        group.appendChild(nodeShape);
        group.appendChild(label);

        // = = = ATTRIBUTES = = =
        if (this.attributes.length > 0) {

            // line to separate label from attributes
            const separatorLabelAttr = this.createShape({
                tag: 'line',
                x1: pos.x,                   // line doesn't overlap the full shape
                y1: pos.y + this.$labelHeight,
                x2: pos.x + size.x,        // line doesn't overlap the full shape
                y2: pos.y + this.$labelHeight,
                'stroke-width': 1
            });

            group.appendChild(separatorLabelAttr);

            let groupOfAttributes = this.createShape({ tag: 'g', id: (this.id + 'Attributes') });
            groupOfAttributes.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzAttribute');
            group.appendChild(groupOfAttributes);

            let y = pos.y + this.$labelHeight + this.$attrHeight / 2;
            for (let attr of this.attributes) {

                let attrSvg = attr.getSVG();
                attr.$owner = this;

                attrSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                attrSvg.setAttributeNS(null, 'y', '' + y);

                groupOfAttributes.appendChild(attrSvg);
                y += this.$attrHeight;
            }
        }

        // = = = METHODS = = =
        let height = this.attributes.length * this.$attrHeight;
        let y = pos.y + this.$labelHeight + height + this.$attrHeight / 2;
        if (this.methods.length > 0) {

            // line to separate label from attributes
            const separatorAttrMethods = this.createShape({
                tag: 'line',
                x1: pos.x,                   // line doesn't overlap the full shape
                y1: pos.y + this.$labelHeight + (this.$attrHeight * this.attributes.length),
                x2: pos.x + size.x,        // line doesn't overlap the full shape
                y2: pos.y + this.$labelHeight + (this.$attrHeight * this.attributes.length),
                'stroke-width': 1
            });

            group.appendChild(separatorAttrMethods);

            let groupOfMethods = this.createShape({ tag: 'g', id: (this.id + 'Methods') });
            groupOfMethods.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzMethod');
            group.appendChild(groupOfMethods);

            y += this.$attrHeight / 2;
            for (let method of this.methods) {

                let methodSvg = method.getSVG();
                method.$owner = this;

                methodSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                methodSvg.setAttributeNS(null, 'y', '' + y);

                groupOfMethods.appendChild(methodSvg);
                y += this.$attrHeight;
            }
        }

        this.$view = group;
        return group;
    }

    public copy(): Clazz {
        let copy: Clazz;
        copy = <Clazz>super.copy();

        // copy label
        copy.id = this.id + 'Copy';

        // copy attributes
        this.attributes.forEach(attr => {
            copy.attributes.push(new Attribute(attr.toString()));
        });
        // copy methods
        this.methods.forEach(method => {
            copy.methods.push(new Method(method.toString()));
        });
        copy.reCalcSize();

        return copy;
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTMOUSEDOWN, EventBus.ELEMENTMOUSEMOVE, EventBus.ELEMENTCLICK,
                EventBus.ELEMENTDRAG, EventBus.ELEMENTDBLCLICK, EventBus.OPENPROPERTIES, EventBus.RELOADPROPERTIES];
    }

    public addProperty(value: string, type: string): any {
        if (!this[type] || !value || value.length === 0) {
            return;
        }

        let extractedValue;
        if (type === 'attributes') {
            extractedValue = new Attribute(value);
        }
        else if (type === 'methods') {
            extractedValue = new Method(value);
        }

        for (let valueOfType of this[type]) {
            if (valueOfType.toString() === extractedValue.toString()) {
                alert(extractedValue.toString() + ' already exists.');
                extractedValue = undefined;
                return;
            }
        }

        this[type].push(extractedValue);

        Util.saveToLocalStorage(this.$owner);

        return extractedValue;
    }

    public addAttribute(value: string): Attribute {
        return this.addProperty(value, 'attributes');
    }

    public addAttributeObj(attr: Attribute): Attribute[] {
        this.attributes.push(attr);
        return this.getAttributes();
    }

    public addMethodObj(method: Method): Method[] {
        this.methods.push(method);
        return this.getMethods();
    }

    public addMethod(value: string): Method {
        return this.addProperty(value, 'methods');
    }

    public removeAttribute(attr: Attribute): void {
        let idx = this.attributes.indexOf(attr);
        this.attributes.splice(idx, 1);
    }

    public removeMethod(method: Method): void {
        let idx = this.methods.indexOf(method);
        this.methods.splice(idx, 1);
    }

    public removeProperty(property: ClazzProperty): void {

        if (property instanceof Attribute) {
            this.removeAttribute(<Attribute>property);
        }

        if (property instanceof Method) {
            this.removeMethod(<Method>property);
        }

        Util.saveToLocalStorage(this.$owner);
    }

    public reDraw(drawOnlyIfSizeChanged?: boolean): void {
        let hasSizeChanged: [boolean, Size] = this.hasSizeChanged();

        if (drawOnlyIfSizeChanged) {
            if (!hasSizeChanged[0]) {
                return;
            }
        }

        if (!this.$view) {
            return;
        }

        // redraw only this clazz
        this.$owner.$view.removeChild(this.$view);
        let newSvg = this.getSVG();
        this.$owner.$view.appendChild(newSvg);
        this.$view = newSvg;
        EventBus.register(this, newSvg);

        this.redrawEdges();
    }

    public hasSizeChanged(): [boolean, Size] {
        let oldSize = { width: this.getSize().x, height: this.getSize().y };
        let newSize = this.reCalcSize();

        // size doenst changed, so nothing to redraw
        if (oldSize.width === newSize.width && oldSize.height === newSize.height) {
            return [false, newSize];
        }

        return [true, newSize];
    }

    public updateLabel(newLabel: string): void {
        if (this.$labelView) {
            this.$labelView.textContent = newLabel;
        }

        // update label in all edges
        this.$edges.forEach(edge => {
            if (this.id === edge.$sNode.id) {
                edge.source = newLabel;
            }
            else if (this.id === edge.$tNode.id) {
                edge.target = newLabel;
            }
        });

        Util.saveToLocalStorage(this.$owner);

        this.reDraw(true);
    }

    public updateModifier(modifier: string): void {
        this.modifier = modifier;

        Util.saveToLocalStorage(this.$owner);
    }

    public reCalcSize(): Size {
        // label
        let newWidth = 150;
        newWidth = Math.max(newWidth, Util.sizeOf(this.id).width + 30);

        // attributes
        this.attributes.forEach(attrEl => {

            let widthOfAttr;
            if (attrEl.$view) {
                widthOfAttr = attrEl.$view.getBoundingClientRect().width;
            }
            else {
                widthOfAttr = Util.sizeOf(attrEl.toString()).width;
            }

            newWidth = Math.max(newWidth, widthOfAttr + 15);
        });

        // methods
        this.methods.forEach(methodEl => {
            let widthOfMethod;
            if (methodEl.$view) {
                widthOfMethod = methodEl.$view.getBoundingClientRect().width;
            }
            else {
                widthOfMethod = Util.sizeOf(methodEl.toString()).width;
            }

            newWidth = Math.max(newWidth, widthOfMethod + 15);
        });

        // TODO: height has to be calculated by font-size
        this.getSize().x = newWidth;
        this.getSize().y = this.$labelHeight + ((this.attributes.length + this.methods.length) * this.$attrHeight)
            + this.$attrHeight;

        let newSize = { width: newWidth, height: this.getSize().y };

        return newSize;
    }

    public redrawEdges() {
        for (let edge of this.$edges) {
            edge.redraw(this);
        }
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
