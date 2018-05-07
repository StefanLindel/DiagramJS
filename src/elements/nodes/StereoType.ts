import {Point} from '../BaseElements';
import {Node} from './Node';

export class StereoType extends Node {

    protected stereoType: string;

    constructor (type: string, x: number, y: number) {
        super('');
        this.withPos(x, y);
        this.setStereoType(type);
    }

    public getSVG(): Element {

        let pos: Point = this.getPos();
        let size: Point = this.getSize();

               // = = = STEREOTYPE = = =
        let stereoType = this.createShape({
            tag: 'text',
            x: pos.x + size.x / 2,
            y: pos.y - this.$labelHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': 10,
            'font-weight': 'bold',
            fill: 'black'
        });
        stereoType.textContent = this.stereoType;

        this.$view = stereoType;
        return stereoType;
    }

    public setStereoType(value: string): void {
        this.stereoType = '<<' + value + '>>';
    }

    public getStereoType(): string {
        return this.stereoType;
    }
}
