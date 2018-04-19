// ################################## jsEPS ####################################################
import {SVGConverter} from './SVGConverter';

export class JSEPS {
    private max: number;
    private min: number;
    private inverting: boolean;
    private output: string[];
    private font: number;

    constructor(options: any) {
        this.max = 0;
        this.min = 999;
        let hasInverting = typeof (options.inverting);
        this.inverting = (options && hasInverting !== 'undefined' ? options.inverting : true);
        this.output = ['%!PS-Adobe-3.0 EPSF-3.0', '1 setlinewidth'];
        this.out('/FSD {findfont exch scalefont def} bind def % In the document prolog: define');
        this.out('/SMS {setfont moveto show} bind def % some useful procedures');
        this.out('/MS {moveto show} bind def');
        this.out('/F1  10  /Helvetica  FSD % At the start of the script: set up');
        this.font = 1;
    }

    public out(value: string) {this.output.push(value); }
    public rect(x: number, y: number, width: number, height: number, style: string) {
        y = y + (this.inverting ? height : 0);
        if (style && style.indexOf('fill:url(#classelement);') >= 0) {
            this.out('gsave 0.93 0.93 0.93 setrgbcolor newpath ' + x + ' ' + this.y(y) + ' ' + width + ' ' + height + ' rectfill grestore');
        } else {
            this.out('newpath ' + x + ' ' + this.y(y) + ' ' + width + ' ' + height + ' rectstroke');
        }
    }
    public setFillColor(r: number, g: number, b: number) {/*FIXME*/}
    public y(value: number) {this.max = Math.max(this.max, value); this.min = Math.min(this.min, value); return this.inverting ? '%y(' + value + ')' : value; }
    public getType(): string {
        return 'application/postscript';
    }

    public getData(): string {
        let t, end, url, text, typ = 'application/postscript', a = document.createElement('a'), data = '', pos, i;
        for (i = 0; i < this.output.length; i += 1) {
            text = this.output[i];
            if (this.inverting) {
                while ((pos = text.indexOf('%y')) >= 0) {
                    end = text.indexOf(')', pos);
                    t = this.max - parseInt(text.substring(pos + 3, end), 10);
                    text = text.substring(0, pos) + t + text.substring(end + 1);
                }
            }
            data = data + text + '\r\n';
        }
        return data;
    }

    public setDrawColor(r: number, g: number, b: number) {/*FIXME*/}
    public ellipse(cx: number, cy: number, rx: number, ry: number, colorMode: string) {/*FIXME*/}
    public circle(cx: number, cy: number, r: number, colorMode: string) {/*FIXME*/}
    public setTextColor(r: number, g: number, b: number) {/*FIXME*/}
    public text(x: number, y: number, text: string) {this.out('(' + text.replace('&lt;', '<').replace('&gt;', '>') + ') ' + x + ' ' + this.y(y) + ' F1 SMS'); }
    public lineto(x: number, y: number) {this.out(x + ' ' + this.y(y) + ' lineto'); this.out('stroke'); }
    public moveto(x: number, y: number) {this.out(x + ' ' + this.y(y) + ' moveto'); }
    public line(x1: number, y1: number, x2: number, y2: number) {this.out('newpath ' + x1 + ' ' + this.y(y1) + ' moveto ' + x2 + ' ' + this.y(y2) + ' lineto stroke'); }
    public setLineWidth(value: string) {this.out(value + ' setlinewidth'); }
    public setFont(value: string) {this.out('/F' + (this.font += 1) + ' 10 /' + value + ' FSD'); }
}
