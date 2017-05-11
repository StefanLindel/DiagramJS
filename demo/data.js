/*

var json = {
  "typ": "clazzdiagram",
  "options": {
    layout: "DagreLayout"
  },
  "nodes": [{
    "typ": "clazz",
    id: "University",
    attributes: ["name:String"],
    methods: ["toString()"]
  }]
};

*/

//var json = {"edges": [{source:"Hallo", target:"World"}]};

var data = {typ: "clazzdiagram", edges: [{typ: "edge", source: "A", target: "B"},{typ: "edge", source: "A", target: "C"}, {typ: "edge", source: "C", target: "B"}]};

var dia = new Diagram(data);
dia.layout();
