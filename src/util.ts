import CSS from './core/CSS';
import Options from './core/Options';
import BaseElement from './elements/BaseElement';
import Graph from './elements/Graph';
import Point from './elements/Point';
import { Node } from './elements/nodes';

export function getValue(value) { return parseInt(('0' + value).replace('px', ''), 10); }

export function isIE() { return document.all && !window['opera']; }

export function isFireFox() { return navigator.userAgent.toLowerCase().indexOf('firefox') > -1; }

export function isOpera() { return navigator.userAgent.indexOf('Opera') > -1; }

export function getEventX(event) { return (this.isIE) ? window.event['clientX'] : event.pageX; }

export function getEventY(event) { return (this.isIE) ? window.event['clientY'] : event.pageY; }

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
export function copy(ref: Object, src: any, full?: boolean, replace?: boolean): any {
  if (src) {
    let i;
    for (i in src) {
      if (!src.hasOwnProperty(i) || typeof (src[i]) === 'function') {
        continue;
      }
      if (i.charAt(0) === '$') {
        if (full) { ref[i] = src[i]; }
        continue;
      }
      if (typeof (src[i]) === 'object') {
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
        copy(ref[i], src[i], full);
      } else {
        if (src[i] === '') {
          continue;
        }
        ref[i] = src[i];
      }
    }
  }
  return ref;
}

export function isSVG(tag) {
  let i, list = ['svg', 'path', 'polygon', 'polyline', 'line', 'rect', 'filter', 'feGaussianBlur', 'feOffset', 'feBlend', 'linearGradient', 'stop', 'text', 'symbol', 'textPath', 'defs', 'fegaussianblur', 'feoffset', 'feblend', 'circle', 'ellipse', 'g'];
  for (i = 0; i < list.length; i += 1) {
    if (list[i] === tag) {
      return true;
    }
  }
  return false;
}

export function create(node: any) {
  let style, item, xmlns, key, tag, k;
  if (document.createElementNS && (isSVG(node.tag) || node.xmlns || (node.model && node.model.getRoot().getTyp() === 'svg'))) {
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

export function setSize(item, width, height) {
  let value;
  value = getValue(width);
  item.setAttribute('width', value);
  item.style.width = Math.ceil(value);
  value = getValue(height);
  item.setAttribute('height', value);
  item.style.height = Math.ceil(value);
}

export function setPos(item, x, y) {
  if (item.x && item.x.baseVal) {
    item.style.left = x + 'px';
    item.style.top = y + 'px';
  } else {
    item.x = x;
    item.y = y;
  }
}

export function getColor(style: string, defaultColor?: string) {
  if (style) {
    if (style.toLowerCase() === 'create') {
      return '#008000';
    }
    if (style.toLowerCase() === 'nac') {
      return '#FE3E3E';
    }
    if (style.indexOf('#') === 0) {
      return style;
    }
  }
  if (defaultColor) {
    return defaultColor;
  }
  return '#000';
}

export function getNumber(str) {
  return parseInt((str || '0').replace('px', ''), 10);
}

export function getStyle(styleProp) {
  let i, style, diff, current, ref, el = document.createElement('div'), css;
  document.body.appendChild(el);
  css = new CSS(styleProp);
  ref = new CSS(styleProp, el).css;
  style = window.getComputedStyle(el, null);
  el.className = styleProp;
  current = new CSS(styleProp, el).css;
  diff = getNumber(style.getPropertyValue('border-width'));
  for (i in current) {
    if (!current.hasOwnProperty(i)) {
      continue;
    }
    if (i === 'width' || i === 'height') {
      if (getNumber(current[i]) !== 0 && getNumber(current[i]) + diff * 2 !== getNumber(ref[i])) {
        css.add(i, current[i]);
      }
    } else if (current[i] !== ref[i]) {
      css.add(i, current[i]);
    }
  }
  document.body.removeChild(el);
  return css;
}

export function sizeOf(item: any, model: Node, node?: Node) {
  let board, rect, root;
  if (!item) { return; }
  root = <Graph>model.getRoot();
  board = root.$gui;
  if (board.tagName === 'svg') {
    if (typeof item === 'string') {
      item = create({ tag: 'text', $font: true, value: item });
      item.setAttribute('width', '5px');
    }
  } else if (typeof item === 'string') {
    item = document.createTextNode(item);
  }
  board.appendChild(item);
  rect = item.getBoundingClientRect();
  board.removeChild(item);
  if (node) {
    if (node.getSize().isEmpty()) {
      node.withSize(Math.ceil(rect.width), Math.ceil(rect.height));
    }
  }
  return rect;
}

export function createCell(parent, tag, node, innerHTML?: string, typ?: string) {
  let tr = this.create({ 'tag': 'tr' }), cell;
  cell = this.create({ 'tag': tag, $font: true, value: innerHTML });
  node.getRoot().createdElement(cell, typ, node);
  tr.appendChild(cell);
  parent.appendChild(tr);
  return cell;
}

export function bind(el, eventName: string, eventHandler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, eventHandler, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + eventName, eventHandler);
  }
}

export function MinMax(node: BaseElement, min: Point, max: Point) {
  let size = node.getSize();
  let pos = node.getPos();
  max.x = Math.max(max.x, pos.x + Number(size.x) + 10);
  max.y = Math.max(max.y, pos.y + Number(size.y) + 10);
  min.x = Math.min(min.x, pos.x);
  min.y = Math.min(min.y, pos.y);
}

export function serializeXmlNode(xmlNode) {
  if (window['XMLSerializer'] !== undefined) {
    return (new window['XMLSerializer']()).serializeToString(xmlNode);
  }
  if (xmlNode.xml) {
    return xmlNode.xml;
  }
  return xmlNode.outerHTML;
}

export function utf8$to$b64(str: string) {
  return window.btoa(decodeURIComponent(encodeURIComponent(str)));
}

export function getModelNode(element) {
  if (!element.model) {
    if (element.parentElement) {
      return this.getModelNode(element.parentElement);
    }
    return null;
  }
  return element;
}

export function selectText(control: HTMLElement) {
  let selection, range;
  if (this.isIE()) {
    range = (<any>document.body).createTextRange();
    range.moveToElementText(control);
    range.select();
  } else if (this.isFireFox() || this.isOpera()) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(control);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

/**
 * copy Minimize Json
 * @function
 * @param target the target Json
 * @param src source Json
 * @param ref reference Json
 * @returns {target}
 */
export function minJson(target: any, src: any, ref?: any) {
  let i, temp, value;
  for (i in src) {
    if (!src.hasOwnProperty(i) || typeof (src[i]) === 'function') {
      continue;
    }
    if (src[i] === null || src[i] === '' || src[i] === 0 || src[i] === false || i.charAt(0) === '$') {
      continue;
    }
    value = src[i];
    if (value instanceof Options || ref !== null) {
      if (typeof (value) === 'object') {
        temp = (value instanceof Array) ? [] : {};
        if (ref) {
          value = this.minJson(temp, value, ref[i]);
        } else {
          value = this.minJson(temp, value, new Options());
        }
      }
      if (ref && value === ref[i]) {
        continue;
      }
    }
    if (typeof (value) === 'object') {
      if (value instanceof Array && value.length < 1) {
        continue;
      }
      if (value instanceof Array) {
        target[i] = this.minJson([], value);
      } else {
        temp = this.minJson({}, value);
        if (JSON.stringify(temp, null, '') === '{}') {
          continue;
        }
        target[i] = temp;
      }
    } else {
      target[i] = value;
    }
  }
  return target;
}

export function removeClass(ele: HTMLElement, cls: string) {
  if (this.hasClass(ele, cls)) {
    let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

export function hasClass(ele: HTMLElement, cls: string): boolean { return ele.className.indexOf(cls) > 0; }

export function addClass(ele: HTMLElement, cls: string) {
  if (!this.hasClass(ele, cls)) {
    ele.className = ele.className + ' ' + cls;
  }
}
