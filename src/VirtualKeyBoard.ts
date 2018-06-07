import {Control} from './Control';

export class VirtualKeyBoard extends Control {
    constructor(data: any) {
        super();
        if (!data) {
            data = this.getDefault();
        }
        let board = document.createElement('div');

        for (let type in data) {
            if (type === 'normal') {
                for (let line in data[type]) {
                    let lineBoard = document.createElement('div');
                    lineBoard.className = 'vkLine';
                    for (let key in data[type][line]) {
                        let btn: HTMLButtonElement = document.createElement('button');
                        let keyTag = data[type][line][key];
                        btn.className = 'vkbutton';
                        btn['key'] = keyTag;
                        if (keyTag.substring(0, 1) === '{') {
                            if (keyTag === '{Bksp}') {
                                btn.innerHTML = 'Bksp';
                            } else if (keyTag === '{Tab}') {
                                btn.innerHTML = '&#8677; Tab';
                            } else if (keyTag === '{enter}') {
                                btn.innerHTML = 'enter';
                                btn.className = 'vkbuttonAction';
                            } else if (keyTag === '{Shift}') {
                                btn.innerHTML = 'Shift';
                            } else if (keyTag === '{Accept}') {
                                btn.innerHTML = 'Accept';
                                btn.className = 'vkbuttonAction';
                            } else if (keyTag === '{Alt}') {
                                btn.innerHTML = 'Alt';
                            } else if (keyTag === '{Space}') {
                                btn.innerHTML = '&nbsp;';
                                btn.className = 'vkbuttonSpace';
                            } else if (keyTag === '{left}') {
                                btn.innerHTML = '&#8592';
                            } else if (keyTag === '{right}') {
                                btn.innerHTML = '&#8594;';
                            } else if (keyTag === '{up}') {
                                btn.innerHTML = '&#8593;';
                            } else if (keyTag === '{down}') {
                                btn.innerHTML = '&#8595;';
                            } else if (keyTag === '{Cancel}') {
                                btn.innerHTML = 'Cancel';
                                btn.className = 'vkbuttonAction';
                            }
                        } else {
                            btn.innerHTML = keyTag;
                            btn.ontouchend = () => {this.action(btn); };
                            btn.onclick = () => {this.action(btn); };
                        }
                        lineBoard.appendChild(btn);
                    }
                    board.appendChild(lineBoard);
                }
            }
        }
        this.$view = board;
    }

    public action(btn: HTMLButtonElement) {
        alert(btn);
    }

    public getDefault(): any {
        let format = {
            normal: [
                ['^', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '´', '{Bksp}'],
                ['{Tab}', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '+'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', '#', '{enter}'],
                ['{Shift}', '<', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', '{Shift}'],
                ['{Accept}', '{Alt}', '{Space}', '{Cancel}']
// '{left}', '{up}', '{down}','{right}', '{Cancel}']
            ]
        };
        return format;
    }
}
