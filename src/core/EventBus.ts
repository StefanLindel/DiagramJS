import { DiagramElement } from '../elements/BaseElements';

export interface EventHandler {
  handle(event: Event, element: DiagramElement);
};

export class EventBus {

  private static handlers = new Map<string, EventHandler[]>();

  static register(diagramElement: DiagramElement, ...eventTypes: string[]) {
    for (let event of eventTypes) {
      diagramElement.view.addEventListener(event, EventBus.publish.bind(null, diagramElement));
    }
  }

  public static publish(element: DiagramElement, event: Event) {
    let handlers = EventBus.handlers.get(event.type);
    if (handlers) {
      for (let handler of handlers) {
        handler.handle(event, element);
      }
    }
  }

  public static subscribe(handler: EventHandler, ...eventTypes: string[]) {
    for (let event of eventTypes) {
      let handlers = EventBus.handlers.get(event);
      if (handlers === null || handlers === undefined) {
        handlers = [];
        EventBus.handlers.set(event, handlers);
      }
      handlers.push(handler);
    }
  }

}
