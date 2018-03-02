import { EventHandler, EventBus } from "../EventBus";
import { DiagramElement } from "../elements/BaseElements";
import * as properties from '../PropertiesPanel';
import { Graph, Association } from "../main";
import { Clazz } from '../elements/nodes/Clazz';
import Attribute from "../elements/nodes/Attribute";
import Method from "../elements/nodes/Method";
import ClazzProperty from "../elements/nodes/ClazzProperty";


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

        if(event.type === EventBus.RELOADPROPERTIES 
            && this._selectedElement && element.id === this._selectedElement.id){

            this.handleSelectNodeEvent(event, element);
            this.handleSelectEdgeEvent(event, element);
        }

        // the same element was clicked. do nothing
        if (this._selectedElement && this._selectedElement.id === element.id) {
            return true;
        }

        if(element.id === 'RootElement'){
            this.dispatch(properties.PropertiesPanel.PropertiesView.Clear);
            this.setPropertiesHeaderText('Select any element to see its properties');
        }

        this._selectedElement = element;

        this.handleSelectNodeEvent(event, element);
        this.handleSelectEdgeEvent(event, element);

        return true;
    }

    public setPropertiesHeaderText(text: string){
        this._blankView.setPropertiesHeaderText(text);
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
        if (view === properties.PropertiesPanel.PropertiesView.Clear) {
            panel = new properties.PropertiesPanel.ClearPanel();
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
        if (!(element instanceof Association)) {
            return false;
        }

        let edge = <Association>element;
        this.dispatch(properties.PropertiesPanel.PropertiesView.Edge);
        this._blankView.setPropertiesHeaderText('Properties of Edge: ' + edge.$sNode.label + '---' + edge.$tNode.label);

        let g = this._graph;
        // add eventlistener to combobox of edge type
        let cBoxEdgeType = <any>document.getElementById('edgeTypeSelect');
        cBoxEdgeType.value = edge.type;
        cBoxEdgeType.addEventListener('change', function () {
            let selectedType = cBoxEdgeType.options[cBoxEdgeType.selectedIndex].value;

            let newEdge = edge.convertEdge(selectedType, g.$graphModel.getNewId(selectedType), true);
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
        inputEdgeSrcProperty.addEventListener('input', function (evt) {
            edge.updateSrcProperty((<HTMLInputElement>inputEdgeSrcProperty).value);
        });

        // show source cardinality
        let inputEdgeSrcCardinality = document.getElementById('inputEdgeSrcCardinality');
        inputEdgeSrcCardinality.addEventListener('input', function (evt) {
            edge.updateSrcCardinality((<HTMLInputElement>inputEdgeSrcCardinality).value);
        });

        if (edge.sourceInfo) {
            inputEdgeSrcProperty.setAttribute('value', edge.sourceInfo.property);
            inputEdgeSrcCardinality.setAttribute('value', edge.sourceInfo.cardinality);
        }

        // show target property
        let inputEdgeTargetProperty = document.getElementById('edgeTargetProperty');
        inputEdgeTargetProperty.addEventListener('input', function (evt) {
            edge.updateTargetProperty((<HTMLInputElement>inputEdgeTargetProperty).value);
        });

        // show target cardinality
        let inputEdgeTargetCardinality = document.getElementById('inputEdgeTargetCardinality');
        inputEdgeTargetCardinality.addEventListener('input', function (evt) {
            edge.updateTargetCardinality((<HTMLInputElement>inputEdgeTargetCardinality).value);
        });

        if (edge.targetInfo) {
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

        let clasModifierSelect = document.getElementById('classModifier');
        clasModifierSelect.setAttribute('value', clazz.label);

        clasModifierSelect.addEventListener('change', function () {
            clazz.updateModifier((<any>clasModifierSelect).value);
        });

        // ### HANDLE ATTRIBUTES ###
        let tabContentAttr = document.getElementById('clazzattribute');

        // remove previous attributes
        let divAddAttr = document.getElementById('clazzattributeAdd');
        while (tabContentAttr.firstChild) {
            tabContentAttr.removeChild(tabContentAttr.firstChild);
        }

        let attributes = clazz.getAttributes();
        for (let attr of attributes) {

            let divEditAttr = this.createDivEditProperty(clazz, attr, 'attribute', tabContentAttr);
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
            let divEditNewAttr = that.createDivEditProperty(clazz, newAttribute, 'attribute', tabContentAttr);

            // reset default values
            modifier.value = '+';
            name.value = '';
            type.value = '';

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

        let methods = clazz.getMethods();
        for (let method of methods) {

            let divEditMethod = this.createDivEditProperty(clazz, method, 'method', tabContentMethods);
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
            let divEditNewMethod = that.createDivEditProperty(clazz, newMethod, 'method', tabContentMethods);

            // reset default values
            modifier.value = '+';
            name.value = '';
            type.value = '';

            tabContentMethods.insertBefore(divEditNewMethod, divAddMethod);

            clazz.reDraw();
        });
        // # # # END HANDLE METHODS # # # 

        return true;
    }

    private createDivEditProperty(clazz: Clazz, prop: ClazzProperty, propType: string, tabContentAttr: HTMLElement): HTMLDivElement {
        let divEditProp = document.createElement('div');
        divEditProp.style.marginTop = '5px';

        // create modifier select 
        let selectPropModifier = document.createElement('select');

        let modifierObj: Object = {};
        modifierObj['public'] = '+';
        modifierObj['private'] = '-';
        modifierObj['protected'] = '#';
        modifierObj['package'] = '~';

        for(let title in modifierObj){
            let modifierOption = document.createElement('option');
            modifierOption.value = modifierObj[title];
            modifierOption.innerHTML = modifierObj[title];
            modifierOption.title = title;
            selectPropModifier.appendChild(modifierOption);
        }
        selectPropModifier.value = prop.modifier;

        selectPropModifier.addEventListener('input', function () {
            prop.updateModifier(selectPropModifier.options[selectPropModifier.selectedIndex].value);
        });

        // create name input
        let textBoxPropName = document.createElement('input');
        textBoxPropName.style.marginLeft = '5px';
        textBoxPropName.style.marginRight = '5px';

        textBoxPropName.type = 'text';
        textBoxPropName.value = prop.name;
        textBoxPropName.addEventListener('input', function () {
            prop.updateName(textBoxPropName.value);
            clazz.reDraw(true);
        });

        // create type select
        let dataListTypes = document.getElementById('dataTypes');
        let selectPropType = document.createElement('input');
        if (dataListTypes) {
            selectPropType.setAttribute('list', dataListTypes.id);
        }

        selectPropType.value = prop.type;

        selectPropType.addEventListener('input', function () {
            prop.updateType(selectPropType.value);
            clazz.reDraw(true);
        });

        // create a button to delete the attribute
        let btnDelete = document.createElement('button');
        btnDelete.innerHTML = 'X';
        btnDelete.title = 'Delete ' + propType;
        btnDelete.style.marginLeft = '5px';
        btnDelete.style.color = 'red';

        btnDelete.addEventListener('click', function () {
            clazz.removeProperty(prop);
            tabContentAttr.removeChild(divEditProp);

            clazz.reDraw();
        });

        divEditProp.appendChild(selectPropModifier);
        divEditProp.appendChild(textBoxPropName);
        divEditProp.appendChild(selectPropType);
        divEditProp.appendChild(btnDelete);

        return divEditProp;
    }
}