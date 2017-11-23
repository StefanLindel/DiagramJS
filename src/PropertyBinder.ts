import PropertyChangeSupport from './PropertyChangeSupport';
import Data from './Data';

export class PropertyBinder implements PropertyChangeSupport {
    private propertyClass1: string;
    private propertyClass2: string;
    private data1: Data;
    private data2: Data;
    // works like a lock
    private applyingChange: boolean = false;

    constructor(data1: Data, data2: Data, propertyClass1: string, propertyClass2: string) {
        this.data1 = data1;
        this.data2 = data2;
        this.propertyClass1 = propertyClass1;
        this.propertyClass2 = propertyClass2;
    }
    static bind(data1: Data, data2: Data, property1: string, property2: string) {
        if (!data1 || !data2 || !property1) {
            console.error('NullValue!!');
            return null;
        }
        const propertyBinder = new PropertyBinder(data1, data2, property1, property2);
        propertyBinder.bind();
        return propertyBinder;
    }

    propertyChange(entity: Data, property: string, oldValue: any, newValue: any): void {
        if (!this.applyingChange) {
            this.applyingChange = true;
            if (entity === this.data1) {
                // fire to data2
                this.data2.setValue(this.propertyClass2, newValue);
            } else if (entity === this.data2) {
                // fire to data1
                this.data1.setValue(this.propertyClass1, newValue);
            }
            this.applyingChange = false;
        }
    }

    protected bind() {
        // public addListener(control: Control, property?: string)
        // todo: set value immediately
        this.data1.setValue(this.propertyClass1, this.data2.getValue(this.propertyClass2));

        this.data1.addListener(this, this.propertyClass1);
        this.data2.addListener(this, this.propertyClass2);
    }

    protected unbind() {
        // public addListener(control: Control, property?: string)
        this.data1.removeListener(this, this.propertyClass2);
        this.data1.removeListener(this, this.propertyClass2);
    }
}
