import {DiagramElement} from '../BaseElements';

export class SO extends DiagramElement {
    public static create(element: Object) {
        let result: SO = new SO();
        for (let key in element) {
            if (element.hasOwnProperty(key) === false) {
                continue;
            }
            result.withKeyValue(key, element[key]);

        }
        return result;
    }

    public withKeyValue(key: string, value: any): SO {
        if (key === 'typ') {
            this.property = value;
        } else if (key === 'x') {
            this.withPos(value, null);
        } else if (key === 'y') {
            this.withPos(null, value);
        } else if (key === 'width') {
            this.withSize(value, null);
        } else if (key === 'height') {
            this.withSize(null, value);
        } else {
            this[key] = value;
        }
        return this;
    }
}
