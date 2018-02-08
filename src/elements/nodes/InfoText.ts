import { Point } from '../BaseElements';
import { Util } from '../../util';
import { Node } from './Node';
import { EventBus } from '../../EventBus';

export class InfoText extends Node {

    public cardinality: string;
    private $heightOfOneTextItem: number;
    private $cardinalitySvg: Element;
    private $propertySvg: Element;
    private $rectBackground: Element;

    constructor(info: any) {
        super(info);
        if (typeof (info) === 'string') {
            this.id = info;
        } else {
            if (info.property) {
                this.property = info.property;
            }
            if (info.cardinality) {
                this.cardinality = info.cardinality;
            }
            this.id = 'InfoText' + info.id;
        }
        this.$isDraggable = true;

        let calcSize = this.calcSize();
        this.withSize(calcSize.x, calcSize.y);
    }

    private calcSize(): Point {
        let text: string = this.getText();
        let items: Array<string> = text.split('\n');

        let maxSize = new Point(0, 0);
        for (let i = 0; i < items.length; i += 1) {
            // calculate size
            let sizeOfText: ClientRect = Util.sizeOf(items[i]);
            maxSize.x = Math.max(maxSize.x, sizeOfText.width);
            maxSize.y += sizeOfText.height;

            this.$heightOfOneTextItem = sizeOfText.height;
        }

        return maxSize;
    }

    public updateCardinality(cardinality: string): void {
        this.cardinality = cardinality;

        let calcSize = this.calcSize();
        this.withSize(calcSize.x, calcSize.y);

        if (this.$rectBackground) {
            this.$rectBackground.setAttributeNS(null, 'width', '' + calcSize.x);
            this.$rectBackground.setAttributeNS(null, 'height', '' + calcSize.y);
        }

        if (this.$cardinalitySvg) {
            this.$cardinalitySvg.textContent = cardinality;
        }
        else if (!this.$view) {
            let svg = this.getSVG();
            this.$owner.$view.appendChild(svg);
        }
        else if (!this.$cardinalitySvg) {
            let pos: Point = this.getPos();
            let y = pos.y;
            if (this.$propertySvg) {
                y += this.$heightOfOneTextItem;
            }

            this.$cardinalitySvg = Util.createShape({
                tag: 'text',
                x: pos.x,
                y: y,
                'text-anchor': 'left'
            });
            this.$cardinalitySvg.textContent = this.cardinality;
            this.$view.appendChild(this.$cardinalitySvg);
        }
    }

    public updateProperty(property: string): void {
        this.property = property;

        let calcSize = this.calcSize();
        this.withSize(calcSize.x, calcSize.y);

        if (this.$rectBackground) {
            this.$rectBackground.setAttributeNS(null, 'width', '' + calcSize.x);
            this.$rectBackground.setAttributeNS(null, 'height', '' + calcSize.y);
        }

        if (this.$propertySvg) {
            this.$propertySvg.textContent = property;
        }
        else if (!this.$view) {
            let svg = this.getSVG();
            this.$owner.$view.appendChild(svg);
        }
        else if (!this.$propertySvg) {
            let pos: Point = this.getPos();
            let y = pos.y;
            if (this.$cardinalitySvg) {
                this.$cardinalitySvg.setAttributeNS(null, 'y', '' + (y + this.$heightOfOneTextItem));
            }

            this.$propertySvg = Util.createShape({
                tag: 'text',
                x: pos.x,
                y: y,
                'text-anchor': 'left'
            });
            this.$propertySvg.textContent = this.cardinality;
            this.$view.appendChild(this.$propertySvg);
        }
    }

    public getSVG(): Element {
        let pos: Point = this.getPos();
        let group = Util.create({ tag: 'g', id: this.id, class: 'SVGEdgeInfo', transform: 'translate(0, 0)' });

        // append rect as background for text items
        this.$rectBackground = Util.createShape({
            tag: 'rect',
            x: pos.x,
            y: pos.y - this.$heightOfOneTextItem + 3,
            width: this.getSize().x,
            height: this.getSize().y,
            fill: '#DDD',
            'stroke-width': 0
        });
        group.appendChild(this.$rectBackground);

        let y = pos.y;
        if (this.property) {
            // property
            this.$propertySvg = Util.createShape({
                tag: 'text',
                x: pos.x,
                y: y,
                'text-anchor': 'left'
            });
            this.$propertySvg.textContent = this.property;
            group.appendChild(this.$propertySvg);

            y += this.$heightOfOneTextItem;
        }

        // cardinality
        if (this.cardinality) {
            this.$cardinalitySvg = Util.createShape({
                tag: 'text',
                x: pos.x,
                y: y,
                'text-anchor': 'left'
            });
            this.$cardinalitySvg.textContent = this.cardinality;
            group.appendChild(this.$cardinalitySvg);
        }

        this.$view = group;

        return group;
    }

    public redrawFromEdge(newPos: Point): void {

        if (!newPos) return;

        let oldPos = this.getPos();

        // get difference between new and the old position
        let diffPos = new Point();
        diffPos.x = newPos.x - oldPos.x;
        diffPos.y = newPos.y - oldPos.y;

        // get translate information
        let translation = this.$view.getAttributeNS(null, 'transform').slice(10, -1).split(' ');
        let sx = parseInt(translation[0]);
        let sy = 0;
        if (translation.length > 1) {
            sy = parseInt(translation[1]);
        }

        // set new traslation values
        let newTransX = (sx + diffPos.x);
        let newTransY = (sy + diffPos.y);
        this.$view.setAttributeNS(null, 'transform', 'translate(' + newTransX + ' ' + newTransY + ')');

        // set new position of svg
        this.getPos().x = newPos.x;
        this.getPos().y = newPos.y;
    }

    public getText(): string {
        let infoTxt: string = '';

        if (this.property) {
            infoTxt = this.property;
        }
        if (this.cardinality) {
            if (infoTxt.length > 0) {
                infoTxt += '\n';
            }
            infoTxt += this.cardinality;
        }

        return infoTxt;
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTCLICK, EventBus.ELEMENTDBLCLICK, EventBus.OPENPROPERTIES];
    }
}
