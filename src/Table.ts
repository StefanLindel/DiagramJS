///<reference path="Bridge.ts"/>

class TableElement {
    constructor(model:Data) {
        this.model = model;
    }
    public model:Data;
    public gui:HTMLTableRowElement;
}



class Table extends Control {
    private columns: Column[] = [];
    private cells: Object = {};
    private class: string;
    private $element: HTMLElement;
    private $bodysection: HTMLTableSectionElement;
    private $headersection: HTMLTableSectionElement;
    private showedItems:Array<TableElement>=[];
    private items:Array<TableElement>=[];
    private countElement:HTMLElement;
    private countColumn:HTMLElement;
    private countColumnPos:number;
    private resultColumn:string;
    private lastSearchText:string;
    private searchColumns:Array<string>=[];
    private searchText:Array<string>=[];

    constructor(owner, data) {
        super(owner, data);
        let id: string;
        // init form HTML
        if (typeof(data) === "string") {
            id = data;
        } else {
            id = data.id;
            this.class = data.class;
            if(data.searchColumns) {
                if (typeof(data.searchColumns) === "string") {
                    this.searchColumns = data.searchColumns.split(" ");
                } else {
                    this.searchColumns = data.searchColumns;
                }
            }

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
        // Create Full Row
        let searchBar = document.createElement("tr");
        let cell = document.createElement("td");
        cell.setAttribute("colspan", ""+this.columns.length);
        searchBar.appendChild(cell);

        let search = document.createElement("input");
        var that = this;
        search.onchange = function(evt){that.search(evt.target["value"]);};
        search.className = "search";
        cell.appendChild(search);
        if(this.resultColumn) {
            if(this.resultColumn.startsWith("#") == false) {
                this.countElement = document.createElement("div");
                searchBar.appendChild(this.countElement);
            } else {
                for(let z:number=0;z<this.$headersection.children.length;z++) {
                    if(this.$headersection.children[z].innerHTML === this.resultColumn) {
                        this.countColumn = <HTMLElement> this.$headersection.children[z];
                        this.countColumnPos = z;
                        break;
                    }
                }
            }
        }
        let first = this.$headersection.children.item(0);
        this.$headersection.insertBefore(searchBar, first)
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
                let item:TableElement = new TableElement(entity);
                this.items.push(item);
                if(this.searching(item)) {
                    this.showItem(item);
                }
            }
        }
    }

    // Searching
    public search(origSearchText:String) {
        if (!origSearchText) {
            origSearchText = "";
        }
        let searchText:string = origSearchText.trim().toLowerCase();
        if (searchText == this.lastSearchText && searchText != "") {
            return 0; // <==== nothing to be done
        }
        let oldSearch:string = this.lastSearchText;
        this.lastSearchText = searchText;

        this.parseSearchArray();
        if (searchText != "" && oldSearch != null && searchText.indexOf(oldSearch) >= 0 && searchText.indexOf("|") < 0) {
            this.searchFilter(this.showedItems);
        } else {
            this.searchFilter(this.items);
        }
        this.refreshCounter();
    }
    public refreshCounter() {
        if(this.countColumn) {
            this.countColumn.innerHTML = this.columns[this.countColumnPos].label + " (" + this.showedItems.length + ")";
        }
        //var countElement = document.getElementById('talkCount');
        //if (countElement) {
        //     var txt = (this.showedItems.size() > 0 && searchText.length > 0 ) ? this.options.TEXT_SEARCHLIST : this.options.TEXT_SEARCHFULLLIST;
        //     countElement.innerHTML = txt.replace("%LEN%", this.root['children'].length).replace("%COUNT%", this.showedItems.size()).replace("%SEARCH%", origSearchText);
        // }
        // if (this.countColumn) {
        //     this.countColu1mn.innerHTML = this.countColumn["label"] + " (" + this.showedItems.size() + ")";
        // }
    }
    public parseSearchArray() {
        let pos:number = 0;
        let split:Array<string> = new Array<string>();
        let quote:boolean = false;
        for (var i:number = 0; i < this.lastSearchText.length; i++) {
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
        this.searchText = split;
        return split;
    }
    public searchFilter(root:Array<TableElement>) {
        this.showedItems=new Array<TableElement>();
        // Search for Simple Context
        for (let i:number = 0; i < root.length; i++) {
            var item:TableElement = root[i];
            if (this.searching(item)) {
                this.showItem(item);
            } else {
                this.removeItem(item);
            }
        }
    }

    public showItem(item:TableElement) {
        this.showedItems.push(item);
    }
    public removeItem(item:TableElement) {
        this.$bodysection.removeChild(item.gui);
    }

    public searching(item:TableElement) : boolean {
        let fullText:string = "";
        for (let i:number = 0; i < this.searchColumns.length; i++) {
            if (this.searchColumns[i].trim().length > 0) {
                fullText = fullText + " " ;//+ item.model.getById(this.searchColumns[i]).innerHTML;
            }
        }
        fullText = fullText.trim().toLowerCase();
        for (let z:number = 0; z < this.searchText.length; z++) {
            if ("" != this.searchText[z]) {
                if (this.searchText[z].indexOf("|") > 0) {
                    var orSplit:Array<string> = this.searchText[z].split("|");
                    for (var o = 0; o < orSplit.length; o++) {
                        if (this.searchSimpleText(orSplit[o], fullText)) {
                            return true;
                        }
                    }
                    return false;
                }
                return this.searchSimpleText(this.searchText[z], fullText);
            }
        }
        return true;
    }
    public searchSimpleText(search:string, fullText:string) : boolean{
        if(search.length>1&&search.indexOf("-")==0){
            if(fullText.indexOf(search.substring(1)) >= 0){
                return false;
            }
        }else if(fullText.indexOf(search) < 0){
            // no this search word is not found in full text
            return false;
        }else if(search.indexOf(" ")>0){
            //let z:number=search.indexOf(" ");
            //var pos = fullText.indexOf(this.searchText[z]) + this.searchText[z].length;
            //if(pos<fullText.length && fullText.charAt(pos)!=" "){
            //    return false;
            //}
        }
        return true;
    }
}
class Column {
    label: string;
    attribute: string;
    $element: HTMLTableHeaderCellElement;
}