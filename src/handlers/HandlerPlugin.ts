import {DiagramElement} from "../elements/BaseElements";

export interface HandlerPlugin {
    handle(event:Event, element: DiagramElement): boolean;
    isEnable(): boolean;
}