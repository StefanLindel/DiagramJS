import {Control} from "../../Control";
import BridgeElement from "../../BridgeElement";
import Data from "../../Data";
import {Util} from "../../util";

// noinspection JSUnusedGlobalSymbols
export class Table extends Control {
    protected items: BridgeElement[] = [];
    private columns: Column[] = [];
    private cells: Object = {};
    private $bodysection: HTMLTableSectionElement;
    private $headersection: HTMLTableSectionElement;
    private showedItems: Array<BridgeElement> = [];
    // BridgeElements:
    private itemsIds: Object = {};
    private countElement: HTMLElement;
    private countColumn: HTMLElement;
    private countColumnPos: number;
    private resultColumn: string;
    private lastSearchText: string;
    private searchColumns: Array<string> = [];
    private searchText: Array<string> = [];
    private sortColumn: Column;
    private direction: number;
    private moveElement: Column = null;
    private isDrag: boolean = false;
    private moveTimeStamp: number;
    private moveX: number;
    private movePos: number;
    private dragColumn: Column;
    private dragPos: number;
    private tableOption: HTMLTableHeaderCellElement;

    constructor(data: JSON) {
        super();
    }

    public load(data: any) :void {
        let id: string;
        // init form HTML
        if (typeof(data) === 'string') {
            id = data;
        } else {
            id = data.id;
            if (data.property) {
                this.property = data.property;
            }

            if (data.searchColumns) {
                let search: Array<string> = [];
                if (typeof(data.searchColumns) === 'string') {
                    search = data.searchColumns.split(' ');
                } else {
                    search = data.searchColumns;
                }
                for (let z: number = 0; z < search.length; z++) {
                    let item = search[z].trim();
                    if (item.length > 0) {
                        if (this.searchColumns.indexOf(item) < 0) {
                            this.searchColumns.push(item);
                        }
                    }
                }
            }

        }
        if (!id) {
            return;
        }
        if (this.$view) {
            // Must be an Update
            if (data['columns']) {
                // It is a json must add all things and generate HTML
                for (var i in data['columns']) {
                    if (data['columns'].hasOwnProperty(i) === false) {
                        continue;
                    }
                    let col = this.parseData(data['columns'][i]);
                    this.addHeaderInfo(col);
                    this.columns.push(col);
                    this.tableOption.parentElement.insertBefore(col.$element, this.tableOption);
                }
                for (var i in this.showedItems) {
                    let item: BridgeElement = this.showedItems[i];
                    let cell;
                    // Now Add some Children
                    while (item.gui.children.length < this.columns.length) {
                        cell = document.createElement('td');
                        item.gui.appendChild(cell);
                    }
                    // Now Remove Some Children
                    while (item.gui.children.length > this.columns.length) {
                        item.gui.removeChild(item.gui.children[item.gui.children.length - 1]);
                    }
                    for (let c: number = 0; c < this.columns.length; c++) {
                        let name = this.columns[c].attribute;
                        let count = this.columns.length;
                        cell = item.gui.children[c];
                        cell.innerHTML = item.model.getValue(name);
                    }
                }
            }
            return;
        }

        this.$view = document.getElementById(id);
        let headerrow: HTMLTableRowElement;
        if (this.$view) {
            if (!this.property) {
                this.property = this.$view.getAttribute('property');
            }
        } else {
            this.$view = document.createElement('table');
            this.$owner.appendChild(this);
        }
        if (!this.$bodysection) {
            // add tbody element if missing
            this.$bodysection = document.createElement('tbody');
            this.$view.appendChild(this.$bodysection);
        }
        if (data['classname']) {
            this.$view.className = data['classname'];
        } else {
            this.$view.className = 'mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp';
        }

        this.id = id;
        this.$view.id = id;
        this.$view.setAttribute('type', this.constructor['name'].toLowerCase());
        let counter = 0;
        for (let c = 0; c < this.$view.children.length; c++) {
            let row: HTMLTableRowElement = <HTMLTableRowElement>this.$view.children[c];
            if (row instanceof HTMLTableSectionElement) {
                if (row.tagName === 'THEAD') {
                    headerrow = row;
                    // Its a thead
                    let children = row.children;
                    for (let i = 0; i < children.length; i++) {
                        this.parsingHeader(<HTMLTableRowElement>row.children[i]);
                    }
                } else {
                    // Its a tbody
                    let children = row.children;
                    for (let i = 0; i < children.length; i++) {
                        this.parsingData(<HTMLTableRowElement>row.children[i]);
                    }
                }
            } else {
                // fallback, if there are no thead and tbody...
                if (counter === 0) {
                    headerrow = row;
                    this.parsingHeader(row);
                } else {
                    this.parsingData(row);
                }
            }
            counter++;
        }
        if (!headerrow || !this.$headersection) {
            if (!this.$headersection) {
                // find eventually existing thead
                let header = this.$view.getElementsByTagName('thead');
                if (header.length === 0) {
                    this.$headersection = document.createElement('thead');
                    this.$view.appendChild(this.$headersection);
                } else {
                    // take first thead element
                    this.$headersection = <HTMLTableSectionElement>header.item(0);
                }
            }
            if (!headerrow) {
                headerrow = document.createElement('tr');
                this.$headersection.appendChild(headerrow);
            }
        }

        if (data['columns']) {
            // It is a json must add all things and generate HTML
            for (var i in data['columns']) {
                if (data['columns'].hasOwnProperty(i) === false) {
                    continue;
                }
                let col = this.parseData(data['columns'][i]);
                this.addHeaderInfo(col);
                this.columns.push(col);
                headerrow.appendChild(col.$element);
            }
            this.tableOption = document.createElement('th');
            this.tableOption.classList.add('tableOption');
            headerrow.appendChild(this.tableOption);
            let context: HTMLElement = this.addOptionItem(null, this.tableOption, true);
            let contentChild: HTMLElement = this.addOptionItem('show', context, true);
            let simpleLink: HTMLElement = this.addOptionItem('show', contentChild, false);
        }
        this.registerEvents(['mousemove', 'mousedown', 'mouseup', 'resize', 'dragstart', 'dragover', 'drop', 'dragend']);

        // Check for SearchBar
        // if(data["searchproperty"]){
        // Create Full Row
        let searchBar = document.createElement('tr');
        let cell = document.createElement('td');
        cell.setAttribute('colspan', '' + (this.columns.length));
        searchBar.appendChild(cell);

        let search = document.createElement('input');
        search.className = 'search';
        let that = this;
        search.addEventListener('keyup', function (evt) {
            that.search(evt.target['value']);
        });

        cell.appendChild(search);
        if (this.resultColumn) {
            if (this.resultColumn.indexOf('#') !== 0) {
                this.countElement = document.createElement('div');
                searchBar.appendChild(this.countElement);
            } else {
                for (let z: number = 0; z < this.$headersection.children.length; z++) {
                    if (this.$headersection.children[z].innerHTML === this.resultColumn) {
                        this.countColumn = <HTMLElement> this.$headersection.children[z];
                        this.countColumnPos = z;
                        break;
                    }
                }
            }
        }
        let first = this.$headersection.children.item(0);
        this.$headersection.insertBefore(searchBar, first);

        this.updateElement(this.property, null);

        // now update those elements, that were not loaded currently
    }

    private parseData(column:any) : Column{
        let col = new Column();
        col.label = column.label || column.id;
        col.attribute = column.attribute || column.label || column.id;
        col.$element = document.createElement('th');
        col.$element.innerHTML = col.label;
        col.$element.draggable = true;

        // resize Header
        col.$resize = document.createElement('div');
        col.$resize.classList.add('resize');
        col.$element.appendChild(col.$resize);

        return col;
    }

    get lastProperty(): string {
        return this.property.split('.')[0];
    }

    public tableEvent(type: string, e: Event) {
        let button: number = 0;
        let eventX: number = 0;
        if (e instanceof MouseEvent) {
            button = e.buttons;
            eventX = e.pageX;
        }
        if (type === 'mouseup') {
            this.moveElement = null;
        } else if (type === 'mousedown' || type === 'resize') {
            // End to Resize
            this.moveElement = null;
            if (button === 1) {
                let c: number;
                for (c = 0; c < this.columns.length; c++) {
                    if (this.columns[c].$resize === e.target) {
                        this.moveElement = this.columns[c];
                        this.movePos = c;
                        this.isDrag = false;
                        break;
                    } else if (this.columns[c].$element === e.target) {
                        this.moveElement = this.columns[c];
                        this.movePos = c;
                        this.isDrag = true;
                    }
                }
                this.moveTimeStamp = e.timeStamp;
                this.moveX = eventX;
            } else {
                this.moveTimeStamp = 0;
            }
        } else if (type === 'mousemove') {
            if (button === 1 && this.moveElement) {
                if (this.moveTimeStamp && e.timeStamp - this.moveTimeStamp < 2000) {
                    if (this.isDrag) {
                        // FIXME
                    } else {
                        let x = eventX - this.moveX;
                        let width = this.moveElement.$element.offsetWidth;
                        this.moveElement.$element.width = '' + (width + x);
                        e.stopPropagation();
                    }
                }
                this.moveX = eventX;
                this.moveTimeStamp = e.timeStamp;
            }
        } else if (this.isDrag) {
            this.columnDragEvent(type, <DragEvent> e);
        }
    }

    public parsingHeader(row: HTMLTableRowElement) {
        for (var i in row.children) {
            if (row.children.hasOwnProperty(i) === false) {
                continue;
            }
            let column: HTMLTableHeaderCellElement = <HTMLTableHeaderCellElement>row.children[i];
            let id = column.innerHTML.trim();
            let col: Column = null;
            for (var c in this.columns) {
                if (this.columns.hasOwnProperty(i) === false) {
                    continue;
                }
                if (this.columns[c].label === id) {
                    col = this.columns[c];
                    col.$element = column;
                    break;
                }
            }
            if (col === null) {
                col = new Column();
                col.label = id;
                col.attribute = column.getAttribute('attribute');
                col.$element = column;
                this.columns.push(col);
            }
            this.addHeaderInfo(col);
        }
    }

    public parsingData(row: HTMLTableRowElement) {
        let id = row.getAttribute('id');
        let item: Data = this.$owner.getItem(id);
        for (var i in row.children) {
            if (row.children.hasOwnProperty(i) === false) {
                continue;
            }
            let cell: HTMLTableCellElement = <HTMLTableCellElement>row.children[i];
            let colAttribute = this.columns[i].attribute;
            if (colAttribute.indexOf('\.') < 0) {
                item[colAttribute] = cell.innerHTML.trim();
            }
        }
    }

    public propertyChange(entity: Data, property: string, oldValue: Object, newValue: Object) {
        if (entity) {
            // Check for Show
            if (this.property && !entity.hasProperty(property)) {
                return;
            }
        }
        if (entity.id === undefined) {
            return;
        }
        let item: BridgeElement = <BridgeElement>this.itemsIds[entity.id];
        let row: HTMLTableRowElement;
        if (!item) {
            item = new BridgeElement(entity);
            this.items.push(item);
            this.itemsIds[entity.id] = item;
        }
        row = this.cells[entity.id];
        if (row) {
            item.gui = row;
        }
        if (this.searching(item) === false) {
            return;
        }
        let cell;
        let showItem = false;

        if (!row) {
            showItem = true;
            row = document.createElement('tr');
            let count = this.columns.length;
            for (let i = 0; i < count; i++) {
                cell = document.createElement('td');
                row.appendChild(cell);
            }
            this.cells[entity.id] = row;
            item.gui = row;
        }
        for (let c: number = 0; c < this.columns.length; c++) {
            let name = this.columns[c].attribute;
            if (name === property) {
                cell = row.children[c];
                cell.innerHTML = <string>newValue;
            }
        }
        if (showItem) {
            this.showItem(item, true);
        }
        // super.propertyChange(entity, property, newValue, oldValue);
    }

    public sort(column: Column) {
        if (this.sortColumn === column) {
            if (this.direction === 1) {
                this.direction = -1;
                column.$element.classList.remove('asc');
                column.$element.classList.add('desc');
            } else {
                this.direction = 1;
                column.$element.classList.remove('desc');
                column.$element.classList.add('asc');
            }
        } else {
            if (this.sortColumn !== null) {
                this.sortColumn.$element.classList.remove('desc');
                this.sortColumn.$element.classList.remove('asc');
            }
            this.sortColumn = column;
            this.sortColumn.$element.classList.add('asc');
            this.direction = 1;
        }
        let that = this;
        let sort = function (a: BridgeElement, b: BridgeElement) {
            return that.sorting(a, b);
        };
        this.showedItems.sort(sort);
        let len: number = this.showedItems.length;
        let body = this.$bodysection;
        let i = 0;
        while (i < len) {
            let item: BridgeElement = this.showedItems[i];
            if (i !== Table.indexOfChild(item)) {
                break;
            }
            i = i + 1;
        }
        while (body.children.length > i) {
            body.removeChild(body.children.item(body.children.length - 1));
        }
        while (i < len) {
            let item: BridgeElement = this.showedItems[i];
            body.appendChild(item.gui);
            i = i + 1;
        }

        //      body.removeChild(item.gui);
        //      body.remove
    }

    public sorting(a: BridgeElement, b: BridgeElement): number {
        let path: string[] = this.sortColumn.attribute.split('.');
        let itemA = a.model.prop;
        let itemB = b.model.prop;
        let check = this.sortColumn.attribute;
        for (let p = 0; p < path.length; p++) {
            check = path[p];
            if (itemA[check]) {
                itemA = itemA[check];
            } else {
                return 0;
            }
            if (itemB[check]) {
                itemB = itemB[check];
            } else {
                return 0;
            }
        }
        if (itemA !== itemB) {
            if (this.direction === 1) {
                return (itemA < itemB) ? -1 : 1;
            }
            return (itemA < itemB) ? 1 : -1;

        }
        return 0;
    }

    // Searching
    public search(origSearchText: string): void {
        if (!origSearchText) {
            origSearchText = '';
        }
        let searchText: string = origSearchText.trim().toLowerCase();
        if (searchText === this.lastSearchText && searchText !== '') {
            return; // <==== nothing to be done
        }
        let oldSearch: string = this.lastSearchText;
        this.lastSearchText = searchText;

        this.parseSearchArray();
        if (searchText !== '' && oldSearch !== null && searchText.indexOf(oldSearch) >= 0 && searchText.indexOf('|') < 0) {
            this.searchArray(this.showedItems);
        } else {
            this.searchSet(this.items);
        }
        this.refreshCounter();
    }

    public refreshCounter() {
        if (this.countColumn) {
            this.countColumn.innerHTML = this.columns[this.countColumnPos].label + ' (' + this.showedItems.length + ')';
        }
        // var countElement = document.getElementById('talkCount');
        //  if (countElement) {
        //     var txt = (this.showedItems.size() > 0 && searchText.length > 0 ) ? this.options.TEXT_SEARCHLIST : this.options.TEXT_SEARCHFULLLIST;
        //     countElement.innerHTML = txt.replace("%LEN%", this.root['children'].length).replace("%COUNT%", this.showedItems.size()).replace("%SEARCH%", origSearchText);
        // }
        // if (this.countColumn) {
        //     this.countColu1mn.innerHTML = this.countColumn["label"] + " (" + this.showedItems.size() + ")";
        // }
    }

    public parseSearchArray() {
        let pos: number = 0;
        let split: Array<string> = [];
        let quote: boolean = false;
        for (let i: number = 0; i < this.lastSearchText.length; i++) {
            if ((this.lastSearchText.charAt(i) === ' ') && !quote) {
                let txt = this.lastSearchText.substring(pos, i).trim();
                if (txt.length > 0) {
                    split.push(txt);
                }
                pos = i + 1;
            } else if (this.lastSearchText.charAt(i) === '\"') {
                if (quote) {
                    let txt = this.lastSearchText.substring(pos, i).trim();
                    if (txt.length > 0) {
                        split.push(txt);
                    }
                    pos = i + 1;
                } else {
                    pos = i + 1;
                }
                quote = !quote;
            }
        }
        if (pos < this.lastSearchText.length) {
            split.push(this.lastSearchText.substring(pos, this.lastSearchText.length).trim());
        }
        this.searchText = split;
        return split;
    }

    public searchArray(root: Array<BridgeElement>) {
        this.showedItems = [];
        // Search for Simple Context
        for (let i: number = 0; i < root.length; i++) {
            let item: BridgeElement = root[i];
            this.showItem(item, this.searching(item));
        }
    }

    public searchSet(root: BridgeElement[]) {
        this.showedItems = [];
        // Search for Simple Context
        for (let item of root) {
            let child: BridgeElement = <BridgeElement>item;
            this.showItem(child, this.searching(child));
        }
    }

    public showItem(item: BridgeElement, visible: boolean) {
        if (visible) {
            this.showedItems.push(item);
            this.$bodysection.appendChild(item.gui);
        } else if (item.gui && item.gui.parentElement) {
            this.$bodysection.removeChild(item.gui);
        }
    }

    public searching(item: BridgeElement): boolean {
        let fullText: string = '';
        for (let i: number = 0; i < this.searchColumns.length; i++) {
            fullText = fullText + ' ' + item.model.getValue(this.searchColumns[i]);
        }
        fullText = fullText.trim().toLowerCase();
        for (let z: number = 0; z < this.searchText.length; z++) {
            if ('' !== this.searchText[z]) {
                let orSplit: Array<string>;
                if (this.searchText[z].indexOf('|') > 0) {
                    orSplit = this.searchText[z].split('|');
                } else {
                    orSplit = [this.searchText[z]];
                }
                let o: number = 0;
                for (; o < orSplit.length; o++) {
                    let pos: number = orSplit[o].indexOf(':');
                    if (orSplit[o].indexOf('#') === 0 && pos > 1) {
                        // if (searchProperties.contains(propString)) {
                        let value: string = orSplit[o].substring(pos + 1);
                        let column: string = orSplit[o].substring(1, pos - 1);
                        let dataValue: Object = item.model.getValue(column);
                        if (dataValue) {
                            if (dataValue.toString().toLowerCase().indexOf(value) >= 0) {
                                // Search for simple Property
                                break;
                            }
                        }
                    } else if (orSplit[o].length > 1 && orSplit[o].indexOf('-') === 0) {
                        if (fullText.indexOf(orSplit[o].substring(1)) < 0) {
                            break;
                        }
                    } else if (fullText.indexOf(orSplit[o]) >= 0) {
                        // his search word is found in full text
                        break;
                    }
                }
                if (o === orSplit.length) {
                    return false;
                }
            }
        }
        return true;
    }

    // noinspection JSUnusedGlobalSymbols
    public getColumn(): Column[] {
        return this.columns;
    }


    protected updateElement(property: string, value: string): void {
        // first clear all elements inside the table:
        for (let item of this.items) {
            if (item instanceof BridgeElement) {
                (<BridgeElement>item).model.removeListener(this);
            }
        }

        this.items = [];
        this.itemsIds = new Object();

        // load all entitys that match the property
        if (this.property !== undefined) {
            let items = this.$owner.getItems();
            for (var j in items) {
                if (items.hasOwnProperty(j)) {
                    let item = items[j];
                    if (item instanceof Data) {
                        if (property == j) {
                            // if (property == item.property) {
                            let i = new BridgeElement(<Data>item);
                            this.items.push(i);
                            this.itemsIds[item.id] = i;
                        }
                    }
                }
            }
            this.redrawAllElements();
        }
    }

    protected redrawAllElements() {
        let children: HTMLCollection = this.$bodysection.children;
        // remove old children
        for (let i = 0; i < children.length; i++) {
            let child = children.item(i);
            // remove child
            this.$bodysection.removeChild(child);
        }

        // load new children
        for (let obj of this.items) {
            // register listeners
            obj.model.addListener(this);
            // create tr
            let row = this.createRow(obj);
            this.$bodysection.appendChild(row);
            this.cells[obj.id] = row;
        }
    }

    private createRow(data: BridgeElement): HTMLTableRowElement {
        let tr: HTMLTableRowElement = document.createElement("tr");

        for (var id of this.columns) {
            let td: HTMLTableDataCellElement = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = data.model.getValue(id.attribute);
        }
        return tr;
    }

    private addHeaderInfo(col: Column) {
        let element: HTMLTableCellElement = col.$element;
        let that = this;
        element.classList.add('sort');
        element.addEventListener('click',
            function () {
                that.sort(col);
            },
            false);
    }

    private static indexOfChild(item: BridgeElement) {
        let i: number = 0;
        let child: Node = item.gui;
        while ((child = child.previousSibling) !== null) {
            i++;
        }
        return i;
    }

    private columnDragEvent(type: string, e: DragEvent) {
        if (type === 'dragstart') {
            // Target (this) element is the source node.
            this.moveElement.$element.style.opacity = '0.4';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/json', JSON.stringify(Util.toJson(this.moveElement)));
        } else if (type === 'dragenter') {

        } else if (type === 'dragleave') {
            this.moveElement.$element.classList.remove('over');
        } else if (type === 'dragover') {
            if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
            }
            for (let c = 0; c < this.columns.length; c++) {
                if (this.columns[c].$element === e.target) {
                    this.dragColumn = this.columns[c];
                    this.dragPos = c;
                    this.columns[c].$element.classList.add('over');
                } else {
                    this.columns[c].$element.classList.remove('over');
                }
            }
            if (e.target === this.tableOption) {
                this.tableOption.classList.add('over');
                this.dragPos = this.columns.length;
            } else {
                this.tableOption.classList.remove('over');
            }
            e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        } else if (type === 'drop') {
            // this / e.target is current target element.
            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }
            if (this.movePos === this.dragPos) {
                return;
            }
            // movePos -> dragPos
            // See the section on the DataTransfer object.
            // DataModel
            this.columns.splice(this.movePos, 1);
            if (this.movePos >= this.dragPos) {
                this.columns.splice(this.dragPos, 0, this.moveElement);
            } else {
                this.columns.splice(this.dragPos - 1, 0, this.moveElement);
            }

            // Header Line
            let line: HTMLElement = this.moveElement.$element.parentElement;
            line.removeChild(this.moveElement.$element);
            if (this.dragPos < this.columns.length) {
                line.insertBefore(this.moveElement.$element, this.dragColumn.$element);
            } else {
                line.insertBefore(this.moveElement.$element, this.tableOption);
            }

            let oldElement: Element;
            let newElement: Element;

            // Now all Childs
            for (let i = 0; i < this.$bodysection.children.length; i++) {
                // Each line
                line = <HTMLElement>this.$bodysection.children.item(i);
                oldElement = line.children.item(this.movePos);
                newElement = line.children.item(this.dragPos);
                line.removeChild(oldElement);
                line.insertBefore(oldElement, newElement);
            }
        } else if (type === 'dragend') {
            // this/e.target is the source node.
            this.moveElement.$element.style.opacity = '1';
            for (let i = 0; i < this.columns.length; i++) {
                this.columns[i].$element.classList.remove('over');
            }
            this.tableOption.classList.remove('over');
        }
    }

    private addOptionItem(label: string, parent: HTMLElement, sub: boolean): HTMLElement {
        let labelControl;
        if (label) {
            labelControl = document.createElement('a');
            labelControl.appendChild(document.createTextNode(label));
            labelControl.href = 'javascript:void(0);';
            parent.appendChild(labelControl);
        }
        if (sub) {
            let context = document.createElement('div');
            context.classList.add('dropdown-content');
            context.style.setProperty('position', 'absolute');
            parent.appendChild(context);

            /* When the user clicks on the button,
             toggle between hiding and showing the dropdown content */
            parent.addEventListener(
                'click',
                function () {
                    context.classList.toggle('show');
                },
                false);
            return context;
        }
        return labelControl;
    }

    private registerEvents(events: string[]) {
        let that = this;
        for (let i = 0; i < events.length; i++) {
            this.$view.addEventListener(events[i], function (evt) {
                return that.tableEvent(events[i], evt);
            });
        }
    }


    public setValue(object: Object, attribute: string, newValue: Object, oldValue?: Object): boolean {
        if (this.$owner != null) {
            return this.getRoot().setValue(object, attribute, newValue, oldValue);
        }
        return super.setValue(object, attribute, newValue, oldValue);
    }
}
class Column {
    label: string;
    attribute: string;
    $element: HTMLTableHeaderCellElement;
    $resize: HTMLDivElement;
    visible: boolean;
}
