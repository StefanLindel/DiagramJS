import {Graph} from '../elements/';
import {EventHandler, EventBus} from '../EventBus';
import {DiagramElement} from '../elements/';
import {Util} from '../util';

export class ImportFile implements EventHandler {

    private graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    public setActive(active: boolean): void {
        if (active) {
            EventBus.setActiveHandler(ImportFile.name);
        }
        else {
            EventBus.releaseActiveHandler();
        }
    }

    public canHandle(): boolean {
        return EventBus.isHandlerActiveOrFree(ImportFile.name);
    }

    public handle(event: Event, element: DiagramElement): boolean {
        let type: string = typeof event;
        if (type !== 'DragEvent') {
            return false;
        }
        let evt: DragEvent = <DragEvent>event;
        if (evt.type === 'dragover') {
            this.handleDragOver(evt);
        } else if (evt.type === 'dragleave') {
            if (this.graph.$view !== evt.target) {
                return false;
            }
            this.setBoardStyle('dragleave');
        } else if (evt.type === 'drop') {
            this.handleLoadFile(evt);
        }
        return true;
    }

    public setBoardStyle(typ: string): boolean {
        let b = this.graph.$view;
        Util.removeClass(b, 'Error');
        Util.removeClass(b, 'Ok');
        Util.removeClass(b, 'Add');
        if (typ === 'dragleave') {
            if (b['errorText']) {
                b.removeChild(b['errorText']);
                b['errorText'] = null;
            }
            return true;
        }
        Util.addClass(b, typ);
        if (typ === 'Error') {
            if (!b['errorText']) {
                b['errorText'] = Util.create({tag: 'div', style: 'margin-top: 30%', value: 'NO TEXTFILE'});
                b.appendChild(b['errorText']);
            }
            return true;
        }
        return false;
    }

    private handleLoadFile(evt: DragEvent): void {
        evt.stopPropagation();
        evt.preventDefault();

        let files = evt.dataTransfer.files; // FileList object.

        if (files.length > 1) {
            evt.dataTransfer.dropEffect = 'none';
            return;
        }

        // files is a FileList of File objects. List some properties.
        let reader  = new FileReader();
        let output = [];
        let htmlResult = '';
        let that = this;
        for (let i = 0, f; f = files[i]; i++) {
            reader.onload = function(event) {
				htmlResult = ''+event.target['result'];
				console.log('fileContent: ' + htmlResult);
				// CHANGE TO INTERNAL OBJECT
				if (that.graph) {
					that.graph.import(htmlResult);
				}
            };
            reader.readAsText(f);
        }
        this.setBoardStyle('dragleave');
    }

    private handleDragOver(evt: DragEvent): void {
        let error: boolean = true, n: string, f;
        let files = evt.dataTransfer.files;
        // process all File objects
        if (files && files.length > 0) {
            for (let i: number = 0; i < files.length; i += 1) {
                f = files[i];
                if (f.type.indexOf('text') === 0) {
                    error = false;
                } else if (f.type === '') {
                    n = f.name.toLowerCase();
                    if (n.indexOf('json', n.length - 4) !== -1) {
                        error = false;
                    }
                }
            }
        } else {
            let items = evt.dataTransfer.items;
            if (items && items.length > 0) {
                for (let z = 0; z < items.length; z ++) {
                    if (items[z].type === '' || items[z].type === 'text/plain') {
                        error = false;
                    }
                }
            } else {
                return;
            }
        }

        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        if (error) {
            this.dragStyler(evt, 'Error');
        } else if (evt.ctrlKey) {
            this.dragStyler(evt, 'Add');
        } else {
            this.dragStyler(evt, 'Ok');
        }
        /* //evt.target['className'] += ' diagramLoadFile';
        '//console.log('handDragOver');*/
    }

    private dragStyler(event: Event, typ: string) {
        event.stopPropagation();
        event.preventDefault();
        this.setBoardStyle(typ);
    }

    private handleDragLeave(evt: DragEvent): void {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'link'; // Explicitly show this is a copy.
        evt.target['className'] = 'diagram';
        console.log('handDragLeave');
    }
}
