import {Graph} from '../elements/Graph';
import {EventHandler} from '../EventBus';
import {DiagramElement} from '../elements/BaseElements';
import {Util} from '../util';

export class ImportFile implements EventHandler {
    private graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    public isEnable(): boolean {
        return true;
    }

    handle(event: Event, element: DiagramElement): boolean {
        return true;
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
        for (let i = 0, f; f = files[i]; i++) {
            reader.onload = function(event) {
                htmlResult = event.target['result'];
                console.log('fileContent: ' + htmlResult);

                // CHANGE TO INTERNAL OBJECT
                let rootElement = document.getElementById('root');
                let canvasElement = document.getElementById('canvas');
                let palete = document.getElementById('palette');
                let rootChildCount = rootElement.childElementCount;

                for (let i = 0; i < rootChildCount; i++) {
                    rootElement.removeChild(rootElement.firstChild);
                }

                canvasElement.removeChild(canvasElement.firstChild);
                document.body.removeChild(palete);

                rootElement = null;
                canvasElement = null;
                palete = null;

                /*FIXME if(dia){
                    dia.ClearModel();
                }

                var jsonData = JSON.parse(htmlResult);
                dia = new Graph(jsonData, options);
                dia.layout();
                */
            };

            reader.readAsText(f);
        }

        evt.target['className'] = 'diagram';
    }

    private handleDragOver(evt: DragEvent): void {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        evt.target['className'] += ' diagramLoadFile';
        console.log('handDragOver');
    }

    private setBoardStyle(typ: string): boolean {
        let b = this.graph.root;
        Util.removeClass(b, 'Error');
        Util.removeClass(b, 'OK');
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

    private handleDragLeave(evt: DragEvent): void {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'link'; // Explicitly show this is a copy.
        evt.target['className'] = 'diagram';
        console.log('handDragLeave');
    }
}
