export class StringArrayReader {
  constructor(
    protected readonly data: string[],
  ) {}

  protected index: number = 0;

  readEnum<T extends Record<number, string>>(enumV: T): T[keyof T] {
    const int = this.readInt();

    if (!(int in enumV))
      throw new Error("Missing enum value: " + int);

    return int as any as T[keyof T];
  }

  isComplete() {
    return this.index >= this.data.length;
  }

  skip(count: number) {
    if (this.index + count > this.data.length)
      throw new Error("Skip would land reader out of bounds")

    this.index += count;
  }

  read(count: number) {
    if (this.index + count > this.data.length)
      throw new Error("Read would land reader out of bounds")

    return new StringArrayReader(this.data.slice(this.index, this.index += count));
  }

  readString() {
    if (this.isComplete())
      throw new Error("Out of bounds StringArray read");

    return this.data[this.index++];
  }

  readNullable<T>(cb: (str: string) => T): T | undefined {
    const str = this.readString();

    if (str.length === 0)
      return undefined;

    return cb(str);
  }

  readNullableString() {
    return this.readNullable(s => s);
  }

  readInt() {
    return parseInt(this.readString());
  }

  readNullableInt() {
    return this.readNullable(s => parseInt(s));
  }

  readFloat() {
    return parseFloat(this.readString());
  }

  readNullableFloat() {
    return this.readNullable(s => parseFloat(s));
  }

  readNumericBoolean() {
    return this.readString() !== "0";
  }

  readNullableNumericBoolean() {
    return this.readNullable(s => s !== "0")
  }

  readStringBoolean() {
    return this.readString().toLowerCase() === "true";
  }

  readNullableStringBoolean() {
    return this.readNullable(s => s !== "true");
  }

  readArray<T>(length: number, fn: (reader: StringArrayReader) => T): T[] {
    const arr: T[] = [];

    for (let i = 0; i < length; i++)
      arr.push(fn(this));

    return arr;
  }

  readTaggedArray<T>(fn: (reader: StringArrayReader) => T): T[] {
    return this.readArray(this.readInt(), fn)
  }

  readNullableTaggedArray<T>(fn: (reader: StringArrayReader) => T) {
    return this.readNullable(cb => this.readArray(parseInt(cb), fn));
  }

  readRemainingArray<T>(fn: (reader: StringArrayReader) => T): T[] {
    const arr: T[] = [];

    while (!this.isComplete())
      arr.push(fn(this));

    return arr;
  }

  readDelimitatedArray(deliminator: string) {
    return new StringArrayReader(this.readString().split(deliminator));
  }

  reduceArray<IT>(length: number, start: IT, fn: (reader: StringArrayReader, o: IT) => IT | void): IT {
    let v: IT = start;

    for (let i = 0; i < length; i++) {
      const res = fn(this, v);

      if (res !== undefined)
        v = res;
    }

    return v;
  }

  reduceTaggedArray<IT>(start: IT, fn: (reader: StringArrayReader, o: IT) => IT | void): IT {
    return this.reduceArray(this.readInt(), start, fn)
  }

  reduceRemainingArray<IT>(start: IT, fn: (reader: StringArrayReader, o: IT) => IT | void): IT {
    let v: IT = start;

    while (!this.isComplete()) {
      const res = fn(this, v);

      if (res !== undefined)
        v = res;
    }

    return v;
  }

  reduceDelimitatedArray<IT>(deliminator: string, start: IT, fn: (reader: StringArrayReader, o: IT) => IT | void): IT {
    return this
      .readDelimitatedArray(deliminator)
      .reduceRemainingArray(start, fn);
  }

  readObject<T, Ctx extends any[]>(object: { deserialize(reader: StringArrayReader, ...ctx: Ctx): T }, ...ctx: Ctx): T {
    return object.deserialize(this, ...ctx);
  }

  readObjectArray<T, Ctx extends any[]>(length: number, object: { deserialize(reader: StringArrayReader, ...ctx: Ctx): T }, ...ctx: Ctx): T[] {
    const arr: T[] = [];

    for (let i = 0; i < length; i++)
      arr.push(object.deserialize(this, ...ctx));

    return arr;
  }

  readTaggedObjectArray<T, Ctx extends any[]>(object: { deserialize(reader: StringArrayReader, ...ctx: Ctx): T }, ...ctx: Ctx): T[] {
    return this.readObjectArray(this.readInt(), object, ...ctx);
  }

  readNullableTaggedObjectArray<T, Ctx extends any[]>(object: { deserialize(reader: StringArrayReader, ...ctx: Ctx): T }, ...ctx: Ctx): T[] | undefined {
    return this.readNullable(str => this.readObjectArray(parseInt(str), object, ...ctx));
  }

  readRemainingObjectArray<T, Ctx extends any[]>(object: { deserialize(reader: StringArrayReader, ...ctx: Ctx): T }, ...ctx: Ctx): T[] {
    const arr: T[] = [];

    while (!this.isComplete())
      arr.push(object.deserialize(this, ...ctx));

    return arr;
  }

  readDelimitatedObjectArray<T, Ctx extends any[]>(deliminator: string, object: { deserialize(reader: StringArrayReader, ...ctx: Ctx): T }, ...ctx: Ctx): T[] {
    return this
      .readDelimitatedArray(deliminator)
      .readRemainingObjectArray(object, ...ctx)
  }

  getRemainingStrings() {
    return this.data.slice(this.index);
  }
}
