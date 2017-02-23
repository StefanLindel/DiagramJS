import {Util} from '../util';
import {Control} from '../Control';

export interface Size {
    width: number;
    height: number;
}

interface GraphElement {
    getSize(): Point;
    getPos(): Point;
    getCenter(): Point;
    getSVG();
    getCanvas();
    getEvents(): string[];
    withPos(x: number, y: number);
    load(data: any);
}

export abstract class DiagramElement extends Control implements GraphElement {
    public id: string;
    public $view: Element;
    protected isDraggable: boolean = true;
    private pos: Point = new Point();
    private size: Point = new Point();

    public getPos(): Point {
        return this.pos;
    }

    public getSize(): Point {
        return this.size;
    }

    public getCenter(): Point {
        let pos = this.getPos();
        let size = this.getSize();
        return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
    }

    public getCenterPosition(p: string): Point {
        let pos = this.getPos();
        let size = this.getSize();
        let offset = this['$' + p];
        let center = this.getCenter();
        if (p === Point.DOWN) {
            return new Point(Math.min(center.x + offset, center.x), pos.y + size.y, Point.DOWN);
        }
        if (p === Point.UP) {
            return new Point(Math.min(center.x + offset, center.x), pos.y, Point.UP);
        }
        if (p === Point.LEFT) {
            return new Point(pos.x, Math.min(center.y + offset, pos.y + size.y), Point.LEFT);
        }
        if (p === Point.RIGHT) {
            return new Point(pos.x + size.x, Math.min(center.y + offset, pos.y + size.y), Point.RIGHT);
        }
    };

    public getSVG(): Element {
        return null;
    }

    public getCanvas(): Element {
        return null;
    }

    public getEvents(): string[] {
        return null;
    }

    public withPos(x: number, y: number): DiagramElement {
        if (x && y) {
            this.pos = new Point(x, y);
        } else {
            if (typeof(x) !== 'undefined') {
                this.pos.x = x;
            }
            if (typeof(y) !== 'undefined') {
                this.pos.y = y;
            }
        }
        return this;
    }

    public withSize(width: number, height: number): DiagramElement {
        if (width && height) {
            this.size = new Point(width, height);
        } else {
            if (typeof(width) !== 'undefined') {
                this.size.x = width;
            }
            if (typeof(height) !== 'undefined') {
                this.size.y = height;
            }
        }
        return this;
    }

    public getShowed(): Control {
        // FIXME if (this.status === 'close') {
        // if (!this.$owner.isClosed()) {
        //        return this;
        //    }
        // }
        return super.getShowed();
    }

    protected createShape(attrs): Element {
        return Util.createShape(attrs);
    }
}

export class Point {
    public static UP: string = 'UP';
    public static LEFT: string = 'LEFT';
    public static RIGHT: string = 'RIGHT';
    public static DOWN: string = 'DOWN';
    x: number = 0;
    y: number = 0;
//    pos:string = '';

    constructor(x?: number, y?: number, pos?: string) {
        this.x = Math.ceil(x || 0);
        this.y = Math.ceil(y || 0);
        if (pos) {
            this['pos'] = pos;
        }
    };

    public add(pos: Point) {
        this.x += pos.x;
        this.y += pos.y;
        return this;
    }

    public getPosition() {
        if (!this['pos']) {
            return '';
        }
        return this['pos'];
    }

    public addNum(x: number, y: number) {
        this.x += x;
        this.y += y;
        return this;
    }

    public sum(pos: Point) {
        let sum = new Point(this.x, this.y);
        sum.add(pos);
        return sum;
    }

    public center(posA: Point, posB: Point) {
        let count = 0;
        if (posA) {
            this.x += posA.x;
            this.y += posA.y;
            count++;
        }
        if (posB) {
            this.x += posB.x;
            this.y += posB.y;
            count++;
        }
        if (count > 0) {
            this.x = (this.x / count);
            this.y = (this.y / count);
        }
    }

    public isEmpty(): boolean {
        return this.x < 1 && this.y < 1;
    }

    public size(posA: Point, posB: Point) {
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        if (posA) {
            x1 = posA.x;
            y1 = posA.y;
        }
        if (posB) {
            x2 = posB.x;
            y2 = posB.y;
        }
        if (x1 > x2) {
            this.x = x1 - x2;
        } else {
            this.x = x2 - x1;
        }
        if (y1 > y2) {
            this.y = y1 - y2;
        } else {
            this.y = y2 - y1;
        }
    }
}
// 				######################################################### Line #########################################################
export class Line extends DiagramElement {
    public static FORMAT = {SOLID: 'SOLID', DOTTED: 'DOTTED', PATH: 'PATH'};
    public source: Point;
    public target: Point;
    public color: string;
    public lineType: string;
    private path: string;
    private angle: Number;

    constructor(lineType: string) {
        super();
        this.lineType = lineType;
    }

    public getTyp(): string {
        return 'SVG';
    }

    public getPos() {
        let pos = new Point();
        pos.center(this.source, this.target);
        return pos;
    };

    public getSize() {
        let pos = new Point();
        pos.size(this.source, this.target);
        return pos;
    }

    public withColor(color: string): Line {
        this.color = color;
        return this;
    }

    public withSize(x: number, y: number): DiagramElement {
        return this;
    }

    public withPath(path: Array<Point>, close, angle?: any): Line {
        let i: number, d: string = 'M' + path[0].x + ' ' + path[0].y;
        this.lineType = Line.FORMAT.PATH; // It is a Path not a Line
        for (i = 1; i < path.length; i += 1) {
            d = d + 'L ' + path[i].x + ' ' + path[i].y;
        }
        if (close) {
            d = d + ' Z';
            this.target = path[0];
        } else {
            this.target = path[path.length - 1];
        }
        this.path = d;
        if (angle instanceof Number) {
            this.angle = angle;
        } else if (angle) {
            // var lineangle, start = path[0], end = path[path.length - 1];
            // lineangle = Math.atan2(end.y - start.y, end.x - start.x);
        }
        return this;
    }

    public getSVG(): HTMLElement {
        if (this.lineType === 'PATH') {
            return Util.create({
                tag: 'path',
                'd': this.path,
                'fill': this.color,
                stroke: '#000',
                'stroke-width': '1px'
            });
        }
        let line = Util.create({
            tag: 'line',
            'x1': this.source.x,
            'y1': this.source.y,
            'x2': this.target.x,
            'y2': this.target.y,
            'stroke': Util.getColor(this.color)
        });
        if (this.lineType && this.lineType.toLowerCase() === 'dotted') {
            line.setAttribute('stroke-miterlimit', '4');
            line.setAttribute('stroke-dasharray', '1,1');
        }
        return line;
    }
}
