import {TestCase} from '../TestCase';

export class ExampleCase extends TestCase {
    protected run(): boolean {
        this.assertEquals(0, 0);
        this.assertNotNull(0);
        return true;
    }
    protected loadModel() {
        return true;
    }
}
