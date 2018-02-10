import { Clazz } from './elements/nodes/Clazz';
import { EventHandler, EventBus } from './EventBus';
import { Edge } from './elements/index';
import { DiagramElement } from './elements/BaseElements';
import { Graph } from './elements/Graph';
import * as edges from './elements/edges';
import Method from './elements/nodes/Method';
import Attribute from './elements/nodes/Attribute';
import { Button } from "./elements/nodes";

export namespace PropertiesPanel {

    export enum PropertiesView {
        Clazz = 'clazz',
        Object = 'object',
        Edge = 'edge'
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

        public show(panel: APanel, showTabWithValue?: string): void {
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

            if (showTabWithValue) {
                panel.showTab(showTabWithValue);
            }
            else {
                panel.showFirstTab();
            }
        }

        public openProperties() {
            this._isHidden = false;
            document.getElementById("properties").className = "properties";
            document.getElementById("classProp").className = "propertiespanel";

            let btn = document.getElementById('propClassHeaderButtonDisplay');
            btn.innerHTML = '&#8897;';
            btn.title = 'Hide properties';
        }

        public setPropertiesHeaderText(text: string): void {
            let divHeaderLabel = document.getElementById('classPropHeaderLabel');

            if (divHeaderLabel) {
                divHeaderLabel.innerHTML = text;
            }
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

            this._divMainPanel.appendChild(this.propertiesPanel);

            this.generalPanel.id = 'classProp'
            this.generalPanel.className = 'propertiespanel-hidden';
            this.generalPanel.innerHTML = 'General';

            this.propertiesPanel.id = 'classProp'
            this.propertiesPanel.className = 'propertiespanel-hidden';

            let propertiesHeader = document.createElement('div');
            propertiesHeader.id = 'classPropHeader';
            propertiesHeader.style.display = 'inline';

            let propHeaderLabel = document.createElement('div');
            propHeaderLabel.id = 'classPropHeaderLabel';
            propHeaderLabel.innerHTML = 'Properties';
            propHeaderLabel.style.display = 'inherit';

            // button to display and hide the properties of e.g. a class
            let btnPropClassHeaderDisplay = document.createElement('button');
            btnPropClassHeaderDisplay.id = 'propClassHeaderButtonDisplay';
            btnPropClassHeaderDisplay.title = 'Show properties';
            btnPropClassHeaderDisplay.className = 'btnHideProp';
            btnPropClassHeaderDisplay.innerHTML = '&#8896;';
            btnPropClassHeaderDisplay.style.cssFloat = 'right';
            btnPropClassHeaderDisplay.onclick = e => this.hideproperties(e);

            propertiesHeader.appendChild(propHeaderLabel);
            propertiesHeader.appendChild(btnPropClassHeaderDisplay);
            this.propertiesPanel.appendChild(propertiesHeader);
            document.body.appendChild(this._divMainPanel);
        }

        private hideproperties(evt: Event): void {

            if (this._isHidden === false) {
                document.getElementById("properties").className = "properties-hidden";
                document.getElementById("classProp").className = "propertiespanel-hidden";
                let btn = document.getElementById('propClassHeaderButtonDisplay');
                btn.innerHTML = '&#8896;';
                btn.title = 'Show properties';
            }
            else {
                document.getElementById("properties").className = "properties";
                document.getElementById("classProp").className = "propertiespanel";
                let btn = document.getElementById('propClassHeaderButtonDisplay');
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

        public showTab(btnValue: string): void {
            let tabs = document.getElementsByClassName('tablinks');
            for (let index = 0; index < tabs.length; index++) {
                let tab = tabs[index];
                if ((<any>tab).value === btnValue) {
                    this.openTab(tab.id);
                }
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

        private _dataTypes: HTMLDataListElement;

        constructor() {
            super();
        }

        public init(): void {

            // init datatypes datalist
            // TODO: make a dynamic list of all ever entered types
            let typeList: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'String', 'void'];

            this._dataTypes = document.createElement('datalist');
            this._dataTypes.id = 'dataTypes';

            typeList.forEach(type => {
                let modifierOption = document.createElement('option');
                modifierOption.value = type;
                modifierOption.innerHTML = type;
                this._dataTypes.appendChild(modifierOption);
            });

            this._divTabbedPanel.appendChild(this._dataTypes);


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
            let selectPropertyType = document.createElement('input');
            selectPropertyType.id = div.id + 'AddType';
            selectPropertyType.setAttribute('list', this._dataTypes.id);

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
            textBoxEdgeSrc.readOnly = true;

            divRowEdgeSrcNodeCellInput.appendChild(textBoxEdgeSrc);

            divRowEdgeSrcNode.appendChild(divRowEdgeSrcNodeCellText);
            divRowEdgeSrcNode.appendChild(divRowEdgeSrcNodeCellInput);
            divTableBody.appendChild(divRowEdgeSrcNode);






            // ROW4: source node property
            let divRowEdgeSrcNodeProperty = document.createElement('div');
            divRowEdgeSrcNodeProperty.className = 'divTableRow';

            // ROW 4 -> Cell1 text Source property
            let divRowEdgeSrcNodePropertyCellText = document.createElement('div');
            divRowEdgeSrcNodePropertyCellText.className = 'divTableCell';
            divRowEdgeSrcNodePropertyCellText.innerHTML = 'Source Property:';

            // ROW 4 -> Cell2 input Source Node property
            let divRowEdgeSrcNodePropertyCellInput = document.createElement('div');
            divRowEdgeSrcNodePropertyCellInput.className = 'divTableCell';

            let textBoxEdgeSrcProperty = document.createElement('input');
            textBoxEdgeSrcProperty.type = 'text';
            textBoxEdgeSrcProperty.id = 'edgeSrcProperty';
            textBoxEdgeSrcProperty.placeholder = 'Add source property';
            textBoxEdgeSrcProperty.className = 'col2';

            divRowEdgeSrcNodePropertyCellInput.appendChild(textBoxEdgeSrcProperty);

            divRowEdgeSrcNodeProperty.appendChild(divRowEdgeSrcNodePropertyCellText);
            divRowEdgeSrcNodeProperty.appendChild(divRowEdgeSrcNodePropertyCellInput);
            divTableBody.appendChild(divRowEdgeSrcNodeProperty);




            // ROW5: source node cardinality
            let divRowEdgeSrcNodeCardinality = document.createElement('div');
            divRowEdgeSrcNodeCardinality.className = 'divTableRow';

            // ROW5 -> Cell1 text Source Cardinality
            let divRowEdgeSrcNodeCardinalityCellText = document.createElement('div');
            divRowEdgeSrcNodeCardinalityCellText.className = 'divTableCell';
            divRowEdgeSrcNodeCardinalityCellText.innerHTML = 'Source Cardinality:';

            // ROW5 -> Cell2 input Source Node Cardinality
            let divRowEdgeSrcNodeCardinalityCellInput = document.createElement('div');
            divRowEdgeSrcNodeCardinalityCellInput.className = 'divTableCell';

            let textBoxEdgeSrcCardinality = document.createElement('input');
            textBoxEdgeSrcCardinality.type = 'text';
            textBoxEdgeSrcCardinality.id = 'edgeSrcCardinality';
            textBoxEdgeSrcCardinality.placeholder = 'Add source cardinality';
            textBoxEdgeSrcCardinality.className = 'col2';

            divRowEdgeSrcNodeCardinalityCellInput.appendChild(textBoxEdgeSrcCardinality);

            divRowEdgeSrcNodeCardinality.appendChild(divRowEdgeSrcNodeCardinalityCellText);
            divRowEdgeSrcNodeCardinality.appendChild(divRowEdgeSrcNodeCardinalityCellInput);
            divTableBody.appendChild(divRowEdgeSrcNodeCardinality);





            // ### TARGET ###
            // ROW6: target node
            let divRowEdgeTargetNode = document.createElement('div');
            divRowEdgeTargetNode.className = 'divTableRow';

            // ROW6 -> Cell1 text Target Node
            let divRowEdgeTargetNodeCellText = document.createElement('div');
            divRowEdgeTargetNodeCellText.className = 'divTableCell';
            divRowEdgeTargetNodeCellText.innerHTML = 'Target:';

            // ROW6 -> Cell2 input Target Node
            let divRowEdgeTargetNodeCellInput = document.createElement('div');
            divRowEdgeTargetNodeCellInput.className = 'divTableCell';


            let textBoxEdgeTarget = document.createElement('input');
            textBoxEdgeTarget.type = 'text';
            textBoxEdgeTarget.id = 'edgeTargetInput';
            textBoxEdgeTarget.placeholder = 'Edge Source';
            textBoxEdgeTarget.className = 'col2';
            textBoxEdgeTarget.readOnly = true;


            divRowEdgeTargetNodeCellInput.appendChild(textBoxEdgeTarget);

            divRowEdgeTargetNode.appendChild(divRowEdgeTargetNodeCellText);
            divRowEdgeTargetNode.appendChild(divRowEdgeTargetNodeCellInput);
            divTableBody.appendChild(divRowEdgeTargetNode);



            // ROW7: target node property
            let divRowEdgeTargetNodeProperty = document.createElement('div');
            divRowEdgeTargetNodeProperty.className = 'divTableRow';

            // ROW7 -> Cell1 text target property
            let divRowEdgeTargetNodePropertyCellText = document.createElement('div');
            divRowEdgeTargetNodePropertyCellText.className = 'divTableCell';
            divRowEdgeTargetNodePropertyCellText.innerHTML = 'Source Property:';

            // ROW7 -> Cell2 input target Node property
            let divRowEdgeTargetNodePropertyCellInput = document.createElement('div');
            divRowEdgeTargetNodePropertyCellInput.className = 'divTableCell';

            let textBoxEdgeTargetProperty = document.createElement('input');
            textBoxEdgeTargetProperty.type = 'text';
            textBoxEdgeTargetProperty.id = 'edgeTargetProperty';
            textBoxEdgeTargetProperty.placeholder = 'Add target property';
            textBoxEdgeTargetProperty.className = 'col2';

            divRowEdgeTargetNodePropertyCellInput.appendChild(textBoxEdgeTargetProperty);

            divRowEdgeTargetNodeProperty.appendChild(divRowEdgeTargetNodePropertyCellText);
            divRowEdgeTargetNodeProperty.appendChild(divRowEdgeTargetNodePropertyCellInput);
            divTableBody.appendChild(divRowEdgeTargetNodeProperty);





            // ROW8: target node cardinality
            let divRowEdgeTargetNodeCardinality = document.createElement('div');
            divRowEdgeTargetNodeCardinality.className = 'divTableRow';

            // ROW8 -> Cell1 text target Cardinality
            let divRowEdgeTargetNodeCardinalityCellText = document.createElement('div');
            divRowEdgeTargetNodeCardinalityCellText.className = 'divTableCell';
            divRowEdgeTargetNodeCardinalityCellText.innerHTML = 'Target Cardinality:';

            // ROW8 -> Cell2 input target Node Cardinality
            let divRowEdgeTargetNodeCardinalityCellInput = document.createElement('div');
            divRowEdgeTargetNodeCardinalityCellInput.className = 'divTableCell';

            let textBoxEdgeTargetCardinality = document.createElement('input');
            textBoxEdgeTargetCardinality.type = 'text';
            textBoxEdgeTargetCardinality.id = 'edgeTargetCardinality';
            textBoxEdgeTargetCardinality.placeholder = 'Add target cardinality';
            textBoxEdgeTargetCardinality.className = 'col2';

            divRowEdgeTargetNodeCardinalityCellInput.appendChild(textBoxEdgeTargetCardinality);

            divRowEdgeTargetNodeCardinality.appendChild(divRowEdgeTargetNodeCardinalityCellText);
            divRowEdgeTargetNodeCardinality.appendChild(divRowEdgeTargetNodeCardinalityCellInput);
            divTableBody.appendChild(divRowEdgeTargetNodeCardinality);



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