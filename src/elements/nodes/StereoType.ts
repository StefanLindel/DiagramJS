import {Point} from '../BaseElements';
import { Clazz } from "./index";

export class StereoType extends Clazz{

    protected stereoType : string;
    protected $stereoTypeView : Element;

    public getSVG() : Element{

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
            ry: 10,
            class: 'SVGClazz'
        });

        // = = = STEREOTYPE = = =
        let stereoType = this.createShape({
            tag: 'text',
            x: pos.x + size.x / 2,
            y: pos.y + this.labelHeight / 2,
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
            y: pos.y + this.labelHeight,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': this.labelFontSize,
            'font-weight': 'bold',
            fill: 'black'
        });
        label.textContent = this.label;
        this.$labelView = label;

        let group = this.createShape({ tag: 'g', id: this.id, transform: 'translate(0 0)' });
        group.appendChild(nodeShape);
        group.appendChild(stereoType);
        group.appendChild(label);

        // = = = ATTRIBUTES = = =
        if (this.attributesObj.length > 0) {


            // line to separate label from attributes
            const separatorLabelAttr = this.createShape({
                tag: 'line',
                x1: pos.x,                   //line doesn't overlap the full shape
                y1: pos.y + this.labelHeight + (this.labelHeight / 2),
                x2: pos.x + size.x,        //line doesn't overlap the full shape
                y2: pos.y + this.labelHeight + (this.labelHeight / 2),
                stroke: 'rgb(0, 0, 0)',        //black
                'stroke-width': 2
            });


            group.appendChild(separatorLabelAttr);

            let y = pos.y + this.labelHeight + (this.labelHeight / 2) + (this.attrHeight / 2);
            for (let attr of this.attributesObj) {

                let attrSvg = attr.getSVG();
                attr.$owner = this;

                attrSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                attrSvg.setAttributeNS(null, 'y', '' + y);

                group.appendChild(attrSvg);
                y += this.attrHeight;
            }
        }

        // = = = METHODS = = =
        let height = this.attributesObj.length * this.attrHeight;
        let y = pos.y + (this.labelHeight*1.5) + height + this.attrHeight / 2;
        if (this.methodsObj.length > 0) {

            // line to separate label from attributes
            const separatorAttrMethods = this.createShape({
                tag: 'line',
                x1: pos.x,                   //line doesn't overlap the full shape
                y1: pos.y + (this.labelHeight*1.5) + (this.attrHeight * this.attributesObj.length),
                x2: pos.x + size.x,        //line doesn't overlap the full shape
                y2: pos.y + (this.labelHeight*1.5) + (this.attrHeight * this.attributesObj.length),
                stroke: 'rgb(0, 0, 0)',        //black
                'stroke-width': 2
            });


            group.appendChild(separatorAttrMethods);

            y += this.attrHeight / 2;
            for (let method of this.methodsObj) {

                let methodSvg = method.getSVG();
                method.$owner = this;

                methodSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                methodSvg.setAttributeNS(null, 'y', '' + y);

                group.appendChild(methodSvg);
                y += this.attrHeight;
            }
        }

        this.$view = group;
        return group;
    }

    public setStereoTyp(value : string) : void{
        this.stereoType = '<<' + value + '>>';
    }

    public getStereoType() : string{
        return this.stereoType;
    }
}