import { Amf3 } from "../..";
import { BinaryReader } from "../../../utils/binary";
import { CacheTypes, DeserializationContext } from "../../context";
import { Amf3String } from "../string";

export class Amf3Array extends Array<any> {
  static CacheType = CacheTypes.Object;

  static deserialize(reader: BinaryReader, size: number, context: DeserializationContext) {
    // const array = new Amf3Array(size);
    const o: any = {};
    const p: any = {};

    for (const key of reader.readUntil(context.Cacheable(Amf3String), () => s => s.length !== 0)) {
      o[key.toString()] = Amf3.deserializeValue(reader, context);
    }

    for (let i = 0; i < size; i++) {
      p[i] = Amf3.deserializeValue(reader, context);
    }

    return {
      entries: o,
      values: p
    };
  }

  [key: string]: any;
}
