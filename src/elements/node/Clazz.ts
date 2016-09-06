import SymbolLibary from '../../core/SymbolLibary';
import { create, createCell, getStyle, setPos, sizeOf } from '../../util';
import { Node } from './Node';

export class Clazz extends Node {

  private attributes: Array<string> = [];
  private methods: Array<string> = [];

  constructor() { super('Clazz'); };

  public init(json) {
    let i: number, value;
    value = json['attributes'];
    for (i = 0; i < value.length; i++) {
      this.attributes.push(value[i]);
    }
    value = json['methods'];
    for (i = 0; i < value.length; i++) {
      this.methods.push(value[i]);
    }
  }

  public drawSVG(draw?: boolean) {
    let width, height, id, size, x, y, z, item, rect, g, board, styleHeader, headerHeight;
    board = this.getRoot()['board'];
    styleHeader = getStyle('ClazzHeader');
    headerHeight = styleHeader.getNumber('height');
    width = 0;
    height = 10 + headerHeight;

    if (this.typ === 'Object' || this.getRoot()['model'].typ.toLowerCase() === 'objectdiagram') {
      id = this.id.charAt(0).toLowerCase() + this.id.slice(1);
      item = 'Object';
    } else {
      id = this.id;
      item = 'Clazz';
      if (this.counter) {
        id += ' (' + this.counter + ')';
      }
    }

    g = create({ tag: 'g', model: this });
    size = sizeOf(id, this);
    width = Math.max(width, size.width);

    if (this.attributes && this.attributes.length > 0) {
      height = height + this.attributes.length * 25;
      for (z = 0; z < this.attributes.length; z += 1) {
        width = Math.max(width, sizeOf(this.attributes[z], this).width);
      }
    } else {
      height += 20;
    }
    if (this.methods && this.methods.length > 0) {
      height = height + this.methods.length * 25;
      for (z = 0; z < this.methods.length; z += 1) {
        width = Math.max(width, sizeOf(this.methods[z], this).width);
      }
    }
    width += 20;

    let pos = this.getPos();
    y = pos.y;
    x = pos.x;

    rect = {
      tag: 'rect',
      'width': width,
      'height': height,
      'x': x,
      'y': y,
      'class': item + ' draggable',
      'fill': 'none'
    };
    g.appendChild(create(rect));
    g.appendChild(create({
      tag: 'rect',
      rx: 0,
      'x': x,
      'y': y,
      height: headerHeight,
      'width': width,
      'class': 'ClazzHeader'
    }));

    item = create({
      tag: 'text',
      $font: true,
      'class': 'InfoText',
      'text-anchor': 'right',
      'x': x + width / 2 - size.width / 2,
      'y': y + (headerHeight / 2) + (size.height / 2),
      'width': size.width
    });

    if (this.typ === 'Object' || this.getRoot()['model'].typ.toLowerCase() === 'objectdiagram') {
      item.setAttribute('text-decoration', 'underline');
    }
    item.appendChild(document.createTextNode(id));

    g.appendChild(item);
    g.appendChild(create({
      tag: 'line',
      x1: x,
      y1: y + headerHeight,
      x2: x + width,
      y2: y + headerHeight,
      stroke: '#000'
    }));
    y += headerHeight + 20;

    if (this.attributes) {
      for (z = 0; z < this.attributes.length; z += 1) {
        g.appendChild(create({
          tag: 'text',
          $font: true,
          'text-anchor': 'left',
          'width': width,
          'x': (x + 10),
          'y': y,
          value: this.attributes[z]
        }));
        y += 20;
      }
      if (this.attributes.length > 0) {
        y -= 10;
      }
    }
    if (this.methods && this.methods.length > 0) {
      g.appendChild(create({ tag: 'line', x1: x, y1: y, x2: x + width, y2: y, stroke: '#000' }));
      y += 20;
      for (z = 0; z < this.methods.length; z += 1) {
        g.appendChild(create({
          tag: 'text',
          $font: true,
          'text-anchor': 'left',
          'width': width,
          'x': x + 10,
          'y': y,
          value: this.methods[z]
        }));
        y += 20;
      }
    }
    return g;
  }

  public drawHTML() {
    let first, z, cell, item, model, htmlElement = create({ tag: 'div', model: this }), pos = this.getPos();
    model = this.getRoot()['model'];
    htmlElement.className = 'classElement';
    setPos(htmlElement, pos.x, pos.y);
    htmlElement.style.zIndex = 5000;

    model.createdElement(htmlElement, 'class', this);
    item = create({ tag: 'table', border: '0', style: { width: '100%', height: '100%' } });
    htmlElement.appendChild(item);
    if (this['head'] && this['head'].$src) {
      cell = createCell(item, 'td', this);
      cell.style['textAlign'] = 'center';
      if (!this['head'].$img) {
        this['head'].$img = {};
        this['head'].$img.src = this['head'].$src;
        this['head'].$img.width = this['head'].$width;
        this['head'].$img.height = this['head'].$height;
      }
      z = SymbolLibary.createImage(this['head'].$img, this);
      if (z) {
        cell.appendChild(z);
      }
    }
    if (this['headinfo']) {
      createCell(item, 'td', this, this['headinfo']).className = 'head';
    }

    if (model.typ.toLowerCase() === 'objectdiagram') {
      z = this.id.charAt(0).toLowerCase() + this.id.slice(1);
    } else {
      z = this.id;
    }
    if (this['href']) {
      z = '<a href=\'' + this['href'] + '\'>' + z + '</a>';
    }
    cell = createCell(item, 'th', this, z, 'id');
    if (model.typ.toLowerCase() === 'objectdiagram') {
      cell.style['textDecorationLine'] = 'underline';
    }
    cell = null;
    if (this.attributes) {
      first = true;
      for (z = 0; z < this.attributes.length; z += 1) {
        cell = createCell(item, 'td', this, this.attributes[z], 'attribute');
        if (!first) {
          cell.className = 'attributes';
        } else {
          cell.className = 'attributes first';
          first = false;
        }
      }
    }
    if (this.methods) {
      first = true;
      for (z = 0; z < this.methods.length; z += 1) {
        cell = createCell(item, 'td', this, this.methods[z], 'method');
        if (!first) {
          cell.className = 'methods';
        } else {
          cell.className = 'methods first';
          first = false;
        }
      }
    }
    if (!cell) {
      cell = createCell(item, 'td', this, '&nbsp;');
      cell.className = 'first';
      this.fireEvent(this, 'empty', cell);
    }
    htmlElement.appendChild(item);
    htmlElement.node = this;
    this.$gui = htmlElement;
    return htmlElement;
  }

}
