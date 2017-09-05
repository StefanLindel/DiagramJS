import {TestCase} from '../TestCase';

export default class InputFieldTest extends TestCase {
    // execute(): Promise<boolean> {
    run() {
        // return <Promise<boolean>> Promise.resolve(()=> {
        this.loadModel();
        this.loadTextInput();
        this.assertEquals(2, this.control.children.length);
        // });
    }

    private loadTextInput() {
        this.bridge.load({
            'class': 'input',
            'id': 'J1.N1',
            'property': 't3.room',
            'type': 'number'
        });

        this.bridge.load({
            'class': 'input',
            'id': 'J1.N2',
            'property': 't1.room',
            'type': 'number'
        });
    }

    private loadModel() {
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
            id: 's1',
            class: 'speech',
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


        // this.bridge.load({id: 't1', upd: {talk: '01. Schulze'}});
        this.bridge.load({id: 'r2', class: 'room', prop: {name: 'Heyl'}});
        this.bridge.load({
            id: 't2',
            class: 'talk',
            prop: {
                room: 'Heyl',
                day: 'Monday',
                talk: '02. Schmidt',
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
    }
}