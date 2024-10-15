export class StringArrayWriter {
  protected strs: string[] = [];

  static skip(count: number) { return (new StringArrayWriter).skip(count) }

  skip(count: number) {
    this.strs.push(...new Array(count).fill(""))

    return this;
  }

  static writeStrings(...strings: (string | undefined)[]) { return (new StringArrayWriter).writeStrings(...strings) }

  writeStrings(...strings: (string | undefined)[]) {
    this.strs.push(...strings.map(v => v == undefined ? "" : v));

    return this;
  }

  static writeNumbers(...numbers: (number | undefined)[]) { return (new StringArrayWriter).writeNumbers(...numbers) }

  writeNumbers(...numbers: (number | undefined)[]) {
    this.strs.push(...numbers.map(n => n === undefined ? "" : n.toString(10)));

    return this;
  }

  static writeNumericBooleans(...booleans: (boolean | undefined)[]) { return (new StringArrayWriter).writeNumericBooleans(...booleans) }

  writeNumericBooleans(...booleans: (boolean | undefined)[]) {
    this.strs.push(...booleans.map(boolean => boolean === undefined ? "" : (boolean ? "1" : "0")))

    return this;
  }

  static writeStringBooleans(...booleans: (boolean | undefined)[]) { return (new StringArrayWriter).writeStringBooleans(...booleans) }

  writeStringBooleans(...booleans: (boolean | undefined)[]) {
    this.strs.push(...booleans.map(boolean => boolean === undefined ? "" : (boolean ? "true" : "false")))

    return this;
  }

  static writeArray<T>(items: T[], writer: (item: T) => string[] | StringArrayWriter) { return (new StringArrayWriter).writeArray(items, writer) }

  writeArray<T>(items: T[], writer: (item: T) => string[] | StringArrayWriter) {
    for (const item of items) {
      let res = writer(item);

      if (res instanceof StringArrayWriter)
        res = res.getStringArray();

      this.strs.push(...res);
    }

    return this;
  }

  static writeTaggedArray<T>(items: T[], writer: (item: T) => string[] | StringArrayWriter) { return (new StringArrayWriter).writeTaggedArray(items, writer) }

  writeTaggedArray<T>(items: T[], writer: (item: T) => string[] | StringArrayWriter) {
    this.writeNumbers(items.length);
    this.writeArray(items, writer);

    return this;
  }

  static writeDelimitatedArray<T>(items: T[], deliminator: string, writer: (item: T) => string[] | StringArrayWriter) { return (new StringArrayWriter).writeDelimitatedArray(items, deliminator, writer) }

  writeDelimitatedArray<T>(items: T[], deliminator: string, writer: (item: T) => string[] | StringArrayWriter) {
    const string = items
      .flatMap(item => {
        let res = writer(item);
        
        if (Array.isArray(res))
          return res;

        return res.getStringArray();
      })
      .join(deliminator);

    this.writeStrings(string);

    return this;
  }

  static writeObjects(object: { serialize(): StringArrayWriter }) { return (new StringArrayWriter).writeObject(object) }

  writeObject(object: { serialize(): StringArrayWriter }) {
    this.strs.push(...object.serialize().getStringArray());

    return this;
  }

  static writeObjectArray(objectArray: { serialize(): StringArrayWriter }[]) { return (new StringArrayWriter).writeObjectArray(objectArray) }

  writeObjectArray(objectArray: { serialize(): StringArrayWriter }[]) {
    for (const object of objectArray) {
      this.writeObject(object);
    }

    return this;
  }

  static writeTaggedObjectArray(objectArray: { serialize(): StringArrayWriter }[]) { return (new StringArrayWriter).writeTaggedObjectArray(objectArray) }

  writeTaggedObjectArray(objectArray: { serialize(): StringArrayWriter }[]) {
    this.writeNumbers(objectArray.length);
    this.writeObjectArray(objectArray);

    return this;
  }

  static writeDelimitatedObjectArray(objectArray: { serialize(): StringArrayWriter }[], deliminator: string) { return (new StringArrayWriter).writeDelimitatedObjectArray(objectArray, deliminator) }

  writeDelimitatedObjectArray(objectArray: { serialize(): StringArrayWriter }[], deliminator: string) {
    const string = objectArray
      .flatMap(item => item.serialize())
      .join(deliminator);

    this.writeStrings(string);

    return this;
  }

  static getStringArray(): string[] { return [] }

  getStringArray(): string[] {
    return this.strs;
  }
}
