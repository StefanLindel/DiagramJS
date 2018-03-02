import { GraphTest } from './GraphTest';
import { Clazz } from '../../src/elements';
import Attribute from '../../src/elements/nodes/Attribute';
import Method from '../../src/elements/nodes/Method';

export class GraphModelTest extends GraphTest {
    public runGraph(): boolean {
        this.graph.load({
            'nodes': [
                {
                    'label': 'Product',
                    'attributes': [
                        {
                            'modifier': '+',
                            'type': 'string',
                            'name': 'name'
                        },
                        {
                            'modifier': '+',
                            'type': 'string',
                            'name': 'description'
                        },
                        {
                            'modifier': '+',
                            'type': 'string',
                            'name': 'photo'
                        },
                        {
                            'modifier': '-',
                            'type': 'int',
                            'name': 'id'
                        }
                    ],
                    'methods': [
                        {
                            'modifier': '+',
                            'type': 'void',
                            'name': 'addToOrder()'
                        }
                    ],
                    'id': 'clazz-60056',
                    'property': 'Clazz'
                }
            ],
            'edges': [],
            'id': 'RootElement',
            'property': 'classdiagram'
        });

        this.assertEquals(1, this.graph.$graphModel.nodes.length);

        let clazz = <Clazz>this.graph.$graphModel.nodes[0];
        this.assertNotNull(clazz, 'clazz with idclazz-60056 is null');

        let attrPhoto = <Attribute>clazz.getAttributes()[2];
        this.assertNotNull(attrPhoto, 'attribute attrPhoto is null');
        this.assertEquals('photo', attrPhoto.name);
        this.assertEquals('string', attrPhoto.type);

        let method = <Method>clazz.getMethods()[0];
        this.assertNotNull(method, 'method addToOrder() is null');
        this.assertEquals('addToOrder()', method.name, 'method name addToOrder() is wrong');

        // add new attribute
        let newAttr = new Attribute(
            {
                'modifier': '#',
                'type': 'string',
                'name': 'newAttr'
            });

        clazz.addAttributeObj(newAttr);

        let newAddedAttr = clazz.getAttributes()[4];
        this.assertNotNull(newAddedAttr);
        this.assertEquals('newAttr', newAddedAttr.name);
        this.assertEquals('string', newAddedAttr.type);

        // remove attributes
        clazz.removeAttribute(clazz.getAttributes()[1]);
        this.assertEquals(4, clazz.getAttributes().length);



        // add new method
        let newMethod = new Method(
            {
                'modifier': '#',
                'type': 'string',
                'name': 'getTest()'
            });
            
        clazz.addMethodObj(newMethod);

        let newAddedMethod = clazz.getMethods()[1];
        this.assertNotNull(newAddedMethod);
        this.assertEquals('getTest()', newAddedMethod.name);
        this.assertEquals('#', newAddedMethod.modifier);

        // remove methods
        clazz.removeMethod(clazz.getMethods()[1]);
        this.assertEquals(1, clazz.getMethods().length);


        // update label and modifier
        clazz.updateLabel('UpdatedLabel');
        clazz.updateModifier('UpdatedMod');

        let clazzUpdated = <Clazz>this.graph.$graphModel.nodes[0];
        this.assertNotNull(clazzUpdated);
        this.assertEquals('UpdatedLabel', clazzUpdated.label);
        this.assertEquals('UpdatedMod', clazzUpdated.modifier);


        // add new class
        this.graph.$graphModel.addElement('Clazz');
        this.assertEquals(2, this.graph.$graphModel.nodes.length);


        // assign an edge between A -> B
        this.graph.$graphModel.addEdge({ source: clazz.label, target: this.graph.$graphModel.nodes[1].label })
        this.assertEquals(1, this.graph.$graphModel.edges.length);

        let edge = this.graph.$graphModel.edges[0];
        this.assertEquals(clazz.label, edge.source);


        // // remove the last class
        // this.graph.$graphModel.removeElement(this.graph.$graphModel.nodes[1].id);
        // this.assertEquals(1, this.graph.$graphModel.nodes.length);
        // this.assertEquals(0, this.graph.$graphModel.edges.length);

        this.graph.layout();
        let svgElementOfClass = document.getElementById(clazz.id);
        this.assertNotNull(svgElementOfClass);

        let svgElementOfEdge = document.getElementById(this.graph.$graphModel.edges[0].id);
        this.assertNotNull(svgElementOfClass);

        return true;
    }
}
