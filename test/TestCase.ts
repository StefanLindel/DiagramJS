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
    public execute(): boolean{
        this.run();
        return true;
    }

    protected abstract run(): void;

    public cleanup() {
        if(this.control) {
            this.root.removeChild(this.control);
        }
    }

    protected assertEquals(obj1: any, obj2: any): boolean {
        if (obj1 !== obj2) {
            throw new Error('Assertion error: ' + obj1 + ' expected, actually was: ' + obj2);
        }
        return obj1 === obj2;
    }

    protected assertNotNull(obj1: any): boolean {
        if (obj1 === null) {
            throw new Error('Assertion error: ' + obj1 + ' expected, to be not null');
        }
        return obj1 !== null;
    }
}
