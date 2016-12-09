import Control from '../Control'
import BridgeElement from '../BridgeElement'
import Data from '../Data'
import {util} from '../util'

export class Table extends Control {
    private columns: Column[] = [];
    private cells: Object = {};
    private $element: HTMLElement;
    private $bodysection: HTMLTableSectionElement;
    private $headersection: HTMLTableSectionElement;
    private showedItems:Array<BridgeElement>=[];
    private itemsIds:Object={};
    private countElement:HTMLElement;
    private countColumn:HTMLElement;
    private countColumnPos:number;
    private resultColumn:string;
    private lastSearchText:string;
    private searchColumns:Array<string>=[];
    private searchText:Array<string>=[];
    private sortColumn:Column;
    private direction;
    private moveElement:Column = null;
    private isDrag:boolean = false;
    private moveTimeStamp:number;
    private moveX:number;
    private dragSrcEl:Column = null;

    constructor(owner, data) {
        super(owner, data);
        let id: string;
        // init form HTML
        if (typeof(data) === "string") {
            id = data;
        } else {
            id = data.id;
            this.property = data.property;
            if(data.searchColumns) {
                let search:Array<string>=[];
                if (typeof(data.searchColumns) === "string") {
                    search = data.searchColumns.split(" ");
                } else {
                    search = data.searchColumns;
                }
                for(let z:number=0;z<search.length;z++) {
                    if (search[z].trim().length > 0) {
                        this.searchColumns.push(search[z].trim());
                    }
                }
            }

        }
        if (!id) {
            return;
        }
        let table: HTMLElement = document.getElementById(id);
        let headerrow: HTMLTableRowElement;
        if (table) {
            if(!this.property) {
                this.property = table.getAttribute("property");
            }
        } else {
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
        table.setAttribute("type", this.constructor["name"].toLowerCase());
        let i = 0;
        for (let c in table.children) {
            if (table.children.hasOwnProperty(c) === false) {
                continue;
            }
            let row: HTMLTableRowElement = <HTMLTableRowElement>table.children[c];
            if (row instanceof HTMLTableSectionElement) {
                if (row.tagName == "THEAD") {
                    headerrow = row;
                    // Its a thead
                    for (let r in row.children) {
                        if (row.children.hasOwnProperty(r) === false) {
                            continue;
                        }
                        this.parsingHeader(<HTMLTableRowElement>row.children[r]);
                    }
                    //this.parsingHeader(row);
                } else {
                    // Its a tbody
                    for (let r in row.children) {
                        if (row.children.hasOwnProperty(r) === false) {
                            continue;
                        }
                        this.parsingData(<HTMLTableRowElement>row.children[r]);
                    }
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
                col.$element.ondragstart = function(e){
                    console.log("dragstart:"+column);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/json', JSON.stringify(util.toJson(column)));
                };
                // resize Header
                col.$resize = document.createElement("div");
                col.$resize.classList.add("resize");
                col.$element.appendChild(col.$resize);
                this.addHeaderInfo(col);
                this.columns.push(col);
                headerrow.appendChild(col.$element);
            }
            let cell = document.createElement("th");
            cell.classList.add("tableOption");
            headerrow.appendChild(cell);

            let context = document.createElement("div");
            context.classList.add("dropdown-content");
            context.style.setProperty("position", "absolute");
            cell.appendChild(context);

            /* When the user clicks on the button,
             toggle between hiding and showing the dropdown content */
            cell.addEventListener(
                'click',
                function(){
                    context.classList.toggle("show");
                },
                false);

            let link = document.createElement("a");
            link.appendChild(document.createTextNode("fix") );

            // link.appendChild("");
            link.href = "javascript:void(0);";
            context.appendChild(link);
        }
        this.registerEvents('mousemove', 'mousedown', 'mouseup', 'resize', 'keyup');
        this.$element.addEventListener("dragstart", function(e) {
            console.log("dragstart: table" );
        });

        // Check for SearchBar
        //if(data["searchproperty"]){
        // Create Full Row
        let searchBar = document.createElement("tr");
        let cell = document.createElement("td");
        cell.setAttribute("colspan", ""+(this.columns.length));
        searchBar.appendChild(cell);

        let search = document.createElement("input");
        search.className = "search";
        let that = this;
        search.addEventListener('keyup', function(evt){that.search(evt.target["value"]);});

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
    private registerEvents(...events:string[]) {
        let that = this;
        for (let i = 0; i < events.length; i++) {
            this.$element.addEventListener(events[i], function (evt) {return that.tableEvent(events[i], evt);});
        }
    }


    public tableEvent(type:string, e:Event) {
        console.log("table:"+type);
        let button: number = 0;
        let eventX: number = 0;
        if (e instanceof MouseEvent) {
            button = e.buttons;
            eventX = e.pageX;
        }
        console.log("table:"+type);
        if (type == 'mouseup') {
            this.moveElement = null;
        } else if (type == 'mousedown' || type == 'resize') {
            // End to Resize
            this.moveElement = null;
            if (button == 1) {
                let c: number;
                for (c = 0; c < this.columns.length; c++) {
                    if (this.columns[c].$resize === e.target) {
                        this.moveElement = this.columns[c];
                        this.isDrag = false;
                        break;
                    } else if (this.columns[c].$element === e.target) {
                        this.moveElement = this.columns[c];
                        this.isDrag = true;
                        let element:HTMLElement  = this.moveElement.$element;
                        element.style.opacity = '0.4';
                        this.moveElement.$element.draggable = true;
                        element.ondragstart.call(this, new DragEvent());
                        return true;


                        //element.ondragstart.call(this);
                    }
                }
                this.moveTimeStamp= e.timeStamp;
                this.moveX = eventX;
            } else {
                this.moveTimeStamp = 0;
            }
        } else if (type == 'mousemove') {
            if (button == 1 && this.moveElement) {
                if (this.moveTimeStamp && e.timeStamp - this.moveTimeStamp < 2000) {
                    if (this.isDrag) {
                        //FIXME
                    } else {
                        console.log("MOVE")
                        let x = eventX - this.moveX;
                        let width = this.moveElement.$element.offsetWidth;
                        this.moveElement.$element.width = "" + (width + x);
                        e.stopPropagation();
                    }
                }
                this.moveX = eventX;
                this.moveTimeStamp = e.timeStamp;
            }
        }
    }
    public dragEvent(type:string, e:Event) {
        console.log("column:"+type);
        let column: Column = null;
        for (let c = 0; c < this.columns.length; c++) {
            if (this.columns[c].$element == e.target) {
                column = this.columns[c];
                break;
            }
        }
        if (column != null) {
            // Column Found
            this.columnDragEvent(type, column, <DragEvent> e);
        }
    }

    private columnDragEvent(type:string, column:Column, e:DragEvent) {
        if (type == 'dragstart') {
            // Target (this) element is the source node.
            column.$element.style.opacity = '0.4';
            this.dragSrcEl = column;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/json', JSON.stringify(util.toJson(column)));
        } else  if(type == 'dragenter') {
            column.$element.classList.add('over');
        } else  if(type == 'dragleave') {
            column.$element.classList.remove('over');
        } else if(type == 'dragover') {
            if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
            }
            e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        } else if(type == 'drop') {
            // this / e.target is current target element.
            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }
            // See the section on the DataTransfer object.
            let start=-1, end=-1;
            for (let i = 0; i < this.columns.length; i++) {
                if( this.columns[i].$element == e.currentTarget) {
                    end = i;
                }
                if( this.columns[i].$element == this.dragSrcEl.$element) {
                    start=i;
                }
                if(start>=0 && end>=0) {
                    break;
                }
            }
            let diff:number=1;
            if(start>end) {
                diff=-1;
            }
            let line:HTMLElement = this.dragSrcEl.$element.parentElement;
            while(start != end) {
                line.removeChild(this.columns[start+diff].$element);
                line.insertBefore(this.columns[start].$element, this.columns[start+diff].$element);
                //line.inser

                this.columns[start] = this.columns[start+diff];
                start = start+diff;
            }
            this.columns[end] = this.dragSrcEl;
        } else if(type == 'dragend') {
            // this/e.target is the source node.
            column.$element.style.opacity = '1';
            for(let i=0;i<this.columns.length;i++) {
                this.columns[i].$element.classList.remove('over')
            }
        }
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
            this.addHeaderInfo(col);
        }
    }
    private addHeaderInfo(col:Column) {
        let element : HTMLTableCellElement = col.$element;
        let that = this;
        element.classList.add("sort");
        element.addEventListener('click',
            function(){
                that.sort(col);
            },
            false);
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
        if (entity) {
            // Check for Show
            if (this.property && this.property !== entity.property) {
                return;
            }
        }
        if(!entity.id) {
            return;
        }
        let item:BridgeElement = <BridgeElement>this.itemsIds[entity.id];
        let row:HTMLTableRowElement;
        if(!item) {
            item = new BridgeElement(entity);
            this.items.add(item);
            this.itemsIds[entity.id] = item;
        }
        row = this.cells[entity.id];
        if(row) {
            item.gui = row;
        }
        if(this.searching(item) == false) {
            return;
        }
        let cell;
        let showItem=false;

        if (!row) {
            showItem = true;
            row = document.createElement("tr");
            let count = this.columns.length;
            for (let i = 0; i < count; i++) {
                cell = document.createElement("td");
                row.appendChild(cell);
            }
            this.cells[entity.id] = row;
            item.gui = row;
        }
        for(let c:number =0;c<this.columns.length;c++) {
            let name = this.columns[c].attribute;
            if (name === property) {
                cell = row.children[c];
                cell.innerHTML = newValue;
            }
        }
        if(showItem) {
            this.showItem(item, true);
        }
    }
    public sort(column:Column) {
        if(this.sortColumn == column ) {
            if(this.direction == 1) {
                this.direction = -1;
                column.$element.classList.remove("asc");
                column.$element.classList.add("desc");
            } else {
                this.direction = 1;
                column.$element.classList.remove("desc");
                column.$element.classList.add("asc");
            }
        } else {
            if(this.sortColumn != null ) {
                this.sortColumn.$element.classList.remove("desc");
                this.sortColumn.$element.classList.remove("asc");
            }
            this.sortColumn = column;
            this.sortColumn.$element.classList.add("asc");
            this.direction = 1;
        }
        let that = this;
        let sort = function(a,b) { return that.sorting(a,b);};
        this.showedItems.sort(sort);
        let len:number = this.showedItems.length;
        let body = this.$bodysection;
        let i=0;
        while(i<len) {
            let item: BridgeElement = this.showedItems[i];
            if (i != Table.indexOfChild(item)) {
                break;
            }
            i = i + 1;
        }
        while (body.children.length > i) {
            body.removeChild(body.children.item(body.children.length - 1));
        }
        while(i<len) {
            let item: BridgeElement = this.showedItems[i];
            body.appendChild(item.gui);
            i = i + 1;
        }

          //      body.removeChild(item.gui);
          //      body.remove

            //console.log(item);
        //}
    }
    private static indexOfChild( item:BridgeElement) {
        let i:number = 0;
        let child:Node = item.gui;
        while( (child = child.previousSibling) != null ) {
            i++;
        }
        return i;
    }

    public sorting(a:BridgeElement, b:BridgeElement) : number {

        let path:string[] = this.sortColumn.attribute.split(".");
        let itemA = a.model.values;
        let itemB = b.model.values;
        let check = this.sortColumn.attribute;
        for(let p=0;p<path.length;p++) {
            check = path[p];
            if(itemA[check]) {
                itemA = itemA[check];
            }else{
                return 0;
            }
            if(itemB[check]) {
                itemB = itemB[check];
            }else{
                return 0;
            }
        }
        if(itemA!=itemB){
            if(this.direction == 1) {
                return (itemA<itemB) ? -1 : 1;
            }
            return (itemA<itemB) ? 1 : -1;

        }
        return 0;
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
            this.searchArray(this.showedItems);
        } else {
            this.searchSet(this.items);
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
        let split:Array<string> = [];
        let quote:boolean = false;
        for (let i:number = 0; i < this.lastSearchText.length; i++) {
            if ((this.lastSearchText.charAt(i) == " ") && !quote ) {
                let txt = this.lastSearchText.substring(pos, i).trim();
                if (txt.length > 0) {
                    split.push(txt);
                }
                pos = i + 1;
            } else if (this.lastSearchText.charAt(i) == "\"") {
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

    public searchArray(root:Array<BridgeElement>) {
        this.showedItems=[];
        // Search for Simple Context
        for (let i:number = 0; i < root.length; i++) {
            let item:BridgeElement = root[i];
            this.showItem(item, this.searching(item));
        }
    }
    public searchSet(root:Set<BridgeElement>) {
        this.showedItems=[];
        // Search for Simple Context
        for (let item of root) {
            let child : BridgeElement = <BridgeElement>item;
            this.showItem(child, this.searching(child));
        }
    }

    public showItem(item:BridgeElement, visible:boolean) {
        if(visible) {
            this.showedItems.push(item);
            this.$bodysection.appendChild(item.gui);
        } else if(item.gui && item.gui.parentElement) {
            this.$bodysection.removeChild(item.gui);
        }

    }

    public searching(item:BridgeElement) : boolean {
        let fullText:string = "";
        for (let i:number = 0; i < this.searchColumns.length; i++) {
            fullText = fullText + " "  + item.model.getValue(this.searchColumns[i]);
        }
        fullText = fullText.trim().toLowerCase();
        for (let z:number = 0; z < this.searchText.length; z++) {
            if ("" != this.searchText[z]) {
                let orSplit:Array<string>;
                if (this.searchText[z].indexOf("|") > 0) {
                    orSplit = this.searchText[z].split("|");
                } else {
                    orSplit = [this.searchText[z]];
                }
                let o:number = 0;
                for (; o < orSplit.length; o++) {
                    let pos:number = orSplit[o].indexOf(":");
                    if (orSplit[o].indexOf("#")==0 && pos > 1) {
                        //if (searchProperties.contains(propString)) {
                            let value:string  = orSplit[o].substring(pos + 1);
                            let column:string = orSplit[o].substring(1, pos - 1);
                            let dataValue:Object = item.model.getValue(column);
                            if(dataValue) {
                                if(dataValue.toString().toLowerCase().indexOf(value) >= 0) {
                                // Search for simple Property
                                    break;
                                }
                            }
                    } else if(orSplit[o].length>1&&orSplit[o].indexOf("-")==0){
                        if(fullText.indexOf(orSplit[o].substring(1)) < 0){
                            break;
                        }
                    } else if(fullText.indexOf(orSplit[o]) >= 0){
                        // his search word is found in full text
                        break;
                    }
                }
                if(o ==orSplit.length) {
                    return false;
                }
            }
        }
        return true;
    }
    public getColumn() : Column[]{
        return this.columns;
    }
}
class Column {
    label: string;
    attribute: string;
    $element: HTMLTableHeaderCellElement;
    $resize: HTMLDivElement;
    visible:boolean;
 }
