import {TestCase} from '../TestCase';

export class FormTest extends TestCase {

    protected getElement(id: string): HTMLElement {
        return document.getElementById(id);
    }

    protected run(): void {
        var json = {
            id: 't1form',
            property: 't1',
            class: 'form',
            method: 'get',

            elements: [
                {id: 'Label1', class: 'label', textContent: 'Talk:'},
                {id: 'testid1', name: 'testid1', property: 'talk'},
                {class: 'br'},
                {id: 'Label2', class: 'label', textContent: 'Room:'},
                {id: 'testid2', name: 'testid2', property: 'room'},
                {class: 'br'},
                {id: 'Label3', class: 'label', textContent: 'Day:'},
                {id: 'testid3', name: 'testid3', property: 'day'},
                {class: 'br'},
                {id: 'testid4', name: 'testid4', property: 'time', type: 'time'},
                {id: 'testid5', name: 'testid5', property: 'mail', type: 'mail'},
                {id: 'testid6', name: 'testid6', property: 'state', pattern: '^(ok|no)$'},
                {id: 'btn', value: 'test', type: 'submit'},
                {id: 'btn2', value: 'Button', type: 'button'}
            ]
        };
        var t1formId = this.bridge.load(json);

        this.assertEquals(14, t1formId.$view.children.length);

        const json2 = {
            id: 't1',
            class: 'talk',
            prop: {
                room: 'Heyl',
                time: '20:15',
                mail: 'test@host.de',
                day: 'Monday',
                talk: '01. Meier',
                state: 'ok',
                comment: '',
                no: '',
                slides: '',
                html: '',
                Author: '',
                'Peer Info': '',
                Explorer: 'Explorer'
            }
        };
        this.bridge.load(json2);


        this.assertEquals('Talk:', (<HTMLLabelElement>this.getElement('Label1')).innerText);
        this.assertEquals(json2.prop.talk, (<HTMLInputElement>this.getElement('testid1')).value);

        const json3 = {
            id: 't2',
            class: 'talk',
            prop: {
                room: 'Heyl',
                day: 'Tuesday',
                mail: 'test2@host.de',
                talk: '02. Schmidt',
                state: 'ok',
                comment: '',
                no: '',
                slides: '',
                html: '',
                Author: '',
                'Peer Info': '',
                Explorer: 'Explorer',
                time: '21:15'
            }
        };
        this.bridge.load(json3);

//    var t1control = bridge.controls[t1formId];
//    t1control.setProperty("t1");

        t1formId.setProperty('t2');
    }
}