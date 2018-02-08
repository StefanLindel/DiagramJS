import { Clazz } from "./index";
import { StereoType } from "./StereoType";

export class Abstract extends StereoType{

    readonly $ABSTRACT : string = 'Abstract';

    constructor(data : JSON | any){
        super(data);
        this.$defaulEdgeType = 'Generalisation';

        this.setStereoTyp(this.$ABSTRACT);
    }
}