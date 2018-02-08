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

        // delete all nodes
        let btnDeleteAll = document.createElement('button');
        btnDeleteAll.id = 'btnDeleteAll';
        btnDeleteAll.textContent = 'Delete All';
        btnDeleteAll.title = 'Delete all nodes from diagram';
        btnDeleteAll.style.marginLeft = '20px';
        btnDeleteAll.style.marginTop = '12px';

        btnDeleteAll.onclick = () => 
        {
            let confirmDelete = confirm('All classes will be deleted!');
            if(!confirmDelete) return;

            this.graph.$graphModel.removeAllElements();
        };
        this.mainDiv.appendChild(btnDeleteAll);

        // Workspace and generate code stuff
        let divGenerate = document.createElement('div');
        divGenerate.style.display = 'inline';
        divGenerate.style.marginLeft = '20px';

        let inputGenerateWorkspace = document.createElement('input');
        inputGenerateWorkspace.id = 'inputWorkspace';
        inputGenerateWorkspace.type = 'text';
        inputGenerateWorkspace.placeholder = 'Type your workspace for generated code...';
        inputGenerateWorkspace.style.marginRight = '5px';
        inputGenerateWorkspace.style.width = '260px';

        let btnGenerate = document.createElement('button');
        btnGenerate.textContent = 'Generate';
        btnGenerate.title = 'Generate code into your workspace';

        btnGenerate.onclick = () => 
        {
            let workspace = inputGenerateWorkspace.value;
            if(workspace.length === 0){
                alert('No workspace set.\nEnter first your workspace');
                inputGenerateWorkspace.focus();
                return;
            }
            this.graph.generate(workspace);
        };

        divGenerate.appendChild(inputGenerateWorkspace);
        divGenerate.appendChild(btnGenerate);
        this.mainDiv.appendChild(divGenerate);
        
        document.body.appendChild(this.mainDiv);
    }
}