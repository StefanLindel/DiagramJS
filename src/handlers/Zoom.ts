import {DiagramElement} from '../elements/BaseElements';
import { EventHandler, EventBus } from '../EventBus';
import { Graph } from '../elements/Graph';

export class Zoom implements EventHandler {

    private graph: Graph;

    constructor(graph: Graph) {
    }

    public handle(e: any, element: DiagramElement): boolean {
        let delta = e.deltaY || e.wheelDeltaY || -e.wheelDelta;
        let d = 1 + (delta / 1000);

        let values = this.graph.root.getAttribute('viewBox').split(' ');
        const newViewBox = `${values[0]} ${values[1]} ${parseInt(values[2]) * d} ${parseInt(values[3]) * d}`;
        this.graph.root.setAttribute('viewBox', newViewBox);

        e.preventDefault();
        return true;
    }

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(Zoom.name);
    }

    public setActive(active: boolean): void {
        if(active){
            EventBus.setActiveHandler(Zoom.name);
        }
        else{
            EventBus.releaseActiveHandler();
        }
    }
}
