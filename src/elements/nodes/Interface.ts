import { Clazz } from "./index";
import { StereoType } from "./StereoType";

export class Interface extends StereoType{

    readonly INTERFACE : string = 'Interface';

    constructor(data : JSON | any){
        super(data);

        this.setStereoTyp(this.INTERFACE);
    }
}