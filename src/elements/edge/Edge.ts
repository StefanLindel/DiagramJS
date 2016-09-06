import SymbolLibary  from '../../core/SymbolLibary';
import { create, setPos, setSize } from '../../util';
import BaseElement from '../BaseElement';
import Info from '../Info';
import Line from '../Line';
import Point from '../Point';
import { Node, SO } from '../nodes';

export class Edge extends Node {

  public static POSITION = { UP: 'UP', LEFT: 'LEFT', RIGHT: 'RIGHT', DOWN: 'DOWN' };
  public $sNode: Node;
  public $tNode: Node;
  public source: Info;
  public counter: number;
  public target: Info;

  protected $lineStyle: string;
  protected $path: Array<Line>;
  protected $end: string;
  protected $endPos: Point;
  protected $top: Point;
  protected $bot: Point;
  protected $topCenter: Point;
  protected $botCenter: Point;

  private $m: number = 0;
  private $n: number = 0;
  private $labels: Array<Object>;
  private style: string;
  private info: Info;
  private board: any;
  private $start: string;

  constructor() {
    super('EDGE');
    this.$path = [];
    this.$lineStyle = Line.FORMAT.SOLID;
  };

  public static Range(min: Point, max: Point, x: number, y: number) {
    max.x = Math.max(max.x, x);
    max.y = Math.max(max.y, y);
    min.x = Math.min(min.x, x);
    min.y = Math.min(min.y, y);
  }

  public static getUDPosition(m: number, n: number, e: BaseElement, p: string, step?: number) {
    let pos = e.getPos();
    let size = e.getSize();
    let x, y = pos.y;
    if (p === Edge.POSITION.DOWN) {
      y += size.y;
    }
    x = (y - n) / m;
    if (step) {
      x += e['$' + p] * step;
      if (x < pos.x) {
        x = pos.x;
      } else if (x > (pos.x + size.x)) {
        x = pos.x + size.x;
      }
    }
    return new Point(x, y, p);
  };

  public static getLRPosition(m: number, n: number, e: BaseElement, p: string, step?: number) {
    let pos: Point = e.getPos();
    let size: Point = e.getSize();

    let y, x = pos.x;
    if (p === Edge.POSITION.RIGHT) {
      x += size.x;
    }
    y = m * x + n;
    if (step) {
      y += e['$' + p] * step;
      if (y < pos.y) {
        y = pos.y;
      } else if (y > (pos.y + size.y)) {
        y = pos.y + size.y;
      }
    }
    return new Point(x, y, p);
  }

  public static getPosition(m: number, n: number, entity: BaseElement, refCenter: Point) {
    let t, p = [], list, distance = [], min = 999999999, position, i, step = 15;
    let pos = entity.getPos();
    let size = entity.getSize();
    list = [Edge.POSITION.LEFT, Edge.POSITION.RIGHT];
    for (i = 0; i < 2; i += 1) {
      t = this.getLRPosition(m, n, entity, list[i]);
      if (t.y >= pos.y && t.y <= (pos.y + size.y + 1)) {
        t.y += (entity['$' + list[i]] * step);
        if (t.y > (pos.y + size.y)) {
          // Alternative
          t = Edge.getUDPosition(m, n, entity, Edge.POSITION.DOWN, step);
        }
        p.push(t);
        distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
      }
    }
    list = [Edge.POSITION.UP, Edge.POSITION.DOWN];
    for (i = 0; i < 2; i += 1) {
      t = Edge.getUDPosition(m, n, entity, list[i]);
      if (t.x >= pos.x && t.x <= (pos.x + size.x + 1)) {
        t.x += (entity['$' + list[i]] * step);
        if (t.x > (pos.x + size.x)) {
          // Alternative
          t = this.getLRPosition(m, n, entity, Edge.POSITION.RIGHT, step);
        }
        p.push(t);
        distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
      }
    }
    for (i = 0; i < p.length; i += 1) {
      if (distance[i] < min) {
        min = distance[i];
        position = p[i];
      }
    }
    return position;
  };

  public withItem(source: Info, target: Info): Edge {
    this.source = source;
    this.target = target;
    return this;
  };

  public set(id, value) {
    if (value) {
      this[id] = value;
    }
  };

  public removeFromBoard(board) {
    if (this.$gui) {
      board.removeChild(this.$gui);
      this.$gui = null;
    }
    if (this.$labels) {
      while (this.$labels.length > 0) {
        board.removeChild(this.$labels.pop());
      }
    }
  };

  public calc(board): boolean {
    let result, options, linetyp, sourcePos, targetPos, divisor, startNode: Node, endNode: Node;
    startNode = <Node>this.$sNode.getShowed();
    endNode = <Node>this.$tNode.getShowed();

    divisor = (endNode.getCenter().x - startNode.getCenter().x);
    this.$path = [];
    startNode = startNode.getTarget(startNode);
    endNode = endNode.getTarget(endNode);
    if (divisor === 0) {
      if (startNode === endNode) {
        /* OwnAssoc */
        return false;
      }
      // Must be UP_DOWN or DOWN_UP
      if (startNode.getCenter().y < endNode.getCenter().y) {
        // UP_DOWN
        sourcePos = this.getCenterPosition(startNode, Edge.POSITION.DOWN);
        targetPos = this.getCenterPosition(endNode, Edge.POSITION.UP);
      } else {
        sourcePos = this.getCenterPosition(startNode, Edge.POSITION.UP);
        targetPos = this.getCenterPosition(endNode, Edge.POSITION.DOWN);
      }
    } else {
      // add switch from option or model
      options = this.$parent['options'];
      if (options) {
        linetyp = options.linetyp;
      }
      result = false;
      if (linetyp === 'square') {
        result = this.calcSquareLine();
      }
      if (!result) {
        this.$m = (endNode.getCenter().y - startNode.getCenter().y) / divisor;
        this.$n = startNode.getCenter().y - (startNode.getCenter().x * this.$m);
        sourcePos = Edge.getPosition(this.$m, this.$n, startNode, endNode.getCenter());
        targetPos = Edge.getPosition(this.$m, this.$n, endNode, sourcePos);
      }
    }
    if (sourcePos && targetPos) {
      this.calcInfoPos(sourcePos, startNode, this.source);
      this.calcInfoPos(targetPos, endNode, this.target);
      startNode['$' + sourcePos.$id] += 1;
      endNode['$' + targetPos.$id] += 1;
      this.$path.push(new Line(sourcePos, targetPos, this.$lineStyle, this.style));
      if (this.info) {
        this.info.withPos((sourcePos.x + targetPos.x) / 2, (sourcePos.y + targetPos.y) / 2);
      }
    }
    return true;
  }

  public addLineTo(x1: number, y1: number, x2?: number, y2?: number) {
    let start, end;
    if (!x2 && !y2 && this.$path.length > 0) {
      start = this.$path[this.$path.length - 1].target;
      end = new Point(start.x + x1, start.y + y1);
    } else {
      start = new Point(x1, y1);
      end = new Point(start.x + x2, start.y + y2);
    }
    this.$path.push(new Line(start, end, this.$lineStyle, this.style));
  };

  public calcSquareLine() {
    // 	1. Case		/------\
    // 				|...T...|
    // 				\-------/
    // 			|---------|
    // 			|
    // 		/-------\
    // 		|...S...|
    // 		\-------/
    let startPos = this.$sNode.getPos();
    let startSize = this.$sNode.getSize();
    let endPos = this.$tNode.getPos();
    let endSize = this.$tNode.getSize();
    if (startPos.y - 40 > endPos.y + endSize.y) { // oberseite von source and unterseite von target
      this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
      this.addLine(endPos.x + endSize.x / 2, endPos.y + endSize.y + 20);
      this.addLineTo(0, -20);
      return true;
    }
    if (endPos.y - 40 > startPos.y + startSize.y) { // oberseite von source and unterseite von target
      // fall 1 nur andersherum
      this.addLineTo(startPos.x + startSize.x / 2, startPos.y + startSize.y, 0, +20);
      this.addLine(endPos.x + endSize.x / 2, endPos.y - 20);
      this.addLineTo(0, 20);
      return true;
    }

    // 3. fall ,falls s (source) komplett unter t (target) ist
    // beide oberseiten
    // 	3. Case
    // 			 |--------
    // 			/---\	 |
    // 			| T |	/---\
    // 			\---/	| S |
    // 					-----
    // or
    // 			-------|
    // 			|	 /---\
    // 		/----\	 | T |
    // 		| S	 |	 \---/
    // 		------
    //
    this.addLineTo(startPos.x + startSize.x / 2, startPos.y, 0, -20);
    this.addLine(endPos.x + endSize.x / 2, endPos.y - 20);
    this.addLineTo(0, 20);
    return true;
  };

  public calcOffset() {
    let i, z, min = new Point(999999999, 999999999), max = new Point(0, 0), item, svg, value, x, y;
    for (i = 0; i < this.$path.length; i += 1) {
      item = this.$path[i];
      if (item.typ === Line.FORMAT.PATH) {
        value = document.createElement('div');
        svg = create({ tag: 'svg' });
        svg.appendChild(item.draw());
        value = svg.childNodes[0];
        x = y = 0;
        if (!value.pathSegList) {
          continue;
        }
        for (z = 0; z < value.pathSegList.length; z += 1) {
          item = value.pathSegList[z];
          switch (item.pathSegType) {
            case SVGPathSeg.PATHSEG_MOVETO_ABS:
            case SVGPathSeg.PATHSEG_LINETO_ABS:
            case SVGPathSeg.PATHSEG_ARC_ABS:
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
              x = item.x;
              y = item.y;
              break;
            case SVGPathSeg.PATHSEG_MOVETO_REL:
            case SVGPathSeg.PATHSEG_LINETO_REL:
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
            case SVGPathSeg.PATHSEG_ARC_REL:
              x = x + item.x;
              y = y + item.y;
              break;
          }
          Edge.Range(min, max, x, y);
        }
      } else {
        Edge.Range(min, max, item.source.x, item.source.y);
        Edge.Range(min, max, item.target.x, item.target.y);
      }
    }
    return { x: min.x, y: min.y, width: max.x - min.x, height: max.y - min.y };
  };

  public draw(typ: string): HTMLElement {
    let i, style, angle, item, offset;
    offset = this.calcOffset();
    if (this.getRoot().getTyp() === 'svg') {
      this.board = this.$gui = create({ tag: 'g' });
    } else {
      this.$gui = create({ tag: 'svg', style: { position: 'absolute' } });
      this.board = create({ tag: 'g', transform: 'translate(-' + offset.x + ', -' + offset.y + ')' });
      this.$gui.appendChild(this.board);
    }
    setPos(this.$gui, offset.x, offset.y);
    setSize(this.$gui, offset.x, offset.y);
    for (i = 0; i < this.$path.length; i += 1) {
      item = this.$path[i];
      if (item.typ === Line.FORMAT.PATH) {
        this.board.appendChild(item.draw());
      } else {
        style = item.style || this.style;
        this.board.appendChild(item.draw());
      }
    }
    this.drawSourceText(style);
    if (this.info) {
      angle = this.info.draw(typ);
      let pos = this.info.getPos();
      this.board.appendChild(SymbolLibary.draw(SO.create({
        'typ': 'Arrow',
        x: pos.x,
        y: pos.y,
        rotate: angle
      })));
    }
    this.drawTargetText(style);
    return this.$gui;
  };

  public drawText(info, style) {
    if (this.$path.length < 1) {
      return;
    }
    let options, angle = 0, p, item;
    p = this.$path[0];
    options = this.getRoot()['model'].options;
    if (options.rotatetext) {
      info.$angle = Math.atan((p.source.y - p.target.y) / (p.source.x - p.target.x)) * 60;
    }
    if (this.getRoot().typ === 'svg') {
      item = info.drawSVG();
    } else {
      item = info.drawHTML();
    }
    if (style) {
      item.setAttribute('style', style);
    }
    if (!this.$labels) {
      this.$labels = [];
    }
    if (item) {
      this.$labels.push(item);
      this.getRoot().$gui.appendChild(item);
    }
    return angle;
  };

  public drawSourceText(style) {
    this.drawText(this.source, style);
  };

  public drawTargetText(style) {
    this.drawText(this.target, style);
  };

  public endPos(): Line {
    return this.$path[this.$path.length - 1];
  };

  public edgePosition() {
    let pos = 0, i;
    for (i = 0; i < this.$sNode.$edges.length; i += 1) {
      if (this.$sNode.$edges[i] === this) {
        return pos;
      }
      if (this.$sNode.$edges[i].$tNode === this.$tNode) {
        pos += 1;
      }
    }
    return pos;
  };

  public calcOwnEdge() {
    // this.source
    let sPos, tPos, offset = 20;
    this.$start = this.getFree(this.$sNode);
    if (this.$start.length > 0) {
      this.$end = this.getFreeOwn(this.$sNode, this.$start);
    } else {
      this.$start = Edge.POSITION.RIGHT;
      this.$end = Edge.POSITION.DOWN;
    }

    sPos = this.getCenterPosition(this.$sNode, this.$start);
    if (this.$start === Edge.POSITION.UP) {
      tPos = new Point(sPos.x, sPos.y - offset);
    } else if (this.$start === Edge.POSITION.DOWN) {
      tPos = new Point(sPos.x, sPos.y + offset);
    } else if (this.$start === Edge.POSITION.RIGHT) {
      tPos = new Point(sPos.x + offset, sPos.y);
    } else if (this.$start === Edge.POSITION.LEFT) {
      tPos = new Point(sPos.x - offset, sPos.y);
    }
    let startPos = this.$sNode.getPos();
    let startSize = this.$sNode.getSize();
    this.$path.push(new Line(sPos, tPos, this.$lineStyle));
    if (this.$end === Edge.POSITION.LEFT || this.$end === Edge.POSITION.RIGHT) {
      if (this.$start === Edge.POSITION.LEFT) {
        sPos = tPos;
        tPos = new Point(sPos.x, startPos.y - offset);
        this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      } else if (this.$start === Edge.POSITION.RIGHT) {
        sPos = tPos;
        tPos = new Point(sPos.x, startPos.y + offset);
        this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      }
      sPos = tPos;
      if (this.$end === Edge.POSITION.LEFT) {
        tPos = new Point(startPos.x - offset, sPos.y);
      } else {
        tPos = new Point(startPos.x + startSize.x + offset, sPos.y);
      }
      this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      sPos = tPos;
      tPos = new Point(sPos.x, this.$sNode.getCenter().y);
      this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      if (this.info) {
        this.info.withPos((sPos.x + tPos.x) / 2, sPos.y);
      }
    } else if (this.$end === Edge.POSITION.UP || this.$end === Edge.POSITION.DOWN) {
      if (this.$start === Edge.POSITION.UP) {
        sPos = tPos;
        tPos = new Point(startPos.x + startSize.x + offset, sPos.y);
        this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      } else if (this.$start === Edge.POSITION.DOWN) {
        sPos = tPos;
        tPos = new Point(startPos.x - offset, sPos.y);
        this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      }
      sPos = tPos;
      if (this.$end === Edge.POSITION.UP) {
        tPos = new Point(sPos.x, startPos.y - offset);
      } else {
        tPos = new Point(sPos.x, startPos.y + startSize.y + offset);
      }
      this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      sPos = tPos;
      tPos = new Point(this.$sNode.getCenter().x, sPos.y);
      this.$path.push(new Line(sPos, tPos, this.$lineStyle));
      if (this.info) {
        this.info.withPos(sPos.x, (sPos.y + tPos.y) / 2);
      }
    }
    sPos = tPos;
    this.$path.push(new Line(sPos, this.getCenterPosition(this.$sNode, this.$end), this.$lineStyle));
  };

  public getFree(node) {
    let i;
    for (i in Edge.POSITION) {
      if (!Edge.POSITION.hasOwnProperty(i)) {
        continue;
      }
      if (!node.hasOwnProperty('$' + i)) {
        continue;
      }
      if (node['$' + i] === 0) {
        node['$' + i] = 1;
        return i;
      }
    }
    return '';
  };

  public getFreeOwn(node, start) {
    let id = 0, i, list = [Edge.POSITION.UP, Edge.POSITION.RIGHT, Edge.POSITION.DOWN, Edge.POSITION.LEFT, Edge.POSITION.UP, Edge.POSITION.RIGHT, Edge.POSITION.DOWN];
    for (i = 0; i < list.length; i += 1) {
      if (list[i] === start) {
        id = i;
        break;
      }
    }
    if (node['$' + list[id + 1]] === 0 || node['$' + list[id + 1]] < node['$' + list[id + 3]]) {
      node['$' + list[id + 1]] += 1;
      return list[id + 1];
    }
    node['$' + list[id + 3]] += 1;
    return list[id + 3];
  };

  public calcInfoPos(linePos, item, info: Info) {
    // Manuell move the InfoTag
    let newY, newX, spaceA = 20, spaceB = 0, step = 15;
    if (item.$parent.options && !item.$parent.options.rotatetext) {
      spaceA = 20;
      spaceB = 10;
    }
    if (info.custom || info.getText().length < 1) {
      return;
    }
    newY = linePos.y;
    newX = linePos.x;
    let size = info.getSize();
    if (linePos.$id === Edge.POSITION.UP) {
      newY = newY - size.y - spaceA;
      if (this.$m !== 0) {
        newX = (newY - this.$n) / this.$m + spaceB + (item.$UP * step);
      }
    } else if (linePos.$id === Edge.POSITION.DOWN) {
      newY = newY + spaceA;
      if (this.$m !== 0) {
        newX = (newY - this.$n) / this.$m + spaceB + (item.$DOWN * step);
      }
    } else if (linePos.$id === Edge.POSITION.LEFT) {
      newX = newX - size.x - (item.$LEFT * step) - spaceA;
      if (this.$m !== 0) {
        newY = (this.$m * newX) + this.$n;
      }
    } else if (linePos.$id === Edge.POSITION.RIGHT) {
      newX += (item.$RIGHT * step) + spaceA;
      if (this.$m !== 0) {
        newY = (this.$m * newX) + this.$n;
      }
    }
    info.withPos(Math.ceil(newX), Math.ceil(newY));
  };

  public calcMoveLine(size, angle, move) {
    let lineangle, angle1, angle2, hCenter, startArrow, h;
    if (this.$path.length < 1) {
      return;
    }
    startArrow = this.endPos()['source'];
    this.$endPos = this.endPos().target;
    // calculate the angle of the line
    lineangle = Math.atan2(this.$endPos.y - startArrow.y, this.$endPos.x - startArrow.x);
    // h is the line length of a side of the arrow head
    h = Math.abs(size / Math.cos(angle));
    angle1 = lineangle + Math.PI + angle;
    hCenter = Math.abs((size / 2) / Math.cos(angle));

    this.$top = new Point(this.$endPos.x + Math.cos(angle1) * h, this.$endPos.y + Math.sin(angle1) * h);
    this.$topCenter = new Point(this.$endPos.x + Math.cos(angle1) * hCenter, this.$endPos.y + Math.sin(angle1) * hCenter);
    angle2 = lineangle + Math.PI - angle;
    this.$bot = new Point(this.$endPos.x + Math.cos(angle2) * h, this.$endPos.y + Math.sin(angle2) * h);
    this.$botCenter = new Point(this.$endPos.x + Math.cos(angle2) * hCenter, this.$endPos.y + Math.sin(angle2) * hCenter);
    if (move) {
      this.endPos().target = new Point((this.$top.x + this.$bot.x) / 2, (this.$top.y + this.$bot.y) / 2);
    }
  };

  public addLine(x1: number, y1: number, x2?: number, y2?: number) {
    let start, end;
    if (!x2 && !y2 && this.$path.length > 0) {
      start = this.$path[this.$path.length - 1].target;
      end = new Point(x1, y1);
    } else {
      start = new Point(x1, y1);
      end = new Point(x2, y2);
    }
    this.$path.push(new Line(start, end, this.$lineStyle, this.style));
  };

  public getCenterPosition(node: BaseElement, p: string): Point {
    let offset = node['$' + p];
    let size = node.getSize();
    let pos = node.getPos();
    if (p === Edge.POSITION.DOWN) {
      return new Point(Math.min(node.getCenter().x + offset, pos.x + size.x), (pos.y + size.y), Edge.POSITION.DOWN);
    }
    if (p === Edge.POSITION.UP) {
      return new Point(Math.min(node.getCenter().x + offset, pos.x + size.x), pos.y, Edge.POSITION.UP);
    }
    if (p === Edge.POSITION.LEFT) {
      return new Point(pos.x, Math.min(node.getCenter().y + offset, pos.y + size.y), Edge.POSITION.LEFT);
    }
    if (p === Edge.POSITION.RIGHT) {
      return new Point(pos.x + size.x, Math.min(node.getCenter().y + offset, pos.y + size.y), Edge.POSITION.RIGHT);
    }
  };

}
