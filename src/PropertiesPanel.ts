export namespace PropertiesPanel{

    export enum PropertiesView{
        Class = 1,
        Object,
        Form
    }

    export class Dispatcher{

        private _blankView : BlankView;
        
        constructor(){
            this._blankView = new BlankView();
        }

        public dispatch(view : PropertiesView) : void{
            let createdView = CreateView(view);
            this._blankView.show(createdView);
        }
    }

    export function CreateView(view : PropertiesView) : APanel{
        let panel;
        if(view === PropertiesView.Class){
            panel = new ClassPanel();
        }
        if(view === PropertiesView.Object){
            panel = new ObjectPanel();
        }
        if(view === PropertiesView.Form){
            //TODO:
        }

        panel.init();
        return panel;
    }

    export class BlankView{

        protected _divMainPanel : HTMLDivElement;
        protected _divChildPanel : HTMLDivElement;
        protected _hideProp : boolean;

        constructor(){
            this.initMainPanel();
        }

        private initMainPanel(): void{
            if(document.getElementById('classProp')){
                return;
            }

            // main div to display any properties, class, object, etc.
            this._divMainPanel = document.createElement('div');
            this._divMainPanel.id = 'classProp'
            this._divMainPanel.className = 'propertiespanel-hidden';
            this._divMainPanel.innerHTML = 'Eigenschaften';

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

        private hideproperties(evt : Event) : void {

            if(this._hideProp == true){
                console.log("hide properties");
                document.getElementById("properties").className = "properties-hidden";
                document.getElementById("classProp").className = "propertiespanel-hidden";
                (<HTMLInputElement>document.getElementById((<any>evt.target).id)).innerHTML = '&#8896;';
                
            }
            else{
                console.log("show properties");
                document.getElementById("properties").className = "properties";
                document.getElementById("classProp").className = "propertiespanel";
                (<HTMLInputElement>document.getElementById((<any>evt.target).id)).innerHTML = '&#8897;';
            }
            this._hideProp = !this._hideProp;
        }

        public show(panel : APanel) : void{
            // remove the previous properties view
            if(this._divChildPanel !== undefined){
                let previousView = document.getElementById(this._divChildPanel.id);
                if(previousView){
                    this._divMainPanel.removeChild(previousView);
                    console.log("REMOVED: " + panel.getPropertiesView());
                }
            }

            // set the newer properties view
            this._divChildPanel = panel.getPanel();
            this._divMainPanel.appendChild(this._divChildPanel);
        }

    }

    export abstract class APanel{
        protected _divChildPanel : HTMLDivElement;

        constructor(){
        }

        abstract init() : void;

        abstract getPropertiesView() : PropertiesView;

        public getPanel() : HTMLDivElement{
            return this._divChildPanel;
        }
    }

    export class ClassPanel extends APanel{

        constructor(){
            super();
        }

        public init() : void{
            
            // div for class properties
            this._divChildPanel = document.createElement('div');
            this._divChildPanel.id = 'properties';
            this._divChildPanel.className = 'properties-hidden';

            let divTabbedPanel = document.createElement('div');
            divTabbedPanel.id = 'classtabproperties';
            divTabbedPanel.className = 'tabbedpane';

            // create and append tab elements
            divTabbedPanel.appendChild(this.createTabElement('generalClassPropBtn', 'General'));
            divTabbedPanel.appendChild(this.createTabElement('attrClassPropBtn', 'Attributes'));
            divTabbedPanel.appendChild(this.createTabElement('methodClassPropBtn', 'Methods'));

            // add tabbed panel
            this._divChildPanel.appendChild(divTabbedPanel);

            this.createTabGeneralContent();
            this.createTabAttrContent();
            this.createTabMethodContent();

        }

        public getPropertiesView() : PropertiesView{
            return PropertiesView.Class;
        }

        private openTab(clickedId : string):void{
            console.log(`tab ${clickedId} was opened!`);

            let tabs = document.getElementsByClassName('tablinks');
            for(let i = 0; i < tabs.length; i++){
                tabs[i].className = tabs[i].className.replace('active', '');
            }

            let tab = document.getElementById(clickedId);
            tab.className += ' active';


            // hide other tabcontent
            let tabContents = document.getElementsByClassName('tabcontent');
            for(let i = 0; i < tabContents.length; i++){
                (<HTMLElement>tabContents[i]).style.display = 'none';
            }

            // display active tab content
            document.getElementById('clazz' + tab.innerText).style.display = 'block';

        }

        private createTabGeneralContent() : void{

            let div = document.createElement('div');
            div.id = 'clazzGeneral';
            div.className = 'tabcontent';


            // text input for className
            let textBoxClass = document.createElement('input');
            textBoxClass.type = 'text';
            textBoxClass.id = 'className';
            textBoxClass.placeholder = 'Class name';
            textBoxClass.style.marginRight = '10px';

            let txtBoxBlub = document.createElement('input');
            txtBoxBlub.type = 'text';
            txtBoxBlub.id = 'blubName';
            txtBoxBlub.placeholder = 'Blubber name';

            div.appendChild(document.createTextNode('Name: '));
            div.appendChild(textBoxClass);
            
            this._divChildPanel.appendChild(div);
        }

        private createTabAttrContent() : void{

            let div = document.createElement('div');
            div.id = 'clazzAttributes';
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

        private createTabMethodContent() : void{

            let div = document.createElement('div');
            div.id = 'clazzMethods';
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

        private createTabElement(id : string, value : string) : HTMLButtonElement{
            let tabElementBtn = document.createElement('button');
            tabElementBtn.id = id;
            tabElementBtn.className = 'tablinks';
            tabElementBtn.innerText = value;

            tabElementBtn.onclick = e => this.openTab(id);

            return tabElementBtn;      
        }
    }

    export class ObjectPanel extends APanel{

        constructor(){
            super();
        }

        public init() : void{
            
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

        public getPropertiesView() : PropertiesView{
            return PropertiesView.Object;
        }
    }
}