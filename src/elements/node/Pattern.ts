export default class Pattern extends Node {

  constructor() {
    super('Pattern');
  }

  public drawSVG(draw?: boolean) {
    let width: number = 0, height: number = 40, textWidth: number, rect, item, g = create({ tag: 'g', model: this });
    let id: string;
    let pos: Point;
    id = this.id;
    if (this.counter) {
      id += ' (' + this.counter + ')';
    }
    textWidth = sizeOf(id, this).width;
    width = Math.max(width, textWidth);
    height += 20;
    width += 20;

    pos = this.getPos();

    rect = {
      tag: 'rect',
      'width': width,
      'height': height,
      'x': pos.x,
      'y': pos.y,
      'fill': '#fff',
      'class': 'draggable'
    };
    rect.fill = 'lightblue';

    g.appendChild(create(rect));
    item = create({
      tag: 'text',
      $font: true,
      'text-anchor': 'right',
      'x': pos.x + width / 2 - textWidth / 2,
      'y': pos.y + 20,
      'width': textWidth
    });
    item.appendChild(document.createTextNode(id));
    g.appendChild(item);
    g.appendChild(create({
      tag: 'line',
      x1: pos.x,
      y1: pos.y + 30,
      x2: pos.x + width,
      y2: pos.y + 30,
      stroke: rect.stroke
    }));
    return g;
  }

  public drawHTML(draw?: boolean) {
    let cell, item = create({ tag: 'div', model: this });
    let pos = this.getPos();
    item.className = 'patternElement';
    setPos(item, pos.x, pos.y);
    this.fireEvent(this, EventBus.EVENT.CREATED, item);

    item.appendChild(create({
      tag: 'table',
      border: '0',
      style: { width: '100%', height: '100%' }
    }));
    if (this['href']) {
      createCell(item, 'th', this, '<a href=\'' + this['href'] + '\'>' + this.id + '</a>', 'id');
    } else {
      createCell(item, 'th', this, this.id, 'id');
    }
    cell = createCell(item, 'td', this, '&nbsp;');
    cell.className = 'first';
    this.fireEvent(this, EventBus.EVENT.CREATED, cell);

    item.node = this;
    this.$gui = item;
    return item;
  }

}
