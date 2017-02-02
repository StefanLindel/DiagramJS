import { Node } from './Node';
//import { EventBus } from '../../EventBus';
import { util } from '../../util';
import {Control} from "../../Control";

export class Clazz extends Node {

  private attributes: string[] = [];
  private methods: string[] = [];
  private padding = 10;
	private style:string;

  constructor(owner:Control, id?: string, type?: string) {
    super(owner, id, type);
    this.getSize().y = this.labelHeight + this.padding * 2;
  };

  public init(json) : Clazz {

    this.label = json.name || json.label || ('New ' + this.property);
		this.style=json.style || "flat";

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

	private getModernStyle() : Element {
		let width, height, id, size, z, item, rect, g, board, styleHeader, headerHeight, x, y;
		board = this.getRoot()["board"];
		styleHeader = util.getStyle("ClazzHeader");
		headerHeight = styleHeader.getNumber("height");
		width = 0;
		height = 10 + headerHeight;

		if (this.property === "Object" || this.getRoot()["model"].getType().toLowerCase() === "objectdiagram") {
			id = this.id.charAt(0).toLowerCase() + this.id.slice(1);
			item = "Object";
		} else {
			id = this.id;
			item = "Clazz";
			if (this.counter) {
				id += " (" + this.counter + ")";
			}
		}
		g = util.create({tag: "g", model: this});
		size = util.sizeOf(id, this);
		width = Math.max(width, size.width);
		if (this.attributes && this.attributes.length > 0) {
			height = height + this.attributes.length * 25;
			for (z = 0; z < this.attributes.length; z += 1) {
				width = Math.max(width, util.sizeOf(this.attributes[z], this).width);
			}
		} else {
			height += 20;
		}
		if (this.methods && this.methods.length > 0) {
			height = height + this.methods.length * 25;
			for (z = 0; z < this.methods.length; z += 1) {
				width = Math.max(width, util.sizeOf(this.methods[z], this).width);
			}
		}
		width += 20;

		var pos = this.getPos();
		y = pos.y;
		x = pos.x;

		rect = {
			tag: "rect",
			"width": width,
			"height": height,
			"x": x,
			"y": y,
			"class": item + " draggable",
			"fill": "none"
		};
		g.appendChild(util.create(rect));
		g.appendChild(util.create({
			tag: "rect",
			rx: 0,
			"x": x,
			"y": y,
			height: headerHeight,
			"width": width,
			"class": "ClazzHeader"
		}));

		item = util.create({
			tag: "text",
			$font: true,
			"class": "InfoText",
			"text-anchor": "right",
			"x": x + width / 2 - size.width / 2,
			"y": y + (headerHeight / 2) + (size.height/2),
			"width": size.width
		});

		if (this.property === "Object" || this.getRoot()["model"].type.toLowerCase() === "objectdiagram") {
			item.setAttribute("text-decoration", "underline");
		}
		item.appendChild(document.createTextNode(id));

		g.appendChild(item);
		g.appendChild(util.create({
			tag: "line",
			x1: x,
			y1: y + headerHeight,
			x2: x + width,
			y2: y + headerHeight,
			stroke: "#000"
		}));
		y += headerHeight + 20;

		if (this.attributes) {
			for (z = 0; z < this.attributes.length; z += 1) {
				g.appendChild(util.create({
					tag: "text",
					$font: true,
					"text-anchor": "left",
					"width": width,
					"x": (x + 10),
					"y": y,
					value: this.attributes[z]
				}));
				y += 20;
			}
			if (this.attributes.length > 0) {
				y -= 10;
			}
		}
		if (this.methods && this.methods.length > 0) {
			g.appendChild(util.create({tag: "line", x1: x, y1: y, x2: x + width, y2: y, stroke: "#000"}));
			y += 20;
			for (z = 0; z < this.methods.length; z += 1) {
				g.appendChild(util.create({
					tag: "text",
					$font: true,
					"text-anchor": "left",
					"width": width,
					"x": x + 10,
					"y": y,
					value: this.methods[z]
				}));
				y += 20;
			}
		}
		return g;
	}
  public getSVG(): Element {
    const pos = this.getPos();

		if(this.style == "modern") {
			return this.getModernStyle();
		}
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
		//FIXME EventBus.register(this, 'mousedown', 'mousemove', 'click', 'dblclick', 'editor', 'drag');
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
