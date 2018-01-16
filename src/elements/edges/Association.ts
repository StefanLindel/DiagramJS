import { Edge } from './Edge';
import { Direction } from './index';

export abstract class Association extends Edge {

    protected $diamond: Element;

    public getSVG(): Element {
        let endPoint = this.$points[this.$points.length - 1];
        // set the startpoint lower
        endPoint.target.y = endPoint.target.y - 20;

        let startX = endPoint.target.x;
        let startY = endPoint.target.y;
        let line = super.getSVG();

        let path = `M${startX} ${startY} L${startX + 6} ${startY + 10} L${startX} ${startY + 20} L${startX - 6} ${startY + 10} Z`;

        // draw white filled arrow
        let attr = {
            tag: 'path',
            d: path,
            stroke: 'black',
            'stroke-width': '3'
        };

        this.$diamond = this.createShape(attr);

        let group = this.createShape({ tag: 'g' });
        group.appendChild(line);
        group.appendChild(this.$diamond);
        return group;
    }

    public redraw() : void{
        let targetNodePos = this.$tNode.getPos();
        let sourceNodePos = this.$sNode.getPos();

        let targetNodeSize = this.$tNode.getSize();
        let sourceNodeSize = this.$sNode.getSize();

        let mx, my, lx, ly: number;

        let isSrcHigherThanTarget = false;

        if (targetNodePos.y < sourceNodePos.y) {
            ly = targetNodePos.y + targetNodeSize.y;
            my = sourceNodePos.y+20;
            isSrcHigherThanTarget = true;
        }
        else {
            ly = targetNodePos.y;
            my = (sourceNodePos.y + sourceNodeSize.y) + 20;
        }

        mx = sourceNodePos.x + sourceNodeSize.x / 2;
        lx = targetNodePos.x + targetNodeSize.x / 2;

        let diff;
        if (mx > targetNodePos.x + targetNodeSize.x && sourceNodePos.x <= targetNodePos.x + targetNodeSize.x) {
            diff = (mx - (targetNodePos.x + targetNodeSize.x));
            mx -= diff;
        }

        else if (sourceNodePos.x > targetNodePos.x + targetNodeSize.x) {
            let diff = sourceNodePos.x - (targetNodePos.x + targetNodeSize.x);
            mx = sourceNodePos.x;
            lx += diff;

            if (lx >= (targetNodePos.x + targetNodeSize.x)) {
                lx = (targetNodePos.x + targetNodeSize.x);
            }
        }
        else if (targetNodePos.x > mx && targetNodePos.x <= sourceNodePos.x + sourceNodeSize.x) {
            diff = (lx - (sourceNodePos.x + sourceNodeSize.x));
            mx += diff;
        }

        else if (sourceNodePos.x + sourceNodeSize.x < targetNodePos.x) {
            let diff = targetNodePos.x - (sourceNodePos.x + sourceNodeSize.x);
            mx = sourceNodePos.x + sourceNodeSize.x;
            lx -= diff;

            if (lx <= targetNodePos.x) {
                lx = targetNodePos.x;
            }
        }

        this.$view.setAttribute('d', `M${mx} ${my} L${lx} ${ly} Z`);

        // reset points
        this.clearPoints();
        this.addLine(mx, my);
        this.addLine(lx, ly);
        

        let endPoint = this.$points[this.$points.length-1];
        let startX = endPoint.getPos().x;
        let startY = endPoint.getPos().y;

        let path;
        if(isSrcHigherThanTarget){
            path = `M${startX} ${startY+20} L${startX + 6} ${startY + 30} L${startX} ${startY + 40} L${startX - 6} ${startY + 30} Z`;
        }
        else{
            path = `M${startX} ${startY-20} L${startX + 6} ${startY - 30} L${startX} ${startY - 40} L${startX - 6} ${startY - 30} Z`;
        }
        this.$diamond.setAttributeNS(null, 'd', path);
    }
}
