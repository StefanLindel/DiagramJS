import {Graph} from './elements/Graph';
import * as edges from './elements/edges';
import {EventBus, EventHandler} from './EventBus';
import {DiagramElement} from './elements/BaseElements';
import {Util} from './util';

export class PanelGroup implements EventHandler {
    private graph: Graph;
    private selectedElement: DiagramElement;
    private clearPanel: Panel;
    private generatePanel: Panel;
    private propertiesMasterPanel: HTMLDivElement;
    private propertiesContent: HTMLDivElement;
    private propHeaderLabel: HTMLDivElement;
    private propHeaderButton: HTMLButtonElement;
    private selectedPanel: Panel;

    constructor(graph: Graph) {
        this.graph = graph;

        this.clearPanel = new ClearPanel(this);
        this.generatePanel = new GeneratePanel(this);
    }

    public handle(event: Event, element: DiagramElement): boolean {

        this.handleOpenProperties(event, element);

        if (event.type === EventBus.RELOADPROPERTIES
            && this.selectedElement && element.id === this.selectedElement.id) {
            this.handleEvent(event, element);
        }

        // the same element was clicked. do nothing
        if (this.selectedElement && this.selectedElement.id === element.id) {
            return true;
        }
        if (element.id === 'RootElement') {
            this.setActivePanel(this.clearPanel);
        }
        if (element.id === 'GenerateProp') {
            this.setActivePanel(this.generatePanel);
        }
        this.selectedElement = element;

        return true;
    }

    public getGraph(): Graph {
        return this.graph;
    }

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(PanelGroup.name);
    }

    public setActive(active: boolean): void {
        if (active) {
            EventBus.setActiveHandler(PanelGroup.name);
        }
        else {
            EventBus.releaseActiveHandler();
        }
    }

     public handleEvent(event: any, element: any) {
        // DO NOTHING
    }

    public show() {
        // main div to display any properties, class, edge, etc.
        this.propertiesMasterPanel = document.createElement('div');
        this.propertiesMasterPanel.className = 'propertiespanel-hidden';

        this.propertiesContent = document.createElement('div');
        this.propertiesContent.className = 'properties-hidden';

        this.propHeaderLabel = document.createElement('div');
        this.propHeaderLabel.style.display = 'inherit';
        this.propHeaderLabel.style.cursor = 'pointer';
        this.propHeaderLabel.onclick = e => this.toogleProperties(e);

        // button to display and hide the properties of e.g. a class
        this.propHeaderButton = document.createElement('button');
        this.propHeaderButton.className = 'btnHideProp';
        this.propHeaderButton.style.cssFloat = 'right';
        this.propHeaderButton.onclick = e => this.toogleProperties(e);

        let propertiesHeader = document.createElement('div');
        propertiesHeader.style.display = 'inline';
        propertiesHeader.appendChild(this.propHeaderLabel);
        propertiesHeader.appendChild(this.propHeaderButton);

        this.propertiesMasterPanel.appendChild(propertiesHeader);
        this.propertiesMasterPanel.appendChild(this.propertiesContent);
        document.body.appendChild(this.propertiesMasterPanel);

        this.setActivePanel(this.clearPanel);
    }

    public setActivePanel(panel: Panel) {
        this.selectedPanel = panel;
        this.propHeaderLabel.innerHTML = panel.getHeaderText();
        if (this.propertiesContent) {
            while (this.propertiesContent.hasChildNodes()) {
                this.propertiesContent.removeChild(this.propertiesContent.childNodes[0]);
            }
        }
        panel.show();

        panel.showFirstTab();
        if (panel !== this.clearPanel) {
            this.showProperties(null);
        } else {
            this.hideProperties(null);
        }
    }

    public getProperiesContent(): HTMLDivElement {
        return this.propertiesContent;
    }

    private handleOpenProperties(event: Event, element: DiagramElement) {
        if (event.type === 'dblclick') {
            this.showProperties(event);
        }
    }

    private showProperties(evt: Event): void {
        if (evt) {
            evt.stopPropagation();
        }
        // Show
        this.propHeaderButton.innerHTML = '&#8897;';
        this.propHeaderButton.title = 'Hide properties';
        this.propertiesMasterPanel.className = 'propertiespanel';
        this.propertiesContent.className = 'properties';
    }

    private toogleProperties(evt: Event): void {
        if (this.propHeaderButton.title === 'Show properties') {
            this.showProperties(evt);
        } else {
            this.hideProperties(evt);
        }
    }

    private hideProperties(evt: Event): void {
        if (evt) {
            evt.stopPropagation();
        }
        // Hide
        this.propHeaderButton.innerHTML = '&#8896;';
        this.propHeaderButton.title = 'Show properties';
        this.propertiesMasterPanel.className = 'propertiespanel-hidden';
        this.propertiesContent.className = 'properties-hidden';
    }
}

export abstract class Panel {
    protected divPropertiesPanel: HTMLDivElement;
    protected divPropertiesTabbedPanel: HTMLDivElement;
    protected element: any;
    protected group: PanelGroup;
    private panelItem: PanelItem[] = [];

    constructor(group: PanelGroup, element: any) {
        // get the properties content panel
        this.divPropertiesPanel = document.createElement('div');
        this.element = element;
        this.group = group;

        this.divPropertiesTabbedPanel = document.createElement('div');
        this.divPropertiesTabbedPanel.className = 'tabbedpane';

        // add tabbed panel
        this.divPropertiesPanel.appendChild(this.divPropertiesTabbedPanel);
    }

    public show(): void {
        let propertiesContent: HTMLDivElement = this.group.getProperiesContent();
        if (this.panelItem.length > 1) {
            propertiesContent.appendChild(this.getPropertiesTabbedPanel());
        }

        propertiesContent.appendChild(this.getPropertiesPanel());
    }

    public getPropertiesTabbedPanel(): HTMLDivElement {
        return this.divPropertiesTabbedPanel;
    }

    public getPropertiesPanel(): HTMLDivElement {
        return this.divPropertiesPanel;
    }

    public getPanel(): HTMLDivElement {
        return this.divPropertiesPanel;
    }

    public getHeaderText(): string {
        return '';
    }

    public showFirstTab(): void {
        if (this.panelItem.length > 0) {
            this.openTab(this.panelItem[0]);
        }
    }

    protected createTabElement(tabText: string, tabValue: string, item: PanelItem): PanelItem {
        let tabElementBtn = document.createElement('button');
        tabElementBtn.className = 'tablinks';
        tabElementBtn.innerText = tabText;
        tabElementBtn.value = tabValue;

        if (item === null) {
            item = new PanelItem(this);
        }
        item.withButton(tabElementBtn);

        tabElementBtn.onclick = () => this.openTab(item);
        this.divPropertiesTabbedPanel.appendChild(tabElementBtn);
        this.panelItem.push(item);
        return item;
    }

    protected openTab(panelItem: PanelItem): void {
        for (let key in this.panelItem) {
            let child = this.panelItem[key];
            if (child !== panelItem) {
                 child.deactive();
            }
        }
        panelItem.active();
        // hide other tabcontent
        if (this.divPropertiesPanel) {
            while (this.divPropertiesPanel.hasChildNodes()) {
                this.divPropertiesPanel.removeChild(this.divPropertiesPanel.childNodes[0]);
            }
        }

        // ADD
        if (panelItem.getContent()) {
            this.divPropertiesPanel.appendChild(panelItem.getContent());
        }
    }
}

export class GeneratePanel extends Panel {
    constructor(group: PanelGroup) {
        super(group, null);

        let item: PanelItem = this.createTabElement('General', 'General', null);

        // Workspace and generate code stuff
        let inputGenerateWorkspace: HTMLInputElement =  <HTMLInputElement> Util.createHTML({tag: 'input', id: 'workspace', type: 'text', placeholder: 'Type your Folder for generated code...', value: 'src/main/java', style: {marginRight: '5px', width: '260px'}});
        item.withInput('Folder:', inputGenerateWorkspace);

        let inputGeneratePackage: HTMLInputElement = <HTMLInputElement> Util.createHTML({tag: 'input', id: 'package', type: 'text', placeholder: 'Type your workspace for generated code...', value: '', style: {marginRight: '5px', width: '260px'}});
        item.withInput('Package:', inputGeneratePackage);

        let options = document.createElement('div');
        options.style.textAlign = 'center';
        options.style.margin = '3';
        options.style.padding = '5';

        item.withContent(document.createElement('br'));
        item.withContent(document.createElement('br'));
        item.withContent(options);

        options.style.borderStyle = 'groove';
        options.style.borderRadius = '10px';

        let btnGenerate = document.createElement('button');
        btnGenerate.textContent = 'Generate';
        btnGenerate.title = 'Generate code into your workspace';
        btnGenerate.className = 'OptionElement';

        let that = this;
        btnGenerate.onclick = () => {
            let workspace = inputGeneratePackage.value;
            if (workspace.length === 0) {
                alert('No workspace set.\nEnter first your workspace');
                inputGeneratePackage.focus();
                return;
            }
            that.group.getGraph().generate(workspace, inputGenerateWorkspace.value);
        };
        options.appendChild(btnGenerate);
        options.appendChild(document.createElement('hr'));
        options.appendChild(document.createElement('br'));

        let btnAutoLayout = Util.createHTML({tag: 'button', className: 'OptionElement', value: 'Auto Layout', style: {marginRight: '10px'}, onclick: () => {
                that.group.getGraph().layout();
            }});

        options.appendChild(btnAutoLayout);

        // delete all nodes
        let btnDeleteAll = document.createElement('button');
        btnDeleteAll.className = 'OptionElement';
        btnDeleteAll.textContent = 'Delete All';
        btnDeleteAll.title = 'Delete all nodes from diagram';

        btnDeleteAll.onclick = () => {
            let confirmDelete = confirm('All classes will be deleted!');
            if (!confirmDelete) {
                return;
            }
            that.group.getGraph().$graphModel.removeAllElements();
        };
        btnDeleteAll.style.marginRight = '10px';
        options.appendChild(btnDeleteAll);

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
            that.group.getGraph().saveAs(selectedExportType);
        };
        selectExport.className = 'OptionElement';
        options.appendChild(selectExport);
        options.appendChild(document.createElement('br'));
    }

    public getHeaderText(): string {
        return 'Properties';
    }

}

export class ClearPanel extends Panel {
    constructor(group: PanelGroup) {
        super(group, null);
    }

    public getHeaderText(): string {
        return 'Select any element to see its properties';
    }
}

export class PanelItem {
    protected panel: Panel;
    protected label: string;
    protected button: HTMLButtonElement;
    protected content: HTMLDivElement = <HTMLDivElement>Util.create({tag: 'div', className: 'tabContent'});

    constructor(panel: Panel, label?: string) {
        this.panel = panel;
        this.label = label;
    }

    public active(): void {
        if (this.getButton()) {
            this.getButton().className += ' active';
        }
    }

    public deactive(): void {
        if (this.getButton()) {
            Util.removeClass(this.getButton(), 'active');
        }
    }

    public withButton(button: HTMLButtonElement): PanelItem {
        this.button = button;
        return this;
    }

    public withContent(element: HTMLElement): PanelItem {
        this.content.appendChild(element);
        return this;
    }

    public withInput(labelText: string, element: HTMLElement): PanelItem {
        let group: HTMLDivElement = <HTMLDivElement> Util.createHTML({tag: 'div'});
        let label = Util.createHTML({tag: 'label', for: element.id, value: labelText});
        group.appendChild(label);
        group.appendChild(element);

        this.content.appendChild(group);
        return this;
    }

    public getButton(): HTMLButtonElement {
        return this.button;
    }

    public getContent(): HTMLDivElement {
        return this.content;
    }

   public getHeader(): string {
        return this.label;
    }
}
