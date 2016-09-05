export default class Symbol extends Node {
  public $heightMax: number = 0;
  public $heightMin: number = 0;

  constructor(typ: string) {
    super(typ, typ);
  }

  public draw(typ?: string): HTMLElement {
    return SymbolLibary.draw(this);
  }

}
