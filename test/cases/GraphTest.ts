import {TestCase} from '../TestCase';
import {Graph} from '../../src/elements';

export abstract class GraphTest extends TestCase {
    protected graph: Graph;
    public run(): boolean {
        // DO NOTHING
        this.assertNotNull(this.graph);
        return this.runGraph();
    }

    public abstract runGraph(): boolean;

    public loadModel(): boolean {
        this.graph = this.bridge.load({className: 'graph'});
        return true;
    }

    public close(): boolean {
        // if (this.graph.$owner) {
        //     this.graph.$owner.removeChild(this.graph);
        // }
        // this.bridge.removeChild(this.graph);
        document.body.removeChild(this.graph.$view);
        return true;
    }
}
