/*!
 NetworkParser
 Copyright (c) 2011 - 2014, Stefan Lindel
 All rights reserved.

 Licensed under the EUPL, Version 1.1 or (as soon they
 will be approved by the European Commission) subsequent
 versions of the EUPL (the 'Licence');
 You may not use this work except in compliance with the Licence.
 You may obtain a copy of the Licence at:

 http://ec.europa.eu/idabc/eupl5

 Unless required by applicable law or agreed to in
 writing, software distributed under the Licence is
 distributed on an 'AS IS' basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied.
 See the Licence for the specific language governing
 permissions and limitations under the Licence.
*/

//TODO:
// Header with Export
// Move Element
// Loader (Image)
// Save (Export) and load Drag and Drop
// Add all EventTypes
// Add ClazzEditor
// Add Color to Attributes

import Edge from './elements/edge/Edge';
import Graph from './elements/Graph';
import Info from './elements/Info';

new Info(0, null, 0);

class Diagram {

  private data: Object;
  private graph: Graph;

  constructor(data: Object) {
    new Edge();
    this.setData(data);
  }

  public setData(data: Object) {
    this.data = data;
    this.graph = new Graph(data, null);
  }

  public layout() {
    this.graph.layout();
  }

}

let json = {'edges': [{source: 'Hallo', target: 'World'}]};

let t = new Diagram(json);

t.layout();
