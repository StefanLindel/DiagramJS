import { DiagramElement } from '../elements/BaseElements';
import { Clazz } from '../elements/nodes';
import Graph from '../elements/Graph';

export class Editor {
  private editorElement: Element;
  private clazz: Clazz;
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

	public isEnable() : boolean {
		return true;
	}

  public handle(event, element: DiagramElement) : boolean {
    if (element instanceof Clazz) {
      const clazz = element;
      const attributes = clazz.getPropertyAsString('attributes');
      const methods = clazz.getPropertyAsString('methods');

      let div = document.createElement('div');
      div.className = 'editor';
      div.innerHTML = `<h2>Class Editor</h2><hr><div><h4>ID: ${clazz.id}</h4></div><div><h3>Name:</h3><input id="input_name" type="text" value="${clazz.label}"></input></div><div class="attributes"><h3>Attributes:</h3><textarea id="attributes_area">${attributes}</textarea></div><div class="methods"><h3>Methods:</h3><textarea id="methods_area">${methods}</textarea></div>`;

      let buttons = document.createElement('div');
      buttons.className = 'buttons';

      let okBtn = document.createElement('button');
      okBtn.innerHTML = 'OK';
      okBtn.onclick = e => this.edit();
      buttons.appendChild(okBtn);

      let cancelBtn = document.createElement('button');
      cancelBtn.innerHTML = 'CANCEL';
      cancelBtn.onclick = e => this.cancel();
      buttons.appendChild(cancelBtn);

      div.appendChild(buttons);
      this.editorElement = div;
      this.clazz = clazz;
      document.body.appendChild(div);
    }
		return true;
  }

  private cancel() {
    this.editorElement.remove();
  }

  private edit() {
    let hasChanged = false;

    const name = (<HTMLInputElement>document.getElementById('input_name')).value;
    if (name !== this.clazz.label) {
      this.clazz.label = name;
      hasChanged = true;
    }

    const attributes = (<HTMLTextAreaElement>document.getElementById('attributes_area')).value;
    hasChanged = this.clazz.convertStringToProperty(attributes, 'attributes') || hasChanged;

    const methods = (<HTMLTextAreaElement>document.getElementById('methods_area')).value;
    hasChanged = this.clazz.convertStringToProperty(methods, 'methods') || hasChanged;

    if (hasChanged) {
      this.graph.layout();
    }
    this.cancel();
  }

}
