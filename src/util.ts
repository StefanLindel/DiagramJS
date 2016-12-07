import { CSS } from './CSS';
import { Node } from './elements/nodes/Node';
import { DiagramElement } from './elements/BaseElements';

export class util {
	static getRandomInt(min, max): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	static createShape(attrs): SVGSVGElement {
		let xmlns = attrs.xmlns || 'http://www.w3.org/2000/svg';
		let shape = document.createElementNS(xmlns, attrs.tag);
		for (let attr in attrs) {
			if (attr !== 'tag') {
				shape.setAttribute(attr, attrs[attr]);

		}
		}
		return <SVGSVGElement><any>shape;
	}
	static toPascalCase(value: string) :string {
		value = value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
		return value;
	};
	static isSVG(tag:string) : boolean{
		let i, list = ['svg', 'path', 'polygon', 'polyline', 'line', 'rect', 'filter', 'feGaussianBlur', 'feOffset', 'feBlend', 'linearGradient', 'stop', 'text', 'symbol', 'textPath', 'defs', 'fegaussianblur', 'feoffset', 'feblend', 'circle', 'ellipse', 'g'];
		for (i = 0; i < list.length; i += 1) {
			if (list[i] === tag) {
				return true;
			}
		}
		return false;
	}
	static create(node: any) : HTMLElement {
		let style, item, xmlns, key, tag, k;
		if (document.createElementNS && (this.isSVG(node.tag) || node.xmlns)) {
			if (node.xmlns) {
				xmlns = node.xmlns;
			} else {
				xmlns = 'http://www.w3.org/2000/svg';
			}
			if (node.tag === 'img' && xmlns) {
				item = document.createElementNS(xmlns, 'image');
				item.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
				item.setAttributeNS('http://www.w3.org/1999/xlink', 'href', node.src);
			} else {
				item = document.createElementNS(xmlns, node.tag);
			}
		} else {
			item = document.createElement(node.tag);
		}
		tag = node.tag.toLowerCase();
		for (key in node) {
			if (!node.hasOwnProperty(key)) {
				continue;
			}
			k = key.toLowerCase();
			if (node[key] === null) {
				continue;
			}
			if (k === 'tag' || k.charAt(0) === '$' || k === 'model') {
				continue;
			}
			if (k.charAt(0) === '#') {
				item[k.substring(1)] = node[key];
				continue;
			}
			if (k === 'rotate') {
				item.setAttribute('transform', 'rotate(' + node[key] + ',' + node.model.x + ',' + node.model.y + ')');
				continue;
			}
			if (k === 'value') {
				if (!node[key]) {
					continue;
				}
				if (tag !== 'input') {
					if (tag === 'text') {// SVG
						item.appendChild(document.createTextNode(node[key]));
					} else {
						item.innerHTML = node[key];
					}
				} else {
					item[key] = node[key];
				}
				continue;
			}
			if (k.indexOf('on') === 0) {
				this.bind(item, k.substring(2), node[key]);
				continue;
			}
			if (k.indexOf('-') >= 0) {
				item.style[key] = node[key];
			} else {
				if (k === 'style' && typeof (node[key]) === 'object') {
					for (style in node[key]) {
						if (!node[key].hasOwnProperty(style)) {
							continue;
						}
						if (node[key][style]) {
							if ('transform' === style) {
								item.style.transform = node[key][style];
								item.style.msTransform = item.style.MozTransform = item.style.WebkitTransform = item.style.OTransform = node[key][style];
							} else {
								item.style[style] = node[key][style];
							}
						}
					}
				} else {
					item.setAttribute(key, node[key]);
				}
			}
		}
		if (node.$parent) {
			node.$parent.appendChild(item);
		}
		if (node.model) {
			item.model = node.model;
		}
			return item;
	}
	static setSize(item, width, height) : void{
		let value:number;
		value = util.getValue(width);
		item.setAttribute("width", value);
		item.style.width = Math.ceil(value);
		value = util.getValue(height);
		item.setAttribute("height", value);
		item.style.height = Math.ceil(value);
	}
	static getValue(value:string):number {return parseInt(("0" + value).replace("px", ""), 10); }
	static isIE():boolean {return document.all && !window["opera"]; }
	static isFireFox():boolean {return navigator.userAgent.toLowerCase().indexOf('firefox') > -1; }
	static isOpera():boolean {return navigator.userAgent.indexOf("Opera") > -1; }
	static getEventX(event):number {return (this.isIE) ? window.event["clientX"] : event.pageX; }
	static getEventY(event):number {return (this.isIE) ? window.event["clientY"] : event.pageY; }
	static getNumber(str:string) : number{
			return parseInt((str || "0").replace("px", ""), 10);
	}

	static getStyle(styleProp) :CSS {
		var i, style, diff, current, ref, el = document.createElement("div"), css;
		document.body.appendChild(el);
		css = new CSS(styleProp);
		ref = new CSS(styleProp, el).css;
		style = window.getComputedStyle(el, null);
		el.className = styleProp;
		current = new CSS(styleProp, el).css;
		diff = util.getNumber(style.getPropertyValue("border-width"));
		for (i in current) {
			if (!current.hasOwnProperty(i)) {
				continue;
			}
			if (i === "width" || i === "height") {
				if (util.getNumber(current[i]) !== 0 && util.getNumber(current[i]) + diff * 2 !== util.getNumber(ref[i])) {
					css.add(i, current[i]);
				}
			} else if (current[i] !== ref[i]) {
				css.add(i, current[i]);
			}
		}
		document.body.removeChild(el);
		return css;
	}
	static sizeOf(item:any, model:Node, node?:Node) {
		var board, rect, root;
		if (!item) {return; }
		root = <DiagramElement>model.getRoot();
		board = root.$gui;
		if (board.tagName === "svg") {
			if (typeof item === 'string') {
				item = util.create({tag: "text", $font: true, value: item});
				item.setAttribute("width", "5px");
			}
		} else if (typeof item === 'string') {
			item = document.createTextNode(item);
		}
		board.appendChild(item);
		rect = item.getBoundingClientRect();
		board.removeChild(item);
		if (node) {
			if(node.getSize().isEmpty()) {
				node.withSize(Math.ceil(rect.width), Math.ceil(rect.height));
			}
		}
		return rect;
	}
	static getColor(style:string, defaultColor?:string) {
		if (style) {
			if (style.toLowerCase() === "create") {
				return "#008000";
			}
			if (style.toLowerCase() === "nac") {
				return "#FE3E3E";
			}
			if (style.indexOf("#") === 0) {
				return style;
			}
		}
		if (defaultColor) {
			return defaultColor;
		}
		return "#000";
	}
	public static toJson(ref) : Object {
		let result = {};
		return util.copy(result, ref, false, false);
	}
	/**
	 * copy One Json into another
	 * @function
	 * @param ref reference Json
	 * @param src source Json
	 * @param full all attributes include privet $
	 * @param replace set the original reference or copy it
	 * @returns ref
	 * @name copy
	 */
	public static copy(ref, src, full:boolean, replace:boolean) {
		if (src) {
			let i;
			for (i in src) {
				if (!src.hasOwnProperty(i) || typeof (src[i]) === "function") {
					continue;
				}
				if (i.charAt(0) === "$") {
					if (full) {ref[i] = src[i]; }
					continue;
				}
				if (typeof (src[i]) === "object") {
					if (replace) {
						ref[i] = src[i];
						continue;
					}
					if (!ref[i]) {
						if (src[i] instanceof Array) {
							ref[i] = [];
						} else {
							ref[i] = {};
						}
					}
					util.copy(ref[i], src[i], full, false);
				} else {
					if (src[i] === "") {
						continue;
					}
					ref[i] = src[i];
				}
			}
			if (src.width) {ref.$startWidth = src.width; }
			if (src.height) {ref.$startHeight = src.height; }
		}
		return ref;
	};
}
