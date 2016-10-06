
export default class Bridge {
	private listener:Array<Object> = [];
	private controls:Control = {};

	constructor() {
		this.addControl(new Table(""));
	}
	public addListener = function(listener) {
		this.listener.push(listener);
	}
	public addControl(control) {
		this.controls[typeof(control)] = control;
	}
	public load(json) {
		var className = json["class"];
		var control = new this.controls[className](json);
		//bridge.load("{class:table, columns:[{id:'firstname'}, {id:'lastname'}]}");
	}
}

export class Control {
}

export class Table extends Control {
	private columns:Column[] = [];
	//private cells:HTMLElement[] = [];
	private items:Object = {};
	constructor(data) {
		super();
		let id:string;
			// init form HTML
		if(data instanceof String) {
				id = data;
		} else {
			id = data.id;
		}
		if(!id) {
			return;
		}
		let table:HTMLElement = document.getElementById(id);
		let headerrow:HTMLTableRowElement;
		if (!table) {
			table = document.createElement("table");
			document.appendChild(table);
		}
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
				col.label = id;
				col.attribute = col["attribute"] || id;
				col.$element = document.createElement("th");
				col.$element.innerHTML = col.label;
				this.columns.push(col);
				headerrow.appendChild(col.$element);
			}
		}
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
	public parsingData(row: HTMLTableRowElement) {
		let id = row.getAttribute("id");
		let item:Data = this.items[id];
		if(item !== null) {
			item.$element = row;
			return;
		} else {
			item = new Data();
			item.id=id;
			item.$element = row;
		}
		for (let i in row.children) {
			if (row.children.hasOwnProperty(i) === false) {
				continue;
			}
			let cell:HTMLTableCellElement = <HTMLTableCellElement>row.children[i];
			let colAttribute = this.columns[i].attribute;
			item[colAttribute] = cell.innerHTML.trim();
		}
	}
}
export class Column {
	label:string;
	attribute:string;
	$element:HTMLTableHeaderCellElement;
}
export class Data {
	id:string;
	$element:HTMLTableRowElement;
}
var bridge=new Bridge();