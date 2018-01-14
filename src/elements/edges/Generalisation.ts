import { Edge } from './Edge';

export class Generalisation extends Edge {

    public getSVG(): Element {
        let startPoint = this.$points[0];
        let startX = startPoint.getPos().x;
        let startY = startPoint.getPos().y;

        
        // set the startpoint lower
        startPoint.target.y = startY+12;

        let line = super.getSVG();

        let path = `M${startX} ${startY+2} L${startX+10} ${startY + 12} L${startX-10} ${startY+12} Z`;

        this.id = super.getId() + '-arrow';

        // draw white filled arrow
        let attr = {
            tag: 'path',
            id: this.id,
            d: path,
            stroke: 'black',
            'stroke-width': '3',
            fill: 'white'
          };

        let generalisation = this.createShape(attr);

        let group = this.createShape({ tag: 'g' });
        group.appendChild(line);
        group.appendChild(generalisation);
        return group;
    }

    public redraw() {

        let targetNodePos = this.$tNode.getPos();
        let sourceNodePos = this.$sNode.getPos();

        let targetNodeSize = this.$tNode.getSize();
        let sourceNodeSize = this.$sNode.getSize();

        let mx, my, lx, ly: number;

        let isSrcHigherThanTarget = false;

        if (targetNodePos.y < sourceNodePos.y) {
            ly = targetNodePos.y + targetNodeSize.y;
            my = sourceNodePos.y-14;
            isSrcHigherThanTarget = true;
        }
        else {
            ly = targetNodePos.y;
            my = (sourceNodePos.y + sourceNodeSize.y) + 12;
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
        

        let startPoint = this.$points[0];
        let startX = startPoint.getPos().x;
        let startY = startPoint.getPos().y;

        let path;
        if(isSrcHigherThanTarget){
            path = `M${startX} ${startY+12} L${startX+10} ${startY} L${startX-10} ${startY} Z`;
        }
        else{
            path = `M${startX} ${startY-10} L${startX+10} ${startY} L${startX-10} ${startY} Z`;
        }

        let generalisationArrow = document.getElementById(this.id);
        generalisationArrow.setAttributeNS(null, 'd', path);
    }

}
