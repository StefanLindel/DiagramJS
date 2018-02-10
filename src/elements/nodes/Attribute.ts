import { Util } from '../../util';
import { Point } from '../BaseElements';
import { DiagramElement } from '../BaseElements';
import ClazzProperty from './ClazzProperty';

export default class Attribute extends ClazzProperty {

    constructor(data: any | JSON) {
        super(data);
    }
}