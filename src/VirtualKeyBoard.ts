import {Control} from './Control';

export class VirtualKeyBoard extends Control {
    constructor(data: any) {
        super();
        if (!data) {
            data = this.getDefault();
        }
        let board = document.createElement('div');
        this.$viewData = data;

        for (let type in data) {
            if (type === 'normal') {
                for (let line in data[type]) {
                    let lineBoard = document.createElement('div');
                    lineBoard.className = 'vkLine';
                    for (let key in data[type][line]) {
                        let btn: HTMLButtonElement = document.createElement('button');
                        let keyTag = data[type][line][key];
                        this.setButtonValue(keyTag, btn, 'vkbutton');
                        btn.ontouchend = () => {this.action(btn); };
                        btn.onclick = () => {this.action(btn); };
                        lineBoard.appendChild(btn);
                    }
                    board.appendChild(lineBoard);
                }
            }
        }
        this.$view = board;
    }

    public action(btn: HTMLButtonElement) {
        if (btn['key'] === '{Shift}') {
            if ( btn.className === 'vkbuttonAction') {
                let keys = this.$viewData['normal'];
                for (let line in keys) {
                    let lineBoard = this.$view.children[line];
                    for (let key in keys[line]) {
                        let btn: HTMLButtonElement = lineBoard.children[key];
                        let keyTag = keys[line][key];
                        this.setButtonValue(keyTag, btn, 'vkbutton');
                    }
                }
            } else if ( btn.className === 'vkbutton') {
                let keys = this.$viewData['shift'];
                for (let line in keys) {
                    let lineBoard = this.$view.children[line];
                    for (let key in keys[line]) {
                        let btn: HTMLButtonElement = lineBoard.children[key];
                        let keyTag = keys[line][key];
                        this.setButtonValue(keyTag, btn, 'vkbuttonAction');
                    }
                }
            }
        }
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
            ],
            shift: [
                ['°', '!', '"', '§', '$', '%', '&', '/', '(', ')', '=', '?', '`', '{Bksp}'],
                ['{Tab}', 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü', '*'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä', '\'', '{enter}'],
                ['{Shift}', '>', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', ';', ':', '_', '{Shift}'],
                ['{Accept}', '{Alt}', '{Space}', '{Cancel}']
            ]
        };
        return format;
    }

    public getBoard() {
        return this.$view;
    }

    private setButtonValue(keyTag: string, btn: HTMLButtonElement, shiftClass: string) {
        btn.className = 'vkbutton';
        btn['key'] = keyTag;
        btn['type'] = 'normal';
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
                btn.className = shiftClass;
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
        }
    }
}
