import SimpleEvent from "./Event";

export default class EventListener {

    private _onUpdate: Function;

    get onUpdate(): Function {
        return this._onUpdate;
    }

    set onUpdate(value: Function) {
        this._onUpdate = value;
    }

    update(event: SimpleEvent) {
        this.onUpdate(event);
    }
}