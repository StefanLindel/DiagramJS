// 				######################################################### Info #########################################################
import { Point } from '../BaseElements';
import { Util } from '../../util';
import { Node } from './Node';
import { EventBus } from '../../EventBus';

export class InfoText extends Node {
    custom: boolean;
    private cardinality: string;
    private $angle: number;

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
            this.id = info.id;
        }
        this.$isDraggable = true;
    }

    public getSVG(): Element {
        let text: string = this.getText();
        let items: Array<string> = text.split('\n');
        let firstChild: Element;
        let textHeight: number;

        if (text.length < 1) {
            return null;
        }

        let group = Util.create({ tag: 'g', 'stroke-width': 0, transform: 'translate(0, 0)' });

        let pos: Point = this.getPos();
        let maxSize = new Point(0, 0);
        for (let i = 0; i < items.length; i += 1) {

            let nextPosY: number = pos.y + (maxSize.y * i);

            let child = Util.create({
                tag: 'text',
                'text-anchor': 'left',
                x: pos.x,
                y: nextPosY
            });
            child.textContent = items[i];
            group.appendChild(child);

            // calculate size
            let sizeOfText: ClientRect = Util.sizeOf(items[i]);
            maxSize.x = Math.max(maxSize.x, sizeOfText.width);
            maxSize.y += sizeOfText.height;

            if (i == 0) {
                firstChild = child;
                textHeight = sizeOfText.height;
            }
        }

        this.withSize(maxSize.x, maxSize.y);

        let rectBackground = Util.createShape({
            tag: 'rect',
            x: pos.x,
            y: pos.y - textHeight,
            width: this.getSize().x,
            height: this.getSize().y,
            fill: '#DDD',
            'stroke-width': 0
        });

        group.insertBefore(rectBackground, firstChild);

        this.$view = group;

        return group;
    }

    public redraw(newPos: Point): void {

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
