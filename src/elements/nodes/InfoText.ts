//				######################################################### Info #########################################################
import {DiagramElement, Point} from "../BaseElements";
import {Util} from "../../util";
import {Node} from "./Node";
import {EventBus} from "../../EventBus";
export class InfoText extends Node {
    custom:boolean;
    private cardinality:string;
    private $angle:number;

    constructor(info:any, counter:number) {
        super(info);
        if (typeof (info) === "string") {
            this.id = info;
        } else {
            if (info.property) {
                this.property = info.property;
            }
            if (info.cardinality) {
                this.cardinality = info.cardinality;
            }
            this.id = info.id;
        }
        this.isDraggable = true;
    }

    public getSVG(draw ?:boolean):HTMLElement {
        let text:string = this.getText(), child, group:Element, i:number, items:Array<string> = text.split("\n");
        if (text.length < 1) {
            return null;
        }
        if (items.length > 1) {
            group = Util.create({tag: "g", "class": "draggable", rotate: this.$angle, model: this});
            for (i = 0; i < items.length; i += 1) {
                let pos:Point = this.getPos();
                child = Util.create({
                    tag: "text",
                    $font: true,
                    "text-anchor": "left",
                    "x": pos.x,
                    "y": pos.y
                    + (this.getSize().y * i)
                });
                child.appendChild(document.createTextNode(items[i]));
                group.appendChild(child);
            }
            let newEvent:Event = new Event(EventBus.CREATE);
            newEvent["eventtype"] = EventBus.CREATE;
            newEvent["source"] = this;
            newEvent["$graphModel"] = group;
            if(group != null) {
                newEvent["id"] = (<any>group).getId();
            }
            this.fireEvent(newEvent);
            return <HTMLElement>group;
        }
        let pos:Point = this.getPos();
        group = Util.create({
            tag: "text",
            "#$font": true,
            "text-anchor": "left",
            "x": pos.x,
            "y": pos.y,
            value: text,
            "id": this.id,
            "class": "draggable InfoText",
            rotate: this.$angle,
            model: this
        });
        let newEvent:Event = new Event(EventBus.CREATE);
        newEvent["eventtype"] = EventBus.CREATE;
        newEvent["source"] = this;
        newEvent["$graphModel"] = group;
        if(group != null) {
            newEvent["id"] = (<any>group).getId();
        }
        this.fireEvent(newEvent);
        return <HTMLElement>group;
    };

    public drawHTML(draw?:boolean):HTMLElement {
        let text:string = this.getText(), info:HTMLElement;
        info = <HTMLElement>Util.create({tag: "div", $font: true, model: this, "class": "EdgeInfo", value: text});
        if (this.$angle !== 0) {
            let style:any = info.style;
            style.transform = "rotate(" + this.$angle + "deg)";
            style.msTransform = style.MozTransform = style.WebkitTransform = style.OTransform = "rotate(" + this.$angle + "deg)";
        }
        let pos:Point = this.getPos();
        let newEvent:Event = new Event(EventBus.CREATE);
        newEvent["eventtype"] = EventBus.CREATE;
        newEvent["source"] = this;
        newEvent["$graphModel"] = info;
        Util.setPos(info, pos.x, pos.y);
        this.fireEvent(newEvent);
        return info;
    }

    public getText():string {
        let isProperty:boolean, isCardinality:boolean, infoTxt:string = "", graph:any = this.$owner;
        isCardinality = graph.typ === "classdiagram" && graph.options.CardinalityInfo;
        isProperty = graph.options.propertyinfo;

        if (isProperty && this.property) {
            infoTxt = this.property;
        }
        if (isCardinality && this.cardinality) {
            if (infoTxt.length > 0) {
                infoTxt += "\n";
            }
            if (this.cardinality.toLowerCase() === "one") {
                infoTxt += "0..1";
            } else if (this.cardinality.toLowerCase() === "many") {
                infoTxt += "0..*";
            }
        }
        if (this["counter"] > 0) {
            infoTxt += " (" + this["counter"] + ")";
        }
        return infoTxt;
    }

    public initInfo():string {
        let root:any = this.$owner.getRoot();
        if (!root.$graphModel.options.CardinalityInfo && !root.$graphModel.options.propertyinfo) {
            return null;
        }
        let infoTxt:string = this.getText();
        if (infoTxt.length > 0) {
            Util.sizeOf(infoTxt, root, this);
        }
        return infoTxt;
    }
}