export abstract class Adapter {
    public id: string = null;

    abstract update(evt: Object): boolean;
}
