import {Bridge} from '../src/Bridge';

export abstract class TestCase {

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
    public execute(): boolean {
        this.run();
        return true;
    }

    protected abstract run(): void;

    public cleanup() {
        if (this.control) {
            this.root.removeChild(this.control);
        }
    }

    /**
     *
     * @param obj1 expected Value
     * @param obj2 actual Value
     * @returns {boolean}
     */
    protected assertEquals(obj1: any, obj2: any, message?: string): boolean {
        if (obj1 !== obj2) {
            throw new Error((message ? '(' + message + ') ' : '') + 'Assertion error: ' + obj1 + ' expected, actually was: ' + obj2);
        }
        return obj1 === obj2;
    }

    protected assertNotNull(obj1: any, message?: string): boolean {
        if (obj1 === null) {
            throw new Error((message ? '(' + message + ') ' : '') + 'Assertion error: ' + obj1 + ' expected, to be not null');
        }
        return obj1 !== null;
    }

    protected simulateClickEvent(element: Element, eventType?: string) {
        if ('createEvent' in document) {
            if (!eventType) {
                eventType = 'change';
            }
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            element.dispatchEvent(evt);
        }
    }

}
