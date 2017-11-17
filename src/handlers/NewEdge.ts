import {HandlerPlugin} from "./HandlerPlugin";
import {DiagramElement} from "../elements/BaseElements";
import {Graph} from '../elements/Graph';
import {Util} from '../util'
import {Clazz} from '../elements/nodes/Clazz';

export class NewEdge implements HandlerPlugin {
    private graph : Graph;
    private svgRoot: SVGSVGElement;
    private svgEdgeNipple : SVGElement;

    private isDrawLine = false;

    private x : number;
    private y : number;

    constructor(graph:Graph){
        this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        this.graph = graph;
    }

    public handle(event: Event, element: DiagramElement): boolean {

        if(this.svgRoot !== <SVGSVGElement><any>document.getElementById('root')){
            this.svgRoot = <SVGSVGElement><any>document.getElementById('root');
        }

        switch(event.type){
            case 'mousedown' : 
                this.start(event, element);
                console.log('#newEdge: mousedown');
                break;

            case 'mousemove' :
                console.log('#newEdge: mousemove');
                if(element instanceof Clazz){
                    var clazz = <Clazz>element;

                    console.log(clazz.getNipple());
                }
                this.drawEdge(event, element);
                break;

            case 'mouseleave' : 
                this.highlightNipple(false);
                console.log('#newEdge: mouseleave');
                break;

            case 'mouseup' : 
                this.highlightNipple(false);
                console.log('#newEdge: mouseup');
                break;

            default: break;
        }

        return true;
    }

    private drawEdge(evt : Event|any, element : DiagramElement) : void{
        if(this.x && this.y){
            let lineToX =evt.layerX;
            let lineToy =evt.layerY;

            let path =  `M${this.x} ${this.y} L${lineToX} ${lineToy}`;

            let attr = {
                tag: 'path',
                id : 'newLine',
                d: path,
                stroke: 'black',
                'stroke-width': '3',
                fill: 'none'
            };
            let shape = Util.createShape(attr);
            
            this.svgRoot.appendChild(shape);
        }
    }

    private start(evt : Event|any, element : DiagramElement) : void{

        // if(element.id === 'RootElement'){
        //     this.highlightNipple(false);
        //     this.svgEdgeNipple = undefined;
        //     return;
        // }

        this.svgEdgeNipple = <SVGGElement>element.$view.childNodes[1];
        
        let x, y, width, height;
        x =  parseInt(this.svgEdgeNipple.attributes[0].value);
        y =  parseInt(this.svgEdgeNipple.attributes[1].value);
        width = 8;
        height = 8;

        if((evt.layerX >= x && evt.layerX <= (x+width))
            && evt.layerY >= y && evt.layerY <= (y+height)){

                this.x = x;
                this.y = y;

                this.highlightNipple(true);
                this.isDrawLine = true;
                
                return;
        }

        this.x = undefined;
        this.y = undefined;
        this.svgEdgeNipple = undefined;
    }

    private highlightNipple(enabled : boolean) : void{
        if(this.svgEdgeNipple){
            let rgb = enabled ? 'rgb(255, 160, 51)' : 'rgb(0, 0, 0)';
            this.svgEdgeNipple.setAttributeNS(null, 'fill', rgb);
        }
    }

    public isEnable(): boolean {
        return true;
    }
}