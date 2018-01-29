import {Graph} from './elements/Graph';
import { Abstract } from './elements/nodes/index';
import { Util } from './util';

const buttons = {
    // clazz: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10"/><rect width="500" height="125" x="25" y="180" stroke-width="7"/><text x="275" y="100" text-anchor="middle" font-size="111">Class</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
    abstract: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Abstract</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
    clazz: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Class</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
    interface: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Interface</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
    object: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><text x="275" y="150" text-anchor="middle" font-size="111" text-decoration="underline">:Object</text><line x1="25" y1="275" x2="525" y2="275" stroke-width="7" stroke="black"/><text x="50" y="350" font-size="50">attribute = value</text></g></svg>',
    edge: '<svg width="100%" height="100%" viewbox="-100 0 600 500"><text x="125" y="250" font-size="140" text-anchor="middle" transform="rotate(-45 125 250)">Edge</text><polygon points="25,510 40,525 450,115 490,180 525,25 370,60 435,100"/></svg>'
};

export default class Palette {

    private graph: Graph;
    private palette: Element;

    constructor(graph: Graph) {
        this.graph = graph;
        let div = document.createElement('div');
        div.className = 'palette';
        div.id = 'palette';
        document.body.appendChild(div);
        this.palette = div;
        this.addButtons();
    }

    private addButtons() {

        for (let btn in buttons) {
            let button = <HTMLButtonElement>document.createElement('button');
            button.className = 'add' + btn + 'Btn';
            button.innerHTML = buttons[btn];
            button.onclick = e => this.graph.addElement(btn);
            if (btn === 'object' || btn === 'edge') {
                // TODO: implement Objects
                button.disabled = true;
            }
            this.palette.appendChild(button);
        }
    }

}
