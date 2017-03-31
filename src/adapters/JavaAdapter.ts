import {Adapter} from "../Adapter";

export class JavaAdapter extends Adapter {
    constructor() {
        super();
        this.id = "JavaAdapter";
    }
    update(evt: Object): boolean {
        if (this.isActive()) {
            window['JavaBridge'].executeChange(evt);
            return true;
        }
        return false;
    }

    public isActive(): boolean {
        if (window['JavaBridge']) {
            return true;
        }
        return false;
    }
}

