import {Bridge} from '../src/Bridge';

export abstract class   TestCase {

    protected bridge: Bridge;
    /**
     * the root object given by the html page
     */
    private root: HTMLElement;

    /**
     * the div that contains all the elements created by this test-case
     */
    protected control: HTMLDivElement;

    constructor(root: HTMLElement) {
        this.root = root;
        this.control = document.createElement('div');
        this.root.appendChild(this.control);
        this.bridge = new Bridge(this.control);
    }

    public init() {
    }

    // public abstract execute(): Promise<boolean>;
    public abstract execute(): boolean;

    public cleanup() {
        if(this.control) {
            this.root.removeChild(this.control);
        }
    }

    protected equals(obj1: any, obj2: any): boolean {
        return obj1 === obj2;
    }
}
