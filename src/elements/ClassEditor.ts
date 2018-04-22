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
        options.autoSave = options.autoSave || true;
        if (!options.features) {
            options.features = {
                drag: true,
                editor: true,
                palette: true,
                select: true,
                zoom: true,
                toolbar: true,
                import: true,
                properties: true,
                addnode: true,
                newedge: true
            };
        }
        super(json, options);
    }

    public setBoardStyle(value: string) {
        console.log(value);
        this.importFile.setBoardStyle(value);
    }
}
