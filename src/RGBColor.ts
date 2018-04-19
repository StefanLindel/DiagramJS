// ################################## RGBColor ####################################################
export class RGBColor {
    public  ok: boolean;
    public r: number;
    public g: number;
    public b: number;

    constructor(value: string) {
        this.ok = false;
        if (value === 'none') {
            return;
        }
        let computedColor, div = document.createElement('div');
        div.style.backgroundColor = value;
        document.body.appendChild(div);
        computedColor = window.getComputedStyle(div).backgroundColor;
        // cleanup temporary div.
        document.body.removeChild(div);
        this.convert(computedColor);
    }
    public convert(value: any) {
        let values, regex = /rgb *\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)/;
        values = regex.exec(value);
        this.r = parseInt(values[1], 10);
        this.g = parseInt(values[2], 10);
        this.b = parseInt(values[3], 10);
        this.ok = true;
    }

    public toRGB(): string {return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')'; }
    public toHex(): string {
        return '#' + (this.r + 0x10000).toString(16).substring(3).toUpperCase() + (this.g + 0x10000).toString(16).substring(3).toUpperCase() + (this.b + 0x10000).toString(16).substring(3).toUpperCase();
    }
}
