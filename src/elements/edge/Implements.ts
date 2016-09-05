import Line from '../Line';
import Generalisation from './Generalisation';

export default class Implements extends Generalisation {

  constructor() {
    super();
    this.typ = 'Implements';
    this.$lineStyle = Line.FORMAT.DOTTED;
  }

}
