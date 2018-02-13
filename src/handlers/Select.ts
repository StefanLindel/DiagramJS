import { DiagramElement } from '../elements/BaseElements';
import { Node } from '../elements/nodes';
import { Edge } from '../elements/edges';
import { Util } from '../util';
import { GraphModel } from '../elements/Model';
import { SymbolLibary } from '../elements/nodes/Symbol';
import { EventHandler, EventBus } from '../EventBus';
import { Clazz } from '../main';
import { Graph } from '../elements/Graph';
import { InfoText } from '../elements/nodes/InfoText';

export class Select implements EventHandler {

    private deleteShape: SVGSVGElement;
    private addEdgeShape: SVGSVGElement;
    private copyNodeShape: SVGSVGElement;
    private graph: Graph;
    private padding = 5;

    private lastSelectedNode: Element;
    private lastSelectedEdge: Element;

    private isDragged: boolean;

    constructor(graph: Graph) {
        this.graph = graph;

        this.deleteShape = SymbolLibary.drawSVG({ type: 'Basket', background: true, id: 'trashcan', tooltip: 'Delete class' });
        this.addEdgeShape = SymbolLibary.drawSVG({ type: 'Edgeicon', background: true, id: 'addEdge', tooltip: 'Click and drag to connect this class' });
        this.copyNodeShape = SymbolLibary.drawSVG({ type: 'Copynode', background: true, id: 'copyNode', tooltip: 'Copy class' });
    }

    public handle(event: Event, element: DiagramElement): boolean {

        let x = Util.getEventX(event);
        let y = Util.getEventY(event);

        event.stopPropagation();
        if (event.type === 'drag') {
            this.isDragged = true;

            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');
            this.addEdgeShape.setAttributeNS(null, 'visibility', 'hidden');
            this.copyNodeShape.setAttributeNS(null, 'visibility', 'hidden');

            this.resetLastSelectedElements();

            // mark the border with orange
            if (element instanceof Node) {
                this.lastSelectedNode = <Element>element.$view;
            }
            Util.addClass(this.lastSelectedNode, 'SVGClazz-selected');
        }

        if (event.target['id'] === 'background' || element === this.graph.$graphModel) {

            this.resetLastSelectedElements();

            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');
            this.addEdgeShape.setAttributeNS(null, 'visibility', 'hidden');
            this.copyNodeShape.setAttributeNS(null, 'visibility', 'hidden');

            return true;
        }

        if (element instanceof Node && event.type === 'click') {
            let e = <Node>element;
            this.graph.root.appendChild(this.deleteShape);
            this.graph.root.appendChild(this.addEdgeShape);
            this.graph.root.appendChild(this.copyNodeShape);
            this.graph.root.appendChild(element.$view);

            this.deleteShape.setAttributeNS(null, 'visibility', 'visible');
            this.addEdgeShape.setAttributeNS(null, 'visibility', 'visible');
            this.copyNodeShape.setAttributeNS(null, 'visibility', 'visible');

            let x = (e.getPos().x + e.getSize().x) + 5;
            let y = e.getPos().y;

            this.deleteShape.setAttributeNS(null, 'transform', `translate(${x} ${y + this.padding})`);
            this.deleteShape.onclick = e => this.graph.$graphModel.removeElement(element.id);

            this.addEdgeShape.setAttributeNS(null, 'transform', `translate(${x} ${y + 40 + this.padding})`);
            this.addEdgeShape.onmousedown = function () {
                EventBus.setActiveHandler('NewEdge');
                element.$view.dispatchEvent(new Event('mousedown'));
            };

            this.copyNodeShape.setAttributeNS(null, 'transform', `translate(${x} ${y + 80 + this.padding})`);
            this.copyNodeShape.onmousedown = (evt) => {
                let nextFreePosition = this.graph.getNextFreePosition();
                let copyClass = (<Clazz>element).copy();
                copyClass.withPos(nextFreePosition.x, nextFreePosition.y);
                copyClass.withSize(element.getSize().x, element.getSize().y);
                this.graph.drawElement(copyClass);
            };

        }
        if (element instanceof Clazz && event.type === 'click') {
            let clazz = <Clazz>element;

            if (Util.isChrome()) {
                if (this.lastSelectedNode && element.id === this.lastSelectedNode.id && !this.isDragged) {
                    return true;
                }
            }

            this.isDragged = false;
            this.resetLastSelectedElements();

            // mark the border with orange
            this.lastSelectedNode = <Element>element.$view;
            Util.addClass(this.lastSelectedNode, 'SVGClazz-selected');


            // draw textbox to edit clazz in one line
            let divInlineEdit = document.createElement('div');
            divInlineEdit.id = 'inlineEdit';
            divInlineEdit.style.position = 'absolute';
            divInlineEdit.style.top = (clazz.getPos().y + clazz.getSize().y) + 57 + 'px';
            divInlineEdit.style.left = clazz.getPos().x + 4 + 'px';
            divInlineEdit.style.width = clazz.getSize().x + 'px';
            divInlineEdit.style.zIndex = '42';

            let inputText = document.createElement('input');
            inputText.type = 'text';
            inputText.style.width = '100%';
            inputText.placeholder = 'Add properties, edit label';

            divInlineEdit.appendChild(inputText);
            document.body.appendChild(divInlineEdit);

            inputText.addEventListener('focusout', (evt) => {

                if (Util.isChrome()) {
                    // only if input is empty, remove the inline edit function
                    if ((!inputText.value || inputText.value.length === 0) && (!this.lastSelectedNode || element.id != this.lastSelectedNode.id)) {
                        this.removeLastInlineEdit();
                    }

                    return;
                }

                // only if input is empty, remove the inline edit function
                if ((!inputText.value || inputText.value.length === 0)) {
                    this.removeLastInlineEdit();
                }
            });

            let g = this.graph;
            let propertyTypes: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'String', 'void'];
            inputText.addEventListener('keydown', function (evt) {

                let keyCode = (<any>evt).which;
                let inputValue = <any>inputText.value;

                if (Util.endsWith(inputValue, ':') && !document.getElementById('selectPropertyType')) {
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
                else if (!Util.includes(inputValue, ':')) {
                    let selectType = document.getElementById('selectPropertyType');

                    if (selectType) {
                        selectType.remove();
                    }
                }

                if (keyCode !== 13) {
                    return;
                }

                // attribute
                if (Util.includes(inputValue, ':') && !(Util.includes(inputValue, '(') && Util.includes(inputValue, ')'))) {
                    clazz.addAttribute(inputValue.trim());
                    clazz.reDraw();
                }
                // method
                else if (Util.includes(inputValue, '(') && Util.includes(inputValue, ')')) {
                    clazz.addMethod(inputValue.trim());
                    clazz.reDraw();
                }
                // label
                else if (inputValue.trim().split(' ').length === 1 && inputValue.trim().length > 0) {
                    clazz.updateLabel(inputValue.trim());
                }

                // reset size
                divInlineEdit.style.top = (clazz.getPos().y + clazz.getSize().y) + 57 + 'px';
                divInlineEdit.style.left = clazz.getPos().x + 4 + 'px';
                divInlineEdit.style.width = clazz.getSize().x + 'px';

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
            this.graph.root.appendChild(element.$view);
            this.graph.root.appendChild(element.$sNode.$view);
            this.graph.root.appendChild(element.$tNode.$view);

            this.graph.root.appendChild(this.deleteShape);
            this.deleteShape.setAttributeNS(null, 'visibility', 'visible');
            this.addEdgeShape.setAttributeNS(null, 'visibility', 'hidden');
            this.copyNodeShape.setAttributeNS(null, 'visibility', 'hidden');

            this.deleteShape.setAttributeNS(null, 'transform', `translate(${x} ${y})`);
            this.deleteShape.onclick = e => this.graph.$graphModel.removeElement(element.id);

            this.resetLastSelectedElements();

            let edge = <Edge>element;
            this.lastSelectedEdge = edge.$view;

            Util.addClass(this.lastSelectedEdge, 'SVGEdge-selected');
        }

        if (element instanceof InfoText) {
            console.log('InfoText');
        }

        return true;
    }

    private resetLastSelectedElements() {
        // reset the last one
        if (this.lastSelectedNode) {
            Util.removeClass(this.lastSelectedNode, 'SVGClazz-selected');
            this.lastSelectedNode = undefined;
        }

        if (this.lastSelectedEdge) {
            Util.removeClass(this.lastSelectedEdge, 'SVGEdge-selected');
            this.lastSelectedEdge = undefined;
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

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(Select.name);
    }

    public setActive(active: boolean): void {
        if (active) {
            EventBus.setActiveHandler(Select.name);
        }
        else {
            EventBus.releaseActiveHandler();
        }
    }
}
