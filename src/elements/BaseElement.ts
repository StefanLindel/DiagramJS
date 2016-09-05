import Point from './Point';

interface BaseElement {
  draw(typ: string): HTMLElement;
  getEvent(): string[];
  getPos(): Point;
  getSize(): Point;
  getTyp(): string;
  withSize(x: number, y: number): BaseElement;
  getCenter(): Point;
  fireEvent(source: BaseElement, typ: string, value: Object): void;
  event(source: BaseElement, typ: string, value: Object): boolean;
}

export default BaseElement;
