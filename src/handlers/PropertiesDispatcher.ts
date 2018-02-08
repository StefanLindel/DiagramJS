import { EventHandler, EventBus } from "../EventBus";
import { DiagramElement } from "../elements/BaseElements";
import * as properties from '../PropertiesPanel';
import { Graph, Edge } from "../main";
import { Clazz } from '../elements/nodes/Clazz';
import Attribute from "../elements/nodes/Attribute";
import Method from "../elements/nodes/Method";


export class PropertiesDispatcher implements EventHandler {

    private _blankView: properties.PropertiesPanel.BlankView;
    private _graph: Graph;

    private _selectedElement: DiagramElement;

    constructor(graph: Graph) {
        this._blankView = new properties.PropertiesPanel.BlankView(graph);
        this._graph = graph;
    }

    public dispatch(view: properties.PropertiesPanel.PropertiesView): void {
        let createdView = this.createView(view);
        this._blankView.show(createdView);
    }

    public getCurrentView(): properties.PropertiesPanel.PropertiesView {
        return this._blankView.getCurrentView();
    }

    public openProperties(): void {
        this._blankView.openProperties();
    }

    public handle(event: Event, element: DiagramElement): boolean {

        this.handleOpenProperties(event, element);

        // the same element was clicked. do nothing
        if (this._selectedElement && this._selectedElement.id === element.id) {
            return true;
        }

        this._selectedElement = element;

        this.handleSelectNodeEvent(event, element);
        this.handleSelectEdgeEvent(event, element);

        return true;
    }

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(PropertiesDispatcher.name);
    }

    public setActive(active: boolean): void {
        if (active) {
            EventBus.setActiveHandler(PropertiesDispatcher.name);
        }
        else {
            EventBus.releaseActiveHandler();
        }
    }

    private createView(view: properties.PropertiesPanel.PropertiesView): properties.PropertiesPanel.APanel {

        let panel;

        if (view === properties.PropertiesPanel.PropertiesView.Clazz) {
            panel = new properties.PropertiesPanel.ClassPanel();
        }
        if (view === properties.PropertiesPanel.PropertiesView.Object) {
            panel = new properties.PropertiesPanel.ObjectPanel();
        }
        if (view === properties.PropertiesPanel.PropertiesView.Edge) {
            panel = new properties.PropertiesPanel.EdgePanel();
        }

        panel.init();
        return panel;
    }

    private handleOpenProperties(event: Event, element: DiagramElement) {
        if (event.type === 'dblclick') {

            event.stopPropagation();
            this.openProperties();
        }
    }

    private handleSelectEdgeEvent(event: Event, element: DiagramElement) {

        // properties panel stuff
        if (!(element instanceof Edge)) {
            return false;
        }

        let edge = <Edge>element;
        this.dispatch(properties.PropertiesPanel.PropertiesView.Edge);
        this._blankView.setPropertiesHeaderText('Properties of Edge: ' + edge.$sNode.label + '---' + edge.$tNode.label);

        let g = this._graph;
        // add eventlistener to combobox of edge type
        let cBoxEdgeType = <any>document.getElementById('edgeTypeSelect');
        cBoxEdgeType.value = edge.type;
        cBoxEdgeType.addEventListener('change', function () {
            let selectedType = cBoxEdgeType.options[cBoxEdgeType.selectedIndex].value;

            let newEdge = edge.convertEdge(selectedType, g.$graphModel.getNewId(selectedType), true);
            // delete g.$graphModel.edges[edge.id];
            // g.$graphModel.edges[newEdge.id] = newEdge;

            edge = newEdge;
        });

        // show label
        let inputTypeEdgeLabel = document.getElementById('edgeLabelInput');
        inputTypeEdgeLabel.setAttribute('value', edge.$sNode.label + ' -> ' + edge.$tNode.label);

        // show source node
        let inputTypeEdgeSrc = document.getElementById('edgeSrcInput');
        inputTypeEdgeSrc.setAttribute('value', edge.$sNode.label);

        // show source property
        let inputEdgeSrcProperty = document.getElementById('edgeSrcProperty');
        inputEdgeSrcProperty.addEventListener('input', function(evt){
            edge.updateSrcProperty((<HTMLInputElement>inputEdgeSrcProperty).value);
        });

        // show source cardinality
        let inputEdgeSrcCardinality = document.getElementById('edgeSrcCardinality');
        inputEdgeSrcCardinality.addEventListener('input', function(evt){
            edge.updateSrcCardinality((<HTMLInputElement>inputEdgeSrcCardinality).value);
        });

        if(edge.sourceInfo){
            inputEdgeSrcProperty.setAttribute('value', edge.sourceInfo.property);
            inputEdgeSrcCardinality.setAttribute('value', edge.sourceInfo.cardinality);
        }

        // show target property
        let inputEdgeTargetProperty = document.getElementById('edgeTargetProperty');
        inputEdgeTargetProperty.addEventListener('input', function(evt){
            edge.updateTargetProperty((<HTMLInputElement>inputEdgeTargetProperty).value);
        });

        // show target cardinality
        let inputEdgeTargetCardinality = document.getElementById('edgeTargetCardinality');
        inputEdgeTargetCardinality.addEventListener('input', function(evt){
            edge.updateTargetCardinality((<HTMLInputElement>inputEdgeTargetCardinality).value);
        });

        if(edge.targetInfo){
            inputEdgeTargetProperty.setAttribute('value', edge.targetInfo.property);
            inputEdgeTargetCardinality.setAttribute('value', edge.targetInfo.cardinality);
        }

        // show target node
        let inputTypeEdgeTarget = document.getElementById('edgeTargetInput');
        inputTypeEdgeTarget.setAttribute('value', edge.$tNode.label);

        return true;
    }

    private handleSelectNodeEvent(event: Event, element: DiagramElement): boolean {

        // properties panel stuff
        if (!(element instanceof Clazz)) {
            return false;
        }

        let that = this;
        let graph = this._graph;
        let clazz = <Clazz>element;
        this.dispatch(properties.PropertiesPanel.PropertiesView.Clazz);
        this._blankView.setPropertiesHeaderText('Properties of Class: ' + clazz.label);

        // set class name of node in propertiespanel
        let classNameInputText = document.getElementById('className');
        classNameInputText.setAttribute('value', clazz.label);

        classNameInputText.addEventListener('input', function () {
            clazz.updateLabel((<any>classNameInputText).value);
        });

        // ### HANDLE ATTRIBUTES ###
        let tabContentAttr = document.getElementById('clazzattribute');

        // remove previous attributes
        let divAddAttr = document.getElementById('clazzattributeAdd');
        while (tabContentAttr.firstChild) {
            tabContentAttr.removeChild(tabContentAttr.firstChild);
        }

        let attributes = clazz.getAttributesObj();
        for (let attr of attributes) {

            let divEditAttr = this.createDivEditAttribute(clazz, attr, tabContentAttr);
            tabContentAttr.appendChild(divEditAttr);
        }

        tabContentAttr.appendChild(divAddAttr);

        let btnAddAttr = document.getElementById('clazzattributeBtnAddattribute');
        btnAddAttr.addEventListener('click', function () {
            let modifier = <HTMLSelectElement>document.getElementById('clazzattributeAddModifier');
            let name = <HTMLInputElement>document.getElementById('clazzattributeAddName');
            let type = <HTMLSelectElement>document.getElementById('clazzattributeAddType');

            if (!name.value || name.value.length == 0) {
                // TODO: show message
                return;
            }

            let attrValue: string = `${modifier.value} ${name.value} : ${type.value}`;

            let newAttribute = clazz.addAttribute(attrValue);
            let divEditNewAttr = that.createDivEditAttribute(clazz, newAttribute, tabContentAttr);

            // reset default values
            modifier.value = '+';
            name.value = '';
            type.value = 'boolean';

            tabContentAttr.insertBefore(divEditNewAttr, divAddAttr);

            clazz.reDraw();
        });
        // # # # END HANDLE ATTRIBUTES # # #

        // # # # HANDLE METHODS # # #
        let tabContentMethods = document.getElementById('clazzmethod');

        // remove previous methods
        let divAddMethod = document.getElementById('clazzmethodAdd');
        while (tabContentMethods.firstChild) {
            tabContentMethods.removeChild(tabContentMethods.firstChild);
        }

        let methods = clazz.getMethodsObj();
        for (let method of methods) {

            let divEditMethod = this.createDivEditMethod(clazz, method, tabContentMethods);
            tabContentMethods.appendChild(divEditMethod);
        }

        tabContentMethods.appendChild(divAddMethod);


        let btnAddMethod = document.getElementById('clazzmethodBtnAddmethod');
        btnAddMethod.addEventListener('click', function () {
            let modifier = <HTMLSelectElement>document.getElementById('clazzmethodAddModifier');
            let name = <HTMLInputElement>document.getElementById('clazzmethodAddName');
            let type = <HTMLSelectElement>document.getElementById('clazzmethodAddType');

            if (!name.value || name.value.length == 0) {
                // TODO: show message
                return;
            }

            let methodValue: string = `${modifier.value} ${name.value} : ${type.value}`;

            let newMethod = clazz.addMethod(methodValue);
            let divEditNewMethod = that.createDivEditMethod(clazz, newMethod, tabContentMethods);

            // reset default values
            modifier.value = '+';
            name.value = '';
            type.value = 'boolean';

            tabContentMethods.insertBefore(divEditNewMethod, divAddMethod);

            clazz.reDraw();
        });
        // # # # END HANDLE METHODS # # # 

        return true;
    }

    private createDivEditAttribute(clazz: Clazz, attr: Attribute, tabContentAttr: HTMLElement): HTMLDivElement {
        let divEditAttr = document.createElement('div');
        divEditAttr.style.marginTop = '5px';

        // create modifier select 
        let selectAttrModifier = document.createElement('select');

        let modifierList: string[] = ['+', '-', '#'];
        modifierList.forEach(modifier => {
            let modifierOption = document.createElement('option');
            modifierOption.value = modifier;
            modifierOption.innerHTML = modifier;
            selectAttrModifier.appendChild(modifierOption);
        });
        selectAttrModifier.value = attr.modifier;

        selectAttrModifier.addEventListener('input', function () {
            attr.updateModifier(selectAttrModifier.options[selectAttrModifier.selectedIndex].value);
        });

        // create name input
        let textBoxAttrName = document.createElement('input');
        textBoxAttrName.style.marginLeft = '5px';
        textBoxAttrName.style.marginRight = '5px';

        textBoxAttrName.type = 'text';
        textBoxAttrName.value = attr.name;
        textBoxAttrName.addEventListener('input', function () {
            attr.updateName(textBoxAttrName.value);
            clazz.reDraw(true);
        });

        // create type select
        let dataListTypes = document.getElementById('dataTypes');
        let selectAttrType = document.createElement('input');
        if (dataListTypes) {
            selectAttrType.setAttribute('list', dataListTypes.id);
        }

        selectAttrType.value = attr.type;

        selectAttrType.addEventListener('input', function () {
            attr.updateType(selectAttrType.value);
            clazz.reDraw(true);
        });

        // create a button to delete the attribute
        let btnDelete = document.createElement('button');
        btnDelete.innerHTML = 'X';
        btnDelete.title = 'Delete attribute';
        btnDelete.style.marginLeft = '5px';
        btnDelete.style.color = 'red';

        btnDelete.addEventListener('click', function () {
            clazz.removeAttribute(attr);
            tabContentAttr.removeChild(divEditAttr);

            clazz.reDraw();
        });

        divEditAttr.appendChild(selectAttrModifier);
        divEditAttr.appendChild(textBoxAttrName);
        divEditAttr.appendChild(selectAttrType);
        divEditAttr.appendChild(btnDelete);

        return divEditAttr;
    }


    private createDivEditMethod(clazz: Clazz, method: Method, tabContentMethods: HTMLElement): HTMLDivElement {
        // wrap all inputs in one div
        let divEditMethod = document.createElement('div');
        divEditMethod.style.marginTop = '5px';

        // create modifier select 
        let selectMethodModifier = document.createElement('select');

        let modifierList: string[] = ['+', '-', '#'];
        modifierList.forEach(modifier => {
            let modifierOption = document.createElement('option');
            modifierOption.value = modifier;
            modifierOption.innerHTML = modifier;
            selectMethodModifier.appendChild(modifierOption);
        });
        selectMethodModifier.value = method.modifier;

        selectMethodModifier.addEventListener('input', function () {
            method.updateModifier(selectMethodModifier.options[selectMethodModifier.selectedIndex].value);
        });

        // create name input
        let textBoxMethodName = document.createElement('input');
        textBoxMethodName.style.marginLeft = '5px';
        textBoxMethodName.style.marginRight = '5px';

        textBoxMethodName.type = 'text';
        textBoxMethodName.value = method.name;
        textBoxMethodName.addEventListener('input', function () {
            method.updateName(textBoxMethodName.value);
            clazz.reDraw(true);
        });


        // create type select
        let dataListTypes = document.getElementById('dataTypes');
        let selectMethodType = document.createElement('input');
        if (dataListTypes) {
            selectMethodType.setAttribute('list', dataListTypes.id);
        }

        selectMethodType.value = method.type;

        selectMethodType.addEventListener('input', function () {
            method.updateType(selectMethodType.value);
            clazz.reDraw(true);
        });

        // create a button to delete the attribute
        let btnDelete = document.createElement('button');
        btnDelete.innerHTML = 'X';
        btnDelete.title = 'Delete method';
        btnDelete.style.marginLeft = '5px';
        btnDelete.style.color = 'red';

        btnDelete.addEventListener('click', function () {
            clazz.removeMethod(method);
            tabContentMethods.removeChild(divEditMethod);

            clazz.reDraw();
        });

        divEditMethod.appendChild(selectMethodModifier);
        divEditMethod.appendChild(textBoxMethodName);
        divEditMethod.appendChild(selectMethodType);
        divEditMethod.appendChild(btnDelete);

        return divEditMethod;
    }
}