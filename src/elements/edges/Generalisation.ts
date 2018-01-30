import { Edge } from './Edge';
import { Node } from '../nodes/Node';
import { Point } from '../BaseElements';
import { Direction } from '../index';

export class Generalisation extends Edge {

    public TARGET_ELEMENT_HEIGHT : number = 12;
    protected $targetElement: Element;

    public getSVG(): Element {
        let startPoint = this.$pointsNew[0];

        let direction : Direction = this.getDirectionOfTargetSymbol(this.$sNode, startPoint);
        let path = this.calcCorrectPath(startPoint, direction);
        
        let line = super.getSVG();

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

        // redraw the edge
        super.redrawNewFn(startNode, true);

        // redraw the generalisation symbol
        // first of all, get the correct direction
        // get source node and the nearest point to source node
        let startPoint : Point = this.$pointsNew[0];
        let direction : Direction = Direction.Up;

        // caclulate the path of target symbol only, if the dragged node is source or there are only 2 points left
        if(this.source === startNode.id || this.$pointsNew.length == 2){

            direction = this.getDirectionOfTargetSymbol(this.$sNode, startPoint);

            let path = this.calcCorrectPath(startPoint, direction);
            this.$targetElement.setAttributeNS(null, 'd', path);
        }

        // draw the correct line with diamond
        this.redrawPoints();
    }

    protected calcCorrectPath(startPoint : Point, direction : Direction) : string{
        let startX = startPoint.x;
        let startY = startPoint.y;

        let path;

        switch(direction){
            case Direction.Up:
            path = `M${startX} ${startY+3} L${startX+this.TARGET_ELEMENT_HEIGHT} ${startY+this.TARGET_ELEMENT_HEIGHT} L${startX-this.TARGET_ELEMENT_HEIGHT} ${startY+this.TARGET_ELEMENT_HEIGHT} Z`;
            startPoint.y = startPoint.y+12;
            break;
            case Direction.Right:
            path = `M${startX-3} ${startY} L${startX-this.TARGET_ELEMENT_HEIGHT} ${startY+this.TARGET_ELEMENT_HEIGHT} L${startX-this.TARGET_ELEMENT_HEIGHT} ${startY-this.TARGET_ELEMENT_HEIGHT} Z`;
            startPoint.x = startPoint.x-12;
            break;
            case Direction.Left:
            path = `M${startX+3} ${startY} L${startX+this.TARGET_ELEMENT_HEIGHT} ${startY-this.TARGET_ELEMENT_HEIGHT} L${startX+this.TARGET_ELEMENT_HEIGHT} ${startY+this.TARGET_ELEMENT_HEIGHT} Z`;
            startPoint.x = startPoint.x+12;
            break;
            case Direction.Down:
            path = `M${startX} ${startY-3} L${startX+this.TARGET_ELEMENT_HEIGHT} ${startY-this.TARGET_ELEMENT_HEIGHT} L${startX-this.TARGET_ELEMENT_HEIGHT} ${startY-this.TARGET_ELEMENT_HEIGHT} Z`;
            startPoint.y = startPoint.y-12;
            break;
            default :
            break;
        }

        return path;
    }

}
