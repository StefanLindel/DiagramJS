class BridgeElement {
    private static elementSet: Set<BridgeElement> = new Set();
    static elementNum: number = 0;

    constructor(model: Data) {
        this.model = model;
        BridgeElement.elementSet.add(this);
    }

    public model: Data;
    public gui: HTMLTableRowElement;
}