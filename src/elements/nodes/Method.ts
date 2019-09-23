import { Util } from '../../util';
import { Point } from '../BaseElements';
import { DiagramElement } from '../BaseElements';
import ClazzProperty from './ClazzProperty';

export default class Method extends ClazzProperty {

    constructor(data: any | JSON) {
        super(data);
    }

    protected extractData(data: any | JSON): void {
        if (!data) {
            return;
        }

        if (data.type) {
            this.updateType(data.type);
        }

        if (data.name) {
            this.updateType(data.name);
        }

        if (data.modifier) {
            this.updateType(data.modifier);
        }

        if (typeof data === 'string') {
            // e.g. setName() : string or name:string
            let dataSplitted = data.split(':');

            if (dataSplitted && dataSplitted.length === 2) {

                // modifer (and or) name
                let modifierAndNameSplitted = dataSplitted[0].trim();

                // first char is +, - or #
                let firstChar = modifierAndNameSplitted[0];
                if (firstChar === '+' || firstChar === '-' || firstChar === '#') {
                    this.updateModifier(firstChar);
                    this.updateName(modifierAndNameSplitted.substring(1, modifierAndNameSplitted.length).trim());
                }
                else {
                    this.updateName(modifierAndNameSplitted);
                }
                this.updateType(dataSplitted[1].trim() || 'void');
            }
            // set default return type of void
            else {
                // modifer (and or) name
                let modifierAndNameSplitted = data.trim();

                // first char is +, - or #
                let firstChar = modifierAndNameSplitted[0];
                if (firstChar === '+' || firstChar === '-' || firstChar === '#') {
                    this.updateModifier(firstChar);
                    this.updateName(modifierAndNameSplitted.substring(1, modifierAndNameSplitted.length).trim());
                } else {
                    this.updateName(modifierAndNameSplitted);
                }
                this.updateType('void');
            }
        }

        if (Util.includes(this.$data.getValue('name'), '(') && Util.includes(this.$data.getValue('name'), ')') === false) {
            this.$data.setValue('name', this.$data.getValue('name') + '()');
        }
    }
}
