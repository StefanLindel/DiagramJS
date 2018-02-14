import {GraphTest} from './GraphTest';

export class GraphLoadClazz extends GraphTest {
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

        return true;
    }
}
