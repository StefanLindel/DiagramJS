import {TestCase} from '../TestCase';

export class ExampleCase extends TestCase {
    protected run(): void {
        this.assertEquals(0,0);
        this.assertNotNull(0);
    }
}