'use strict';
import Data from './Data';

export default class BridgeElement {
    private static elementSet: BridgeElement[] = [];
    public model: Data;
    public id: string;
    public gui: HTMLElement;

    constructor(model: Data) {
        this.model = model;
        this.id = model.id;
        BridgeElement.elementSet.push(this);
    }
}
