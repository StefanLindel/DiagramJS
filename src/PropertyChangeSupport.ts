import Data from './Data';

export default interface PropertyChangeSupport {
    propertyChange(entity: Data, property: string, oldValue: any, newValue: any): void;
}
