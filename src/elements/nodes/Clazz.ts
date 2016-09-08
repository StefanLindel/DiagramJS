import { Point } from '../BaseElements';
import { Node } from './Node';

export class Clazz extends Node {

  private attributes: Array<string> = [];
  private methods: Array<string> = [];

  constructor(id?: string, type?: string) {
    super(id, type);
    this.height = this.labelHeight;
  };

  public init(json) {
    if (json['attributes']) {
      for (let attr of json['attributes']) {
        this.attributes.push(attr);
        this.height += this.attrHeight;
      }
    }
    if (json['methods']) {
      for (let method of json['methods']) {
        this.methods.push(method);
        this.height += this.attrHeight;
      }
    }
  }

  public getSVG(offset: Point): Element {
    let pos = offset.sum(this.pos);

    // = = = LABEL = = =
    let attrLabel = {
      tag: 'rect',
      x: pos.x - this.width / 2,
      y: pos.y - this.height / 2,
      height: this.height,
      width: this.width,
      style: 'fill:white;stroke:black;stroke-width:2'
    };
    let shape = this.createShape(attrLabel);

    let attrLabelText = {
      tag: 'text',
      x: pos.x,
      y: pos.y - this.height / 2 + this.labelHeight / 2,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
      'font-family': 'Verdana',
      'font-size': this.labelFontSize,
      fill: 'black'
    };
    let text = this.createShape(attrLabelText);
    text.textContent = this.id;

    let group = this.createShape({ tag: 'g', id: this.id, transform: 'translate(0 0)' });
    group.appendChild(shape);
    group.appendChild(text);

    // = = = ATTRIBUTES = = =
    let height = this.attributes.length * this.attrHeight;
    if (this.attributes.length > 0) {
      let attr = {
        tag: 'rect',
        x: pos.x - this.width / 2,
        y: pos.y - this.height / 2 + this.labelHeight ,
        height: height,
        width: this.width,
        style: 'fill:white;stroke:black;stroke-width:2'
      };
      let shape = this.createShape(attr);
      group.appendChild(shape);

      let y = pos.y - this.height / 2 + this.labelHeight + this.attrFontSize;
      for (let element of this.attributes) {
        let attrText = {
          tag: 'text',
          x: pos.x - this.width / 2 + 5,
          y: y,
          'text-anchor': 'start',
          'alignment-baseline': 'middle',
          'font-family': 'Verdana',
          'font-size': this.attrFontSize,
          fill: 'black'
        };
        let text = this.createShape(attrText);
        text.textContent = element;
        group.appendChild(text);
        y += this.attrHeight;
      }
    }

    // = = = METHODS = = =
    let y = pos.y - this.height / 2 + this.labelHeight + height;
    if (this.methods.length > 0) {
      let height = this.methods.length * this.attrHeight;
      let attr = {
        tag: 'rect',
        x: pos.x - this.width / 2,
        y: y,
        height: height,
        width: this.width,
        style: 'fill:white;stroke:black;stroke-width:2'
      };
      let shape = this.createShape(attr);
      group.appendChild(shape);

      y += this.attrHeight / 2;
      for (let element of this.methods) {
        let attrText = {
          tag: 'text',
          x: pos.x - this.width / 2 + 5,
          y: y,
          'text-anchor': 'start',
          'alignment-baseline': 'middle',
          'font-family': 'Verdana',
          'font-size': this.attrFontSize,
          fill: 'black'
        };
        let text = this.createShape(attrText);
        text.textContent = element;
        group.appendChild(text);
        y += this.attrHeight;
      }
    }
    this.addListener(group, this);
    return group;
  }

}
