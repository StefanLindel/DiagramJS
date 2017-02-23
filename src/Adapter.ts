export abstract class Adapter {
    id: string = null;

    abstract update(evt: Object): boolean;
}
