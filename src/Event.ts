export default class SimpleEvent {

    private _attribute: string;
    private _oldValue: Object;
    private _newValue: Object;

    constructor(attr: string, oldValue: Object, newValue: Object) {
        this._attribute = attr;
        this._oldValue = oldValue;
        this._newValue = newValue;
    }

    get attribute(): string {
        return this._attribute;
    }

    set attribute(value: string) {
        this._attribute = value;
    }

    get oldValue(): Object {
        return this._oldValue;
    }

    set oldValue(value: Object) {
        this._oldValue = value;
    }

    get newValue(): Object {
        return this._newValue;
    }

    set newValue(value: Object) {
        this._newValue = value;
    }
}