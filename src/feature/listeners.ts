import DragListener from './DragListener';
import { Node } from '../elements/nodes';

let listeners: DragListener[] = [];

export function addListener(element: Element, node: Node) {
  listeners.push(new DragListener(element, node));
}

export function isDragging(): boolean {
  for (let listener of listeners) {
    if (listener.isDragging()) {
      return true;
    }
  }
  return false;
}
