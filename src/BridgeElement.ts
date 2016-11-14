class BridgeElement {
    private static elementSet: Set<BridgeElement> = new Set();
    private static _elements: Map<string, BridgeElement> = new Map();
    static elementNum: number = 0;

    static get elements(): Map<string, BridgeElement> {
        return this._elements;
    }

    static removeElements(id:string) {
        this._elements.delete(id);
    }

    static set elements(value: Map<string, BridgeElement>) {
        this._elements = value;
    }

    static addElements(id: string, element: BridgeElement) {
        this.elements.set(id, element);
    }

    constructor(model: Data) {
        this.model = model;
        BridgeElement.elementSet.add(this);
    }

    public model: Data;
    public gui: HTMLTableRowElement;
}