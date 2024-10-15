import { boolean } from "zod";
import { BinaryReader } from "../utils/binary";
import { Cacheable } from "./cacheable";

export enum CacheTypes {
  String,
  Object,
  ClassTrait,
}

import { Amf3String } from "./types/string";

export class DeserializationContext {
  private cacheTable: Map<number, unknown[]> = new Map;

  constructor(
    private externalizableClasses: Record<string, (r: BinaryReader) => any>,
  ) { }

  private readCached<T>(cacheable: Cacheable<T>, cacheIndex: number): T {
    const table = this.cacheTable.get(cacheable.CacheType);

    if (table === undefined)
      throw new Error("Attempted to read a cached " + CacheTypes[cacheable.CacheType] + ", but no cacheTable for this type exists.");

    if (table.length <= cacheIndex || cacheIndex < 0)
      throw new Error("Attempted to read a cached " + CacheTypes[cacheable.CacheType] + ", but the index " + cacheIndex + " was out of bounds [0, " + table.length + ")");

    return table[cacheIndex]! as T;
  }

  Cacheable<T>(cacheable: Cacheable<T>, inHeader?: number) {
    return (reader: BinaryReader) => {
      let header = inHeader ?? reader.readUInt29();

      const isInline = (header & 1) !== 0; header >>= 1;

      if (!isInline)
        return this.readCached<T>(cacheable, header);

      const instance = cacheable.deserialize(reader, header, this);
      let table = this.cacheTable.get(cacheable.CacheType);

      if (table === undefined)
        this.cacheTable.set(cacheable.CacheType, table = []);

      table.push(instance);

      return instance;
    }
  }

  public ExternalizableClass(reader: BinaryReader, className: string) {
    if (!(className in this.externalizableClasses))
      throw new Error("Missing ExternalizableClass for " + className);

    return this.externalizableClasses[className](reader);
  }
}
