import { Clazz } from './elements/nodes/Clazz';
import { EventHandler } from './EventBus';
import { Edge } from './elements/index';
import { DiagramElement } from './elements/BaseElements';
import { Graph } from './elements/Graph';
import * as edges from './elements/edges';

export namespace PropertiesPanel {

    //TODO: methods und attribute in einzelne klassen umwandeln und
    // modifier, namen und typ einzeln in einem element darstellen
    // method erhalten dazu weitere elemente zum bearbeiten von parametern

    export enum PropertiesView {
        Clazz = 'clazz',
        Object = 'object',
        Edge = 'edge'
    }


    export class Dispatcher implements EventHandler {
        private _blankView: BlankView;
        private _graph : Graph;

        constructor(graph:Graph) {
            this._blankView = new BlankView();
            this._graph = graph;
        }

        public dispatch(view: PropertiesView): void {
            let createdView = this.createView(view);
            this._blankView.show(createdView);
        }

        public getCurrentView(): PropertiesView {
            return this._blankView.getCurrentView();
        }

        private createView(view: PropertiesView): APanel {

            let panel;
            // if (this._blankView && this._blankView.getCurrentView() === view) {
            //     return this._blankView.getCurrentPanel();
            // }

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

        handle(event: Event, element: DiagramElement): boolean {
            this.handleSelectNodeEvent(event, element);
            this.handleSelectEdgeEvent(event, element);

            return true;
        }
        isEnable(): boolean {
            return true;
        }

        private handleSelectEdgeEvent(event: Event, element: DiagramElement) {

            // properties panel stuff
            if (!(element instanceof Edge)) {
                return false;
            }

            let edge = <Edge>element;
            this.dispatch(PropertiesView.Edge);

            const g = this._graph;
            // add eventlistener to combobox of edge type
            let cBoxEdgeType = <any>document.getElementById('edgeTypeSelect');
            cBoxEdgeType.value = edge.typ;
            cBoxEdgeType.addEventListener('change', function(){
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

            let graph = this._graph;
            let clazz = <Clazz>element;
            this.dispatch(PropertiesView.Clazz);

            // set class name of node in propertiespanel
            // outsource this code in own handler
            let classNameInputText = document.getElementById('className');
            classNameInputText.setAttribute('value', clazz.label);
            
            classNameInputText.addEventListener('change', function(){
                clazz.label = (<any>classNameInputText).value;
                graph.layout();
            });

            // get tab content of attributes
            let tabContentAttr = document.getElementById('clazzAttributes');

            // remove previous attributes
            while (tabContentAttr.firstChild) {
                tabContentAttr.removeChild(tabContentAttr.firstChild);
            }

            let attributes = clazz.getAttributesObj();
            for (let attr of attributes) {
                let textBoxAttr = document.createElement('input');

                textBoxAttr.type = 'text';
                textBoxAttr.value = attr.toString();
                textBoxAttr.addEventListener('change', function(){
                    // remove method
                    if(textBoxAttr.value.length == 0){
                        clazz.removeAttribute(attr);
                        tabContentAttr.removeChild(textBoxAttr);
                    }else{
                        attr.updateAttribute(textBoxAttr.value);
                    }

                    graph.layout();
                });

                tabContentAttr.appendChild(textBoxAttr);
                tabContentAttr.appendChild(document.createElement('br'));
            }

            // get tab content of attributes
            let tabContentMethods = document.getElementById('clazzMethods');

            // remove previous methods
            while (tabContentMethods.firstChild) {
                tabContentMethods.removeChild(tabContentMethods.firstChild);
            }

            let methods = clazz.getMethodsObj();
            for (let method of methods) {
                let textBoxMethod = document.createElement('input');
                
                textBoxMethod.type = 'text';
                textBoxMethod.value = method.toString();
                textBoxMethod.addEventListener('change', function(){
                    // remove method
                    if(textBoxMethod.value.length == 0){
                        clazz.removeMethod(method);
                        tabContentMethods.removeChild(textBoxMethod);
                    }
                    else{
                        method.updateMethod(textBoxMethod.value);
                    }

                    graph.layout();
                });

                tabContentMethods.appendChild(textBoxMethod);
                tabContentMethods.appendChild(document.createElement('br'));
            }

            return true;
        }
    }

    export class BlankView {

        protected _divMainPanel: HTMLDivElement;
        protected _divChildPanel: HTMLDivElement;
        protected _hideProp: boolean;
        private _currentView: PropertiesView;
        private _currentPanel: APanel;

        constructor() {
            this.initMainPanel();
        }

        private initMainPanel(): void {
            if (document.getElementById('classProp')) {
                return;
            }

            // main div to display any properties, class, object, etc.
            this._divMainPanel = document.createElement('div');
            this._divMainPanel.id = 'classProp'
            this._divMainPanel.className = 'propertiespanel-hidden';
            this._divMainPanel.innerHTML = 'Properties';

            // button to display and hide the properties of e.g. a class
            let btnDivMainDisplay = document.createElement('button');
            btnDivMainDisplay.id = 'btnHidePropertiesPanel';
            btnDivMainDisplay.className = 'btnHideProp';
            btnDivMainDisplay.innerHTML = '&#8896;';
            btnDivMainDisplay.style.cssFloat = 'right';
            btnDivMainDisplay.onclick = e => this.hideproperties(e);

            this._divMainPanel.appendChild(btnDivMainDisplay);
            document.body.appendChild(this._divMainPanel);
        }

        private hideproperties(evt: Event): void {

            if (this._hideProp == true) {
                document.getElementById("properties").className = "properties-hidden";
                document.getElementById("classProp").className = "propertiespanel-hidden";
                (<HTMLInputElement>document.getElementById((<any>evt.target).id)).innerHTML = '&#8896;';

            }
            else {
                document.getElementById("properties").className = "properties";
                document.getElementById("classProp").className = "propertiespanel";
                (<HTMLInputElement>document.getElementById((<any>evt.target).id)).innerHTML = '&#8897;';
            }
            this._hideProp = !this._hideProp;
        }

        public show(panel: APanel): void {
            // remove the previous properties view
            if (this._divChildPanel) {
                let previousView = document.getElementById(this._divChildPanel.id);
                if (previousView) {
                    this._divMainPanel.removeChild(previousView);
                }
            }

            // set the newer properties view
            this._currentPanel = panel;
            this._currentView = panel.getPropertiesView();
            this._divChildPanel = panel.getPanel();
            this._divMainPanel.appendChild(this._divChildPanel);

            panel.showFirstTab();
        }

        public getCurrentView(): PropertiesView {
            return this._currentView;
        }

        public getCurrentPanel(): APanel {
            return this._currentPanel;
        }

    }

    export abstract class APanel {
        protected _divChildPanel: HTMLDivElement;
        protected _divTabbedPanel: HTMLDivElement;

        constructor() {
            // div for properties
            this._divChildPanel = document.createElement('div');
            this._divChildPanel.id = 'properties';

            if(document.getElementById("classProp").className.indexOf('hidden') > -1){
                this._divChildPanel.className = 'properties-hidden';
            }
            else{
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

        protected createTabElement(id: string, value: string): HTMLButtonElement {
            let tabElementBtn = document.createElement('button');
            tabElementBtn.id = id;
            tabElementBtn.className = 'tablinks';
            tabElementBtn.innerText = value;

            tabElementBtn.onclick = e => this.openTab(id);

            return tabElementBtn;
        }

        protected openTab(clickedId: string): void {
            let tabs = document.getElementsByClassName('tablinks');
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].className = tabs[i].className.replace('active', '');
            }

            let tab = document.getElementById(clickedId);
            tab.className += ' active';


            // hide other tabcontent
            let tabContents = document.getElementsByClassName('tabcontent');
            for (let i = 0; i < tabContents.length; i++) {
                (<HTMLElement>tabContents[i]).style.display = 'none';
            }

            // display active tab content
            document.getElementById(this.getPropertiesView().toString().toLowerCase() + tab.innerText)
                .style.display = 'block';

        }

        public showFirstTab():void{
            let tabs = document.getElementsByClassName('tablinks');
            if(tabs && tabs.length > 0){
                this.openTab(tabs[0].id);
            }
        }
    }

    export class ClassPanel extends APanel {

        constructor() {
            super();
        }

        public init(): void {
            // create and append tab elements
            this._divTabbedPanel.appendChild(this.createTabElement('generalClassPropBtn', 'General'));
            this._divTabbedPanel.appendChild(this.createTabElement('attrClassPropBtn', 'Attributes'));
            this._divTabbedPanel.appendChild(this.createTabElement('methodClassPropBtn', 'Methods'));

            this.createTabGeneralContent();
            this.createTabAttrContent();
            this.createTabMethodContent();
        }

        public getPropertiesView(): PropertiesView {
            return PropertiesView.Clazz;
        }

        private createTabGeneralContent(): void {

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toString().toLowerCase() + 'General';
            div.className = 'tabcontent';


            // text input for className
            let textBoxClass = document.createElement('input');
            textBoxClass.type = 'text';
            textBoxClass.id = 'className';
            textBoxClass.placeholder = 'Class name';
            textBoxClass.style.marginRight = '10px';

            div.appendChild(document.createTextNode('Name: '));
            div.appendChild(textBoxClass);

            this._divChildPanel.appendChild(div);
        }

        private createTabAttrContent(): void {

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toString().toLowerCase() + 'Attributes';
            div.className = 'tabcontent';

            // text input for className
            let textBoxAttr = document.createElement('input');
            textBoxAttr.type = 'text';
            textBoxAttr.id = 'attrname';
            textBoxAttr.placeholder = 'Attr name';

            div.appendChild(document.createTextNode('Attribute: '));
            div.appendChild(textBoxAttr);

            this._divChildPanel.appendChild(div);
        }

        private createTabMethodContent(): void {

            let div = document.createElement('div');
            div.id = this.getPropertiesView().toString().toLowerCase() + 'Methods';
            div.className = 'tabcontent';


            // text input for className
            let textBoxMethod = document.createElement('input');
            textBoxMethod.type = 'text';
            textBoxMethod.id = 'methodname';
            textBoxMethod.placeholder = 'Method name';

            div.appendChild(document.createTextNode('Method: '));
            div.appendChild(textBoxMethod);

            this._divChildPanel.appendChild(div);
        }
    }

    export class EdgePanel extends APanel {
        constructor() {
            super();
        }

        public init(): void {
            // create and append tab elements
            this._divTabbedPanel.appendChild(this.createTabElement('generalEdgePropBtn', 'General'));

            this.createTabGeneralEdgeContent();
        }
        public getPropertiesView(): PropertiesView {
            return PropertiesView.Edge;
        }

        private createTabGeneralEdgeContent(): any {
            let div = document.createElement('div');
            div.id = this.getPropertiesView().toString().toLowerCase() + 'General';
            div.className = 'tabcontent';

            // edge type
            let cBoxEdgeType = document.createElement('select');
            cBoxEdgeType.id = 'edgeTypeSelect';
            cBoxEdgeType.style.marginRight = '10px';

            let edgeTypes : string[] = new Array();

            for(let type in edges){
                if(type.toString() === 'Association'
                    || type.toString() === 'Dependency'
                    || type.toString() === 'Unidirectional'){
                        continue;
                }

                edgeTypes.push(type);
            }

            edgeTypes.sort();

            for(let type of edgeTypes){
                let selectOption = document.createElement('option');
                selectOption.value = type;
                selectOption.innerHTML = type;
                cBoxEdgeType.appendChild(selectOption);
            }

            div.appendChild(document.createTextNode('Type: '));
            div.appendChild(cBoxEdgeType);

            // edge label
            let textBoxEdgeLabel = document.createElement('input');
            textBoxEdgeLabel.type = 'text';
            textBoxEdgeLabel.id = 'edgeLabelInput';
            textBoxEdgeLabel.placeholder = 'Edge label';
            textBoxEdgeLabel.style.marginRight = '10px';

            div.appendChild(document.createElement('br'));
            div.appendChild(document.createTextNode('Label: '));
            div.appendChild(textBoxEdgeLabel);

            // source node
            let textBoxEdgeSrc = document.createElement('input');
            textBoxEdgeSrc.type = 'text';
            textBoxEdgeSrc.id = 'edgeSrcInput';
            textBoxEdgeSrc.placeholder = 'Edge Source';
            textBoxEdgeSrc.style.marginRight = '10px';

            div.appendChild(document.createElement('br'));
            div.appendChild(document.createTextNode('Source: '));
            div.appendChild(textBoxEdgeSrc);

            // target node
            let textBoxEdgeTarget = document.createElement('input');
            textBoxEdgeTarget.type = 'text';
            textBoxEdgeTarget.id = 'edgeTargetInput';
            textBoxEdgeTarget.placeholder = 'Edge Source';
            textBoxEdgeTarget.style.marginRight = '10px';


            div.appendChild(document.createElement('br'));
            div.appendChild(document.createTextNode('Target: '));
            div.appendChild(textBoxEdgeTarget);

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