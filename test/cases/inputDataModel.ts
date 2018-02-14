import {TestCase} from '../TestCase';
import {Control} from '../../src/Control';

export class InputDataModel extends TestCase {
    // execute(): Promise<boolean> {
    run() {
        const j1n1: Control = this.bridge.load({
            'class': 'input',
            'id': 'J1.N1',
            'property': 'number.value',
            'type': 'number'
        });

        const div: Control = this.bridge.load({
            'class': 'div',
            'id': 'J1.N2',
            'property': 'number.value'
        });

        j1n1.$view['value'] = 42;
        this.simulateClickEvent(j1n1.$view);
        this.assertEquals('42', div.$view.innerHTML);
        return true;
    }

    loadModel() {
        return true;
    }
}
