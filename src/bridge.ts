export default class Bridge {
    private version: String = "0.42.01.1601007-1739";
    private listener: Array<Object> = [];
    private controlFactory: Object = {};
    private controls: Object = {};
    private items: Object = {};
    private controlNo: number = 1;

    constructor() {
        this.addControl(Table);
    }

    public addListener = function (listener) {
        this.listener.push(listener);
    };

    public addControl(control) {
        this.controlFactory[control.name.toLowerCase()] = control;
    }

    public getId(): string {
        return "control" + (this.controlNo++);
    }

    public load(json) {
        let className;
        if (typeof(json) === "object") {
            if (!json["id"]) {
                json["id"] = this.getId();
            }
            className = json["control"].toLowerCase();
        } else {
            let item = document.getElementById(json);
            if (item) {
                className = item.getAttribute("control");
                if (className) {
                    className = className.toLowerCase();
                } else {
                    className = "";
                }
            }
        }
        if (typeof(this.controlFactory[className]) === "object" || typeof(this.controlFactory[className]) === "function") {
            let obj = this.controlFactory[className];
            let control = new obj(this, json);
            this.controls[control.id] = control;
        }
        //bridge.load("{class:table, columns:[{id:'firstname'}, {id:'lastname'}]}");
    }

    public executeChange(change) {
        let newData = this.hasItem(change.id);
        let item: Data = this.getItem(change.id);
        if (change["class"]) {
            item.class = change["class"];
        }
        if (newData) {
            for (let i in this.controls) {
                if (this.controls.hasOwnProperty(i) === false) {
                    continue;
                }
                this.controls[i].addItem(this, item);
            }
        }
        this.addProperties(change["property"], item);
        this.addProperties(change["upd"], item);
    }

    public addProperties(prop: Object, item: Data) {
        if (!prop) {
            return;
        }
        for (let property in prop) {
            if (prop.hasOwnProperty(property) === false) {
                continue;
            }
            if (prop[property] && "" !== prop[property]) {
                item.setValue(property, prop[property]);
            }
        }
    }

    public hasItem(id: string): boolean {
        return (this.items[id] == null)
    }

    public getItem(id: string): Data {
        let item = this.items[id];
        if (!item) {
            item = new Data();
            item.id = id;
            this.items[id] = item;
        }
        return item;
    }

    public getValue(id: string, attribute: string) {
        let control = this.items[id];
        return control.getValue(attribute);
    }
}
abstract class Control {
    id: string;
    public owner: Bridge;

    constructor(owner: Bridge, data) {
        this.owner = owner;
    }

    public abstract propertyChange(entity: Data, property: string, oldValue, newValue);

    public addItem(source: Bridge, entity: Data) {

    }
}

class BidiMap {
    private model: Object;
    private htmlsElements: Object;

    public with(model: Data, value: HTMLElement): BidiMap {
        this.model[model.id] = model;
        this.htmlsElements[model.id] = value;
        return this;
    }
}
class ItemList {
    private children: Array<Object>;
    private indexer: Object;
    private sortFields: Array<String>;
    private table: HTMLTableElement;

    constructor(sortItems: String) {
        this.children = new Array();
        this.indexer = new Object();
        this.sortFields = [];
        if (sortItems) {
            this.sortFields = sortItems.toLowerCase().split(",");
        }
    }

    public add(item: Data, id: string) {
        let index: number = -1;
        id = id.toLowerCase();
        if (item) {
            if (this.sortFields.length < 1) {
                this.children.push(item);
                index = this.children.length;
            } else {
                index = this.indexOf(item, this.children);
                var array = this.children;
                this.children.splice(index, 0, item);
            }
            this.indexer[id] = item;
        }
        return index;
    }

    public indexOf(element, array, start?: number, end?: number): number {
        start = start || 0;
        end = end || array.length;
        var pivot = start + (end - start) / 2;
        if (end - start == 0 || array[pivot] === element) return pivot;
        var diff = this.sort(element, array[pivot]);

        if (end - start <= 1) {
            if (diff >= 0) {
                return end;
            }
            return start;
        }

        if (diff == 0) {
            return pivot;
        } else if (diff > 0) {
            return this.indexOf(element, array, pivot, end);
        } else {
            return this.indexOf(element, array, start, pivot);
        }
    }

    public sort(a, b) {
        for (var i in this.sortFields) {
            var tdA = a["children"].getById(this.sortFields[i]);
            var tdB = b["children"].getById(this.sortFields[i]);
            if (tdA && tdB) {
                if (tdA.innerHTML != tdB.innerHTML) {
                    return (tdA.innerHTML < tdB.innerHTML) ? -1 : 1;
                }
            }
        }
        return 0;
    }

    public size() {
        return this.children.length;
    }

    public get(i: number) {
        return this.children[i];
    }

    public getById(id: string) {
        return this.indexer[id];
    }

    public setTable(table) {
        this.table = table;
    }

    public resort(sortFields: String) {
        this.sortFields = sortFields.toLowerCase().split(",");
        var sortfnc = this.sort;
        this.children.sort(sortfnc);
        this.removeAll();
    }

    public removeAll() {
        while (this.table.childNodes.length > 0) {
            this.table.removeChild(this.table.childNodes[0]);
        }
    }

    public showAll() {
        for (var i = 0; i < this.size(); i++) {
            this.table.appendChild(this.get(i)["gui"]);
        }
    }
}


class SearchComponent {
    private map: BidiMap = new BidiMap();
    private sortFields: Array<String>;
    private lastSearchText;
    private owner: Table;
    private searchInput: HTMLInputElement;
    private counter: HTMLElement;

    constructor(owner: Table) {
        this.sortFields = [];
        //if(options && options.sortitems && options.sortitems.length > 0){this.sortFields=options.sortitems.toLowerCase().split(",");}
        this.owner = owner;
    }

    public printSearchbar(parent: HTMLElement) {
        this.searchInput = document.createElement("input");
        let that = this;
        this.searchInput.className = "search";

        this.searchInput.onchange = function (event) {
            that.searchItems(event);
        };
        parent.appendChild(this.searchInput);

        //let xmlns = "http://www.w3.org/2000/svg";
        //let svg = document.createElementNS(xmlns, "svg");
        //svg.setAttribute("width", "16");
        //svg.setAttribute("height", "16");
        //let path = document.createElementNS(xmlns, "path");
        //path.setAttribute("style", "fill:#007fff;");
        //path.setAttribute("d", "M 9.5,7.8 C 9.3,8.1 9,8.4 8.7,8.8 8.3,9.1 7.9,9.4 7.6,9.5 L 13.6,15.2 15.5,13.5 9.5,7.8 Z");
        //svg.appendChild(path);
        //path = document.createElementNS(xmlns, "circle");
        //path.setAttribute("style", "fill:none;stroke:#007fff;stroke-width:1;");
        //path.setAttribute("cx", "5");
        //path.setAttribute("cy", "5");
        //path.setAttribute("r", "4");
        //svg.appendChild(path);
        //parent.appendChild(svg);

        this.counter = document.createElement("div");
        parent.appendChild(this.counter);
    }

    public sort(a, b) {
        for (var i in this.sortFields) {
            var tdA = a["children"].getById(this.sortFields[i]);
            var tdB = b["children"].getById(this.sortFields[i]);
            if (tdA && tdB) {
                if (tdA.innerHTML != tdB.innerHTML) {
                    return (tdA.innerHTML < tdB.innerHTML) ? -1 : 1;
                }
            }
        }
        return 0;
    }

    public with(model: Data, value: HTMLElement): SearchComponent {
        this.map.with(model, value);
        return this;
    }

    public indexOf(element, array, start, end) {
        start = start || 0;
        end = end || array.length;
        var pivot = parseInt(start + (end - start) / 2, 10);
        if (end - start == 0 || array[pivot] === element) return pivot;
        var diff = this.sort(element, array[pivot]);

        if (end - start <= 1) {
            if (diff >= 0) {
                return end;
            }
            return start;
        }

        if (diff == 0) {
            return pivot;
        } else if (diff > 0) {
            return this.indexOf(element, array, pivot, end);
        } else {
            return this.indexOf(element, array, start, pivot);
        }
    }

    public searchItems(evt) {
        // get search criteria
        this.showItems(evt.target.value);
    }

    public showItems(origSearchText) {
        if (!origSearchText) {
            origSearchText = "";
        }
        var searchText = origSearchText.trim().toLowerCase();
        if (searchText == this.lastSearchText && searchText != "") {
            return 0; // <==== nothing to be done
        }
        var oldSearch = this.lastSearchText;
        this.lastSearchText = searchText;
        var split = this.getSearchArray();

        var items;
        // if (searchText != "" && oldSearch != null && searchText.indexOf(oldSearch) >= 0 && searchText.indexOf("|") < 0) {
        //
        //     items = this.searchFilter(this.showedItems, split);
        // } else {
        //     items = this.searchFull(this.items, split);
        // }
        // this.showedItems = items;
        this.refreshCounter();
    }

    public searchFilter(root, split) {
        // var items = new ItemList(this.options);
        // // Search for Simple Context
        // for (var i = 0; i < root.size(); i++) {
        //     var item = root.get(i);
        //     if (this.searching(item, split)) {
        //         items.add(item, item.id);
        //     } else {
        //         this.table.removeChild(item["gui"]);
        //     }
        // }
        // return items;
    };

//     TableView
// .
//     prototype
// .
//     searchFull = function (root, split) {
//         var items = new ItemList(this.options);
//         items.setTable(this.table);
//
//         for (var i = 0; i < root.size(); i++) {
//             var item = root.get(i);
//             if (this.searching(item, split)) {
//                 items.add(item, item.id);
//             }
//         }
//         this.removeAll();
//         if (items.size() > 0) {
//             this.showColumns();
//             items.showAll();
//         }
//         return items;
//     };
//     TableView
// .
//     prototype
// .
//     searching = function (item, split) {
//         var fullText = "";
//         for (var i = 0; i < this.searchColumns.length; i++) {
//             if (this.searchColumns[i].trim().length > 0) {
//                 fullText = fullText + " " + item["children"].getById(this.searchColumns[i]).innerHTML;
//             }
//         }
//         var fullText = fullText.trim().toLowerCase();
//         for (var z = 0; z < split.length; z++) {
//             if ("" != split[z]) {
//                 if (split[z].indexOf("|") > 0) {
//                     var orSplit = split[z].split("|");
//                     for (var o = 0; o < orSplit.length; o++) {
//                         if (this.searchSimpleText(orSplit[o], fullText)) {
//                             return true;
//                         }
//                     }
//                     return false;
//                 }
//                 return this.searchSimpleText(split[z], fullText);
//             }
//         }
//         return true;
//     }

    public getSearchArray() {
        var pos = 0;
        var split = new Array();
        var quote = false;
        for (var i = 0; i < this.lastSearchText.length; i++) {
            if (this.lastSearchText.charAt(i) == " " && !quote) {
                var txt = this.lastSearchText.substring(pos, i).trim();
                if (txt.length > 0) {
                    split.push(txt);
                }
                pos = i + 1;
            } else if (this.lastSearchText.charAt(i) == "\"") {
                if (quote) {
                    var txt = this.lastSearchText.substring(pos, i).trim();
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
        return split;
    }

    public refreshCounter() {
        // var countElement = document.getElementById('talkCount');
        // if (countElement) {
        //     var txt = (this.showedItems.size() > 0 && searchText.length > 0 ) ? this.options.TEXT_SEARCHLIST : this.options.TEXT_SEARCHFULLLIST;
        //     countElement.innerHTML = txt.replace("%LEN%", this.root['children'].length).replace("%COUNT%", this.showedItems.size()).replace("%SEARCH%", origSearchText);
        // }
        // if (this.countColumn) {
        //     this.countColumn.innerHTML = this.countColumn["label"] + " (" + this.showedItems.size() + ")";
        // }
    };
}

class Table extends Control {
    private columns: Column[] = [];
    private cells: Object = {};
    private class: string;
    private $element: HTMLElement;
    private $searchControl: SearchComponent;
    private $bodysection: HTMLTableSectionElement;
    private $headersection: HTMLTableSectionElement;

    constructor(owner, data) {
        super(owner, data);
        let id: string;
        // init form HTML
        if (typeof(data) === "string") {
            id = data;
        } else {
            id = data.id;
            this.class = data.class;
        }
        if (!id) {
            return;
        }
        let table: HTMLElement = document.getElementById(id);
        let headerrow: HTMLTableRowElement;
        if (!table) {
            table = document.createElement("table");
            document.getElementsByTagName("body")[0].appendChild(table);
        }
        this.$element = table;
        if (!this.$bodysection) {
            // add tbody element if missing
            this.$bodysection = document.createElement("tbody");
            table.appendChild(this.$bodysection);
        }
        if (data["classname"]) {
            table.className = data["classname"]
        } else {
            table.className = "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp";
        }

        this.id = id;
        table.id = id;
        table.setAttribute("control", this.constructor["name"].toLowerCase());
        let i = 0;
        for (let c in table.children) {
            if (table.children.hasOwnProperty(c) === false) {
                continue;
            }
            let row: HTMLTableRowElement = <HTMLTableRowElement>table.children[c];
            if (row instanceof HTMLTableSectionElement) {
                if (row.tagName == "THEAD") {
                    headerrow = row;
                    this.parsingHeader(row);
                } else {
                    this.parsingData(row);
                }
            } else {
                // fallback, if there are no thead and tbody...
                if (i == 0) {
                    headerrow = row;
                    this.parsingHeader(row);
                } else {
                    this.parsingData(row);
                }
            }
            i++;
        }
        if (!headerrow || !this.$headersection) {
            if (!this.$headersection) {
                // find eventually existing thead
                let header = table.getElementsByTagName("thead");
                if (header.length == 0) {
                    this.$headersection = document.createElement("thead");
                    table.appendChild(this.$headersection);
                } else {
                    // take first thead element
                    this.$headersection = header.item(0);
                }
            }
            if (!headerrow) {
                headerrow = document.createElement("tr");
                this.$headersection.appendChild(headerrow);
            }
        }
        if (data["columns"]) {
            // It is a json must add all things and generate HTML
            for (let i in data["columns"]) {
                if (data["columns"].hasOwnProperty(i) === false) {
                    continue;
                }
                let col = new Column();
                let column = data["columns"][i];
                col.label = column.id;
                col.attribute = col["attribute"] || column.id;
                col.$element = document.createElement("th");
                col.$element.innerHTML = col.label;
                this.columns.push(col);
                headerrow.appendChild(col.$element);
            }
        }
        // Check for SearchBar
        //if(data["searchproperty"]){
        let searchBar = document.createElement("div");
        this.printSearchbar(searchBar);
        this.$headersection.appendChild(searchBar);

        //}
        // init from
    }

    public printSearchbar(parent: HTMLElement) {
        let search = document.createElement("input");
        search.className = "search";
        parent.appendChild(search);

        let xmlns = "http://www.w3.org/2000/svg";
        let svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        let path = document.createElementNS(xmlns, "path");
        path.setAttribute("style", "fill:#007fff;");
        path.setAttribute("d", "M 9.5,7.8 C 9.3,8.1 9,8.4 8.7,8.8 8.3,9.1 7.9,9.4 7.6,9.5 L 13.6,15.2 15.5,13.5 9.5,7.8 Z");

        svg.appendChild(path);
        path = document.createElementNS(xmlns, "circle");
        path.setAttribute("style", "fill:none;stroke:#007fff;stroke-width:1;");
        path.setAttribute("cx", "5");
        path.setAttribute("cy", "5");
        path.setAttribute("r", "4");
        svg.appendChild(path);
        parent.appendChild(svg);
        return svg;
    }

    public parsingHeader(row: HTMLTableRowElement) {
        for (let i in row.children) {
            if (row.children.hasOwnProperty(i) === false) {
                continue;
            }
            let column: HTMLTableHeaderCellElement = <HTMLTableHeaderCellElement>row.children[i];
            let id = column.innerHTML.trim();
            let col: Column = null;
            for (let c in this.columns) {
                if (this.columns.hasOwnProperty(i) === false) {
                    continue;
                }
                if (this.columns[c].label == id) {
                    col = this.columns[c];
                    col.$element = column;
                    break;
                }
            }
            if (col === null) {
                col = new Column();
                col.label = id;
                col.attribute = column.getAttribute("attribute");
                col.$element = column;
                this.columns.push(col);
            }
        }
    }


    public parsingData(row: HTMLTableRowElement) {
        let id = row.getAttribute("id");
        let item: Data = this.owner.getItem(id);
        for (let i in row.children) {
            if (row.children.hasOwnProperty(i) === false) {
                continue;
            }
            let cell: HTMLTableCellElement = <HTMLTableCellElement>row.children[i];
            let colAttribute = this.columns[i].attribute;
            if (colAttribute.indexOf("\.") < 0) {
                item[colAttribute] = cell.innerHTML.trim();
            }
        }
        this.$searchControl.with(item, row);
    }

    public propertyChange(entity: Data, property: string, oldValue, newValue) {
        let row: HTMLTableRowElement = this.cells[entity.id];
        let cell;
        if (!row) {
            row = document.createElement("tr");
            let count = this.columns.length;
            for (let i = 0; i < count; i++) {
                cell = document.createElement("td");
                row.appendChild(cell);
            }
            this.cells[entity.id] = row;
            this.$bodysection.appendChild(row);
        }

        for (let c in this.columns) {
            if (this.columns.hasOwnProperty(c) === false) {
                continue;
            }
            let name = this.columns[c].attribute;
            if (name === property) {
                cell = row.children[c];
                cell.innerHTML = newValue;
            }
        }
    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (entity) {
            if (!this.class || this.class === entity.class) {
                entity.addListener(this);
            }
        }
    }
}
class Column {
    label: string;
    attribute: string;
    $element: HTMLTableHeaderCellElement;
}
class Data {
    id: string;
    $listener: Control[] = [];
    class: string;
    public values = {};

    public setValue(attribute, newValue) {
        let oldValue = this.values[attribute];
        this.values[attribute] = newValue;
        for (let i in this.$listener) {
            if (this.$listener.hasOwnProperty(i) === false) {
                continue;
            }
            this.$listener[i].propertyChange(this, attribute, oldValue, newValue);
        }
    }

    public addListener(control: Control) {
        this.$listener.push(control);
    }

    public removeListener(control: Control) {
        let pos = this.$listener.indexOf(control);
        if (pos >= 0) {
            this.$listener.splice(pos, 1);
        }

    }
}
;
var bridge = new Bridge();
