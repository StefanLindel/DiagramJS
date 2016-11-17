///<reference path="Bridge.ts"/>

abstract class Control {
    id: string;
    public owner: Bridge;
    public property: string;
    protected items:Set<BridgeElement>=new Set<BridgeElement>();


    constructor(owner: Bridge, data) {
        this.owner = owner;
    }

    public abstract propertyChange(entity: Data, property: string, oldValue, newValue);

    public addItem(source: Bridge, entity: Data) {}
}