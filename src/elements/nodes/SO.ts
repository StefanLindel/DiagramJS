import { DiagramElement, Point } from '../BaseElements';

export class SO extends DiagramElement {
  public draw(typ?:string):HTMLElement {return null;}
  public getEvent():string[] {return [];}

  constructor(owner) {
    super(owner);
  }

  public init(data: Object) : SO {
    this.property = "SO";
    return this;
  }
  public getSVG() {

  }

  public withKeyValue(key:string, value:any) : SO {
    if(key === "typ") {
      this.property = value;
    }else  if(key==="x") {
      this.withPos(value, null);
    }else  if(key==="y") {
      this.withPos(null, value);
    }else  if(key==="width") {
      this.withSize(value, null);
    }else  if(key==="height") {
      this.withSize(null, value);
    } else {
      this[key] = value;
    }
    return this;
  }
  public event(source:DiagramElement, typ:string, value:Object):boolean {
    return true;
  }
  public static create(element:Object) {
    var result:SO = new SO(null);
    for(var key in element) {
      if(element.hasOwnProperty(key) === false) {
        continue;
      }
      result.withKeyValue(key, element[key]);

    }
    return result;
  }
}
