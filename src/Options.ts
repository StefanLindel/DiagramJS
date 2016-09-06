import { Point } from './elements/BaseElements';

interface Options {
  canvas?: string;
  minWidth?: number;
  minHeight?: number;
  layout?: string;
  origin?: Point;       // x and y offset of rendered diagram
}

export default Options;
