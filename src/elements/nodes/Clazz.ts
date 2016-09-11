import { Node } from './Node';
import { EventBus } from '../../core/EventBus';

export class Clazz extends Node {

  private attributes: string[] = [];
  private methods: string[] = [];
  private padding = 10;

  constructor(id?: string, type?: string) {
    super(id, type);
    this.height = this.labelHeight + this.padding * 2;
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

  public getSVG(): Element {
    const pos = this.pos;

    const attrNode = {
      tag: 'rect',
      x: pos.x - this.width / 2,
      y: pos.y - this.height / 2,
      height: this.height,
      width: this.width,
      rx: 1,
      ry: 1,
      style: 'fill:white;stroke:black;stroke-width:2'
    };
    const nodeShape = this.createShape(attrNode);

    const contentHeight = this.padding + this.attrHeight * this.attributes.length;
    const attrContent = {
      tag: 'rect',
      x: pos.x - this.width / 2,
      y: pos.y - this.height / 2  + this.labelHeight,
      height: contentHeight,
      width: this.width,
      style: 'fill:white;stroke:black;stroke-width:2'
    };
    const contentShape = this.createShape(attrContent);

    // = = = LABEL = = =
    const attrLabel = {
      tag: 'text',
      x: pos.x,
      y: pos.y - this.height / 2 + this.labelHeight / 2,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
      'font-family': 'Verdana',
      'font-size': this.labelFontSize,
      'font-weight': 'bold',
      fill: 'black'
    };
    let label = this.createShape(attrLabel);
    label.textContent = this.id;

    let group = this.createShape({ tag: 'g', id: this.id, transform: 'translate(0 0)' });
    group.appendChild(nodeShape);
    group.appendChild(contentShape);
    group.appendChild(label);

    // = = = ATTRIBUTES = = =
    if (this.attributes.length > 0) {
      let y = pos.y - this.height / 2 + this.labelHeight + this.attrHeight / 2 + this.padding / 2;
      for (let element of this.attributes) {
        const attrText = {
          tag: 'text',
          x: pos.x - this.width / 2 + this.padding / 2,
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
    let height = this.attributes.length * this.attrHeight;
    let y = pos.y - this.height / 2 + this.labelHeight + height + this.attrHeight / 2 + this.padding / 2;
    if (this.methods.length > 0) {
      y += this.attrHeight / 2;
      for (let element of this.methods) {
        const attrText = {
          tag: 'text',
          x: pos.x - this.width / 2 + this.padding / 2,
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

    EventBus.register(group, this, 'mousedown', 'mousemove');
    this.view = group;
    return group;
  }

}
