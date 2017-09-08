import {DiagramElement} from '../elements/BaseElements';
import {HandlerPlugin} from "./HandlerPlugin";

export class Zoom implements HandlerPlugin {

    private svgRoot: SVGSVGElement;

    constructor() {
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
    }

    public handle(e:any, element: DiagramElement): boolean {
        let delta = e.deltaY || e.wheelDeltaY || -e.wheelDelta;
        let d = 1 + (delta / 1000);

        let values = this.svgRoot.getAttribute('viewBox').split(' ');
        const newViewBox = `${values[0]} ${values[1]} ${parseInt(values[2]) * d} ${parseInt(values[3]) * d}`;
        this.svgRoot.setAttribute('viewBox', newViewBox);

        e.preventDefault();
        return true;
    }

    public isEnable(): boolean {
        return true;
    }
}
