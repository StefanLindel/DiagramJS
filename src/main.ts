export {Point} from './elements/BaseElements';
export {Bridge, DelegateAdapter} from './Bridge';
export {Graph} from './elements/Graph';
export * from './elements/nodes';
export * from './elements/edges';
export * from './adapters';
export * from './UML';
import {Point} from './elements/BaseElements';
import {Graph} from './elements/Graph';
import {Bridge} from './Bridge';
import {Util} from './util';
import {Toolbar} from './Toolbar';
import * as nodes  from './elements/nodes';
import * as edges from './elements/edges';

if (!window['Point']) {
    window['Point'] = Point;
    window['Graph'] = Graph;
    window['bridge'] = new Bridge();
    window['Util'] = Util;
    window['Clazz'] = nodes.Clazz;
    window['Edge'] = edges.Edge;
    window['SymbolLibary'] = nodes.SymbolLibary;
}
