export default class Model extends Node {

  public nodes: Object;
  public edges: Array<Edge>;
  public options: Options;
  private $nodeCount: number;

  constructor(json, options, parent) {
    super('');
    this.typ = 'classdiagram';
    this.$isDraggable = true;
    this.$parent = parent;
    json = json || {};
    this.pos = new Point(json.left, json.top);
    this.size = new Point(0, 0);
    if (json.minid) {
      this.id = json.minid;
    }
    this.$nodeCount = 0;
    this.nodes = {};
    this.edges = [];
    json = json || {};
    this.typ = json.typ || 'classdiagram';
    this.set('id', json.id);
    this.options = copy(copy(new Options(), json.options), options, true, true);
    this['package'] = '';
    this.set('info', json.info);
    this.set('style', json.style);
    let i;
    if (json.nodes) {
      for (i = 0; i < json.nodes.length; i += 1) {
        this.addNode(json.nodes[i]);
      }
    }
    if (json.edges) {
      for (i = 0; i < json.edges.length; i += 1) {
        this.addEdge(json.edges[i]);
      }
    }
  }

  public static validateEdge(sEdge, tEdge) {
    return (sEdge.source.id === tEdge.source.id && sEdge.target.id === tEdge.target.id) && (sEdge.source.property === tEdge.source.property && sEdge.target.property === tEdge.target.property);
  }

  public clear() {
    let i;
    Node.prototype.clear.call(this);
    for (i in this.nodes) {
      if (!this.nodes.hasOwnProperty(i)) {
        continue;
      }
      this.nodes[i].clear();
    }
  }

  public drawComponents() {
    // TODO  FIRE FOR RASTER AND HEADER
    // this.fireEvent(this, EventBus.EVENT.RASTER);
    // TODO this.fireEvent(this, EventBus.EVENT.HEADER);
    let nodes, n, max;
    let min: Point;
    let i: string;
    let z: number;
    min = new Point(99999, 99999);
    max = new Point(0, 0);
    nodes = this.nodes;
    for (i in nodes) {
      if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === 'function') {
        continue;
      }
      n = nodes[i];
      if (this.options.raster) {
        // FIXME 		this.raster.moveToRaster(n);
      }
      MinMax(n, min, max);
    }
    // FIXME z = min.y - this.header.height;
    z = min.y;
    if (z > 0) {
      for (i in nodes) {
        if (!nodes.hasOwnProperty(i) || typeof (nodes[i]) === 'function') {
          continue;
        }
        nodes[i].y += z;
      }
      max.y += z;
    }
    this.calcLines();
    for (z = 0; z < this.edges.length; z += 1) {
      n = this.edges[z];
      MinMax(n.source, min, max);
      MinMax(n.target, min, max);
    }
    this.withSize(max.x, max.y);
    setSize(this.$gui, max.x, max.y);
    this.drawNodes();
    this.drawLines();
    return max;
  }

  public getNodeCount() {
    return this.$nodeCount;
  }

  public addEdge(source, target?: Node) {
    let edge, typ = 'Edge', e;
    if (!target) {
      typ = source.typ || 'Edge';
      typ = typ.charAt(0).toUpperCase() + typ.substring(1).toLowerCase();
      e = source;
    }
    edge = this.getRoot().createNewEdge(typ);
    if (target) {
      edge.withItem(this.addNode(source), this.addNode(target));
      e = edge;
    }

    edge.$parent = this;
    edge.source = new Info(e.source, this, edge);
    edge.target = new Info(e.target, this, edge);
    edge.$sNode = this.getNode(edge.source.id, true, 0);
    edge.$sNode.addEdge(edge);

    if (e.info) {
      if (typeof (e.info) === 'string') {
        edge.info = { id: e.info };
      } else {
        edge.info = { id: e.info.id, property: e.info.property, cardinality: e.info.cardinality };
      }
    }
    edge.$parent = this;
    edge.set('style', e.style);
    edge.set('counter', e.counter);
    edge.$tNode = this.getNode(edge.target.id, true, 0);
    edge.$tNode.addEdge(edge);
    this.edges.push(edge);
    return edge;
  };

  public removeEdge(idSource, idTarget) {
    let z, e;
    for (z = 0; z < this.edges.length; z += 1) {
      e = this.edges[z];
      if (e.$sNode.id === idSource && e.$tNode.id === idTarget) {
        this.edges.splice(z, 1);
        z -= 1;
      } else if (e.$tNode.id === idSource && e.$sNode.id === idTarget) {
        this.edges.splice(z, 1);
        z -= 1;
      }
    }
  };

  public removeNode(id) {
    delete (this.nodes[id]);
    let i;
    for (i = 0; i < this.edges.length; i += 1) {
      if (this.edges[i].$sNode.id === id || this.edges[i].$tNode.id === id) {
        this.edges.splice(i, 1);
        i -= 1;
      }
    }
  };

  public addNode(node: any) {
    /* testing if node is already existing in the graph */
    let typ, n;
    if (typeof (node) === 'string') {
      node = { id: node, typ: 'Node' };
    }
    typ = node.typ || 'Node';
    typ = typ.charAt(0).toUpperCase() + typ.substring(1).toLowerCase();
    n = this.getRoot().createNewNode(typ);
    if (node.id) {
      n.id = node.id;
    } else {
      n.id = node.typ + '$' + (this.$nodeCount + 1);
    }
    if (node['x'] || node['y']) {
      n.withPos(node['x'], node['y']);
    }
    if (node['width'] || node['height']) {
      n.withPos(node['width'], node['height']);
    }
    if (this.nodes[n.id] !== undefined) {
      return this.nodes[n.id];
    }
    this.nodes[n.id] = n;
    n.$parent = this;
    n.init(node);
    this.$nodeCount += 1;
    return this.nodes[n.id];
  }

  public getEdges() {
    return this.edges;
  }

  public calcLines() {
    let i, sourcePos, e, ownAssoc = [];
    for (i in this.nodes) {
      if (!this.nodes.hasOwnProperty(i) || typeof (this.nodes[i]) === 'function') {
        continue;
      }
      this.nodes[i].clear();
    }
    for (i = 0; i < this.edges.length; i += 1) {
      e = this.edges[i];
      if (!e.calc(this.$gui)) {
        ownAssoc.push(e);
      }
    }
    for (i = 0; i < ownAssoc.length; i += 1) {
      ownAssoc[i].calcOwnEdge();
      sourcePos = ownAssoc[i].getCenterPosition(ownAssoc[i].$sNode, ownAssoc[i].$start);
      ownAssoc[i].calcInfoPos(sourcePos, ownAssoc[i].$sNode, ownAssoc[i].source);

      sourcePos = ownAssoc[i].getCenterPosition(ownAssoc[i].$tNode, ownAssoc[i].$end);
      ownAssoc[i].calcInfoPos(sourcePos, ownAssoc[i].$tNode, ownAssoc[i].target);
    }
  }

  public validateModel() {
    let e, z, n, id, node, list;
    if (this.typ === 'classdiagram') {
      list = this.edges;
      for (e = 0; e < list.length; e += 1) {
        node = list[e].$sNode;
        z = node.id.indexOf(':');
        if (z > 0) {
          id = node.id.substring(z + 1);
          n = this.getNode(id, true, 1);
          delete (this.nodes[node.id]);
          this.edges[e].source.id = id;
          if (n) {
            this.edges[e].$sNode = n;
          } else {
            node.id = id;
            this.nodes[node.id] = node;
          }
        }
        node = list[e].$tNode;
        z = node.id.indexOf(':');
        if (z > 0) {
          id = node.id.substring(z + 1);
          n = this.getNode(id, true, 1);
          delete (this.nodes[node.id]);
          this.edges[e].target.id = id;
          if (n) {
            this.edges[e].$tNode = n;
          } else {
            node.id = id;
            this.nodes[node.id] = node;
          }
        }
        if (!list[e].source.cardinality) {
          list[e].source.cardinality = 'one';
        }
        if (!list[e].target.cardinality) {
          list[e].target.cardinality = 'one';
        }
        // Refactoring Edges for same property and typ set cardinality
        for (z = e + 1; z < list.length; z += 1) {
          id = typeof (window['java']);
          if (!(id === typeof list[z])) {
            continue;
          }
          if (Model.validateEdge(list[e], list[z])) {
            list[e].target.cardinality = 'many';
            list.splice(z, 1);
            z -= 1;
          } else if (Model.validateEdge(list[z], list[e])) {
            list[e].source.cardinality = 'many';
            list.splice(z, 1);
            z -= 1;
          }
        }
      }
    }
  }

  public getOption(value: string): any {
    if (this.options) {
      return this.options[value];
    }
    return null;
  }

  public getBoard(type) {
    if (type === 'svg') {
      return this.$gui = create({ tag: 'svg' });
    }
    return this.$gui = create({ tag: 'div', model: this });
  }

  public getNode(id, isSub, deep) {
    let n, i, r;
    deep = deep || 0;
    if (this.nodes[id]) {
      return this.nodes[id];
    }
    if (!isSub) {
      return this.addNode(id);
    }
    for (i in this.nodes) {
      if (!this.nodes.hasOwnProperty(i)) {
        continue;
      }
      n = this.nodes[i];
      if (n instanceof Model) {
        r = n.getNode(id, isSub, deep + 1);
        if (r) {
          return r;
        }
      }
    }
    if (deep === 0) {
      return this.addNode(id);
    }
    return null;
  }

  public toJson() {
    return copy({}, this);
  }

  public drawLines(): void {
    this.clearLines();
    let i: number, e, startShow, endShow, items = [], id;
    for (i = 0; i < this.edges.length; i += 1) {
      e = this.edges[i];
      startShow = !e.$sNode.isClosed();
      endShow = !e.$tNode.isClosed();
      if (startShow && endShow) {
        this.$gui.appendChild(e.draw());
      } else if ((startShow && !endShow) || (!startShow && endShow)) {
        id = e.$sNode.getShowed().id + '-' + e.$tNode.getShowed().id;
        if (items.indexOf(id) < 0) {
          items.push(id);
          this.$gui.appendChild(e.draw());
        }
      }
    }
  }

  public drawNodes(): void {
    let n: Node, typ: string = this.options.display.toLowerCase();
    for (let i in this.nodes) {
      if (!this.nodes.hasOwnProperty(i)) {
        continue;
      }
      if (typeof (this.nodes[i]) === 'function') {
        continue;
      }
      n = this.nodes[i];
      n.$gui = n.draw(typ);
      if (typ === 'svg') {
        // svgUtil.addStyle(board, 'ClazzHeader');
        // FIXME
        // CSS.addStyles(this.$gui, n.$gui);
      }
      this.$gui.appendChild(n.$gui);
      this.fireEvent(this, EventBus.EVENT.CREATED, n);
    }
  }

  public clearLines(): void {
    let i: number;
    for (i = 0; i < this.edges.length; i += 1) {
      this.edges[i].removeFromBoard(this.$gui);
    }
  }

  public drawSVG(draw?: boolean) {
    let g = create({ tag: 'g', model: this }), that = this, width: number, height: number, item, root: any;
    root = this.getRoot();
    let pos = this.getPos();
    let size = this.getSize();
    if (this.status === 'close') {
      width = sizeOf(this.$gui, this) + 30;
      height = 40;
      SymbolLibary.addChild(g, {
        tag: 'text',
        $font: true,
        'text-anchor': 'left',
        'x': (pos.x + 2),
        'y': pos.y + 12,
        value: this.id
      });
    } else {
      this.$gui = g;

      width = getValue(this.$gui.style.width);
      height = getValue(this.$gui.style.height);
      if (this['style'] && this['style'].toLowerCase() === 'nac') {
        SymbolLibary.addChild(g, SymbolLibary.createGroup(this, SymbolLibary.drawStop(this)));
      }
    }
    SymbolLibary.addChild(g, {
      tag: 'rect',
      'width': width,
      'height': height,
      'fill': 'none',
      'strokeWidth': '1px',
      'stroke': getColor(this['style'], '#CCC'),
      'x': pos.x,
      'y': pos.y,
      'class': 'draggable'
    });
    if (width > 0 && width !== size.x) {
      this.size.x = width;
    }
    if (this.status === 'close') {
      // Open Button
      item = SymbolLibary.createGroup(this, SymbolLibary.drawMax(Node.create({ x: (pos.x + width - 20), y: pos.y })));
      this.size.y = height;
    } else {
      item = SymbolLibary.createGroup(this, SymbolLibary.drawMin(Node.create({ x: (pos.x + width - 20), y: pos.y })));
    }
    item.setAttribute('class', 'hand');

    bind(item, 'mousedown', function(e) {
      if (that.status === 'close') {
        that.status = 'open';
        g.model.redrawNode(that);
      } else {
        that.status = 'close';
        // try to cleanup
        for (name in that.nodes) {
          if (that.nodes.hasOwnProperty(name)) {
            that.nodes[name].$gui = null;
          }
        }
        g.model.redrawNode(that);
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      if (e.cancelBubble !== null) {
        e.cancelBubble = true;
      }
    });
    g.appendChild(item);
    return g;
  }

  public drawHTML(draw?: boolean) {
    let pos = this.getPos();
    // let size = this.getSize();
    let graph, item = create({ tag: 'div', model: this });
    setPos(item, pos.x, pos.y);
    if (this.typ === 'classdiagram') {
      item.className = 'classdiagram';
    } else if (this.typ === 'objectdiagram') {
      item.className = 'objectdiagram';
    } else if (this.$parent.typ.toLowerCase() === 'objectdiagram') {
      item.className = 'objectElement';
    } else {
      item.className = 'classElement';
    }
    this.$gui = item;
    if (draw) {
      item.style.borderColor = 'red';
      if (this['style'] && this['style'].toLowerCase() === 'nac') {
        item.appendChild(SymbolLibary.draw(null, { typ: 'stop', x: 0, y: 0 }));
      }
    } else {
      graph = this.$parent;
      graph.layout(0, 0, this);
    }
    setSize(item, this.$gui.style.width, this.$gui.style.height);
    return item;
  }

}
