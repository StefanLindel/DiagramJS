import { Edge } from './Edge';
import { Direction } from './index';
import { Node } from '../nodes/Node';
import { Point } from '../BaseElements';

export abstract class Association extends Edge {

    protected $diamond: Element;

    public getSVG(): Element {

        let startPoint = this.$pointsNew[this.$pointsNew.length - 1];

        let direction: Direction = this.getDirectionOfTargetSymbol(this.$tNode, startPoint);
        let path = this.calcCorrectPath(startPoint, direction);
        
        let group = super.getSVG();

        // draw white filled diamond
        let attr = {
            tag: 'path',
            d: path,
            stroke: 'black',
            'stroke-width': '3'
        };

        this.$diamond = this.createShape(attr);

        group.appendChild(this.$diamond);
        return group;
    }

    public redrawNewFn(startNode: Node, dontDrawPoints?: boolean): void {
        // redraw the edge
        super.redrawNewFn(startNode, true);

        // redraw the generalisation symbol
        // first of all, get the correct direction
        // get source node and the nearest point to source node
        let startPoint: Point = this.$pointsNew[this.$pointsNew.length - 1];
        let direction: Direction = Direction.Down;

        // caclulate the path of target symbol only, if the dragged node is source or there are only 2 points left
        if (this.target === startNode.id || this.$pointsNew.length == 2) {

            direction = this.getDirectionOfTargetSymbol(this.$tNode, startPoint);

            let path = this.calcCorrectPath(startPoint, direction);
            this.$diamond.setAttributeNS(null, 'd', path);
        }

        // draw the correct line with diamond
        this.redrawPoints();
    }

    protected calcCorrectPath(startPoint: Point, direction: Direction): string {
        let startX = startPoint.x;
        let startY = startPoint.y;

        let path;

        switch (direction) {
            case Direction.Up:
                path = `M${startX} ${startY} L${startX + 6} ${startY + 10} L${startX} ${startY + 20} L${startX - 6} ${startY + 10} Z`;
                startPoint.y = startPoint.y+20;
                break;
            case Direction.Right:
                path = `M${startX} ${startY} L${startX - 10} ${startY + 6} L${startX - 20} ${startY} L${startX - 10} ${startY - 6} Z`;
                startPoint.x = startPoint.x-20;
                break;
            case Direction.Left:
                path = `M${startX} ${startY} L${startX + 10} ${startY - 6} L${startX + 20} ${startY} L${startX + 10} ${startY + 6} Z`;
                startPoint.x = startPoint.x+20;
                break;
            case Direction.Down:
                path = `M${startX} ${startY} L${startX - 6} ${startY - 10} L${startX} ${startY - 20} L${startX + 6} ${startY - 10} Z`;
                startPoint.y = startPoint.y-20;
                break;
            default:
                break;
        }

        return path;
    }
}
