class BridgeElement {
    private static elementSet: Set<BridgeElement> = new Set();
    private static _elements: Map<String, BridgeElement> = new Map();
    static elementNum: number = 0;

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
        this.elements.set(id, element);
    }

    constructor(model: Data) {
        this.model = model;
        BridgeElement.elementSet.add(this);
    }

    public model: Data;
    public gui: HTMLTableRowElement;
}