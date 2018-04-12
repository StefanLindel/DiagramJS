import {Point} from './elements/BaseElements';

export default interface Options {
    canvas?: string;
    minWidth?: number;
    minHeight?: number;
    layout?: string;
    origin?: Point;       // x and y offset of rendered diagram
    autoSave?: boolean;
    features?: {
        editor?: boolean,
        drag?: boolean,
        palette?: boolean,
        select?: boolean,
        zoom?: boolean,
        addnode?: boolean,
        properties?: boolean,
        import?: boolean,
        toolbar?: boolean,
        newedge?: boolean
    };
}
