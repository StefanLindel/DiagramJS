export default class Options {

  public layout: Object;
  public font: Object;
  public canvasid: string;
  public display: string;
  public raster: boolean;
  public propertyinfo: boolean;
  public cardinalityInfo: boolean;
  public buttons: Array<string>;
  public clearCanvas: boolean;
  private rotatetext: boolean;
  private linetyp: string;

  constructor() {
    this.display = 'svg';
    this.font = { 'font-size': '10px', 'font-family': 'Verdana' };
    this.layout = { name: 'Dagre', rankDir: 'TB', nodesep: 10 };	// Dagre TB, LR
    this.cardinalityInfo = true;
    this.propertyinfo = true;
    this.rotatetext = true;
    this.linetyp = 'center';
    this.buttons = ['HTML', 'SVG'];	// ['HTML', 'SVG', 'PNG', 'PDF']
  }

}
