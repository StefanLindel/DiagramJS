import {Control} from './Control';

export class ScrumBoard extends Control {
    public static cards = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', 'Coffee'];
    private $selected: HTMLDivElement;
    private $board: HTMLDivElement;

    constructor() {
        super();
        this.redraw();
    }

    public redraw(): void {
        if (this.$board) {
            while (this.$board.children.length > 0 ) {
                this.$board.removeChild(this.$board.children[0]);
            }
        } else {
            this.$view = document.createElement('div');
            this.$selected = document.createElement('div');
            this.$board = document.createElement('div');
            this.$view.appendChild(this.$board);
            this.$view.appendChild(this.$selected);
        }
        this.$view.className = 'ScrumBoard';
        for ( let i = 0; i < ScrumBoard.cards.length; i++) {
            let card = document.createElement('div');
            card.className = 'ScrumCard';
            card.innerHTML = <string>ScrumBoard.cards[i];
            card['pokervalue'] = <string>ScrumBoard.cards[i];
            card.onclick = e => {
                this.onClick(<HTMLDivElement>e.target);
            };
            this.$board.appendChild(card);
        }
    }

    public getSVG() {
        this.redraw();
        return this.$view;
    }

    public onClick(target: HTMLDivElement): void {
        console.log(target['pokervalue']);

        while (this.$selected.children.length > 0 ) {
            this.$selected.removeChild(this.$selected.children[0]);
        }
        let card = document.createElement('div');
        card.className = 'ScrumCard';
        card['pokervalue'] = target['pokervalue'];
        card.onclick = e => {
            this.onShow(<HTMLDivElement>e.target);
        };
        this.$selected.appendChild(card);
        this.$board['style']['display'] = 'none';
    }

    public onShow(target: HTMLDivElement): void {
        target.innerHTML = target['pokervalue'];
    }
}
