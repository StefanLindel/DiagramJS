import { Edge } from './Edge';
import { Node } from '../nodes/Node';
import { Point } from '../BaseElements';

export class Generalisation extends Edge {

    public getSVG(): Element {
        let startPoint = this.$pointsNew[0];
        let startX = startPoint.x;
        let startY = startPoint.y;

        
        // set the startpoint lower
        startPoint.y = startY+12;

        let line = super.getSVG();

        let path = `M${startX} ${startY+2} L${startX+10} ${startY + 12} L${startX-10} ${startY+12} Z`;

        // draw white filled arrow
        let attr = {
            tag: 'path',
            d: path,
            stroke: 'black',
            'stroke-width': '3',
            fill: 'white'
          };

        this.$targetElement = this.createShape(attr);

        let group = this.createShape({ tag: 'g' });
        group.appendChild(line);
        group.appendChild(this.$targetElement);
        return group;
    }

    public redrawNewFn(startNode: Node) : void {

        super.redrawNewFn(startNode);

        console.log("redrawEdges in generalisation");

        let targetNodePos = this.$tNode.getPos();
        let sourceNodePos = this.$sNode.getPos();
        let isSrcHigherThanTarget = false;

        if (targetNodePos.y < sourceNodePos.y) {
            isSrcHigherThanTarget = true;
        }

        let startPoint = this.$pointsNew[0];
        let startX = startPoint.x;
        let startY = startPoint.y;

        let path;
        if(isSrcHigherThanTarget){
            path = `M${startX} ${startY+12} L${startX+10} ${startY} L${startX-10} ${startY} Z`;
            startPoint.y +=12;
        }
        else{
            path = `M${startX} ${startY-10} L${startX+10} ${startY} L${startX-10} ${startY} Z`;
            startPoint.y -=12;
        }

        // redraw the edge with the new position
        let pathOriginal: string = 'M';

        for (let i = 0; i < this.$pointsNew.length; i++) {
            let point: Point = this.$pointsNew[i];
            if (i > 0) {
                pathOriginal += 'L';
            }
            pathOriginal += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
        }


        // remove the pre last point (pointToCalcFrom), if there are at least 3 points

        this.$view.setAttributeNS(null, 'd', pathOriginal);


        this.$targetElement.setAttributeNS(null, 'd', path);
    }

}
