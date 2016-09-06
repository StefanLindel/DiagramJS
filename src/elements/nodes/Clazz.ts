import { Point } from '../BaseElements';
import { Node } from './Node';

const LABEL_HEIGHT = 25;
const ATTRIBUTE_HEIGHT = 20;
const LABEL_FONTSIZE = 14;
const ATTRIBUTE_FONTSIZE = 12;

export class Clazz extends Node {

  private attributes: Array<string> = [];
  private methods: Array<string> = [];

  constructor(id?: string) {
    super(id, 'Clazz');
    this.height = LABEL_HEIGHT;
  };

  public init(json) {
    if (json['attributes']) {
      for (let attr of json['attributes']) {
        this.attributes.push(attr);
        this.height += ATTRIBUTE_HEIGHT;
      }
    }
    if (json['methods']) {
      for (let method of json['methods']) {
        this.methods.push(method);
        this.height += ATTRIBUTE_HEIGHT;
      }
    }
  }

  public getSVG(offset: Point): Element {
    let pos = offset.sum(this.pos);

    // = = = LABEL = = =
    let attrLabel = {
      tag: 'rect',
      id: this.id,
      x: pos.x - this.width / 2,
      y: pos.y - this.height / 2,
      height: this.height,
      width: this.width,
      style: 'fill:none;stroke:black;stroke-width:2'
    };
    let shape = this.createShape(attrLabel);

    let attrLabelText = {
      tag: 'text',
      x: pos.x,
      y: pos.y - this.height / 2 + LABEL_HEIGHT / 2,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
      'font-family': 'Verdana',
      'font-size': LABEL_FONTSIZE,
      fill: 'black'
    };
    let text = this.createShape(attrLabelText);
    text.textContent = this.id;

    let group = this.createShape({ tag: 'g' });
    group.appendChild(shape);
    group.appendChild(text);

    // = = = ATTRIBUTES = = =
    let height = this.attributes.length * ATTRIBUTE_HEIGHT;
    if (this.attributes.length > 0) {
      let attr = {
        tag: 'rect',
        x: pos.x - this.width / 2,
        y: pos.y - this.height / 2 + LABEL_HEIGHT,
        height: height,
        width: this.width,
        style: 'fill:none;stroke:black;stroke-width:2'
      };
      let shape = this.createShape(attr);
      group.appendChild(shape);

      let y = pos.y - this.height / 2 + LABEL_HEIGHT + ATTRIBUTE_FONTSIZE;
      for (let element of this.attributes) {
        let attrText = {
          tag: 'text',
          x: pos.x - this.width / 2 + 5,
          y: y,
          'text-anchor': 'start',
          'alignment-baseline': 'middle',
          'font-family': 'Verdana',
          'font-size': ATTRIBUTE_FONTSIZE,
          fill: 'black'
        };
        let text = this.createShape(attrText);
        text.textContent = element;
        group.appendChild(text);
        y += ATTRIBUTE_HEIGHT;
      }
    }

    // = = = METHODS = = =
    let y = pos.y - this.height / 2 + LABEL_HEIGHT + height;
    if (this.methods.length > 0) {
      let height = this.methods.length * ATTRIBUTE_HEIGHT;
      let attr = {
        tag: 'rect',
        x: pos.x - this.width / 2,
        y: y,
        height: height,
        width: this.width,
        style: 'fill:none;stroke:black;stroke-width:2'
      };
      let shape = this.createShape(attr);
      group.appendChild(shape);

      y += ATTRIBUTE_HEIGHT / 2;
      for (let element of this.methods) {
        let attrText = {
          tag: 'text',
          x: pos.x - this.width / 2 + 5,
          y: y,
          'text-anchor': 'start',
          'alignment-baseline': 'middle',
          'font-family': 'Verdana',
          'font-size': ATTRIBUTE_FONTSIZE,
          fill: 'black'
        };
        let text = this.createShape(attrText);
        text.textContent = element;
        group.appendChild(text);
        y += ATTRIBUTE_HEIGHT;
      }
    }

    return group;
  }

}
