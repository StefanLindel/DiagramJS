import {Graph} from './elements/Graph';
import * as edges from './elements/edges';

export namespace PropertiesPanel {
    export class BlankView {
        private propertiesMasterPanel: HTMLDivElement;
        private propertiesContent: HTMLDivElement;
        private displayingPanel: APanel;
        private graph: Graph;
        private isHidden: boolean;

        constructor(graph: Graph) {
            this.graph = graph;
            this.initMainPanel();
        }

        public show(panel: APanel, showTabWithValue?: string): void {
            // remove all children from previous view
            if (this.propertiesContent) {

                while (this.propertiesContent.hasChildNodes()) {
                    this.propertiesContent.removeChild(this.propertiesContent.childNodes[0]);
                }
            }

            // append children from new panel to show
            let children = panel.getPanel().childNodes;
            while (children.length > 0) {
                this.propertiesContent.appendChild(children[0]);
            }

            // set the newer properties view
            this.displayingPanel = panel;

            if (showTabWithValue) {
                panel.showTab(showTabWithValue);
            }
            else {
                panel.showFirstTab();
            }
        }

        public openProperties() {
            this.isHidden = false;
            document.getElementById('propertiesContent').className = 'properties';
            document.getElementById('propertiesMasterPanel').className = 'propertiespanel';

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

        public getCurrentView(): string {
            return this.displayingPanel.getPropertiesView();
        }

        public getCurrentPanel(): APanel {
            return this.displayingPanel;
        }

        private initMainPanel(): void {
            if (document.getElementById('propertiesMasterPanel')) {
                return;
            }

            // main div to display any properties, class, edge, etc.
            this.propertiesMasterPanel = document.createElement('div');
            this.propertiesMasterPanel.id = 'propertiesMasterPanel';
            this.propertiesMasterPanel.className = 'propertiespanel-hidden';

            this.propertiesContent = document.createElement('div');
            this.propertiesContent.id = 'propertiesContent';
            this.propertiesContent.className = 'properties-hidden';

            let propertiesHeader = document.createElement('div');
            propertiesHeader.id = 'propertiesHeader';
            propertiesHeader.style.display = 'inline';

            let propHeaderLabel = document.createElement('div');
            propHeaderLabel.id = 'classPropHeaderLabel';
            propHeaderLabel.innerHTML = 'Select any element to see its properties';
            propHeaderLabel.style.display = 'inherit';
            propHeaderLabel.style.cursor = 'pointer';
            propHeaderLabel.onclick = e => this.hideproperties(e);

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

            this.propertiesMasterPanel.appendChild(propertiesHeader);
            this.propertiesMasterPanel.appendChild(this.propertiesContent);
            document.body.appendChild(this.propertiesMasterPanel);
        }

        private hideproperties(evt: Event): void {

            evt.stopPropagation();
            if (this.isHidden === false) {
                document.getElementById('propertiesContent').className = 'properties-hidden';
                document.getElementById('propertiesMasterPanel').className = 'propertiespanel-hidden';
                let btn = document.getElementById('propClassHeaderButtonDisplay');
                btn.innerHTML = '&#8896;';
                btn.title = 'Show properties';
            }
            else {
                document.getElementById('propertiesContent').className = 'properties';
                document.getElementById('propertiesMasterPanel').className = 'propertiespanel';
                let btn = document.getElementById('propClassHeaderButtonDisplay');
                btn.innerHTML = '&#8897;';
                btn.title = 'Hide properties';

            }
            this.isHidden = !this.isHidden;
        }
    }

    export abstract class APanel {
        protected divPropertiesPanel: HTMLDivElement;
        protected divPropertiesTabbedPanel: HTMLDivElement;

        constructor() {
            // get the properties content panel
            this.divPropertiesPanel = document.createElement('div');

            this.divPropertiesTabbedPanel = document.createElement('div');
            this.divPropertiesTabbedPanel.id = 'propertiesTabbedPanel'; // TODO: change styles class
            this.divPropertiesTabbedPanel.className = 'tabbedpane';

            // add tabbed panel
            this.divPropertiesPanel.appendChild(this.divPropertiesTabbedPanel);
        }

        abstract init(): void;

        abstract getPropertiesView(): string;

        public getPanel(): HTMLDivElement {
            return this.divPropertiesPanel;
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
            tabElementBtn.value = tabValue;

            tabElementBtn.onclick = () => this.openTab(id);

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
            document.getElementById(this.getPropertiesView().toLowerCase() + tab.value.toString())
                .style.display = 'block';

        }
    }

    export class ClassPanel extends APanel {
        private dataTypes: HTMLDataListElement;

        constructor() {
            super();
        }

        public init(): void {

            // init datatypes datalist
            // TODO: make a dynamic list of all ever entered types
            let typeList: string[] = ['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'String', 'void'];

            this.dataTypes = document.createElement('datalist');
            this.dataTypes.id = 'dataTypes';

            typeList.forEach(type => {
                let modifierOption = document.createElement('option');
                modifierOption.value = type;
                modifierOption.innerHTML = type;
                this.dataTypes.appendChild(modifierOption);
            });

            this.divPropertiesPanel.appendChild(this.dataTypes);

            // create and append tab elements
            this.divPropertiesTabbedPanel.appendChild(this.createTabElement('generalClassPropBtn', 'General', 'general'));
            this.divPropertiesTabbedPanel.appendChild(this.createTabElement('attrClassPropBtn', 'Attributes', 'attribute'));
            this.divPropertiesTabbedPanel.appendChild(this.createTabElement('methodClassPropBtn', 'Methods', 'method'));

            this.createTabGeneralContent();
            this.createTabAttrContent();
            this.createTabMethodContent();
        }

        public getPropertiesView(): string {
            return 'Clazz';
        }

        private createTabGeneralContent(): void {

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toLowerCase() + 'general';
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
            textBoxClass.style.width = '100%';

            divRowClazzNameCellInput.appendChild(textBoxClass);

            divRowClazzName.appendChild(divRowClazzNameCellText);
            divRowClazzName.appendChild(divRowClazzNameCellInput);
            divTableBody.appendChild(divRowClazzName);

            // ROW2: clazz access modifier
            let divRowClazzModifier = document.createElement('div');
            divRowClazzModifier.className = 'divTableRow';

            // ROW 1 -> Cell1 text clazz name
            let divRowClazzModifierCellText = document.createElement('div');
            divRowClazzModifierCellText.className = 'divTableCell';
            divRowClazzModifierCellText.innerHTML = 'Access modifier:';

            // ROW 1 -> Cell2 input clazz name
            let divRowClazzModifierCellInput = document.createElement('div');
            divRowClazzModifierCellInput.className = 'divTableCell';

            // create modifier select
            let selectClazzModifier = document.createElement('select');
            selectClazzModifier.id = 'classModifier';
            selectClazzModifier.style.width = '100%';

            let modifierObj: Object = {};
            modifierObj['public'] = '+';
            modifierObj['private'] = '-';
            modifierObj['protected'] = '#';
            modifierObj['package'] = '~';

            for (let title in modifierObj) {
                let modifierOption = document.createElement('option');
                modifierOption.value = title;
                modifierOption.innerHTML = title;
                selectClazzModifier.appendChild(modifierOption);
            }
            selectClazzModifier.value = 'public';

            divRowClazzModifierCellInput.appendChild(selectClazzModifier);

            divRowClazzModifier.appendChild(divRowClazzModifierCellText);
            divRowClazzModifier.appendChild(divRowClazzModifierCellInput);
            divTableBody.appendChild(divRowClazzModifier);

            divTable.appendChild(divTableBody);

            div.appendChild(divTable);
            this.divPropertiesPanel.appendChild(div);
        }

        private createTabAttrContent(): void {

            this.createtabPropertyContent('attribute');
        }

        private createTabMethodContent(): void {

            this.createtabPropertyContent('method');
        }

        private createtabPropertyContent(propertyType: string): void {

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toLowerCase() + propertyType;
            div.className = 'tabcontent';

            // wrap all inputs in one div
            let divEditProperty = document.createElement('div');
            divEditProperty.id = div.id + 'Add';
            divEditProperty.style.marginTop = '5px';

            // create modifier select
            let selectPropertyModifier = document.createElement('select');
            selectPropertyModifier.id = div.id + 'AddModifier';

            let modifierObj: Object = {};
            modifierObj['public'] = '+';
            modifierObj['private'] = '-';
            modifierObj['protected'] = '#';
            modifierObj['package'] = '~';

            for (let title in modifierObj) {
                let modifierOption = document.createElement('option');
                modifierOption.value = modifierObj[title];
                modifierOption.innerHTML = modifierObj[title];
                modifierOption.title = title;
                selectPropertyModifier.appendChild(modifierOption);
            }
            selectPropertyModifier.value = modifierObj['public'];

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
            selectPropertyType.setAttribute('list', this.dataTypes.id);

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
            this.divPropertiesPanel.appendChild(div);
        }
    }

    export class EdgePanel extends APanel {

        constructor() {
            super();
        }

        public init(): void {
            // create and append tab elements
            this.divPropertiesTabbedPanel.appendChild(this.createTabElement('generalEdgePropBtn', 'General', 'general'));

            this.createTabGeneralEdgeContent();
        }

        public getPropertiesView(): string {
            return 'Edge';
        }

        private createTabGeneralEdgeContent(): any {

            let cardinalityTypes: string[] = ['0..1', '1', '0..*'];

            let dataListCardinalityTypes = document.createElement('datalist');
            dataListCardinalityTypes.id = 'cardinalityTypesDataList';

            cardinalityTypes.forEach(type => {
                let cardinalityoption = document.createElement('option');
                cardinalityoption.value = type;
                cardinalityoption.innerHTML = type;
                dataListCardinalityTypes.appendChild(cardinalityoption);
            });

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toLowerCase() + 'general';
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

            let edgeTypes: string[] = [];

            for (let type in edges) {
                if (type.toString() === 'Aggregate' || type.toString() === 'Direction') {
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
            textBoxEdgeLabel.readOnly = true;

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

            let inputSrcCardinalityType = document.createElement('input');
            inputSrcCardinalityType.id = 'inputEdgeSrcCardinality';
            inputSrcCardinalityType.className = 'col2';
            inputSrcCardinalityType.placeholder = 'Add source cardinality';
            inputSrcCardinalityType.setAttribute('list', dataListCardinalityTypes.id);

            divRowEdgeSrcNodeCardinalityCellInput.appendChild(inputSrcCardinalityType);

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
            divRowEdgeTargetNodePropertyCellText.innerHTML = 'Target Property:';

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

            let inputTargetCardinalityType = document.createElement('input');
            inputTargetCardinalityType.id = 'inputEdgeTargetCardinality';
            inputTargetCardinalityType.className = 'col2';
            inputTargetCardinalityType.placeholder = 'Add target cardinality';
            inputTargetCardinalityType.setAttribute('list', dataListCardinalityTypes.id);

            divRowEdgeTargetNodeCardinalityCellInput.appendChild(inputTargetCardinalityType);

            divRowEdgeTargetNodeCardinality.appendChild(divRowEdgeTargetNodeCardinalityCellText);
            divRowEdgeTargetNodeCardinality.appendChild(divRowEdgeTargetNodeCardinalityCellInput);
            divTableBody.appendChild(divRowEdgeTargetNodeCardinality);

            divTable.appendChild(divTableBody);
            div.appendChild(dataListCardinalityTypes);
            div.appendChild(divTable);
            this.divPropertiesPanel.appendChild(div);
        }
    }
    export class GeneratePanel extends APanel {
        private graph: Graph;
        constructor(graph: Graph) {
            super();
            this.graph = graph;
        }

        public init(): void {
            this.divPropertiesTabbedPanel.appendChild(this.createTabElement('generalGeneratePropBtn', 'General', 'general'));

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toLowerCase() + 'general';
            div.className = 'tabcontent';

            // Workspace and generate code stuff
            let inputGenerateWorkspace = document.createElement('input');
            inputGenerateWorkspace.id = 'inputWorkspace';
            inputGenerateWorkspace.type = 'text';
            inputGenerateWorkspace.placeholder = 'Type your Folder for generated code...';
            inputGenerateWorkspace.value = 'src/main/java';
            inputGenerateWorkspace.style.marginRight = '5px';
            inputGenerateWorkspace.style.width = '260px';

            let inputGeneratePackage = document.createElement('input');
            inputGeneratePackage.id = 'inputWorkspace';
            inputGeneratePackage.type = 'text';
            inputGeneratePackage.placeholder = 'Type your workspace for generated code...';
            inputGeneratePackage.style.marginRight = '5px';
            inputGeneratePackage.style.width = '260px';
            div.appendChild(inputGenerateWorkspace);
            div.appendChild(inputGeneratePackage);

            let options = document.createElement('div');
            options.style.textAlign = 'center';
            options.style.margin = '3';
            options.style.padding = '5';
            div.appendChild(options);
            options.style.borderStyle = 'groove';
            options.style.borderRadius = '10px';

            options.appendChild(document.createTextNode('Options'));
            options.appendChild(document.createElement('br'));
            let btnGenerate = document.createElement('button');
            btnGenerate.textContent = 'Generate';
            btnGenerate.title = 'Generate code into your workspace';
            btnGenerate.className = 'OptionElement';

            btnGenerate.onclick = () => {
                let workspace = inputGeneratePackage.value;
                if (workspace.length === 0) {
                    alert('No workspace set.\nEnter first your workspace');
                    inputGeneratePackage.focus();
                    return;
                }
                this.graph.generate(workspace, inputGenerateWorkspace.value);
            };
            options.appendChild(btnGenerate);
            options.appendChild(document.createElement('hr'));
            options.appendChild(document.createElement('br'));

            let btnAutoLayout = document.createElement('button');
            btnAutoLayout.id = 'layoutBtn';
            btnAutoLayout.className = 'OptionElement';
            btnAutoLayout.textContent = 'Auto Layout';

            btnAutoLayout.onclick = () => {
                this.graph.layout();
            };

            options.appendChild(btnAutoLayout);
            options.appendChild(document.createElement('br'));

            // delete all nodes
            let btnDeleteAll = document.createElement('button');
            btnDeleteAll.id = 'btnDeleteAll';
            btnDeleteAll.className = 'OptionElement';
            btnDeleteAll.textContent = 'Delete All';
            btnDeleteAll.title = 'Delete all nodes from diagram';

            btnDeleteAll.onclick = () => {
                let confirmDelete = confirm('All classes will be deleted!');
                if (!confirmDelete) {
                    return;
                }

                this.graph.$graphModel.removeAllElements();
            };
            options.appendChild(btnDeleteAll);
            options.appendChild(document.createElement('br'));

            // export stuff
            let exportTypes: string[] = ['Export', 'HTML', 'JSON', 'PDF', 'PNG', 'SVG'];
            let selectExport = document.createElement('select');

            exportTypes.forEach(type => {
                if (!(!window['jsPDF'] && type === 'PDF')) {
                    let option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    selectExport.appendChild(option);
                }
            });

            selectExport.onchange = (evt) => {
                let selectedExportType = selectExport.options[selectExport.selectedIndex].value;
                selectExport.selectedIndex = 0;
                this.graph.saveAs(selectedExportType);
            };
            selectExport.className = 'OptionElement';
            options.appendChild(selectExport);
            options.appendChild(document.createElement('br'));
            this.divPropertiesPanel.appendChild(div);
        }

        public getPropertiesView(): string {
            return 'generate';
        }
    }
    export class ClearPanel extends APanel {

        constructor() {
            super();
        }

        public init(): void {
// do nothing
        }

        public getPropertiesView(): string {
            return 'Clear';
        }
    }
}
