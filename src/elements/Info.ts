import EventBus from '../core/EventBus';
import { create, setPos, sizeOf } from '../util';
import { Node } from './nodes';

export default class Info extends Node {

  public custom: boolean;
  private property: string;
  private cardinality: string;
  private $angle: number;
  private $counter: number;

  constructor(info: any, parent: Node, counter: number) {
    super('Info');
    if (typeof (info) === 'string') {
      this.id = info;
    } else {
      if (info.property) {
        this.property = info.property;
      }
      if (info.cardinality) {
        this.cardinality = info.cardinality;
      }
      this.id = info.id;
    }
    this.$parent = parent;
    this.$isDraggable = true;
    this.$counter = counter;
  }

  public drawSVG(draw?: boolean): HTMLElement {
    let text: string = this.getText(), child, group, i: number, items: Array<string> = text.split('\n');
    if (text.length < 1) {
      return null;
    }
    if (items.length > 1) {
      group = create({ tag: 'g', 'class': 'draggable', rotate: this.$angle, model: this });
      for (i = 0; i < items.length; i += 1) {
        let pos = this.getPos();
        child = create({
          tag: 'text',
          $font: true,
          'text-anchor': 'left',
          'x': pos.x,
          'y': pos.y
          + (this.getSize().y * i)
        });
        child.appendChild(document.createTextNode(items[i]));
        group.appendChild(child);
      }
      this.fireEvent(this, EventBus.EVENT.CREATED, group);
      return group;
    }

    let pos = this.getPos();

    group = create({
      tag: 'text',
      '#$font': true,
      'text-anchor': 'left',
      'x': pos.x,
      'y': pos.y,
      value: text,
      'id': this.id,
      'class': 'draggable InfoText',
      rotate: this.$angle,
      model: this
    });
    this.fireEvent(this, EventBus.EVENT.CREATED, group);
    return group;
  };

  public drawHTML(draw?: boolean): HTMLElement {
    let text: string = this.getText(), info;
    info = create({ tag: 'div', $font: true, model: this, 'class': 'EdgeInfo', value: text });
    if (this.$angle !== 0) {
      info.style.transform = 'rotate(' + this.$angle + 'deg)';
      info.style.msTransform = info.style.MozTransform = info.style.WebkitTransform = info.style.OTransform = 'rotate(' + this.$angle + 'deg)';
    }
    let pos = this.getPos();
    setPos(info, pos.x, pos.y);
    this.fireEvent(this, 'created', info);
    return info;
  }

  public getText(): string {
    let isProperty: boolean, isCardinality: boolean, infoTxt: string = '', graph: any = this.$parent;
    isCardinality = graph.typ === 'classdiagram' && graph.options.CardinalityInfo;
    isProperty = graph.options.propertyinfo;

    if (isProperty && this.property) {
      infoTxt = this.property;
    }
    if (isCardinality && this.cardinality) {
      if (infoTxt.length > 0) {
        infoTxt += '\n';
      }
      if (this.cardinality.toLowerCase() === 'one') {
        infoTxt += '0..1';
      } else if (this.cardinality.toLowerCase() === 'many') {
        infoTxt += '0..*';
      }
    }
    if (this.$counter > 0) {
      infoTxt += ' (' + this.$counter + ')';
    }
    return infoTxt;
  }

  public initInfo(): string {
    let root: any = this.$parent.getRoot();
    if (!root.model.options.CardinalityInfo && !root.model.options.propertyinfo) {
      return null;
    }
    let infoTxt = this.getText();
    if (infoTxt.length > 0) {
      sizeOf(infoTxt, root, this);
    }
    return infoTxt;
  }

}
