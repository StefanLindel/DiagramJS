import { Edge } from './Edge';
import { Direction } from './index';
import { Node } from '../nodes/Node';

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

    public redrawNewFn(startNode: Node) : void {

        super.redrawNewFn(startNode);

        let targetNodePos = this.$tNode.getPos();
        let sourceNodePos = this.$sNode.getPos();
        let isSrcHigherThanTarget = false;

        if (targetNodePos.y < sourceNodePos.y) {
            isSrcHigherThanTarget = true;
        }

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
