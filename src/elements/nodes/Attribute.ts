import { Util } from '../../util';
import { Point } from '../BaseElements';
import { DiagramElement } from '../BaseElements';

export default class Attribute extends DiagramElement{

    // Public (+)
    // Private (-)
    // Protected (#)
    // Package (~)
    // Derived (/)
    // Static (underlined)

    public modifier : string;
    public name : string;
    public type : string;

    constructor(data : any | JSON){
        super();
        this.extractData(data);
    }

    private extractData(data: any | JSON) : void{

        if(!data){
            return;
        }

        else if(data.type){
            this.type = data.type;
        }

        else if(data.name){
            this.name = data.name;
        }

        else if(data.modifier){
            this.modifier = data.modifier;
        }

        else{
            let dataSplitted = data.split(' ');

            if(dataSplitted){
                this.modifier = dataSplitted[0];
                this.name = dataSplitted[1] || '';
                this.type = dataSplitted[3] || '';
            }
        }
    }

    public updateAttribute(data: any | JSON) : void{
        this.extractData(data);
    }

    public toString() : string{
        return `${this.modifier} ${this.name} : ${this.type}`;
    }

    public getSVG() : Element{
        
        
        return null;
    }
}