import { EventHandler } from '../core/EventBus';
import { DiagramElement } from '../elements/BaseElements';
import { Clazz } from '../elements/nodes';

export class Editor implements EventHandler {

  private element: Element;

  public handle(event, element: DiagramElement) {

    if (element instanceof Clazz) {

      const clazz = element;
      const methods = clazz.getMethodsAsString();
      const attributes = clazz.getAttributesAsString();

      let div = document.createElement('div');
      div.className = 'editor';
      div.innerHTML = `<h2>Class Editor</h2><hr><div><h4>ID: ${clazz.id}</h4></div><div><h3>Name:</h3><input id="name" type="text" value="${clazz.id}"></input></div><div class="attributes"><h3>Attributes:</h3><textarea>${attributes}</textarea></div><div class="methods"><h3>Methods:</h3><textarea>${methods}</textarea></div>`;

      let buttons = document.createElement('div');
      buttons.className = 'buttons';

      let okBtn = document.createElement('button');
      okBtn.innerHTML = 'OK';
      buttons.appendChild(okBtn);

      let cancelBtn = document.createElement('button');
      cancelBtn.innerHTML = 'CANCEL';
      cancelBtn.onclick = e => this.cancel();
      buttons.appendChild(cancelBtn);

      div.appendChild(buttons);
      this.element = div;
      document.body.appendChild(div);
    }
  }

  private cancel() {
    this.element.remove();
  }

}

/*
<div class="editor">
  <h2>Class Editor</h2>
  <hr>
  <div><h4>ID:</h4></div>
  <div><h3>Name:</h3><input type="text"></input></div>
  <div class="attributes"><h3>Attributes:</h3><textarea></textarea></div>
  <div class="methods"><h3>Methods:</h3><textarea></textarea></div>
  <div class="buttons">
    <button>OK</button>
    <button>CANCEL</button>
  </div>
</div>
*/
