'use strict';
import {Point} from './elements/BaseElements';

interface Options {
    canvas?: string;
    minWidth?: number;
    minHeight?: number;
    layout?: string;
    origin?: Point;       // x and y offset of rendered diagram
    CardinalityInfo?: string;
    features?: {
        editor?: boolean,
        drag?: boolean,
        palette?: boolean,
        select?: boolean,
        zoom?: boolean,
        addnode?: boolean,
        properties?: boolean,
        import?: boolean
    };
}

export default Options;
