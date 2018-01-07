import { Util } from '../../util';
import { Point } from '../BaseElements';
import { DiagramElement } from '../BaseElements';

export default class Method extends DiagramElement{

    // Public (+)
    // Private (-)
    // Protected (#)
    // Package (~)
    // Derived (/)
    // Static (underlined)

    private modifier : string;
    private name : string;
    private type : string;

    private params : string[];

    constructor(data : any | JSON){
        super();
        this.extractData(data);
    }

    private extractData(data: any | JSON) : void{
        if(!data){
            return;
        }

        if(data.type){
            this.type = data.type;
        }

        if(data.name){
            this.name = data.name;
        }

        if(data.modifier){
            this.modifier = data.modifier;
        }

        if(data.params){
            this.params = data.params;
        }

        if(!this.type && !this.name && !this.modifier){
            let dataSplitted = data.split(' ');

            if(dataSplitted && dataSplitted.length == 4){
                this.modifier = dataSplitted[0];
                this.name = dataSplitted[1];
                this.type = dataSplitted[3];
            }
        }
    }

    public toString() : string{
        return `${this.modifier} ${this.name} : ${this.type}`;
    }

    public getSVG() : Element{
        
        
        return null;
    }
}