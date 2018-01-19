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

    public modifier : string = '+';
    public name : string;
    public type : string = 'void';

    public params : string[];

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

        else if(data.name){
            this.name = data.name;
        }

        else if(data.modifier){
            this.modifier = data.modifier;
        }

        else if(data.params){
            this.params = data.params;
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

    public updateMethod(data: any | JSON) : void{
        this.extractData(data);
        this.updateTextOfView();
    }

    public updateModifier(modifier : string) : void {
        this.modifier = modifier;
        this.updateTextOfView();
    }

    public updateType(type : string) : void {
        this.type = type;
        this.updateTextOfView();
    }

    public updateName(name : string) : void {
        this.name = name;
        this.updateTextOfView();
    }

    public updateTextOfView(){
        this.$view.textContent = this.toString();
    }

    public toString() : string{
        let functionName = `${this.modifier} ${this.name}`;

        if(this.type){
            functionName = functionName + ' : ' + this.type;
        }

        return functionName;
    }

    public getSVG() : Element{
        let methodText = {
            tag: 'text',
            'text-anchor': 'start',
            'alignment-baseline': 'middle',
        };

        let methodSvg = Util.createShape(methodText);
        methodSvg.textContent = this.toString();
        methodSvg.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzMethod');
        
        this.$view = methodSvg;

        return methodSvg;
    }
}