import {DiagramElement} from '../elements/BaseElements';
import {Node} from '../elements/nodes';
import {Edge} from '../elements/edges';
import {Util} from '../util';
import {GraphModel} from '../elements/Model';
import {SymbolLibary} from '../elements/nodes/Symbol';
import {EventHandler} from '../EventBus';
import {Clazz} from '../main';
import {Graph} from '../elements/Graph';

export class Select implements EventHandler {

    private svgRoot: SVGSVGElement;
    private editShape: SVGSVGElement;
    private deleteShape: SVGSVGElement;
    private model: GraphModel;
    private graph: Graph;
    private padding = 5;

    private lastSelectedNode: Element;

    constructor(model: GraphModel, graph: Graph) {
        this.model = model;
        this.graph = graph;
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');

        const attrCircle = {
            tag: 'circle',
            cx: 20,
            cy: 20,
            r: 17,
            stroke: '#888',
            'stroke-width': 2,
            fill: '#DDD'
        };

        const editPath = 'M6 20 L12 23 L33 23 L33 17 L12 17 Z M30 17 L30 23 M12 17 L12 23 M15 19 L28 19 M15 21 L28 21';
        const editAttr = {
            tag: 'path',
            d: editPath,
            stroke: '#000',
            'stroke-width': 1,
            fill: 'white'
        };
        const editShape = Util.createShape(editAttr);
        const editBkg = Util.createShape(attrCircle);

        let editGroup = Util.createShape({tag: 'g', id: 'edit', transform: 'rotate(-45, 20, 20) translate(0 0)'});
        editGroup.appendChild(editBkg);
        editGroup.appendChild(editShape);
        this.editShape = editGroup;

        // const deleteBkg = Util.createShape(attrCircle);

        this.deleteShape = SymbolLibary.drawSVG({type: 'Basket', background: true, id: 'trashcan'});
    }

    public handle(event: Event, element: DiagramElement): boolean {
        if (this.svgRoot !== <SVGSVGElement><any>document.getElementById('root')) {
            this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        }

        event.stopPropagation();
        if (event.type === 'drag') {
            this.editShape.setAttributeNS(null, 'visibility', 'hidden');
            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');

            // reset the last one
            if (this.lastSelectedNode !== <Element>element.$view.childNodes[0] && this.lastSelectedNode) {
                this.lastSelectedNode.setAttributeNS(null, 'class', 'SVGClazz');
            }

            // mark the border with orange
            this.lastSelectedNode = <Element>element.$view.childNodes[0];
            this.lastSelectedNode.setAttributeNS(null, 'class', 'SVGClazz-selected');

            // remove last inline edit of clazz
            this.removeLastInlineEdit();
        }

        if (event.target['id'] === 'background' || element === this.model) {
            if (this.lastSelectedNode) {
                this.lastSelectedNode.setAttributeNS(null, 'class', 'SVGClazz');
            }

            this.editShape.setAttributeNS(null, 'visibility', 'hidden');
            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');

            // remove last inline edit of clazz
            this.removeLastInlineEdit();

            return true;
        }

        if (element instanceof Node && event.type === 'click') {
            let e = <Node>element;
            if (document.getElementById('trashcan') === null) {
                this.svgRoot.appendChild(this.deleteShape);
            }
            if (document.getElementById('edit') === null) {
                this.svgRoot.appendChild(this.editShape);
            }

            // reset the last one
            if (this.lastSelectedNode) {
                this.lastSelectedNode.setAttributeNS(null, 'class', 'SVGClazz');
            }

            // remove last inline edit of clazz
            this.removeLastInlineEdit();

            // mark the border with orange
            this.lastSelectedNode = <Element>element.$view.childNodes[0];
            this.lastSelectedNode.setAttributeNS(null, 'class', 'SVGClazz-selected');

            this.editShape.setAttributeNS(null, 'visibility', 'visible');
            this.deleteShape.setAttributeNS(null, 'visibility', 'visible');
            const pos = e.getPos();
            const size = e.getSize();
            // const x = pos.x + size.x / 2 + this.padding;
            // const y = pos.y - size.y / 2 + this.padding / 2;

            let x = (e.getPos().x + e.getSize().x) + 10;
            let y = e.getPos().y;

            this.editShape.setAttributeNS(null, 'transform', `rotate(-45, ${x + 20}, ${y + 20}) translate(${x} ${y})`);
            this.editShape.onclick = e => element.$view.dispatchEvent(new Event('editor'));

            this.deleteShape.setAttributeNS(null, 'transform', `translate(${x} ${y + 34 + this.padding})`);
            this.deleteShape.onclick = e => this.model.removeElement(element.id);

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

            inputText.addEventListener('change', (evt) => {
                let lastInlineEdit = document.getElementById('inlineEdit');
                let input = lastInlineEdit.children[0];
            });

            let g = this.graph;

            let propertyTypes: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'string'];

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
                    g.layout();
                }
                // method
                else if (inputValue.includes('(') && inputValue.includes(')')) {
                    clazz.addMethod(inputValue.trim());
                    g.layout();
                }
                // label
                else if (inputValue.trim().split(' ').length === 1 && inputValue.trim().length > 0) {
                    clazz.label = inputValue.trim();
                    g.layout();
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
            this.editShape.setAttributeNS(null, 'visibility', 'hidden');
            this.deleteShape.setAttributeNS(null, 'visibility', 'visible');

            let x: number, y: number;

            x = (<MouseEvent>event).layerX;
            y = (<MouseEvent>event).layerY;

            this.deleteShape.setAttributeNS(null, 'transform', `translate(${x} ${y})`);
            this.deleteShape.onclick = e => this.model.removeElement(element.id);
        }
        return true;
    }

    public isEnable(): boolean {
        return true;
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
}
