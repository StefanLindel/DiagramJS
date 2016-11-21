class BridgeElement {
    private static elementSet: Set<BridgeElement> = new Set();
    //static elementNum: number = 0;

    constructor(model: Data) {
        this.model = model;
        this.id = model.id;
        BridgeElement.elementSet.add(this);
    }

    public model: Data;
    public id:string;
    public gui: HTMLTableRowElement;
}