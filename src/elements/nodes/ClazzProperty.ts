import {Util} from '../../util';
import {DiagramElement} from '../BaseElements';
import Data from '../../Data';

export default class ClazzProperty extends DiagramElement {

    // Public (+)
    // Private (-)
    // Protected (#)
    // Package (~)

    public $data = new Data();
//    public modifier: string = '+';
//    public name: string;
//    public type: string;
//    public value: string;

    constructor(data: any | JSON) {
        super();
        this.$data.setValue('modifier', '+');
        this.$data.setValue('name', null);
        this.$data.setValue('type', null);
        this.$data.setValue('value', null);
        this.extractData(data);
    }

    public update(data: any | JSON): void {
        this.extractData(data);
        this.updateTextOfView();
    }

    public updateModifier(modifier: string): void {
        this.$data.setValue('modifier', modifier);
        this.updateTextOfView();
    }

    public updateType(type: string): void {
        this.$data.setValue('type', type);
        this.updateTextOfView();
    }

    public updateValue(value: string): void {
        this.$data.setValue('value', value);
        this.updateTextOfView();
    }

    public updateName(name: string): void {
        this.$data.setValue('name', name);
        this.updateTextOfView();
    }

    public getName(): string {
        return this.$data.getValue('name');
    }

    public getModifier(): string {
        return this.$data.getValue('modifier');
    }

    public getType(): string {
        return this.$data.getValue('type');
    }

    public getSVG(): Element {
        let attrText = {
            tag: 'text',
            'text-anchor': 'start',
            'alignment-baseline': 'middle',
        };

        let attrSvg = Util.createShape(attrText);
        attrSvg.textContent = this.toString();

        this.$view = attrSvg;

        return attrSvg;
    }

    public toString(): string {
        let value = this.$data.getValue('value');
        let result = this.$data.getValue('modifier') + ' ';
        result += this.$data.getValue('name') + ' : ';
        result += this.$data.getValue('type');
        if (value && value.length > 0) {
            result += ' = ' + this.$data.getValue('value');
        }
        return result;
    }

    protected extractData(data: any | JSON): void {

        if (!data) {
            return;
        }

        if (data.type) {
            this.$data.setValue('type', data.type);
        }

        if (data.name) {
            this.$data.setValue('name', data.name);
        }

        if (data.modifier) {
            this.$data.setValue('modifier', data.modifier);
        }

        if (typeof data === 'string') {

            // e.g. name : string or name:string
            let dataSplitted = data.split(':');
            if (dataSplitted && dataSplitted.length === 2) {

                // modifer (and or) name
                let modifierAndNameSplitted = dataSplitted[0].trim();

                // first char is +, - or #
                let firstChar = modifierAndNameSplitted[0];
                let name;
                if (firstChar === '+' || firstChar === '-' || firstChar === '#') {
                    this.$data.setValue('modifier', firstChar);
                    name = modifierAndNameSplitted.substring(1, modifierAndNameSplitted.length).trim();
                }
                else {
                    name = modifierAndNameSplitted;
                }
                // delete whitespaces in name
                name = name.replace(/ /g, '_');

                this.$data.setValue('name', name);
                let type = dataSplitted[1].trim() || 'String';

                // if the type was entered with a small begin letter
                if (type.toLowerCase() === 'string') {
                    type = 'String';
                }
                // delete whitespaces in type
                type = type.replace(/ /g, '_');
                this.$data.setValue('type',  type);
            } else {
                dataSplitted = data.split('=');
                if (dataSplitted && dataSplitted.length === 2) {
                    // modifer (and or) name
                    let modifierAndNameSplitted = dataSplitted[0].trim();

                    // first char is +, - or #
                    let firstChar = modifierAndNameSplitted[0];
                    let name;
                    if (firstChar === '+' || firstChar === '-' || firstChar === '#') {
                        this.$data.setValue('modifier', firstChar);
                        name = modifierAndNameSplitted.substring(1, modifierAndNameSplitted.length).trim();
                    }
                    else {
                        name = modifierAndNameSplitted;
                    }
                    // delete whitespaces in name
                    name = name.replace(/ /g, '_');

                    this.$data.setValue('name', name);
                    let value = dataSplitted[1].trim() || '""';
                    this.$data.setValue('value', value);
                    this.$data.setValue('type', typeof value);
                }
            }
        }
    }

    protected updateTextOfView() {
        if (this.$view) {
            this.$view.textContent = this.toString();
        }
        if (this.$owner) {
            Util.saveToLocalStorage(this.$owner.$owner);
        }
    }
}
