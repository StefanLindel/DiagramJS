/**
 * Created by Stefan on 06.03.2017.
 */
import Data from './Data';
import {Clazz} from "./elements/nodes/Clazz";

//export default class Data {
//    public values = {};
//    id: string;
//    $listener: Control[] = [];
//    property: string;
namespace  UML{
    export class Clazz extends Data {
        public static NAME:string = 'NAME';
        public static ATTRIBUTES:string = 'ATTRIBUTES';

        public getName() {
            return this.values[Clazz.NAME];
        }

        public setName(newValue) {
            this.setValue(Clazz.NAME, newValue);
        }

        public getAttributes() {
            return this.values[Clazz.ATTRIBUTES];
        }

        public addToAttributes(newValue) {
            this.addTo(Clazz.ATTRIBUTES, newValue);
        }
        public removeFromAttributes(newValue) {
            this.removeFrom(Clazz.ATTRIBUTES, newValue);
        }


    }
    export class GraphAttribute extends Data {

    }
    export class GraphMethods extends Data {

    }
}