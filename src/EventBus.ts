import {DiagramElement} from './elements/BaseElements';

export interface EventHandler {
    handle(event: Event, element: DiagramElement): boolean;
    isEnable(): boolean;
}
;

export class EventBus {
    public static ELEMENTCREATE: string = "ELEMENT:Create";
    public static ELEMENTMOUSEDOWN: string = "ELEMENT:MOUSEDOWN";
    public static ELEMENTMOUSEUP: string = "ELEMENT:MOUSEUP";
    public static ELEMENTMOUSELEAVE: string = "ELEMENT:MOUSELEAVE";
    public static ELEMENTMOUSEMOVE: string = "ELEMENT:MOUSEMOVE";
    public static ELEMENTMOUSEWHEEL: string = "ELEMENT:MOUSEWHEEL";
    public static ELEMENTCLICK: string = "ELEMENT:CLICK";
    public static ELEMENTDRAG: string = "ELEMENT:DRAG";

    public static EVENTS: string[] = [EventBus.ELEMENTCREATE, EventBus.ELEMENTMOUSEDOWN, EventBus.ELEMENTMOUSEUP, EventBus.ELEMENTMOUSELEAVE, EventBus.ELEMENTMOUSEMOVE, EventBus.ELEMENTMOUSEWHEEL, EventBus.ELEMENTCLICK, EventBus.ELEMENTDRAG];

    private static handlers = new Map<string, EventHandler[]>();

    static register(diagramElement: DiagramElement, ...eventTypes: string[]) {
        for (let event of eventTypes) {
            if (EventBus.EVENTS.indexOf(event)<0){
                console.log("event dont know: "+event);
            }
            diagramElement.$view.addEventListener(event, EventBus.publish.bind(null, diagramElement));
        }
    }

    //static registerSVG(diagramElement: DiagramElement) {
    //    for (let type in EventBus.handlers.keys()) {
    //       console.log(type);
    //    }
        //for (let event of eventTypes) {
        //  diagramElement.$view.addListener(event, EventBus.publish.bind(null, diagramElement));
        //}
    //}

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
