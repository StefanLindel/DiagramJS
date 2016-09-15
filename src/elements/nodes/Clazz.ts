import { Node } from './Node';
import { EventBus } from '../../core/EventBus';

export class Clazz extends Node {

  private attributes: string[] = [];
  private methods: string[] = [];
  private padding = 10;

  constructor(id?: string, type?: string) {
    super(id, type);
    this.getSize().y = this.labelHeight + this.padding * 2;
  };

  public init(json) : Clazz {

    this.label = json.name || json.label || ('New ' + this.type);

    if (json['attributes']) {
      for (let attr of json['attributes']) {
        this.attributes.push(attr);
        this.getSize().y += this.attrHeight;
      }
    }
    if (json['methods']) {
      for (let method of json['methods']) {
        this.methods.push(method);
        this.getSize().y += this.attrHeight;
      }
    }
    return this;
  }

  public getSVG(): Element {
    const pos = this.getPos();

    const attrNode = {
      tag: 'rect',
      x: pos.x - this.getSize().x / 2,
      y: pos.y - this.getSize().y / 2,
      height: this.getSize().y,
      width: this.getSize().x,
      rx: 1,
      ry: 1,
      style: 'fill:white;stroke:black;stroke-width:2'
    };
    const nodeShape = this.createShape(attrNode);

    const contentHeight = this.padding + this.attrHeight * this.attributes.length;
    const attrContent = {
      tag: 'rect',
      x: pos.x - this.getSize().x / 2,
      y: pos.y - this.getSize().y / 2  + this.labelHeight,
      height: contentHeight,
      width: this.getSize().x,
      style: 'fill:white;stroke:black;stroke-width:2'
    };
    const contentShape = this.createShape(attrContent);

    // = = = LABEL = = =
    const attrLabel = {
      tag: 'text',
      x: pos.x,
      y: pos.y - this.getSize().y / 2 + this.labelHeight / 2,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
      'font-family': 'Verdana',
      'font-size': this.labelFontSize,
      'font-weight': 'bold',
      fill: 'black'
    };
    let label = this.createShape(attrLabel);
    label.textContent = this.label;

    let group = this.createShape({ tag: 'g', id: this.id, transform: 'translate(0 0)' });
    group.appendChild(nodeShape);
    group.appendChild(contentShape);
    group.appendChild(label);

    // = = = ATTRIBUTES = = =
    if (this.attributes.length > 0) {
      let y = pos.y - this.getSize().y / 2 + this.labelHeight + this.attrHeight / 2 + this.padding / 2;
      for (let element of this.attributes) {
        const attrText = {
          tag: 'text',
          x: pos.x - this.getSize().x / 2 + this.padding / 2,
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
    let y = pos.y - this.getSize().y  / 2 + this.labelHeight + height + this.attrHeight / 2 + this.padding / 2;
    if (this.methods.length > 0) {
      y += this.attrHeight / 2;
      for (let element of this.methods) {
        const attrText = {
          tag: 'text',
          x: pos.x - this.getSize().x / 2 + this.padding / 2,
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

    this.$view = group;
    EventBus.register(this, 'mousedown', 'mousemove', 'click', 'dblclick', 'editor', 'drag');

    return group;
  }

  public getPropertyAsString(type: string): string {
    let value = '';
    if (this[type]) {
      for (let property of this[type]) {
        value += property + '\n';
      }
    }
    return value;
  }

  // returns true if new properties are different from old ones
  public convertStringToProperty(values: string, type: string): boolean {
    if (!this[type]) {
      return false;
    }

    let properties = values.split(/\r?\n/);
    let newProperties: string[] = [];
    for (let property of properties) {
      if (property && property.length > 0) {
        newProperties.push(property);
      }
    }

    let changed = false;
    if (this[type].length !== newProperties.length) {
      changed = true;
    }
    else {
      for (let i = 0; i < this[type].length; i++) {
        if (!this[type][i] || !newProperties[i] || this[type][i] !== newProperties[i]) {
          changed = true;
        }
      }
    }

    if (changed) {
      this[type] = newProperties;
      this.getSize().y = this.labelHeight + this.padding * 2 + (this.attributes.length + this.methods.length) * this.attrHeight;
    }
    return changed;
  }

}
