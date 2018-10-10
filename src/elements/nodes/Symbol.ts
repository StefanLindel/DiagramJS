import { Node } from './Node';
import { SO } from './SO';
import { DiagramElement } from '../BaseElements';
import { Util } from '../../util';

export class Symbol extends Node {
    public $heightMax: number = 0;
    public $heightMin: number = 0;

    constructor(typ: string) {
        super(typ);
    }

    public draw(typ?: string): SVGElement {
        return SymbolLibary.draw(this);
    }
}

// 				###################################################### SymbolLibary ####################################################################################
// Example Items
// {tag: 'path', d: ''}
// {tag: 'rect', width:46, height:34}
// {tag: 'ellipse', width:23, height:4}
// {tag: 'line', x1:650, y1:-286, x2:650, y2:-252}
// {tag: 'circle', r:5, x:12, y:0}
// {tag: 'image', height: 30, width: 50, content$src: hallo}
// {tag: 'text', 'text-anchor': 'left', x: '10'}
export class SymbolLibary {

    public static drawSVG(node: any): SVGSVGElement {
        // const lib = new SymbolLibary();
        let symbol, fn = this[SymbolLibary.getName(node)];
        if (typeof fn === 'function') {
            const parent = SO.create(node);
            parent['property'] = 'SVG';
            symbol = fn(parent);
            // symbol = fn.apply(lib, parent);

            return SymbolLibary.createGroup(parent, symbol);
        }
        return symbol;
    }

    public static draw(node: any, parent?: Object): SVGElement {
        // Node is Symbol or simple Object
        let symbol, fn = this[SymbolLibary.getName(node)];
        if (typeof fn === 'function') {
            if (!(node instanceof DiagramElement)) {
                node = SO.create(node);
                if (!node.property) {
                    node.property = 'SVG';
                }
            }
            symbol = fn.apply(this, [node]);
            if (!parent) {
                return SymbolLibary.createGroup(node, symbol);
            }
            return SymbolLibary.createGroup(node, symbol);
        } else if (node.property) {
            symbol = new Symbol(node.property);
            symbol.init(node);
            let pos = node.getPos();
            let size = node.getSize();
            symbol.withPos(pos.x, pos.y);
            symbol.withSize(size.x, size.y);
            symbol['value'] = node['value'];
            parent = node['$parent'];
            return SymbolLibary.draw(symbol, parent);
        }
        return null;
    }

    public static upFirstChar(txt: string): string {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    }

    public static isSymbolName(typ: string): boolean {
        let fn = SymbolLibary['draw' + SymbolLibary.upFirstChar(typ)];
        return typeof fn === 'function';
    }

    public static isSymbol(node: Symbol) {
        let fn = SymbolLibary[SymbolLibary.getName(node)];
        return typeof fn === 'function';
    }

    public static getName(node: any): string {
        if (node['type']) {
            return 'draw' + SymbolLibary.upFirstChar(node['type']);
        }
        if (node.property) {
            return 'draw' + SymbolLibary.upFirstChar(node.property);
        }
        if (node['src']) {
            return 'draw' + SymbolLibary.upFirstChar(node['src']);
        }
        return 'drawNode';
    }

    /*FIXME   public static createImage(node: Symbol, $graphModel:Node) {
           let n, img: HTMLElement;
           // node.$graphModel = node;
           if (SymbolLibary.isSymbol(node)) {
               return SymbolLibary.draw(null, node);
           }
           n = {tag: 'img', $graphModel: node, src: node['src']};
           let size = node.getSize();
           if (size.isEmpty() === false) {
               n['width'] = size.x;
               n['height'] = size.y;
           } else {
               n['xmlns'] = 'http://www.w3.org/1999/xhtml';
           }
           img = Util.create(n);
           if (size.isEmpty()) {
               $graphModel.appendImage(img);
               return null;
           }
           return img;
       }*/

    public static createGroup(node: DiagramElement, group: any) {
        let func, y: number, z: number, box, item: Element, transform, i, offsetX = 0, offsetY = 0;
        let svg: any;
        if (node.property.toUpperCase() === 'HTML') {
            let so = {
                tag: 'svg',
                style: { left: (group.x | 0) + node.getPos().x, top: (group.y | 0) + node.getPos().y, position: 'absolute' }
            };
            if (node['transform']) {
                so['transform'] = node['transform'];
            }
            svg = Util.create(so);
        } else {
            svg = Util.create({ tag: 'g' });
            transform = 'translate(' + group.getPos().x + ' ' + group.getPos().y + ')';
            if (group.scale) {
                transform += ' scale(' + group.scale + ')';
            }
            if (group.rotate) {
                transform += ' rotate(' + group.rotate + ')';
            }
            svg.setAttribute('transform', transform);
            if (group['id']) {
                svg.id = group['id'];
            }
        }

        if (node['tooltip']) {
            const tooltipTitleAttr = {
                tag: 'title'
            };
            let tooltipTitle = Util.createShape(tooltipTitleAttr);
            tooltipTitle.textContent = node['tooltip'];
            svg.appendChild(tooltipTitle);
        }

        if (node['background']) {
            const attrCircle = {
                tag: 'circle',
                cx: 20,
                cy: 20,
                r: 17,
                stroke: '#888',
                'stroke-width': 0,
                fill: '#DDD'
            };
            svg.appendChild(Util.create(attrCircle));
        }

        for (i = 0; i < group.items.length; i += 1) {
            svg.appendChild(Util.create(group.items[i]));
        }
        let elements = node['elements'];
        Util.setSize(svg, group.width + node.getSize().x, group.height + node.getSize().y);
        node['$heightMin'] = node.getSize().y;
        if (elements) {
            for (i = 0; i < elements.length; i += 1) {
                if (!elements[i] && elements[i].length < 1) {
                    elements.splice(i, 1);
                    i -= 1;
                }
            }
            box = Util.create({ tag: 'g' });
            // Calculate new Height
            let c: number;
            z = 0;
            for (c = 0; c < elements.length; c += 1) {
                if (typeof elements[c] === 'string') {
                    z += 1;
                } else {
                    z += elements[c].length;
                }
            }
            z = z * 25 + 6;
            box.appendChild(Util.create({
                tag: 'rect',
                rx: 0,
                x: offsetX,
                y: (offsetY + 28),
                width: 70,
                height: z,
                stroke: '#000',
                fill: '#fff',
                opacity: '0.7'
            }));
            node['$heightMax'] = z + node['$heightMin'];

            svg['elements'] = elements;
            if (node['type'] === 'DropDown') {
                svg['activ'] = Util.create({
                    tag: 'text',
                    $font: true,
                    'text-anchor': 'left',
                    'width': 60,
                    'x': (10 + offsetX),
                    'y': 20,
                    value: node['activText']
                });
                svg.appendChild(svg.activ);
            }

            y = offsetY + 46;
            // 46 -28 = 18

            func = function (event: Event) {
                if (svg.activ) {
                    svg.activ.textContent = (<any>event.currentTarget).value;
                }
            };
            let txt: string;
            let textClass = 'SVGTEXT';
            for (z = 0; z < elements.length; z += 1) {
                if (typeof elements[z] === 'string') {
                    txt = elements[z];
                } else {
                    item = this.addText(y, offsetX, box, elements[z][0], 'SVGTEXT');
                    y += 26;
                    for (c = 1; c < elements[z].length; c += 1) {
                        item = this.addText(y, offsetX, box, '* ' + elements[z][c], 'SVGTEXTITEM');

                        item['value'] = elements[z];
                        if (node['action']) {
                            item['onclick'] = node['action'];
                        } else {
                            item['onclick'] = func;
                        }
                        y += 26;
                    }
                    txt = elements[z];
                    let subBox = Util.create({
                        tag: 'rect',
                        rx: 0,
                        x: offsetX,
                        y: (offsetY + 28),
                        width: 60,
                        height: z,
                        stroke: '#000',
                        fill: '#fff',
                        opacity: '0.7'
                    });
                    continue;
                }
                // let txt = elements[z];
                item = this.addText(y, offsetX, box, txt, textClass);

                item['value'] = elements[z];
                if (node['action']) {
                    item['onclick'] = node['action'];
                } else {
                    item['onclick'] = func;
                }
                y += 26;
            }
            svg.choicebox = box;
        }
        svg.tool = node;
        svg.onclick = function () {
            if (svg.status === 'close') {
                svg.open();
            } else {
                svg.close();
            }
        };
        svg.close = function () {
            if (svg.status === 'open' && svg.choicebox) {
                this.removeChild(svg.choicebox);
            }
            svg.status = 'close';
            svg.tool.$size.height = svg.tool.heightMin;
            // typ.Util.setSize(g, g.tool.width + g.tool.x, g.tool.height + g.tool.y);
            Util.setSize(svg, svg.tool.$size.x, svg.tool.$size.y);
        };
        svg.open = function () {
            if (this.tagName === 'svg') {
                return;
            }
            if (svg.status === 'close' && svg.choicebox) {
                this.appendChild(svg.choicebox);
            }
            svg.status = 'open';
            svg.tool.$size.height = svg.tool.heightMax;
            Util.setSize(svg, svg.tool.width, svg.tool.height);
            // typ.Util.setSize(g, g.tool.width + g.tool.x + 10, g.tool.height + g.tool.y + 10);
        };
        svg.close();
        return svg;
    }

    public static addChild(parent: SVGElement, json: JSON | Element): void {
        let item: Element;
        if ((<any>json).offsetLeft) {
            item = <Element>json;
        } else {
            item = Util.create(json);
        }
        item.setAttribute('class', 'draggable');
        parent.appendChild(item);
    }

    public static all(node: any): void {
        SymbolLibary.drawSmiley(node);
        SymbolLibary.drawDatabase(node);
        SymbolLibary.drawLetter(node);
        SymbolLibary.drawMobilephone(node);
        SymbolLibary.drawWall(node);
        SymbolLibary.drawActor(node);
        SymbolLibary.drawLamp(node);
        SymbolLibary.drawArrow(node);
        SymbolLibary.drawButton(node);
        SymbolLibary.drawDropdown(node);
        SymbolLibary.drawClassicon(node);
        SymbolLibary.drawClassWithEdgeicon(node);
    }

    public static drawHamburger(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x,
            y: node.getPos().y,
            width: 50,
            height: 52,
            items: [
                { tag: 'circle', r: 10, fill: '#ccc', cx: 12, cy: 12, 'stroke-width': 1, stroke: 'black'},
                { tag: 'path', d: 'M 8,7 H 16 M 8,12 H 16 M 8,17 H 16', stroke: 'black', fill: 'none' }
            ]
        });
    }

    public static drawSmiley(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x,
            y: node.getPos().y,
            width: 50,
            height: 52,
            items: [
                { tag: 'path', d: 'm49.01774,25.64542a24.5001,24.5 0 1 1 -49.0001,0a24.5001,24.5 0 1 1 49.0001,0z', stroke: 'black', fill: 'none' }, { tag: 'path', d: 'm8,31.5c16,20 32,0.3 32,0.3' },
                { tag: 'path', d: 'm19.15,20.32a1.74,2.52 0 1 1 -3.49,0a1.74,2.52 0 1 1 3.49,0z' },
                { tag: 'path', d: 'm33,20.32a1.74,2.52 0 1 1 -3.48,0a1.74,2.52 0 1 1 3.48,0z' },
                { tag: 'path', d: 'm5.57,31.65c3.39,0.91 4.03,-2.20 4.03,-2.20' },
                { tag: 'path', d: 'm43,32c-3,0.91 -4,-2.20 -4.04,-2.20' }
            ]
        });
    }

    public static drawDatabase(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 25,
            height: 40,
            items: [
                {
                    tag: 'path',
                    d: 'm0,6.26c0,-6.26 25.03,-6.26 25.03,0l0,25.82c0,6.26 -25.03,6.26 -25.03,0l0,-25.82z',
                    stroke: 'black',
                    fill: 'none'
                },
                {
                    tag: 'path',
                    d: 'm0,6.26c0,4.69 25.03,4.69 25.03,0m-25.03,2.35c0,4.69 25.03,4.69 25.03,0m-25.03,2.35c0,4.69 25.03,4.69 25.03,0',
                    stroke: 'black',
                    fill: 'none'
                }
            ]
        });
    }

    public static drawLetter(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 25,
            height: 17,
            items: [
                { tag: 'path', stroke: 'black', fill: 'none', d: 'm1,1l22,0l0,14l-22,0l0,-14z' },
                { tag: 'path', stroke: 'black', fill: 'none', d: 'm1.06,1.14l10.94,6.81l10.91,-6.91' }
            ]
        });
    }

    public static drawMobilephone(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 25,
            height: 50,
            items: [
                {
                    tag: 'path',
                    d: 'm 4.2 0.5 15.61 0c 2 0 3.7 1.65 3.7 3.7l 0 41.6c 0 2-1.65 3.7-3.7 3.7l-15.6 0c-2 0-3.7-1.6-3.7-3.7l 0-41.6c 0-2 1.6-3.7 3.7-3.7z',
                    fill: 'none',
                    stroke: 'black'
                },
                { tag: 'path', d: 'm 12.5 2.73a 0.5 0.5 0 1 1-1 0 0.5 0.5 0 1 1 1 0z' },
                { tag: 'path', d: 'm 14 46a 2 2 0 1 1-4 0 2 2 0 1 1 4 0z' },
                { tag: 'path', d: 'm 8 5 7 0' },
                { tag: 'path', d: 'm 1.63 7.54 20.73 0 0 34-20.73 0z' }
            ]
        });
    }

    public static drawWall(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 25,
            height: 50,
            items: [
                { tag: 'path', d: 'm26,45.44l-5,3.56l-21,-9l0,-36.41l5,-3.56l20.96,9l-0,36.4z' },
                {
                    tag: 'path',
                    stroke: 'white',
                    d: 'm2.21,11l18.34,7.91m-14.46,-12.57l0,6.3m8.2,21.74l0,6.35m-8.6,-10l0,6.351m4.1,-10.67l0,6.3m4.8,-10.2l0,6.3m-8.87,-10.23l0,6.35m4.78,-10.22l0,6.35m-8,14.5l18.34,7.91m-18.34,-13.91l18.34,7.91m-18.34,-13.91l18.34,7.91m-18.34,-13.91l18.34,7.91m0,-13l0,34m-18.23,-41.84l18.3,8m0,0.11l5,-3.57'
                }
            ]
        });
    }

    public static drawActor(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 25,
            height: 50,
            items: [
                { tag: 'line', stroke: '#000', x1: '12', y1: '10', x2: '12', y2: '30' },
                { tag: 'circle', stroke: '#000', cy: '5', cx: '12', r: '5' },
                { tag: 'line', stroke: '#000', y2: '18', x2: '25', y1: '18', x1: '0' },
                { tag: 'line', stroke: '#000', y2: '39', x2: '5', y1: '30', x1: '12' },
                { tag: 'line', stroke: '#000', y2: '39', x2: '20', y1: '30', x1: '12' }
            ]
        });
    }

    public static drawLamp(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 25,
            height: 50,
            items: [
                {
                    tag: 'path',
                    d: 'm 22.47 10.58c-6.57 0-11.89 5.17-11.89 11.54 0 2.35 0.74 4.54 2 6.36 2 4 4.36 5.63 4.42 10.4l 11.15 0c 0.12-4.9 2.5-6.8 4.43-10.4 1.39-1.5 1.8-4.5 1.8-6.4 0-6.4-5.3-11.5-11.9-11.5z',
                    fill: 'white',
                    stroke: 'black'
                },
                {
                    tag: 'path',
                    d: 'm 18.4 40 8 0c 0.58 0 1 0.5 1 1 0 0.6-0.5 1-1 1l-8 0c-0.6 0-1-0.47-1-1 0-0.58 0.47-1 1-1z'
                },
                {
                    tag: 'path',
                    d: 'm 18.4 42.7 8 0c 0.58 0 1 0.47 1 1 0 0.58-0.47 1-1 1l-8 0c-0.58 0-1-0.47-1-1 0-0.58 0.46-1 1-1z'
                },
                {
                    tag: 'path',
                    d: 'm 18.4 45.3 8 0c 0.58 0 1 0.47 1 1 0 0.58-0.47 1-1 1l-8 0c-0.58 0-1-0.47-1-1 0-0.58 0.46-1 1-1z'
                },
                { tag: 'path', d: 'm 19.5 48c 0.37 0.8 1 1.3 1.9 1.7 0.6 0.3 1.5 0.3 2 0 0.8-0.3 1.4-0.8 1.9-1.8z' },
                {
                    tag: 'path',
                    d: 'm 6 37.5 4.2-4c 0.3-0.3 0.8-0.3 1 0 0.3 0.3 0.3 0.8 0 1.1l-4.2 4c-0.3 0.3-0.8 0.3-1.1 0-0.3-0.3-0.3-0.8 0-1z'
                },
                {
                    tag: 'path',
                    d: 'm 39 37.56-4.15-4c-0.3-0.3-0.8-0.3-1 0-0.3 0.3-0.3 0.8 0 1l 4.2 4c 0.3 0.3 0.8 0.3 1 0 0.3-0.3 0.3-0.8 0-1z'
                },
                {
                    tag: 'path',
                    d: 'm 38 23 5.8 0c 0.4 0 0.8-0.3 0.8-0.8 0-0.4-0.3-0.8-0.8-0.8l-5.8 0c-0.4 0-0.8 0.3-0.8 0.8 0 0.4 0.3 0.8 0.8 0.8z'
                },
                {
                    tag: 'path',
                    d: 'm 1.3 23 6 0c 0.4 0 0.8-0.3 0.8-0.8 0-0.4-0.3-0.8-0.8-0.8l-5.9 0c-0.4 0-0.8 0.3-0.8 0.8 0 0.4 0.3 0.8 0.8 0.8z'
                },
                {
                    tag: 'path',
                    d: 'm 34.75 11.2 4-4.1c 0.3-0.3 0.3-0.8 0-1-0.3-0.3-0.8-0.3-1 0l-4 4.1c-0.3 0.3-0.3 0.8 0 1 0.3 0.3 0.8 0.3 1 0z'
                },
                {
                    tag: 'path',
                    d: 'm 11.23 10-4-4c-0.3-0.3-0.8-0.3-1 0-0.3 0.3-0.3 0.8 0 1l 4.2 4c 0.3 0.3 0.8 0.3 1 0 0.3-0.3 0.3-0.8 0-1z'
                },
                {
                    tag: 'path',
                    d: 'm 21.64 1.3 0 5.8c 0 0.4 0.3 0.8 0.8 0.8 0.4 0 0.8-0.3 0.8-0.8l 0-5.8c 0-0.4-0.3-0.8-0.8-0.8-0.4 0-0.8 0.3-0.8 0.8z'
                },
                {
                    tag: 'path',
                    d: 'm 26.1 24.3c-0.5 0-1 0.2-1.3 0.4-1.1 0.6-2 3-2.27 3.5-0.26-0.69-1.14-2.9-2.2-3.5-0.7-0.4-2-0.7-2.5 0-0.6 0.8 0.2 2.2 0.9 2.9 1 0.9 3.9 0.9 3.9 0.9 0 0 0 0 0 0 0.54 0 2.8 0 3.7-0.9 0.7-0.7 1.5-2 0.9-2.9-0.2-0.3-0.7-0.4-1.2-0.4z'
                },
                { tag: 'path', d: 'm 22.5 28.57 0 10.7' }
            ]
        });
    }

    public static drawStop(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 30,
            height: 30,
            items: [
                {
                    tag: 'path',
                    fill: '#FFF',
                    'stroke-width': '2',
                    stroke: '#B00',
                    d: 'm 6,6 a 14,14 0 1 0 0.06,-0.06 z m 0,0 20,21'
                }
            ]
        });
    }

    public static drawMin(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 20,
            height: 20,
            items: [
                {
                    tag: 'path',
                    fill: 'white',
                    stroke: '#000',
                    'stroke-width': 0.2,
                    'stroke-linejoin': 'round',
                    d: 'm 0,0 19,0 0,19 -19,0 z'
                },
                {
                    tag: 'path',
                    fill: 'none',
                    stroke: '#000',
                    'stroke-width': '1px',
                    'stroke-linejoin': 'miter',
                    d: 'm 4,10 13,-0.04'
                }
            ]
        });
    }

    public static drawArrow(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 10,
            height: 9,
            rotate: node['rotate'],
            items: [
                { tag: 'path', fill: '#000', stroke: '#000', d: 'M 0,0 10,4 0,9 z' }
            ]
        });
    }

    public static drawMax(node: DiagramElement): DiagramElement {
        return SO.create({
            x: node.getPos().x || 0,
            y: node.getPos().y || 0,
            width: 20,
            height: 20,
            items: [
                {
                    tag: 'path',
                    fill: 'white',
                    stroke: '#000',
                    'stroke-width': 0.2,
                    'stroke-linejoin': 'round',
                    'stroke-dashoffset': 2,
                    'stroke-dasharray': '4.8,4.8',
                    d: 'm 0,0 4.91187,0 5.44643,0 9.11886,0 0,19.47716 -19.47716,0 0,-15.88809 z'
                },
                {
                    tag: 'path',
                    fill: 'none',
                    stroke: '#000',
                    'stroke-width': '1px',
                    'stroke-linejoin': 'miter',
                    d: 'm 4,10 6,0.006 0.02,5 0.01,-11 -0.03,6.02 c 2,-0.01 4,-0.002 6,0.01'
                }
            ]
        });
    }

    public static drawButton(node: DiagramElement): DiagramElement {
        let btnX, btnY, btnWidth, btnHeight, btnValue;

        btnX = node.getPos().x || 0;
        btnY = node.getPos().y || 0;
        btnWidth = node.getSize().x || 60;
        btnHeight = node.getSize().y || 28;
        btnValue = node['value'] || '';
        return SO.create({
            x: btnX,
            y: btnY,
            width: 60,
            height: 28,
            items: [
                {
                    tag: 'rect',
                    rx: 8,
                    x: 0,
                    y: 0,
                    width: btnWidth,
                    height: btnHeight,
                    stroke: '#000',
                    filter: 'url(#drop-shadow)',
                    'class': 'SVGBtn'
                },
                { tag: 'text', $font: true, x: 10, y: 18, fill: 'black', value: btnValue, 'class': 'hand' }
            ]
        });
    }

    public static drawDropdown(node: DiagramElement): DiagramElement {
        let btnX, btnY, btnWidth, btnHeight;

        btnX = node.getPos().x || 0;
        btnY = node.getPos().y || 0;
        btnWidth = node.getSize().x || 60;
        btnHeight = node.getSize().y || 28;
        return SO.create({
            x: btnX,
            y: btnY,
            width: btnWidth,
            height: btnHeight,
            items: [
                {
                    tag: 'rect',
                    rx: 0,
                    x: 0,
                    y: 0,
                    width: btnWidth - 20,
                    height: btnHeight,
                    stroke: '#000',
                    fill: 'none'
                },
                {
                    tag: 'rect',
                    rx: 2,
                    x: btnWidth - 20,
                    y: 0,
                    width: 20,
                    height: 28,
                    stroke: '#000',
                    'class': 'SVGBtn'
                },
                {
                    tag: 'path',
                    style: 'fill:#000000;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1',
                    d: 'm ' + (btnWidth - 15) + ',13 10,0 L ' + (btnWidth - 10) + ',20 z'
                }
            ]
        });
    }

    public static drawClassicon(node: DiagramElement): DiagramElement {
        let btnX, btnY, btnWidth, btnHeight;

        btnX = node.getPos().x || 0;
        btnY = node.getPos().y || 0;
        btnWidth = node.getSize().x || 60;
        btnHeight = node.getSize().y || 28;
        return SO.create({
            x: btnX,
            y: btnY,
            width: btnWidth,
            height: btnHeight,
            items: [
                {
                    tag: 'path',
                    d: 'm0,0l10.78832,0l0,4.49982l-10.78832,0.19999l0,9.19963l10.78832,0l0,-9.49962l-10.78832,0.19999l0,-4.59982z',
                    style: 'fill:none;stroke:#000000;'
                },
                {
                    tag: 'path',
                    d: 'm25.68807,0l10.78832,0l0,4.49982l-10.78832,0.19999l0,9.19963l10.78832,0l0,-9.49962l-10.78832,0.2l0,-4.59982z',
                    style: 'fill:none;stroke:#000000;'
                },
                { tag: 'line', x1: 11, y1: 7, x2: 25, y2: 7, stroke: '#000' }
            ]
        });
    }

    public static drawClassWithEdgeicon(node: DiagramElement): DiagramElement {

        let btnX = 0, btnY = 0, btnWidth = 0, btnHeight = 0;
        return SO.create({
            x: btnX,
            y: btnY,
            id: node['id'],
            width: btnWidth,
            height: btnHeight,
            items: [
                {
                    tag: 'path',
                    d: 'M2,10 20,10 20,35 2,35 Z M2,17 20,17 M20,10 28,5 28,9 M 28.5,4.7 24,4',
                    style: 'fill:none;stroke:#000000;transform:scale(0.8);'
                }
            ]
        });
    }

    public static drawClass(node: DiagramElement): DiagramElement {

        let btnX = 0, btnY = 0, btnWidth = 0, btnHeight = 0;
        return SO.create({
            x: btnX,
            y: btnY,
            id: node['id'],
            width: '100%',
            height: '100%',
            items: [
                { tag: 'rect', width: 50, height: 40, x: 0, y: 0, 'stroke-width': 2, stroke: 'black', fill: 'none'},
                { tag: 'rect', width: 50, height: 12, x: 0, y: 18, 'stroke-width': 1, stroke: 'black', fill: 'none'},
                { tag: 'text', x: 27, y: 14, 'text-anchor': 'middle', 'font-size': 11, value: 'Class'},
                { tag: 'text', x: 5, y: 24, 'font-size': 5, value: '+ field: type'},
                { tag: 'text', x: 5, y: 36, 'font-size': 5, value: '+ method(type)'}
            ]
        });
    }
/*
<svg width="100%" height="100%" viewbox="0 0 550 450" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
    <text x="275" y="140" text-anchor="middle" font-size="111">Class</text>
        <text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>
*/

    public static drawEdgeicon(node: DiagramElement): DiagramElement {

        let btnX = 0, btnY = 0, btnWidth = 0, btnHeight = 0;
        return SO.create({
            x: btnX,
            y: btnY,
            id: node['id'],
            width: btnWidth,
            height: btnHeight,
            items: [
                {
                    tag: 'path',
                    d: 'M10,30 30,10 M19,10 30,10 30,21',
                    style: 'fill:none;stroke:#555;stroke-width:2;'
                }
            ]
        });
    }

    public static drawCopynode(node: DiagramElement): DiagramElement {

        let btnX = 0, btnY = 0, btnWidth = 0, btnHeight = 0;
        return SO.create({
            x: btnX,
            y: btnY,
            id: node['id'],
            width: btnWidth,
            height: btnHeight,
            items: [
                {
                    tag: 'path',
                    d: 'M5 5 L15 5 L15 20 L5 20 Z M5 10 L15 10',
                    style: 'fill:white;stroke:#000;stroke-width: 1;',
                    transform: 'scale(1.3) translate(4 4)'
                },
                {
                    tag: 'path',
                    d: 'M8 2 L18 2 L18 17 L8 17 Z M8 7 L18 7'
                        + 'M11 4.5 L15 4.5 '
                        + 'M10 10 L16 10 '
                        + 'M10 13 L16 13 ',
                    style: 'fill:white;stroke:#000;stroke-width: 1;',
                    transform: 'scale(1.3) translate(4 4)'
                }
            ]
        });
    }

    public static drawBasket(node: any): DiagramElement {
        let btnX = 0, btnY = 0, btnWidth = 0, btnHeight = 0;
        return SO.create({
            x: btnX,
            y: btnY,
            id: node['id'],
            background: node['brackground'] || false,
            width: btnWidth,
            height: btnHeight,
            items: [
                {
                    tag: 'path',
                    d: 'M12 12 L18 12 L18 11 L22 11 L22 12 L28 12 L28 14 L27 14 L27 29 L13 29 L13 14 L12 14 Z M13 14 L27 14 M20 17 L20 26 M17 16 L17 27 M23 16 L23 27',
                    style: 'fill:white;stroke:#000;stroke-width: 1;'
                }
            ]
        });
    }

    public static drawPencil(node: any): DiagramElement {
        let btnX = 0, btnY = 0, btnWidth = 0, btnHeight = 0;
        return SO.create({
            x: btnX,
            y: btnY,
            id: node['id'],
            background: node['brackground'] || false,
            width: btnWidth,
            height: btnHeight,
            items: [
                {
                    tag: 'path',
                    d: 'M6 20 L12 23 L33 23 L33 17 L12 17 Z M30 17 L30 23 M12 17 L12 23 M15 19 L28 19 M15 21 L28 21',
                    stroke: '#000',
                    'stroke-width': 1,
                    fill: 'white'
                }
            ]
        });
    }

    private static addText(y: number, offsetX: number, box: Element, text: string, textClass: string): Element {
        let item: Element;
        box.appendChild(Util.create({
            tag: 'text',
            $font: true,
            'text-anchor': 'left',
            width: 70,
            x: 10,
            y: y,
            class: textClass,
            value: text,
            eventValue: text
        }));
        if (textClass === 'SVGTEXT') {
            textClass = 'SVGChoiceText';
        } else {
            textClass = 'SVGChoice';
        }

        item = Util.create({
            tag: 'rect',
            rx: 0,
            x: offsetX,
            y: y - 18,
            width: 70,
            height: 24,
            stroke: 'none',
            class: textClass,
        });
        item['eventValue'] = text;
        box.appendChild(item);
        return item;
    }

    public getToolBarIcon(): Element {
        return null;
    }

}
