import {DiagramElement} from '../elements/BaseElements';
import {Node} from '../elements/nodes';
import {Edge} from '../elements/edges';
import {Util} from '../util';
import {Model} from '../elements/Model';

export class Select {

    private svgRoot: SVGSVGElement;
    private editShape: SVGSVGElement;
    private deleteShape: SVGSVGElement;
    private model: Model;
    private padding = 5;

    private lastSelectedInnerRect : Element;
    private lastSelectedOuterRect : Element;

    constructor(model: Model) {
        this.model = model;
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

        const deletePath = 'M12 12 L18 12 L18 11 L22 11 L22 12 L28 12 L28 14 L27 14 L27 29 L13 29 L13 14 L12 14 Z M13 14 L27 14 M20 17 L20 26 M17 16 L17 27 M23 16 L23 27';
        const deleteAttrPath = {
            tag: 'path',
            d: deletePath,
            stroke: '#000',
            'stroke-width': 1,
            fill: 'white'
        };
        const deleteShape = Util.createShape(deleteAttrPath);
        const deleteBkg = Util.createShape(attrCircle);

        let deleteGroup = Util.createShape({tag: 'g', id: 'trashcan', transform: 'translate(0 0)'});
        deleteGroup.appendChild(deleteBkg);
        deleteGroup.appendChild(deleteShape);

        this.deleteShape = deleteGroup;
    }

    public handle(event:Event, element: DiagramElement): boolean {
        event.stopPropagation();
        if (event.type === 'drag') {
            this.editShape.setAttributeNS(null, 'visibility', 'hidden');
            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');

            // reset the last one
            if(this.lastSelectedOuterRect !== <Element>element.$view.childNodes[0] && this.lastSelectedOuterRect){
                this.lastSelectedOuterRect.setAttributeNS(null, 'stroke', 'black');
            }

            if(this.lastSelectedInnerRect !== <Element>element.$view.childNodes[1]  && this.lastSelectedInnerRect)
                this.lastSelectedInnerRect.setAttributeNS(null, 'stroke', 'black');


            // mark the border with blue
            this.lastSelectedOuterRect = <Element>element.$view.childNodes[0];
            this.lastSelectedInnerRect = <Element>element.$view.childNodes[1];

            this.lastSelectedOuterRect.setAttributeNS(null, 'stroke', 'blue');
            this.lastSelectedInnerRect.setAttributeNS(null, 'stroke', 'blue');
        }

        if(event.srcElement.id === 'background' || element === this.model){
            if(this.lastSelectedOuterRect)
                this.lastSelectedOuterRect.setAttributeNS(null, 'stroke', 'black');

            if(this.lastSelectedInnerRect)
                this.lastSelectedInnerRect.setAttributeNS(null, 'stroke', 'black');

            this.editShape.setAttributeNS(null, 'visibility', 'hidden');
            this.deleteShape.setAttributeNS(null, 'visibility', 'hidden');

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
            if(this.lastSelectedOuterRect)
                this.lastSelectedOuterRect.setAttributeNS(null, 'stroke', 'black');

            if(this.lastSelectedInnerRect)
                this.lastSelectedInnerRect.setAttributeNS(null, 'stroke', 'black');


            // mark the border with blue
            this.lastSelectedOuterRect = <Element>element.$view.childNodes[0];
            this.lastSelectedInnerRect = <Element>element.$view.childNodes[1];

            this.lastSelectedOuterRect.setAttributeNS(null, 'stroke', 'blue');
            this.lastSelectedInnerRect.setAttributeNS(null, 'stroke', 'blue');

            this.editShape.setAttributeNS(null, 'visibility', 'visible');
            this.deleteShape.setAttributeNS(null, 'visibility', 'visible');
            const pos = e.getPos();
            const size = e.getSize();
            // const x = pos.x + size.x / 2 + this.padding;
            // const y = pos.y - size.y / 2 + this.padding / 2;


            let x = (e.getPos().x + e.getSize().x)+10;
            let y = e.getPos().y;


            let editorEvent = new Event('editor');
            this.editShape.setAttributeNS(null, 'transform', `rotate(-45, ${x + 20}, ${y + 20}) translate(${x} ${y})`);
            this.editShape.onclick = e => element.$view.dispatchEvent(editorEvent);

            this.deleteShape.setAttributeNS(null, 'transform', `translate(${x} ${y + 34 + this.padding})`);
            this.deleteShape.onclick = e => this.model.removeElement(element.id);

            return true;
        }
        
        if (element instanceof Edge) {
            let e = <Edge>element;
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
}
