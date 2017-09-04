import * as cases from './cases';
import {TestCase} from './TestCase';

export default class TestFramework {
    public cases: any;
    public runningCases: Promise<boolean>[] = [];
    public valid: TestCase[] = [];
    public failing: TestCase[] = [];
    private root: HTMLElement;

    constructor(root: HTMLElement) {
        this.root = root;
        this.cases = [];
        const caseNames = Object.keys(cases);
        for (var i = 0; i < caseNames.length; i++) {
            const testCase = cases[caseNames[i]];
            this.cases.push(testCase);
        }
    }


    public run() {
        // await Promise.resolve(() => {
        for (let testCase of this.cases) {
            const caseInstance = new testCase(this.root);
            caseInstance.init();
            const promise = caseInstance.execute();
            this.executeAndWait(promise, caseInstance);
            this.runningCases.push(promise);
        }
        // }
        // );
    }

    private executeAndWait(promise: boolean, caseInstance: any) {
        // return await promise.then((res: boolean) => {
        if (promise === true) {
            this.valid.push(caseInstance);
        } else {
            this.failing.push(caseInstance);
        }
        caseInstance.cleanup();
        // });
    }

    public report() {
        return {
            'valid': this.valid,
            'failing': this.failing
        };
    }
}