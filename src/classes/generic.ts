export class VersionedArray<T> {
    public entries: T[];
    public partial: boolean;
    public version: number;

    constructor(items: T[] = [], isPartial: boolean = false, versionNum: number = 0) {
        this.entries = items;
        this.partial = isPartial;
        this.version = Math.round(versionNum);
    }
}