import {Adapter} from "../Adapter";

export class JavaAdapter extends Adapter {

    public isActive(): boolean {
        if (window['JavaBridge']) {
            return true;
        }
        return false;
    }

    public executeChange(json: string): boolean {
        if (this.isActive()) {
            window['JavaBridge'].executeChange(json);
            return true;
        }
        return false;
    }


    fireEvent(evt: Event): boolean {
        if (this.isActive()) {
            window['JavaBridge'].fireEvent(evt);
            return true;
        }
        return false;
    }
}