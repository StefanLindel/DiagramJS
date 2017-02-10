export * from './edges';
export * from './nodes';
export * from "./BaseElements";

import Graph from "./Graph";
import Model from "./Model";

var module: any = <any>module;

module.exports = {
    Graph: ['type', Graph],
    Model: ['type', Model]
};