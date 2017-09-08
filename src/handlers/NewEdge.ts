import {HandlerPlugin} from "./HandlerPlugin";
import {DiagramElement} from "../elements/BaseElements";

export class NewEdge implements HandlerPlugin {

    public handle(event: Event, element: DiagramElement): boolean {
        return undefined;
    }

    public isEnable(): boolean {
        return true;
    }
}