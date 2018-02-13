import { Point } from '../BaseElements';
import { Clazz } from "./index";

export class StereoType extends Clazz {

    protected stereoType: string;
    protected $stereoTypeView: Element;

    constructor(data: JSON | any) {
        super(data);


        this.withSize(this.getSize().x, (this.getSize().y + this.$labelHeight / 2));
    }

    public getSVG(): Element {

        let pos: Point = this.getPos();
        let size: Point = this.getSize();

        // Full Shape
        const nodeShape = this.createShape({
            tag: 'rect',
            x: pos.x,
            y: pos.y,
            height: size.y,
            width: size.x,
            rx: 10,
            ry: 10
        });

        // = = = STEREOTYPE = = =
        let stereoType = this.createShape({
            tag: 'text',
            x: pos.x + size.x / 2,
            y: pos.y + this.$labelHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': 10,
            'font-weight': 'bold',
            fill: 'black'
        });
        stereoType.textContent = this.stereoType;
        this.$stereoTypeView = stereoType;

        // = = = LABEL = = =
        let label = this.createShape({
            tag: 'text',
            x: pos.x + size.x / 2,
            y: pos.y + this.$labelHeight,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': this.$labelFontSize,
            'font-weight': 'bold',
            fill: 'black'
        });
        label.textContent = this.label;
        this.$labelView = label;

        let group = this.createShape({ tag: 'g', id: this.id, class: 'SVGClazz', transform: 'translate(0 0)' });
        group.appendChild(nodeShape);
        group.appendChild(stereoType);
        group.appendChild(label);

        // = = = ATTRIBUTES = = =
        if (this.attributes.length > 0) {


            // line to separate label from attributes
            const separatorLabelAttr = this.createShape({
                tag: 'line',
                x1: pos.x,                   //line doesn't overlap the full shape
                y1: pos.y + this.$labelHeight + (this.$labelHeight / 2),
                x2: pos.x + size.x,        //line doesn't overlap the full shape
                y2: pos.y + this.$labelHeight + (this.$labelHeight / 2),
                'stroke-width': 1
            });


            group.appendChild(separatorLabelAttr);

            let groupOfAttributes = this.createShape({ tag: 'g', id: (this.id + 'Attributes') });
            groupOfAttributes.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzAttribute');
            group.appendChild(groupOfAttributes);

            let y = pos.y + this.$labelHeight + (this.$labelHeight / 2) + (this.$attrHeight / 2);
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
        let y = pos.y + (this.$labelHeight * 1.5) + height + this.$attrHeight / 2;
        if (this.methods.length > 0) {

            // line to separate label from attributes
            const separatorAttrMethods = this.createShape({
                tag: 'line',
                x1: pos.x,                   //line doesn't overlap the full shape
                y1: pos.y + (this.$labelHeight * 1.5) + (this.$attrHeight * this.attributes.length),
                x2: pos.x + size.x,        //line doesn't overlap the full shape
                y2: pos.y + (this.$labelHeight * 1.5) + (this.$attrHeight * this.attributes.length),
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

    public setStereoTyp(value: string): void {
        this.stereoType = '<<' + value + '>>';
    }

    public getStereoType(): string {
        return this.stereoType;
    }
}