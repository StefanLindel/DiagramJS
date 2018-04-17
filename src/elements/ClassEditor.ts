import {Graph} from './Graph';
import Options from '../Options';

export class ClassEditor extends Graph {
    constructor(json: any, options: Options) {
        if (!options ) {
            options = {};
        }
        options.canvas = options.canvas || 'canvas';
        // options.origin = options.origin || new Point(150, 45);
//            layout: "DagreLayout",
        if (!options.features) {
            options.features = {
                drag: true,
                editor: true,
                palette: true,
                select: true,
                zoom: true
            };
        }
        super(json, options);
    }
}
