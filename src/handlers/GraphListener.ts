import PropertyChangeSupport from '../PropertyChangeSupport';
import Data from '../Data';
import {Adapter} from '../Adapter';
import ClazzProperty from '../elements/nodes/ClazzProperty';

export class GraphListener implements PropertyChangeSupport {
    private $owner: ClazzProperty;

    constructor(owner: ClazzProperty) {
        this.$owner = owner;
    }

    public propertyChange(entity: Data, property: string, oldValue: any, newValue: any): void {
        let adapter = this.$owner.getRoot().getAdapter();
        if (adapter) {
            // messages.add("{\"class\":\"de.uniks.networkparser.test.model.House\",\"id\":\"H1\",\"rem\":{\"floor\":4},\"upd\":{\"floor\":42}}");
            let myId =  this.$owner.$owner.getId();
            if (myId && myId.length > 0) {
                let pos = myId.indexOf(':');
                if (pos > 0) {
                    myId = myId.substring(0, pos).trim();
                }
            }
            let myName = this.$owner.getName();
            let remJson = {};
            remJson[myName] = oldValue;
            let updJson = {};
            updJson[myName] = newValue;
            let json = {};
            json['id'] = myId;
            json['rem'] = remJson;
            json['upd'] = updJson;
            let message = JSON.stringify(json);
            (<Adapter> adapter).update(message);
        }
    }
}
