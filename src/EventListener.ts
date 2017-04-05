import SimpleEvent from './Event';

export default class EventListener {
    private $onUpdate: Function;

    get onUpdate(): Function {
        return this.$onUpdate;
    }

    set onUpdate(value: Function) {
        this.$onUpdate = value;
    }

    update(event: SimpleEvent) {
        this.$onUpdate(event);
    }
}
