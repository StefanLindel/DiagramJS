import {Graph} from './main';
import {Node} from './elements/nodes/Node';
import {SymbolLibary} from './elements/nodes/Symbol';
import {EventBus} from './EventBus';

export class Toolbar {

    private graph: Graph;
    private mainDiv: HTMLDivElement;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    public show(): void {
        if (this.mainDiv) {
            return;
        }

        this.mainDiv = document.createElement('div');
        this.mainDiv.className = 'toolbar';

        let h1Logo = document.createElement('h1');
        h1Logo.className = 'logo';
        h1Logo.textContent = 'DiagramJS';

        let node = {type: 'Hamburger', property: 'HTML', width: 24, height: 24, id: 'GenerateProp'};
        let hamburger = SymbolLibary.draw( node);
        EventBus.registerEvent(hamburger, 'click', node);
        this.mainDiv.appendChild(hamburger);

        this.mainDiv.appendChild(h1Logo);
        document.body.appendChild(this.mainDiv);
    }
}
