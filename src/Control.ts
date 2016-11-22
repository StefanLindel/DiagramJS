import Bridge from "./Bridge"

abstract class Control {
    id: string;
    public owner: Bridge;
    public property: string;
    protected items:Set<BridgeElement>=new Set<BridgeElement>();


    constructor(owner: Bridge, data) {
        this.owner = owner;
    }

    public abstract propertyChange(entity: Data, property: string, oldValue, newValue);

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (entity) {
            if (!this.property || this.property === entity.property) {
                entity.addListener(this);
            }
        }
    }
}