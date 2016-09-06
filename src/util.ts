
export function toPascalCase(value: string) {
  value = value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
  return value;
};

export function getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isSVG(tag) {
  let i, list = ['svg', 'path', 'polygon', 'polyline', 'line', 'rect', 'filter', 'feGaussianBlur', 'feOffset', 'feBlend', 'linearGradient', 'stop', 'text', 'symbol', 'textPath', 'defs', 'fegaussianblur', 'feoffset', 'feblend', 'circle', 'ellipse', 'g'];
  for (i = 0; i < list.length; i += 1) {
    if (list[i] === tag) {
      return true;
    }
  }
  return false;
}

export function createShape(attrs): Element {
  let xmlns = attrs.xmlns || 'http://www.w3.org/2000/svg';
  let shape = document.createElementNS(xmlns, attrs.tag);
  for (let attr in attrs) {
    if (attr !== 'tag') {
      shape.setAttribute(attr, attrs[attr]);
    }
  }
  return shape;
}

export function create(node: any) {
  let style, item, xmlns, key, tag, k;
  if (document.createElementNS && (isSVG(node.tag) || node.xmlns)) {
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
