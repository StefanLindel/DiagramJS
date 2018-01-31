import {Clazz} from './elements/nodes/Clazz';
import {EventHandler} from './EventBus';
import {Edge} from './elements/index';
import {DiagramElement} from './elements/BaseElements';
import {Graph} from './elements/Graph';
import * as edges from './elements/edges';
import Method from './elements/nodes/Method';
import Attribute from './elements/nodes/Attribute';
import {Button} from "./elements/nodes";

export namespace PropertiesPanel {

    export enum PropertiesView {
        Clazz = 'clazz',
        Object = 'object',
        Edge = 'edge'
    }


    export class Dispatcher implements EventHandler {
        private _blankView: BlankView;
        private _graph: Graph;

        constructor(graph: Graph) {
            this._blankView = new BlankView(graph);
            this._graph = graph;
        }

        public dispatch(view: PropertiesView): void {
            let createdView = this.createView(view);
            this._blankView.show(createdView);
        }

        public getCurrentView(): PropertiesView {
            return this._blankView.getCurrentView();
        }

        public openProperties(): void {
            this._blankView.openProperties();
        }

        public handle(event: Event, element: DiagramElement): boolean {
            this.handleSelectNodeEvent(event, element);
            this.handleSelectEdgeEvent(event, element);
            this.handleOpenProperties(event, element);

            return true;
        }

        public isEnable(): boolean {
            return true;
        }

        private createView(view: PropertiesView): APanel {

            let panel;

            if (view === PropertiesView.Clazz) {
                panel = new ClassPanel();
            }
            if (view === PropertiesView.Object) {
                panel = new ObjectPanel();
            }
            if (view === PropertiesView.Edge) {
                panel = new EdgePanel();
            }

            panel.init();
            return panel;
        }

        private handleOpenProperties(event: Event, element: DiagramElement) {
            if (event.type === 'openproperties' || event.type === 'dblclick') {

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
            this.dispatch(PropertiesView.Edge);

            let g = this._graph;
            // add eventlistener to combobox of edge type
            let cBoxEdgeType = <any>document.getElementById('edgeTypeSelect');
            cBoxEdgeType.value = edge.typ;
            cBoxEdgeType.addEventListener('change', function () {
                let selectedType = cBoxEdgeType.options[cBoxEdgeType.selectedIndex].value;

                let newEdge = edge.convertEdge(selectedType, g.$graphModel.getNewId(selectedType));
                delete g.$graphModel.edges[edge.id];
                g.$graphModel.edges[newEdge.id] = newEdge;

                edge = newEdge;
                g.layout();
            });

            // show label
            let inputTypeEdgeLabel = document.getElementById('edgeLabelInput');
            inputTypeEdgeLabel.setAttribute('value', edge.$sNode.label + ' -> ' + edge.$tNode.label);

            // show source node
            let inputTypeEdgeSrc = document.getElementById('edgeSrcInput');
            inputTypeEdgeSrc.setAttribute('value', edge.$sNode.label);

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
            this.dispatch(PropertiesView.Clazz);

            // set class name of node in propertiespanel
            // outsource this code in own handler
            let classNameInputText = document.getElementById('className');
            classNameInputText.setAttribute('value', clazz.label);

            classNameInputText.addEventListener('change', function () {
                clazz.updateLabel((<any>classNameInputText).value);
            });

            // ### HANDLE ATTRIBUTES ###
            let tabContentAttr = document.getElementById('clazzattribute');

            // remove previous attributes
            let divAddAttr = document.getElementById('clazzattributeAdd');
            while (tabContentAttr.firstChild) {
                tabContentAttr.removeChild(tabContentAttr.firstChild);
            }

            // TODO: attributes and methods got the same code to display the edit tab
            // put this together

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

            selectAttrModifier.addEventListener('change', function () {
                attr.updateModifier(selectAttrModifier.options[selectAttrModifier.selectedIndex].value);
            });

            // create name input
            let textBoxAttrName = document.createElement('input');
            textBoxAttrName.style.marginLeft = '5px';
            textBoxAttrName.style.marginRight = '5px';

            textBoxAttrName.type = 'text';
            textBoxAttrName.value = attr.name;
            textBoxAttrName.addEventListener('change', function () {
                if (textBoxAttrName.value.length == 0) {
                    clazz.removeAttribute(attr);
                    tabContentAttr.removeChild(divEditAttr);

                    clazz.reDraw();
                } else {
                    attr.updateName(textBoxAttrName.value);

                    clazz.reDraw(true);
                }
            });

            // create type select
            let selectAttrType = document.createElement('select');

            // TODO: make a dynamic list of all ever entered types
            let typeList: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'String'];
            typeList.forEach(type => {
                let modifierOption = document.createElement('option');
                modifierOption.value = type;
                modifierOption.innerHTML = type;
                selectAttrType.appendChild(modifierOption);
            });
            selectAttrType.value = attr.type;

            selectAttrType.addEventListener('change', function () {
                attr.updateType(selectAttrType.options[selectAttrType.selectedIndex].value);

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

            selectMethodModifier.addEventListener('change', function () {
                method.updateModifier(selectMethodModifier.options[selectMethodModifier.selectedIndex].value);
            });

            // create name input
            let textBoxMethodName = document.createElement('input');
            textBoxMethodName.style.marginLeft = '5px';
            textBoxMethodName.style.marginRight = '5px';

            textBoxMethodName.type = 'text';
            textBoxMethodName.value = method.name;
            textBoxMethodName.addEventListener('change', function () {
                // remove method
                if (textBoxMethodName.value.length == 0) {
                    clazz.removeMethod(method);
                    tabContentMethods.removeChild(divEditMethod);

                    clazz.reDraw();
                } else {
                    method.updateName(textBoxMethodName.value);

                    clazz.reDraw(true);
                }

            });

            // create type select
            let selectMethodType = document.createElement('select');

            // TODO: make a dynamic list of all ever entered types
            let typeList: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'String', 'void'];
            typeList.forEach(type => {
                let modifierOption = document.createElement('option');
                modifierOption.value = type;
                modifierOption.innerHTML = type;
                selectMethodType.appendChild(modifierOption);
            });
            selectMethodType.value = method.type;

            selectMethodType.addEventListener('change', function () {
                method.updateType(selectMethodType.options[selectMethodType.selectedIndex].value);

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

    export class BlankView {
        protected _divMainPanel: HTMLDivElement;
        protected _divChildPanel: HTMLDivElement;
        protected _isHidden: boolean;
        private _currentView: PropertiesView;
        private _currentPanel: APanel;
        private propertiesPanel: HTMLDivElement;
        private generalPanel: HTMLDivElement;
        private graph: Graph;

        constructor(graph: Graph) {
            this.graph = graph;
            this.initMainPanel();
        }

        public show(panel: APanel): void {
            // remove the previous properties view
            if (this._divChildPanel) {
                let previousView = document.getElementById(this._divChildPanel.id);
                if (previousView) {
                    this.propertiesPanel.removeChild(previousView);
                }
            }

            // set the newer properties view
            this._currentPanel = panel;
            this._currentView = panel.getPropertiesView();
            this._divChildPanel = panel.getPanel();
            this.propertiesPanel.appendChild(this._divChildPanel);

            panel.showFirstTab();
        }

        public openProperties() {
            this._isHidden = false;
            document.getElementById("properties").className = "properties";
            document.getElementById("classProp").className = "propertiespanel";

            let btn = document.getElementById('btnHidePropertiesPanel');
            btn.innerHTML = '&#8897;';
            btn.title = 'Hide properties';
        }

        public getCurrentView(): PropertiesView {
            return this._currentView;
        }

        public getCurrentPanel(): APanel {
            return this._currentPanel;
        }

        private initMainPanel(): void {
            if (document.getElementById('classProp')) {
                return;
            }

            // main div to display any properties, class, object, etc.
            this._divMainPanel = document.createElement('div');
            this.propertiesPanel = document.createElement('div');
            this.generalPanel = document.createElement('div');

            //this._divMainPanel.appendChild(this.generalPanel);
            this._divMainPanel.appendChild(this.propertiesPanel);

            this.generalPanel.id = 'classProp'
            this.generalPanel.className = 'propertiespanel-hidden';
            this.generalPanel.innerHTML = 'General';

            this.propertiesPanel.id = 'classProp'
            this.propertiesPanel.className = 'propertiespanel-hidden';
            this.propertiesPanel.innerHTML = 'Properties';

            // DIRTY
            let button: HTMLButtonElement = document.createElement('button');
            button.innerHTML = 'Generate';
            let that = this;
            button.addEventListener('click', function(e) { that.generate(e);} );
            this.propertiesPanel.appendChild(button);

            // button to display and hide the properties of e.g. a class
            let btnProperties = document.createElement('button');
            btnProperties.id = 'btnHidePropertiesPanel';
            btnProperties.title = 'Show properties';
            btnProperties.className = 'btnHideProp';
            btnProperties.innerHTML = '&#8896;';
            btnProperties.style.cssFloat = 'right';
            btnProperties.onclick = e => this.hideproperties(e);

            this.propertiesPanel.appendChild(btnProperties);
            document.body.appendChild(this._divMainPanel);
        }

        private generate(event: any ): void {
            console.log(event);
            this.graph.generate();

        }

        private hideproperties(evt: Event): void {

            if (this._isHidden === false) {
                document.getElementById("properties").className = "properties-hidden";
                document.getElementById("classProp").className = "propertiespanel-hidden";
                let btn = document.getElementById('btnHidePropertiesPanel');
                btn.innerHTML = '&#8896;';
                btn.title = 'Show properties';
            }
            else {
                document.getElementById("properties").className = "properties";
                document.getElementById("classProp").className = "propertiespanel";
                let btn = document.getElementById('btnHidePropertiesPanel');
                btn.innerHTML = '&#8897;';
                btn.title = 'Hide properties';

            }
            this._isHidden = !this._isHidden;
        }

    }

    export abstract class APanel {
        protected _divChildPanel: HTMLDivElement;
        protected _divTabbedPanel: HTMLDivElement;

        constructor() {
            // div for properties
            this._divChildPanel = document.createElement('div');
            this._divChildPanel.id = 'properties';

            if (document.getElementById("classProp").className.indexOf('hidden') > -1) {
                this._divChildPanel.className = 'properties-hidden';
            }
            else {
                this._divChildPanel.className = 'properties';
            }


            this._divTabbedPanel = document.createElement('div');
            this._divTabbedPanel.id = 'classtabproperties';
            this._divTabbedPanel.className = 'tabbedpane';

            // add tabbed panel
            this._divChildPanel.appendChild(this._divTabbedPanel);
        }

        abstract init(): void;

        abstract getPropertiesView(): PropertiesView;

        public getPanel(): HTMLDivElement {
            return this._divChildPanel;
        }

        public showFirstTab(): void {
            let tabs = document.getElementsByClassName('tablinks');
            if (tabs && tabs.length > 0) {
                this.openTab(tabs[0].id);
            }
        }

        protected createTabElement(id: string, tabText: string, tabValue: string): HTMLButtonElement {
            let tabElementBtn = document.createElement('button');
            tabElementBtn.id = id;
            tabElementBtn.className = 'tablinks';
            tabElementBtn.innerText = tabText;
            tabElementBtn.value = tabValue

            tabElementBtn.onclick = e => this.openTab(id);

            return tabElementBtn;
        }

        protected openTab(clickedId: string): void {
            let tabs = document.getElementsByClassName('tablinks');
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].className = tabs[i].className.replace('active', '');
            }

            let tab = <HTMLButtonElement>document.getElementById(clickedId);
            tab.className += ' active';


            // hide other tabcontent
            let tabContents = document.getElementsByClassName('tabcontent');
            for (let i = 0; i < tabContents.length; i++) {
                (<HTMLElement>tabContents[i]).style.display = 'none';
            }

            // display active tab content
            document.getElementById(this.getPropertiesView().toString().toLowerCase() + tab.value.toString())
                .style.display = 'block';

        }
    }

    export class ClassPanel extends APanel {

        constructor() {
            super();
        }

        public init(): void {
            // create and append tab elements
            this._divTabbedPanel.appendChild(this.createTabElement('generalClassPropBtn', 'General', 'general'));
            this._divTabbedPanel.appendChild(this.createTabElement('attrClassPropBtn', 'Attributes', 'attribute'));
            this._divTabbedPanel.appendChild(this.createTabElement('methodClassPropBtn', 'Methods', 'method'));

            this.createTabGeneralContent();
            this.createTabAttrContent();
            this.createTabMethodContent();
        }

        public getPropertiesView(): PropertiesView {
            return PropertiesView.Clazz;
        }

        private createTabGeneralContent(): void {

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toString().toLowerCase() + 'general';
            div.className = 'tabcontent';

            let divTable = document.createElement('div');
            divTable.className = 'divTable';

            let divTableBody = document.createElement('div');
            divTableBody.className = 'divTableBody';


            // ROW1: clazz name
            let divRowClazzName = document.createElement('div');
            divRowClazzName.className = 'divTableRow';

            // ROW 1 -> Cell1 text clazz name
            let divRowClazzNameCellText = document.createElement('div');
            divRowClazzNameCellText.className = 'divTableCell';
            divRowClazzNameCellText.innerHTML = 'Name:';

            // ROW 1 -> Cell2 input clazz name
            let divRowClazzNameCellInput = document.createElement('div');
            divRowClazzNameCellInput.className = 'divTableCell';


            let textBoxClass = document.createElement('input');
            textBoxClass.type = 'text';
            textBoxClass.id = 'className';
            textBoxClass.placeholder = 'Class name';
            textBoxClass.style.marginRight = '10px';


            divRowClazzNameCellInput.appendChild(textBoxClass);

            divRowClazzName.appendChild(divRowClazzNameCellText);
            divRowClazzName.appendChild(divRowClazzNameCellInput);
            divTableBody.appendChild(divRowClazzName);

            divTable.appendChild(divTableBody);

            div.appendChild(divTable);
            this._divChildPanel.appendChild(div);
        }

        private createTabAttrContent(): void {

            this.createtabPropertyContent('attribute');
        }

        private createTabMethodContent(): void {

            this.createtabPropertyContent('method');
        }

        private createtabPropertyContent(propertyType: string): void {

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toString().toLowerCase() + propertyType;
            div.className = 'tabcontent';

            // wrap all inputs in one div
            let divEditProperty = document.createElement('div');
            divEditProperty.id = div.id + 'Add';
            divEditProperty.style.marginTop = '5px';

            // create modifier select 
            let selectPropertyModifier = document.createElement('select');
            selectPropertyModifier.id = div.id + 'AddModifier';

            let modifierList: string[] = ['+', '-', '#'];
            modifierList.forEach(modifier => {
                let modifierOption = document.createElement('option');
                modifierOption.value = modifier;
                modifierOption.innerHTML = modifier;
                selectPropertyModifier.appendChild(modifierOption);
            });
            selectPropertyModifier.value = modifierList[0];

            // create name input
            let textBoxPropertyName = document.createElement('input');
            textBoxPropertyName.style.marginLeft = '5px';
            textBoxPropertyName.style.marginRight = '5px';
            textBoxPropertyName.id = div.id + 'AddName';
            textBoxPropertyName.type = 'text';
            textBoxPropertyName.placeholder = 'Add new ' + propertyType;

            // create type select
            let selectPropertyType = document.createElement('select');
            selectPropertyType.id = div.id + 'AddType';

            // TODO: make a dynamic list of all ever entered types
            let typeList: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'String'];
            if(propertyType.startsWith('method')){
                typeList.push('void');
            }

            typeList.forEach(type => {
                let modifierOption = document.createElement('option');
                modifierOption.value = type;
                modifierOption.innerHTML = type;
                selectPropertyType.appendChild(modifierOption);
            });

            // create a button to delete the attribute
            let btnAdd = document.createElement('button');
            btnAdd.id = div.id + 'BtnAdd' + propertyType;
            btnAdd.innerHTML = '+';
            btnAdd.title = 'Add ' + propertyType;
            btnAdd.style.marginLeft = '5px';
            btnAdd.style.color = 'green';

            divEditProperty.appendChild(selectPropertyModifier);
            divEditProperty.appendChild(textBoxPropertyName);
            divEditProperty.appendChild(selectPropertyType);
            divEditProperty.appendChild(btnAdd);


            div.appendChild(divEditProperty);
            this._divChildPanel.appendChild(div);
        }
    }

    export class EdgePanel extends APanel {
        constructor() {
            super();
        }

        public init(): void {
            // create and append tab elements
            this._divTabbedPanel.appendChild(this.createTabElement('generalEdgePropBtn', 'General', 'general'));

            this.createTabGeneralEdgeContent();
        }

        public getPropertiesView(): PropertiesView {
            return PropertiesView.Edge;
        }

        private createTabGeneralEdgeContent(): any {
            let div = document.createElement('div');
            div.id = this.getPropertiesView().toString().toLowerCase() + 'general';
            div.className = 'tabcontent';

            let divTable = document.createElement('div');
            divTable.className = 'divTable';

            let divTableBody = document.createElement('div');
            divTableBody.className = 'divTableBody';


            // ROW 1: edge type 
            let divRowEdgeType = document.createElement('div');
            divRowEdgeType.className = 'divTableRow';

            // ROW 1 -> Cell1 text Type
            let divRowEdgeTypeCellText = document.createElement('div');
            divRowEdgeTypeCellText.className = 'divTableCell';
            divRowEdgeTypeCellText.innerHTML = 'Type:';

            // ROW 2 -> Cell2 select Type
            let divRowEdgeTypeCellSelect = document.createElement('div');
            divRowEdgeTypeCellSelect.className = 'divTableCell';

            let selectEdgeType = document.createElement('select');
            selectEdgeType.id = 'edgeTypeSelect';
            selectEdgeType.className = 'col2';

            let edgeTypes: string[] = new Array();

            for (let type in edges) {
                if (type.toString() === 'Association'
                    || type.toString() === 'Dependency'
                    || type.toString() === 'Unidirectional') {
                    continue;
                }

                edgeTypes.push(type);
            }

            edgeTypes.sort();

            for (let type of edgeTypes) {
                let selectOption = document.createElement('option');
                selectOption.value = type;
                selectOption.innerHTML = type;
                selectEdgeType.appendChild(selectOption);
            }

            divRowEdgeTypeCellSelect.appendChild(selectEdgeType);

            divRowEdgeType.appendChild(divRowEdgeTypeCellText);
            divRowEdgeType.appendChild(divRowEdgeTypeCellSelect);
            divTableBody.appendChild(divRowEdgeType);


            // ROW 2: edge label 
            let divRowEdgeLabel = document.createElement('div');
            divRowEdgeLabel.className = 'divTableRow';

            // ROW 2 -> Cell1 text Label
            let divRowEdgeLabelCellText = document.createElement('div');
            divRowEdgeLabelCellText.className = 'divTableCell';
            divRowEdgeLabelCellText.innerHTML = 'Label:';

            // ROW 2 -> Cell2 input Label
            let divRowEdgeLabelCellInput = document.createElement('div');
            divRowEdgeLabelCellInput.className = 'divTableCell';


            let textBoxEdgeLabel = document.createElement('input');
            textBoxEdgeLabel.type = 'text';
            textBoxEdgeLabel.id = 'edgeLabelInput';
            textBoxEdgeLabel.placeholder = 'Edge label';
            textBoxEdgeLabel.className = 'col2';

            divRowEdgeLabelCellInput.appendChild(textBoxEdgeLabel);

            divRowEdgeLabel.appendChild(divRowEdgeLabelCellText);
            divRowEdgeLabel.appendChild(divRowEdgeLabelCellInput);
            divTableBody.appendChild(divRowEdgeLabel);


            // ROW3: source node
            let divRowEdgeSrcNode = document.createElement('div');
            divRowEdgeSrcNode.className = 'divTableRow';

            // ROW 3 -> Cell1 text Source Node
            let divRowEdgeSrcNodeCellText = document.createElement('div');
            divRowEdgeSrcNodeCellText.className = 'divTableCell';
            divRowEdgeSrcNodeCellText.innerHTML = 'Source:';

            // ROW 3 -> Cell2 input Source Node
            let divRowEdgeSrcNodeCellInput = document.createElement('div');
            divRowEdgeSrcNodeCellInput.className = 'divTableCell';

            let textBoxEdgeSrc = document.createElement('input');
            textBoxEdgeSrc.type = 'text';
            textBoxEdgeSrc.id = 'edgeSrcInput';
            textBoxEdgeSrc.placeholder = 'Edge Source';
            textBoxEdgeSrc.className = 'col2';

            divRowEdgeSrcNodeCellInput.appendChild(textBoxEdgeSrc);

            divRowEdgeSrcNode.appendChild(divRowEdgeSrcNodeCellText);
            divRowEdgeSrcNode.appendChild(divRowEdgeSrcNodeCellInput);
            divTableBody.appendChild(divRowEdgeSrcNode);


            // ROW4: target node
            let divRowEdgeTargetNode = document.createElement('div');
            divRowEdgeTargetNode.className = 'divTableRow';

            // ROW 4 -> Cell1 text Target Node
            let divRowEdgeTargetNodeCellText = document.createElement('div');
            divRowEdgeTargetNodeCellText.className = 'divTableCell';
            divRowEdgeTargetNodeCellText.innerHTML = 'Source:';

            // ROW 4 -> Cell2 input Target Node
            let divRowEdgeTargetNodeCellInput = document.createElement('div');
            divRowEdgeTargetNodeCellInput.className = 'divTableCell';


            let textBoxEdgeTarget = document.createElement('input');
            textBoxEdgeTarget.type = 'text';
            textBoxEdgeTarget.id = 'edgeTargetInput';
            textBoxEdgeTarget.placeholder = 'Edge Source';
            textBoxEdgeTarget.className = 'col2';


            divRowEdgeTargetNodeCellInput.appendChild(textBoxEdgeTarget);

            divRowEdgeTargetNode.appendChild(divRowEdgeTargetNodeCellText);
            divRowEdgeTargetNode.appendChild(divRowEdgeTargetNodeCellInput);
            divTableBody.appendChild(divRowEdgeTargetNode);

            divTable.appendChild(divTableBody);

            div.appendChild(divTable);
            this._divChildPanel.appendChild(div);
        }
    }

    export class ObjectPanel extends APanel {

        constructor() {
            super();
        }

        public init(): void {

            // div for class properties
            this._divChildPanel = document.createElement('div');
            this._divChildPanel.id = 'properties';
            this._divChildPanel.className = 'properties-hidden';

            // text input for className
            let textBoxObjectName = document.createElement('input');
            textBoxObjectName.type = 'text';
            textBoxObjectName.id = 'objectName';
            textBoxObjectName.placeholder = 'Object name';

            // text input for className
            let textBoxObjectAttr = document.createElement('input');
            textBoxObjectAttr.type = 'text';
            textBoxObjectAttr.id = 'objectAttr';
            textBoxObjectAttr.placeholder = 'Object Attr';

            this._divChildPanel.appendChild(textBoxObjectName);
            this._divChildPanel.appendChild(textBoxObjectAttr);
        }

        public getPropertiesView(): PropertiesView {
            return PropertiesView.Object;
        }
    }
}