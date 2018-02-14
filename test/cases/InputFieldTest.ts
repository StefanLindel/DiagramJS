import {TestCase} from '../TestCase';
import {Control} from '../../src/Control';

export class InputFieldTest extends TestCase {
    // execute(): Promise<boolean> {
    run() {
        const j1n1: Control = this.bridge.load({
            'class': 'input',
            'id': 'J1.N1',
            'property': 't1.room',
            'type': 'text'
        });
        const j1n2: Control = this.bridge.load({
            'class': 'input',
            'id': 'J1.N2',
            'property': 't3.room',
            'type': 'number'
        });
        // same object, other prop (but existing)
        const j1n3: Control = this.bridge.load({
            'class': 'input',
            'id': 'J1.N3',
            'property': 't3.state',
            'type': 'text'
        });

        this.assertEquals(3, this.control.children.length);
        this.assertEquals('Heyl', (<HTMLInputElement>j1n1.$view).value);
        this.assertEquals('1603', (<HTMLInputElement>j1n2.$view).value);
        this.assertEquals('ok', (<HTMLInputElement>j1n3.$view).value);

        // Model loaded afterwards
        const j2n1: Control = this.bridge.load({
            'class': 'input',
            'id': 'J2.N1',
            'property': 't2.room',
            'type': 'text'
        });

        this.bridge.load({
            id: 't2',
            class: 'talk',
            prop: {
                room: 'Heyl',
                time: '18:15',
            }
        });

        this.assertEquals('Heyl', (<HTMLInputElement>j2n1.$view).value, 'update afterwards');

        // same object, other prop (not existing)
        // TODO: discuss what to do in this case..
        const s1o1: Control = this.bridge.load({
            'class': 'input',
            'id': 'S1.O1',
            'property': 's1.text',
            'type': 'text',
            'value': 'testtext'
        });
        // same object, other prop (but existing)
        const s1o2: Control = this.bridge.load({
            'class': 'input',
            'id': 'S1.O2',
            'property': 's1.number',
            'type': 'number',
            'value': '42'
        });
        this.assertEquals('testtext', (<HTMLInputElement>s1o1.$view).value);
        this.assertEquals('42', (<HTMLInputElement>s1o2.$view).value);
        return true;
    }

    loadModel() {
        this.bridge.load({
            id: 't1',
            class: 'talk',
            prop: {
                room: 'Heyl',
                day: 'Monday',
                talk: '01. Meier',
                state: 'ok',
                time: '18:15',
                comment: '',
                no: '',
                slides: '',
                html: '',
                Author: '',
                'Peer Info': '',
                Explorer: 'Explorer'
            }
        });

        this.bridge.load({
            id: 't3',
            class: 'talk',
            prop: {
                room: '1603',
                day: 'Tuesday',
                talk: '03. Peter',
                state: 'ok',
                comment: '',
                no: '',
                slides: '',
                html: '',
                Author: '',
                'Peer Info': '',
                Explorer: 'Explorer',
                time: '20:15'
            }
        });
        return true;
    }
}
