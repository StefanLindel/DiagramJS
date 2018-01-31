import { DiagramElement } from '../elements/BaseElements';
import { Node } from '../elements/nodes';
import { Edge } from '../elements/edges';
import { Util } from '../util';
import { GraphModel } from '../elements/Model';
import { SymbolLibary } from '../elements/nodes/Symbol';
import { EventHandler } from '../EventBus';
import { Clazz } from '../main';
import { Graph } from '../elements/Graph';

export class Select implements EventHandler {

    private svgRoot: SVGSVGElement;
    private deleteShape: SVGSVGElement;
    private addEdgeShape: SVGSVGElement;
    private model: GraphModel;
    private graph: Graph;
    private padding = 5;

    private lastSelectedNode: Element;
    private lastSelectedEdge: Element;

    constructor(model: GraphModel, graph: Graph) {
        this.model = model;
        this.graph = graph;
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');

        this.deleteShape = SymbolLibary.drawSVG({ type: 'Basket', background: true, id: 'trashcan', tooltip: 'Delete class' });
        this.addEdgeShape = SymbolLibary.drawSVG({ type: 'Edgeicon', background: true, id: 'addEdge', tooltip: 'Click and drag to connect this class' });
    }

    public handle(event: Event, element: DiagramElement): boolean {
        if (this.svgRoot !== <SVGSVGElement><any>document.getElementById('root')) {
            this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        }

        event.stopPropagation();
        if (event.type === 'drag') {
            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');
            this.addEdgeShape.setAttributeNS(null, 'visibility', 'hidden');

            this.resetLastSelectedElements();

            // mark the border with orange
            if(element instanceof Node){
                this.lastSelectedNode = <Element>element.$view.childNodes[0];
            }
            Util.addClass(this.lastSelectedNode, 'SVGClazz-selected');
        }

        if (event.target['id'] === 'background' || element === this.model) {

            this.resetLastSelectedElements();

            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');
            this.addEdgeShape.setAttributeNS(null, 'visibility', 'hidden');

            return true;
        }

        if (element instanceof Node && event.type === 'click') {
            let e = <Node>element;
            if (document.getElementById('trashcan') === null) {
                this.svgRoot.appendChild(this.deleteShape);
            }

            if (document.getElementById('addEdge') === null) {
                this.svgRoot.appendChild(this.addEdgeShape);
            }

            this.resetLastSelectedElements();

            // mark the border with orange
            this.lastSelectedNode = <Element>element.$view.childNodes[0];
            Util.addClass(this.lastSelectedNode, 'SVGClazz-selected');

            this.deleteShape.setAttributeNS(null, 'visibility', 'visible');
            this.addEdgeShape.setAttributeNS(null, 'visibility', 'visible');
            const pos = e.getPos();
            const size = e.getSize();
            // const x = pos.x + size.x / 2 + this.padding;
            // const y = pos.y - size.y / 2 + this.padding / 2;

            let x = (e.getPos().x + e.getSize().x) + 10;
            let y = e.getPos().y;

            this.deleteShape.setAttributeNS(null, 'transform', `translate(${x} ${y + this.padding})`);
            this.deleteShape.onclick = e => this.model.removeElement(element.id);

            let that = this;
            this.addEdgeShape.setAttributeNS(null, 'transform', `translate(${x} ${y + 40 + this.padding})`);
            this.addEdgeShape.onmousedown = function(){
                that.graph.setActiveHandler('NewEdge');
                element.$view.dispatchEvent(new Event('mousedown'));
            };

            // draw textbox to edit clazz in one line
            let divInlineEdit = document.createElement('div');
            divInlineEdit.id = 'inlineEdit';
            divInlineEdit.style.position = 'absolute';
            divInlineEdit.style.top = (e.getPos().y + e.getSize().y) + 57 + 'px';
            divInlineEdit.style.left = e.getPos().x + 4 + 'px';
            divInlineEdit.style.width = e.getSize().x + 'px';
            divInlineEdit.style.zIndex = '42';

            let inputText = document.createElement('input');
            inputText.type = 'text';
            inputText.style.width = '100%';
            inputText.placeholder = 'Add properties, edit label';

            divInlineEdit.appendChild(inputText);
            document.body.appendChild(divInlineEdit);

            let g = this.graph;

            let propertyTypes: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'String', 'void'];

            inputText.addEventListener('keydown', function (evt) {

                let keyCode = (<any>evt).which;
                let clazz = <Clazz>e;

                let inputValue = <any>inputText.value;

                if (inputValue.endsWith(':') && !document.getElementById('selectPropertyType')) {
                    let selectType = document.createElement('select');
                    selectType.id = 'selectPropertyType';
                    selectType.style.width = '100%';

                    for (let type of propertyTypes) {
                        let selectOption = document.createElement('option');
                        selectOption.value = type;
                        selectOption.innerHTML = type;
                        selectType.appendChild(selectOption);
                    }

                    selectType.addEventListener('change', function (evt) {
                        let inputValueSplitted = inputValue.split(':');
                        let selectedPropertyType = selectType.options[selectType.selectedIndex].value;

                        if (inputValueSplitted.length >= 1) {
                            inputText.value = inputValueSplitted[0].trim() + ' : ' + selectedPropertyType;
                            inputText.focus();
                        }
                    });

                    divInlineEdit.appendChild(selectType);
                }
                else if (!inputValue.includes(':')) {
                    let selectType = document.getElementById('selectPropertyType');

                    if (selectType) {
                        selectType.remove();
                    }
                }

                if (keyCode !== 13) {
                    return;
                }

                // attribute
                if (inputValue.includes(':') && !(inputValue.includes('(') && inputValue.includes(')'))) {
                    clazz.addAttribute(inputValue.trim());
                    clazz.reDraw();
                }
                // method
                else if (inputValue.includes('(') && inputValue.includes(')')) {
                    clazz.addMethod(inputValue.trim());
                    clazz.reDraw();
                }
                // label
                else if (inputValue.trim().split(' ').length === 1 && inputValue.trim().length > 0) {
                    clazz.updateLabel(inputValue.trim());
                }

                // reset size
                divInlineEdit.style.top = (clazz.getPos().y + clazz.getSize().y) + 57 + 'px';
                divInlineEdit.style.left = e.getPos().x + 4 + 'px';
                divInlineEdit.style.width = e.getSize().x + 'px';

                inputText.value = '';

                // remove combobox to select type of property
                let selectType = document.getElementById('selectPropertyType');

                if (selectType) {
                    selectType.remove();
                }
            });

            (<any>divInlineEdit.children[0]).focus();

            return true;
        }

        if (element instanceof Edge) {
            if (document.getElementById('trashcan') === null) {
                this.svgRoot.appendChild(this.deleteShape);
            }
            this.deleteShape.setAttributeNS(null, 'visibility', 'visible');

            let x: number, y: number;

            x = (<MouseEvent>event).layerX;
            y = (<MouseEvent>event).layerY;

            this.deleteShape.setAttributeNS(null, 'transform', `translate(${x} ${y})`);
            this.deleteShape.onclick = e => this.model.removeElement(element.id);

            this.resetLastSelectedElements();

            let edge = <Edge>element;
            this.lastSelectedEdge = edge.$view;

            this.lastSelectedEdge.setAttributeNS(null, 'class', 'SVGEdge-selected');
        }
        return true;
    }

    private resetLastSelectedElements() {
        // reset the last one
        if (this.lastSelectedNode) {
            Util.removeClass(this.lastSelectedNode, 'SVGClazz-selected');
        }

        if (this.lastSelectedEdge) {
            this.lastSelectedEdge.setAttributeNS(null, 'class', 'SVGEdge');
        }

        this.removeLastInlineEdit();
    }

    private removeLastInlineEdit(): void {
        // remove last inline edit of clazz
        let lastInlineEdit = document.getElementById('inlineEdit');
        if (lastInlineEdit) {
            document.body.removeChild(lastInlineEdit);

            // its not supported in internet explorer
            // lastInlineEdit.remove();
        }
    }

    public isEnable() : boolean{
        return true;
    }
}
