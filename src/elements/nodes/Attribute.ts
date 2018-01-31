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

    public modifier : string = '+';
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

            // e.g. name : string or name:string
            let dataSplitted = data.split(':');

            if(dataSplitted && dataSplitted.length === 2){

                // modifer (and or) name
                let modifierAndNameSplitted = dataSplitted[0].trim();

                // first char is +, - or #
                let firstChar = modifierAndNameSplitted[0];
                if(firstChar === '+' || firstChar === '-' || firstChar === '#'){
                    this.modifier = firstChar;
                    this.name = modifierAndNameSplitted.substring(1, modifierAndNameSplitted.length).trim();
                }
                else{
                    this.name = modifierAndNameSplitted;
                }

                this.type = dataSplitted[1] || 'string';
            }
        }
    }

    public updateAttribute(data: any | JSON) : void{
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
        return `${this.modifier} ${this.name} : ${this.type}`;
    }

    public getSVG() : Element{
        let attrText = {
            tag: 'text',
            'text-anchor': 'start',
            'alignment-baseline': 'middle',
        };

        let attrSvg = Util.createShape(attrText);
        attrSvg.textContent = this.toString();
        attrSvg.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzAttribute');
        
        this.$view = attrSvg;

        return attrSvg;
    }
}