/**
 * Created by Stefan on 28.06.2017.
 */
import {Control} from "../../Control";

export class AutoComplete extends Control {
    private $inputField:HTMLInputElement;
    private $dataList:HTMLDataListElement;
    private $selected:HTMLSelectElement;
    private $items:HTMLDivElement;
    private isMultiple:boolean;

    public load(json: JSON, owner?: Control): any {
        this.createControl(this.$owner, json);
    }
    protected createControl(parent: Control, data: JSON) {
        if (typeof(data) === 'string') {
            this.id = <string>data;
        } else {
            this.id = data['id'];
        }
        let div:HTMLDivElement = document.createElement('div');
        this.$view = div;
        this.$inputField = document.createElement('input');
        this.$dataList = document.createElement("datalist");
        this.$dataList.id = "data_"+this.id;
        this.$inputField.setAttribute("list", "data_"+this.id);
        if(data["value"]) {
            let values = data["value"];
            this.isMultiple = data["multiple"] != null;
            let option:HTMLOptionElement;
            if(this.isMultiple) {
                this.$selected = document.createElement("select");
                this.$selected.className = "hide";
                this.$selected.multiple = true;

                this.$selected.id = this.id;
                this.$items = document.createElement("div");
                this.$items.className = "selectedList";
                div.appendChild(this.$items);
                this.$inputField.className = "selectedInput";
                div.appendChild(this.$selected);
                this.$view["style"].setProperty("float", "left");
                let that = this;
                this.$inputField.oninput = function(){that.onChange();}
            } else {
                this.$inputField.id = this.id;
            }
            for (let attr in values) {
                if (!values.hasOwnProperty(attr)) {
                    continue;
                }
                option = document.createElement("option");
                option.value = values[attr];
                this.$dataList.appendChild(option);
                if(this.isMultiple) {
                    option = document.createElement("option");
                    option.value = values[attr];
                    option.innerHTML = values[attr];
                    this.$selected.appendChild(option);
                }
        }

            div.appendChild(this.$inputField);
            div.appendChild(this.$dataList);
        }

        if (data instanceof Object) {
            for (let attr in data) {
                if (!data.hasOwnProperty(attr)) {
                    continue;
                }
                this.$view.setAttribute(attr, data[attr]);
            }
            if(this.isMultiple) {
                div.appendChild(this.$selected);
            }
        }

        parent.appendChild(this);
    }

    public onChange() : void {
        let textValue:string = this.$inputField.value;
        if(textValue.length<1) {
            return;
        }
        for(let i=0;i<this.$selected.children.length;i++) {
            let item:HTMLOptionElement = <HTMLOptionElement>this.$selected.children[i];
            if(item.value == textValue) {
                if(item.selected == false) {
                    item.selected = true;
                    item.defaultSelected = true;
                    let test = document.createElement("li");
                    let that = this;
                    test.onclick = function() {that.onDelete(item.value, test);};
                    test.className = "selectedItem";
                    test.innerHTML = item.value;
                    this.$items.appendChild(test);
                    this.$inputField.value = "";
                }
            }
        }
    }
    public onDelete(value:string, selectedItem:HTMLLIElement) : void {
        this.$items.removeChild(selectedItem);
        for(let i=0;i<this.$selected.children.length;i++) {
            let item:HTMLOptionElement = <HTMLOptionElement>this.$selected.children[i];
            if(item.value == value ) {
                if(item.selected) {
                    item.selected = false;
                }
            }
        }
    }
}