/**
 * Created by Stefan on 06.03.2017.
 */
import Data from './Data';

// export default class Data {
//    public values = {};
//    id: string;
//    $listener: Control[] = [];
//    property: string;
export namespace UML {
    export class Clazz extends Data {
        public static NAME: string = 'name';
        public static ATTRIBUTES: string = 'attributes';
        public static METHODS: string = 'methods';
        private property: string;

        constructor() {
            super();
            this.property = 'Clazz';
        }

        public getName() {
            return this.prop[Clazz.NAME];
        }

        public setName(newValue: string) {
            this.setValue(Clazz.NAME, newValue);
        }

        public getAttributes() {
            return this.prop[Clazz.ATTRIBUTES];
        }

        public addToAttributes(newValue: string) {
            this.addTo(Clazz.ATTRIBUTES, newValue);
        }

        public removeFromAttributes(newValue: string) {
            this.removeFrom(Clazz.ATTRIBUTES, newValue);
        }
    }

    export class Attribute extends Data {
        private property: string;

        constructor() {
            super();
            this.property = 'Attribute';
        }

        public getName() {
            return this.prop[Clazz.NAME];
        }

        public setName(newValue: string) {
            this.setValue(Clazz.NAME, newValue);
        }
    }

    export class Methods extends Data {

    }
}

window['UML'] = UML;
