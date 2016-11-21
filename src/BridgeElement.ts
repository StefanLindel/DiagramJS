class BridgeElement {
    private static elementSet: Set<BridgeElement> = new Set();
    public model: Data;
    public id:string;
    public gui: HTMLElement;
    //static elementNum: number = 0;

    constructor(model: Data) {
        this.model = model;
        this.id = model.id;
        BridgeElement.elementSet.add(this);
    }
}