import {DiagramElement} from './elements/BaseElements';
import {Control} from './Control';

export interface EventHandler {
    handle(event: Event, element: DiagramElement): boolean;
    isEnable(): boolean;
}

export class EventBus {
    public static CREATE: string = 'Create';
    public static EDITOR: string = 'Editor';
    public static ELEMENTMOUSEDOWN: string = 'ELEMENT:MOUSEDOWN';
    public static ELEMENTMOUSEUP: string = 'ELEMENT:MOUSEUP';
    public static ELEMENTMOUSELEAVE: string = 'ELEMENT:MOUSELEAVE';
    public static ELEMENTMOUSEMOVE: string = 'ELEMENT:MOUSEMOVE';
    public static ELEMENTMOUSEWHEEL: string = 'ELEMENT:MOUSEWHEEL';
    public static ELEMENTCLICK: string = 'ELEMENT:CLICK';
    public static ELEMENTDBLCLICK: string = 'ELEMENT:DBLCLICK';
    public static ELEMENTDRAG: string = 'ELEMENT:DRAG';
    public static ELEMENTDRAGOVER: string = 'ELEMENT:DRAGOVER';
    public static ELEMENTDROP: string = 'ELEMENT:DROP';
    public static ELEMENTDRAGLEAVE: string = 'ELEMENT:DRAGLEAVE';

    public static EVENTS: string[] = [
        EventBus.CREATE,
        EventBus.EDITOR,
        EventBus.ELEMENTMOUSEDOWN,
        EventBus.ELEMENTMOUSEUP,
        EventBus.ELEMENTMOUSELEAVE,
        EventBus.ELEMENTMOUSEMOVE,
        EventBus.ELEMENTMOUSEWHEEL,
        EventBus.ELEMENTCLICK,
        EventBus.ELEMENTDRAG,
        EventBus.ELEMENTDBLCLICK,
        EventBus.ELEMENTDRAGOVER,
        EventBus.ELEMENTDROP,
        EventBus.ELEMENTDRAGLEAVE,
    ];

    private static handlers = {};

    static register(control: Control, view: Element) {
        let events: string[];
        if (typeof control['getEvents'] === 'function') {
            events = control['getEvents']();
        }

        if (!events || !view) {
            return;
        }
        let pos: number;
        for (let event of events) {
            if (EventBus.EVENTS.indexOf(event) < 0) {
                console.log('event dont know: ' + event);
            }
            pos = event.indexOf(':');
            if (pos > 0) {
                // TODO: solve problem with firefox: window.event is undefined
                view.addEventListener(event.substr(pos + 1).toLowerCase(), function(evt){EventBus.publish(<DiagramElement>control, evt);});
            } else {
                view.addEventListener(event.substr(pos + 1).toLowerCase(), function(evt){EventBus.publish(<DiagramElement>control, evt);});
            }
        }
    }

    // static registerSVG(diagramElement: DiagramElement) {
    //    for (let type in EventBus.handlers.keys()) {
    //       console.log(type);
    //    }
    // for (let event of eventTypes) {
    //  diagramElement.$viewElement.addListener(event, EventBus.publish.bind(null, diagramElement));
    // }
    // }

    public static publish(element: DiagramElement, evt: Event) {
        let event = evt || window.event;

        let handlers = EventBus.handlers[event.type];
        if (handlers) {
            for (let handler of handlers) {
                handler.handle(event, element);
            }
        }
    }

    public static subscribe(handler: EventHandler, ...eventTypes: string[]) {
        for (let event of eventTypes) {
            let handlers = EventBus.handlers[event];
            if (handlers === null || handlers === undefined) {
                handlers = [];
                EventBus.handlers[event] = handlers;
            }
            handlers.push(handler);
        }
    }

}
