class BridgeElement {
    private static _elements: Map<String, BridgeElement>;

    static get elements(): Map<String, BridgeElement> {
        return this._elements;
    }

    static removeElements(id: String,) {
        this._elements.delete(id);
    }

    static set elements(value: Map<String, BridgeElement>) {
        this._elements = value;
    }

    static addElements(id: String, element: BridgeElement) {
        this._elements.set(id, element);
    }

    constructor(model: Data) {
        this.model = model;
    }

    public model: Data;
    public gui: HTMLTableRowElement;
}