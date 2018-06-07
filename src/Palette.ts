import { Graph } from './elements/Graph';

/*const buttons = {
    abstract: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Abstract</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
    clazz: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Class</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
    interface: '<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Interface</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',
};
*/
export default class Palette {

    private graph: Graph;
    private palette: Element;
    private root: HTMLDivElement;

    constructor(graph: Graph) {
        this.graph = graph;
        let div = document.createElement('div');
        div.className = 'palette';
        div.id = 'palette';
        this.root = div;
        this.palette = div;
        for (let key in graph.nodeFactory) {
            let element = graph.nodeFactory[key];
            let control = new element();
            let icon = control.getToolBarIcon();
            if (icon) {
                let button = <HTMLButtonElement>document.createElement('button');
                button.className = 'add' + key + 'Btn';
                button.innerHTML = icon.outerHTML;
                button.onclick = e => {
                    let nextFreePosition = this.graph.getNextFreePosition();
                    let node = this.graph.addElementWithValues(graph.nodeFactory[key], {x: nextFreePosition.x, y: nextFreePosition.y}, false);
                    this.graph.drawElement(node);
                };
                this.palette.appendChild(button);
            }
        }
        // this.graph.nodeFactory
//        this.addButtons();
    }

    public show() {
        document.body.appendChild(this.root);
    }

    private addButtons() {
        /*for (let btn in buttons) {
            let button = <HTMLButtonElement>document.createElement('button');
            button.className = 'add' + btn + 'Btn';
            button.innerHTML = buttons[btn];
            button.onclick = e => {
                let nextFreePosition = this.graph.getNextFreePosition();
                let node = this.graph.addElementWithValues(btn, {x: nextFreePosition.x, y: nextFreePosition.y}, false);
                this.graph.drawElement(node);
            };
            this.palette.appendChild(button);
        }*/
    }
}
