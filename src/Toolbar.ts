import { Graph } from "./main";

export class Toolbar {

    private graph: Graph;
    private mainDiv: HTMLDivElement;

    constructor(graph: Graph){
        this.graph = graph;
    }

    public show(): void{
        if(this.mainDiv){
            return;
        }

        this.mainDiv = document.createElement('div');
        this.mainDiv.className = 'toolbar';

        let h1Logo = document.createElement('h1');
        h1Logo.className = 'logo';
        h1Logo.textContent = 'DiagramJS';

        let btnAutoLayout = document.createElement('button');
        btnAutoLayout.id = 'layoutBtn';
        btnAutoLayout.style.marginLeft = '195px';
        btnAutoLayout.style.marginTop = '12px';
        btnAutoLayout.textContent = 'Auto Layout';

        btnAutoLayout.onclick = () => {this.graph.layout();};

        this.mainDiv.appendChild(h1Logo);
        this.mainDiv.appendChild(btnAutoLayout);


        // Workspace and generate code stuff
        let divGenerate = document.createElement('div');
        divGenerate.style.display = 'inline';
        divGenerate.style.marginLeft = '20px';

        let inputGenerateWorkspace = document.createElement('input');
        inputGenerateWorkspace.type = 'text';
        inputGenerateWorkspace.placeholder = 'Type your workspace for generated code...';
        inputGenerateWorkspace.style.marginRight = '5px';
        inputGenerateWorkspace.style.width = '260px';

        let btnGenerate = document.createElement('button');
        btnGenerate.textContent = 'Generate';

        btnGenerate.onclick = () => {this.graph.generate();};

        divGenerate.appendChild(inputGenerateWorkspace);
        divGenerate.appendChild(btnGenerate);
        this.mainDiv.appendChild(divGenerate);
        
        document.body.appendChild(this.mainDiv);
    }
}