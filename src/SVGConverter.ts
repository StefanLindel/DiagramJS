/*
 NetworkParser
 Copyright (c) 2011 - 2014, Stefan Lindel
 All rights reserved.

 Licensed under the EUPL, Version 1.1 or (as soon they
 will be approved by the European Commission) subsequent
 versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
 You may obtain a copy of the Licence at:

 http://ec.europa.eu/idabc/eupl5

 Unless required by applicable law or agreed to in
 writing, software distributed under the Licence is
 distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied.
 See the Licence for the specific language governing
 permissions and limitations under the Licence.
*/
import {RGBColor} from './RGBColor';
import {JSEPS} from "./JSEPS";

const epsSvgAttr = {
    // allowed attributes. all others are removed from the preview.
    g: ['stroke', 'fill', 'stroke-width'],
    line: ['x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width'],
    rect: ['x', 'y', 'width', 'height', 'stroke', 'fill', 'stroke-width'],
    ellipse: ['cx', 'cy', 'rx', 'ry', 'stroke', 'fill', 'stroke-width'],
    circle: ['cx', 'cy', 'r', 'stroke', 'fill', 'stroke-width'],
    text: ['x', 'y', 'font-size', 'font-family', 'text-anchor', 'font-weight', 'font-style', 'fill'],
    path: ['']
};
export class SVGConverter {
    private k: number;
    private remove: boolean;
    private target: any;

    constructor(element: any, target: any, options: any) {
        this.k = 1.0;
        let hasScale = typeof (options.scale), hasRemoveInvalid = typeof (options.removeInvalid);
        this.k = (options && hasScale !== 'undefined' ? options.scale : 1.0);
        this.remove = (options && hasRemoveInvalid !== 'undefined' ? options.removeInvalid : false);
        this.target = target;
        this.parse(element);
    }

    public parse(element: any) {
        let el, i, n, colorMode, hasFillColor, fillRGB, fillColor, strokeColor, strokeRGB, fontType, pdfFontSize, x, y,
            box, xOffset;
        if (!element) {
            return;
        }
        if (typeof element === 'string') {
            el = document.createElement('div');
            el.innerHTML = element;
            element = el.childNodes[0];
        }
        for (i = 0; i < element.children.length; i += 1) {
            n = element.children[i];
            colorMode = null;
            hasFillColor = false;
            if ('g,line,rect,ellipse,circle,text'.indexOf(n.tagName) >= 0) {
                fillColor = n.getAttribute('fill');
                if (fillColor) {
                    fillRGB = new RGBColor(fillColor);
                    if (fillRGB.ok) {
                        hasFillColor = true;
                        colorMode = 'F';
                    }
                }
            }
            if ('g,line,rect,ellipse,circle'.indexOf(n.tagName) >= 0) {
                if (hasFillColor) {
                    this.target.setFillColor(fillRGB.r, fillRGB.g, fillRGB.b);
                }
                strokeColor = n.getAttribute('stroke');
                if (n.hasAttribute('stroke-width')) {
                    this.target.setLineWidth(this.attr(n, 'stroke-width'));
                }
                if (strokeColor) {
                    strokeRGB = new RGBColor(strokeColor);
                    if (strokeRGB.ok) {
                        this.target.setDrawColor(strokeRGB.r, strokeRGB.g, strokeRGB.b);
                        if (colorMode === 'F') {
                            colorMode = 'FD';
                        } else if (!hasFillColor) {
                            colorMode = 'S';
                        }
                    } else {
                        colorMode = null;
                    }
                }
            }
            // console.log("write "+n.tagName);
            switch (n.tagName.toLowerCase()) {
                case 'svg':
                case 'a':
                case 'g':
                    this.parse(n);
                    break;
                case 'line':
                    this.target.line(this.attr(n, 'x1'), this.attr(n, 'y1'), this.attr(n, 'x2'), this.attr(n, 'y2'));
                    break;
                case 'rect':
                    this.target.rect(this.attr(n, 'x'), this.attr(n, 'y'), this.attr(n, 'width'), this.attr(n, 'height'), n.getAttribute('style'));
                    break;
                case 'ellipse':
                    this.target.ellipse(this.attr(n, 'cx'), this.attr(n, 'cy'), this.attr(n, 'rx'), this.attr(n, 'ry'), colorMode);
                    break;
                case 'circle':
                    this.target.circle(this.attr(n, 'cx'), this.attr(n, 'cy'), this.attr(n, 'r'), colorMode);
                    break;
                case 'text':
                    if (n.hasAttribute('font-family')) {
                        switch (n.getAttribute('font-family').toLowerCase()) {
                            case 'serif':
                                this.target.setFont('times');
                                break;
                            case 'monospace':
                                this.target.setFont('courier');
                                break;
                            default:
                                n.getAttribute('font-family', 'sans-serif');
                                this.target.setFont('Helvetica');
                        }
                    }
                    if (hasFillColor) {
                        this.target.setTextColor(fillRGB.r, fillRGB.g, fillRGB.b);
                    }
                    if (this.target instanceof JSEPS) {
                        this.target.text(this.attr(n, 'x'), this.attr(n, 'y'), n.innerHTML);
                        break;
                    }
                    fontType = '';
                    if (n.hasAttribute('font-weight')) {
                        if (n.getAttribute('font-weight') === 'bold') {
                            fontType = 'bold';
                        }
                    }
                    if (n.hasAttribute('font-style')) {
                        if (n.getAttribute('font-style') === 'italic') {
                            fontType += 'italic';
                        }
                    }
                    this.target.setFontType(fontType);
                    pdfFontSize = 16;
                    if (n.hasAttribute('font-size')) {
                        pdfFontSize = parseInt(n.getAttribute('font-size'), 10);
                    }
                    box = n.getBBox();
                    // FIXME: use more accurate positioning!!
                    x = this.attr(n, 'x');
                    y = this.attr(n, 'y');
                    xOffset = 0;
                    if (n.hasAttribute('text-anchor')) {
                        switch (n.getAttribute('text-anchor')) {
                            case 'end':
                                xOffset = box.width;
                                break;
                            case 'middle':
                                xOffset = box.width / 2;
                                break;
                            case 'start':
                                break;
                            case 'default':
                                n.getAttribute('text-anchor', 'start');
                                break;
                        }
                        x = x - (xOffset * this.k);
                    }
                    this.target.setFontSize(pdfFontSize).text(x, y, n.innerHTML);
                    break;
                default:
                    if (this.remove) {
                        console.log('cant translate to target:', n);
                        element.removeChild(n);
                        i -= 1;
                    }
            }
        }
    }

    public attr(node: any, name: string) {
        return this.k * parseInt(node.getAttribute(name), 10);
    }
}
