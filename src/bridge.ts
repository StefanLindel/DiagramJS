abstract class Control {
	id:string;
	public owner:Bridge;
	constructor(owner:Bridge, data) {
		this.owner = owner;
	}
	public abstract propertyChange(entity:Data, property:string, oldValue, newValue);
	public addItem(source:Bridge, entity:Data) {

	}
}

class Table extends Control {
	private columns:Column[] = [];
	private cells:Object = {};
	private class:string;

	private $element:HTMLElement;
	constructor(owner, data) {
		super(owner, data);
		let id:string;
		// init form HTML
		if (typeof(data)==="string") {
				id = data;
		} else {
			id = data.id;
			this.class = data.class;
		}
		if(!id) {
			return;
		}
		let table:HTMLElement = document.getElementById(id);
		let headerrow:HTMLTableRowElement;
		if (!table) {
			table = document.createElement("table");
			document.getElementsByTagName("body")[0].appendChild(table);
		}
		this.$element = table;
		if(data["classname"]) {
			table.className=data["classname"]
		} else {
			table.className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp";
		}
		
		this.id = id;
		table.id = id;
		table.setAttribute("control", this.constructor["name"].toLowerCase());
		let i=0;
		for (let c in table.children) {
			if (table.children.hasOwnProperty(c) === false) {
				continue;
			}
			let row:HTMLTableRowElement = <HTMLTableRowElement>table.children[c];
			if (i == 0) {
				headerrow = row;
				this.parsingHeader(row);
			} else {
				this.parsingData(row);
			}
			i++;
		}
		if(!headerrow) {
			headerrow = document.createElement("tr");
			table.appendChild(headerrow);
		}
		if(data["columns"]) {
			// It is a json must add all things and generate HTML
			for(let i in data["columns"]) {
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
			table.appendChild(searchBar);

		//}
		// init from
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
	public printSearchbar(parent:HTMLElement) {
		let search = document.createElement("input");
		search.className="search";
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
		
	public parsingData(row: HTMLTableRowElement) {
		let id = row.getAttribute("id");
 		let item:Data = this.owner.getItem(id);
		for (let i in row.children) {
			if (row.children.hasOwnProperty(i) === false) {
				continue;
			}
			let cell:HTMLTableCellElement = <HTMLTableCellElement>row.children[i];
			let colAttribute = this.columns[i].attribute;
			if(colAttribute.indexOf("\.")<0) {
				item[colAttribute] = cell.innerHTML.trim();
			}
		}
	}
	public propertyChange(entity:Data, property:string, oldValue, newValue) {
		let row:HTMLTableRowElement = this.cells[entity.id];
		let cell;
		if(!row) {
			row = document.createElement("tr");
			let count = this.columns.length;
			for(let i=0;i<count;i++) {
				cell = document.createElement("td");
				row.appendChild(cell);
			}
			this.cells[entity.id] = row;
			this.$element.appendChild(row);
		}

		for (let c in this.columns) {
			if (this.columns.hasOwnProperty(c) === false) {
				continue;
			}
			let name = this.columns[c].attribute;
			if(name === property) {
				cell = row.children[c];
				cell.innerHTML = newValue;
			}
		}
	}

	public addItem(source:Bridge, entity:Data) {
		// check for new Element in Bridge
		if(entity) {
			if(!this.class || this.class === entity.class) {
				entity.addListener(this);
			}
		}
	}
}
class Column {
	label:string;
	attribute:string;
	$element:HTMLTableHeaderCellElement;
}
class Data {
	id:string;
	$listener:Control[]=[];
	class:string;
	public values={};

	public setValue(attribute, newValue) {
		let oldValue = this.values[attribute];
		this.values[attribute] = newValue;
		for(let i in this.$listener) {
			if (this.$listener.hasOwnProperty(i) === false) {
				continue;
			}
			this.$listener[i].propertyChange(this, attribute, oldValue, newValue);
		}
	}
	public addListener(control:Control) {
		this.$listener.push(control);
	}
	public removeListener(control:Control) {
		let pos = this.$listener.indexOf(control);
		if(pos>=0) {
			this.$listener.splice(pos, 1);
		}
	}
}
class Bridge {
	private version:String = "0.42.01.1601007-1739";
	private listener:Array<Object> = [];
	private controlFactory:Object = {};
	private controls:Object = {};
	private items:Object = {};
	private controlNo:number = 1;

	constructor() {
		this.addControl(Table);
	}
	public addListener = function(listener) {
		this.listener.push(listener);
	}
	public addControl(control) {
		this.controlFactory[control.name.toLowerCase()] = control;
	}
	public getId() : string{
		return "control"+(this.controlNo++);
	}
	public load(json) {
		let className;
		if(typeof(json)==="object") {
			if(!json["id"]) {
				json["id"] = this.getId();
			}
			className = json["control"].toLowerCase();
		} else {
			let item = document.getElementById(json);
			if(item) {
				className = item.getAttribute("control");
				if(className) {
					className = className.toLowerCase();
				} else {
					className = "";
				}
			}
		}
		if(typeof(this.controlFactory[className])==="object" || typeof(this.controlFactory[className]) === "function") {
			let obj = this.controlFactory[className];
			let control = new obj(this, json);
			this.controls[control.id] = control;
		}
		//bridge.load("{class:table, columns:[{id:'firstname'}, {id:'lastname'}]}");
	}
	public executeChange(change) {
		let newData = this.hasItem(change.id);
		let item:Data = this.getItem(change.id);
		if(change["class"]) {
			item.class = change["class"];
		}
		if(newData) {
			for(let i in this.controls) {
				if (this.controls.hasOwnProperty(i) === false) {
					continue;
				}
				this.controls[i].addItem(this, item);
			}
		}
		this.addProperties(change["property"], item);
		this.addProperties(change["upd"], item);
	}
	public addProperties(prop:Object, item:Data) {
		if(!prop) {
			return;
		}
		for(let property in prop) {
			if (prop.hasOwnProperty(property) === false) {
				continue;
			}
			if(prop[property] && "" !== prop[property]) {
				item.setValue(property, prop[property]);
			}
		}
	}
	public hasItem(id:string) : boolean{
		return (this.items[id] == null)
	}
	public getItem(id:string) : Data {
		let item = this.items[id];
		if(!item) {
			item = new Data();
			item.id=id;
			this.items[id] = item;
		}
		return item;
	}
	public getValue(id:string, attribute:string){
		let control = this.items[id];
		return control.getValue(attribute);
	}
}
var bridge = new Bridge();