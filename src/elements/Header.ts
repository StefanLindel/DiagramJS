export default class Header extends Node {

  private group;
  private visible: boolean;
  private toolitems: Array<any> = [];

  constructor($parent: Graph) {
    super('HEADER');
    this.size = new Point(60, 28);
    this.$parent = $parent;
  }

  public getEvent(): string[] {
    return [EventBus.EVENT.HEADER, EventBus.EVENT.MOUSEMOVE, EventBus.EVENT.MOUSEOUT];
  }

  public getPos(): Point {
    return new Point(0, 0);
  }

  public getSize(): Point {
    return this.size;
  }

  public draw(draw?: string): HTMLElement {
    let temp, list, item, child, func, i, type, removeToolItems, parent: any, that = this;
    let x, y, root = <Graph>this.getRoot();

    type = root.getTyp().toUpperCase();
    list = ['HTML', 'SVG', 'PNG'];
    parent = this.getRoot();

    removeToolItems = function() {
      for (i = 0; i < that.toolitems.length; i += 1) {
        that.toolitems[i].close();
      }
      that.$parent['$gui'].removeChild(that.group);
    };
    temp = typeof (window['svgConverter']);
    if (temp !== 'undefined') {
      list.push('EPS');
      temp = typeof (window['jsPDF']);
      list.push(temp !== 'undefined' ? 'PDF' : '');
    }
    if (type === 'HTML') {
      that.group = parent.getBoard('svg');
    } else {
      that.group = create({ tag: 'g' });
    }
    item = parent.getModel().getOption('buttons');
    func = function(e) {
      let t = e.currentTarget.typ;
      parent.initBoard(t);
      parent.layout();
    };
    for (i = 0; i < item.length; i += 1) {
      if (item[i] !== type) {
        child = SymbolLibary.draw(SO.create({ 'typ': 'Button', value: item[i], y: 8, x: 2, height: 28, width: 60, $parent: this }));
        child.style.verticalAlign = 'top';
        bind(child, 'mousedown', func);
        child.typ = item[i];
        that.toolitems.push(child);
      }
    }
    if (type === 'HTML') {
      if (this.id) {
        func = function(e) {
          let t = e.currentTarget.value;
          if (t === 'Save') {
            parent.SavePosition();
          } else if (t === 'Load') {
            parent.LoadPosition();
          }
        };
        item = {
          typ: 'Dropdown',
          x: 2,
          y: 8,
          width: 120,
          elements: ['Save', 'Load'],
          activText: 'Localstorage',
          action: func
        };
        that.toolitems.push(SymbolLibary.draw(item, this));
      }
    }
    child = SO.create({
      typ: 'Dropdown',
      x: 66,
      y: 8,
      minheight: 28,
      maxheight: 28,
      width: 80,
      elements: list,
      activText: 'Save',
      action: function(e) {
        removeToolItems();
        parent.SaveAs(e.currentTarget.value);
      }
    });
    this.toolitems.push(SymbolLibary.draw(child, this));

    x = child.x + child.width;
    child = this.toolitems[this.toolitems.length - 1].choicebox;
    child = child.childNodes[child.childNodes.length - 1];
    y = child.height.baseVal.value + child.y.baseVal.value + 10;
    this.withPos(x, y);
    for (i = 0; i < this.toolitems.length; i += 1) {
      this.group.appendChild(this.toolitems[i]);
    }

    setSize(this.group, x, y);
    setPos(this.group, 0, 0);
    CSS.addStyle(this.group, 'SVGBtn');
    return this.group;
  }

  public getRoot(): Node {
    if (this.$parent) {
      return this.$parent.getRoot();
    }
    return this;
  }

  public fireEvent(source: BaseElement, typ: string, value: Object) {
    this.getRoot().fireEvent(source, typ, value);
  }

  public event(source: BaseElement, typ: string, value: Object): boolean {
    if (typ === EventBus.EVENT.MOUSEOUT) {
      if (this.visible) {
        this.$parent['$gui'].removeChild(this.group);
        this.visible = false;
      }
    } else if (value['pageX'] >= this.getSize().x || value['pageY'] >= this.getSize().y) {
      if (this.visible) {
        this.$parent['$gui'].removeChild(this.group);
        this.visible = false;
      }
    } else if (!this.visible) {
      if (!this.group) {
        this.draw();
      }
      this.$parent['$gui'].appendChild(this.group);
      this.visible = true;
    }
    // TODO bind(this.$parent['$gui'], 'mouseover', function () {
    // 	that.$parent['$gui'].appendChild(that.group);
    // });
    // bind(this.$parent['$gui'], 'mouseout', function (event) {
    // 	if (event.pageX >= that.width || event.pageY > that.height) {
    // 		removeToolItems(that.$parent['$gui']);
    // 	}
    // });
    return true;
  }

}
