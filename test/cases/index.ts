import {InputDataModel} from './InputDataModel';
import {ExampleCase} from './ExampleCase';
import {InputFieldTest} from './InputFieldTest';
import {FormTest} from './FormTest';

export * from './InputFieldTest';
export * from './ExampleCase';
export * from './InputDataModel';
export * from './FormTest';

let inputDataModel = new InputDataModel(null);
let model = new ExampleCase(null);
let inputField = new InputFieldTest(null);
let formTest = new FormTest(null);
