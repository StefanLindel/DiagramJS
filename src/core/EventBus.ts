export default class EventBus {

  public static EVENT = {
    CREATED: 'created',
    LOADRESOURCE: 'loadResource',
    LOAD: 'load',
    RASTER: 'raster',
    HEADER: 'header',
    MOUSEOVER: 'mouseover',
    MOUSEMOVE: 'mousemove',
    MOUSEOUT: 'mouseout'
  };

  public $listeners: Object = {};

  public addElement(item: BaseElement) {
    let events: string[] = item.getEvent();
    for (let i = 0; i < events.length; i++) {
      this.addListener(events[i], item);
    }
  }

  public addListener(event: string, newListener: BaseElement) {
    let listeners = this.getListeners(event);
    let existingListener;
    let idx: number;
    // ensure we order listeners by priority from
    // 0 (high) to n > 0 (low)
    for (idx = 0;
      (existingListener = listeners[idx]); idx++) {
      // prepend newListener at before existingListener
      listeners.splice(idx, 0, newListener);
    }
    listeners.push(newListener);
  }

  public getListeners(name: string) {
    let listeners = this.$listeners[name];
    if (!listeners) {
      this.$listeners[name] = listeners = [];
    }
    return listeners;
  }

  public fireEvent(source: BaseElement, typ: string, value: Object) {
    let nodes = this.getListeners(typ);
    for (let id in nodes) {
      if (nodes.hasOwnProperty(id) === false) {
        continue;
      }
      nodes[id].event(source, typ, value);
    }
  }

  public register(node: HTMLElement) {
    let that = this;
    for (let name in this.$listeners) {
      let localName = name;
      bind(node, name, function(e) {
        that.fireEvent(this, localName, e);
      });
    }
  }

}
