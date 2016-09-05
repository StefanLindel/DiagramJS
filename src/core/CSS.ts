export default class CSS {

  public css;
  private name: string;

  constructor(name, item?: any) {
    let i, value, border: string, prop, el;
    this.name = name;
    this.css = {};
    if (!item) {
      return;
    }

    el = window.getComputedStyle(item, null);
    border = el.getPropertyValue('border');
    for (i in el) {
      prop = i;
      value = el.getPropertyValue(prop);
      if (value && value !== '') {
        // optimize CSS
        if (border) {
          if (prop === 'border-bottom' || prop === 'border-right' || prop === 'border-top' || prop === 'border-left') {
            if (value !== border) {
              this.css[prop] = value;
            }
          } else if (prop === 'border-color' || prop === 'border-bottom-color' || prop === 'border-right-color' || prop === 'border-top-color' || prop === 'border-left-color') {
            if (border.substring(border.length - value.length) !== value) {
              this.css[prop] = value;
            }
          } else if (prop === 'border-width') {
            if (border.substring(0, value.length) !== value) {
              this.css[prop] = value;
            }
          } else {
            this.css[prop] = value;
          }
        } else {
          this.css[prop] = value;
        }
      }
    }
  }

  public static getDefs(board) {
    let defs;
    if (board.getElementsByTagName('defs').length < 1) {
      defs = create({ tag: 'defs' });
      board.insertBefore(defs, board.childNodes[0]);
    } else {
      defs = board.getElementsByTagName('defs')[0];
    }
    return defs;
  };

    public static getSubstring(str: string, search: string, startChar: string, endChar: string, splitter: string): any {
      let pos, end, count = 0, array = [];
      pos = str.indexOf(search);
      if (pos > 0) {
        end = str.indexOf(startChar, pos);
        pos = end + 1;
        if (end > 0) {
          while (end < str.length) {
            if (str.charAt(end) === startChar) {
              count += 1;
            }
            if (str.charAt(end) === endChar) {
              count -= 1;
              if (count === 0) {
                if (splitter && pos !== end) {
                  array.push(str.substring(pos, end).trim());
                }
                break;
              }
            }
            if (str.charAt(end) === splitter && count === 1) {
              array.push(str.substring(pos, end).trim());
              pos = end + 1;
            }

            end += 1;
          }
          if (splitter) {
            return array;
          }
          return str.substring(pos, end);
        }
        return str.substring(pos);
      }
      return '';
    }

    public static addStyle(board, styleName) {
      let defs, style, css;
      if (styleName.baseVal || styleName.baseVal === '') {
        styleName = styleName.baseVal;
      }
      if (!styleName) {
        return;
      }
      defs = CSS.getDefs(board);
      if (defs.getElementsByTagName('style').length > 0) {
        style = defs.getElementsByTagName('style')[0];
      } else {
        style = create({ tag: 'style' });
        style.item = {};
        defs.appendChild(style);
      }
      if (!style.item[styleName]) {
        css = getStyle(styleName);
        style.item[styleName] = css;
        style.innerHTML = style.innerHTML + '\n.' + styleName + css.getSVGString(board);
      }
    }

    public static addStyles(board, item) {
      if (!item) {
        return;
      }
      let items, i, className = item.className;

      if (className) {
        if (className.baseVal || className.baseVal === '') {
          className = className.baseVal;
        }
      }
      if (className) {
        items = className.split(' ');
        for (i = 0; i < items.length; i += 1) {
          CSS.addStyle(board, items[i].trim());
        }
      }
      for (i = 0; i < item.childNodes.length; i += 1) {
        this.addStyles(board, item.childNodes[i]);
      }
    }

  public add(key: string, value) {
    this.css[key] = value;
  };

  public get(key: string): any {
    let i;
    for (i in this.css) {
      if (i === key) {
        return this.css[key];
      }
    }
    return null;
  };

  public getNumber(key) {
    return parseInt((this.get(key) || '0').replace('px', ''), 10);
  };

  public getSVGString = function(board) {
    let str, pos, style, defs, value, filter, z;
    str = '{';
    for (style in this.css) {
      if (!this.css.hasOwnProperty(style)) {
        continue;
      }
      if (style === 'border') {
        pos = this.css[style].indexOf(' ');
        str = str + 'stroke-width: ' + this.css[style].substring(0, pos) + ';';
        pos = this.css[style].indexOf(' ', pos + 1);
        str = str + 'stroke:' + this.css[style].substring(pos) + ';';
      } else if (style === 'background-color') {
        str = str + 'fill: ' + this.css[style] + ';';
      } else if (style === 'background') {
        value = CSS.getSubstring(this.css[style], 'linear-gradient', '(', ')', ',');
        if (value.length > 0) {
          defs = CSS.getDefs(board);
          if (value[0] === '45deg') {
            pos = 1;
            filter = create({
              tag: 'linearGradient',
              'id': this.name,
              x1: '0%',
              x2: '100%',
              y1: '100%',
              y2: '0%'
            });
          } else {
            filter = create({
              tag: 'linearGradient',
              'id': this.name,
              x1: '0%',
              x2: '0%',
              y1: '100%',
              y2: '0%'
            });
            pos = 0;
          }
          defs.appendChild(filter);
          while (pos < value.length) {
            value[pos] = value[pos].trim();
            z = value[pos].lastIndexOf(' ');
            filter.appendChild(create({
              tag: 'stop',
              'offset': value[pos].substring(z + 1),
              style: { 'stop-color': value[pos].substring(0, z) }
            }));
            pos += 1;
          }
          str = str + 'fill: url(#' + this.name + ');';
          continue;
        }
        str = str + style + ': ' + this.css[style] + ';';
        // box-shadow: inset 0 3px 4px #888;

      } else {
        str = str + style + ': ' + this.css[style] + ';';
      }
    }
    str = str + '}';
    return str;
  };

}
