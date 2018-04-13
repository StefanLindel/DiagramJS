import { Point } from '../BaseElements';
import { Util } from '../../util';
import { Node } from './Node';
import { EventBus } from '../../EventBus';

export class InfoText extends Node {

    public cardinality: string = '';
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
        }
        this.$isDraggable = true;

        let calcSize = this.calcSize();
        this.withSize(calcSize.x, calcSize.y);
    }

    public updateCardinality(cardinality: string): void {
        this.cardinality = cardinality;

        let calcSize = this.calcSize();
        this.withSize(calcSize.x, calcSize.y);

        if (this.$rectBackground) {
            this.$rectBackground.setAttributeNS(null, 'width', '' + calcSize.x);
            this.$rectBackground.setAttributeNS(null, 'height', '' + calcSize.y);
        }

        if (!this.$view) {
            let svg = this.getSVG();
            this.$owner.$view.appendChild(svg);

            return;
        }

        if ((cardinality.length === 0 && this.property.length > 0) || !this.$cardinalitySvg) {
            this.$owner.$view.removeChild(this.$view);
            this.resetAllSvgElements();

            let svg = this.getSVG();
            this.$owner.$view.appendChild(svg);

            return;
        }

        if (this.$cardinalitySvg) {
            this.$cardinalitySvg.textContent = cardinality;

            // update background
            if (this.$rectBackground) {
                this.$rectBackground.setAttributeNS(null, 'width', '' + calcSize.x);
                this.$rectBackground.setAttributeNS(null, 'height', '' + calcSize.y);
            }

            return;
        }

        if (this.property.length === 0) {
            this.$owner.$view.removeChild(this.$view);
            this.resetAllSvgElements();

            return;
        }
    }

    public updateProperty(property: string): void {
        this.property = property;

        let calcSize = this.calcSize();
        this.withSize(calcSize.x, calcSize.y);

        if (!this.$view) {
            let svg = this.getSVG();
            this.$owner.$view.appendChild(svg);

            return;
        }

        if ((property.length === 0 && this.cardinality.length > 0) || !this.$propertySvg) {
            this.$owner.$view.removeChild(this.$view);
            this.resetAllSvgElements();

            let svg = this.getSVG();
            this.$owner.$view.appendChild(svg);

            return;
        }

        if (this.$propertySvg) {
            this.$propertySvg.textContent = property;

            // update background
            if (this.$rectBackground) {
                this.$rectBackground.setAttributeNS(null, 'width', '' + calcSize.x);
                this.$rectBackground.setAttributeNS(null, 'height', '' + calcSize.y);
            }

            return;
        }

        if (this.cardinality.length === 0) {
            this.$owner.$view.removeChild(this.$view);
            this.resetAllSvgElements();
        }
    }

    public getSVG(): Element {
        let pos: Point = this.getPos();
        let group = Util.create({ tag: 'g', class: 'SVGEdgeInfo', transform: 'translate(0, 0)' });

        // append rect as background for text items
        this.$rectBackground = Util.createShape({
            tag: 'rect',
            x: pos.x,
            y: pos.y - this.$heightOfOneTextItem + 3,
            width: this.getSize().x,
            height: this.getSize().y,
            fill: '#DDD',
            'stroke-width': 0,
            rx: '5',
            ry: '5'
        });
        group.appendChild(this.$rectBackground);

        let y = pos.y;
        if (this.property) {
            // property
            this.$propertySvg = Util.createShape({
                tag: 'text',
                x: pos.x + 3,
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
                x: pos.x + 3,
                y: y,
                'text-anchor': 'left'
            });
            this.$cardinalitySvg.textContent = this.cardinality;
            group.appendChild(this.$cardinalitySvg);
        }

        this.$view = group;

        return group;
    }

    public isEmpty(): boolean {
        let cardinalityAvailable = this.cardinality && this.cardinality.length > 0;
        let propertyAvailable = this.property && this.property.length > 0;

        return !propertyAvailable && !cardinalityAvailable;
    }

    public redrawFromEdge(newPos: Point): void {

        if (!newPos) {
            return;
        }

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

    private calcSize(): Point {
        let text: string = this.getText();
        let items: Array<string> = text.split('\n');

        let maxSize = new Point(0, 0);
        if (text.length === 0) {
            return maxSize;
        }

        for (let i = 0; i < items.length; i += 1) {
            // calculate size
            let sizeOfText: ClientRect = Util.sizeOf(items[i]);
            maxSize.x = Math.max(maxSize.x, sizeOfText.width);
            maxSize.y += sizeOfText.height;

            this.$heightOfOneTextItem = sizeOfText.height;
        }

        return maxSize;
    }
    private resetAllSvgElements() {
        this.$cardinalitySvg = undefined;
        this.$view = undefined;
        this.$propertySvg = undefined;
    }
}
