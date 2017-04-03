import {Node} from "./Node";
import {Random} from "../../layouts/Random";
/**
 * Created by Stefan on 29.03.2017.
 */

export class Dice extends Node {
    private value: number;
    private max: number = 6;
    private $animation: SVGElement;
    private $zoom: number = 0.6;
    private $border: number = 0.2;

    constructor(data: JSON | string | Object | any) {
        super(data);
        this.withSize(100, 100);
    }

    public setNumber(number: number) {
        this.value = number;
        this.refresh();
    }

    public refresh() {
        if (this.$view) {
            this.reset();
            let group = this.createPointValue();
            if (group) {
                this.$view.appendChild(group);
            }
        }
    }

    public reset() {
        if (this.$view) {
            while (this.$view.children.length > 1) {
                if(this.$view.children.item(this.$view.children.length - 1).tagName!== "animateTransform") {
                    console.log(this.$view.children.item(this.$view.children.length - 1));
                    this.$view.removeChild(this.$view.children.item(this.$view.children.length - 1));
                }else {
                    break;
                }
            }
        }
    }

    public getSVG(): Element {
        let pos = this.getPos();
        let size = this.getSize();
        let dice: SVGElement = <SVGElement>this.createShape({tag: 'g'});
        const attr = {
            tag: 'rect',
            x: pos.x + size.x * this.$border,
            y: pos.y + size.y * this.$border,
            rx: 4,
            ry: 4,
            height: size.y * this.$zoom,
            width: size.x * this.$zoom,
            style: 'fill:white;stroke:black;stroke-width:2'
        };
        dice.appendChild(this.createShape(attr));

        let group = this.createPointValue();
        if (group) {
            dice.appendChild(group);
        }

        this.$view = dice;
        return dice;
    }

    public animationTimeout(newValues: number[]) {
        if(newValues.length>0) {
            let newValue = newValues.shift();
            this.setNumber(newValue);
            let that=this;
            setTimeout(function() {that.animationTimeout(newValues)}, 100);
        }
    }

    public roll() {
        this.startAnimation();
        let values:number[]=[];
        let i:number;
        for(i=1;i<this.max;i++) {
            values.push(i);
        }
        for(i=this.max;i>0;i--) {
            values.push(i);
        }
        let that=this;
        values.push( Math.floor(Math.random() * this.max)+1 );
        setTimeout(function() {that.animationTimeout(values)}, 100);
    }
    public startAnimation() {
        if(this.$animation) {
            return;
        }
        let center = this.getPos().x+this.getSize().x /2;
        const attr = {
            tag: 'animateTransform',
            attributeType: "xml",
            attributeName:"transform",
            type:"rotate",
            dur: "1s",
            repeatCount:"1",
            from:"0 "+center+" "+center,
            to:"360 "+center+" "+center
        };
        this.$animation = <SVGElement>this.createShape(attr);
        this.$view.appendChild(this.$animation);
    }

    public stopAnimation() {
        if(this.$animation) {
            this.$view.removeChild(this.$animation);
            this.$animation = null;
        }
    }

    public createPointValue() :SVGElement {
        if (this.value == 1) {
           return this.getCircle(2, 2);
        } else if (this.value == 2) {
            return this.getCircle(1, 1, 3, 3);
        } else if (this.value == 3) {
            return this.getCircle(1, 1, 2, 2, 3, 3);
        } else if (this.value == 4) {
            return this.getCircle(1, 1, 1, 3, 3, 1, 3, 3);
        } else if (this.value == 5) {
            return this.getCircle(1, 1, 1, 3, 2, 2, 3, 1, 3, 3);
        } else if (this.value == 6) {
            return this.getCircle(1, 1, 1, 2, 1, 3, 3, 1, 3, 2, 3, 3);
        } else if (this.value == 7) {
            return this.getCircle(1, 1, 1, 2, 1, 3, 2, 2, 3, 1, 3, 2, 3, 3);
        } else if (this.value == 8) {
            return this.getCircle(1, 1, 1, 2, 1, 3, 2, 1, 2, 3, 3, 1, 3, 2, 3, 3);
        } else if (this.value == 9) {
            return this.getCircle(1, 1, 1, 2, 1, 3, 2, 1, 2, 2, 2, 3, 3, 1, 3, 2, 3, 3);
        }
        return null;
    }

    private getCircle(...values:number[]) : SVGElement {
        if (values.length % 2 > 0) {
            return null;
        }
        let size = this.getSize();
        let pos = this.getPos();
        //FIXME let group:SVGElement = <SVGElement>this.createShape({tag: 'g', transform: 'translate(0 0)', height: size.y, width: size.x});
        let group:SVGElement = <SVGElement>this.createShape({tag: 'g'});


        for (let i: number = 0; i < values.length; i += 2) {
            group.appendChild(this.createCircle(values[i], values[i + 1]));
        }
        return group;
    }
    private createCircle(x:number, y:number) : SVGElement {
        let size = this.getSize();
        let radius = size.x / 10*this.$zoom;
        let border = size.y*this.$border;
        let zoom = size.y*this.$zoom;
        const attr = {
            tag: 'circle',
            r : radius,
            cx: (size.x*this.$zoom * x) / 4 + border,
            cy: (size.y*this.$zoom * y) / 4 + border,
            stroke:"black",
            "stroke-width":"3",
            fill:"red",
            style: 'fill:black;stroke:black;stroke-width:2'
        };
        return <SVGElement>this.createShape(attr);
    }
}